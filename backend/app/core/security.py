"""Security & Policy enforcement layer."""

from datetime import datetime
from typing import Any
from enum import Enum

import structlog

from app.database import get_mongodb, get_postgres_pool
from app.models.schemas import RiskLevel

logger = structlog.get_logger()


class PolicyAction(str, Enum):
    ALLOW = "allow"
    DENY = "deny"
    REQUIRE_APPROVAL = "require_approval"


SENSITIVE_ACTIONS = {
    "financial_transaction": PolicyAction.REQUIRE_APPROVAL,
    "production_deployment": PolicyAction.REQUIRE_APPROVAL,
    "legal_agreement": PolicyAction.REQUIRE_APPROVAL,
    "credential_access": PolicyAction.REQUIRE_APPROVAL,
    "external_api_call": PolicyAction.ALLOW,
    "code_generation": PolicyAction.ALLOW,
    "data_export": PolicyAction.REQUIRE_APPROVAL,
    "agent_spawn": PolicyAction.ALLOW,
    "system_config_change": PolicyAction.REQUIRE_APPROVAL,
}


class SecurityPolicyEngine:
    """Enforces RBAC, rate limiting, and approval policies."""

    async def evaluate_action(
        self,
        action_type: str,
        actor_id: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        policy = SENSITIVE_ACTIONS.get(action_type, PolicyAction.ALLOW)
        risk = self._assess_risk(action_type, payload)

        result = {
            "action_type": action_type,
            "policy": policy.value,
            "risk_level": risk.value,
            "allowed": policy == PolicyAction.ALLOW,
            "requires_approval": policy == PolicyAction.REQUIRE_APPROVAL,
            "timestamp": datetime.utcnow().isoformat(),
        }

        await self._audit_log(actor_id, action_type, result)
        return result

    async def check_rate_limit(self, actor_id: str, action: str, limit: int = 100, window: int = 60) -> bool:
        from app.database import get_redis
        redis = await get_redis()
        key = f"ratelimit:{actor_id}:{action}"
        current = await redis.incr(key)
        if current == 1:
            await redis.expire(key, window)
        return current <= limit

    def _assess_risk(self, action_type: str, payload: dict[str, Any] | None) -> RiskLevel:
        high_risk = {"financial_transaction", "production_deployment", "credential_access", "data_export"}
        medium_risk = {"legal_agreement", "system_config_change", "external_api_call"}

        if action_type in high_risk:
            return RiskLevel.HIGH
        if action_type in medium_risk:
            return RiskLevel.MEDIUM
        return RiskLevel.LOW

    async def _audit_log(self, actor_id: str, action: str, details: dict):
        try:
            pool = await get_postgres_pool()
            async with pool.acquire() as conn:
                await conn.execute(
                    """INSERT INTO audit_logs (actor_type, action, details)
                       VALUES ($1, $2, $3)""",
                    actor_id, action, str(details),
                )
        except Exception as e:
            logger.warning("security.audit_failed", error=str(e))

        db = await get_mongodb()
        await db.audit_logs.insert_one({
            "actor_id": actor_id,
            "action": action,
            "details": details,
            "timestamp": datetime.utcnow(),
        })


security_engine = SecurityPolicyEngine()
