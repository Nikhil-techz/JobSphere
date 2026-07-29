from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    CLOUDINARY_CLOUD_NAME:str
    CLOUDINARY_API_KEY:int
    CLOUDINARY_API_SECRET:str




    class Config:
        env_file = ".env"

settings = Settings() 
