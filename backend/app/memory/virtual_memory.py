"""Virtual Memory Database – dynamic working memory layer.

Analogous to RAM in a computer system:
- Stores active agent context, reasoning chains, task state, communication
- Automatically promotes important data to long-term memory
- Discards irrelevant temporary data based on TTL and importance scoring
"""

import json
import math
from datetime import datetime, timedelta
from typing import Any

import structlog

from app.config import get_settings
from app.database import get_redis, get_mongodb, get_chroma
from app.models.schemas import VirtualMemoryEntry, MemoryEntry, MemoryType

logger = structlog.get_logger()
settings = get_settings()

VMDB_PREFIX = "vmdb:"
VMDB_INDEX = "vmdb:index"
VMDB_AGENT_PREFIX = "vmdb:agent:"


class VirtualMemoryDatabase:
    """RAM-like working memory with automatic promotion to long-term storage."""

    def __init__(self):
        self.ttl = settings.vmdb_ttl_seconds
        self.promotion_threshold = settings.vmdb_promotion_threshold
        self.max_entries = settings.vmdb_max_entries_per_agent

    # ── Write Operations ─────────────────────────────────────────────────

    async def store(
        self,
        agent_id: str,
        session_id: str,
        entry_type: str,
        content: dict[str, Any],
        importance: float = 0.0,
        ttl: int | None = None,
    ) -> VirtualMemoryEntry:
        """Store an entry in virtual memory (Redis hot layer + MongoDB warm layer)."""
        entry = VirtualMemoryEntry(
            agent_id=agent_id,
            session_id=session_id,
            entry_type=entry_type,
            content=content,
            importance_score=importance,
            ttl_seconds=ttl or self.ttl,
        )

        redis = await get_redis()
        key = f"{VMDB_PREFIX}{entry.id}"
        ttl_val = entry.ttl_seconds

        await redis.setex(key, ttl_val, entry.model_dump_json())
        await redis.zadd(VMDB_INDEX, {entry.id: entry.importance_score})
        await redis.zadd(f"{VMDB_AGENT_PREFIX}{agent_id}", {entry.id: datetime.utcnow().timestamp()})

        db = await get_mongodb()
        await db.virtual_memory.insert_one(entry.model_dump())

        await self._enforce_agent_limit(agent_id)
        logger.info("vmdb.store", agent_id=agent_id, entry_type=entry_type, id=entry.id)
        return entry

    async def retrieve(self, entry_id: str) -> VirtualMemoryEntry | None:
        """Retrieve from hot cache first, fall back to warm storage."""
        redis = await get_redis()
        key = f"{VMDB_PREFIX}{entry_id}"
        raw = await redis.get(key)

        if raw:
            entry = VirtualMemoryEntry.model_validate_json(raw)
            entry.access_count += 1
            entry.last_accessed = datetime.utcnow()
            entry.importance_score = self._recalculate_importance(entry)
            await redis.setex(key, entry.ttl_seconds, entry.model_dump_json())
            return entry

        db = await get_mongodb()
        doc = await db.virtual_memory.find_one({"id": entry_id})
        if doc:
            doc.pop("_id", None)
            return VirtualMemoryEntry(**doc)
        return None

    async def get_agent_context(self, agent_id: str, limit: int = 50) -> list[VirtualMemoryEntry]:
        """Get all active virtual memory for an agent, sorted by importance."""
        redis = await get_redis()
        entry_ids = await redis.zrevrange(f"{VMDB_AGENT_PREFIX}{agent_id}", 0, limit - 1)

        entries = []
        for eid in entry_ids:
            entry = await self.retrieve(eid)
            if entry:
                entries.append(entry)

        entries.sort(key=lambda e: e.importance_score, reverse=True)
        return entries

    async def get_session_snapshot(self, session_id: str) -> dict[str, Any]:
        """Capture full session state for persistence or recovery."""
        db = await get_mongodb()
        cursor = db.virtual_memory.find({"session_id": session_id})
        entries = []
        async for doc in cursor:
            doc.pop("_id", None)
            entries.append(doc)
        return {"session_id": session_id, "entries": entries, "captured_at": datetime.utcnow().isoformat()}

    # ── Promotion & Eviction ─────────────────────────────────────────────

    async def promote_to_long_term(self, entry_id: str) -> MemoryEntry | None:
        """Move important virtual memory entry to long-term semantic storage."""
        entry = await self.retrieve(entry_id)
        if not entry or entry.promoted:
            return None

        memory = MemoryEntry(
            agent_id=entry.agent_id,
            memory_type=MemoryType.LONG_TERM,
            content=json.dumps(entry.content),
            importance_score=entry.importance_score,
            metadata={
                "source": "vmdb_promotion",
                "original_entry_type": entry.entry_type,
                "session_id": entry.session_id,
                "access_count": entry.access_count,
            },
        )

        db = await get_mongodb()
        await db.memories.insert_one(memory.model_dump())

        try:
            chroma = get_chroma()
            collection = chroma.get_or_create_collection("long_term_memory")
            collection.add(
                documents=[memory.content],
                metadatas=[{"agent_id": entry.agent_id, "memory_id": memory.id, "type": "long_term"}],
                ids=[memory.id],
            )
            memory.embedding_id = memory.id
        except Exception as e:
            logger.warning("vmdb.chroma_promotion_failed", error=str(e))

        entry.promoted = True
        redis = await get_redis()
        await redis.setex(f"{VMDB_PREFIX}{entry_id}", entry.ttl_seconds, entry.model_dump_json())

        await db.virtual_memory.update_one({"id": entry_id}, {"$set": {"promoted": True}})
        logger.info("vmdb.promoted", entry_id=entry_id, memory_id=memory.id)
        return memory

    async def run_garbage_collection(self) -> dict[str, int]:
        """Scan virtual memory: promote important entries, evict stale ones."""
        redis = await get_redis()
        db = await get_mongodb()
        stats = {"promoted": 0, "evicted": 0, "scanned": 0}

        all_ids = await redis.zrange(VMDB_INDEX, 0, -1)
        for entry_id in all_ids:
            stats["scanned"] += 1
            entry = await self.retrieve(entry_id)
            if not entry:
                await redis.zrem(VMDB_INDEX, entry_id)
                stats["evicted"] += 1
                continue

            entry.importance_score = self._recalculate_importance(entry)

            if entry.importance_score >= self.promotion_threshold and not entry.promoted:
                await self.promote_to_long_term(entry_id)
                stats["promoted"] += 1
            elif entry.importance_score < 0.1 and entry.access_count == 0:
                await self._evict(entry_id)
                stats["evicted"] += 1

        logger.info("vmdb.gc_complete", **stats)
        return stats

    # ── Internal Helpers ─────────────────────────────────────────────────

    def _recalculate_importance(self, entry: VirtualMemoryEntry) -> float:
        """Score importance based on access frequency, recency, and type weight."""
        type_weights = {
            "reasoning_chain": 0.9,
            "task_state": 0.8,
            "communication": 0.6,
            "context": 0.7,
            "snapshot": 0.5,
            "execution_history": 0.85,
        }
        type_weight = type_weights.get(entry.entry_type, 0.5)

        age_seconds = (datetime.utcnow() - entry.created_at).total_seconds()
        recency = math.exp(-age_seconds / (self.ttl * 2))

        access_boost = min(entry.access_count * 0.05, 0.3)

        return min(type_weight * 0.4 + recency * 0.3 + access_boost + entry.importance_score * 0.3, 1.0)

    async def _evict(self, entry_id: str):
        redis = await get_redis()
        db = await get_mongodb()
        await redis.delete(f"{VMDB_PREFIX}{entry_id}")
        await redis.zrem(VMDB_INDEX, entry_id)
        await db.virtual_memory.delete_one({"id": entry_id})

    async def _enforce_agent_limit(self, agent_id: str):
        redis = await get_redis()
        count = await redis.zcard(f"{VMDB_AGENT_PREFIX}{agent_id}")
        if count > self.max_entries:
            oldest = await redis.zrange(f"{VMDB_AGENT_PREFIX}{agent_id}", 0, count - self.max_entries - 1)
            for eid in oldest:
                await self._evict(eid)
                await redis.zrem(f"{VMDB_AGENT_PREFIX}{agent_id}", eid)


vmdb = VirtualMemoryDatabase()
