from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from dependencies.auth_dependency import get_current_user
from services.saved_job_services import save_job, unsave_jobs, get_saved_jobs
from schemas.saved_jobs import SavedJobList,SavedJobResponse

router = APIRouter(prefix = "/saved-jobs",tags = ["Saved jobs"])

@router.post("/{job_id}",response_model = SavedJobResponse) 
def create_save_jobs(
    job_id:int,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return save_job(
        db = db,
        current_use = current_user,
        job_id = job_id


    )
@router.delete("/{job_id}")
def delete_saved_jobs(
    job_id:int,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)

):
    return unsave_jobs(
        db = db,
        current_user = current_user,
        job_id = job_id
    )

@router.get("/",response_model = list[SavedJobList])
def get_saved_job(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_saved_jobs(
        db = db,
        current_user = current_user
        )