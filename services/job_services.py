from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.jobs import Jobs
from models.company_profile import Company
from models.user import UserRole
from utils.pagination import paginate
from datetime import datetime


class JobService:
    def create_job(
            self,
            db,
            job_data,
            current_user
    ):
        if current_user.role != UserRole.recruiter:
            raise HTTPException(status_code = 403, detail = "only recruiter can post jobs." )
        
        company = (db.query(Company).filter(Company.recruiter_id == current_user.id).first()) 
        if not company:
            raise HTTPException(status_code = 400, detail = "Please create your company profile first")

        job = Jobs( 
            title=job_data.title, 
            description=job_data.description, 
            company_id=company.id, 
            location=job_data.location,
            salary=job_data.salary, 
            experience_level=job_data.experience_level, 
            skills=job_data.skills, 
            recruiter_id=current_user.id ) 
        db.add(job) 
        db.commit()
        db.refresh(job) 
        return job 



    def get_jobs(
            self,
            db,
            title: str | None = None,
            company: str | None = None,
            location: str | None = None,
            experience_level: str | None = None,
            sort: str | None = None,
            page:int = 1 , 
            limit:int = 10
):
        query = db.query(Jobs).join(Jobs.company).filter(Jobs.is_active.is_(True)) 

        if title:
         
         query = query.filter(Jobs.title.ilike(f"%{title}%"))

        if company:
            query = query.filter(Jobs.company.name.ilike(f"%{company}%"))

        if location:
         query = query.filter(Jobs.location.ilike(f"%{location}%"))

        if experience_level is not None:
            query = query.filter(Jobs.experience_level == experience_level)
        if sort == "latest":
            query = query.order_by(Jobs.created_at.desc())

        elif sort == "oldest":

            query = query.order_by(Jobs.created_at.asc())


        return paginate(
        query=query,
        page=page,
        limit=limit
    )

    def get_job_by_id(
            self,
            id,
            db,
            current_user
            ):
        
        
        if current_user.role != UserRole.applicant:
            raise HTTPException(status_code = 403, detail = "Only applicant can access jobs.")


        jobs = (db.query(Jobs).filter(Jobs.id == id,Jobs.is_active == True).first()) 
        if not jobs:
            raise HTTPException(status_code = 404,detail=f"Job With ID {id} not found")
        return jobs


    def update_job(
        self,
        db,
        job_id,
        job_data,
        current_user
    ):
        if current_user.role != UserRole.recruiter:
            raise HTTPException(
                status_code=403,
                detail="Only Recruiters Can Update Jobs."
            )

        job = db.query(Jobs).filter(Jobs.id == job_id, Jobs.is_active == True).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail=f"Job With ID {job_id} not found"
            )
        
        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to update this job."
            )

        update_data = job_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(job, field, value)

        db.commit()
        db.refresh(job)

        return job

    def feature_job(
        self,
        db,
        job_id,
        job_data,
        current_user
    ):
        if current_user.role != UserRole.recruiter:
            raise HTTPException(
                status_code=403,
                detail="Only Recruiters Can Feature Jobs."
            )

        job = db.query(Jobs).filter(Jobs.id == job_id,Jobs.is_active == True).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail=f"Job with ID {job_id} not found."
            )
        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to feature this job."
            )

        job.is_featured = job_data.is_featured
        job.featured_until = job_data.featured_until
        job.featured_priority = job_data.featured_priority

        db.commit()
        db.refresh(job)

        return job

    def get_featured_jobs(
        self,
        db
    ):
        featured_jobs = db.query(Jobs).filter(
            Jobs.is_active == True,
            Jobs.is_featured == True,
            Jobs.featured_until >= datetime.utcnow()
        ).order_by(
            Jobs.featured_priority.desc()
        ).limit(10).all()

        return featured_jobs


    def delete_job(
        self,
        db: Session,
        job_id: int,
        current_user
    ):
        if current_user.role != UserRole.recruiter:
            raise HTTPException(
                status_code=403,
                detail="Only Recruiters Can Delete Jobs."
            )

        job = db.query(Jobs).filter(
            Jobs.id == job_id,
            Jobs.is_active == True
        ).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job Not Found"
            )
        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to delete this job."
            )

        # soft delete
        job.is_active = False

        db.commit()

        return {"message": "Job Deleted Successfully"}


    
