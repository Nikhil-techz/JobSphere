from sqlalchemy import Column, Integer,String, ForeignKey, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime

class SavedJobs(Base):
    __tablename__ = "saved_jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Applicant who saved the job
    applicant_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Job that was saved
    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    saved_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Prevent the same applicant from saving the same job more than once
    
    __table_args__ = (
        UniqueConstraint(
            "applicant_id",
            "job_id",
            name="uq_saved_job"
        ),
    )

    # Applicant => saved jobs
    applicant = relationship(
        "Users",
        back_populates="saved_jobs"
    )

    # Saved Job => Job
    job = relationship(
        "Jobs",
        back_populates="saved_jobs"
    )


