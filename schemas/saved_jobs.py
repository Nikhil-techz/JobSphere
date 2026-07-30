from pydantic import BaseModel
from datetime import datetime
from schemas.job import JobResponse

class SavedJobsCreate(BaseModel):
    job_id:int

class SavedJobResponse(BaseModel):
    id:int
    job_id:int
    applicant_id:int
    saved_at:datetime

    class Config:
        from_attributes = True

class SavedJobList(BaseModel):
    id:int
    saved_at:datetime
    job:JobResponse

    class Config:
        from_attributes = True 


