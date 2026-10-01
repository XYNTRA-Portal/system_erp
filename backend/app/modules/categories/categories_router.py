from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from modules.categories.categories_schema import CategoryCreate, UpdateCategory, CategoryResponse
from modules.categories.categories_service import create_category, get_category_by_id, get_categories_by_company, update_category, delete_category

router = APIRouter(
    prefix = "/categories",
    tags = ["Categories"]
)

async def get_db():
    async with AsyncSessionLocal as db:
        yield db

@router.post("/add", response_model = ResponseMessage)
async def add_category(category: CategoryCreate, db: AsyncSession = Depends(get_db)):
    category_created = await create_category(db, category)

    if not category_created:
        raise HTTPException(status_code = 404, detail = "Invalid data")

    return {"code": 201, "description": "Object added"}

@router.put("/edit", response_model = ResponseMessage)
async def edit_category(data: UpdateCategory, db: AsyncSession = Depends(get_db)):
    updated_category = await update_category(db, data)

    if not updated_category:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return {"code": 200, "description": "Object updated"}

@router.delete("/desactivate", response_model = ResponseMessage)
async def desactivate_category(id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_category = await delete_category(db, id)

    if not deleted_category:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return {"code": 200, "description": "Object desactivated"}

@router.get("/by_id", response_model = CategoryResponse)
async def get_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_category_by_id(db, id)

@router.get("/by_categories", response_model = list[CategoryResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_categories_by_company(db, company_id)