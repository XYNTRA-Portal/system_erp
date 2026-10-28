from fastapi import FastAPI
from core.config import settings
from api.v1.router import router as api_router
from fastapi.middleware.cors import CORSMiddleware
import models

app = FastAPI(
    title = settings.app_name,
    version = "0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(
    api_router,
    prefix = settings.api_v1_prefix
)

@app.get("/health")
async def health_check():
    return { "status": "ok" }