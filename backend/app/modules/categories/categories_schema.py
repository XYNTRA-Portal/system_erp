from uuid import UUID
from pydantic import BaseModel, ConfigDict

class CategoryCreate(BaseModel):
    company_id: UUID
    name: str
    description: str

class UpdateCategory(BaseModel):
    id: UUID
    name: str | None = None
    description: str | None = None

class CategoryResponse(BaseModel):
    company_id: UUID
    name: str
    description: str
    is_active: bool

    model_config = ConfigDict(from_attributes = True)