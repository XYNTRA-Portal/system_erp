from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class WarehouseCreate(BaseModel):
    company_id: UUID
    name: str
    code: str
    address: str
    is_active: bool

class UpdateWarehouse(BaseModel):
    id: UUID
    name: str | None = None
    code: str | None = None
    address: str | None = None
    is_active: bool | None = None

class WarehouseResponse(BaseModel):
    name: str
    code: str
    address: str
    is_active: bool

    model_config = ConfigDict(from_attributes = True)