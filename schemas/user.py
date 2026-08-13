from pydantic import BaseModel, EmailStr, field_validator, Field , ConfigDict
from utils.password_validator import validate_password
from enum import Enum
from typing import Optional , List

class UserRole(str,Enum):
    applicant = "applicant"
    recruiter = "recruiter"
    
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role:UserRole 
    @field_validator("password")
    @classmethod
    def validate_user_password(cls, value):
        return validate_password(value) 


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    
    


class UserResponse(UserBase):
    id: int
    role:UserRole

    model_config =  model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str 


class ChangePassword(BaseModel):
    current_password:str
    new_password:str 
    @field_validator("new_password")
    @classmethod
    def validate_user_password(cls, value):
            return validate_password(value) 
    

    
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=1)
    new_password: str
    @field_validator("new_password")
    @classmethod
    def validate_user_password(cls, value):
                return validate_password(value) 

class EmailRequest(BaseModel):
    email:List[EmailStr]

class DeleteAccountRequest(BaseModel):
    password: str