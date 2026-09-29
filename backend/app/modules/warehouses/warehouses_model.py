import uuid
from datetime import datetime
from sqlalchemy import DateTime, Boolean, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

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

    code: Mapped[str] = mapped_column(
        String(50),
        nullable = False,
    )

    address: Mapped[str] = mapped_column(
        Text,
        nullable = False,
    )

    is_active: Mapped[Boolean] = mapped_column(
        Boolean,
        nullable = False,
        default = True,
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
        back_populates = "warehouses"
    )

    inventories = relationship(
        "Inventory",
        back_populates = "warehouse",
        cascade = "all, delete-orphan",
    )

    movements = relationship(
        "InventoryMovement",
        back_populates = "warehouse",
    )

    __table_args__ = (
        UniqueConstraint(
            "company_id",
            "code",
            name = "uq_warehouse_company_code",
        ),
    )