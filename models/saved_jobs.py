from sqlalchemy import Column, Integer,String, ForeignKey, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime

class SavedJobs(Base):
    __tablename__ = "saved_jobs" 
    id = Column(Integer,primary_key = True, index = True,nullable = False)
    applicant_id = Column(Integer,ForeignKey("users.id",ondelete = "CASCADE"), nullable = False) 
    job_id = Column(Integer, ForeignKey("jobs.id",ondelete = "CASCADE"),nullable = False)
    __table_args__ = (
        UniqueConstraint(
            "applicant_id",
            "job_id",
            name="uq_saved_job"
        ),)
    saved_at = Column(DateTime,default = datetime.utcnow,nullable = False)
    applicant = relationship("Users",back_populates= "saved_jobs")
    job = relationship("Jobs",back_populates = "saved_by")
