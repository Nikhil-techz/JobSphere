from fastapi import APIRouter, Depends, HTTPException,  Response, Request
from fastapi.responses import RedirectResponse
from config.settings import settings
from config.oauth import oauth
from models.user import Users, UserRole
from database.dependency import get_db
from sqlalchemy.orm import Session
from config.security import create_access_token


router = APIRouter(prefix= "/auth", tags = ["Authentication"]) 

@router.get("/google/signup")
async def google_signup(
    request: Request,
    role: UserRole
):
    # Store signup information temporarily in session
    request.session["oauth_action"] = "signup"
    request.session["oauth_role"] = role.value

    redirect_url = settings.GOOGLE_REDIRECT_URL

    return await oauth.google.authorize_redirect(
        request,
        redirect_url
    )



@router.get("/google/login")
async def google_login(request: Request):
    request.session["oauth_action"] = "login"
    request.session.pop("oauth_role", None)
    

    redirect_url = settings.GOOGLE_REDIRECT_URL

    response = await oauth.google.authorize_redirect(
        request,
        redirect_url
    )
    return response


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    
    
    # exchange authorization code for Google token

    token = await oauth.google.authorize_access_token(request)

    #  Get Google user information

    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(
            status_code=400,
            detail="Unable to retrieve Google user information."
        )

    # Extract Google information

    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    email_verified = user_info.get("email_verified")

    # Validate Google information

    if not google_id or not email:
        raise HTTPException(
            status_code=400,
            detail="Google user information is incomplete."
        )

    # Google must confirm that the email is verified
    if not email_verified:
        raise HTTPException(
            status_code=400,
            detail="Google email address is not verified."
        )

    #  Get OAuth information from session

    oauth_action = request.session.pop("oauth_action", None)
    oauth_role = request.session.pop("oauth_role", None)

    if not oauth_action:
        raise HTTPException(
            status_code=400,
            detail="Invalid OAuth session."
        )

    # GOOGLE LOGIN

    if oauth_action == "login":

        # Find existing Google account

        user = (
            db.query(Users)
            .filter(Users.google_id == google_id)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail=(
                    "No JobSphere account is linked "
                    "with this Google account. "
                    "Please sign up first."
                )
            )

    # GOOGLE SIGNUP

    elif oauth_action == "signup":

        # Validate selected role

        if not oauth_role:
            raise HTTPException(
                status_code=400,
                detail="User role is missing."
            )

        try:
            selected_role = UserRole(oauth_role)

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid user role."
            )

        # Check Google ID

        existing_google_user = (
            db.query(Users)
            .filter(Users.google_id == google_id)
            .first()
        )

        if existing_google_user:
            raise HTTPException(
                status_code=409,
                detail=(
                    "This Google account is already registered. "
                    "Please sign in instead."
                )
            )

        # Check email

        existing_email_user = (
            db.query(Users)
            .filter(Users.email == email)
            .first()
        )

        if existing_email_user:
            raise HTTPException(
                status_code=409,
                detail=(
                    "An account with this email already exists. "
                    "Please sign in instead."
                )
            )

        # Create new Google user

        user = Users(
            name=name,
            email=email,
            password=None,
            role=selected_role,
            is_verified=True,
            auth_provider="google",
            google_id=google_id
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # INVALID ACTION

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid OAuth action."
        )

  #  Create JobSphere JWT

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value
        }
    )

    #  Return response
    frontend_url = settings.FRONTEND_URL

    return RedirectResponse(
        url=f"{frontend_url}/oauth/callback#access_token={access_token}"
    )
