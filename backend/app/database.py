"""Database connection managers with fallback support for all storage layers."""

from typing import Any

try:
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
except ImportError:
    AsyncIOMotorClient = None
    AsyncIOMotorDatabase = None

try:
    import asyncpg
except ImportError:
    asyncpg = None

try:
    import redis.asyncio as aioredis
except ImportError:
    aioredis = None

try:
    import chromadb
except ImportError:
    chromadb = None

try:
    from minio import Minio
except ImportError:
    Minio = None

try:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
    from sqlalchemy.orm import DeclarativeBase
except ImportError:
    create_async_engine = None
    AsyncSession = None
    async_sessionmaker = None
    DeclarativeBase = object

from app.config import get_settings

settings = get_settings()

# ── MongoDB (Primary Operational DB) ──────────────────────────────────────────
_mongo_client: Any = None


async def get_mongodb() -> Any:
    global _mongo_client
    if _mongo_client is None and AsyncIOMotorClient:
        _mongo_client = AsyncIOMotorClient(settings.mongodb_uri)
    return _mongo_client.nexus_os if _mongo_client else None


# ── PostgreSQL (Business Data) ───────────────────────────────────────────────
_pg_pool: Any = None


async def get_postgres_pool() -> Any:
    global _pg_pool
    if _pg_pool is None and asyncpg:
        _pg_pool = await asyncpg.create_pool(settings.postgres_uri, min_size=2, max_size=10)
    return _pg_pool


class Base(DeclarativeBase):
    pass


_engine: Any = None
AsyncSessionLocal: Any = None

if create_async_engine:
    try:
        _engine = create_async_engine(
            settings.postgres_uri.replace("postgresql://", "postgresql+asyncpg://"),
            echo=False,
        )
        AsyncSessionLocal = async_sessionmaker(_engine, class_=AsyncSession, expire_on_commit=False)
    except Exception:
        pass


# ── ChromaDB (Vector Memory) ─────────────────────────────────────────────────
_chroma_client: Any = None


def get_chroma() -> Any:
    global _chroma_client
    if _chroma_client is None and chromadb:
        _chroma_client = chromadb.HttpClient(
            host=settings.chroma_host,
            port=settings.chroma_port,
        )
    return _chroma_client


# ── Redis (Cache / Queue / Real-time State) ──────────────────────────────────
_redis: Any = None


async def get_redis() -> Any:
    global _redis
    if _redis is None and aioredis:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis


# ── MinIO (Object Storage) ───────────────────────────────────────────────────
_minio: Any = None


def get_minio() -> Any:
    global _minio
    if _minio is None and Minio:
        _minio = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
    return _minio


# ── Lifecycle ────────────────────────────────────────────────────────────────
async def connect_all():
    """Initialize database connections on startup gracefully."""
    try:
        if AsyncIOMotorClient:
            db = await get_mongodb()
            if db:
                await db.command("ping")
    except Exception:
        pass

    try:
        if asyncpg:
            pool = await get_postgres_pool()
            if pool:
                async with pool.acquire() as conn:
                    await conn.fetchval("SELECT 1")
    except Exception:
        pass

    try:
        if chromadb:
            get_chroma()
    except Exception:
        pass

    try:
        if aioredis:
            await get_redis()
    except Exception:
        pass

    try:
        if Minio:
            get_minio()
    except Exception:
        pass


async def disconnect_all():
    """Gracefully close all connections on shutdown."""
    global _mongo_client, _pg_pool, _redis
    try:
        if _mongo_client:
            _mongo_client.close()
            _mongo_client = None
    except Exception:
        pass
    try:
        if _pg_pool:
            await _pg_pool.close()
            _pg_pool = None
    except Exception:
        pass
    try:
        if _redis:
            await _redis.close()
            _redis = None
    except Exception:
        pass
