from fastapi import APIRouter
from modules.users.users_router import router as users_router
from modules.companies.companies_router import router as companies_router

router = APIRouter()

routers = [
    users_router,
    companies_router
]

for r in routers:
    router.include_router(r)