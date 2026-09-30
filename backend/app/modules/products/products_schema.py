from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ProductCreate(BaseModel):
    company_id: UUID
    category_id: UUID
    sku_code: str
    name: str
    description: str
    cost: Decimal
    price: Decimal

class UpdateProduct(BaseModel):
    id: UUID
    sku_code: str | None = None
    name: str | None = None
    description: str | None = None
    cost: Decimal | None = None
    price: Decimal | None = None

class ProductResponse(BaseModel):
    sku_code: str
    company_id: UUID
    category_id: UUID
    sku_code: str
    name: str
    description: str
    cost: Decimal
    price: Decimal
    is_active: bool

    model_config = ConfigDict(from_attributes = True)