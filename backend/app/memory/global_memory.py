"""Global Memory System – multi-tier memory management."""

from datetime import datetime
from typing import Any

import structlog

from app.database import get_mongodb, get_chroma, get_redis
from app.models.schemas import MemoryEntry, MemoryType
from app.memory.virtual_memory import vmdb

logger = structlog.get_logger()


class GlobalMemorySystem:
    """Unified memory layer spanning short-term, long-term, semantic, episodic, and project memory."""

    COLLECTIONS = {
        MemoryType.SEMANTIC: "semantic_memory",
        MemoryType.LONG_TERM: "long_term_memory",
        MemoryType.EPISODIC: "episodic_memory",
        MemoryType.PROJECT: "project_memory",
        MemoryType.USER_PREFERENCE: "user_preferences",
    }

    async def store(
        self,
        content: str,
        memory_type: MemoryType,
        agent_id: str | None = None,
        project_id: str | None = None,
        metadata: dict[str, Any] | None = None,
        importance: float = 0.5,
    ) -> MemoryEntry:
        entry = MemoryEntry(
            agent_id=agent_id,
            project_id=project_id,
            memory_type=memory_type,
            content=content,
            metadata=metadata or {},
            importance_score=importance,
        )

        db = await get_mongodb()
        await db.memories.insert_one(entry.model_dump())

        if memory_type in (MemoryType.SEMANTIC, MemoryType.LONG_TERM, MemoryType.PROJECT):
            await self._index_semantic(entry)

        redis = await get_redis()
        await redis.publish("memory:events", entry.model_dump_json())
        logger.info("memory.stored", type=memory_type.value, id=entry.id)
        return entry

    async def recall(
        self,
        query: str,
        memory_types: list[MemoryType] | None = None,
        agent_id: str | None = None,
        project_id: str | None = None,
        limit: int = 10,
    ) -> list[MemoryEntry]:
        """Hybrid retrieval: vector search + keyword filter."""
        results: list[MemoryEntry] = []

        try:
            chroma = get_chroma()
            collections_to_search = []
            types = memory_types or list(self.COLLECTIONS.keys())
            for mt in types:
                if mt in self.COLLECTIONS:
                    collections_to_search.append(self.COLLECTIONS[mt])

            for coll_name in collections_to_search:
                try:
                    collection = chroma.get_or_create_collection(coll_name)
                    where_filter = {}
                    if agent_id:
                        where_filter["agent_id"] = agent_id
                    query_params = {"query_texts": [query], "n_results": limit}
                    if where_filter:
                        query_params["where"] = where_filter

                    hits = collection.query(**query_params)
                    if hits and hits["documents"]:
                        for i, doc in enumerate(hits["documents"][0]):
                            meta = hits["metadatas"][0][i] if hits["metadatas"] else {}
                            results.append(MemoryEntry(
                                id=meta.get("memory_id", hits["ids"][0][i]),
                                content=doc,
                                memory_type=MemoryType.SEMANTIC,
                                agent_id=meta.get("agent_id"),
                                metadata=meta,
                            ))
                except Exception:
                    continue
        except Exception as e:
            logger.warning("memory.vector_search_failed", error=str(e))

        if not results:
            db = await get_mongodb()
            filter_query: dict[str, Any] = {}
            if memory_types:
                filter_query["memory_type"] = {"$in": [t.value for t in memory_types]}
            if agent_id:
                filter_query["agent_id"] = agent_id
            if project_id:
                filter_query["project_id"] = project_id

            cursor = db.memories.find(filter_query).sort("importance_score", -1).limit(limit)
            async for doc in cursor:
                doc.pop("_id", None)
                results.append(MemoryEntry(**doc))

        return results[:limit]

    async def get_project_memory(self, project_id: str) -> list[MemoryEntry]:
        db = await get_mongodb()
        cursor = db.memories.find({"project_id": project_id}).sort("created_at", -1)
        entries = []
        async for doc in cursor:
            doc.pop("_id", None)
            entries.append(MemoryEntry(**doc))
        return entries

    async def get_agent_working_memory(self, agent_id: str) -> list:
        """Get active working memory from VMDB."""
        return await vmdb.get_agent_context(agent_id)

    async def consolidate_session(self, agent_id: str, session_id: str):
        """End-of-session consolidation: promote valuable working memory to long-term."""
        snapshot = await vmdb.get_session_snapshot(session_id)
        for entry_data in snapshot.get("entries", []):
            entry_id = entry_data.get("id")
            if entry_id:
                await vmdb.promote_to_long_term(entry_id)

        await vmdb.run_garbage_collection()
        logger.info("memory.session_consolidated", agent_id=agent_id, session_id=session_id)

    async def _index_semantic(self, entry: MemoryEntry):
        try:
            chroma = get_chroma()
            coll_name = self.COLLECTIONS.get(entry.memory_type, "semantic_memory")
            collection = chroma.get_or_create_collection(coll_name)
            collection.add(
                documents=[entry.content],
                metadatas=[{
                    "memory_id": entry.id,
                    "agent_id": entry.agent_id or "",
                    "project_id": entry.project_id or "",
                    "type": entry.memory_type.value,
                }],
                ids=[entry.id],
            )
            entry.embedding_id = entry.id
        except Exception as e:
            logger.warning("memory.index_failed", error=str(e))


global_memory = GlobalMemorySystem()
