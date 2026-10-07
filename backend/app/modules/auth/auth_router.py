from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from modules.auth.auth_schema import LoginRequest, TokenResponse
from modules.auth.auth_service import login, get_current_user
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
async def user_login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    token = await login(db, data)

    if not token:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid credentials")

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model = UserResponse)
async def me(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    user = await get_current_user(db, credentials.credentials)

    if not user:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid or expired token")

    return user