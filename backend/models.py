import uuid
from sqlalchemy import Boolean, Column, ForeignKey, String, Enum, DateTime
from sqlalchemy.orm import relationship
import enum
from database import Base
from datetime import datetime

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
    created_at = Column(DateTime, default=datetime.utcnow)

    agent_profile = relationship("AgentProfile", back_populates="user", uselist=False)
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)

class AgentProfile(Base):
    __tablename__ = "agent_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"))
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
    user_id = Column(String, ForeignKey("users.id"))
    company_name = Column(String)
    industry = Column(String, nullable=True, default="Information Technology")
    city = Column(String, nullable=True, default="Bangalore")
    whatsapp_number = Column(String, nullable=True, default="+919876543210")
    logo = Column(String, nullable=True)
    address = Column(String, nullable=True)
    default_message = Column(String, nullable=True)
    is_verified = Column(Boolean, default=True)
    status = Column(String, default="Active") # "Active" | "Suspended"
    suspension_reason = Column(String, nullable=True)
    referred_by_id = Column(String, ForeignKey("agent_profiles.id"), nullable=True)

    user = relationship("User", back_populates="employer_profile")
    referred_by = relationship("AgentProfile", back_populates="referred_employers")

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
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
    views_count = Column(String, default="0")
    applications_count = Column(String, default="0")
    employer_id = Column(String, ForeignKey("employer_profiles.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    employer = relationship("EmployerProfile", back_populates="jobs")

EmployerProfile.jobs = relationship("JobPosting", back_populates="employer")

