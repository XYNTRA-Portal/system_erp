from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.inventory.inventory_models import Inventory, InventoryMovement, MovementType
from modules.inventory.inventory_schema import InventoryMovementCreate, InventoryMovementResponse

async def register_movement(db: AsyncSession, data: InventoryMovementCreate, user_id: UUID | None = None) -> InventoryMovement | None:
    result = await db.execute(
        select(Inventory).where(Inventory.product_id == data.product_id, Inventory.warehouse_id == data.warehouse_id)
    )

    inventory = result.scalar_one_or_none()

    if not inventory:
        inventory = Inventory(
            product_id = data.product_id,
            warehouse_id = data.warehouse_id,
            quantity = 0,
            minimum_quantity = 1,
        )

        db.add(inventory)
        await db.flush()

    if data.quantity <= 0:
        return None

    if data.movement_type in (MovementType.IN, MovementType.TRANSFER_IN,):
        inventory.quantity += data.quantity

    elif data.movement_type in (MovementType.OUT, MovementType.TRANSFER_OUT,):
        if inventory.quantity < data.quantity:
            return None
        inventory.quantity -= data.quantity

    elif data.movement_type == MovementType.ADJUSTMENT:
        return None

    movement = InventoryMovement(
        inventory_id = inventory.id,
        product_id = data.product_id,
        warehouse_id = data.warehouse_id,
        movement_type = data.movement_type.value,
        quantity = data.quantity,
        description = data.description,
        created_by = user_id,
    )

    db.add(movement)
    await db.commit()
    await db.refresh(movement)
    
    return movement

async def get_by_id(db: AsyncSession, inventory_movement_id: UUID) -> InventoryMovement | None:
    result = await db.execute(
        select(InventoryMovement).where(InventoryMovement.id == inventory_movement_id)
    )
    return result.scalar_one_or_none()

async def get_by_product(db: AsyncSession, product_id: UUID) -> list[InventoryMovement] | None:
    result = await db.execute(
        select(InventoryMovement).where(InventoryMovement.product_id == product_id)
    )
    return list(result.scalars().all())

async def get_by_warehouse(db: AsyncSession, warehouse_id: UUID) -> list[InventoryMovement] | None:
    result = await db.execute(
        select(InventoryMovement).where(InventoryMovement.warehouse_id == warehouse_id)
    )
    return list(result.scalars().all())

async def get_by_creator(db: AsyncSession, user_id: UUID) -> list[InventoryMovement] | None:
    result = await db.execute(
        select(InventoryMovement).where(InventoryMovement.created_by == user_id)
    )
    return list(result.scalars().all())