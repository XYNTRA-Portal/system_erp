from uuid import UUID
from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    company_id: UUID
    first_name: str
    last_name: str
    email: str
    password: str

class UpdateUser(BaseModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password: str | None = None
    is_active: bool | None = None

class UserResponse(BaseModel):
    id: UUID
    company_id: UUID
    first_name: str
    last_name: str
    email: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)