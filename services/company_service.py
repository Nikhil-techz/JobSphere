from sqlalchemy.orm import Session
from fastapi import HTTPException
from utils.pagination import paginate
from models.company_profile import Company 
from models.user import UserRole 
from models.jobs import Jobs
from models.application import Application
from schemas.dashboard import RecruiterDashboardResponse




class CompanyService:

    @staticmethod
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

    @staticmethod
    def get_company_detail(
            db:Session,
            user_id:int
            ):
        company = (db.query(Company).filter(Company.recruiter_id == user_id ).first())
        if not company:
            raise HTTPException(status_code = 404 , detail = "Company profile not found")
        return company 

    
    @staticmethod
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

    
    
    @staticmethod
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
        if "website" in update_data:
            if update_data["website"] is not None:
                update_data["website"] = str(
                update_data["website"]
            )

        if "company_size" in update_data:
            if update_data["company_size"] is not None:
                update_data["company_size"] = (
                update_data["company_size"].value
            )

        for key, value in update_data.items():
            setattr(company, key, value)
        db.commit()
        db.refresh(company)
        return company 

    
    @staticmethod
    def recruiter_dashboard(
        db : Session,
        current_user
        
):
        
        if current_user.role != UserRole.recruiter:
            raise HTTPException(status_code = 403, detail = "Only recruiter can access this dashboard.")

        active_jobs = (db.query(Jobs).filter(Jobs.recruiter_id == current_user.id,
                                         Jobs.is_active == True).count())
        closed_jobs = (db.query(Jobs).filter(Jobs.recruiter_id == current_user.id,
                                         Jobs.is_active == False).count())

    
        total_applicants = (db.query(Application).join(Jobs, Application.job_id == Jobs.id).filter(Jobs.recruiter_id == current_user.id).count()) 

        return RecruiterDashboardResponse(
            active_jobs = active_jobs,
            closed_jobs = closed_jobs,
            total_applicants = total_applicants

    )