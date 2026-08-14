from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.application import Application
from models.jobs import Jobs
from schemas.dashboard import RecruiterDashboardResponse
from schemas.user import UserRole 

def recruiter_dashboard(
        db : Session,
        current_user
        
):
    if current_user.role != UserRole.recruiter:
        raise HTTPException(status_code = 403, detail = "Only recruiter can access this dashboard.")

    active_jobs = (db.query(Jobs).filter(Jobs.recruiter_id == current_user.id,
                                         Jobs.is_active == True).count())
    closed_jobs = (db.query(Jobs).filter(Jobs.recruiter_id == current_user.id,
                                         Jobs.is_active == False).count())

    
    total_applicants = (db.query(Application).join(Jobs, Application.job_id == Jobs.id).filter(Jobs.recruiter_id == current_user.id).count()) 

    return RecruiterDashboardResponse(
        active_jobs = active_jobs,
        closed_jobs = closed_jobs,
        total_applicants = total_applicants

    )

