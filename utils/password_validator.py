from pydantic import ValidationError


def validate_password(password: str) -> str:

    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    if len(password) > 12:
        raise ValueError("Password cannot exceed 12 characters.")

    if not any(char.isupper() for char in password):
        raise ValueError("Password must contain at least one uppercase letter.")

    if not any(char.islower() for char in password):
        raise ValueError("Password must contain at least one lowercase letter.")

    if not any(char.isdigit() for char in password):
        raise ValueError("Password must contain at least one number.")

    if not any(not char.isalnum() for char in password):
        raise ValueError("Password must contain at least one special character.")

    if " " in password:
        raise ValueError("Password cannot contain spaces.")

    return password 
