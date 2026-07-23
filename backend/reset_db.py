from database import engine
import models
from seed_db import seed

print("Dropping all existing database tables...")
models.Base.metadata.drop_all(bind=engine)

print("Recreating database tables with new columns...")
models.Base.metadata.create_all(bind=engine)

print("Seeding database with updated test users...")
seed()

print("Database reset and seeded successfully!")
