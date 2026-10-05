from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from modules.inventory.inventory_models import MovementType

class InventoryMovementCreate(BaseModel):
    product_id: UUID
    warehouse_id: UUID
    created_by: UUID
    inventory_id: UUID | None = None
    movement_type: MovementType
    quantity: Decimal
    description: str | None = None

class InventoryResponse(BaseModel):
    id: UUID
    product_id: UUID
    warehouse_id: UUID
    quantity: Decimal
    minimum_quantity: Decimal

    class Config:
        from_attributes = True

class InventoryMovementResponse(BaseModel):
    id: UUID
    inventory_id: UUID
    product_id: UUID
    warehouse_id: UUID
    created_by: UUID
    movement_type: MovementType
    quantity: Decimal
    description: str | None = None

    class Config:
        from_attributes = True