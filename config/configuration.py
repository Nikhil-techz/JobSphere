import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parents[1]


database_url = os.getenv("DATABASE_URL")
CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUD_API_KEY= os.getenv("CLOUDINARY_API_KEY")
CLOUD_SECRET_KEY = os.getenv("CLOUDINARY_API_SECRET") 




LOG_DIR = BASE_DIR /"logs"
log_file = LOG_DIR/"pipeline.log"  
