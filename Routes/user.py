from fastapi import APIRouter, Depends, HTTPException , BackgroundTasks
from config.settings import settings
from sqlalchemy.orm import Session 
from models.user import Users 
from schemas.user import UserCreate
from config.security import hash_password 
from database.dependency import get_db
from services.Email_service import  send_email_verification_email
from services.verification_service import generate_verification_token, verification_token_expiry, hash_verification_token

router = APIRouter(prefix = "/auth",tags = ["Authentication"])

@router.post("/register")
async def register(
    user_data:UserCreate,
    background_tasks:BackgroundTasks,
    db:Session = Depends(get_db)):
    
    existing_user = db.query(Users).filter(Users.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code= 400,detail="Email already registered")
    name_parts = user_data.name.lower().split()
    password = user_data.password.lower()
    for part in name_parts:
        if len(part) >= 3 and part in password:
            raise HTTPException(status_code=400, detail="Password cannot contain your name.")
     
    
    hashed_password = hash_password(user_data.password) 
    raw_token = generate_verification_token()
    hashed_token = hash_verification_token(raw_token)
    token_expiry = verification_token_expiry()
    verification_link = (
    f"{settings.BACKEND_URL}/auth/verify-email?token={raw_token}"
)
    new_user_created = Users(
        name = user_data.name,
        email = user_data.email,
        password = hashed_password,
        role = user_data.role,
        verification_token = hashed_token,
        verification_token_expiry = token_expiry

    )

    db.add(new_user_created)
    db.commit()
    db.refresh(new_user_created)
    background_tasks.add_task(
        send_email_verification_email,
        user_data.email,
        user_data.name,
        verification_link
    )
    return {"message":"Registration successful. Please check your email to verify your account."} 
