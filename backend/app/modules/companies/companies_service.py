from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.companies.companies_model import Company
from modules.companies.companies_schema import CreateCompanie, UpdateCompanie, CompanieResponse

async def create_company(db: AsyncSession, data: CreateCompanie) -> Company:
    company = Company(
        name = data.name,
        legal_name = data.legal_name,
        tax_id = data.tax_id,
        email = data.email,
        phone = data.phone,
    )

    db.add(company)
    await db.commit()
    await db.refresh(company)

    return company

async def get_company_by_id(db: AsyncSession, company_id: UUID) -> Company | None:
    result = await db.execute(
        select(Company).where(Company.id == company_id)
    )

    return result

async def update_company(db: AsyncSession, data: UpdateCompanie) -> Company | None:
    company = await get_company_by_id(db, data.id)

    if not company:
        return None

    if data.name is not None: company.name = data.name
    if data.legal_name is not None: company.legal_name = data.legal_name 
    if data.tax_id is not None: company.tax_id = data.tax_id
    if data.email is not None: company.email = data.email
    if data.phone is not None: company.phone = data.phone

    await db.commit()
    await db.refresh(company)

    return company

async def delete_company(db: AsyncSession, company_id: UUID) -> Company:
    company = await get_company_by_id(db, company_id)

    if not company:
        return None

    company.is_active = False

    await db.commit()
    await db.refresh(company)

    return company