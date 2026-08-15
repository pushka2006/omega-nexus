"""OMEGA NEXUS AI OS – FastAPI Application Entry Point."""

import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import connect_all, disconnect_all, get_redis
from app.api.routes import router

settings = get_settings()
from app.core.agent_trainer import agent_trainer

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("nexus.startup", version=settings.app_version)
    try:
        await connect_all()
        redis = await get_redis()
        await redis.set("metrics:uptime_start", str(int(time.time())))
        await _seed_demo_data()
        logger.info("nexus.databases_connected")
        
        # Start Master AI Background Training Loop for all 36 Agents
        await agent_trainer.start()
        logger.info("nexus.agent_trainer_launched")
    except Exception as e:
        logger.warning("nexus.startup_partial", error=str(e))
    yield
    await agent_trainer.stop()
    await disconnect_all()
    logger.info("nexus.shutdown")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Ultimate Autonomous Multi-Agent Intelligence Platform",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")
app.include_router(router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "healthy", "version": settings.app_version}


async def _seed_demo_data():
    """Seed initial demo data for the dashboard."""
    from app.database import get_mongodb, get_postgres_pool
    db = await get_mongodb()

    if await db.projects.count_documents({}) == 0:
        demo_projects = [
            {"id": "proj-1", "name": "SmartShop SaaS", "status": "in_progress", "completion": 73.6,
             "description": "E-commerce SaaS platform", "tech_stack": ["Next.js", "Node.js", "PostgreSQL"]},
            {"id": "proj-2", "name": "Nexus CRM", "status": "deployed", "completion": 100,
             "description": "AI-powered CRM system", "tech_stack": ["React", "FastAPI", "MongoDB"]},
            {"id": "proj-3", "name": "Guide Robot OS", "status": "testing", "completion": 85,
             "description": "Autonomous guide robot software", "tech_stack": ["ROS2", "Python", "C++"]},
        ]
        await db.projects.insert_many(demo_projects)

    if await db.activity_log.count_documents({}) == 0:
        activities = [
            {"agent": "Code AI", "action": "Pushed new commit to SmartShop SaaS", "type": "code", "timestamp": "2026-05-21T10:30:00"},
            {"agent": "Marketing AI", "action": "Launched Instagram campaign for Nexus CRM", "type": "marketing", "timestamp": "2026-05-21T10:28:00"},
            {"agent": "Research AI", "action": "Completed market analysis report", "type": "research", "timestamp": "2026-05-21T10:25:00"},
            {"agent": "DevOps AI", "action": "Deployed Nexus CRM v2.1 to production", "type": "deploy", "timestamp": "2026-05-21T10:20:00"},
            {"agent": "Security AI", "action": "Blocked suspicious API request from 185.x.x.x", "type": "security", "timestamp": "2026-05-21T10:15:00"},
            {"agent": "Data AI", "action": "Generated weekly analytics dashboard", "type": "data", "timestamp": "2026-05-21T10:10:00"},
            {"agent": "Finance AI", "action": "Processed $4,250 revenue from SmartShop", "type": "finance", "timestamp": "2026-05-21T10:05:00"},
        ]
        await db.activity_log.insert_many(activities)

    try:
        pool = await get_postgres_pool()
        async with pool.acquire() as conn:
            count = await conn.fetchval("SELECT COUNT(*) FROM revenue_records")
            if count == 0:
                await conn.executemany(
                    """INSERT INTO revenue_records (amount, record_type, description)
                       VALUES ($1, $2, $3)""",
                    [
                        (45250.00, "sale", "SmartShop SaaS – monthly subscriptions"),
                        (32100.00, "sale", "Nexus CRM – enterprise license"),
                        (18900.00, "mrr", "Combined MRR – May 2026"),
                        (8750.00, "sale", "Guide Robot OS – pilot deployment"),
                        (128457.00, "mrr", "Total MRR – May 2026"),
                    ],
                )
            approval_count = await conn.fetchval("SELECT COUNT(*) FROM approval_requests")
            if approval_count == 0:
                await conn.executemany(
                    """INSERT INTO approval_requests (request_type, title, description, priority, payload)
                       VALUES ($1, $2, $3, $4, $5)""",
                    [
                        ("deployment", "Deploy SmartShop SaaS to Production", "Version 2.0 ready for production deployment", "high", '{}'),
                        ("financial", "Process Vendor Payment – $12,500", "AWS infrastructure payment due", "high", '{}'),
                        ("deployment", "Deploy Guide Robot OS Update", "Navigation module v3.2", "medium", '{}'),
                        ("legal", "Accept SaaS Terms of Service v2", "Updated terms for SmartShop platform", "medium", '{}'),
                    ],
                )
    except Exception:
        pass
