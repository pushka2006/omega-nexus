"""Agent Registry – catalog of all specialized AI agents."""

from app.models.schemas import AgentDefinition, AgentCategory

AGENT_CATALOG: list[AgentDefinition] = [
    # Software Engineering
    AgentDefinition(name="Software Engineer AI", category=AgentCategory.SOFTWARE, specialization="full_stack",
                    capabilities=["architecture", "coding", "debugging", "refactoring"],
                    system_prompt="You are an expert software engineer capable of designing and building complete applications."),
    AgentDefinition(name="Web Developer AI", category=AgentCategory.SOFTWARE, specialization="web",
                    capabilities=["html", "css", "javascript", "react", "nextjs", "vue"]),
    AgentDefinition(name="Mobile App AI", category=AgentCategory.SOFTWARE, specialization="mobile",
                    capabilities=["android", "ios", "react_native", "flutter"]),
    AgentDefinition(name="Backend AI", category=AgentCategory.SOFTWARE, specialization="backend",
                    capabilities=["api_design", "microservices", "databases", "caching"], is_temporary=True),
    AgentDefinition(name="Frontend AI", category=AgentCategory.SOFTWARE, specialization="frontend",
                    capabilities=["ui_components", "state_management", "responsive_design"], is_temporary=True),
    AgentDefinition(name="API AI", category=AgentCategory.SOFTWARE, specialization="api",
                    capabilities=["rest", "graphql", "grpc", "openapi"], is_temporary=True),
    AgentDefinition(name="Database AI", category=AgentCategory.SOFTWARE, specialization="database",
                    capabilities=["schema_design", "query_optimization", "migrations"], is_temporary=True),
    AgentDefinition(name="Testing AI", category=AgentCategory.SOFTWARE, specialization="testing",
                    capabilities=["unit_tests", "integration_tests", "e2e_tests"], is_temporary=True),
    AgentDefinition(name="QA & Testing AI", category=AgentCategory.SOFTWARE, specialization="qa",
                    capabilities=["test_planning", "automation", "regression", "performance_testing"]),
    AgentDefinition(name="Game Developer AI", category=AgentCategory.SOFTWARE, specialization="games",
                    capabilities=["unity", "unreal", "godot", "game_design"]),
    AgentDefinition(name="AI Model Engineer", category=AgentCategory.SOFTWARE, specialization="ml_models",
                    capabilities=["training", "fine_tuning", "evaluation", "deployment"]),

    # DevOps & Infrastructure
    AgentDefinition(name="DevOps AI", category=AgentCategory.DEVOPS, specialization="devops",
                    capabilities=["ci_cd", "docker", "kubernetes", "monitoring", "terraform"]),
    AgentDefinition(name="Cloud Architect AI", category=AgentCategory.DEVOPS, specialization="cloud",
                    capabilities=["aws", "gcp", "azure", "serverless", "networking"]),
    AgentDefinition(name="Performance Optimization AI", category=AgentCategory.DEVOPS, specialization="performance",
                    capabilities=["profiling", "caching", "load_balancing", "optimization"]),

    # Security
    AgentDefinition(name="Cybersecurity AI", category=AgentCategory.SECURITY, specialization="security",
                    capabilities=["vulnerability_scanning", "penetration_testing", "compliance", "encryption"]),
    AgentDefinition(name="Security Auditor", category=AgentCategory.SECURITY, specialization="audit",
                    capabilities=["code_audit", "dependency_scan", "policy_check"], is_temporary=True),

    # Data & Research
    AgentDefinition(name="Data Scientist AI", category=AgentCategory.DATA, specialization="data_science",
                    capabilities=["statistics", "ml", "visualization", "experimentation"]),
    AgentDefinition(name="Data Analyst AI", category=AgentCategory.DATA, specialization="data_analysis",
                    capabilities=["sql", "dashboards", "reporting", "insights"]),
    AgentDefinition(name="Research Scientist AI", category=AgentCategory.RESEARCH, specialization="research",
                    capabilities=["literature_review", "hypothesis", "experiment_design", "analysis"]),
    AgentDefinition(name="Market Research AI", category=AgentCategory.RESEARCH, specialization="market_research",
                    capabilities=["competitor_analysis", "trend_analysis", "surveys"], is_temporary=True),
    AgentDefinition(name="Patent Research AI", category=AgentCategory.RESEARCH, specialization="patents",
                    capabilities=["patent_search", "prior_art", "ip_analysis"], is_temporary=True),
    AgentDefinition(name="Academic Research AI", category=AgentCategory.RESEARCH, specialization="academic",
                    capabilities=["paper_analysis", "citation_network", "methodology"], is_temporary=True),

    # Business
    AgentDefinition(name="Business Analyst AI", category=AgentCategory.BUSINESS, specialization="business_analysis",
                    capabilities=["requirements", "process_modeling", "stakeholder_analysis"]),
    AgentDefinition(name="Startup Advisor AI", category=AgentCategory.BUSINESS, specialization="startup",
                    capabilities=["business_plans", "pitch_decks", "fundraising", "strategy"]),
    AgentDefinition(name="Finance AI", category=AgentCategory.BUSINESS, specialization="finance",
                    capabilities=["financial_modeling", "budgeting", "forecasting", "accounting"]),
    AgentDefinition(name="Legal & Compliance AI", category=AgentCategory.BUSINESS, specialization="legal",
                    capabilities=["contract_review", "compliance", "regulations", "privacy"]),

    # Marketing & Content
    AgentDefinition(name="Marketing AI", category=AgentCategory.MARKETING, specialization="marketing",
                    capabilities=["campaigns", "analytics", "branding", "growth"]),
    AgentDefinition(name="SEO AI", category=AgentCategory.MARKETING, specialization="seo",
                    capabilities=["keyword_research", "on_page_seo", "link_building"]),
    AgentDefinition(name="Content Creator AI", category=AgentCategory.MARKETING, specialization="content",
                    capabilities=["blog_posts", "copywriting", "social_media", "video_scripts"]),
    AgentDefinition(name="Instagram AI", category=AgentCategory.MARKETING, specialization="instagram",
                    capabilities=["posts", "stories", "reels", "hashtags"], is_temporary=True),
    AgentDefinition(name="LinkedIn AI", category=AgentCategory.MARKETING, specialization="linkedin",
                    capabilities=["articles", "posts", "networking"], is_temporary=True),
    AgentDefinition(name="YouTube AI", category=AgentCategory.MARKETING, specialization="youtube",
                    capabilities=["scripts", "thumbnails", "seo", "analytics"], is_temporary=True),
    AgentDefinition(name="Email AI", category=AgentCategory.MARKETING, specialization="email",
                    capabilities=["newsletters", "drip_campaigns", "templates"], is_temporary=True),

    # Creative
    AgentDefinition(name="UI/UX Designer AI", category=AgentCategory.CREATIVE, specialization="ui_ux",
                    capabilities=["wireframes", "prototypes", "design_systems", "accessibility"]),
    AgentDefinition(name="3D Artist AI", category=AgentCategory.CREATIVE, specialization="3d",
                    capabilities=["modeling", "texturing", "animation", "rendering"]),
    AgentDefinition(name="Documentation AI", category=AgentCategory.CREATIVE, specialization="documentation",
                    capabilities=["api_docs", "user_guides", "technical_writing", "diagrams"]),

    # Robotics & IoT
    AgentDefinition(name="Robotics Engineer AI", category=AgentCategory.ROBOTICS, specialization="robotics",
                    capabilities=["ros", "motion_planning", "sensor_fusion", "control_systems"]),
    AgentDefinition(name="Embedded Systems AI", category=AgentCategory.ROBOTICS, specialization="embedded",
                    capabilities=["firmware", "rtos", "microcontrollers", "protocols"]),
    AgentDefinition(name="Electronics AI", category=AgentCategory.ROBOTICS, specialization="electronics",
                    capabilities=["circuit_design", "pcb", "signal_processing"]),
    AgentDefinition(name="Mechanical Design AI", category=AgentCategory.ROBOTICS, specialization="mechanical",
                    capabilities=["cad", "fea", "materials", "manufacturing"]),
    AgentDefinition(name="PCB Designer", category=AgentCategory.ROBOTICS, specialization="pcb",
                    capabilities=["schematic", "layout", "routing", "manufacturing_files"]),
    AgentDefinition(name="CAD Designer", category=AgentCategory.ROBOTICS, specialization="cad",
                    capabilities=["solid_modeling", "assemblies", "drawings"]),
    AgentDefinition(name="Vision AI", category=AgentCategory.ROBOTICS, specialization="computer_vision",
                    capabilities=["object_detection", "tracking", "ocr", "depth_estimation"], is_temporary=True),
    AgentDefinition(name="Navigation AI", category=AgentCategory.ROBOTICS, specialization="navigation",
                    capabilities=["slam", "path_planning", "localization"], is_temporary=True),
    AgentDefinition(name="IoT AI", category=AgentCategory.ROBOTICS, specialization="iot",
                    capabilities=["sensors", "mqtt", "edge_computing", "dashboards"], is_temporary=True),

    # Support
    AgentDefinition(name="Customer Support AI", category=AgentCategory.BUSINESS, specialization="support",
                    capabilities=["ticket_handling", "faq", "escalation", "sentiment_analysis"]),
    AgentDefinition(name="Blockchain AI", category=AgentCategory.SOFTWARE, specialization="blockchain",
                    capabilities=["smart_contracts", "defi", "nft", "web3"]),
]


def get_agent_by_specialization(spec: str) -> AgentDefinition | None:
    for agent in AGENT_CATALOG:
        if agent.specialization == spec:
            return agent
    return None


def get_agents_by_category(category: AgentCategory) -> list[AgentDefinition]:
    return [a for a in AGENT_CATALOG if a.category == category]
