from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from modules.companies.companies_schema import CreateCompanie, UpdateCompanie, CompanieResponse
from modules.companies.companies_service import create_company, get_company_by_id, update_company, delete_company

router = APIRouter(
    prefix = "/companies",
    tags = ["Companies"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

@router.post("/add", response_model = CompanieResponse)
async def add_user(company: CreateCompanie, db: AsyncSession = Depends(get_db)):
    company_created = await create_company(db, company)

    if not company_created:
        raise HTTPException(status_code = 400, detail = "Invalid data")
    
    return {"code": 201, "description": "Object created"} 

@router.put("/edit", response_model = ResponseMessage)
async def edit_company(data: UpdateCompanie, db: AsyncSession = Depends(get_db)):
    updated_company = await update_company(db, data)

    if not updated_company:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return {"code": 200, "description": "Object updated"}

@router.delete("/desactivate", response_model = ResponseMessage)
async def desactivate_company(id: UUID, db: AsyncSession = Depends(get_db)):
    deleted_company = await delete_company(db, id)
    
    if not deleted_company:
        raise HTTPException(status_code = 404, detail = "Invalid ID")
    
    return {"code": 200, "description": "Object desactivated"}

@router.get("/by_id", response_model = CompanieResponse)
async def get_by_id(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_company_by_id(db, id)