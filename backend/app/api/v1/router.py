from fastapi import APIRouter
from modules.users.users_router import router as users_router

router = APIRouter()

router.include_router(users_router)