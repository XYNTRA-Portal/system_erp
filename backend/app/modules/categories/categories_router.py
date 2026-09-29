from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.categories.categories_schema import CategoryCreate, UpdateCategory, CategoryResponse
from modules.categories.categories_service import create_category, get_category_by_id, get_categories_by_company, update_category, delete_category

router = APIRouter(
    prefix = "/categories",
    tags = ["Categories"]
)

async def get_db():
    async with AsyncSessionLocal as db:
        yield db

@router.post("/add", response_model = CategoryResponse)
async def add_category(category: CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await create_category(db, category)

@router.get("/by_id", response_model = CategoryResponse)
async def get_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_category_by_id(db, id)

@router.get("/by_categories", response_model = list[CategoryResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_categories_by_company(db, company_id)

@router.put("/edit", response_model = CategoryResponse)
async def edit_category(data: UpdateCategory, db: AsyncSession = Depends(get_db)):
    updated_category = await update_category(db, data)

    if not updated_category:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return updated_category

@router.delete("/desactivate", response_model = CategoryResponse)
async def desactivate_category(id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_category = await delete_category(db, id)

    if not deleted_category:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return deleted_category