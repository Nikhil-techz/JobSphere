import cloudinary
import cloudinary.uploader

from config.configuration import (
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY
)


cloudinary.config(
    cloud_name = CLOUD_NAME,
    cloud_api_key = CLOUD_API_KEY,
    cloud_secret_key = CLOUD_SECRET_KEY,
    secure = True

)

def upload_resume_to_cloudinary(file):
    try:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type = "raw",
            folder = "job_portal/applicants/resumes"
        ) 

        return {
            "resume_url": result["secure_url"],
            "resume_public_id": result["public_id"]
        }
    except Exception as e: 
        raise Exception(f"Failed to Upload the Resume: {str(e)}") 





def delete_resume(public_id):

    cloudinary.uploader.destroy(
        public_id,
        resource_type="raw"
    )