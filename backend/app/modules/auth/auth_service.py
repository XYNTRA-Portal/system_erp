from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.security import create_access_token, verify_password
from modules.auth.auth_schema import LoginRequest
from modules.users.users_model import User

async def login(db: AsyncSession, data: LoginRequest) -> str | None:
    result = await db.execute(
        select(User).where(
            User.email == data.email,
            User.is_active == True,
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        return None
    
    if not verify_password(data.password, user.password):
        return None

    return create_access_token(str(user.id))