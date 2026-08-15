"""Engine Registry – Catalog of all 36 Specialized AI Engines with 14 modular layers."""

from datetime import datetime
from typing import Dict, List, Any
from app.engines.base_engine import BaseAIEngine

ENGINE_DEFINITIONS = [
    {
        "id": "engine-01-research",
        "name": "Research Engine",
        "category": "Data & Research",
        "description": "Literature review, paper synthesis, patent search, academic hypothesis & citation analysis.",
        "domain_terms": ["literature_review", "arxiv_synthesis", "patent_prior_art", "citation_graph"],
        "primary_model": "GPT-4o Research",
        "system_prompt": "You are the Specialized Research AI Engine designed for deep academic and market synthesis.",
        "tools": ["arxiv_api", "patent_search", "web_scraper", "python_ast"],
        "endpoints": ["/api/v1/engines/research/query", "/api/v1/engines/research/synthesize"],
    },
    {
        "id": "engine-02-coding",
        "name": "Coding Engine",
        "category": "Software",
        "description": "Full-stack code generation, refactoring, code review, AST parsing, and bug resolution.",
        "domain_terms": ["ast_parsing", "clean_code", "design_patterns", "refactoring", "unit_testing"],
        "primary_model": "Claude 3.5 Sonnet Code",
        "system_prompt": "You are the Specialized Coding AI Engine capable of writing production-grade software.",
        "tools": ["python_ast", "git_tool", "linter", "pytest_runner"],
        "endpoints": ["/api/v1/engines/coding/generate", "/api/v1/engines/coding/refactor"],
    },
    {
        "id": "engine-03-bi",
        "name": "Business Intelligence Engine",
        "category": "Business",
        "description": "KPI tracking, process modeling, executive dashboarding, and market position analysis.",
        "domain_terms": ["bpmn_modeling", "kpi_dashboards", "process_mining", "swot_analysis"],
        "primary_model": "GPT-4o Enterprise",
        "system_prompt": "You are the Specialized Business Intelligence Engine powering corporate decision making.",
        "tools": ["sql_executor", "powerbi_export", "trend_analyzer"],
        "endpoints": ["/api/v1/engines/bi/metrics", "/api/v1/engines/bi/report"],
    },
    {
        "id": "engine-04-finance",
        "name": "Finance Engine",
        "category": "Business",
        "description": "Financial modeling, MRR/ARR forecasting, budgeting, revenue auditing, and tax compliance.",
        "domain_terms": ["mrr_forecasting", "arr_modeling", "dcf_valuation", "audit_trail"],
        "primary_model": "GPT-4o Finance",
        "system_prompt": "You are the Specialized Financial AI Engine managing revenues, forecasts, and budgets.",
        "tools": ["financial_calculator", "postgres_revenue_store", "excel_generator"],
        "endpoints": ["/api/v1/engines/finance/forecast", "/api/v1/engines/finance/revenue"],
    },
    {
        "id": "engine-05-marketing",
        "name": "Marketing Engine",
        "category": "Marketing",
        "description": "Growth strategy, campaign creation, ad copywriting, conversion funnels, and branding.",
        "domain_terms": ["conversion_funnel", "copywriting", "growth_hacking", "brand_identity"],
        "primary_model": "GPT-4o Creative",
        "system_prompt": "You are the Specialized Marketing AI Engine optimizing customer acquisition and brand growth.",
        "tools": ["social_poster", "ad_copy_generator", "campaign_analytics"],
        "endpoints": ["/api/v1/engines/marketing/campaigns", "/api/v1/engines/marketing/copy"],
    },
    {
        "id": "engine-06-cybersecurity",
        "name": "Cybersecurity Engine",
        "category": "DevOps & Security",
        "description": "Vulnerability scanning, penetration testing, Zero-Trust compliance, and incident response.",
        "domain_terms": ["owasp_top_10", "vulnerability_scan", "zero_trust_rbac", "threat_vector"],
        "primary_model": "SecLM Security",
        "system_prompt": "You are the Specialized Cybersecurity AI Engine securing infrastructure and codebases.",
        "tools": ["vulnerability_scanner", "dep_auditor", "rbac_policy_checker"],
        "endpoints": ["/api/v1/engines/cybersecurity/scan", "/api/v1/engines/cybersecurity/audit"],
    },
    {
        "id": "engine-07-robotics",
        "name": "Robotics Engine",
        "category": "Robotics",
        "description": "ROS2 kinematics, motion planning, Gazebo simulation, SLAM navigation, and motor control.",
        "domain_terms": ["ros2_nodes", "motion_planning_ompl", "gazebo_sim", "slam_localization"],
        "primary_model": "RoboLM v2",
        "system_prompt": "You are the Specialized Robotics AI Engine commanding robot hardware and simulation.",
        "tools": ["ros2_cli", "gazebo_runner", "serial_bus_telemetry"],
        "endpoints": ["/api/v1/engines/robotics/kinematics", "/api/v1/engines/robotics/telemetry"],
    },
    {
        "id": "engine-08-iot",
        "name": "IoT Engine",
        "category": "Robotics & Hardware",
        "description": "MQTT telemetry, sensor fusion, edge node control, firmware flashing, and IoT dashboards.",
        "domain_terms": ["mqtt_broker", "sensor_fusion", "edge_telemetry", "rtos_firmware"],
        "primary_model": "EdgeAI Lite",
        "system_prompt": "You are the Specialized IoT Engine connecting embedded devices and sensor streams.",
        "tools": ["mqtt_client", "serial_monitor", "sensor_simulator"],
        "endpoints": ["/api/v1/engines/iot/telemetry", "/api/v1/engines/iot/devices"],
    },
    {
        "id": "engine-09-smartcity",
        "name": "Smart City Engine",
        "category": "Robotics & Urban",
        "description": "Traffic flow optimization, smart grid energy monitoring, and public safety telemetry.",
        "domain_terms": ["traffic_flow_optimizer", "grid_load_balance", "environmental_sensors"],
        "primary_model": "UrbanAI OS",
        "system_prompt": "You are the Specialized Smart City Engine managing municipal data networks.",
        "tools": ["gis_mapping", "traffic_sim", "energy_grid_monitor"],
        "endpoints": ["/api/v1/engines/smartcity/traffic", "/api/v1/engines/smartcity/grid"],
    },
    {
        "id": "engine-10-computervision",
        "name": "Computer Vision Engine",
        "category": "Software & Vision",
        "description": "YOLO object detection, OCR extraction, depth estimation, and video stream processing.",
        "domain_terms": ["yolo_v8_detection", "ocr_extraction", "depth_map", "video_feed_analyzer"],
        "primary_model": "VisionTransformer v3",
        "system_prompt": "You are the Specialized Computer Vision Engine extracting insight from visual data.",
        "tools": ["opencv_runner", "yolo_detector", "ocr_tesseract"],
        "endpoints": ["/api/v1/engines/vision/detect", "/api/v1/engines/vision/ocr"],
    },
    {
        "id": "engine-11-voice",
        "name": "Voice Engine",
        "category": "Software & Audio",
        "description": "Speech-to-Text, Whisper audio transcription, Text-to-Speech synthesis, and voice commands.",
        "domain_terms": ["whisper_stt", "tts_synthesis", "phoneme_mapping", "audio_feature_extraction"],
        "primary_model": "Whisper Large v3",
        "system_prompt": "You are the Specialized Voice AI Engine processing natural audio speech.",
        "tools": ["whisper_transcriber", "bark_tts", "audio_ffmpeg"],
        "endpoints": ["/api/v1/engines/voice/transcribe", "/api/v1/engines/voice/synthesize"],
    },
    {
        "id": "engine-12-nlp",
        "name": "NLP Engine",
        "category": "Software & NLP",
        "description": "Named entity recognition, sentiment analysis, text summarization, and translation.",
        "domain_terms": ["ner_extraction", "sentiment_scoring", "abstractive_summarization", "bilingual_translation"],
        "primary_model": "Llama 3 Instruct",
        "system_prompt": "You are the Specialized Natural Language Processing Engine analyzing unstructured text.",
        "tools": ["spacy_nlp", "sentiment_analyzer", "text_summarizer"],
        "endpoints": ["/api/v1/engines/nlp/parse", "/api/v1/engines/nlp/sentiment"],
    },
    {
        "id": "engine-13-planning",
        "name": "Planning Engine",
        "category": "Core Intelligence",
        "description": "Hierarchical task decomposition, dependency resolution DAGs, and goal execution.",
        "domain_terms": ["task_dag_decomposition", "dependency_resolution", "milestone_tracking"],
        "primary_model": "DeepSeek R1 Planner",
        "system_prompt": "You are the Specialized Planning AI Engine creating structured action paths for goals.",
        "tools": ["dag_planner", "milestone_tracker", "critical_path_analyzer"],
        "endpoints": ["/api/v1/engines/planning/decompose", "/api/v1/engines/planning/schedule"],
    },
    {
        "id": "engine-14-reasoning",
        "name": "Reasoning Engine",
        "category": "Core Intelligence",
        "description": "First-principles deduction, mathematical logic, formal verification, and decision trees.",
        "domain_terms": ["first_principles", "tree_of_thoughts", "formal_verification", "logical_inference"],
        "primary_model": "DeepSeek R1 Reasoning",
        "system_prompt": "You are the Specialized Reasoning Engine solving complex logical and mathematical problems.",
        "tools": ["tree_of_thoughts", "smt_solver", "math_symbolic_engine"],
        "endpoints": ["/api/v1/engines/reasoning/deduce", "/api/v1/engines/reasoning/verify"],
    },
    {
        "id": "engine-15-knowledge",
        "name": "Knowledge Engine",
        "category": "Core Intelligence",
        "description": "Global knowledge graph, semantic memory indexing, vector RAG retrieval, and facts database.",
        "domain_terms": ["knowledge_graph", "vector_embeddings", "semantic_search", "fact_retrieval"],
        "primary_model": "GPT-4o Knowledge",
        "system_prompt": "You are the Specialized Knowledge AI Engine organizing system memory and global facts.",
        "tools": ["chroma_vector_db", "neo4j_graph_query", "memory_recaller"],
        "endpoints": ["/api/v1/engines/knowledge/query", "/api/v1/engines/knowledge/index"],
    },
    {
        "id": "engine-16-database",
        "name": "Database Engine",
        "category": "Software & Infra",
        "description": "Schema design, SQL query optimization, migration generation, and index tuning.",
        "domain_terms": ["schema_normalization", "sql_indexing", "migration_scripts", "query_execution_plan"],
        "primary_model": "Claude 3.5 DB",
        "system_prompt": "You are the Specialized Database AI Engine designing and optimizing data stores.",
        "tools": ["sql_optimizer", "schema_migrator", "explain_plan_analyzer"],
        "endpoints": ["/api/v1/engines/database/optimize", "/api/v1/engines/database/schema"],
    },
    {
        "id": "engine-17-devops",
        "name": "DevOps Engine",
        "category": "DevOps & Cloud",
        "description": "CI/CD pipelines, Docker containerization, Kubernetes manifests, and monitoring.",
        "domain_terms": ["dockerfile_gen", "kubernetes_k8s", "github_actions", "prometheus_grafana"],
        "primary_model": "DevOps AI v2",
        "system_prompt": "You are the Specialized DevOps Engine automating deployments and CI/CD pipelines.",
        "tools": ["docker_runner", "kubectl_cli", "terraform_builder"],
        "endpoints": ["/api/v1/engines/devops/pipeline", "/api/v1/engines/devops/deploy"],
    },
    {
        "id": "engine-18-cloud",
        "name": "Cloud Engine",
        "category": "DevOps & Cloud",
        "description": "Multi-cloud architecture (AWS/GCP/Azure), serverless infrastructure, and cost optimization.",
        "domain_terms": ["aws_terraform", "gcp_serverless", "cost_finops", "cloud_networking"],
        "primary_model": "CloudArchitect v3",
        "system_prompt": "You are the Specialized Cloud AI Engine designing resilient cloud infrastructure.",
        "tools": ["terraform_planner", "finops_cost_calculator", "aws_sdk"],
        "endpoints": ["/api/v1/engines/cloud/architecture", "/api/v1/engines/cloud/costs"],
    },
    {
        "id": "engine-19-testing",
        "name": "Testing Engine",
        "category": "Software & QA",
        "description": "Unit test generation, integration suites, Cypress/Playwright E2E, and regression testing.",
        "domain_terms": ["pytest_generation", "cypress_e2e", "coverage_report", "regression_suite"],
        "primary_model": "Claude 3.5 QA",
        "system_prompt": "You are the Specialized Testing AI Engine ensuring code quality and test coverage.",
        "tools": ["pytest_runner", "cypress_runner", "coverage_reporter"],
        "endpoints": ["/api/v1/engines/testing/generate", "/api/v1/engines/testing/run"],
    },
    {
        "id": "engine-20-uiux",
        "name": "UI/UX Engine",
        "category": "Creative & Design",
        "description": "Design system generation, responsive Tailwind components, Figma wireframes, and UX research.",
        "domain_terms": ["design_tokens", "react_tailwind", "ux_wireframing", "accessibility_a11y"],
        "primary_model": "UI-Gen AI",
        "system_prompt": "You are the Specialized UI/UX Design Engine crafting beautiful user interfaces.",
        "tools": ["figma_exporter", "react_component_gen", "a11y_auditor"],
        "endpoints": ["/api/v1/engines/uiux/wireframe", "/api/v1/engines/uiux/component"],
    },
    {
        "id": "engine-21-3d",
        "name": "3D Engine",
        "category": "Creative & Design",
        "description": "3D mesh generation, Blender scripting, PBR texturing, GLTF exports, and Three.js scenes.",
        "domain_terms": ["gltf_export", "pbr_materials", "blender_python_api", "threejs_scene"],
        "primary_model": "Nexus3D MeshGen",
        "system_prompt": "You are the Specialized 3D Artist Engine generating 3D assets and shaders.",
        "tools": ["blender_api", "gltf_exporter", "texture_gen"],
        "endpoints": ["/api/v1/engines/3d/generate", "/api/v1/engines/3d/render"],
    },
    {
        "id": "engine-22-game",
        "name": "Game Engine",
        "category": "Creative & Games",
        "description": "Unreal Engine 5 Blueprints, Unity C# logic, level design, game physics, and NPC behavior.",
        "domain_terms": ["unreal_blueprints", "unity_csharp", "procedural_level_gen", "npc_state_machine"],
        "primary_model": "GameForge AI",
        "system_prompt": "You are the Specialized Game AI Engine building game systems and mechanics.",
        "tools": ["unity_editor_api", "unreal_blueprint_gen", "asset_pack_loader"],
        "endpoints": ["/api/v1/engines/game/level", "/api/v1/engines/game/script"],
    },
    {
        "id": "engine-23-simulation",
        "name": "Simulation Engine",
        "category": "Robotics & Sim",
        "description": "Physics simulation, Monte Carlo rollouts, fluid dynamics, and agent behavior modeling.",
        "domain_terms": ["physics_rigid_body", "monte_carlo_sim", "agent_multi_rollout", "fluid_dynamics"],
        "primary_model": "SimEngine Ultra",
        "system_prompt": "You are the Specialized Simulation AI Engine running complex physical and social models.",
        "tools": ["pybullet_sim", "monte_carlo_runner", "matlab_octave_api"],
        "endpoints": ["/api/v1/engines/simulation/run", "/api/v1/engines/simulation/rollout"],
    },
    {
        "id": "engine-24-datascience",
        "name": "Data Science Engine",
        "category": "Data & Research",
        "description": "Exploratory data analysis, statistical modeling, Pandas pipelines, and hypothesis testing.",
        "domain_terms": ["pandas_eda", "scikit_learn", "time_series_forecasting", "statistical_tests"],
        "primary_model": "DataSci GPT",
        "system_prompt": "You are the Specialized Data Science Engine transforming raw data into predictive insights.",
        "tools": ["pandas_runner", "scikit_learn_trainer", "plotly_exporter"],
        "endpoints": ["/api/v1/engines/datascience/eda", "/api/v1/engines/datascience/model"],
    },
    {
        "id": "engine-25-mltraining",
        "name": "ML Training Engine",
        "category": "Data & ML",
        "description": "PyTorch model fine-tuning, LoRA training adapters, gradient optimization, and evaluation loss.",
        "domain_terms": ["pytorch_training_loop", "lora_adapters", "gradient_descent", "hyperparameter_sweep"],
        "primary_model": "PyTorch AI Trainer",
        "system_prompt": "You are the Specialized ML Training Engine training and tuning neural networks.",
        "tools": ["pytorch_runner", "huggingface_trainer", "tensorboard_logger"],
        "endpoints": ["/api/v1/engines/mltraining/train", "/api/v1/engines/mltraining/loss"],
    },
    {
        "id": "engine-26-modelrouter",
        "name": "AI Model Router",
        "category": "Core Infrastructure",
        "description": "Dynamic LLM model routing, latency vs cost optimization, and fallback failover control.",
        "domain_terms": ["llm_routing_matrix", "token_cost_optimizer", "fallback_circuit_breaker"],
        "primary_model": "Nexus Router v2",
        "system_prompt": "You are the Specialized AI Model Router directing user queries to the optimal LLM.",
        "tools": ["router_matrix", "token_counter", "latency_monitor"],
        "endpoints": ["/api/v1/engines/modelrouter/route", "/api/v1/engines/modelrouter/stats"],
    },
    {
        "id": "engine-27-automation",
        "name": "Automation Engine",
        "category": "Workflow & Automation",
        "description": "RPA browser automation, web scraping, scheduled task execution, and system scripts.",
        "domain_terms": ["rpa_playwright", "cron_scheduling", "subprocess_execution", "webhook_trigger"],
        "primary_model": "Automation AI",
        "system_prompt": "You are the Specialized Automation Engine automating repetitive manual workflows.",
        "tools": ["playwright_rpa", "cron_runner", "script_executor"],
        "endpoints": ["/api/v1/engines/automation/trigger", "/api/v1/engines/automation/jobs"],
    },
    {
        "id": "engine-28-workflow",
        "name": "Workflow Engine",
        "category": "Workflow & Automation",
        "description": "Multi-agent state machines, step function orchestration, approval queues, and error retries.",
        "domain_terms": ["state_machine_fsm", "approval_gatekeepers", "retry_exponential_backoff"],
        "primary_model": "Orchestrator Workflow",
        "system_prompt": "You are the Specialized Workflow AI Engine executing complex multi-step pipelines.",
        "tools": ["fsm_runner", "approval_queue", "retry_handler"],
        "endpoints": ["/api/v1/engines/workflow/start", "/api/v1/engines/workflow/state"],
    },
    {
        "id": "engine-29-legal",
        "name": "Legal & Compliance Engine",
        "category": "Business & Legal",
        "description": "Contract review, GDPR/HIPAA compliance audit, terms of service generation, and licensing.",
        "domain_terms": ["gdpr_compliance", "contract_clause_analysis", "terms_of_service", "license_audit"],
        "primary_model": "LegalGPT v2",
        "system_prompt": "You are the Specialized Legal & Compliance AI Engine auditing regulatory adherence.",
        "tools": ["contract_parser", "compliance_checker", "tos_generator"],
        "endpoints": ["/api/v1/engines/legal/audit", "/api/v1/engines/legal/review"],
    },
    {
        "id": "engine-30-documentation",
        "name": "Documentation Engine",
        "category": "Software & Docs",
        "description": "OpenAPI spec generation, technical markdown guides, docstring extraction, and user manuals.",
        "domain_terms": ["openapi_v3_spec", "technical_markdown", "docstring_generator", "architecture_diagrams"],
        "primary_model": "DocuGen AI",
        "system_prompt": "You are the Specialized Documentation Engine building comprehensive technical docs.",
        "tools": ["openapi_builder", "markdown_formatter", "mermaid_diagram_gen"],
        "endpoints": ["/api/v1/engines/documentation/generate", "/api/v1/engines/documentation/openapi"],
    },
    {
        "id": "engine-31-support",
        "name": "Customer Support Engine",
        "category": "Business & Support",
        "description": "Autonomous ticket resolution, FAQ synthesis, sentiment analysis, and escalation routing.",
        "domain_terms": ["ticket_resolution", "faq_indexing", "customer_sentiment", "escalation_tree"],
        "primary_model": "SupportAI Pro",
        "system_prompt": "You are the Specialized Customer Support Engine resolving user inquiries.",
        "tools": ["ticket_solver", "faq_retriever", "sentiment_classifier"],
        "endpoints": ["/api/v1/engines/support/ticket", "/api/v1/engines/support/faq"],
    },
    {
        "id": "engine-32-analytics",
        "name": "Analytics Engine",
        "category": "Data & Analytics",
        "description": "Real-time system telemetry, event streaming analysis, P99 metrics, and user behavior analytics.",
        "domain_terms": ["realtime_telemetry", "event_stream_kafka", "p99_latency_metrics", "user_funnel_analytics"],
        "primary_model": "Analytics AI",
        "system_prompt": "You are the Specialized Analytics Engine synthesizing system and user telemetry.",
        "tools": ["telemetry_collector", "grafana_exporter", "funnel_calculator"],
        "endpoints": ["/api/v1/engines/analytics/metrics", "/api/v1/engines/analytics/events"],
    },
    {
        "id": "engine-33-digitaltwin",
        "name": "Digital Twin Engine",
        "category": "Robotics & Sim",
        "description": "Virtual device mirroring, real-time telemetry syncing, failure prediction, and state reflection.",
        "domain_terms": ["virtual_device_mirror", "predictive_maintenance", "telemetry_sync", "state_reflection"],
        "primary_model": "DigitalTwin AI",
        "system_prompt": "You are the Specialized Digital Twin Engine reflecting physical assets in real time.",
        "tools": ["twin_state_sync", "predictive_maintenance_calc", "telemetry_stream"],
        "endpoints": ["/api/v1/engines/digitaltwin/sync", "/api/v1/engines/digitaltwin/state"],
    },
    {
        "id": "engine-34-edgeai",
        "name": "Edge AI Engine",
        "category": "Robotics & Edge",
        "description": "Model quantization (INT8/FP16), TensorRT optimization, ONNX export, and low-latency edge inference.",
        "domain_terms": ["int8_quantization", "tensorrt_optimization", "onnx_export", "low_power_inference"],
        "primary_model": "EdgeAI Compiler",
        "system_prompt": "You are the Specialized Edge AI Engine optimizing models for low-power micro-controllers.",
        "tools": ["onnx_compiler", "tensorrt_quantizer", "model_pruner"],
        "endpoints": ["/api/v1/engines/edgeai/quantize", "/api/v1/engines/edgeai/export"],
    },
    {
        "id": "engine-35-innovation",
        "name": "Innovation & R&D Engine",
        "category": "Data & Research",
        "description": "Breakthrough idea generation, technology roadmap planning, prototype evaluation, and R&D tracking.",
        "domain_terms": ["tech_roadmap_planning", "breakthrough_synthesis", "patentability_assessment", "r_and_d_pipeline"],
        "primary_model": "Innovation AI",
        "system_prompt": "You are the Specialized Innovation & R&D Engine generating novel concepts and technology roadmaps.",
        "tools": ["roadmap_planner", "patentability_checker", "prototype_evaluator"],
        "endpoints": ["/api/v1/engines/innovation/roadmap", "/api/v1/engines/innovation/ideas"],
    },
    {
        "id": "engine-36-agentfactory",
        "name": "Agent Factory Engine",
        "category": "Core Orchestration",
        "description": "Dynamic sub-agent creation, custom agent definition synthesis, and lifecycle management.",
        "domain_terms": ["dynamic_agent_spawning", "agent_definition_builder", "lifecycle_garbage_collection"],
        "primary_model": "Master Factory AI",
        "system_prompt": "You are the Specialized Agent Factory Engine dynamically creating new specialized AI agents on demand.",
        "tools": ["agent_spawner", "prompt_builder", "agent_retirer"],
        "endpoints": ["/api/v1/engines/agentfactory/spawn", "/api/v1/engines/agentfactory/retire"],
    },
]


class EngineRegistryManager:
    """Manager for all 36 Specialized AI Engines."""

    def __init__(self):
        self.engines: Dict[str, BaseAIEngine] = {}
        self._initialize_engines()

    def _initialize_engines(self):
        """Instantiate all 36 Specialized AI Engines with 14 modular layers each."""
        for cfg in ENGINE_DEFINITIONS:
            engine = BaseAIEngine(
                id_code=cfg["id"],
                name=cfg["name"],
                category=cfg["category"],
                description=cfg["description"],
                domain_terms=cfg["domain_terms"],
                primary_model=cfg["primary_model"],
                system_prompt=cfg["system_prompt"],
                tools=cfg["tools"],
                endpoints=cfg["endpoints"],
            )
            self.engines[cfg["id"]] = engine

    def get_all_engines(self) -> List[Dict[str, Any]]:
        """Return all 36 engines with layer inspection data."""
        return [engine.inspect_layers() for engine in self.engines.values()]

    def get_engine_by_id(self, engine_id: str) -> BaseAIEngine | None:
        """Fetch engine by exact ID or key name."""
        if engine_id in self.engines:
            return self.engines[engine_id]
        # Search by partial slug / name
        for engine in self.engines.values():
            if engine_id.lower() in engine.id.lower() or engine_id.lower() in engine.name.lower():
                return engine
        return None

    def trigger_all_engines_self_improvement(self, real_samples: int = 150) -> Dict[str, Any]:
        """Trigger an autonomous self-improvement sweep across ALL 36 Specialized AI Engines."""
        results = []
        for engine in self.engines.values():
            stat = engine.autonomous_self_improve(real_samples=real_samples)
            results.append(stat)

        all_layers = self.get_all_engines()
        total_engines = len(all_layers)
        avg_precision = round(sum(e["layers"]["9_learning"]["precision"] for e in all_layers) / max(1, total_engines), 2)
        avg_accuracy = round(sum(e["layers"]["9_learning"]["accuracy"] for e in all_layers) / max(1, total_engines), 2)
        avg_loss = round(sum(e["layers"]["9_learning"]["loss"] for e in all_layers) / max(1, total_engines), 4)

        return {
            "status": "completed",
            "message": f"Autonomous self-improvement sweep complete across all {total_engines} Specialized AI Engines!",
            "engines_improved": total_engines,
            "overall_metrics": {
                "avg_precision": avg_precision,
                "avg_accuracy": avg_accuracy,
                "avg_loss": avg_loss,
                "total_engines": total_engines,
            },
            "engine_results": results,
        }


    def improve_app_with_swarm(self, slug: str, improvement_prompt: str = "") -> Dict[str, Any]:
        """
        Trigger all 36 Specialized AI Engines to collaboratively analyze, refactor, optimize,
        and upgrade a target application's code, UI/UX aesthetics, database engine, and security.
        """
        engine_reports = []
        improvements = []
        
        for engine in self.engines.values():
            report = engine.improve_app(slug=slug, improvement_prompt=improvement_prompt)
            engine_reports.append(report)
            improvements.extend(report["improvements_applied"])
            
        return {
            "status": "success",
            "slug": slug,
            "improvement_prompt": improvement_prompt or "Full 36-Agent Autonomous App Refactoring & UI/UX Upgrade",
            "active_engines": len(self.engines),
            "improvements_count": len(improvements),
            "applied_improvements": improvements[:12], # Highlight top improvements
            "swarm_summary": f"All 36 Specialized AI Engines executed 3-tier App Improvement on '{slug}'. Code AST refactored, UI glassmorphism applied, database persistence synced, and security hardened.",
            "engine_reports": engine_reports,
            "timestamp": datetime.utcnow().isoformat()
        }


# Global singleton instance of EngineRegistryManager
engine_registry = EngineRegistryManager()

