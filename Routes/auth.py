from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi import Response
from datetime import datetime, timezone, timedelta
# from fastapi.security import OAuth2PasswordRequestForm
from config.security import create_access_token 
from config.settings import settings
from dependencies.auth_dependency import get_current_user
from sqlalchemy.orm import Session
from models.user import Users
from schemas.user import UserLogin, ForgotPasswordRequest,ChangePassword, ResetPasswordRequest, DeleteAccountRequest
from config.security import verify_password, hash_password
from config.settings import settings
from database.dependency import get_db
from services.verification_service import generate_verification_token, hash_verification_token, verification_token_expiry
from services.Email_service import send_welcome_email , send_password_reset_email, send_reset_password_success

router = APIRouter(prefix= "/auth", tags = ["Authentication"]) 


@router.post("/login")
async def login(
    login_data:UserLogin,
    response:Response,
    db:Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == login_data.email).first()
    if user is None:
        raise HTTPException(status_code=401,detail = "Invalid Credentials")
    if not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=401,detail="Invalid Credentials")
    
    token = create_access_token(data={
        "sub": str(user.id),
        "role": user.role
        }) 
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,      # True in production with HTTPS
        samesite="lax",
        max_age=3600,
        path="/"
    )

    return {
        "message": "Login successful"
    }
    

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,  # True in production HTTPS
        samesite="lax"
    )

    return {"message": "Logged out successfully"}
    


    
@router.get("/profile")
def profile(current_user = Depends(get_current_user)):
    return {
        "id":current_user.id,
        "name":current_user.name,
        "email":current_user.email,
        "role":current_user.role
    }


@router.get("/verify-email")
async def verify_email(
    token:str, 
    background_tasks:BackgroundTasks,
    db:Session = Depends(get_db)): 
    hashed_token = hash_verification_token(token)

    user = (db.query(Users).filter(Users.verification_token == hashed_token).first())
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification link."
        )
    if (
    user.verification_token_expiry is None
    or user.verification_token_expiry < datetime.now(timezone.utc)
):
        raise HTTPException(
            status_code=400,
            detail="Verification link has expired."
        )
    
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expiry = None
    db.commit()
    
    background_tasks.add_task(
        send_welcome_email,
        user.name,
        user.email


    )

    return {
        "message": "Email verified successfully."
    }


@router.post("/forgot-password") 
async def forgot_password(
    data:ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db:Session = Depends(get_db) 
    ):
    user = (db.query(Users).filter(Users.email == data.email).first())
    if not user:
        return {"message": "If an account exists with this email, a password reset link has been sent."}
    raw_token = generate_verification_token()
    hashed_token = hash_verification_token(raw_token)

    user.password_reset_token = hashed_token
    user.password_reset_token_expiry = verification_token_expiry()
    db.commit()

    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={raw_token}"
    background_tasks.add_task(
        send_password_reset_email,
        user.email,
        user.name,
        reset_url
        
    )
    return {
        "message": "If an account exists with this email, a password reset link has been sent."
    }


    
@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    background_tasks :  BackgroundTasks,
    db:Session = Depends(get_db)
    
    ):
    hashed_token = hash_verification_token(data.token) 
    user = (db.query(Users).filter(Users.password_reset_token == hashed_token).first())
    if not user:
        raise HTTPException(status_code = 400, detail = "Invalid Reset link.") 

    if (
        user.password_reset_token_expiry is None or 
        user.password_reset_token_expiry < datetime.now(timezone.utc)
        ):
        raise HTTPException( status_code=400, detail="Reset link has expired." )

    hashed_password = hash_password(data.new_password) 
    user.password = hashed_password


    user.password_reset_token = None
    user.password_reset_token_expiry = None

    
    db.commit()
    background_tasks.add_task(
        send_reset_password_success,
        user.email,
        user.name

    )

    return {
        "message": "Password has been reset successfully."
    }
    



@router.get("/reset-password")
async def verify_reset_token(
    token: str,
    db: Session = Depends(get_db)
):
    hashed_token = hash_verification_token(token)

    user = (
        db.query(Users)
        .filter(Users.password_reset_token == hashed_token)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset link."
        )

    if (
        user.password_reset_token_expiry is None
        or user.password_reset_token_expiry < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400,
            detail="Reset link has expired."
        )

    return {
        "message": "Reset token is valid."
    }


@router.post("/account/delete-request")
def request_account_deletion(
    request: DeleteAccountRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # 1. Check whether deletion has already been requested
    if current_user.is_deletion_requested:
        raise HTTPException(
            status_code=400,
            detail="Account deletion has already been requested.",
        )

    # 2. Verify the user's password
    if not verify_password(
        request.password,
        current_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password.",
        )

    # 3. Get current UTC time
    now = datetime.now(timezone.utc)

    # 4. Calculate deletion date
    deletion_date = (
        now + timedelta(
            days=settings.ACCOUNT_DELETION_GRACE_DAYS
        )
    )

    # 5. Mark account for deletion
    current_user.is_deletion_requested = True
    current_user.deletion_requested_at = now
    current_user.deletion_scheduled_for = deletion_date

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Account deletion has been scheduled.",
        "deletion_period_days": settings.ACCOUNT_DELETION_GRACE_DAYS,
        "deletion_requested_at": current_user.deletion_requested_at,
        "deletion_scheduled_for": current_user.deletion_scheduled_for,
    }


@router.post("/account/cancel-deletion")
def cancel_account_deletion(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Check whether deletion was requested
    if not current_user.is_deletion_requested:
        raise HTTPException(
            status_code=400,
            detail="No account deletion is currently scheduled.",
        )

    # Cancel deletion
    current_user.is_deletion_requested = False
    current_user.deletion_requested_at = None
    current_user.deletion_scheduled_for = None

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Account deletion has been cancelled successfully."
    }