from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    BACKEND_URL:str
    FRONTEND_URL:str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    CLOUDINARY_CLOUD_NAME:str
    CLOUDINARY_API_KEY:int
    CLOUDINARY_API_SECRET:str 
    #email 
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    MAIL_VALIDATE_CERTS: bool = True 




    
model_config = SettingsConfigDict(
    env_file = ".env"
)

settings = Settings() 
