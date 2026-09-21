from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.users.users_model import User
from core.security import hash_password, verify_password

async def create_user(db: AsyncSession, company_id: UUID, first_name: str, last_name: str, email: str, password: str) -> User:

    user = User(
        company_id = company_id,
        first_name = first_name,
        last_name = last_name,
        email = email,
        password = hash_password(password)
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

async def get_users_by_company(db: AsyncSession, company_id: str) -> list[User]:

    result = await db.execute(
        select(User).where(User.company_id == company_id)
    )

    return list(result.scalars().all())

async def update_user(db: AsyncSession, user_id: UUID, first_name: str | None = None, last_name: str | None = None, email: str | None = None, password: str | None = None) -> User | None:

    user = await get_user_by_id(db, user_id)

    if not user: 
        return None

    if first_name is not None: user.first_name = first_name
    if last_name is not None: user.last_name = last_name
    if email is not None: user.email = email
    if password is not None: user.password = hash_password(password)

    await db.commit()
    await db.refresh(user)
    
    return user