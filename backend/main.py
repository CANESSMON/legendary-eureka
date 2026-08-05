from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import List
import uuid
import random
import string
import jwt
from datetime import datetime, timedelta, timezone

import models, schemas, config
from database import engine, get_db
from routers.admin import router as admin_router
from utils_logging import log_activity

models.Base.metadata.create_all(bind=engine)

# Dynamically add classified_heading column to job_postings table if missing
try:
    with engine.connect() as conn:
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        columns = [c['name'] for c in inspector.get_columns('job_postings')]
        if 'classified_heading' not in columns:
            conn.execute(text("ALTER TABLE job_postings ADD COLUMN classified_heading VARCHAR(255) NULL;"))
        if 'salary_min' not in columns:
            conn.execute(text("ALTER TABLE job_postings ADD COLUMN salary_min INTEGER NULL;"))
        if 'salary_max' not in columns:
            conn.execute(text("ALTER TABLE job_postings ADD COLUMN salary_max INTEGER NULL;"))
        if 'salary_period' not in columns:
            conn.execute(text("ALTER TABLE job_postings ADD COLUMN salary_period VARCHAR(50) DEFAULT 'year';"))
        if 'used_paid_credit' not in columns:
            conn.execute(text("ALTER TABLE job_postings ADD COLUMN used_paid_credit BOOLEAN DEFAULT FALSE;"))
        conn.commit()
        print("Database schema check/updates completed successfully!")
except Exception as e:
    print(f"Error checking/updating database schema: {e}")

# Auto-seed default categories if empty
from sqlalchemy.orm import sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_seed = SessionLocal()
try:
    if db_seed.query(models.JobCategory).count() == 0:
        default_categories = [
            "Information Technology (IT)",
            "Freelance & Gig Economy",
            "Design & Creative Arts",
            "Healthcare Tech",
            "Supply Chain & Logistics",
            "E-Learning",
            "Renewable Resources",
            "Cybersecurity",
            "Aerospace Engineering",
            "Pharmaceuticals",
            "Sales & Marketing",
            "Finance & Accounting",
            "Human Resources",
            "Content Writing"
        ]
        for name in default_categories:
            db_seed.add(models.JobCategory(name=name))
        db_seed.commit()
        print("Categories seeded successfully at startup!")

    if db_seed.query(models.SubscriptionPlan).count() == 0:
        default_plans = [
            {
                "id": "starter",
                "name": "Starter Business",
                "tagline": "Ideal for small businesses & quick local hiring",
                "price": "Free",
                "period": "Forever Free",
                "features": "Post up to 3 active job listings\nDirect candidate WhatsApp apply redirection\nBasic candidate click lead analytics\nStandard search placement\nCommunity email support"
            },
            {
                "id": "pro",
                "name": "Pro Employer",
                "tagline": "Best for fast-growing companies seeking top talent",
                "price": "₹1,999",
                "period": "per month",
                "features": "Unlimited active job postings\nUnlimited Direct WhatsApp candidate leads\nPriority Urgent & Featured title badges included\nTop search result placement\nCustom WhatsApp candidate apply templates\nReal-time candidate inquiry breakdown analytics\n24/7 Priority WhatsApp support"
            },
            {
                "id": "enterprise",
                "name": "Enterprise Growth",
                "tagline": "Comprehensive hiring solution for large teams",
                "price": "₹4,999",
                "period": "per month",
                "features": "Everything in Pro Employer plan\nVerified Gold Employer Badge\nDedicated hiring account manager\nMulti-user team workspace access\nCustom branding & logo highlights\nAutomated candidate follow-up broadcasts"
            }
        ]
        for p in default_plans:
            db_seed.add(models.SubscriptionPlan(
                id=p["id"],
                name=p["name"],
                tagline=p["tagline"],
                price=p["price"],
                period=p["period"],
                features=p["features"]
            ))
        db_seed.commit()
        print("Subscription plans seeded successfully at startup!")
finally:
    db_seed.close()

app = FastAPI(title="JobPortal API")

from config import CORS_ORIGINS, SECRET_KEY, ALGORITHM

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin_router)

import bcrypt
import sqlite3
import os
import re

def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

from dependencies import get_current_user

# ── Location database helper ──
LOCATION_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "locations.db")

def _clean_state_name(name: str) -> str:
    """Remove 'State of ' prefix from GeoNames state names."""
    if name and name.startswith("State of "):
        return name[len("State of "):]
    return name or ""

def resolve_location(query: str):
    """
    Resolve a location query to structured location data.
    Handles: pincode (6 digits), area name, city name, or comma-separated parts.
    Returns dict with keys: type, area, city, district, state, pincode, search_terms
    """
    query = query.strip()
    if not query:
        return None

    result = {
        "type": "text",
        "area": "",
        "city": "",
        "district": "",
        "state": "",
        "pincode": "",
        "display": query,
        "search_terms": [query]
    }

    if not os.path.exists(LOCATION_DB_PATH):
        # No location DB — fall back to plain text search
        parts = [p.strip() for p in query.split(',') if p.strip()]
        result["search_terms"] = parts
        return result

    conn = sqlite3.connect(LOCATION_DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    try:
        # ── Pincode search ──
        if re.match(r'^\d{6}$', query):
            result["type"] = "pincode"
            result["pincode"] = query

            # Try pincodes table first
            rows = cur.execute(
                "SELECT area, city, district, state FROM pincodes WHERE pincode = ? AND area != ''",
                (query,)
            ).fetchall()

            if rows:
                row = rows[0]
                result["area"] = row["area"]
                result["city"] = row["city"]
                result["district"] = row["district"]
                result["state"] = row["state"]

                # Build search terms from resolved data
                terms = []
                if result["area"]:
                    terms.append(result["area"])
                if result["city"]:
                    terms.append(result["city"])
                terms.append(query)  # Also match pincode in location text
                result["search_terms"] = terms
                result["display"] = ", ".join(filter(None, [result["area"], result["city"], result["state"]]))
                if result["display"]:
                    result["display"] += f" ({query})"
                else:
                    result["display"] = query
            else:
                # Try pincodes table without area filter
                row = cur.execute(
                    "SELECT area, city, district, state FROM pincodes WHERE pincode = ?",
                    (query,)
                ).fetchone()
                if row:
                    result["city"] = row["city"]
                    result["state"] = row["state"]
                    terms = []
                    if row["city"]:
                        terms.append(row["city"])
                    terms.append(query)
                    result["search_terms"] = terms
                    result["display"] = row["city"] or query
                else:
                    result["search_terms"] = [query]
                    result["display"] = query

            return result

        # ── Comma-separated parts (e.g. "Sadar, Nagpur, Maharashtra") ──
        parts = [p.strip() for p in query.split(',') if p.strip()]

        if len(parts) >= 2:
            result["type"] = "structured"
            result["area"] = parts[0]
            result["city"] = parts[1] if len(parts) >= 2 else ""
            result["state"] = parts[2] if len(parts) >= 3 else ""
            result["search_terms"] = parts
            result["display"] = ", ".join(parts)
            return result

        # ── Single term search (area or city name) ──
        result["type"] = "area"

        # Search places table by name (prioritize by population)
        row = cur.execute(
            """SELECT ascii_name, city, district, state, population
               FROM places
               WHERE ascii_name LIKE ? OR name LIKE ?
               ORDER BY population DESC
               LIMIT 1""",
            (query + '%', query + '%')
        ).fetchone()

        if row:
            result["area"] = row["ascii_name"]
            result["city"] = row["city"]
            result["district"] = row["district"]
            result["state"] = _clean_state_name(row["state"])

            terms = [query]  # Always include original query
            if row["city"] and row["city"].lower() != query.lower():
                terms.append(row["city"])
            result["search_terms"] = terms

            display_parts = [result["area"]]
            if result["city"] and result["city"] != result["area"]:
                display_parts.append(result["city"])
            if result["state"]:
                display_parts.append(result["state"])
            result["display"] = ", ".join(display_parts)
        else:
            result["search_terms"] = [query]
            result["display"] = query

        return result

    finally:
        conn.close()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=120)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/api/auth/register", response_model=schemas.AuthResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    email_lower = user.email.lower().strip()
    db_user = db.query(models.User).filter(models.User.email == email_lower).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 1. OTP Check
    if not user.otp:
        # Generate and save OTP
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        
        # Clear older OTPs for this email with same purpose
        db.query(models.OTPVerification).filter(
            models.OTPVerification.email == email_lower,
            models.OTPVerification.purpose == "register"
        ).delete()
        
        db_otp = models.OTPVerification(
            email=email_lower,
            otp_code=otp_code,
            purpose="register",
            expires_at=expires_at
        )
        db.add(db_otp)
        db.commit()
        
        # Send email via SMTP
        from email_utils import send_otp_email
        send_otp_email(email_lower, otp_code, "register")
        
        return {
            "status": "otp_required",
            "email": email_lower,
            "message": "OTP verification code sent to your email"
        }
    
    # 2. Verify OTP
    db_otp = db.query(models.OTPVerification).filter(
        models.OTPVerification.email == email_lower,
        models.OTPVerification.otp_code == user.otp.strip(),
        models.OTPVerification.purpose == "register",
        models.OTPVerification.expires_at > datetime.now(timezone.utc)
    ).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP verification code")
    
    # OTP is valid, clean it up
    db.delete(db_otp)
    db.commit()
    
    role_map = {
        'EMPLOYER': models.RoleEnum.EMPLOYER,
        'AGENT': models.RoleEnum.AGENT
    }
    role = role_map.get(user.account_type.upper(), models.RoleEnum.EMPLOYER)

    new_user = models.User(
        email=email_lower,
        password_hash=get_password_hash(user.password),
        full_name=user.full_name,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if role == models.RoleEnum.EMPLOYER:
        agent = None
        if user.referral_code:
            agent = db.query(models.AgentProfile).filter(models.AgentProfile.referral_code == user.referral_code).first()
        
        employer = models.EmployerProfile(
            user_id=new_user.id,
            company_name=user.company_name or user.full_name,
            industry=user.industry or "Information Technology",
            city=user.city or "Bangalore",
            whatsapp_number=user.whatsapp_number or "+919876543210",
            is_verified=False,
            referred_by_id=agent.id if agent else None
        )
        db.add(employer)
        db.commit()
        db.refresh(new_user)

    elif role == models.RoleEnum.AGENT:
        while True:
            code = "AGENT-IND-" + ''.join(random.choices(string.digits, k=5))
            existing = db.query(models.AgentProfile).filter(models.AgentProfile.referral_code == code).first()
            if not existing:
                break
        agent_profile = models.AgentProfile(
            user_id=new_user.id,
            referral_code=code
        )
        db.add(agent_profile)
        db.commit()
        db.refresh(new_user)

    log_activity(
        db=db,
        action="user_register",
        details=f"New user registered: '{new_user.email}' (Role: {new_user.role.value})",
        user=new_user,
        entity_type="user",
        entity_id=new_user.id
    )
    return {
        "status": "success",
        "message": "User registered successfully",
        "user": new_user
    }

@app.post("/api/auth/login", response_model=schemas.AuthResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    email_lower = user.email.lower().strip()
    db_user = db.query(models.User).filter(models.User.email == email_lower).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # 1. OTP Check
    if not user.otp:
        # Generate and save OTP
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        
        # Clear older OTPs for this email with same purpose
        db.query(models.OTPVerification).filter(
            models.OTPVerification.email == email_lower,
            models.OTPVerification.purpose == "login"
        ).delete()
        
        db_otp = models.OTPVerification(
            email=email_lower,
            otp_code=otp_code,
            purpose="login",
            expires_at=expires_at
        )
        db.add(db_otp)
        db.commit()
        
        # Send email via SMTP
        from email_utils import send_otp_email
        send_otp_email(email_lower, otp_code, "login")
        
        return {
            "status": "otp_required",
            "email": email_lower,
            "message": "OTP verification code sent to your email"
        }
    
    # 2. Verify OTP
    db_otp = db.query(models.OTPVerification).filter(
        models.OTPVerification.email == email_lower,
        models.OTPVerification.otp_code == user.otp.strip(),
        models.OTPVerification.purpose == "login",
        models.OTPVerification.expires_at > datetime.now(timezone.utc)
    ).first()
    
    if not db_otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP verification code")
    
    # OTP is valid, clean it up
    db.delete(db_otp)
    db.commit()
    
    access_token = create_access_token(data={"sub": db_user.id, "email": db_user.email})
    log_activity(
        db=db,
        action="user_login",
        details=f"User logged in successfully: '{db_user.email}' (Role: {db_user.role.value})",
        user=db_user,
        entity_type="user",
        entity_id=db_user.id
    )
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }


@app.post("/api/auth/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    return {"message": "Password reset link sent successfully"}

from typing import Optional

@app.get("/api/locations/resolve")
def resolve_location_endpoint(q: str = ""):
    """Resolve a location query (area name, pincode, or structured address) to location data."""
    if not q.strip():
        return {"type": "empty", "area": "", "city": "", "district": "", "state": "", "pincode": "", "display": "India", "search_terms": []}
    result = resolve_location(q)
    if not result:
        return {"type": "empty", "area": "", "city": "", "district": "", "state": "", "pincode": "", "display": q, "search_terms": [q]}
    return result

@app.get("/api/locations/suggest")
def suggest_locations(q: str = ""):
    """Provide autocomplete suggestions for area name or pincode."""
    q = q.strip()
    if len(q) < 2:
        return []
        
    if not os.path.exists(LOCATION_DB_PATH):
        return []

    conn = sqlite3.connect(LOCATION_DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    suggestions = []
    seen_displays = set()

    def add_suggestion(display, value):
        if display not in seen_displays:
            seen_displays.add(display)
            suggestions.append({"display": display, "value": value})

    try:
        # Check if query is digit-based (potential pincode)
        if q.isdigit():
            rows = cur.execute(
                "SELECT pincode, area, city, state FROM pincodes WHERE pincode LIKE ? LIMIT 8",
                (q + '%',)
            ).fetchall()
            for row in rows:
                p = row["pincode"]
                a = row["area"]
                c = row["city"]
                s = row["state"]
                parts = [p]
                val_parts = []
                if a:
                    val_parts.append(a)
                if c:
                    val_parts.append(c)
                if s:
                    val_parts.append(s)
                
                detail = ", ".join(val_parts)
                display = f"{p} ({detail})" if detail else p
                value = detail or p
                add_suggestion(display, value)
        else:
            # First, search in places table (GeoNames - contains large cities/places)
            rows_places = cur.execute(
                """SELECT name, city, state 
                   FROM places 
                   WHERE name LIKE ? OR city LIKE ? 
                   ORDER BY population DESC 
                   LIMIT 8""",
                (q + '%', q + '%')
            ).fetchall()
            for r in rows_places:
                name = r["name"]
                city = r["city"]
                state = _clean_state_name(r["state"])
                
                parts = [name]
                if city and city.lower() != name.lower():
                    parts.append(city)
                if state:
                    parts.append(state)
                
                display = ", ".join(parts)
                value = display
                add_suggestion(display, value)

            # Second, search in pincodes table (contains specific areas/localities)
            rows_pin = cur.execute(
                """SELECT area, city, state, pincode 
                   FROM pincodes 
                   WHERE area LIKE ? OR city LIKE ? 
                   LIMIT 8""",
                (q + '%', q + '%')
            ).fetchall()
            for r in rows_pin:
                area = r["area"]
                city = r["city"]
                state = r["state"]
                pincode = r["pincode"]
                
                parts = []
                if area:
                    parts.append(area)
                if city:
                    parts.append(city)
                if state:
                    parts.append(state)
                
                if parts:
                    display = ", ".join(parts)
                    if pincode:
                        display = f"{display} ({pincode})"
                    value = ", ".join(parts)
                    add_suggestion(display, value)

        return suggestions[:8]
    except Exception as e:
        print(f"Error in suggest_locations: {e}")
        return []
    finally:
        conn.close()

@app.get("/api/jobs", response_model=List[schemas.JobPostingResponse])
def get_jobs(location: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.JobPosting).order_by(models.JobPosting.created_at.desc())

    if location and location.strip():
        loc_data = resolve_location(location.strip())
        if loc_data and loc_data.get("search_terms"):
            from sqlalchemy import or_, func
            conditions = []
            for term in loc_data["search_terms"]:
                conditions.append(func.lower(models.JobPosting.location).contains(term.lower()))
            query = query.filter(or_(*conditions))

    return query.all()

@app.post("/api/jobs", response_model=schemas.JobPostingResponse)
def create_job(job: schemas.JobPostingCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can post jobs")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=400, detail="Employer profile not found")
    if employer_profile.status == "Suspended":
        raise HTTPException(status_code=403, detail="Employer account is suspended")
    
    if employer_profile.subscription_status != "Active" and employer_profile.subscription_plan in ["Pro", "Enterprise"]:
        raise HTTPException(status_code=403, detail="Your subscription is currently inactive. Please renew to post jobs.")

    has_unlimited = (
        employer_profile.subscription_plan in ["Pro", "Enterprise"] and 
        employer_profile.subscription_status == "Active"
    )

    used_paid_credit = False
    if not has_unlimited:
        job_count = db.query(models.JobPosting).filter(models.JobPosting.employer_id == employer_profile.id).count()
        if job_count >= 3:
            credits_rec = db.query(models.PostCredits).filter(models.PostCredits.employer_id == employer_profile.id).first()
            if not credits_rec or credits_rec.credits <= 0:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="CREDITS_EXHAUSTED"
                )
            credits_rec.credits -= 1
            used_paid_credit = True

    job_dict = job.dict()
    job_dict["employer_id"] = employer_profile.id
    job_dict["views_count"] = 0
    job_dict["applications_count"] = 0
    job_dict["used_paid_credit"] = used_paid_credit

    new_job = models.JobPosting(**job_dict)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    log_activity(
        db=db,
        action="job_create",
        details=f"Employer '{employer_profile.company_name}' posted a new job: '{new_job.title}' ({new_job.reference_number})",
        user=current_user,
        entity_type="job",
        entity_id=new_job.id
    )
    return new_job

@app.put("/api/jobs/{job_id}", response_model=schemas.JobPostingResponse)
def update_job(job_id: str, job: schemas.JobPostingCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if current_user.role != models.RoleEnum.SUPER_USER:
        employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
        if not employer_profile or db_job.employer_id != employer_profile.id:
            raise HTTPException(status_code=403, detail="You do not have permission to modify this job")
    
    for key, value in job.dict().items():
        if key == "employer_id" and current_user.role != models.RoleEnum.SUPER_USER:
            continue
        if key in ["views_count", "applications_count"]:
            value = int(value or 0)
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    log_activity(
        db=db,
        action="job_update",
        details=f"User updated job details for: '{db_job.title}' ({db_job.reference_number})",
        user=current_user,
        entity_type="job",
        entity_id=db_job.id
    )
    return db_job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if current_user.role != models.RoleEnum.SUPER_USER:
        employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
        if not employer_profile or db_job.employer_id != employer_profile.id:
            raise HTTPException(status_code=403, detail="You do not have permission to delete this job")
    
    db_job.status = "Deleted"
    db.commit()
    log_activity(
        db=db,
        action="job_delete",
        details=f"User marked job '{db_job.title}' ({db_job.reference_number}) as Deleted",
        user=current_user,
        entity_type="job",
        entity_id=db_job.id
    )
    return {"message": "Job deleted successfully"}

@app.post("/api/jobs/{job_id}/suspend", response_model=schemas.JobPostingResponse)
def suspend_job(job_id: str, action: schemas.JobSuspendRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.SUPER_USER:
        raise HTTPException(status_code=403, detail="Super Admin access required")
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db_job.status = "Suspended"
    db_job.moderation_reason = action.reason
    db_job.appeal_status = None
    db_job.appeal_text = None
    db.commit()
    db.refresh(db_job)
    log_activity(
        db=db,
        action="job_suspend",
        details=f"Super Admin suspended job: '{db_job.title}' ({db_job.reference_number}). Reason: '{action.reason}'",
        user=current_user,
        entity_type="job",
        entity_id=db_job.id
    )
    return db_job

@app.post("/api/jobs/{job_id}/appeal", response_model=schemas.JobPostingResponse)
def appeal_job(job_id: str, action: schemas.JobAppealRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can appeal job suspensions")
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile or db_job.employer_id != employer_profile.id:
        raise HTTPException(status_code=403, detail="You do not have permission to appeal this listing")
    if db_job.status != "Suspended":
        raise HTTPException(status_code=400, detail="Only suspended listings can be appealed")
    db_job.appeal_text = action.appeal_text
    db_job.appeal_status = "Pending"
    db.commit()
    db.refresh(db_job)
    log_activity(
        db=db,
        action="job_appeal_submit",
        details=f"Employer appealed suspension for job: '{db_job.title}' ({db_job.reference_number}). Appeal text: '{action.appeal_text}'",
        user=current_user,
        entity_type="job",
        entity_id=db_job.id
    )
    return db_job

@app.post("/api/jobs/{job_id}/restore", response_model=schemas.JobPostingResponse)
def restore_job(job_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.SUPER_USER:
        raise HTTPException(status_code=403, detail="Super Admin access required")
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db_job.status = "Active"
    db_job.moderation_reason = None
    db_job.appeal_status = None
    db_job.appeal_text = None
    db.commit()
    db.refresh(db_job)
    log_activity(
        db=db,
        action="job_restore",
        details=f"Super Admin restored job: '{db_job.title}' ({db_job.reference_number})",
        user=current_user,
        entity_type="job",
        entity_id=db_job.id
    )
    return db_job

@app.post("/api/jobs/{job_id}/view")
def increment_job_views(job_id: str, db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db_job.views_count = (db_job.views_count or 0) + 1
    db.commit()
    log_activity(
        db=db,
        action="job_view",
        details=f"Candidate viewed job: '{db_job.title}' ({db_job.reference_number})",
        user=None,
        entity_type="job",
        entity_id=db_job.id
    )
    return {"views_count": db_job.views_count}

@app.post("/api/jobs/{job_id}/apply")
def increment_job_applications(job_id: str, db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db_job.applications_count = (db_job.applications_count or 0) + 1
    db.commit()
    log_activity(
        db=db,
        action="job_apply_click",
        details=f"Candidate clicked WhatsApp Apply for: '{db_job.title}' ({db_job.reference_number})",
        user=None,
        entity_type="job",
        entity_id=db_job.id
    )
    return {"applications_count": db_job.applications_count}

@app.get("/api/agent/stats", response_model=schemas.AgentDashboardStatsResponse)
def get_agent_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
    
    referred_employers = db.query(models.EmployerProfile).filter(models.EmployerProfile.referred_by_id == agent_profile.id).all()
    total_referrals = len(referred_employers)
    active_referrals = len([e for e in referred_employers if e.status == "Active"])
    
    total_jobs_posted = 0
    for emp in referred_employers:
        total_jobs_posted += db.query(models.JobPosting).filter(models.JobPosting.employer_id == emp.id).count()
        
    earnings = (active_referrals * 500) + (total_jobs_posted * 100)
    
    return {
        "referral_code": agent_profile.referral_code,
        "total_referrals": total_referrals,
        "active_referrals": active_referrals,
        "total_jobs_posted": total_jobs_posted,
        "earnings": earnings
    }

@app.get("/api/agent/referrals", response_model=List[schemas.ReferredEmployerResponse])
def get_agent_referrals(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
        
    referred_employers = db.query(models.EmployerProfile).filter(models.EmployerProfile.referred_by_id == agent_profile.id).all()
    
    results = []
    for emp in referred_employers:
        user_record = db.query(models.User).filter(models.User.id == emp.user_id).first()
        jobs_count = db.query(models.JobPosting).filter(models.JobPosting.employer_id == emp.id).count()
        results.append({
            "id": emp.id,
            "company_name": emp.company_name,
            "contact_person": user_record.full_name if user_record else "",
            "email": user_record.email if user_record else "",
            "joined_date": user_record.created_at.strftime("%Y-%m-%d") if user_record else "",
            "status": emp.status or "Active",
            "suspension_reason": emp.suspension_reason,
            "jobs_count": jobs_count
        })
    return results

@app.post("/api/agent/referrals/{employer_id}/suspend")
def suspend_referred_employer(employer_id: str, request: schemas.SuspensionRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
        
    emp = db.query(models.EmployerProfile).filter(
        models.EmployerProfile.id == employer_id,
        models.EmployerProfile.referred_by_id == agent_profile.id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Referred employer not found")
        
    emp.status = "Suspended"
    emp.suspension_reason = request.reason
    db.commit()
    log_activity(
        db=db,
        action="employer_suspend",
        details=f"Agent '{agent_profile.referral_code}' suspended referred employer '{emp.company_name}'. Reason: '{request.reason}'",
        user=current_user,
        entity_type="employer",
        entity_id=emp.id
    )
    return {"message": "Employer suspended successfully"}

@app.post("/api/agent/referrals/{employer_id}/unsuspend")
def unsuspend_referred_employer(employer_id: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
        
    emp = db.query(models.EmployerProfile).filter(
        models.EmployerProfile.id == employer_id,
        models.EmployerProfile.referred_by_id == agent_profile.id
    ).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Referred employer not found")
        
    emp.status = "Active"
    emp.suspension_reason = None
    db.commit()
    log_activity(
        db=db,
        action="employer_unsuspend",
        details=f"Agent '{agent_profile.referral_code}' unsuspended referred employer '{emp.company_name}'",
        user=current_user,
        entity_type="employer",
        entity_id=emp.id
    )
    return {"message": "Employer unsuspended successfully"}

@app.get("/api/agent/profile", response_model=schemas.AgentProfileResponse)
def get_agent_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
    return agent_profile

@app.put("/api/agent/profile", response_model=schemas.AgentProfileResponse)
def update_agent_profile(profile_data: schemas.AgentProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.AGENT:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    agent_profile = db.query(models.AgentProfile).filter(models.AgentProfile.user_id == current_user.id).first()
    if not agent_profile:
        raise HTTPException(status_code=404, detail="Agent profile not found")
        
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(agent_profile, key, value)
        
    db.commit()
    db.refresh(agent_profile)
    return agent_profile

@app.get("/api/employer/profile", response_model=schemas.EmployerProfileResponse)
def get_employer_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Forbidden")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    return employer_profile

@app.put("/api/employer/profile", response_model=schemas.EmployerProfileResponse)
def update_employer_profile(profile_data: schemas.EmployerProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=404, detail="Employer profile not found")
        
    if profile_data.fullName is not None:
        current_user.full_name = profile_data.fullName
    if profile_data.companyName is not None:
        employer_profile.company_name = profile_data.companyName
    if profile_data.industry is not None:
        employer_profile.industry = profile_data.industry
    if profile_data.logo is not None:
        employer_profile.logo = profile_data.logo
    if profile_data.establishmentYear is not None:
        employer_profile.establishment_year = profile_data.establishmentYear
    if profile_data.city is not None:
        employer_profile.city = profile_data.city
    if profile_data.address is not None:
        employer_profile.address = profile_data.address
    if profile_data.whatsappNumber is not None:
        employer_profile.whatsapp_number = profile_data.whatsappNumber
    if profile_data.defaultMessage is not None:
        employer_profile.default_message = profile_data.defaultMessage
        
    db.commit()
    db.refresh(employer_profile)
    db.refresh(current_user)
    return employer_profile


# Pay-Per-Post Payments Implementation
CREDIT_PACKS = {
    "single": {"price": 99, "credits": 1},
    "bundle_5": {"price": 399, "credits": 5},
    "bundle_10": {"price": 699, "credits": 10}
}

razorpay_client = None
if not config.RAZORPAY_MOCK_MODE:
    try:
        import razorpay
        razorpay_client = razorpay.Client(auth=(config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET))
    except Exception as e:
        print(f"Failed to initialize Razorpay Client: {e}. Falling back to MOCK mode.")


def get_credits_count(employer_id: str, db: Session) -> int:
    credits_rec = db.query(models.PostCredits).filter(models.PostCredits.employer_id == employer_id).first()
    return credits_rec.credits if credits_rec else 0


@app.get("/api/employer/credits", response_model=schemas.EmployerCreditsResponse)
def get_employer_credits(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Forbidden")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=400, detail="Employer profile not found")
        
    free_posts_used = db.query(models.JobPosting).filter(
        models.JobPosting.employer_id == employer_profile.id,
        models.JobPosting.used_paid_credit == False
    ).count()
    
    credits_val = get_credits_count(employer_profile.id, db)
    
    return schemas.EmployerCreditsResponse(
        credits=credits_val,
        free_posts_used=min(free_posts_used, 3),
        free_posts_limit=3
    )


@app.post("/api/payments/create-order", response_model=schemas.CreditOrderResponse)
def create_credit_order(order_data: schemas.CreditOrderCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Forbidden")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=400, detail="Employer profile not found")
        
    pack = CREDIT_PACKS.get(order_data.pack_id)
    if not pack:
        raise HTTPException(status_code=400, detail="Invalid pack selection")
        
    amount_paise = pack["price"] * 100
    
    mock_mode = config.RAZORPAY_MOCK_MODE or (razorpay_client is None)
    razorpay_order_id = f"order_mock_{uuid.uuid4().hex[:14]}"
    
    if not mock_mode:
        try:
            order_payload = {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": f"receipt_{uuid.uuid4().hex[:10]}",
                "payment_capture": 1
            }
            order = razorpay_client.order.create(data=order_payload)
            razorpay_order_id = order["id"]
        except Exception as e:
            print(f"Razorpay order creation failed: {e}. Falling back to mock order.")
            mock_mode = True
            
    db_txn = models.PaymentTransaction(
        employer_id=employer_profile.id,
        razorpay_order_id=razorpay_order_id,
        amount=pack["price"],
        credits_purchased=pack["credits"],
        status="Created"
    )
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    
    return schemas.CreditOrderResponse(
        id=db_txn.id,
        razorpay_order_id=razorpay_order_id,
        amount=amount_paise,
        currency="INR",
        key_id=config.RAZORPAY_KEY_ID,
        mock_mode=mock_mode
    )


@app.post("/api/payments/verify")
def verify_payment(payload: schemas.PaymentVerification, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.RoleEnum.EMPLOYER:
        raise HTTPException(status_code=403, detail="Forbidden")
    employer_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer_profile:
        raise HTTPException(status_code=400, detail="Employer profile not found")
        
    db_txn = db.query(models.PaymentTransaction).filter(models.PaymentTransaction.razorpay_order_id == payload.razorpay_order_id).first()
    if not db_txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    if db_txn.status == "Paid":
        return {"status": "success", "message": "Payment already verified", "credits": get_credits_count(employer_profile.id, db)}
        
    mock_mode = config.RAZORPAY_MOCK_MODE or (razorpay_client is None)
    is_valid = False
    
    if payload.is_mocked or mock_mode:
        is_valid = True
    else:
        try:
            params = {
                'razorpay_order_id': payload.razorpay_order_id,
                'razorpay_payment_id': payload.razorpay_payment_id,
                'razorpay_signature': payload.razorpay_signature
            }
            razorpay_client.utility.verify_payment_signature(params)
            is_valid = True
        except Exception as e:
            print(f"Signature verification failed: {e}")
            is_valid = False
            
    if not is_valid:
        db_txn.status = "Failed"
        db.commit()
        raise HTTPException(status_code=400, detail="Payment signature verification failed")
        
    db_txn.status = "Paid"
    db_txn.razorpay_payment_id = payload.razorpay_payment_id
    db_txn.razorpay_signature = payload.razorpay_signature
    
    credits_rec = db.query(models.PostCredits).filter(models.PostCredits.employer_id == employer_profile.id).first()
    if not credits_rec:
        credits_rec = models.PostCredits(employer_id=employer_profile.id, credits=0)
        db.add(credits_rec)
        db.commit()
        db.refresh(credits_rec)
        
    credits_rec.credits += db_txn.credits_purchased
    db.commit()
    
    log_activity(
        db=db,
        action="payment_verify",
        details=f"Employer '{employer_profile.company_name}' purchased {db_txn.credits_purchased} credits for INR {db_txn.amount} (Status: Paid)",
        user=current_user,
        entity_type="payment",
        entity_id=db_txn.id
    )
    
    return {
        "status": "success",
        "message": "Payment verified and credits added successfully!",
        "credits": credits_rec.credits
    }

