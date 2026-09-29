from uuid import UUID
from pydantic import BaseModel, ConfigDict

class CreateCompanie(BaseModel):
    name: str
    legal_name: str
    tax_id: str
    email: str
    phone: str

class UpdateCompanie(BaseModel):
    id: UUID
    name: str | None = None
    legal_name: str | None = None
    tax_id: str | None = None
    email: str | None = None
    phone: str | None = None

class CompanieResponse(BaseModel):
    name: str
    legal_name: str
    tax_id: str
    email: str
    phone: str
    is_active: bool

    model_config = ConfigDict(from_attributes = True)