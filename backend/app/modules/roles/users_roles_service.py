from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from modules.users.users_model import User
from modules.roles.roles_model import Role, user_roles

async def get_user_roles(db: AsyncSession, user_id: UUID, company_id: UUID) -> list[Role] | None:
    user = await db.scalar(
        select(User).where(
            User.id == user_id,
            User.company_id == company_id
        )
    )

    if not user:
        return None

    result = await db.execute(
        select(Role)
        .join(user_roles, Role.id == user_roles.c.role_id)
        .where(
            user_roles.c.user_id == user_id,
            Role.company_id == company_id
        )
    )

    return list(result.scalars().all())

async def assign_role(db: AsyncSession, user_id: UUID, role_id: UUID, company_id: UUID) -> str:
    user = await db.scalar(
        select(User).where(
            User.id == user_id,
            User.company_id == company_id
        )
    )

    if not user:
        return "user_not_found"

    role = await db.scalar(
        select(Role).where(
            Role.id == role_id,
            Role.company_id == company_id
        )
    )

    if not role:
        return "role_not_found"

    existing = await db.scalar(
        select(user_roles.c.user_id).where(
            user_roles.c.user_id == user_id,
            user_roles.c.role_id == role_id
        )
    )

    if existing is not None:
        return "already_assigned"

    await db.execute(
        insert(user_roles).values(
            user_id = user_id,
            role_id = role_id
        ).on_conflict_do_nothing(
            index_elements = [
                user_roles.c.user_id,
                user_roles.c.role_id
            ]
        )
    )

    await db.commit()
    
    return "assigned"

async def remove_role(db: AsyncSession, user_id: UUID, role_id: UUID, company_id: UUID) -> str:
    user = await db.scalar(
        select(User).where(
            User.id == user_id,
            User.company_id == company_id
        )
    )

    if not user:
        return "user_not_found"

    result = await db.execute(
        delete(user_roles).where(
            user_roles.c.user_id == user_id,
            user_roles.c.role_id == role_id,
            user_roles.c.role_id.in_(
                select(Role.id).where(
                    Role.company_id == company_id
                )
            )
        )
    )

    await db.commit()

    if result.rowcount == 0:
        return "assigment_not_found"

    return "role removed"