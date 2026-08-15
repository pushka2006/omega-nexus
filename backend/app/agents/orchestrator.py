"""Agent Orchestrator – creates, assigns, monitors, and retires agents."""

from datetime import datetime
from typing import Any

import structlog

from app.database import get_mongodb, get_redis
from app.models.schemas import (
    AgentInstance, AgentStatus, AgentCategory, AgentDefinition,
    Task, TaskStatus, ExplainabilityReport, RiskLevel,
)
from app.agents.registry import AGENT_CATALOG, get_agent_by_specialization
from app.memory.virtual_memory import vmdb

logger = structlog.get_logger()


class AgentOrchestrator:
    """Manages the full lifecycle of AI agents including dynamic sub-agent creation."""

    SUB_AGENT_MAP: dict[str, list[str]] = {
        "full_stack": ["backend", "frontend", "api", "database", "testing"],
        "marketing": ["instagram", "linkedin", "youtube", "email"],
        "research": ["market_research", "patent_research", "academic"],
        "robotics": ["computer_vision", "navigation", "iot"],
    }

    async def spawn_agent(
        self,
        specialization: str,
        project_id: str | None = None,
        parent_agent_id: str | None = None,
        task_id: str | None = None,
    ) -> AgentInstance:
        definition = get_agent_by_specialization(specialization)
        if not definition:
            definition = AgentDefinition(
                name=f"Dynamic {specialization.title()} AI",
                category=AgentCategory.SOFTWARE,
                specialization=specialization,
                is_temporary=True,
            )

        instance = AgentInstance(
            definition_id=definition.id,
            name=definition.name,
            category=definition.category,
            status=AgentStatus.IDLE,
            parent_agent_id=parent_agent_id,
            is_temporary=definition.is_temporary or parent_agent_id is not None,
            project_id=project_id,
            current_task_id=task_id,
        )

        db = await get_mongodb()
        await db.agents.insert_one(instance.model_dump())

        redis = await get_redis()
        await redis.publish("agent:events", instance.model_dump_json())
        await redis.incr("metrics:total_agents")

        logger.info("agent.spawned", agent_id=instance.id, name=instance.name, temporary=instance.is_temporary)
        return instance

    async def create_sub_agents(self, parent: AgentInstance, task: Task) -> list[AgentInstance]:
        """Dynamically create temporary sub-agents when a task benefits from specialization."""
        parent_def = get_agent_by_specialization(
            next((a.specialization for a in AGENT_CATALOG if a.id == parent.definition_id), "")
        )
        if not parent_def:
            return []

        sub_specs = self.SUB_AGENT_MAP.get(parent_def.specialization, [])
        if not sub_specs:
            return []

        sub_agents = []
        for spec in sub_specs:
            sub = await self.spawn_agent(
                specialization=spec,
                project_id=parent.project_id,
                parent_agent_id=parent.id,
                task_id=task.id,
            )
            sub_agents.append(sub)

        logger.info("agent.sub_agents_created", parent=parent.id, count=len(sub_agents))
        return sub_agents

    async def assign_task(self, agent_id: str, task: Task) -> AgentInstance:
        db = await get_mongodb()
        await db.agents.update_one(
            {"id": agent_id},
            {"$set": {"status": AgentStatus.WORKING.value, "current_task_id": task.id, "last_active": datetime.utcnow()}},
        )
        await db.tasks.update_one(
            {"id": task.id},
            {"$set": {"status": TaskStatus.IN_PROGRESS.value, "assigned_agent_id": agent_id}},
        )

        agent_doc = await db.agents.find_one({"id": agent_id})
        agent_doc.pop("_id", None)
        agent = AgentInstance(**agent_doc)

        await vmdb.store(
            agent_id=agent_id,
            session_id=task.id,
            entry_type="task_state",
            content={"task_id": task.id, "title": task.title, "status": "assigned"},
            importance=0.7,
        )
        return agent

    async def report_progress(
        self,
        agent_id: str,
        task_id: str,
        progress: dict[str, Any],
        explainability: ExplainabilityReport | None = None,
    ):
        db = await get_mongodb()
        await vmdb.store(
            agent_id=agent_id,
            session_id=task_id,
            entry_type="execution_history",
            content=progress,
            importance=0.6,
        )

        if explainability:
            await db.explainability.insert_one(explainability.model_dump())

        redis = await get_redis()
        await redis.publish("agent:progress", {
            "agent_id": agent_id,
            "task_id": task_id,
            "progress": progress,
        })

    async def complete_task(self, agent_id: str, task_id: str, result: dict[str, Any]):
        db = await get_mongodb()
        now = datetime.utcnow()

        await db.tasks.update_one(
            {"id": task_id},
            {"$set": {"status": TaskStatus.COMPLETED.value, "result": result, "completed_at": now}},
        )
        await db.agents.update_one(
            {"id": agent_id},
            {"$set": {"status": AgentStatus.IDLE.value, "current_task_id": None, "last_active": now}},
        )

        redis = await get_redis()
        await redis.incr("metrics:tasks_completed")

        if await self._should_retire(agent_id):
            await self.retire_agent(agent_id)

    async def retire_agent(self, agent_id: str):
        """Retire temporary sub-agents when their work is complete."""
        db = await get_mongodb()
        agent_doc = await db.agents.find_one({"id": agent_id})
        if not agent_doc or not agent_doc.get("is_temporary"):
            return

        await db.agents.update_one(
            {"id": agent_id},
            {"$set": {"status": AgentStatus.RETIRED.value, "last_active": datetime.utcnow()}},
        )
        await vmdb.run_garbage_collection()
        logger.info("agent.retired", agent_id=agent_id)

    async def get_active_agents(self, category: AgentCategory | None = None) -> list[AgentInstance]:
        db = await get_mongodb()
        query: dict[str, Any] = {"status": {"$ne": AgentStatus.RETIRED.value}}
        if category:
            query["category"] = category.value

        agents = []
        async for doc in db.agents.find(query).sort("last_active", -1):
            doc.pop("_id", None)
            agents.append(AgentInstance(**doc))
        return agents

    async def get_agent_stats(self) -> dict[str, Any]:
        db = await get_mongodb()
        total = await db.agents.count_documents({"status": {"$ne": AgentStatus.RETIRED.value}})
        active = await db.agents.count_documents({"status": AgentStatus.WORKING.value})
        by_category = {}
        for cat in AgentCategory:
            count = await db.agents.count_documents({"category": cat.value, "status": {"$ne": AgentStatus.RETIRED.value}})
            if count:
                by_category[cat.value] = count
        return {"total": total, "active": active, "by_category": by_category}

    async def _should_retire(self, agent_id: str) -> bool:
        db = await get_mongodb()
        agent = await db.agents.find_one({"id": agent_id})
        if not agent or not agent.get("is_temporary"):
            return False
        pending = await db.tasks.count_documents({
            "assigned_agent_id": agent_id,
            "status": {"$in": [TaskStatus.ASSIGNED.value, TaskStatus.IN_PROGRESS.value]},
        })
        return pending == 0


orchestrator = AgentOrchestrator()
