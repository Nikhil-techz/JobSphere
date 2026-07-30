from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.saved_jobs import SavedJobs
from models.jobs import Jobs
from schemas.user import UserRole
from schemas.saved_jobs import SavedJobList
def save_job(
        db:Session,
        current_user,
        job_id:int
        
):
    if current_user.role != UserRole.applicant:
        raise HTTPException(status_code = 403,detail = "Only applicants can save jobs.") 
    job = (db.query(Jobs).filter(Jobs.id == job_id).first())
    if not job:
        raise HTTPException(status_code = 404, detail = "jobs not found.")

    existing_save_jobs = (db.query(SavedJobs).filter(SavedJobs.applicant_id == current_user.id,
                                                     SavedJobs.job_id == job_id).first())
    if existing_save_jobs:
        raise HTTPException(status_code = 400, detail = "Job already Saved") 
    create_save_job = SavedJobs(
        applicant_id = current_user.id,
        job_id = job_id
    )
    db.add(create_save_job)
    db.commit()
    db.refresh(create_save_job) 
    return create_save_job




def unsave_jobs(
        db:Session,
        current_user,
        job_id:int
):
    if current_user.role != UserRole.applicant:
        raise HTTPException(status_code = 403, detail = "only applicants can unsave Jobs.")

    find_save_job = (db.query(SavedJobs).filter(SavedJobs.applicant_id == current_user.id,
                                                SavedJobs.job_id == job_id).first())
    if not find_save_job:
        raise HTTPException(status_code =404, detail = "No saved Jobs.") 
    db.delete(find_save_job)
    db.commit()
    return {"message": "Job unsaved successfully."} 




def get_saved_jobs(
        db:Session,
        current_user
        
):
    if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403, detail = "only applicants can get the  Jobs.")
    saved_jobs = (db.query(SavedJobs).filter(SavedJobs.applicant_id == current_user.id).all())
    
    response = []
    for saved_job in saved_jobs:
        response.append(
            SavedJobList(
                id= saved_job.id,
                saved_at = saved_job.saved_at,
                job = saved_job.job
                  )
        )

    return response 

