from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from dependencies.auth_dependency import get_current_user
from services.company_service import create_company_detail, get_company_detail, get_all_company_detail, update_company_detail 
from schemas.company_profile import CompanyCreate, CompanyResponse , CompanyUpdate, PaginatedCompanyResponse 

router = APIRouter(prefix = "/company",tags = ["company"]) 



@router.post("/",response_model = CompanyResponse)

def create_company(
        company_data:CompanyCreate,
        db:Session = Depends(get_db),
        current_user = Depends(get_current_user)
):
    return create_company_detail(
        company_data,
        db,
        current_user
    )


@router.get("/{company_id}", response_model = CompanyResponse) 

def get_company(
    company_id:int,
    db:Session = Depends(get_db)
): 
    return get_company_detail(
        company_id,
        db
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


@router.patch("/",response_model = CompanyResponse)

def update_company(
    company_id:int,
    data:CompanyUpdate,
    db:Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return update_company_detail(
        company_id = company_id,
        company_data = data,
        db = db,
        current_user = current_user
          ) 
