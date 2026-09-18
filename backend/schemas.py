from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from models import RoleEnum
from datetime import datetime
import re

# Weak password blocklist (common passwords and predictable patterns)
WEAK_PASSWORDS = {
    '12345678', '123456789', '1234567890', '87654321', '12341234', '11111111', '00000000',
    'password', 'password1', 'password123', 'pass1234', 'p@ssword', 'p@ssword1',
    'qwerty123', 'qwerty1234', 'qwerty12', 'qwertyuiop', 'qwert123',
    'admin123', 'admin1234', 'administrator', 'adminpass',
    'welcome1', 'welcome123', 'welcome2023', 'welcome2024', 'welcome2025', 'welcome2026',
    'letmein123', 'abc12345', 'abcd1234', 'abc123456', 'abcdefgh',
    'iloveyou1', 'monkey123', 'dragon123', 'master123', 'login123',
    'princess1', 'football1', 'charlie1', 'shadow123', 'sunshine1', 'superman1',
    'user1234', 'guest1234', 'change123', 'testing123', 'test1234'
}

def is_weak_pattern(v: str) -> bool:
    v_lower = v.lower()
    # Repeated single character: "11111111", "aaaaaaaa"
    if len(set(v_lower)) == 1:
        return True
    # Common base words + simple trailing numbers/symbols (e.g. "password123", "password123!", "p@ssword1")
    common_bases = ['password', 'p@ssword', 'admin', 'welcome', 'qwerty', 'abc123', 'login', 'letmein', 'pass', 'user', 'guest']
    for base in common_bases:
        if v_lower.startswith(base):
            rest = v_lower[len(base):]
            if re.match(r'^[\d!@#$%^&*()_+\-=\[\]{};:\'",.<>?]*$', rest):
                return True
    return False

def validate_password(v: str) -> str:
    if v.startswith(' ') or v.endswith(' '):
        raise ValueError('Password must not contain leading or trailing spaces')
    if len(v) < 8 or len(v) > 64:
        raise ValueError('Password must be between 8 and 64 characters long')
    # Check weak / common passwords BEFORE character composition checks
    if v.lower() in WEAK_PASSWORDS or is_weak_pattern(v):
        raise ValueError('This password is too common. Please choose a stronger password')
    if not re.search(r'[a-z]', v):
        raise ValueError('Password must contain at least one lowercase letter')
    if not re.search(r'[A-Z]', v):
        raise ValueError('Password must contain at least one uppercase letter')
    if not re.search(r'[0-9]', v):
        raise ValueError('Password must contain at least one number')
    if not re.search(r'[^a-zA-Z0-9\s]', v):
        raise ValueError('Password must contain at least one special character (!@#$%^&*)')
    return v

def validate_full_name(v: str) -> str:
    if v is None or v.strip() == '':
        raise ValueError('Full name is required')
    v = v.strip()
    if len(v) < 2:
        raise ValueError('Full name must be at least 2 characters long')
    if len(v) > 100:
        raise ValueError('Full name must not exceed 100 characters')
    # Block HTML / script tags / event handlers / javascript URLs
    if re.search(r'<[^>]+>', v) or re.search(r'<\s*script', v, re.IGNORECASE) or re.search(r'javascript:', v, re.IGNORECASE) or re.search(r'on\w+\s*=', v, re.IGNORECASE):
        raise ValueError('Full name must not contain HTML or script tags')
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
        raise ValueError('Full name must contain only valid name characters (letters and spaces)')
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
    if re.search(r'<[^>]+>', v) or re.search(r'<\s*script', v, re.IGNORECASE) or re.search(r'javascript:', v, re.IGNORECASE):
        raise ValueError('Phone number must not contain HTML or script tags')
    if not re.match(r'^\+?[0-9\s\-\(\)]+$', v):
        raise ValueError('Please enter a valid phone number without unsupported special characters')
    digits_only = re.sub(r'\D', '', v)
    if len(digits_only) < 10:
        raise ValueError('Phone number must contain at least 10 digits')
    if len(digits_only) > 15:
        raise ValueError('Phone number must not exceed 15 digits')
    return v

def validate_bank_account_number(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    # Reject SQL injection / quotes / special chars / HTML tags
    if re.search(r"['\";\-\-/<>]", v) or re.search(r"(OR|AND|SELECT|DROP|INSERT|DELETE|UNION|UPDATE)", v, re.IGNORECASE):
        raise ValueError('Please enter a valid bank account number')
    if not re.match(r'^[0-9\-\s]+$', v):
        raise ValueError('Please enter a valid bank account number')
    digits_only = re.sub(r'\D', '', v)
    if len(digits_only) < 9 or len(digits_only) > 18:
        raise ValueError('Please enter a valid bank account number (9 to 18 digits)')
    return v

def validate_account_holder_name(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if len(v) < 2:
        raise ValueError('Account holder name must be at least 2 characters long')
    if len(v) > 100:
        raise ValueError('Account holder name must not exceed 100 characters')
    if re.search(r'<[^>]+>', v) or re.search(r'<\s*script', v, re.IGNORECASE) or re.search(r'javascript:', v, re.IGNORECASE):
        raise ValueError('Account holder name must not contain HTML or script tags')
    if re.search(r'[0-9]', v):
        raise ValueError('Account holder name must contain only letters and spaces')
    if not re.match(r"^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú\s\-'.]+$", v):
        raise ValueError('Account holder name must contain only letters and spaces')
    return v

def validate_dob(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    dob_date = None
    for fmt in ('%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y'):
        try:
            dob_date = datetime.strptime(v, fmt).date()
            break
        except ValueError:
            pass
    if not dob_date:
        raise ValueError('Please enter a valid date of birth (YYYY-MM-DD)')
    
    today = datetime.now().date()
    if dob_date >= today:
        raise ValueError('Date of birth cannot be today or a future date')
    
    age = today.year - dob_date.year - ((today.month, today.day) < (dob_date.month, dob_date.day))
    if age < 18:
        raise ValueError('You must be at least 18 years old')
    if age > 100:
        raise ValueError('Please enter a valid date of birth')
    
    return dob_date.strftime('%Y-%m-%d')

def validate_doc_number(doc_type: Optional[str], doc_number: Optional[str]) -> Optional[str]:
    if doc_number is None or doc_number.strip() == '':
        return None
    doc_num = doc_number.strip()
    clean_num = doc_num.replace(' ', '').replace('-', '')
    doc_t = (doc_type or 'Aadhar').strip()

    if doc_t in ('Aadhar', 'Aadhaar'):
        if not re.match(r'^[2-9][0-9]{11}$', clean_num):
            raise ValueError('Please enter a valid 12-digit Aadhaar number (e.g. 987654321012)')
        if len(set(clean_num)) == 1:
            raise ValueError('Please enter a valid 12-digit Aadhaar number')
        return clean_num
    elif doc_t == 'PAN':
        upper_num = clean_num.upper()
        if not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', upper_num):
            raise ValueError('Please enter a valid 10-character PAN card number (e.g. ABCDE1234F)')
        return upper_num
    elif doc_t in ('Voter ID', 'VoterID', 'EPIC'):
        upper_num = clean_num.upper()
        if not re.match(r'^[A-Z]{3}[0-9]{7}$', upper_num):
            raise ValueError('Please enter a valid Voter ID number (e.g. ABC1234567)')
        return upper_num
    elif doc_t == 'Passport':
        upper_num = clean_num.upper()
        if not re.match(r'^[A-Z][0-9]{7}$', upper_num):
            raise ValueError('Please enter a valid Passport number (e.g. A1234567)')
        return upper_num

    return doc_num

def validate_upi_id(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if re.search(r'<[^>]+>', v) or re.search(r'<\s*script', v, re.IGNORECASE) or re.search(r'javascript:', v, re.IGNORECASE):
        raise ValueError('UPI ID must not contain HTML or script tags')
    if not re.match(r'^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$', v):
        raise ValueError('Please enter a valid UPI ID (e.g. username@paytm or user@okhdfcbank)')
    return v.lower()

def validate_ifsc_code(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip().upper()
    if not re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', v):
        raise ValueError('Please enter a valid 11-character IFSC code (e.g. SBIN0001234)')
    return v

def validate_micr_code(v: Optional[str]) -> Optional[str]:
    if v is None or v.strip() == '':
        return None
    v = v.strip()
    if not re.match(r'^[0-9]{9}$', v):
        raise ValueError('Please enter a valid 9-digit MICR code (e.g. 400002001)')
    if len(set(v)) == 1:
        raise ValueError('Please enter a valid 9-digit MICR code')
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
        if v.startswith(' ') or v.endswith(' '):
            raise ValueError('Password must not contain leading or trailing spaces')
        if len(v) < 8 or len(v) > 64:
            raise ValueError('Password must be between 8 and 64 characters long')
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

    @field_validator('phone')
    @classmethod
    def check_phone(cls, v):
        return validate_phone_number(v)

    @field_validator('dob')
    @classmethod
    def check_dob(cls, v):
        return validate_dob(v)

    @field_validator('upi_id')
    @classmethod
    def check_upi_id(cls, v):
        return validate_upi_id(v)

    @field_validator('account_holder')
    @classmethod
    def check_account_holder(cls, v):
        return validate_account_holder_name(v)

    @field_validator('account_number')
    @classmethod
    def check_account_number(cls, v):
        return validate_bank_account_number(v)

    @field_validator('ifsc_code')
    @classmethod
    def check_ifsc_code(cls, v):
        return validate_ifsc_code(v)

    @field_validator('micr_code')
    @classmethod
    def check_micr_code(cls, v):
        return validate_micr_code(v)

    @model_validator(mode='after')
    def check_document(self):
        if self.doc_number:
            self.doc_number = validate_doc_number(self.doc_type, self.doc_number)
        return self

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

