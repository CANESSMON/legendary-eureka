from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from models import RoleEnum
from datetime import datetime
import re

# Weak password blocklist (common passwords that meet length requirements)
WEAK_PASSWORDS = {
    '12345678', '123456789', '1234567890', 'password', 'password1',
    'qwerty123', 'admin123', 'welcome1', 'welcome123', 'letmein123',
    'abc12345', 'abcd1234', 'iloveyou1', 'monkey123', 'dragon123',
    'master123', 'qwerty12', 'login123', 'princess1', 'football1',
}

def validate_full_name(v: str) -> str:
    v = v.strip()
    if len(v) < 2:
        raise ValueError('Full name must be at least 2 characters long')
    if len(v) > 100:
        raise ValueError('Full name must not exceed 100 characters')
    # Block HTML tags
    if re.search(r'<[^>]+>', v):
        raise ValueError('Full name must not contain HTML tags')
    # Block SQL injection patterns
    sql_patterns = [
        r"('\s*(OR|AND|DROP|SELECT|INSERT|UPDATE|DELETE|UNION|--|;))",
        r'(DROP\s+TABLE|SELECT\s+\*|INSERT\s+INTO|DELETE\s+FROM)',
    ]
    for pattern in sql_patterns:
        if re.search(pattern, v, re.IGNORECASE):
            raise ValueError('Full name contains invalid characters')
    # Allow only letters (ASCII and common accented), spaces, hyphens, apostrophes, periods
    if not re.match(r"^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú\s\-'.]+$", v):
        raise ValueError('Full name must contain only letters, spaces, hyphens, apostrophes, or periods')
    # Block emoji range
    emoji_pattern = re.compile(
        "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF"
        "\U0001F1E0-\U0001F1FF\U00002702-\U000027B0\U0001F900-\U0001F9FF"
        "\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF\U00002600-\U000026FF]+",
        flags=re.UNICODE
    )
    if emoji_pattern.search(v):
        raise ValueError('Full name must not contain emojis')
    return v

def validate_password(v: str) -> str:
    # Trim leading/trailing whitespace only
    v = v.strip()
    if len(v) < 8:
        raise ValueError('Password must be at least 8 characters long')
    if len(v) > 128:
        raise ValueError('Password must not exceed 128 characters')
    if not re.search(r'[a-zA-Z]', v):
        raise ValueError('Password must contain at least one letter')
    if not re.search(r'[0-9]', v):
        raise ValueError('Password must contain at least one number')
    if v.lower() in WEAK_PASSWORDS:
        raise ValueError('This password is too common. Please choose a stronger password')
    return v

def validate_email_length(v: str) -> str:
    if len(v) > 254:
        raise ValueError('Email address must not exceed 254 characters')
    return v

def validate_referral_code(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if len(v) > 20:
        raise ValueError('Referral code must not exceed 20 characters')
    if not re.match(r'^[a-zA-Z0-9\-]+$', v):
        raise ValueError('Referral code must contain only letters, numbers, and hyphens')
    return v

def validate_company_name(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if len(v) < 2:
        raise ValueError('Company name must be at least 2 characters long')
    if len(v) > 100:
        raise ValueError('Company name must not exceed 100 characters')
    if re.search(r'<[^>]+>', v):
        raise ValueError('Company name must not contain HTML tags')
    return v

def validate_establishment_year(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if not re.match(r'^\d{4}$', v):
        raise ValueError('Establishment year must be a valid 4-digit numeric year (e.g. 2016)')
    current_year = datetime.now().year
    year_int = int(v)
    if year_int < 1800 or year_int > current_year:
        raise ValueError(f'Establishment year must be between 1800 and {current_year}')
    return v

def validate_logo_url(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    v_lower = v.lower()
    if not (v_lower.startswith('http://') or v_lower.startswith('https://')):
        raise ValueError('Please enter a valid HTTPS image URL')
    if re.search(r'javascript:|data:|vbscript:', v_lower):
        raise ValueError('Invalid or unsafe URL scheme')
    # SSRF protection
    host_match = re.search(r'https?://([^/:\?#]+)', v_lower)
    if host_match:
        host = host_match.group(1).strip()
        if host in ('localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '[::1]', '::1') or \
           re.match(r'^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$', host) or \
           re.match(r'^192\.168\.\d{1,3}\.\d{1,3}$', host) or \
           re.match(r'^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$', host) or \
           re.match(r'^169\.254\.\d{1,3}\.\d{1,3}$', host):
            raise ValueError('Internal/localhost URLs are not allowed')
    # File type validation
    path_part = v_lower.split('?')[0].split('#')[0]
    if re.search(r'\.(pdf|doc|docx|exe|zip|rar|txt|html|php|bin|tar|gz|mp4|mp3)$', path_part):
        raise ValueError('Image URL must point to an image file (.jpg, .png, .webp, .svg, etc.), not a PDF or non-image document')
    return v

def validate_city_name(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if len(v) < 2:
        raise ValueError('Please enter a valid city name')
    if len(v) > 100:
        raise ValueError('City name must not exceed 100 characters')
    if re.search(r'<[^>]+>', v):
        raise ValueError('City name must not contain HTML tags')
    if not re.search(r'[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú]', v):
        raise ValueError('Please enter a valid city name')
    if not re.match(r"^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú\s\-'.]+$", v) or re.match(r"^[\-'.\s]+$", v):
        raise ValueError('Please enter a valid city name')
    return v

def validate_address(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if len(v) < 5:
        raise ValueError('Please enter a valid address (minimum 5 characters)')
    if len(v) > 255:
        raise ValueError('Address must not exceed 255 characters')
    if re.search(r'<[^>]+>', v) or re.search(r'<script', v, re.IGNORECASE):
        raise ValueError('Address must not contain HTML or script tags')
    return v

def validate_phone_number(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if re.search(r'<[^>]+>', v) or re.search(r'<script', v, re.IGNORECASE):
        raise ValueError('Phone number must not contain HTML or script tags')
    clean = re.sub(r'[\s\-\(\)]', '', v)
    if not re.match(r'^\+?[0-9]{7,15}$', clean):
        raise ValueError('Please enter a valid phone number (e.g. +919876543210)')
    return v

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

    @field_validator('email')
    @classmethod
    def check_email_length(cls, v):
        return validate_email_length(v)

    @field_validator('password')
    @classmethod
    def check_password(cls, v):
        return validate_password(v)

    @field_validator('full_name')
    @classmethod
    def check_full_name(cls, v):
        return validate_full_name(v)

    @field_validator('company_name')
    @classmethod
    def check_company_name(cls, v):
        return validate_company_name(v)

    @field_validator('city')
    @classmethod
    def check_city(cls, v):
        return validate_city_name(v)

    @field_validator('whatsapp_number')
    @classmethod
    def check_whatsapp_number(cls, v):
        return validate_phone_number(v)

    @field_validator('referral_code')
    @classmethod
    def check_referral_code(cls, v):
        return validate_referral_code(v)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    otp: Optional[str] = None

    @field_validator('email')
    @classmethod
    def check_email_length(cls, v):
        return validate_email_length(v)

    @field_validator('password')
    @classmethod
    def check_password(cls, v):
        v = v.strip()
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v) > 128:
            raise ValueError('Password must not exceed 128 characters')
        return v



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

    @field_validator('fullName')
    @classmethod
    def check_full_name(cls, v):
        if v is None or v.strip() == '':
            return v
        return validate_full_name(v)

    @field_validator('companyName')
    @classmethod
    def check_company_name(cls, v):
        return validate_company_name(v)

    @field_validator('establishmentYear')
    @classmethod
    def check_establishment_year(cls, v):
        return validate_establishment_year(v)

    @field_validator('logo')
    @classmethod
    def check_logo_url(cls, v):
        return validate_logo_url(v)

    @field_validator('city')
    @classmethod
    def check_city(cls, v):
        return validate_city_name(v)

    @field_validator('address')
    @classmethod
    def check_address(cls, v):
        return validate_address(v)

    @field_validator('whatsappNumber')
    @classmethod
    def check_whatsapp_number(cls, v):
        return validate_phone_number(v)

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
    whatsapp_number: Optional[str] = None

    @field_validator('company')
    @classmethod
    def check_company(cls, v):
        return validate_company_name(v)

    @field_validator('location')
    @classmethod
    def check_location(cls, v):
        return validate_city_name(v)

    @model_validator(mode='after')
    def check_salary_range(self):
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_max < self.salary_min:
                raise ValueError("Maximum salary must be greater than or equal to minimum salary.")
        return self

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

