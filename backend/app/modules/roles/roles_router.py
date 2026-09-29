from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.roles.roles_schema import CreateRole, UpdatedRole, RoleResponse
from modules.roles.roles_service import create_role, get_role_by_id, get_roles_by_company, update_role

router = APIRouter(
    prefix = "/roles",
    tags = ["Roles"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model = RoleResponse)
async def add_role(role: CreateRole, db: AsyncSession = Depends(get_db)):
    return await create_role(role, db)

@router.get("/by_id", response_model = RoleResponse)
async def get_role(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_role_by_id(db, id)

@router.get("/by_companies", response_model = list[RoleResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_roles_by_company(db, company_id)

@router.put("/edit", response_model = RoleResponse)
async def update_role(data: UpdatedRole, db: AsyncSession = Depends(get_db)):
    updated_role = await update_role(db, data)

    if not updated_role:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return updated_role