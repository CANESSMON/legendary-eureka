from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import List
import uuid
import random
import string

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobPortal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer jwt-token-"):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = authorization.replace("Bearer jwt-token-", "")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role_map = {
        'EMPLOYER': models.RoleEnum.EMPLOYER,
        'AGENT': models.RoleEnum.AGENT
    }
    role = role_map.get(user.account_type.upper(), models.RoleEnum.EMPLOYER)

    new_user = models.User(
        email=user.email,
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
            is_verified=True,
            referred_by_id=agent.id if agent else None
        )
        db.add(employer)
        db.commit()
        db.refresh(new_user)

    elif role == models.RoleEnum.AGENT:
        code = "AGENT-IND-" + ''.join(random.choices(string.digits, k=5))
        agent_profile = models.AgentProfile(
            user_id=new_user.id,
            referral_code=code
        )
        db.add(agent_profile)
        db.commit()
        db.refresh(new_user)

    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {
        "access_token": f"jwt-token-{db_user.id}",
        "token_type": "bearer",
        "user": db_user
    }

@app.get("/api/jobs", response_model=List[schemas.JobPostingResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.JobPosting).all()

@app.post("/api/jobs", response_model=schemas.JobPostingResponse)
def create_job(job: schemas.JobPostingCreate, db: Session = Depends(get_db)):
    new_job = models.JobPosting(**job.dict())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.put("/api/jobs/{job_id}", response_model=schemas.JobPostingResponse)
def update_job(job_id: str, job: schemas.JobPostingCreate, db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job.dict().items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    db_job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"}

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

