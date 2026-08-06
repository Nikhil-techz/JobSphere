from pydantic import BaseModel, ConfigDict
from typing import Optional
class ApplicantProfileBase(BaseModel):
    full_name:str
    contact:str
    location: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    profile_picture: Optional[str] = None 

class ApplicantProfileCreate(ApplicantProfileBase):
    pass


class UpdateApplicantProfile(BaseModel):
    full_name:Optional[str] = None
    contact:Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    linkedin: Optional[str] = None
    github:  Optional[str] = None
    profile_picture: Optional[str] = None 
    

class ResumeUploadResponse(BaseModel):
    message:str
    resume_url:str
class ApplicantProfileResponse(ApplicantProfileBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
    