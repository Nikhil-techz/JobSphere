from sqlalchemy.orm import Session
from fastapi import HTTPException
from utils.pagination import paginate
from models.company_profile import Company 
from models.user import UserRole 


class CompanyService:


    def create_company_detail(
            
            db:Session,
            user_data,
            current_user
            ):
        
        if current_user.role != UserRole.recruiter:
            raise HTTPException(status_code = 403, detail = "only recruiter can create company details.") 
        

        existing_company = (db.query(Company).filter(Company.recruiter_id == current_user.id).first())

        if existing_company: 
            raise HTTPException(status_code = 400,detail = "company already exists.")
    
        new_company_created = Company(
            **user_data.model_dump(),
            recruiter_id = current_user.id
            )
        
        db.add(new_company_created)
        db.commit()
        db.refresh(new_company_created) 
        return  new_company_created


    def get_company_detail(
            db:Session,
            user_id:int
            ):
        company = (db.query(Company).filter(Company.recruiter_id == user_id ).first())
        if not company:
            raise HTTPException(status_code = 404 , detail = "Company profile not found")
        return company 

    def get_all_company_detail(
            db:Session,
            page:int, 
            limit:int ,
            company_name = None ,
            industry = None
            ): 
        query = (db.query(Company)) 

        if company_name:
            query = query.filter(Company.name.ilike(f"%{company_name}%"))
        if industry:
            query = query.filter(Company.industry == industry) 

        return paginate(
            query = query,
            page = page,
            limit = limit
    )

    def update_company_detail(
        
            company_data,
            db:Session,
            current_user
            ): 
        
        if current_user.role != UserRole.recruiter:
            raise HTTPException(status_code = 403, detail = "only recruiter can update the company detail.")
        company = (db.query(Company).filter(Company.recruiter_id == current_user.id).first()) 
        if not company:
            raise HTTPException(status_code =404,detail = "company profile not found.")
        if company.recruiter_id != current_user.id:
            raise HTTPException(status_code = 403, detail = "You are not authorized to update this company." )

        update_data = company_data.model_dump(exclude_unset = True)

        for key, value in update_data.items():
            setattr(company, key, value)
        db.commit()
        db.refresh(company)
        return company 