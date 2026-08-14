from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship

from database.db import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # One recruiter owns one company
    recruiter_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    name = Column(
        String(255),
        unique=True,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    website = Column(
        String(255),
        nullable=True
    )

    industry = Column(
        String(100),
        nullable=False
    )

    company_size = Column(
        String(50),
        nullable=True
    )

    location = Column(
        String(255),
        nullable=False
    )

    logo = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Company → Recruiter
    recruiter = relationship(
        "Users",
        back_populates="company"
    )

    # Company → Jobs
    jobs = relationship(
        "Jobs",
        back_populates="company",
        cascade="all, delete-orphan"
    )