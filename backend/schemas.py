from pydantic import BaseModel, EmailStr
from typing import Optional
from models import RoleEnum
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    account_type: str = 'employer'
    company_name: Optional[str] = None
    industry: Optional[str] = None
    city: Optional[str] = None
    whatsapp_number: Optional[str] = None
    referral_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmployerProfileResponse(BaseModel):
    id: str
    company_name: Optional[str]
    industry: Optional[str]
    city: Optional[str]
    whatsapp_number: Optional[str]
    logo: Optional[str]
    is_verified: bool
    status: Optional[str] = "Active"
    suspension_reason: Optional[str] = None

    class Config:
        from_attributes = True

class AgentProfileResponse(BaseModel):
    id: str
    referral_code: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    profile_pic: Optional[str] = None
    doc_type: Optional[str] = None
    doc_number: Optional[str] = None
    payout_type: Optional[str] = None
    upi_id: Optional[str] = None
    bank_name: Optional[str] = None
    account_holder: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    micr_code: Optional[str] = None

    class Config:
        from_attributes = True

class AgentProfileUpdate(BaseModel):
    phone: Optional[str] = None
    dob: Optional[str] = None
    profile_pic: Optional[str] = None
    doc_type: Optional[str] = None
    doc_number: Optional[str] = None
    payout_type: Optional[str] = None
    upi_id: Optional[str] = None
    bank_name: Optional[str] = None
    account_holder: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    micr_code: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: RoleEnum
    employer_profile: Optional[EmployerProfileResponse] = None
    agent_profile: Optional[AgentProfileResponse] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class SuspensionRequest(BaseModel):
    reason: str

class ReferredEmployerResponse(BaseModel):
    id: str
    company_name: Optional[str]
    contact_person: Optional[str]
    email: str
    joined_date: str
    status: str
    suspension_reason: Optional[str]
    jobs_count: int

class AgentDashboardStatsResponse(BaseModel):
    referral_code: str
    total_referrals: int
    active_referrals: int
    total_jobs_posted: int
    earnings: int

class JobPostingCreate(BaseModel):
    title: str
    company: str
    location: str
    salary: str
    min_salary: Optional[str] = None
    type: str = "Full-time"
    category: str
    description: Optional[str] = None
    requirements: Optional[str] = None
    is_urgent: bool = False
    is_featured: bool = False
    employer_id: Optional[str] = None
    status: Optional[str] = "Active"
    views_count: Optional[str] = "0"
    applications_count: Optional[str] = "0"

class JobPostingResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: str
    type: str
    category: str
    description: Optional[str]
    requirements: Optional[str]
    is_urgent: bool
    is_featured: bool
    status: str
    views_count: str
    applications_count: str
    employer_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

