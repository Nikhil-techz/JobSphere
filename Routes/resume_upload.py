import logging
logger = logging.getLogger(__name__)
from services.cloudinary_service import upload_resume_to_cloudinary, delete_resume 
from models.applicant_profile import ApplicantProfile
from models.application import Application
from sqlalchemy.orm import Session 
from dependencies.auth_dependency import get_current_user
from database.dependency import get_db
from fastapi import APIRouter,Depends, HTTPException ,File, UploadFile 
from schemas.applicant_profile import (ApplicantProfileBase,ApplicantProfileCreate,
                                       UpdateApplicantProfile,ApplicantProfileResponse,ResumeUploadResponse) 
from services.file_validator import validate_resume

router = APIRouter(prefix="/resume",tags=["Resume"])

@router.post("/upload-resume",response_model = ResumeUploadResponse)

def upload_resume(file:UploadFile = File(...),db:Session = Depends(get_db),current_user = Depends(get_current_user)):
    if current_user.role != "applicant":
        raise HTTPException(status_code = 403, detail = "Only applicants can upload their Resume.")
    profile = (db.query(ApplicantProfile).filter(ApplicantProfile.user_id == current_user.id).first())
    if not profile:
        raise HTTPException(status_code = 404, detail = "Profile does not Exist.")
    
    
    resume_already_exists = profile.resume_url is not None
    

    validate_resume(file)
    
    try:
        result = upload_resume_to_cloudinary(file)
    except Exception as e:
        raise HTTPException(status_code = 500, detail = str(e))
    try:
        profile.resume_url = result["resume_url"]
        profile.resume_public_id = result["resume_public_id"]
        db.commit()
        db.refresh(profile)
        
    
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to save resume details."
    )
    if resume_already_exists:
        message = "Resume replaced successfully."
    else:
        message = "Resume uploaded successfully."

    return ResumeUploadResponse(
        message=message,
        resume_url=profile.resume_url
    )


@router.delete("/resume")
def delete_uploaded_resume(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "applicant":
        raise HTTPException(
            status_code=403,
            detail="Only applicants can delete their resume."
        )

    profile = (
        db.query(ApplicantProfile)
        .filter(ApplicantProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile does not exist."
        )

    if not profile.resume_public_id:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded."
        )
    application_using_resume = (
        db.query(Application)
        .filter(Application.resume_public_id == profile.resume_public_id)
        .first()
    )

    if application_using_resume:
        raise HTTPException(
            status_code=400,
            detail="This resume has been used in one or more job applications and cannot be deleted. Please replace your resume instead."
        )

    try:
        delete_resume(profile.resume_public_id)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    try:
        profile.resume_url = None
        profile.resume_public_id = None

        db.commit()
        db.refresh(profile)

        return {
            "message": "Resume deleted successfully."
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete resume."
        )

@router.get("/resume", response_model=ResumeUploadResponse)
def get_resume(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != "applicant":
        raise HTTPException(
            status_code=403,
            detail="Only applicants can access their resume."
        )

    profile = (
        db.query(ApplicantProfile)
        .filter(ApplicantProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile does not exist."
        )

    if not profile.resume_url:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded."
        )

    return ResumeUploadResponse(
        message="Resume fetched successfully.",
        resume_url=profile.resume_url
    )