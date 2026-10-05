import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

class MovementType(str, Enum):
    IN = "IN"
    OUT = "OUT"
    ADJUSTMENT = "ADJUSTMENT"
    TRANSFER_IN = "TRANSFER_IN"
    TRANSFER_OUT = "TRANSFER_OUT"

class Inventory(Base):
    __tablename__ = "inventory"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
    )

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("products.id", ondelete = "CASCADE"),
        nullable = False,
        index = True,
    )

    warehouse_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("warehouses.id", ondelete = "CASCADE"),
        nullable = False,
        index = True,
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(12, 3),
        nullable = False,
        default = 0,
    )

    minimum_quantity: Mapped[Decimal] = mapped_column(
        Numeric(12, 3),
        nullable = False,
        default = 0,
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        server_default = func.now(),
        onupdate = func.now(),
        nullable = False,
    )

    product = relationship(
        "Product",
        back_populates = "inventories",
    )

    warehouse = relationship(
        "Warehouse",
        back_populates = "inventories",
    )

    movements = relationship(
        "InventoryMovement",
        back_populates = "inventory",
    )

    __table_args__ = (
        UniqueConstraint(
            "product_id",
            "warehouse_id",
            name = "uq_inventory_product_warehouse",
        ),
        CheckConstraint(
            "quantity >= 0",
            name = "ck_inventory_quantity_positive",
        ),
        CheckConstraint(
            "minimum_quantity >= 0",
            name = "ck_minimum_inventory_quantity_positive",
        ),
    )

class InventoryMovement(Base):
    __tablename__ = "inventory_movement"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
    )

    inventory_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("inventory.id", ondelete = "RESTRICT"),
        nullable = False,
        index = True,
    )

    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("products.id", ondelete = "RESTRICT"),
        nullable = False,
        index = True,
    )

    warehouse_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("warehouses.id", ondelete = "RESTRICT"),
        nullable = False,
        index = True,
    )

    movement_type: Mapped[MovementType] = mapped_column(
        String(30),
        nullable = False,
    )

    quantity: Mapped[Decimal] = mapped_column(
        Numeric(12, 3),
        nullable = False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable = True,
    )

    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("users.id", ondelete = "SET NULL"),
        nullable = True,
        index = True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        server_default = func.now(),
        nullable = False,
    )

    inventory = relationship(
        "Inventory",
        back_populates = "movements",
    )

    product = relationship(
        "Product",
        back_populates = "movements",
    )

    warehouse = relationship(
        "Warehouse",
        back_populates = "movements",
    )

    created_by_user = relationship(
        "User",
        back_populates = "inventory_movements",
    )

    __table_args__ = (
        CheckConstraint(
            "quantity > 0",
            name = "ck_movement_quantity_positive",
        ),
    )