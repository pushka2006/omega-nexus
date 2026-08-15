"""Core data models for OMEGA NEXUS AI OS."""

from datetime import datetime
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field
import uuid


def new_id() -> str:
    return str(uuid.uuid4())


# ── Enums ────────────────────────────────────────────────────────────────────

class AgentStatus(str, Enum):
    IDLE = "idle"
    THINKING = "thinking"
    WORKING = "working"
    WAITING = "waiting"
    COMPLETED = "completed"
    ERROR = "error"
    RETIRED = "retired"


class AgentCategory(str, Enum):
    SOFTWARE = "software"
    RESEARCH = "research"
    BUSINESS = "business"
    ROBOTICS = "robotics"
    CREATIVE = "creative"
    DEVOPS = "devops"
    SECURITY = "security"
    DATA = "data"
    MARKETING = "marketing"


class TaskStatus(str, Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    FAILED = "failed"
    BLOCKED = "blocked"


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ESCALATED = "escalated"


class MemoryType(str, Enum):
    SHORT_TERM = "short_term"
    LONG_TERM = "long_term"
    SEMANTIC = "semantic"
    EPISODIC = "episodic"
    PROJECT = "project"
    USER_PREFERENCE = "user_preference"
    WORKING = "working"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ── Agent Models ─────────────────────────────────────────────────────────────

class AgentDefinition(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    category: AgentCategory
    specialization: str
    description: str = ""
    capabilities: list[str] = []
    parent_agent_id: str | None = None
    is_temporary: bool = False
    model: str = "gpt-4o"
    system_prompt: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentInstance(BaseModel):
    id: str = Field(default_factory=new_id)
    definition_id: str
    name: str
    category: AgentCategory
    status: AgentStatus = AgentStatus.IDLE
    current_task_id: str | None = None
    parent_agent_id: str | None = None
    is_temporary: bool = False
    project_id: str | None = None
    metrics: dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)


# ── Task Models ──────────────────────────────────────────────────────────────

class Task(BaseModel):
    id: str = Field(default_factory=new_id)
    title: str
    description: str
    status: TaskStatus = TaskStatus.PENDING
    priority: int = 5
    assigned_agent_id: str | None = None
    parent_task_id: str | None = None
    project_id: str | None = None
    goal_id: str | None = None
    dependencies: list[str] = []
    result: dict[str, Any] | None = None
    explainability: dict[str, Any] = {}
    requires_approval: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None


class Goal(BaseModel):
    id: str = Field(default_factory=new_id)
    title: str
    description: str
    status: TaskStatus = TaskStatus.PENDING
    tasks: list[str] = []
    project_id: str | None = None
    created_by: str = "human"
    progress: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Memory Models ────────────────────────────────────────────────────────────

class MemoryEntry(BaseModel):
    id: str = Field(default_factory=new_id)
    agent_id: str | None = None
    project_id: str | None = None
    memory_type: MemoryType
    content: str
    metadata: dict[str, Any] = {}
    importance_score: float = 0.5
    embedding_id: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime | None = None


class VirtualMemoryEntry(BaseModel):
    """Active working memory entry – lives in VMDB (Redis + MongoDB)."""
    id: str = Field(default_factory=new_id)
    agent_id: str
    session_id: str
    entry_type: str  # reasoning_chain, task_state, communication, context, snapshot
    content: dict[str, Any]
    importance_score: float = 0.0
    access_count: int = 0
    ttl_seconds: int = 3600
    promoted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_accessed: datetime = Field(default_factory=datetime.utcnow)


# ── Explainability ───────────────────────────────────────────────────────────

class ExplainabilityReport(BaseModel):
    action_id: str = Field(default_factory=new_id)
    agent_id: str
    agent_name: str
    action: str
    reasoning: str
    confidence: float
    evidence: list[str] = []
    alternatives_considered: list[str] = []
    expected_outcome: str = ""
    risk_level: RiskLevel = RiskLevel.LOW
    risk_assessment: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ── Project ──────────────────────────────────────────────────────────────────

class Project(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    description: str = ""
    status: str = "planning"
    completion: float = 0.0
    agents: list[str] = []
    tasks: list[str] = []
    tech_stack: list[str] = []
    repository_url: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── System Metrics ───────────────────────────────────────────────────────────

class SystemMetrics(BaseModel):
    total_agents: int = 0
    active_agents: int = 0
    total_projects: int = 0
    active_projects: int = 0
    deployed_apps: int = 0
    tasks_completed: int = 0
    system_health: float = 99.6
    master_ai_cpu: float = 0.0
    neural_load: float = 0.0
    memory_used_tb: float = 0.0
    memory_total_tb: float = 16.0
    quantum_threads: int = 0
    uptime_seconds: int = 0


# ── Distributed Compute Models ───────────────────────────────────────────────

class ComputeNodeType(str, Enum):
    GPU_CLUSTER = "gpu_cluster"
    CPU_NODE = "cpu_node"
    EDGE_DEVICE = "edge_device"
    CLOUD_VM = "cloud_vm"


class ComputeNode(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    node_type: ComputeNodeType = ComputeNodeType.GPU_CLUSTER
    status: str = "online"
    ip_address: str = "127.0.0.1"
    cpu_cores: int = 64
    gpu_model: str | None = "NVIDIA A100-SXM4-80GB"
    gpu_count: int = 8
    vram_gb: float = 640.0
    ram_gb: float = 512.0
    active_agent_tasks: int = 0
    utilization_pct: float = 42.5
    location: str = "us-east-1"


# ── Autonomous Software Factory Models ───────────────────────────────────────

class TargetPlatform(str, Enum):
    SAAS = "saas"
    ANDROID = "android"
    IOS = "ios"
    DESKTOP = "desktop"
    ROBOTICS = "robotics"
    SMART_CITY = "smart_city"
    IOT = "iot"
    GAME = "game"


class SoftwareFactoryRequest(BaseModel):
    project_name: str
    target_platform: TargetPlatform
    specification: str
    features: list[str] = []
    tech_stack: list[str] = []
    auto_generate_tests: bool = True
    auto_deploy: bool = False


class SoftwareFactoryArtifact(BaseModel):
    id: str = Field(default_factory=new_id)
    project_name: str
    target_platform: TargetPlatform
    architecture_diagram: str = ""
    generated_files_count: int = 0
    test_coverage_pct: float = 98.4
    build_status: str = "success"
    deployment_url: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Deployment Pipeline Models ───────────────────────────────────────────────

class DeploymentStrategy(str, Enum):
    CANARY = "canary"
    BLUE_GREEN = "blue_green"
    ROLLING = "rolling"


class DeploymentPipeline(BaseModel):
    id: str = Field(default_factory=new_id)
    project_id: str
    app_name: str
    environment: str = "production"
    strategy: DeploymentStrategy = DeploymentStrategy.CANARY
    status: str = "healthy"
    traffic_split_pct: dict[str, int] = {"canary": 10, "stable": 90}
    kubernetes_cluster: str = "k8s-prod-us-east-1"
    active_replicas: int = 12
    health_score: float = 99.8
    last_rollback_at: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Robotics & Smart City Telemetry ──────────────────────────────────────────

class RoboticsDeviceTelemetry(BaseModel):
    device_id: str
    device_type: str
    location: str
    status: str = "operational"
    battery_level_pct: float = 94.0
    cpu_load_pct: float = 28.4
    sensor_readings: dict[str, Any] = {}
    last_ping: datetime = Field(default_factory=datetime.utcnow)


# ── Supply Chain Security Scan ──────────────────────────────────────────────

class SupplyChainScanResult(BaseModel):
    id: str = Field(default_factory=new_id)
    target_repository: str
    vulnerabilities_found: int = 0
    critical_count: int = 0
    high_count: int = 0
    medium_count: int = 0
    passed_audit: bool = True
    scanned_packages_count: int = 1483
    scan_timestamp: datetime = Field(default_factory=datetime.utcnow)

