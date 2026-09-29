from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.categories.categories_model import Category
from modules.categories.categories_schema import CategoryCreate, UpdateCategory, CategoryResponse

async def create_category(db: AsyncSession, data: CategoryCreate) -> Category:
    category = Category(
        company_id = data.company_id,
        name = data.name,
        description = data.description
    )

    db.add(category)
    await db.commit()
    await db.refresh(category)

    return category

async def get_category_by_id(db: AsyncSession, category_id: UUID) -> Category | None:
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )

    return result.scalar_one_or_none()

async def get_categories_by_company(db: AsyncSession, company_id: UUID) -> list[Category]:
    result = await db.execute(
        select(Category).where(Category.company_id == company_id)
    )

    return list(result.scalars().all())

async def update_category(db: AsyncSession, data: UpdateCategory) -> Category | None:
    category = await get_category_by_id(db, data.id)

    if not category:
        return None

    if data.name is not None: category.name = data.name
    if data.description is not None: category.description = data.description

async def delete_category(db: AsyncSession, category_id: UUID) -> Category:
    category = await get_category_by_id(db, category_id)

    if not category:
        return None

    category_id.is_active = False

    await db.commit()
    await db.refresh(category)

    return category