from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.users.users_schema import UserCreate, UserResponse, UpdateUser
from modules.users.users_service import create_user, get_user_by_id, get_users_by_company, update_user, delete_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model=UserResponse)
async def add_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    created_user = await create_user(db, user)

    return created_user

@router.get("/get_id", response_model = UserResponse)
async def get_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    get_user = await get_user_by_id(db, id)

    return get_user

@router.get("/get_users", response_model = list[UserResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_users_by_company(db, company_id)

@router.put("/edit_user", response_model = UserResponse)
async def edit_user(data: UpdateUser, db: AsyncSession = Depends(get_db)):
    updated_user = await update_user(db, data)

    if not updated_user: 
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return updated_user

@router.delete("/delete_user", response_model = UserResponse)
async def desactivate_user(id, db: AsyncSession = Depends(get_db)):
    deleted_user = await delete_user(db, id)

    if not deleted_user:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return deleted_user