from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.auth.auth_schema import LoginRequest, TokenResponse
from modules.auth.auth_service import login

router = APIRouter(
    prefix = "/auth",
    tags = ["Auth"],
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/login", response_model = TokenResponse)
async def user_login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    token = await login(db, data)

    if not token:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = "Invalid credentials")

    return {"access_token": token, "token_type": "bearer"}