from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from dependencies import get_current_super_admin
from utils_logging import log_activity

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    employers = db.query(models.EmployerProfile).count()
    agents = db.query(models.AgentProfile).count()
    jobs = db.query(models.JobPosting).count()
    
    # Calculate total views and applications across all jobs
    all_jobs = db.query(models.JobPosting).all()
    total_views = sum(job.views_count or 0 for job in all_jobs)
    total_applications = sum(job.applications_count or 0 for job in all_jobs)

    return {
        "total_employers": employers,
        "total_agents": agents,
        "total_jobs": jobs,
        "total_views": total_views,
        "total_applications": total_applications
    }

@router.get("/employers")
def get_all_employers(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    employers = db.query(models.EmployerProfile).all()
    result = []
    for emp in employers:
        user_record = db.query(models.User).filter(models.User.id == emp.user_id).first()
        agent_code = ""
        if emp.referred_by_id:
            agent = db.query(models.AgentProfile).filter(models.AgentProfile.id == emp.referred_by_id).first()
            if agent:
                agent_code = agent.referral_code
        result.append({
            "id": emp.id,
            "company_name": emp.company_name,
            "email": user_record.email if user_record else "",
            "is_verified": emp.is_verified,
            "status": emp.status,
            "subscription_plan": emp.subscription_plan,
            "subscription_status": emp.subscription_status,
            "industry": emp.industry,
            "city": emp.city,
            "whatsapp_number": emp.whatsapp_number,
            "logo": emp.logo,
            "address": emp.address,
            "default_message": emp.default_message,
            "agent_code": agent_code
        })
    return result

@router.put("/employers/{employer_id}/verify")
def verify_employer(employer_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    emp = db.query(models.EmployerProfile).filter(models.EmployerProfile.id == employer_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employer not found")
    emp.is_verified = True
    db.commit()
    log_activity(
        db=db,
        action="employer_verify",
        details=f"Super Admin verified employer workspace: '{emp.company_name}'",
        user=current_user,
        entity_type="employer",
        entity_id=employer_id
    )
    return {"message": "Employer verified successfully"}

@router.put("/employers/{employer_id}/subscription")
def update_employer_subscription(employer_id: str, request: schemas.SubscriptionUpdateRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    emp = db.query(models.EmployerProfile).filter(models.EmployerProfile.id == employer_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employer not found")
    emp.subscription_plan = request.subscription_plan
    emp.subscription_status = request.subscription_status
    
    if emp.subscription_status in ["Suspended", "Cancelled"]:
        emp.subscription_plan = "Free"
        
    db.commit()
    log_activity(
        db=db,
        action="subscription_change",
        details=f"Super Admin updated employer '{emp.company_name}' subscription to '{emp.subscription_plan}' (Status: {emp.subscription_status})",
        user=current_user,
        entity_type="employer",
        entity_id=employer_id
    )
    return {"message": "Subscription updated successfully"}

@router.get("/agents")
def get_all_agents(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    agents = db.query(models.AgentProfile).all()
    result = []
    for agent in agents:
        user_record = db.query(models.User).filter(models.User.id == agent.user_id).first()
        
        # Get referred employers details
        referred_employers = db.query(models.EmployerProfile).filter(models.EmployerProfile.referred_by_id == agent.id).all()
        referred_list = []
        for emp in referred_employers:
            emp_user = db.query(models.User).filter(models.User.id == emp.user_id).first()
            # Count jobs for this employer
            jobs_count = db.query(models.JobPosting).filter(models.JobPosting.employer_id == emp.id).count()
            referred_list.append({
                "id": emp.id,
                "company_name": emp.company_name,
                "email": emp_user.email if emp_user else "",
                "status": emp.status,
                "is_verified": emp.is_verified,
                "jobs_count": jobs_count
            })
            
        result.append({
            "id": agent.id,
            "referral_code": agent.referral_code,
            "email": user_record.email if user_record else "",
            "phone": agent.phone,
            "dob": agent.dob,
            "profile_pic": agent.profile_pic,
            "doc_type": agent.doc_type,
            "doc_number": agent.doc_number,
            "payout_type": agent.payout_type,
            "upi_id": agent.upi_id,
            "bank_name": agent.bank_name,
            "account_holder": agent.account_holder,
            "account_number": agent.account_number,
            "ifsc_code": agent.ifsc_code,
            "micr_code": agent.micr_code,
            "referred_employers": referred_list
        })
    return result

@router.get("/jobs", response_model=List[schemas.JobPostingResponse])
def get_all_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    return db.query(models.JobPosting).order_by(models.JobPosting.created_at.desc()).all()

@router.put("/jobs/{job_id}/flag")
def flag_job(job_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    job = db.query(models.JobPosting).filter(models.JobPosting.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.is_featured = not job.is_featured
    db.commit()
    log_activity(
        db=db,
        action="job_featured_toggle",
        details=f"Super Admin toggled featured status of job '{job.title}' ({job.reference_number}) to {job.is_featured}",
        user=current_user,
        entity_type="job",
        entity_id=job_id
    )
    return {"message": f"Job featured status set to {job.is_featured}"}

@router.post("/categories", response_model=schemas.JobCategoryResponse)
def add_category(category: schemas.JobCategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    existing = db.query(models.JobCategory).filter(models.JobCategory.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    new_cat = models.JobCategory(name=category.name)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    log_activity(
        db=db,
        action="category_create",
        details=f"Super Admin created new category: '{new_cat.name}'",
        user=current_user,
        entity_type="category",
        entity_id=new_cat.id
    )
    return new_cat

@router.get("/categories/public", response_model=List[schemas.JobCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.JobCategory).all()

@router.delete("/categories/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    cat = db.query(models.JobCategory).filter(models.JobCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
        
    # Check if any job exists in this category
    job_exists = db.query(models.JobPosting).filter(models.JobPosting.category == cat.name).first()
    if job_exists:
        raise HTTPException(status_code=400, detail="Cannot delete category: jobs exist in this category")
        
    db.delete(cat)
    db.commit()
    log_activity(
        db=db,
        action="category_delete",
        details=f"Super Admin deleted category: '{cat.name}'",
        user=current_user,
        entity_type="category",
        entity_id=category_id
    )
    return {"message": "Category deleted successfully"}

@router.get("/plans/public", response_model=List[schemas.SubscriptionPlanResponse])
def get_plans(db: Session = Depends(get_db)):
    return db.query(models.SubscriptionPlan).all()

@router.put("/plans/{plan_id}")
def update_plan(plan_id: str, request: schemas.SubscriptionPlanUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan.name = request.name
    plan.tagline = request.tagline
    plan.price = request.price
    plan.period = request.period
    plan.features = request.features
    db.commit()
    log_activity(
        db=db,
        action="plan_update",
        details=f"Super Admin updated subscription plan '{plan.name}' (Price: {plan.price})",
        user=current_user,
        entity_type="plan",
        entity_id=plan_id
    )
    return {"message": "Plan updated successfully"}

@router.get("/logs", response_model=List[schemas.ActivityLogResponse])
def get_activity_logs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_super_admin)):
    return db.query(models.ActivityLog).order_by(models.ActivityLog.created_at.desc()).all()
