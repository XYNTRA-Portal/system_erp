import uuid
from decimal import Decimal
from sqlalchemy import Boolean, CheckConstraint, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        primary_key = True,
        default = uuid.uuid4,
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("companies.id", ondelete = "CASCADE"),
        nullable = True,
        index = True,
    )

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid = True),
        ForeignKey("categories.id", ondelete = "CASCADE"),
        nullable = True,
        index = True,
    )

    sku_code: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable = False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable = True,
    )

    cost: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable = False,
        default = 0,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable = False,
        default = 0,
    )

    is_active: Mapped[Boolean] = mapped_column(
        Boolean,
        nullable = False,
        default = True,
    )

    company = relationship(
        "Company",
        back_populates = "products",
    )

    category = relationship(
        "Category",
        back_populates = "products",
    )

    inventories = relationship(
        "Inventory",
        back_populates = "product",
        cascade = "all, delete-orphan"
    )

    movements = relationship(
        "InventoryMovement",
        back_populates = "product",
    )

    __table_args__ = (
        UniqueConstraint(
            "company_id",
            "sku_code",
            name = "uq_product_company_sku_code",
        ),
        CheckConstraint(
            "cost >= 0",
            name = "ck_product_cost_positive",
        ),
        CheckConstraint(
            "price >= 0",
            name = "ck_product_price_positive",
        ),
    )
