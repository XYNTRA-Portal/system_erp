from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.users.users_model import User
from core.security import hash_password, verify_password
from modules.users.users_schema import UserCreate, UpdateUser

async def create_user(db: AsyncSession, data: UserCreate) -> User:
    user = User(
        company_id = data.company_id,
        first_name = data.first_name,
        last_name = data.last_name,
        email = data.email,
        password = hash_password(data.password)
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user

async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:

    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    
    return result.scalar_one_or_none()

async def get_users_by_company(db: AsyncSession, company_id: UUID) -> list[User]:
    result = await db.execute(
        select(User).where(User.company_id == company_id)
    )

    return list(result.scalars().all())

async def update_user(db: AsyncSession, data: UpdateUser) -> User | None:
    user = await get_user_by_id(db, data.id)

    if not user: 
        return None

    if data.first_name is not None: user.first_name = data.first_name
    if data.last_name is not None: user.last_name = data.last_name
    if data.email is not None: user.email = data.email
    if data.password is not None: user.password = hash_password(data.password)

    await db.commit()
    await db.refresh(user)
    
    return user

async def delete_user(db: AsyncSession, user_id: UUID) -> User:
    user = await get_user_by_id(db, user_id)

    if not user:
        return None

    user.is_active = False

    await db.commit()
    await db.refresh(user)

    return user