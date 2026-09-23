from fastapi import FastAPI
from core.config import settings
from api.v1.router import router as api_router
import models

app = FastAPI(
    title = settings.app_name,
    version = "0.1.0"
)

app.include_router(
    api_router,
    prefix = settings.api_v1_prefix
)

@app.get("/health")
async def health_check():
    return { "status": "ok" }