"""OMEGA NEXUS AI OS – Application Configuration."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    app_name: str = "OMEGA NEXUS AI OS"
    app_version: str = "2.0.0-OMEGA"
    environment: str = "development"
    log_level: str = "INFO"

    # AI
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    master_ai_model: str = "gpt-4o"
    master_ai_max_agents: int = 5000
    master_ai_temperature: float = 0.7

    # MongoDB – Primary operational database
    mongodb_uri: str = "mongodb://nexus:nexus_secret@localhost:27017/nexus_os?authSource=admin"

    # PostgreSQL – Structured business data
    postgres_uri: str = "postgresql://nexus:nexus_secret@localhost:5432/nexus_business"

    # ChromaDB – Vector memory & semantic search
    chroma_host: str = "localhost"
    chroma_port: int = 8001

    # Redis – Caching, queues, real-time state
    redis_url: str = "redis://localhost:6379/0"

    # MinIO / S3 – Object storage
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "nexus"
    minio_secret_key: str = "nexus_secret"
    minio_bucket: str = "nexus-storage"
    minio_secure: bool = False

    # Virtual Memory Database
    vmdb_ttl_seconds: int = 3600
    vmdb_promotion_threshold: float = 0.75
    vmdb_max_entries_per_agent: int = 1000

    # Security
    jwt_secret: str = "change-this-in-production"
    jwt_expiry_hours: int = 24

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
