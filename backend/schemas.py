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
    otp: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    otp: Optional[str] = None


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
    subscription_plan: Optional[str] = "Free"
    subscription_status: Optional[str] = "Active"

    class Config:
        from_attributes = True

class EmployerProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    companyName: Optional[str] = None
    industry: Optional[str] = None
    logo: Optional[str] = None
    establishmentYear: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    whatsappNumber: Optional[str] = None
    defaultMessage: Optional[str] = None

class JobCategoryResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True

class JobCategoryCreate(BaseModel):
    name: str

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

class AuthResponse(BaseModel):
    status: str  # "success" or "otp_required"
    email: Optional[str] = None
    message: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user: Optional[UserResponse] = None


class SuspensionRequest(BaseModel):
    reason: str

class SubscriptionUpdateRequest(BaseModel):
    subscription_plan: str
    subscription_status: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

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
    views_count: Optional[int] = 0
    applications_count: Optional[int] = 0
    classified_heading: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_period: Optional[str] = "year"

class JobPostingResponse(BaseModel):
    id: str
    reference_number: Optional[str] = None
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
    views_count: int
    applications_count: int
    employer_id: Optional[str] = None
    created_at: Optional[datetime] = None
    whatsapp_number: Optional[str] = None
    moderation_reason: Optional[str] = None
    appeal_text: Optional[str] = None
    appeal_status: Optional[str] = None
    classified_heading: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_period: Optional[str] = "year"

    class Config:
        from_attributes = True

class SubscriptionPlanResponse(BaseModel):
    id: str
    name: str
    tagline: Optional[str] = None
    price: str
    period: Optional[str] = None
    features: Optional[str] = None

    class Config:
        from_attributes = True

class SubscriptionPlanUpdate(BaseModel):
    name: str
    tagline: Optional[str] = None
    price: str
    period: Optional[str] = None
    features: Optional[str] = None

class JobSuspendRequest(BaseModel):
    reason: str

class JobAppealRequest(BaseModel):
    appeal_text: str


class ActivityLogResponse(BaseModel):
    id: str
    created_at: datetime
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_role: Optional[str] = None
    action: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    details: str
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True


class CreditOrderCreate(BaseModel):
    pack_id: str  # 'single', 'bundle_5', 'bundle_10'


class CreditOrderResponse(BaseModel):
    id: str  # locally created transaction ID
    razorpay_order_id: str
    amount: int  # in paise
    currency: str
    key_id: str  # so the client knows which key to use
    mock_mode: bool


class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    is_mocked: Optional[bool] = False  # for sandbox/mock payment testing


class EmployerCreditsResponse(BaseModel):
    credits: int
    free_posts_used: int
    free_posts_limit: int


class PaymentTransactionResponse(BaseModel):
    id: str
    amount: int
    credits_purchased: int
    status: str
    created_at: datetime
    razorpay_order_id: str
    razorpay_payment_id: Optional[str]

    class Config:
        from_attributes = True

