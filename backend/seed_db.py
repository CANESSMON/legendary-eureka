import sys
import os

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import engine, get_db
import models

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_password_hash(password):
    return pwd_context.hash(password)

def seed():
    db = next(get_db())
    
    # Check if we already have users
    if db.query(models.User).first():
        print("Database already has users. Skipping seed.")
        return

    print("Seeding database...")
    
    # Create SUPER ADMIN
    admin = models.User(
        email="admin@jobportal.com",
        password_hash=get_password_hash("Admin@123"),
        full_name="Super Admin",
        role=models.RoleEnum.SUPER_USER
    )
    db.add(admin)

    # Create AGENT
    agent = models.User(
        email="agent@jobportal.com",
        password_hash=get_password_hash("Agent@123"),
        full_name="Premium Agent",
        role=models.RoleEnum.AGENT
    )
    db.add(agent)
    db.commit() # commit to get agent ID

    agent_profile = models.AgentProfile(
        user_id=agent.id,
        referral_code="AGENT-IND-00001"
    )
    db.add(agent_profile)
    
    # Create EMPLOYER (Using the agent's referral code)
    employer = models.User(
        email="employer@jobportal.com",
        password_hash=get_password_hash("Employer@123"),
        full_name="Tech Corp HR",
        role=models.RoleEnum.EMPLOYER
    )
    db.add(employer)
    db.commit() # commit to get employer ID
    
    employer_profile = models.EmployerProfile(
        user_id=employer.id,
        company_name="Tech Corp HR",
        referred_by_id=agent_profile.id,
        is_verified=False # Requires admin verification
    )
    db.add(employer_profile)
    
    # Create JOB SEEKER
    candidate = models.User(
        email="candidate@jobportal.com",
        password_hash=get_password_hash("Candidate@123"),
        full_name="John Doe",
        role=models.RoleEnum.JOB_SEEKER
    )
    db.add(candidate)
    
    db.commit()
    print("Seed complete!")
    print("\n--- TEST CREDENTIALS ---")
    print("1. Admin: admin@jobportal.com / Admin@123")
    print("2. Agent: agent@jobportal.com / Agent@123 (Referral Code: AGENT-IND-00001)")
    print("3. Employer: employer@jobportal.com / Employer@123")
    print("4. Candidate: candidate@jobportal.com / Candidate@123")

if __name__ == "__main__":
    seed()
