from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.user import UserRole
from models.application import Application
from models.jobs import Jobs
from models.user import Users
from models.applicant_profile import ApplicantProfile 
from schemas.application import ApplicationStatus, RecruiterApplicationResponse
from services.Email_service import EmailService
class ApplicationService:

    @staticmethod
    async def create_application(
    application_create,
    background_tasks,
    db: Session ,
    current_user 
    ):

        if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403, detail = "only applicants can apply for job")
        existing_job = (db.query(Jobs).filter(Jobs.id == application_create.job_id).first()) 
        if not existing_job:
            raise HTTPException(status_code=404,detail=f"Job with id {application_create.job_id} not found")
        existing_application = (db.query(Application).
                                filter(Application.applicant_id == current_user.id,
                                       Application.job_id == application_create.job_id).first()) 
        if existing_application:
            raise HTTPException(status_code = 409, detail = "You have already applied for this job")
        applicant_profile = (
            db.query(ApplicantProfile)
            .filter(ApplicantProfile.user_id == current_user.id)
        .first()
    )

        if not applicant_profile:
            raise HTTPException(
                status_code=404,
                detail="Applicant profile not found."
        )

    # Check resume
        if not applicant_profile.resume_url:
            raise HTTPException(
                status_code=400,
                detail="Please upload your resume before applying."
        )
    
        new_application = Application(
            applicant_id=current_user.id,
            job_id=application_create.job_id,
            resume_url=applicant_profile.resume_url,
            resume_public_id=applicant_profile.resume_public_id
    )

        db.add(new_application)
        db.commit()
        db.refresh(new_application)
        background_tasks.add_task(
        EmailService.application_submitted_email,
        current_user.email,
        current_user.name,
        Jobs.title,
        Jobs.company

    )
        return new_application 


    @staticmethod
    def get_my_applications(
            db,
            current_user):
        if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403,detail = "Only applicants can view their applications")
        applications = (db.query(Application).filter(Application.applicant_id == current_user.id).all()) 
    
        return applications 



    @staticmethod
    def get_job_applications(
        job_id,
        db,
        current_user):
        if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403, detail = "only recruiter can see the job applications")

        job =(db.query(Jobs).filter(Jobs.id == job_id).first()) 
        if not job:
            raise HTTPException(status_code = 404, detail = "Jobs with id {job_id} not exists.")
    
        if job.recruiter_id != current_user.id:
            raise HTTPException(status_code = 403,detail = "You are not authorized to view applications for this job.")
        job_applications = (db.query(Application).filter(Application.job_id == job_id).all()) 
        response = []
        for application in job_applications:
            response.append(
                RecruiterApplicationResponse(
                application_id = application.id,
                applicant_id = application.applicant_id,
                applicant_name = application.user.name,
                applicant_email = application.user.email,
                status = application.status,
                applied_at = application.applied_at,
                resume_url = application.resume_url
            )
        )
        return response 

    @staticmethod
    async def update_application(
        application_id, 
        application_update, 
        background_tasks, 
        db, 
        current_user
        ):

        if current_user.role != UserRole.recruiter: 
            raise HTTPException( status_code=403, detail="You are not authorized to update the application." )
        application = ( db.query(Application) .filter( Application.id == application_id ) .first() ) 
        if not application: 
            raise HTTPException( status_code=404, detail=f"Application with id {application_id} does not exist" ) 
        applicant = ( db.query(Users) .filter( Users.id == application.applicant_id ) .first() )
        job = (db.query(Jobs).filter(Jobs.id == application.job_id).first()) 

            
        if job.recruiter_id != current_user.id:
            raise HTTPException(status_code = 403, detail = "You are not authorized to update this application") 
        
        application.status = application_update.status 
        db.commit()
        db.refresh(application)
        background_tasks.add_task(

            EmailService.send_application_status_email,
            applicant.email,
            applicant.name,
            job.title,
            application.status.value
        )

        return application 

    @staticmethod
    def withdraw_application(
        application_id,
        db:Session,
        current_user):

        if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403,detail = "Only Applicants can withdrawn the applications.")
        
        application = (db.query(Application).filter(Application.id == application_id).first())
        if not application:
            raise HTTPException(status_code = 404, detail = f"Application with {application_id} does not exists.")

        if application.applicant_id != current_user.id:
            raise HTTPException(status_code = 403, detail = "You are not authorized to withdraw this application.")

        if application.status == ApplicationStatus.WITHDRAWN:
            raise HTTPException(status_code = 409,detail="Application has already been withdrawn.")
        if application.status == ApplicationStatus.APPLIED:
            application.status = ApplicationStatus.WITHDRAWN
            db.commit()
            db.refresh(application)
            return application 
        raise HTTPException(status_code=400,detail="Application cannot be withdrawn after the review process has started.")  
