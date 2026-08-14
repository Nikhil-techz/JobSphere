from sqlalchemy import Column, Integer, String, ForeignKey,DateTime,Enum
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime
from schemas.application import ApplicationStatus

class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Applicant who applied
    applicant_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Job being applied for
    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    status = Column(
        Enum(ApplicationStatus),
        nullable=False,
        default=ApplicationStatus.PENDING
    )

    resume_url = Column(
        String,
        nullable=False
    )

    resume_public_id = Column(
        String,
        nullable=True
    )

    applied_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    ## Relationships
    

    user = relationship(
        "Users",
        back_populates="applications"
    )

    job = relationship(
        "Jobs",
        back_populates="applications"
    )

    
