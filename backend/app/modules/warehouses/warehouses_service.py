from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.warehouses.warehouses_model import Warehouse
from modules.warehouses.warehouses_schema import WarehouseCreate, UpdateWarehouse, WarehouseResponse

async def create_warehouse(db: AsyncSession, data: WarehouseCreate) -> Warehouse:
    warehouse = Warehouse(
        company_id = data.company_id,
        name = data.name,
        code = data.code,
        address = data.address
    )

    db.add(warehouse)
    await db.commit()
    await db.refresh(warehouse)

    return warehouse

async def get_warehouse_by_id(db: AsyncSession, warehouse_id: UUID) -> Warehouse | None:
    result = await db.execute(
        select(Warehouse).where(Warehouse.id == warehouse_id)
    )

    return result.scalar_one_or_none()

async def get_warehouse_by_companies(db: AsyncSession, company_id: UUID) -> list[Warehouse]:
    result = await db.execute(
        select(Warehouse).where(Warehouse.company_id == company_id)
    )

    return list(result.scalars().all())

async def update_warehouse(db: AsyncSession, data: UpdateWarehouse) -> Warehouse | None:
    warehouse = await get_warehouse_by_id(db, data.id)

    if not warehouse:
        return None

    if data.name is not None: warehouse.name = data.name
    if data.code is not None: warehouse.code = data.code
    if data.address is not None: warehouse.address = data.address

    await db.commit()
    await db.refresh(warehouse)

    return warehouse

async def delete_warehouse(db: AsyncSession, warehouse_id: UUID) -> Warehouse:
    warehouse = await get_warehouse_by_id(db, warehouse_id)

    if not warehouse:
        return None

    warehouse.is_active = False

    await db.commit()
    await db.refresh(warehouse)

    return warehouse