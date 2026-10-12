import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
import jwt
from core.config import settings

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed_password: str,) -> bool:
    return password_hash.verify(password, hashed_password)

def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes = settings.access_token_expire_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire,
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm = settings.algorithm
    )

def decode_access_token(token: str) -> dict:
    payload = jwt.decode(
        token,
        settings.secret_key,
        algorithms = [settings.algorithm],
    )

    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Invalid token type")

    return payload

def create_refresh_token() -> str:
    return secrets.token_urlsafe(64)

def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def refresh_token_expiration() -> datetime:
    return datetime.now(timezone.utc) + timedelta(
        days = settings.refresh_token_expire_days
    )