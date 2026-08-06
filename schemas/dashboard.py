from pydantic import BaseModel
from datetime import datetime

class ApplicantDashboardResponse(BaseModel):
    total_applications:int
    under_review:int
    rejected:int
    shortlisted:int
    saved_jobs:int

class RecentApplicationResponse(BaseModel):
    applicant_name: str
    job_title: str
    status: str
    applied_at: datetime




class RecruiterDashboardResponse(BaseModel):
    active_jobs:int
    closed_jobs:int
    total_applicants:int
    
