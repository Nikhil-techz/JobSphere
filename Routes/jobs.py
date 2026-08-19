from fastapi import APIRouter, Depends, HTTPException 
from fastapi import Query
from typing import List
from dependencies.auth_dependency import get_current_user
from sqlalchemy.orm import Session 
from models.jobs import Jobs
from schemas.job import JobCreate,JobResponse,JobUpdate,FeatureJob,PaginatedJobResponse
from models.user import UserRole
from database.dependency import get_db
from services.job_services import JobService

router = APIRouter(prefix="/jobs",tags=["Jobs"])

job_service = JobService()

@router.post("/",response_model = JobResponse,status_code=201)

def create_job(
    job_data:JobCreate,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)

):
    return job_service.create_job(
        db = db,
        job_data = job_data,
        current_user = current_user

    )


 


@router.get("/",response_model = PaginatedJobResponse) 
def get_all_jobs(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user),
    title: str | None = None,
    company: str | None = None,
    location: str | None = None,
    experience_level: int | None = None,
    sort :str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
    ):
    if current_user.role != UserRole.applicant:
        raise HTTPException(status_code = 403, detail = "Only applicant can access jobs.")

    return job_service.get_jobs(
        db = db,
        title=title,
        company=company,
        location=location,
        experience_level = experience_level,
        sort = sort,
        page = page,
        limit = limit
    )


@router.get("/{id}",response_model = JobResponse)
def get_job_by_id(
    id:int,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)):
    return job_service.get_job_by_id(
        id = id,
        db = db,
        current_user = current_user
    )
    


@router.put("/{job_id}",response_model = JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return job_service.update_job(
        db=db,
        job_id=job_id,
        job_data=job_data,
        current_user=current_user
    )


@router.patch("/{job_id}/feature",response_model = JobResponse)
def feature_job(
    job_id: int,
    job_data: FeatureJob,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return job_service.feature_job(
        db=db,
        job_id=job_id,
        job_data=job_data,
        current_user=current_user
    )

    
@router.get("/featured", response_model=list[JobResponse])
def get_featured_jobs(
    db: Session = Depends(get_db)
):
    return job_service.get_featured_jobs(
        db=db
    )



@router.delete("/{job_id}") 
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return job_service.delete_job(
        db=db,
        job_id=job_id,
        current_user=current_user
    )
 