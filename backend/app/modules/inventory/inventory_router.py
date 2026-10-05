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