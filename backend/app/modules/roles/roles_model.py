import uuid
from sqlalchemy import ForeignKey, String, Table, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column(
        "user_id",
        UUID(as_uuid = True),
        ForeignKey("users.id", ondelete = "CASCADE"),
        primary_key = True,
    ),
    Column(
        "role_id",
        UUID(as_uuid = True),
        ForeignKey("roles.id", ondelete = "CASCADE"),
        primary_key = True,
    ),
)

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("companies.id", ondelete = "CASCADE"),
        nullable = False,
        index = True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable = False,
    )

    company = relationship(
        "Company",
        back_populates = "roles",
    )

    users = relationship(
        "User",
        secondary = user_roles,
        back_populates = "roles",
    )