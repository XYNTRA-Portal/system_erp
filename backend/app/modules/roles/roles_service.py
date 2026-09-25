from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.users.users_model import Role
from modules.roles.roles_schema import CreateRole, UpdatedRole, RoleResponse

async def create_role(db: AsyncSession, data: CreateRole) -> Role:
    role = Role(
        company_id = data.company_id,
        name = data.name,
        description = data.description
    )

    db.add(role)
    await db.commit()
    await db.refresh(role)

    return role

async def get_role_by_id(db: AsyncSession, role_id) -> Role | None:
    result = await db.execute(
        select(Role).where(Role.id == role_id)
    )

    return result.scalar_one_or_none()

async def get_roles_by_company(db: AsyncSession, company_id) -> list[Role]:
    result = await db.execute(
        select(Role).where(Role.company_id == company_id)
    )

    return list(result.scalars().all())

async def update_role(db: AsyncSession, data: UpdatedRole) -> Role | None:
    role = await get_role_by_id(db, data.id)

    if not role:
        return None

    if data.name is not None: role.name = data.name
    if data.description is not None: role.description = data.description

    await db.commit()
    await db.refresh(role)

    return role