import sqlite3
conn = sqlite3.connect('data/locations.db')
c = conn.cursor()

print('=== TABLE COUNTS ===')
print('States:', c.execute('SELECT COUNT(*) FROM states').fetchone()[0])
print('Districts:', c.execute('SELECT COUNT(*) FROM districts').fetchone()[0])
print('Places:', c.execute('SELECT COUNT(*) FROM places').fetchone()[0])
print('Pincodes:', c.execute('SELECT COUNT(*) FROM pincodes').fetchone()[0])

print('\n=== TOP 5 CITIES BY POPULATION ===')
for r in c.execute('SELECT ascii_name, city, state, population FROM places ORDER BY population DESC LIMIT 5'):
    print(f'  {r[0]:20s} | city={r[1]:15s} | state={r[2]:20s} | pop={r[3]}')

print('\n=== SAMPLE PINCODES (with area) ===')
for r in c.execute("SELECT pincode, area, city, state FROM pincodes WHERE area != '' LIMIT 10"):
    print(f'  {r[0]} | area={r[1]:20s} | city={r[2]:15s} | state={r[3]}')

print('\n=== SEARCH: "Sadar" ===')
for r in c.execute("SELECT ascii_name, city, state, population FROM places WHERE ascii_name LIKE 'Sadar%' ORDER BY population DESC LIMIT 5"):
    print(f'  {r[0]:20s} | city={r[1]:15s} | state={r[2]:20s} | pop={r[3]}')

print('\n=== SEARCH: pincode 440001 ===')
for r in c.execute("SELECT pincode, area, city, state FROM pincodes WHERE pincode='440001'"):
    print(f'  {r[0]} | area={r[1]:20s} | city={r[2]:15s} | state={r[3]}')

print('\n=== SEARCH: "Nagpur" places ===')
for r in c.execute("SELECT ascii_name, city, state, population FROM places WHERE ascii_name LIKE 'Nagpur%' ORDER BY population DESC LIMIT 5"):
    print(f'  {r[0]:20s} | city={r[1]:15s} | state={r[2]:20s} | pop={r[3]}')

conn.close()
