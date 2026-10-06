from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "ERP"
    app_env: str = "development"

    database_url: str
    alembic_database_url: str
    redis_url: str = "redis://redis:6379"

    api_v1_prefix: str = "/api/v1"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file = ".env.example",
        env_file_encoding = "utf-8",
        case_sensitive = False
    )

settings = Settings()