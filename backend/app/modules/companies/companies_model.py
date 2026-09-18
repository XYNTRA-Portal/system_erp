import uuid 
from datetime import datetime
from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable = False,
    )

    legal_name: Mapped[str] = mapped_column(
        String(200),
        nullable = False,
    )

    tax_id: Mapped[str | None] = mapped_column(
        String(50),
        nullable = True,
        unique = True,
    )

    email: Mapped[str | None] = mapped_column(
        String(150),
        nullable = True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(15),
        nullable = True,
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

    users = relationship(
        "User",
        back_populates = "company",
        cascade = "all, delete-orphan",
    )

    roles = relationship(
        "Role",
        back_populates = "company",
        cascade = "all, delete-orphan",
    )

    categories = relationship(
        "Category",
        back_populates = "company",
        cascade = "all, delete-orphan",
    )

    products = relationship(
        "Product",
        back_populates = "company",
        cascade = "all, delete-orphan",
    )

    warehouses = relationship(
        "Warehouse",
        back_populates = "company",
        cascade = "all, delete-orphan"
    )