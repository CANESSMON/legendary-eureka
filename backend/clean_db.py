import bcrypt
import models
from database import engine, SessionLocal
from config import DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD

print("1. Dropping all existing database tables...")
models.Base.metadata.drop_all(bind=engine)

print("2. Recreating clean database tables...")
models.Base.metadata.create_all(bind=engine)

print("3. Creating default Super Admin user...")
db = SessionLocal()
try:
    admin_user = models.User(
        email=DEFAULT_ADMIN_EMAIL,
        password_hash=bcrypt.hashpw(DEFAULT_ADMIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        full_name="Super Admin",
        role=models.RoleEnum.SUPER_USER
    )
    db.add(admin_user)
    db.commit()
    print(f"Super Admin created successfully: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}")
finally:
    db.close()

print("Clean database initialization completed successfully!")
