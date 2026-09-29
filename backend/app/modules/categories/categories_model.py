import uuid
from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.database import Base

class Category(Base):
    __tablename__ = "categories"

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
        Text,
        nullable = False,
    )

    is_active: Mapped[Boolean] = mapped_column(
        Boolean,
        nullable = False,
        default = True,
    )

    company = relationship(
        "Company",
        back_populates = "categories",
    )

    products = relationship(
        "Product",
        back_populates = "category"
    )