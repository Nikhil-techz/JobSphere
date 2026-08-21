from fastapi import FastAPI
from config.settings import settings 
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
from Routes import (
    user,auth,jobs,application,applicant_profile, 
    resume_upload,saved_jobs,company_profile,oauth

    )
from starlette.middleware.sessions import SessionMiddleware


app = FastAPI()

app.add_middleware(
    SessionMiddleware,
    secret_key = settings.SESSION_SECRET_KEY,
    same_site="lax",
    https_only=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL
        
    ],
    allow_credentials= True,
    
   
    allow_methods=["*"],
    allow_headers=["*"],
)



Base.metadata.create_all(bind=engine)
app.include_router(user.router)
app.include_router(auth.router) 
app.include_router(jobs.router)
app.include_router(application.router) 
app.include_router(applicant_profile.router)
app.include_router(resume_upload.router) 
app.include_router(saved_jobs.router)
app.include_router(company_profile.router)
app.include_router(oauth.router)


@app.get("/")
def home():
    return {"message": "Job listing app is running "} 


