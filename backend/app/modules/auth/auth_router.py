from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from core.config import settings
from core.database import AsyncSessionLocal
from modules.auth.auth_schema import LoginRequest, TokenResponse
from modules.auth.auth_service import login, get_current_user
from modules.auth.refresh_session_service import create_refresh_session, rotate_refresh_session
from core.security import create_access_token
from modules.users.users_schema import UserResponse

router = APIRouter(
    prefix = "/auth",
    tags = ["Auth"],
)

security = HTTPBearer()

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/login", response_model = TokenResponse)
async def user_login(data: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    user = await login(db, data)

    if not user:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid credentials")

    access_token = create_access_token(str(user.id))
    refresh_token = await create_refresh_session(db, user.id)

    cookie_name = (
        "refresh_token"
        if settings.app_env == "development"
        else "__Host-refresh_token"
    )

    response.set_cookie(
        key = cookie_name,
        value = refresh_token,
        httponly = True,
        secure = settings.cookie_secure,
        samesite = settings.cookie_samesite,
        path = "/",
        max_age = settings.refresh_token_expire_days * 24 * 60 * 60,
    )

    return { "access_token": access_token, "token_type": "bearer" }

@router.get("/me", response_model = UserResponse)
async def me(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(db, credentials.credentials)

    if not user:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid or expired token")

    return user

@router.post("/refresh", response_model = TokenResponse)
async def refresh_access_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    cookie_name = (
        "refresh_token"
        if settings.app_env == "development"
        else "__Host-refresh_token"
    )

    refresh_token = request.cookies.get(cookie_name)

    if not refresh_token:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Refresh token missing")

    session_data = await rotate_refresh_session(db, refresh_token)

    if not session_data:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid or expired refresh token")

    user_id, new_refresh_token = session_data
    access_token = create_access_token(str(user_id))

    response.set_cookie(
        key = cookie_name,
        value = new_refresh_token,
        httponly = True,
        secure = settings.cookie_secure,
        samesite = settings.cookie_samesite,
        path = "/",
        max_age = settings.refresh_token_expire_days * 24 * 60 * 60,
    )

    return { "access_token": access_token, "token_type": "bearer" }