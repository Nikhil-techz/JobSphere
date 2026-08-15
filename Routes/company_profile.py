from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from dependencies.auth_dependency import get_current_user
from services.company_service import CompanyService
from schemas.company_profile import CompanyCreate, CompanyResponse , CompanyUpdate, PaginatedCompanyResponse 
from schemas.dashboard import  RecruiterDashboardResponse

router = APIRouter(prefix="/company",tags = ["company"]) 

company_service = CompanyService


@router.post("/",response_model = CompanyResponse)

def create_company(
        company_data:CompanyCreate,
        db:Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    return company_service.create_company_detail(
        db = db,
        user_data = company_data,
        current_user = current_user
    )


@router.get("/me", response_model = CompanyResponse) 

def get_company(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
): 
    return company_service.get_company_detail(
        db = db,
        user_id = current_user.id

    )


@router.get("/companies", response_model = PaginatedCompanyResponse) 

def get_all_company(
    db:Session = Depends(get_db),
    page:int = 1,
    limit:int = 10,
    company_name:str | None = None,
    industry:str |None = None
):
    return company_service.get_all_company_detail (
        db = db,
        page = page,
        limit = limit,
        company_name = company_name,
        industry = industry
    )




@router.patch("/me",response_model = CompanyUpdate)

def update_my_company(
    
    data:CompanyUpdate,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return company_service.update_company_detail(
        
        company_data = data,
        db = db,
        current_user = current_user
          ) 


@router.get("/dashboard",response_model = RecruiterDashboardResponse)

def get_recruiter_dashboard(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return company_service.recruiter_dashboard(
        db = db,
        current_user = current_user
    )