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

    # account deletion 
    ACCOUNT_DELETION_GRACE_DAYS: int = 7

    # OAuth 
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URL: str
    SESSION_SECRET_KEY: str
    model_config = SettingsConfigDict(
        env_file = ".env",
        env_file_encoding="utf-8"
)

settings = Settings() 
