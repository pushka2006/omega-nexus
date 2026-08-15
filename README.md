# OMEGA NEXUS AI OS

**Ultimate Autonomous Multi-Agent Intelligence Platform v2.0**

A modular AI Operating System that functions as a digital organization led by a single Master AI, coordinating thousands of specialized agents to research, design, code, test, deploy, and maintain software, automation systems, robotics, and business solutions.

## Architecture

```
Human Operator (Dashboard / Voice / Mobile / Web)
        │
Master AI Brain (Central Orchestrator)
        │
   ┌────┼────┐
   │    │    │
Memory  Knowledge  Security
Layer   Hub      & Policies
   │    │    │
   Agent Orchestrator
        │
  ┌─────┼─────┐
  │     │     │
Software Research Business ... (40+ agent types)
  │     │     │
  Dynamic Sub-Agent Factory
        │
  Execution & Automation Layer
        │
  Real-World Integration Layer
        │
  Observability Layer
```

## Database Stack

| Database | Role |
|----------|------|
| **MongoDB** | Primary operational database (agents, tasks, goals, projects, logs) |
| **PostgreSQL** | Structured business data (revenue, approvals, audit logs, RBAC) |
| **ChromaDB** | Vector memory and semantic search |
| **Redis** | Caching, message queues, real-time state |
| **MinIO (S3)** | Object storage for files, media, backups |
| **Virtual Memory DB** | Active agent context, reasoning chains, working memory (Redis hot + MongoDB warm, auto-promotes to long-term) |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)

### Run with Docker

```bash
# Copy environment config
cp .env.example .env

# Start all services
docker compose up -d

# Dashboard: http://localhost:3000
# API:       http://localhost:8000
# API Docs:  http://localhost:8000/docs
# MinIO:     http://localhost:9001
```

### Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Core Modules

### Master AI Brain (`backend/app/core/master_ai.py`)
Central intelligence for goal decomposition, task assignment, result validation, and human command processing.

### Agent Orchestrator (`backend/app/agents/orchestrator.py`)
Creates, assigns, monitors, and retires agents including dynamic sub-agent generation.

### Agent Registry (`backend/app/agents/registry.py`)
Catalog of 40+ specialized agents across software, research, business, robotics, creative, and marketing domains.

### Virtual Memory Database (`backend/app/memory/virtual_memory.py`)
RAM-like working memory with automatic garbage collection and promotion to long-term semantic storage.

### Global Memory System (`backend/app/memory/global_memory.py`)
Multi-tier memory spanning short-term, long-term, semantic, episodic, project, and user preference memory.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/status` | Master AI status and system metrics |
| POST | `/api/v1/command` | Send command to Master AI |
| POST | `/api/v1/goals` | Create and process a new goal |
| GET | `/api/v1/agents` | List active agents |
| GET | `/api/v1/agents/catalog` | Full agent catalog |
| POST | `/api/v1/agents/spawn` | Spawn a new agent |
| GET | `/api/v1/tasks` | List tasks |
| GET | `/api/v1/projects` | List projects |
| POST | `/api/v1/memory/recall` | Semantic memory recall |
| GET | `/api/v1/approvals` | Pending approval queue |
| GET | `/api/v1/business/revenue` | Revenue analytics |
| WS | `/api/v1/ws` | Real-time event stream |

## Human Control

- All financial transactions require explicit approval
- Deployments to production require human authorization
- Legal agreements require user consent
- System can be paused/resumed at any time
- Every action includes explainability reports

## License

Proprietary – OMEGA NEXUS AI OS
