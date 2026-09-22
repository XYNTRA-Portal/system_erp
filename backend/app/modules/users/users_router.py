from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.users.users_schema import UserCreate, UserResponse
from modules.users.users_service import create_user, get_user_by_id, get_users_by_company, update_user


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


async def get_db():
    async with AsyncSessionLocal() as db:
        yield db


@router.post("/add", response_model=UserResponse)
async def add_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    created_user = await create_user(
        db=db,
        company_id=user.company_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=user.password,
    )

    return created_user

@router.get("/get_id", response_model = UserResponse)
async def get_by_id(id: str, db: AsyncSession = Depends(get_db)):
    get_user = await get_user_by_id(id, db)

    return get_user

@router.get("/get_users", response_model = List[dict])
async def get_by_companies(company_id: str, db: AsyncSession = Depends(get_db)):
    return await get_users_by_company(company_id, db)

@router.put("/edit_user", response_model = UserResponse)
async def edit_user(data: dict, db: AsyncSession = Depends(get_db)):
    updated_user = await update_user(db, data)

    if not updated_user: 
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return updated_user