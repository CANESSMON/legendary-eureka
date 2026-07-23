"""
seed_db.py — Inserts canonical test data from seed_data.py into the database.
Run directly:   python seed_db.py
Called by:       reset_db.py  (drop → create → seed)
"""

from datetime import datetime, timedelta
import random

from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import engine, get_db
import models
from seed_data import ADMIN, AGENTS, EMPLOYERS, JOB_POSTINGS

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def seed():
    db: Session = next(get_db())

    # Guard: skip if data already exists
    if db.query(models.User).first():
        print("Database already has users — skipping seed.")
        return

    print("Seeding database …")

    # ── 1. Super Admin ───────────────────────────────────────────────────────
    admin_user = models.User(
        email=ADMIN["email"],
        password_hash=get_password_hash(ADMIN["password"]),
        full_name=ADMIN["full_name"],
        role=models.RoleEnum.SUPER_USER,
        created_at=datetime.utcnow() - timedelta(days=90),
    )
    db.add(admin_user)
    db.flush()

    # ── 2. Agents ────────────────────────────────────────────────────────────
    agent_profiles = []   # indexed 0, 1 — matches EMPLOYERS[x]["agent_index"]

    for i, agent_data in enumerate(AGENTS):
        agent_user = models.User(
            email=agent_data["email"],
            password_hash=get_password_hash(agent_data["password"]),
            full_name=agent_data["full_name"],
            role=models.RoleEnum.AGENT,
            created_at=datetime.utcnow() - timedelta(days=60 - i * 10),
        )
        db.add(agent_user)
        db.flush()

        profile = models.AgentProfile(
            user_id=agent_user.id,
            referral_code=agent_data["referral_code"],
            phone=agent_data.get("phone"),
            dob=agent_data.get("dob"),
            profile_pic=agent_data.get("profile_pic"),
            doc_type=agent_data.get("doc_type"),
            doc_number=agent_data.get("doc_number"),
            payout_type=agent_data.get("payout_type"),
            upi_id=agent_data.get("upi_id"),
            bank_name=agent_data.get("bank_name"),
            account_holder=agent_data.get("account_holder"),
            account_number=agent_data.get("account_number"),
            ifsc_code=agent_data.get("ifsc_code"),
            micr_code=agent_data.get("micr_code"),
        )
        db.add(profile)
        db.flush()
        agent_profiles.append(profile)

    # ── 3. Employers (12) ────────────────────────────────────────────────────
    employer_profiles = []   # indexed 0–11

    for idx, emp_data in enumerate(EMPLOYERS):
        # Stagger join dates so the dashboard shows variation
        days_ago = random.randint(5, 45)
        emp_user = models.User(
            email=emp_data["email"],
            password_hash=get_password_hash(emp_data["password"]),
            full_name=emp_data["full_name"],
            role=models.RoleEnum.EMPLOYER,
            created_at=datetime.utcnow() - timedelta(days=days_ago),
        )
        db.add(emp_user)
        db.flush()

        agent_ref = agent_profiles[emp_data["agent_index"]]

        emp_profile = models.EmployerProfile(
            user_id=emp_user.id,
            company_name=emp_data["company_name"],
            industry=emp_data.get("industry", "Information Technology"),
            city=emp_data.get("city", "Bangalore"),
            whatsapp_number=emp_data.get("whatsapp_number", "+919876543210"),
            logo=emp_data.get("logo"),
            address=emp_data.get("address"),
            is_verified=emp_data.get("is_verified", True),
            status="Active",
            referred_by_id=agent_ref.id,
        )
        db.add(emp_profile)
        db.flush()
        employer_profiles.append(emp_profile)

    # ── 4. Job Postings (5 per employer = 60 total) ──────────────────────────
    total_jobs = 0
    for emp_idx, emp_profile in enumerate(employer_profiles):
        jobs = JOB_POSTINGS.get(emp_idx, [])
        emp_data = EMPLOYERS[emp_idx]

        for j, job in enumerate(jobs):
            # Stagger created_at so listings aren't all on the same date
            days_offset = random.randint(1, 30)
            views = str(random.randint(20, 500))
            applications = str(random.randint(2, 80))

            posting = models.JobPosting(
                title=job["title"],
                company=emp_data["company_name"],
                location=emp_data.get("city", "Bangalore"),
                salary=job["salary"],
                type=job.get("type", "Full-time"),
                category=job["category"],
                description=job.get("description", ""),
                requirements=job.get("requirements", ""),
                is_urgent=job.get("is_urgent", False),
                is_featured=job.get("is_featured", False),
                status="Active",
                views_count=views,
                applications_count=applications,
                employer_id=emp_profile.id,
                created_at=datetime.utcnow() - timedelta(days=days_offset),
            )
            db.add(posting)
            total_jobs += 1

    db.commit()

    # ── Summary ──────────────────────────────────────────────────────────────
    print(f"\n[OK] Seed complete!")
    print(f"  - 1 admin")
    print(f"  - {len(AGENTS)} agents")
    print(f"  - {len(EMPLOYERS)} employers")
    print(f"  - {total_jobs} job postings")
    print()
    print("--- TEST CREDENTIALS -----------------------------------------")
    print(f"  Admin    : {ADMIN['email']} / {ADMIN['password']}")
    for a in AGENTS:
        print(f"  Agent    : {a['email']} / {a['password']}  (Code: {a['referral_code']})")
    for e in EMPLOYERS:
        print(f"  Employer : {e['email']} / {e['password']}  ({e['company_name']})")
    print("--------------------------------------------------------------")


if __name__ == "__main__":
    seed()
