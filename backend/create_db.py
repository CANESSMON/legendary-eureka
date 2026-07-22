import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

try:
    # Connect to the default 'postgres' database
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/postgres")
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Try creating the database
    cursor.execute("CREATE DATABASE jobportal;")
    print("Database 'jobportal' created successfully!")
    
    cursor.close()
    conn.close()
except psycopg2.errors.DuplicateDatabase:
    print("Database 'jobportal' already exists!")
except Exception as e:
    print(f"Error creating database: {e}")
    sys.exit(1)
