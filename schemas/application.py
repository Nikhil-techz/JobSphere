from datetime import datetime
from enum import Enum
from pydantic import BaseModel , ConfigDict




class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"

class ApplicationBase(BaseModel):
    job_id: int


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationResponse(ApplicationBase):
    id: int
    # applicant_id: int
    status: ApplicationStatus
    resume_url:str
    applied_at: datetime
    

    model_config = ConfigDict(from_attributes=True)



class RecruiterApplicationResponse(BaseModel):
    application_id: int
    applicant_id: int
    applicant_name: str
    applicant_email: str
    status: ApplicationStatus
    applied_at: datetime
    resume_url: str

    model_config = {
        "from_attributes": True
    }
 


class UpdateApplicationStatus(BaseModel):
    status: ApplicationStatus