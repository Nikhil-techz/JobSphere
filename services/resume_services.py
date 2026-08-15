from fastapi import HTTPException
from models.applicant_profile import ApplicantProfile
from models.application import Application
from sqlalchemy.orm import Session
from models.user import UserRole
from services.file_validator import validate_resume
from services.cloudinary_service import upload_resume_to_cloudinary, delete_resume 
from schemas.applicant_profile import ResumeUploadResponse


class ResumeService:

    @staticmethod 
    def upload_resume(
        file, 
        db,
        current_user
        ):
        if current_user.role != UserRole.applicant: 
            raise HTTPException( status_code=403, detail="Only applicants can upload their resume." )
        profile = (db.query(ApplicantProfile) .filter(ApplicantProfile.user_id == current_user.id).first() ) 
        if not profile: 
            raise HTTPException( status_code=404, detail="Profile does not exist." )
        resume_already_exists = profile.resume_url is not None
        validate_resume(file)

        try: 
            result = upload_resume_to_cloudinary(file) 
        except Exception as e: 
            raise HTTPException( status_code=500, detail=str(e) )
        try: 
            profile.resume_url = result["resume_url"] 
            profile.resume_public_id = result["resume_public_id"] 
            db.commit() 
            db.refresh(profile) 
        except Exception: 
            db.rollback() 
            raise HTTPException( status_code=500, detail="Failed to save resume details." )
        if resume_already_exists: 
            message = "Resume replaced successfully." 
        else: 
            message = "Resume uploaded successfully." 
        return ResumeUploadResponse( message=message, resume_url=profile.resume_url )

    @staticmethod
    def delete_resume(
        db,
        current_user
        ):
        if current_user.role != UserRole.applicant: 
            raise HTTPException( status_code=403, detail="Only applicants can delete their resume." )
        profile = ( db.query(ApplicantProfile).filter( ApplicantProfile.user_id == current_user.id ) .first() )
        if not profile:
            raise HTTPException( status_code=404, detail="Profile does not exist." )
        if not profile.resume_public_id: 
            raise HTTPException( status_code=404, detail="No resume uploaded." )

        application_using_resume = (db.query(Application) .filter( Application.resume_public_id == profile.resume_public_id ).first() )

        if application_using_resume:
            raise HTTPException( status_code=400, detail=( "This resume has been used in one or more job " "applications and cannot be deleted. " "Please replace your resume instead." ) )

        try: 
            delete_resume(profile.resume_public_id) 
        except Exception as e: 
            raise HTTPException( status_code=500, detail=str(e) )
        try: 
            profile.resume_url = None 
            profile.resume_public_id = None 
            db.commit() 
            db.refresh(profile) 
        except Exception: 
            db.rollback() 
            raise HTTPException(status_code=500, detail="Failed to delete resume")
        return { 
            "message": "Resume deleted successfully." 
            }



    @staticmethod
    def get_resume(
        db,
        current_user
    ):
        if current_user.role != UserRole.applicant:
            raise HTTPException(
                status_code=403,
                detail="Only applicants can access their resume."
            )

        profile = (
            db.query(ApplicantProfile)
            .filter(
                ApplicantProfile.user_id == current_user.id
            )
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
    
