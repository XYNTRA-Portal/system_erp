from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from modules.products.products_schema import ProductCreate, ProductResponse, UpdateProduct
from modules.products.products_service import create_product, get_product_by_id, get_products_by_category, get_products_by_company, update_product, desactivate_product

router = APIRouter(
    prefix = "/products",
    tags = ["Products"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model = ResponseMessage)
async def add_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    product_created = await create_product(db, product)

    if not product_created:
            raise HTTPException(status_code = 400, detail = "Invalid data")

    return {"code": 201, "description": "Object added"}

@router.put("/edit", response_model = ResponseMessage)
async def edit_product(data: UpdateProduct, db: AsyncSession = Depends(get_db)):
    updated_product = await update_product(db, data)

    if not updated_product:
        raise HTTPException(status_code = 404, detail = "Detail ID")

    return {"code": 200, "description": "Object updated"}

@router.delete("/desactivate", response_model = ResponseMessage)
async def desactivate_product(id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_product = await desactivate_product(db, id)

    if not deleted_product:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return {"code": 200, "description": "Object desactivated"}

@router.get("/by_id", response_model = ProductResponse)
async def get_product_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_product_by_id(db, id)

@router.get("/by_company", response_model = list[ProductResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_products_by_company(db, company_id)

@router.get("/by_category", response_model = list[ProductResponse])
async def get_by_categories(category_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_products_by_category(db, category_id)