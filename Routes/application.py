from fastapi import APIRouter,Depends, HTTPException , BackgroundTasks
from sqlalchemy.orm import Session 
from models.application import Application
from models.user import UserRole
from schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    RecruiterApplicationResponse,
    UpdateApplicationStatus,
) 

from dependencies.auth_dependency import get_current_user
from database.dependency import get_db
from services.application_service import ApplicationService
from services.Email_service import EmailService


router = APIRouter(prefix="/Applications",tags=["Applications"])

@router.post("/",response_model= ApplicationResponse,status_code = 201)

async def create_application(
    application_create: ApplicationCreate,
    background_tasks:BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return ApplicationService.create_application(
        application_create=application_create,
        background_tasks=background_tasks,
        db=db,
        current_user=current_user
    )
    
     


@router.get("/my-applications",response_model = list[ApplicationResponse])

def get_my_applications(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ): 
    return ApplicationService.get_my_applications(
        db = db,
        current_user = current_user
    )
    



@router.get("/jobs/{job_id}/applications",response_model = list[RecruiterApplicationResponse]) 

def get_job_applications(
    job_id:int,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):
    return ApplicationService.get_job_applications(
        job_id = job_id,
        db = db,
        current_user = current_user
    )
   


@router.patch("/application/{application_id}",response_model = ApplicationResponse) 

async def update_application(
    application_id:int,
    application_update:UpdateApplicationStatus,
    background_tasks:BackgroundTasks,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):
    return ApplicationService.update_application(
        application_id = application_id,
        application_update = application_update,
        background_tasks = BackgroundTasks,
        db =db,
        current_user = current_user
    )

     
  
@router.patch("/application/{application_id}/withdraw") 

def withdraw_application(
    application_id:int,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
    ):
    return ApplicationService.withdraw_application(
        application_id = application_id,
        db = db,
        current_user = current_user
    )

    