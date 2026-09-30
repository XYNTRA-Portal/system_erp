from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from modules.products.products_model import Product
from modules.products.products_schema import ProductCreate, ProductResponse, UpdateProduct

async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    product = Product(
        company_id = data.company_id,
        category = data.category_id,
        sku_code = str,
        name = data.name,
        description = data.description,
        cost = data.cost,
        price = data.price
    )

    db.add(product)
    await db.commit()
    await db.refresh(product)

    return product

async def get_product_by_id(db: AsyncSession, product_id: UUID) -> Product | None:
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )

    return result.scalar_one_or_none()

async def get_products_by_company(db: AsyncSession, company_id: UUID) -> list[Product]:
    result = await db.execute(
        select(Product).where(Product.company_id == company_id)
    )

    return list(result.scalars().all())

async def get_products_by_category(db: AsyncSession, category_id: UUID) -> list[Product]:
    result = await db.execute(
        select(Product).where(Product.category_id == category_id)
    )

    return list(result.scalars().all())

async def update_product(db: AsyncSession, data: UpdateProduct) -> Product | None:
    product = await get_product_by_id(db, data.id)

    if not product:
        return None

    if data.sku_code is not None: product.sku_code = data.sku_code
    if data.name is not None: product.name = data.name
    if data.description is not None: product.description = data.description
    if data.cost is not None: product.cost = data.cost
    if data.price is not None: product.price = data.price

    await db.commit()
    await db.refresh(product)

    return product

async def desactivate_product(db: AsyncSession, product_id: UUID) -> Product:
    product = await get_product_by_id(db, product_id)

    if not product:
        return None

    product.is_active = False

    await db.commit()
    await db.refresh(product)

    return product