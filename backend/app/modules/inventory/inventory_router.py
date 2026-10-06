from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from modules.inventory.inventory_schema import InventoryMovementCreate, InventoryMovementResponse
from modules.inventory.inventory_service import register_movement, get_by_creator, get_by_id, get_by_product, get_by_warehouse

router = APIRouter(
    prefix = "/movements",
    tags = ["Movements"]
)

async def get_db():
    async with AsyncSessionLocal as db:
        yield db

@router.post("/add", response_model = ResponseMessage)
async def add_movement(inventory_movement: InventoryMovementCreate, db: AsyncSession = Depends(get_db)):
    movement = await register_movement(db, inventory_movement)

    if not movement:
        raise HTTPException(status_code = 400, detail = "Invalid data")

    return {"code": 201, "description": "Object created"}

@router.get("/by_id", response_model = InventoryMovementResponse)
async def get_movement_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_by_id(db, id)

@router.get("/by_product", response_model = list[InventoryMovementResponse])
async def get_movements_by_product(product_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_by_product(db, product_id)

@router.get("/by_warehouse", response_model = list[InventoryMovementResponse])
async def get_movements_by_warehouse(warehouse_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_by_warehouse(db, warehouse_id)

@router.get("/by_creator", response_model = list[InventoryMovementResponse])
async def get_movements_by_creator(user_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_by_creator(db, user_id)