from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    company_id: UUID
    first_name: str
    last_name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    company_id: UUID
    first_name: str
    last_name: str
    email: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)