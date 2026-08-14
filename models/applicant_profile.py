from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base


class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    contact = Column(
        String(15),
        nullable=False
    )

    location = Column(
        String(100),
        nullable=False
    )

    experience = Column(
        String,
        nullable=True
    )

    education = Column(
        String,
        nullable=True
    )

    linkedin = Column(
        String,
        nullable=True
    )

    github = Column(
        String,
        nullable=True
    )

    profile_picture = Column(
        String,
        nullable=True
    )

    resume_url = Column(
        String,
        nullable=True
    )

    resume_public_id = Column(
        String,
        nullable=True
    )

    # User ↔ ApplicantProfile (1:1)
    user = relationship(
        "Users",
        back_populates="applicant_profile"
    )
    