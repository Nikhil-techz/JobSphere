from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from dependencies.auth_dependency import get_current_user
from services.applicant_dashboard import applicant_dashboard
from services.recruiter_dashboard import recruiter_dashboard
from schemas.dashboard import ApplicantDashboardResponse , RecruiterDashboardResponse

router = APIRouter(prefix = "/dashboard", tags = ["Dashboard"])


@router.get("/", response_model = ApplicantDashboardResponse)
def get_applicant_dashboard(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return applicant_dashboard(
        db = db,
        current_user = current_user
    )

@router.get("/",response_model = RecruiterDashboardResponse)

def get_recruiter_dashboard(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return recruiter_dashboard(
        db = db,
        current_user = current_user
    )

