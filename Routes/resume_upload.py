from sqlalchemy.orm import Session 
from dependencies.auth_dependency import get_current_user
from database.dependency import get_db
from schemas.applicant_profile import ResumeUploadResponse
from fastapi import APIRouter,Depends ,File, UploadFile
from services.resume_services import ResumeService 

router = APIRouter(prefix="/resume",tags=["Resume"]) 

@router.post("/upload-resume",response_model = ResumeUploadResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return ResumeService.upload_resume(
        file=file,
        db=db,
        current_user=current_user
    )




@router.get("/",response_model=ResumeUploadResponse)
def get_resume(
    db: Session = Depends(get_db),
    current_user  = Depends(get_current_user)
):
    return ResumeService.get_resume(
        db=db,
        current_user=current_user
    )



@router.delete("/")
def delete_uploaded_resume(
    db: Session = Depends(get_db),
    current_user =  Depends(get_current_user)
):
    return ResumeService.delete_resume(
        db=db,
        current_user=current_user
    ) 

