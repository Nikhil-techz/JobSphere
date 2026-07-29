from sqlalchemy.orm import Session
from models.jobs import Jobs
from utils.pagination import paginate

def get_jobs(
    db: Session,
    title: str | None = None,
    company: str | None = None,
    location: str | None = None,
    experience_level: int | None = None,
    sort: str | None = None,
    page:int = 1 , 
    limit:int = 10
):
    query = db.query(Jobs).filter(Jobs.is_active.is_(True))

    if title:
        query = query.filter(Jobs.title.ilike(f"%{title}%"))

    if company:
        query = query.filter(Jobs.company.ilike(f"%{company}%"))

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