from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.application import Application
from models.saved_jobs import SavedJobs
from schemas.user import UserRole
from schemas.application import ApplicationStatus
from schemas.dashboard import ApplicantDashboardResponse


def applicant_dashboard(
        db:Session,
        current_user
):
    if current_user.role != UserRole.applicant:
        raise HTTPException(status_code = 403, detail = "Only applicants can access this dashboard.")

    total_applications = (db.query(Application).filter(Application.applicant_id == current_user.id).count()) 
    under_review = (db.query(Application).filter(Application.applicant_id == current_user.id,
        Application.status == ApplicationStatus.REVIEWING).count())
    shortlisted = (db.query(Application).filter(Application.applicant_id == current_user.id,
        Application.status == ApplicationStatus.SHORTLISTED).count()) 
    rejected = (db.query(Application).filter(Application.applicant_id == current_user.id,
        Application.status == ApplicationStatus.REJECTED).count()) 
    saved_jobs = (db.query(SavedJobs).filter(SavedJobs.applicant_id == current_user.id).count()) 

    return ApplicantDashboardResponse(
        total_applications = total_applications,
        under_review= under_review,
        shortlisted = shortlisted,
        rejected = rejected,
        saved_jobs = saved_jobs

    )
