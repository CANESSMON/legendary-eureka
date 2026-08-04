"""
Extract location data from GeoNames IN.txt and OSM PBF file.
Creates a SQLite database: locations.db

Phase A: Read IN.txt for admin hierarchy (states, districts, places)
Phase B: Read OSM PBF for pincode → location mappings
"""

import csv
import sqlite3
import os
import sys
import time

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
IN_TXT = os.path.join(DATA_DIR, "IN.txt")
OSM_PBF = os.path.join(DATA_DIR, "india-260726.osm.pbf")
DB_PATH = os.path.join(DATA_DIR, "locations.db")


def create_db(conn):
    """Create the database schema."""
    cur = conn.cursor()
    cur.executescript("""
        DROP TABLE IF EXISTS places;
        DROP TABLE IF EXISTS pincodes;
        DROP TABLE IF EXISTS states;
        DROP TABLE IF EXISTS districts;

        CREATE TABLE states (
            admin1_code TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE districts (
            admin1_code TEXT NOT NULL,
            admin2_code TEXT NOT NULL,
            name TEXT NOT NULL,
            PRIMARY KEY (admin1_code, admin2_code)
        );

        CREATE TABLE places (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            ascii_name TEXT,
            city TEXT,
            district TEXT,
            state TEXT,
            pincode TEXT,
            type TEXT,
            lat REAL,
            lon REAL,
            population INTEGER DEFAULT 0
        );

        CREATE TABLE pincodes (
            pincode TEXT NOT NULL,
            area TEXT,
            city TEXT,
            district TEXT,
            state TEXT,
            lat REAL,
            lon REAL,
            PRIMARY KEY (pincode, area)
        );
    """)
    conn.commit()


def phase_a_geonames(conn):
    """Extract place hierarchy from GeoNames IN.txt."""
    print("[Phase A] Reading GeoNames IN.txt ...")
    start = time.time()

    cur = conn.cursor()

    # ── Pass 1: Extract admin divisions (states, districts) ──
    states = {}       # admin1_code → state_name
    districts = {}    # (admin1_code, admin2_code) → district_name

    places_batch = []
    total_rows = 0

    with open(IN_TXT, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t')
        for row in reader:
            if len(row) < 18:
                continue
            total_rows += 1

            geonameid = row[0]
            name = row[1]
            ascii_name = row[2]
            lat = float(row[4]) if row[4] else None
            lon = float(row[5]) if row[5] else None
            feature_class = row[6]
            feature_code = row[7]
            country_code = row[8]
            admin1 = row[10]
            admin2 = row[11]
            population = int(row[14]) if row[14] and row[14].isdigit() else 0

            if country_code != 'IN':
                continue

            # Collect states (ADM1)
            if feature_class == 'A' and feature_code == 'ADM1':
                states[admin1] = ascii_name
                cur.execute(
                    "INSERT OR REPLACE INTO states (admin1_code, name) VALUES (?, ?)",
                    (admin1, ascii_name)
                )

            # Collect districts (ADM2)
            if feature_class == 'A' and feature_code == 'ADM2':
                districts[(admin1, admin2)] = ascii_name
                cur.execute(
                    "INSERT OR REPLACE INTO districts (admin1_code, admin2_code, name) VALUES (?, ?, ?)",
                    (admin1, admin2, ascii_name)
                )

    conn.commit()
    print(f"  Found {len(states)} states, {len(districts)} districts from {total_rows} rows")

    # ── Pass 2: Extract populated places and map to hierarchy ──
    print("  Pass 2: Extracting populated places ...")
    place_count = 0

    with open(IN_TXT, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter='\t')
        for row in reader:
            if len(row) < 18:
                continue

            feature_class = row[6]
            country_code = row[8]

            if country_code != 'IN':
                continue

            # Only populated places
            if feature_class != 'P':
                continue

            geonameid = int(row[0])
            name = row[1]
            ascii_name = row[2]
            lat = float(row[4]) if row[4] else None
            lon = float(row[5]) if row[5] else None
            feature_code = row[7]
            admin1 = row[10]
            admin2 = row[11]
            population = int(row[14]) if row[14] and row[14].isdigit() else 0

            state_name = states.get(admin1, '')
            district_name = districts.get((admin1, admin2), '')

            # For places, the "city" is typically the district or the place itself if it's a major city
            # We use the district name as the broader city/area
            city = district_name if district_name else ''

            # Map feature codes to type
            type_map = {
                'PPLC': 'capital',
                'PPLA': 'admin_center',
                'PPLA2': 'admin_center_2',
                'PPLA3': 'admin_center_3',
                'PPLA4': 'admin_center_4',
                'PPL': 'populated_place',
                'PPLX': 'section',  # section of populated place (neighborhood/area)
                'PPLL': 'populated_locality',
                'PPLQ': 'abandoned',
                'PPLR': 'religious',
                'PPLS': 'places',
            }
            place_type = type_map.get(feature_code, 'other')

            places_batch.append((
                geonameid, name, ascii_name, city, district_name,
                state_name, None, place_type, lat, lon, population
            ))

            if len(places_batch) >= 10000:
                cur.executemany(
                    """INSERT OR REPLACE INTO places 
                       (id, name, ascii_name, city, district, state, pincode, type, lat, lon, population)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    places_batch
                )
                conn.commit()
                place_count += len(places_batch)
                places_batch = []

    # Insert remaining
    if places_batch:
        cur.executemany(
            """INSERT OR REPLACE INTO places 
               (id, name, ascii_name, city, district, state, pincode, type, lat, lon, population)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            places_batch
        )
        conn.commit()
        place_count += len(places_batch)

    elapsed = time.time() - start
    print(f"  Extracted {place_count} places in {elapsed:.1f}s")
    return states, districts


def phase_b_osm_pincodes(conn, states, districts):
    """Extract pincode → location mappings from OSM PBF file."""
    print(f"\n[Phase B] Parsing OSM PBF for pincodes: {OSM_PBF}")
    print(f"  File size: {os.path.getsize(OSM_PBF) / (1024**3):.2f} GB")
    print("  This may take 5-15 minutes ...")

    try:
        import osmium
    except ImportError:
        print("  ERROR: osmium not installed. Skipping PBF extraction.")
        return

    start = time.time()
    cur = conn.cursor()

    class PincodeHandler(osmium.SimpleHandler):
        def __init__(self):
            super().__init__()
            self.pincodes = {}  # pincode → {area, city, state, lat, lon}
            self.count = 0
            self.node_count = 0

        def _process_tags(self, tags, lat=None, lon=None):
            pincode = tags.get('addr:postcode') or tags.get('postal_code')
            if not pincode:
                return
            
            # Clean pincode
            pincode = pincode.strip()
            if not pincode.isdigit() or len(pincode) != 6:
                return

            area = tags.get('addr:suburb') or tags.get('addr:neighbourhood') or tags.get('addr:locality') or ''
            city = tags.get('addr:city') or tags.get('addr:town') or tags.get('addr:village') or ''
            district = tags.get('addr:district') or ''
            state = tags.get('addr:state') or ''

            key = (pincode, area if area else city)
            if key not in self.pincodes:
                self.pincodes[key] = {
                    'pincode': pincode,
                    'area': area,
                    'city': city,
                    'district': district,
                    'state': state,
                    'lat': lat,
                    'lon': lon
                }
                self.count += 1

        def node(self, n):
            self.node_count += 1
            if self.node_count % 5000000 == 0:
                print(f"    Processed {self.node_count // 1000000}M nodes, found {self.count} pincode entries ...")
            
            if n.tags:
                self._process_tags(n.tags, n.location.lat, n.location.lon)

        def way(self, w):
            if w.tags:
                self._process_tags(w.tags)

        def relation(self, r):
            if r.tags:
                self._process_tags(r.tags)

    handler = PincodeHandler()
    handler.apply_file(OSM_PBF, locations=True)

    # Insert into database
    batch = []
    for key, data in handler.pincodes.items():
        batch.append((
            data['pincode'], data['area'], data['city'],
            data['district'], data['state'], data['lat'], data['lon']
        ))

    if batch:
        cur.executemany(
            """INSERT OR REPLACE INTO pincodes 
               (pincode, area, city, district, state, lat, lon)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            batch
        )
        conn.commit()

    elapsed = time.time() - start
    print(f"  Extracted {len(batch)} pincode entries in {elapsed:.1f}s")


def create_indexes(conn):
    """Create indexes for fast lookups."""
    print("\n[Indexing] Creating search indexes ...")
    cur = conn.cursor()
    cur.executescript("""
        CREATE INDEX IF NOT EXISTS idx_places_name ON places(name COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_places_ascii ON places(ascii_name COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_places_city ON places(city COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_places_state ON places(state COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_places_district ON places(district COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_places_pincode ON places(pincode);
        CREATE INDEX IF NOT EXISTS idx_places_population ON places(population DESC);
        CREATE INDEX IF NOT EXISTS idx_pincodes_pincode ON pincodes(pincode);
        CREATE INDEX IF NOT EXISTS idx_pincodes_area ON pincodes(area COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS idx_pincodes_city ON pincodes(city COLLATE NOCASE);
    """)
    conn.commit()
    print("  Done.")


def print_stats(conn):
    """Print database statistics."""
    cur = conn.cursor()
    print("\n═══════════════════════════════════════")
    print("         DATABASE STATISTICS          ")
    print("═══════════════════════════════════════")

    for table in ['states', 'districts', 'places', 'pincodes']:
        count = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  {table:12s}: {count:>8,} rows")

    # Sample data
    print("\n  Sample places (top 5 by population):")
    rows = cur.execute(
        "SELECT name, city, state, population FROM places ORDER BY population DESC LIMIT 5"
    ).fetchall()
    for r in rows:
        print(f"    {r[0]:20s} | {r[1]:15s} | {r[2]:15s} | pop: {r[3]:>10,}")

    print("\n  Sample pincodes:")
    rows = cur.execute(
        "SELECT pincode, area, city, state FROM pincodes LIMIT 5"
    ).fetchall()
    for r in rows:
        print(f"    {r[0]} | {r[1]:20s} | {r[2]:15s} | {r[3]}")

    db_size = os.path.getsize(DB_PATH) / (1024 * 1024)
    print(f"\n  Database size: {db_size:.1f} MB")
    print("═══════════════════════════════════════")


def main():
    # Check input files
    if not os.path.exists(IN_TXT):
        print(f"ERROR: {IN_TXT} not found!")
        sys.exit(1)

    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed existing {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=NORMAL")

    try:
        create_db(conn)
        states, districts = phase_a_geonames(conn)

        if os.path.exists(OSM_PBF):
            phase_b_osm_pincodes(conn, states, districts)
        else:
            print(f"\n[Phase B] SKIPPED — {OSM_PBF} not found")

        create_indexes(conn)
        print_stats(conn)

        print(f"\n✓ Location database created: {DB_PATH}")

    finally:
        conn.close()


if __name__ == '__main__':
    main()
