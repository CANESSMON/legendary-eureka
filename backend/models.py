import uuid
from sqlalchemy import Boolean, Column, ForeignKey, String, Enum, DateTime, Integer
from sqlalchemy.orm import relationship
import enum
from database import Base
from datetime import datetime, timezone

class RoleEnum(str, enum.Enum):
    SUPER_USER = 'SUPER_USER'
    EMPLOYER = 'EMPLOYER'
    AGENT = 'AGENT'

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.EMPLOYER)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    agent_profile = relationship("AgentProfile", back_populates="user", uselist=False)
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)

class AgentProfile(Base):
    __tablename__ = "agent_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    referral_code = Column(String, unique=True, index=True)
    
    # Personal Identity Details
    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    
    # Verification Document Details
    doc_type = Column(String, nullable=True) # Aadhar, PAN, Voter ID, Passport
    doc_number = Column(String, nullable=True)
    
    # Bank / Payout settings
    payout_type = Column(String, nullable=True) # UPI or Bank
    upi_id = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    account_holder = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    ifsc_code = Column(String, nullable=True)
    micr_code = Column(String, nullable=True)

    user = relationship("User", back_populates="agent_profile")
    referred_employers = relationship("EmployerProfile", back_populates="referred_by")

class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    company_name = Column(String)
    industry = Column(String, nullable=True, default="Information Technology")
    city = Column(String, nullable=True, default="Bangalore")
    whatsapp_number = Column(String, nullable=True, default="+919876543210")
    logo = Column(String, nullable=True)
    address = Column(String, nullable=True)
    default_message = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    status = Column(String, default="Active") # "Active" | "Suspended"
    subscription_plan = Column(String, default="Free")
    subscription_status = Column(String, default="Active")
    suspension_reason = Column(String, nullable=True)
    referred_by_id = Column(String, ForeignKey("agent_profiles.id"), nullable=True)

    user = relationship("User", back_populates="employer_profile")
    referred_by = relationship("AgentProfile", back_populates="referred_employers")

import random
import string

def generate_job_reference():
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"JOB-{suffix}"

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    reference_number = Column(String, unique=True, index=True, default=generate_job_reference)
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    salary = Column(String, nullable=False)
    min_salary = Column(String, nullable=True)
    type = Column(String, default="Full-time")
    category = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    requirements = Column(String, nullable=True)
    is_urgent = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    status = Column(String, default="Active")
    views_count = Column(Integer, default=0, nullable=False)
    applications_count = Column(Integer, default=0, nullable=False)
    employer_id = Column(String, ForeignKey("employer_profiles.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    moderation_reason = Column(String, nullable=True)
    appeal_text = Column(String, nullable=True)
    appeal_status = Column(String, nullable=True)
    classified_heading = Column(String, nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_period = Column(String, default="year")
    used_paid_credit = Column(Boolean, default=False, nullable=True)

    employer = relationship("EmployerProfile", back_populates="jobs")

    @property
    def whatsapp_number(self):
        if self.employer:
            return self.employer.whatsapp_number
        return "+919876543210"

EmployerProfile.jobs = relationship("JobPosting", back_populates="employer")

class JobCategory(Base):
    __tablename__ = "job_categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, unique=True, index=True, nullable=False)

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    price = Column(String, nullable=False)
    period = Column(String, nullable=True)
    features = Column(String, nullable=True)


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, index=True, nullable=False)
    otp_code = Column(String, nullable=False)
    purpose = Column(String, nullable=False)  # 'register' or 'login'
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    user_id = Column(String, nullable=True)
    user_email = Column(String, index=True, nullable=True)
    user_role = Column(String, index=True, nullable=True)
    action = Column(String, index=True, nullable=False)
    entity_type = Column(String, index=True, nullable=True)
    entity_id = Column(String, index=True, nullable=True)
    details = Column(String, nullable=False)
    ip_address = Column(String, nullable=True)


class PostCredits(Base):
    __tablename__ = "post_credits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    employer_id = Column(String, ForeignKey("employer_profiles.id", ondelete="CASCADE"), unique=True, index=True)
    credits = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    employer = relationship("EmployerProfile", backref="credits_record")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    employer_id = Column(String, ForeignKey("employer_profiles.id", ondelete="SET NULL"), nullable=True)
    razorpay_order_id = Column(String, unique=True, index=True, nullable=False)
    razorpay_payment_id = Column(String, index=True, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    amount = Column(Integer, nullable=False)  # stored in rupees
    credits_purchased = Column(Integer, nullable=False)
    status = Column(String, default="Created")  # Created, Paid, Failed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    employer = relationship("EmployerProfile", backref="transactions")


