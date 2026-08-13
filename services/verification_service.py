import secrets 
import hashlib
from datetime import datetime, timedelta, timezone

def generate_verification_token() ->str:
    return secrets.token_urlsafe(32)

def hash_verification_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def verification_token_expiry(minutes:int = 15)->datetime:
    return datetime.now(timezone.utc) + timedelta(minutes = minutes)
