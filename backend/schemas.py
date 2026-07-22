from pydantic import BaseModel, EmailStr
from typing import Optional
from models import RoleEnum

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    account_type: str = 'jobseeker'
    referral_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: RoleEnum
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

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

    class Config:
        from_attributes = True

