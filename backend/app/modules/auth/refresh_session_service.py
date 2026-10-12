from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.security import create_refresh_token, hash_refresh_token, refresh_token_expiration
from modules.auth.refresh_sessions_model import RefreshSession

async def create_refresh_session(db: AsyncSession, user_id: UUID) -> str:
    token = create_refresh_token()

    session = RefreshSession(
        user_id = user_id,
        token_hash = hash_refresh_token(token),
        expires_at = refresh_token_expiration(),
    )

    db.add(session)
    await db.commit()

    return token

async def get_valid_refresh_session(db: AsyncSession, token: str,) -> RefreshSession | None:
    token_hash = hash_refresh_token(token)

    result = await db.execute(
        select(RefreshSession).where(
            RefreshSession.token_hash == token_hash,
            RefreshSession.revoked_at.is_(None),
            RefreshSession.expires_at > datetime.now(timezone.utc),
        )
    )

    return result.scalar_one_or_none()

async def revoke_refresh_session(db: AsyncSession, session: RefreshSession) -> None:
    session.revoked_at = datetime.now(timezone.utc)
    await db.commit()

async def rotate_refresh_session(db: AsyncSession, token: str) -> tuple[UUID, str] | None:
    token_hash = hash_refresh_token(token)

    result = await db.execute(
        select(RefreshSession).where(
            RefreshSession.token_hash == token_hash,
            RefreshSession.revoked_at.is_(None),
            RefreshSession.expires_at > datetime.now(timezone.utc),
        ).with_for_update()
    )

    current_session = result.scalar_one_or_none()

    if not current_session:
        return None

    current_session.revoked_at = datetime.now(timezone.utc)

    new_token = create_refresh_token()

    new_session = RefreshSession(
        user_id = current_session.user_id,
        token_hash = hash_refresh_token(new_token),
        expires_at = refresh_token_expiration(),
    )

    db.add(new_session)
    await db.commit()

    return current_session.user_id, new_token