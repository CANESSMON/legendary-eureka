import sys
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from config import DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD

def create_admin():
    db: Session = SessionLocal()
    email = DEFAULT_ADMIN_EMAIL
    password = DEFAULT_ADMIN_PASSWORD
    
    # Check if admin already exists
    existing_admin = db.query(models.User).filter(models.User.email == email).first()
    if existing_admin:
        print(f"Admin with email {email} already exists.")
        return
        
    hashed_password = pwd_context.hash(password)
    
    admin_user = models.User(
        email=email,
        password_hash=hashed_password,
        full_name="Super Admin",
        role=models.RoleEnum.SUPER_USER
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    print(f"Successfully created Super Admin: {email} / {password}")
    db.close()

if __name__ == "__main__":
    create_admin()
