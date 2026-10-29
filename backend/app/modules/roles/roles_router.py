from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from core.schemas import ResponseMessage
from sqlalchemy import select
from modules.roles.roles_model import Role, user_roles
from modules.roles.roles_schema import CreateRole, UpdatedRole, RoleResponse
from modules.roles.roles_service import create_role, get_role_by_id, get_roles_by_company, update_role
from modules.auth.auth_router import get_current_user
from modules.roles.users_roles_service import get_user_roles, assign_role, remove_role

router = APIRouter(
    prefix = "/roles",
    tags = ["Roles"]
)

async def get_db():
    async with AsyncSessionLocal() as db:
        yield db

security = HTTPBearer()

async def get_authenticated_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    current_user = await get_current_user(db, credentials.credentials)

    if not current_user or not current_user.is_active:
        raise HTTPException(status_code = 401, detail = "Invalid or expired token")
    
    return current_user


async def require_role_management_permission(current_user = Depends(get_authenticated_user), db: AsyncSession = Depends(get_db)):
    result = await db.scalar(
        select(Role.id)
        .join(user_roles, Role.id == user_roles.c.role_id)
        .where(
            user_roles.c.user_id == current_user.id,
            Role.company_id == current_user.company_id,
            Role.name == "Administrador"
        )
    )

    if result is None:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to manage roles"
        )

    return current_user


@router.post("/add", response_model = ResponseMessage)
async def add_role(role: CreateRole, db: AsyncSession = Depends(get_db)):
    role_created = await create_role(db, role)

    if not role_created:
        raise HTTPException(status_code = 400, detail = "Invalid data")

    return {"code": 201, "description": "Object added"}

@router.put("/edit", response_model = ResponseMessage)
async def edit_role(data: UpdatedRole, db: AsyncSession = Depends(get_db)):
    updated_role = await update_role(db, data)

    if not updated_role:
        raise HTTPException(status_code = 404, detail = "Invalid ID")

    return {"code": 200, "description": "Object updated"}

@router.get("/by_id", response_model = RoleResponse)
async def get_role(id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_role_by_id(db, id)

@router.get("/by_companies", response_model = list[RoleResponse])
async def get_by_companies(company_id: UUID, db: AsyncSession = Depends(get_db)):
    return await get_roles_by_company(db, company_id)

@router.get("/users/{user_id}", response_model = list[RoleResponse])
async def get_roles_from_user(user_id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_authenticated_user)):
    roles = await get_user_roles(db, user_id, current_user.company_id)

    if roles is None:
        raise HTTPException(status_code = 404, detail = "User not found")

    return roles

@router.post("/users/{user_id}/assign/{role_id}", response_model = ResponseMessage)
async def assign_role_to_user(user_id: UUID, role_id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(require_role_management_permission)):
    result = await assign_role(db, user_id, role_id, current_user.company_id)

    if result == "user_not_found":
        raise HTTPException(status_code = 404, detail = "User not found")

    if result == "role_not_found":
            raise HTTPException(status_code = 404, detail = "Role not found")

    if result == "already_assigned":
            raise HTTPException(status_code = 404, detail = "Role already assigned")
    
    return { "code": 200, "description": "Role assigned successfully" }

@router.delete("/users/{user_id}/remove/{role_id}", response_model = ResponseMessage)
async def remove_role_from_user(user_id: UUID, role_id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(require_role_management_permission)):
    result = await remove_role(db, user_id, role_id, current_user.company_id)

    if result == "user_not_found":
        raise HTTPException(status_code = 404, detail = "User not found")

    if result == "assigment_not_found":
        raise HTTPException(status_code = 404, detail = "Role Assigment not found")

    return { "code": 200, "description": "Role removed successfully" }