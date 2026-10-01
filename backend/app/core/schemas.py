from pydantic import BaseModel

class ResponseMessage(BaseModel):
    code: int
    description: str