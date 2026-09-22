from fastapi import FastAPI
from core.config import settings
from modules.users.users_router import router as users_router

app = FastAPI(
    title = settings.app_name,
    version = "0.1.0"
)

app.include_router(users_router)

@app.get("/health")
async def health_check():
    return { "status": "ok" }