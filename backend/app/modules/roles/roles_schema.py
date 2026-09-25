from uuid import UUID
from pydantic import BaseModel, ConfigDict

class CreateRole(BaseModel):
    company_id: UUID
    name: str
    description: str

class UpdatedRole(BaseModel):
    id: UUID
    name: str | None = None
    decription: str | None = None

class RoleResponse(BaseModel):
    id: UUID
    name: str
    description: str