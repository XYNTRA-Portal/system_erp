from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.products.products_schema import ProductCreate, ProductResponse, UpdateProduct
from modules.products.products_service import create_product, get_product_by_id, get_products_by_category, get_products_by_company, update_product, desactivate_product

router = APIRouter(
    prefix = "/products",
    tags = ["Prodcuts"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model = ProductResponse)
async def add_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    return await create_product(db, product)

@router.get("/by_id", response_model = ProductResponse)
async def get_product_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_product_by_id(db, id)

@router.get("/by_company", response_model = list[ProductResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_products_by_company(db, company_id)

@router.get("/by_category", response_model = list[ProductResponse])
async def get_by_categories(category_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_products_by_category(db, category_id)

@router.put("/edit", response_model = ProductResponse)
async def edit_product(data: UpdateProduct, db: AsyncSession = Depends(get_db)):
    updated_product = await update_product(db, data)

    if not updated_product:
        raise HTTPException(status_code = 404, detail = "Detail ID")

    return updated_product

@router.delete("/desactivate", response_model = ProductResponse)
async def desactivate_product(id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_product = await desactivate_product(db, id)

    if not deleted_product:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return deleted_product