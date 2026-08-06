from pydantic import BaseModel , ConfigDict
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    description: str
    company: str
    location:str
    salary:int
    experience_level:int
    skills:str




class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    location:Optional[str] = None
    salary: Optional[int] = None 
    experience_level:Optional[int] = None
    skills:Optional[str] = None


class FeatureJob(BaseModel):
    is_featured: bool
    featured_until: datetime | None = None
    featured_priority: int = 0

class JobResponse(JobBase):
    id: int
    is_active:bool
    created_at:datetime
    is_featured: bool
    featured_until: datetime | None = None
    featured_priority: int
    class Config:

         model_config = ConfigDict(from_attributes=True)

class PaginatedJobResponse(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int
    data: list[JobResponse]

    model_config = {"from_attributes": True}  
