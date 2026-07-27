from fastapi import UploadFile, HTTPException

# Allowed MIME types
ALLOWED_FILE_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# 5 MB
MAX_FILE_SIZE = 5 * 1024 * 1024


def validate_resume(file: UploadFile):
    # Check file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    # Calculate file size
    file.file.seek(0, 2)          # Move pointer to end
    file_size = file.file.tell()  # Get size in bytes
    file.file.seek(0)             # Reset pointer

    # Check file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Resume size must not exceed 5 MB."
        )