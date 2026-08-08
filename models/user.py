from sqlalchemy import Column, Integer,String, Boolean, DateTime
from sqlalchemy.orm import relationship
from database.db import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,unique= True, index=True, nullable=False)
    password = Column(String,nullable=False) 
    role = Column(String,nullable=False) 
    is_verified = Column(Boolean,default = False,nullable = False)
    verification_token = Column(String,unique = True,nullable= True) 
    verification_token_expiry = Column(DateTime,nullable = True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_token_expiry = Column(DateTime, nullable=True)
    
    applications = relationship("Application",back_populates="user",cascade="all,delete")  

    job = relationship("Jobs",back_populates="recruiter",cascade="all, delete") 
    applicant_profile = relationship("ApplicantProfile",back_populates="user",uselist=False,cascade="all, delete-orphan",
)

    recruiter_profile = relationship("RecruiterProfile",back_populates="user",uselist=False,cascade="all, delete-orphan",)

    saved_jobs = relationship("SavedJobs", back_populates="applicant") 
    company = relationship("Company", back_populates = "recruiter")
    
    
    





