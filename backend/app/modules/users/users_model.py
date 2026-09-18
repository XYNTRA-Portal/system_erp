import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Table, Column, func
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

class User(Base):
    __tablename__ = "users"

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

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    email: Mapped[str] = mapped_column(
        String(150),
        nullable = False,
        index = True,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable = False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default = True,
        nullable = False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        server_default = func.now(),
        nullable = False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        server_default = func.now(),
        onupdate = func.now(),
        nullable = False,
    )

    company = relationship(
        "Company",
        back_populates = "users",
    )

    roles = relationship(
        "Role",
        secondary = user_roles,
        back_populates = "users",
    )

    inventory_movements = relationship(
        "InventoryMovement",
        back_populates = "created_by_user",
    )

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[UUID] = mapped_column(
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