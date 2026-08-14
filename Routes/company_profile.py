from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from dependencies.auth_dependency import get_current_user
from services.company_service import create_company_detail, get_company_detail, get_all_company_detail, update_company_detail 
from schemas.company_profile import CompanyCreate, CompanyResponse , CompanyUpdate, PaginatedCompanyResponse 
from services.recruiter_dashboard import recruiter_dashboard
from schemas.dashboard import  RecruiterDashboardResponse

router = APIRouter(prefix="/company",tags = ["company"]) 



@router.post("/",response_model = CompanyResponse)

def create_company(
        company_data:CompanyCreate,
        db:Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    return create_company_detail(
        db = db,
        user_data = company_data,
        current_user = current_user
    )


@router.get("/me", response_model = CompanyResponse) 

def get_company(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
): 
    return get_company_detail(
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
    return get_all_company_detail (
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
    return update_company_detail(
        
        company_data = data,
        db = db,
        current_user = current_user
          ) 


@router.get("/dashboard",response_model = RecruiterDashboardResponse)

def get_recruiter_dashboard(
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return recruiter_dashboard(
        db = db,
        current_user = current_user
    )