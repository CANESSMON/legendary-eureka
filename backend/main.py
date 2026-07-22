from fastapi import FastAPI, Depends, HTTPException, status
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

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    role_map = {
        'JOBSEEKER': models.RoleEnum.JOB_SEEKER,
        'EMPLOYER': models.RoleEnum.EMPLOYER,
        'AGENT': models.RoleEnum.AGENT
    }
    role = role_map.get(user.account_type.upper(), models.RoleEnum.JOB_SEEKER)

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
            company_name=user.full_name,
            referred_by_id=agent.id if agent else None
        )
        db.add(employer)
        db.commit()

    elif role == models.RoleEnum.AGENT:
        code = "AGENT-IND-" + ''.join(random.choices(string.digits, k=5))
        agent_profile = models.AgentProfile(
            user_id=new_user.id,
            referral_code=code
        )
        db.add(agent_profile)
        db.commit()

    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    return {"access_token": "dummy-jwt-token-replace-with-pyjwt", "token_type": "bearer"}

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

