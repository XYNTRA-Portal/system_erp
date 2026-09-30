from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.warehouses.warehouses_schema import WarehouseCreate, WarehouseResponse, UpdateWarehouse
from modules.warehouses.warehouses_service import create_warehouse, get_warehouse_by_id, get_warehouse_by_companies, update_warehouse, delete_warehouse

router = APIRouter(
    prefix = "/warehouses",
    tags = ["Warehouses"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model = WarehouseResponse)
async def add_warehouse(warehouse: WarehouseCreate, db: AsyncSession = Depends(get_db)):
    return await create_warehouse(db, warehouse)

@router.get("/by_id", response_model = WarehouseResponse)
async def get_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_warehouse_by_id(db, id)

@router.get("/by_company", response_model = list[WarehouseResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_warehouse_by_companies(db, company_id)

@router.put("/edit", response_model = WarehouseResponse)
async def edit_warehouse(data: UpdateWarehouse, db: AsyncSession = Depends(get_db)):
    updated_warehouse = await update_warehouse(db, data)

    if not updated_warehouse:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return updated_warehouse

@router.delete("/desactivate", response_model = WarehouseResponse)
async def desactivate_warehouse(warehouse_id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_warehouse = await delete_warehouse(db, warehouse_id)
    
    if not deleted_warehouse:
        raise HTTPException(status_code = 404, detail = "Invalid ID")
    
    return deleted_warehouse