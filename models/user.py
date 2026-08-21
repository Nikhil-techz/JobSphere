from sqlalchemy import Column, Integer,String, Boolean, DateTime, Enum
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship
from database.db import Base


class UserRole(PyEnum):
    applicant = "applicant"
    recruiter = "recruiter"

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,unique= True, index=True, nullable=False)
    password = Column(String,nullable=True)  
    role = Column(Enum(UserRole),nullable=False) 
    auth_provider = Column(String,nullable=False,default="local")

    google_id = Column(String, unique=True, nullable=True)
    is_verified = Column(Boolean,default = False,nullable = False)
    verification_token = Column(String,unique = True,nullable= True) 
    verification_token_expiry = Column(DateTime(timezone=True),nullable = True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_token_expiry = Column(DateTime(timezone=True), nullable=True)
    is_deletion_requested = Column( Boolean,default=False,nullable=False)

    deletion_requested_at = Column(DateTime,nullable=True)
    deletion_scheduled_for = Column(DateTime, nullable=True)


    
    applications = relationship("Application",back_populates="user",cascade="all,delete")  
    jobs = relationship("Jobs",back_populates="recruiter",cascade="all, delete") 
    saved_jobs = relationship("SavedJobs", back_populates="applicant") 
    company = relationship("Company", back_populates = "recruiter",  uselist=False)
    applicant_profile = relationship( "ApplicantProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
)
    
    
    
    





