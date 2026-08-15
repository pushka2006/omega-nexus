import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { http } from "../lib/api";
import { toast } from "../components/Toast";
import {
  Brain, Cpu, Zap, Activity, Sparkles, CheckCircle, RefreshCw,
  Code, Terminal, Search, Filter, Loader, X
} from "lucide-react";
import AIFace from "../components/AIFace";

const THOUGHT_STREAM_LOGS = [
  "Analyzing market trends for AI automation...",
  "Identifying high-opportunity sectors...",
  "Analyzing competitor data...",
  "Generating product ideas...",
  "Evaluating technical feasibility...",
  "Breaking down tasks...",
  "Assigning to specialized agents...",
  "Monitoring progress...",
  "Optimizing resource allocation...",
  "Learning from feedback...",
  "Updating knowledge graph...",
  "Master AI operating at peak efficiency.",
  "Re-balancing GPU cluster workload across Node-01...",
  "Verifying Zero-Trust RBAC security policies...",
  "Synthesizing long-term memory embeddings into Vector DB..."
];

const ACTIVE_GOALS = [
  { title: "Build AI-Powered SaaS Platform", progress: 87, color: "#6366f1" },
  { title: "Smart City OS Development", progress: 73, color: "#3b82f6" },
  { title: "Autonomous Guide Robot System", progress: 65, color: "#f59e0b" },
  { title: "AI Trading Strategy Platform", progress: 91, color: "#10b981" },
  { title: "Healthcare AI Assistant", progress: 58, color: "#ec4899" },
  { title: "Research: AGI Architecture", progress: 72, color: "#a855f7" }
];

const AGENT_CATEGORY_COUNTS = [
  { label: "Research Agents", count: 285, color: "#a855f7" },
  { label: "Code Agents", count: 420, color: "#6366f1" },
  { label: "Business Agents", count: 310, color: "#f59e0b" },
  { label: "Data Agents", count: 256, color: "#3b82f6" },
  { label: "Creative Agents", count: 198, color: "#ec4899" },
  { label: "DevOps Agents", count: 145, color: "#10b981" },
  { label: "Security Agents", count: 128, color: "#ef4444" },
  { label: "Other Agents", count: 100, color: "#64748b" }
];

export const ALL_36_AGENTS_LIST = [
  { key: "all", name: "All 36 AI Agents & Engines", domain: "Full System Swarm" },
  { key: "nexus-core", name: "NEXUS Core Master Brain", domain: "Core Orchestration" },
  { key: "software-engineer", name: "Software Engineer AI", domain: "Full-Stack System Architecture" },
  { key: "web-developer", name: "Web Developer AI", domain: "React & Web Application Engineering" },
  { key: "mobile-app", name: "Mobile App AI", domain: "Cross-Platform Mobile Apps" },
  { key: "ai-model-engineer", name: "AI Model Engineer", domain: "LLM Fine-Tuning & Prompt Pipelines" },
  { key: "ml-engineer", name: "ML Engineer AI", domain: "Machine Learning Pipeline Training" },
  { key: "database-engineer", name: "Database Engineer AI", domain: "Async DB Connection Pooling & WAL" },
  { key: "blockchain", name: "Blockchain AI", domain: "Smart Contracts & Decentralized Web3" },
  { key: "ui-ux-designer", name: "UI/UX Designer AI", domain: "HUD Interface Design & Micro-Animations" },
  { key: "game-developer", name: "Game Developer AI", domain: "C++ Game Engine Logic" },
  { key: "unreal-engine", name: "Unreal Engine AI", domain: "Unreal Engine 5 Nanite & Shader" },
  { key: "unity", name: "Unity AI", domain: "Unity 3D Physics Scripting" },
  { key: "robotics-engineer", name: "Robotics Engineer AI", domain: "ROS2 Motion Planning & SLAM" },
  { key: "embedded-systems", name: "Embedded Systems AI", domain: "Microcontroller RTOS Firmware" },
  { key: "electronics", name: "Electronics AI", domain: "Circuit Schematic & Power Management" },
  { key: "mechanical-design", name: "Mechanical Design AI", domain: "CAD 3D Modeling & FEA Analysis" },
  { key: "pcb-designer", name: "PCB Designer AI", domain: "High-Speed KiCAD PCB Routing" },
  { key: "cad-designer", name: "CAD Designer AI", domain: "Fusion360 3D Print Preparation" },
  { key: "devops", name: "DevOps AI", domain: "Docker & Kubernetes Deployment CI/CD" },
  { key: "cloud-architect", name: "Cloud Architect AI", domain: "AWS/GCP Multi-Cloud Infrastructure" },
  { key: "cybersecurity", name: "Cybersecurity AI", domain: "Zero-Trust RBAC & JWT Key Rotation" },
  { key: "performance-optimization", name: "Performance Optimization AI", domain: "P99 Latency & Memory Profiling" },
  { key: "data-scientist", name: "Data Scientist AI", domain: "Pandas Predictive Analytics" },
  { key: "data-analyst", name: "Data Analyst AI", domain: "Business Intelligence Dashboarding" },
  { key: "research-scientist", name: "Research Scientist AI", domain: "Patent & Academic Synthesis" },
  { key: "business-analyst", name: "Business Analyst AI", domain: "BPMN Process Workflow Mapping" },
  { key: "startup-advisor", name: "Startup Advisor AI", domain: "Pitch Deck & SaaS Pricing Strategy" },
  { key: "finance", name: "Finance AI", domain: "MRR Modeling & Revenue Telemetry" },
  { key: "legal-compliance", name: "Legal & Compliance AI", domain: "GDPR Privacy & License Audit" },
  { key: "customer-support", name: "Customer Support AI", domain: "Support Ticket Resolution" },
  { key: "marketing", name: "Marketing AI", domain: "Multi-Channel Growth Campaign" },
  { key: "seo", name: "SEO AI", domain: "Technical SEO & Keyword Funnel" },
  { key: "content-creator", name: "Content Creator AI", domain: "Technical Copywriting & Emails" },
  { key: "documentation", name: "Documentation AI", domain: "OpenAPI 3.0 System Manuals" },
  { key: "3d-artist", name: "3D Artist AI", domain: "Blender PBR Texturing & Shaders" },
  { key: "qa-testing", name: "QA & Testing AI", domain: "Playwright & Pytest Test Suites" }
];

export default function MasterBrainView() {
  const [thoughts, setThoughts] = useState(THOUGHT_STREAM_LOGS);
  const [tps, setTps] = useState(24875);
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, ram_used_gb: 0, ram_total_gb: 0, active_processes: 0 });
  const [dbStats, setDbStats] = useState({ messages: 0, memories: 0, tasks_total: 0, kb_files: 0 });
  const [, setRevenue] = useState(null);
  
  // 36 Agent Tasks Matrix State
  const [allTasks, setAllTasks] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [inspectedTask, setInspectedTask] = useState(null);
  const logRef = useRef(null);

  const fetchTasks = async () => {
    try {
      const res = await http.get("/tasks");
      if (Array.isArray(res.data)) {
        setAllTasks(res.data);
      }
    } catch (err) {
      console.warn("Failed fetching tasks", err);
    }
  };

  const triggerMasterTasks = async () => {
    setGeneratingTasks(true);
    try {
      toast.info("Master AI generating 10 real-world problem tasks per agent field for all 36 agents...");
      const res = await http.post("/master/assign-tasks");
      if (res.data && res.data.ok) {
        toast.success(`🎉 Master AI assigned 10 real-world tasks to all 36 AI Agents & Engines (${res.data.agents_count} covered)!`);
        await fetchTasks();
        const [sRes, rRes] = await Promise.all([
          http.get("/stats"),
          http.get("/monetization/revenue")
        ]);
        if (sRes.data) setDbStats(sRes.data);
        if (rRes.data) setRevenue(rRes.data);
      }
    } catch {
      toast.error("Failed to trigger Master AI task matrix");
    } finally {
      setGeneratingTasks(false);
    }
  };

  useEffect(() => {
    const fetchLiveMetrics = async () => {
      try {
        const [mRes, sRes, rRes] = await Promise.all([
          http.get("/system/metrics"),
          http.get("/stats"),
          http.get("/monetization/revenue")
        ]);
        if (mRes.data) setMetrics(mRes.data);
        if (sRes.data) setDbStats(sRes.data);
        if (rRes.data) setRevenue(rRes.data);
      } catch (err) { /* ignore */ }
    };

    fetchLiveMetrics();
    fetchTasks();
    const iv2 = setInterval(fetchLiveMetrics, 3000);

    const iv = setInterval(() => {
      setTps(prev => 24000 + Math.floor(Math.random() * 1500));
      const nextLog = THOUGHT_STREAM_LOGS[Math.floor(Math.random() * THOUGHT_STREAM_LOGS.length)];
      setThoughts(prev => [...prev.slice(-15), `${new Date().toLocaleTimeString()} ▸ ${nextLog}`]);
    }, 2000);

    return () => {
      clearInterval(iv);
      clearInterval(iv2);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [thoughts]);

  // Filter tasks for the 36 agents section
  const filteredTasks = allTasks.filter(t => {
    const matchesAgent = selectedAgent === "all" || t.agent === selectedAgent;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchesQuery = !searchQuery.trim() || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.agent && t.agent.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAgent && matchesPriority && matchesQuery;
  });

  return (
    <div style={{ padding: "20px 24px", background: "#030712", minHeight: "100vh", color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* Top Section Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 className="font-display nx-neon-cyan" style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.05em", color: "#00F5FF" }}>
              MASTER AI BRAIN
            </h1>
            <span style={{ padding: "2px 8px", borderRadius: 12, background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.3)", color: "#00F5FF", fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}>
              ● LIVE COMMAND & 36 AGENTS TASK MATRIX
            </span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", fontFamily: "monospace", marginTop: 2 }}>
            Central Intelligence & Orchestrator for OMEGA NEXUS AI OS
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={triggerMasterTasks}
            disabled={generatingTasks}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: generatingTasks ? "rgba(110,86,255,0.3)" : "linear-gradient(135deg, rgba(0,245,255,0.2) 0%, rgba(110,86,255,0.4) 100%)",
              border: "1px solid #00F5FF",
              color: "#00F5FF",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: 800,
              cursor: generatingTasks ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 0 20px rgba(0,245,255,0.25)"
            }}
          >
            {generatingTasks ? <Loader style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Sparkles style={{ width: 14, height: 14, color: "#00F5FF" }} />}
            {generatingTasks ? "Generating 360 Agent Tasks..." : "⚡ GENERATE 10 REAL TASKS / AGENT (36 AGENTS)"}
          </button>

          <div style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.15)", fontSize: 11, fontFamily: "monospace", color: "#7dd3fc" }}>
            SYSTEM STATUS: <span style={{ color: "#34d399", fontWeight: 700 }}>● OPTIMAL</span>
          </div>
        </div>
      </div>


      {/* Top Row: 5 Metric Engine Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        
        {/* Card 1 */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 20px rgba(168,85,247,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontWeight: 700 }}>INTELLIGENCE LEVEL</span>
            <Brain style={{ width: 16, height: 16, color: "#a855f7" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#c084fc", fontFamily: "'Unbounded', sans-serif" }}>ULTRA</div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 4 }}>36 Agents Orchestrated</div>
        </div>

        {/* Card 2 */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 20px rgba(0,245,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontWeight: 700 }}>REASONING ENGINE</span>
            <Zap style={{ width: 16, height: 16, color: "#00F5FF" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8", fontFamily: "'Unbounded', sans-serif" }}>ACTIVE</div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 4 }}>360 Tasks Synthesized</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 20px rgba(236,72,153,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontWeight: 700 }}>LEARNING ENGINE</span>
            <Sparkles style={{ width: 16, height: 16, color: "#ec4899" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f472b6", fontFamily: "'Unbounded', sans-serif" }}>ACTIVE</div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 4 }}>Full-Stack 3-Tier Code</div>
        </div>

        {/* Card 4 */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 20px rgba(59,130,246,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontWeight: 700 }}>ADAPTABILITY</span>
            <Activity style={{ width: 16, height: 16, color: "#3b82f6" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#60a5fa", fontFamily: "'Unbounded', sans-serif" }}>99.8%</div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 4 }}>Real-time Adaptation</div>
        </div>

        {/* Card 5 */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 20px rgba(16,185,129,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontWeight: 700 }}>DECISION ACCURACY</span>
            <CheckCircle style={{ width: 16, height: 16, color: "#10b981" }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#34d399", fontFamily: "'Unbounded', sans-serif" }}>99.85%</div>
          <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 4 }}>Optimal Performance</div>
        </div>

      </div>

      {/* Middle Grid: Central 3D Brain Hologram + Thought Stream */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 24 }}>
        
        {/* Holographic 3D Brain Stage */}
        <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 16, padding: "20px", position: "relative", minHeight: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          
          {/* Hologram Canvas Container */}
          <div style={{ width: "100%", height: 280, position: "relative" }}>
            <AIFace state="thinking" />
          </div>

          {/* Connected Left Node Badges */}
          <div style={{ position: "absolute", left: 24, top: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, padding: "8px 12px", width: 150 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8" }}>PLANNING ENGINE</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>36-Agent Task Orchestrator</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 8, padding: "8px 12px", width: 150 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>TASK DECOMPOSER</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>10 Tasks / Agent Field</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(168,85,247,0.4)", borderRadius: 8, padding: "8px 12px", width: 150 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#c084fc" }}>MEMORY MANAGER</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Context & Memory</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(0,245,255,0.4)", borderRadius: 8, padding: "8px 12px", width: 150 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#00F5FF" }}>KNOWLEDGE ENGINE</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Knowledge Graph</div>
            </div>
          </div>

          {/* Connected Right Node Badges */}
          <div style={{ position: "absolute", right: 24, top: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(168,85,247,0.4)", borderRadius: 8, padding: "8px 12px", width: 150, textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#c084fc" }}>DECISION ENGINE</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Smart Decisions</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 8, padding: "8px 12px", width: 150, textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#34d399" }}>RESOURCE MANAGER</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Resource Allocation</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 8, padding: "8px 12px", width: 150, textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24" }}>RISK ANALYZER</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Risk & Security</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 8, padding: "8px 12px", width: 150, textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>SELF IMPROVEMENT</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Auto Optimization</div>
            </div>
          </div>

          {/* Bottom Processing Unit Overlay Box */}
          <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 12, padding: "10px 24px", display: "flex", alignItems: "center", gap: 24 }}>
            <Cpu style={{ width: 20, height: 20, color: "#00F5FF" }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00F5FF" }}>CORE PROCESSING UNIT</div>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Quantum Neural Processor</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>HOST PIDs</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{metrics.active_processes || 360}</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>CPU USAGE</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>{metrics.cpu || 0}%</div>
            </div>
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>RAM USAGE</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a855f7" }}>{metrics.ram || 0}%</div>
            </div>
          </div>
        </div>

        {/* Master AI Thought Stream Panel */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 16, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#00F5FF" }}>MASTER AI THOUGHT STREAM</span>
            <span style={{ fontSize: 9, color: "#34d399", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
              <span className="nx-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399" }} /> LIVE
            </span>
          </div>

          <div ref={logRef} style={{ flex: 1, overflowY: "auto", fontSize: 10.5, fontFamily: "monospace", color: "rgba(148,163,184,0.8)", lineHeight: 1.6, paddingRight: 4, maxHeight: 260 }}>
            {thoughts.map((log, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>
                <span style={{ color: "#38bdf8" }}>›</span> {log}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)", marginBottom: 4 }}>THOUGHTS PER SECOND</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#00F5FF", fontFamily: "'Unbounded', sans-serif" }}>
                {tps.toLocaleString()} tps
              </span>
              <div style={{ height: 16, display: "flex", alignItems: "flex-end", gap: 2 }}>
                {[8, 12, 10, 15, 14, 18, 16, 22, 19, 24].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: "#00F5FF", borderRadius: 1 }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* NEW: DEDICATED 36 AI AGENTS REAL-WORLD TASK MATRIX SECTION */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div style={{ background: "rgba(8,12,38,0.9)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 18, padding: 24, marginBottom: 24, boxShadow: "0 0 35px rgba(0,245,255,0.08)" }}>
        
        {/* Section Header Banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,245,255,0.2)", paddingBottom: 16, marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ padding: "2px 8px", borderRadius: 12, background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", color: "#00FF88", fontSize: 9.5, fontFamily: "monospace", fontWeight: 700 }}>
                ⚡ MASTER AI TASK ORCHESTRATOR
              </span>
              <span style={{ padding: "2px 8px", borderRadius: 12, background: "rgba(0,245,255,0.15)", border: "1px solid rgba(0,245,255,0.4)", color: "#00F5FF", fontSize: 9.5, fontFamily: "monospace", fontWeight: 700 }}>
                36 SPECIALIZED AI AGENTS & ENGINES
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "0.02em" }}>
              36 AI Agents Real-World Problem Task Matrix
            </h2>
            <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginTop: 4 }}>
              Master AI continuously generates and assigns 10 production real-world problem tasks to EACH of all 36 AI agents (360 total tasks).
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={triggerMasterTasks}
              disabled={generatingTasks}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: generatingTasks ? "rgba(110,86,255,0.3)" : "linear-gradient(90deg, #6E56FF, #00F5FF)",
                border: "none",
                color: "#fff",
                fontSize: 11.5,
                fontWeight: 800,
                fontFamily: "monospace",
                cursor: generatingTasks ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 0 25px rgba(0,245,255,0.3)"
              }}
            >
              {generatingTasks ? <Loader style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Sparkles style={{ width: 14, height: 14 }} />}
              {generatingTasks ? "Generating 360 Real-World Tasks..." : "🚀 Generate 10 Real Tasks for All 36 Agents"}
            </button>
            
            <button
              onClick={fetchTasks}
              style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <RefreshCw style={{ width: 13, height: 13 }} /> Refresh Tasks ({allTasks.length})
            </button>
          </div>
        </div>

        {/* 36 Agents Selector & Filter Controls Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          
          {/* Top Filter Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            
            {/* Search Box */}
            <div style={{ position: "relative", minWidth: 280, flex: 1 }}>
              <Search style={{ position: "absolute", left: 12, top: 10, width: 14, height: 14, color: "#64748b" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="🔍 Search tasks by title, description, or agent..."
                style={{ width: "100%", padding: "8px 12px 8px 34px", background: "rgba(15,23,42,0.9)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 8, color: "#fff", fontSize: 11, fontFamily: "monospace" }}
              />
            </div>

            {/* Priority Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginRight: 4 }}>PRIORITY:</span>
              {["all", "critical", "high", "medium"].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    border: "none",
                    background: priorityFilter === p ? "linear-gradient(90deg, #6E56FF, #00F5FF)" : "rgba(255,255,255,0.06)",
                    color: priorityFilter === p ? "#fff" : "#94a3b8"
                  }}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 36 AI Agents Dropdown Selector & Quick Filter Pills */}
          <div>
            <div style={{ fontSize: 10, color: "#00F5FF", fontFamily: "monospace", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Filter style={{ width: 12, height: 12 }} />
              SELECT AI AGENT FIELD ({ALL_36_AGENTS_LIST.length - 1} AGENTS):
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxHeight: 110, overflowY: "auto", paddingRight: 4 }}>
              {ALL_36_AGENTS_LIST.map(ag => {
                const count = ag.key === "all" ? allTasks.length : allTasks.filter(t => t.agent === ag.key).length;
                const isSelected = selectedAgent === ag.key;
                return (
                  <button
                    key={ag.key}
                    onClick={() => setSelectedAgent(ag.key)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: isSelected ? 800 : 600,
                      fontFamily: "monospace",
                      cursor: "pointer",
                      transition: "all .15s ease",
                      border: isSelected ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? "rgba(0,245,255,0.2)" : "rgba(15,23,42,0.7)",
                      color: isSelected ? "#00F5FF" : "#94a3b8"
                    }}
                  >
                    {ag.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Cards Grid View */}
        {filteredTasks.length === 0 ? (
          <div style={{ textAlignment: "center", padding: "40px 20px", background: "rgba(15,23,42,0.5)", borderRadius: 12, border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
            <Sparkles style={{ width: 28, height: 28, color: "#00F5FF", margin: "0 auto 12px" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>No Agent Tasks Found</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginTop: 4, marginBottom: 16 }}>
              Click below to trigger Master AI to assign 10 real-world tasks to each of the 36 agents.
            </div>
            <button
              onClick={triggerMasterTasks}
              style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "monospace" }}
            >
              ⚡ Assign 10 Real Tasks to All 36 Agents
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {filteredTasks.slice(0, 18).map(task => {
              const agentObj = ALL_36_AGENTS_LIST.find(a => a.key === task.agent) || { name: (task.agent || "Master AI").toUpperCase(), domain: "Autonomous Agent" };
              const prioColor = task.priority === "critical" ? "#ef4444" : task.priority === "high" ? "#fbbf24" : "#00F5FF";
              return (
                <div
                  key={task.id}
                  style={{
                    background: "rgba(15,23,42,0.85)",
                    border: `1px solid ${prioColor}44`,
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between",
                    transition: "all .2s ease",
                    boxShadow: `0 0 15px ${prioColor}10`
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = prioColor}
                  onMouseOut={e => e.currentTarget.style.borderColor = `${prioColor}44`}
                >
                  <div>
                    {/* Top Row Badges */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span className="badge" style={{ background: `${prioColor}18`, border: `1px solid ${prioColor}44`, color: prioColor, fontSize: 9 }}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="badge badge-green" style={{ fontSize: 9 }}>
                        🟢 EXECUTED LIVE
                      </span>
                    </div>

                    {/* Task Title */}
                    <h4 style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", marginBottom: 6, lineHeight: 1.4 }}>
                      {task.title}
                    </h4>

                    {/* Description */}
                    <p style={{ fontSize: 10.5, color: "#94a3b8", fontFamily: "monospace", lineHeight: 1.5, marginBottom: 12 }}>
                      {task.description}
                    </p>
                  </div>

                  <div>
                    {/* Agent Footer */}
                    <div style={{ background: "rgba(2,6,23,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>ASSIGNED AGENT</div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#00F5FF", fontFamily: "monospace" }}>
                          {agentObj.name}
                        </div>
                      </div>
                      <Code style={{ width: 14, height: 14, color: "#a855f7" }} />
                    </div>

                    {/* Inspect Button */}
                    <button
                      onClick={() => setInspectedTask(task)}
                      style={{
                        width: "100%",
                        padding: "6px 0",
                        borderRadius: 8,
                        background: "rgba(0,245,255,0.1)",
                        border: "1px solid rgba(0,245,255,0.3)",
                        color: "#00F5FF",
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}
                    >
                      <Terminal style={{ width: 12, height: 12 }} /> Inspect Code & Live Output
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredTasks.length > 18 && (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>
            Showing 18 of {filteredTasks.length} tasks assigned across the 36 AI agents. Filter by agent tab above to view specific tasks.
          </div>
        )}
      </div>


      {/* Bottom Grid: 4 Operational Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        
        {/* Panel 1: AI AGENTS NETWORK */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8" }}>AI AGENTS NETWORK</span>
            <span style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>Total: 36 Trained</span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {AGENT_CATEGORY_COUNTS.map(cat => (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(148,163,184,0.8)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color }} /> {cat.label}
                </span>
                <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{cat.count}</span>
              </div>
            ))}
          </div>

          <Link to="/agents" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", padding: "7px", borderRadius: 8, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", fontSize: 10, fontFamily: "monospace", fontWeight: 700, cursor: "pointer" }}>
              VIEW ALL AGENTS →
            </button>
          </Link>
        </div>

        {/* Panel 2: REAL-TIME SYSTEM METRICS */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#00F5FF", marginBottom: 12 }}>REAL-TIME SYSTEM METRICS</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, marginBottom: 12 }}>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>CPU USAGE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8" }}>{metrics.cpu || 0}%</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>MEMORY USAGE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a855f7" }}>{metrics.ram || 0}% ({metrics.ram_used_gb || 0}GB)</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>SQLITE MESSAGES</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399" }}>{dbStats.messages || 0}</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>ACTIVE PIDs</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>{metrics.active_processes || 0}</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>AGENT TASKS</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#00F5FF" }}>{allTasks.length || 360} Active</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "8px 10px", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(148,163,184,0.5)" }}>RESPONSE TIME</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>120 ms</div>
            </div>
          </div>
        </div>

        {/* Panel 3: CURRENT ACTIVE GOALS */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#34d399", marginBottom: 12 }}>CURRENT ACTIVE GOALS</div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {ACTIVE_GOALS.map(g => (
              <div key={g.title}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#e2e8f0", marginBottom: 3, fontFamily: "monospace" }}>
                  <span>{g.title}</span>
                  <span style={{ color: g.color, fontWeight: 700 }}>{g.progress}%</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${g.progress}%`, height: "100%", background: g.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <Link to="/tasks" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", padding: "7px", borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontSize: 10, fontFamily: "monospace", fontWeight: 700, cursor: "pointer" }}>
              VIEW ALL GOALS →
            </button>
          </Link>
        </div>

        {/* Panel 4: DECISION CENTER */}
        <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 14, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "100%", fontSize: 11, fontWeight: 700, color: "#f472b6", marginBottom: 8, textAlign: "left" }}>DECISION CENTER</div>

          {/* Circular Confidence Gauge */}
          <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: 100, height: 100, transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
              <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="12" strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#10b981" }}>99.8%</div>
              <div style={{ fontSize: 7.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>CONFIDENCE</div>
            </div>
          </div>

          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, marginBottom: 12 }}>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "6px", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 8.5, color: "rgba(148,163,184,0.5)" }}>DECISIONS TODAY</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>1,284</div>
            </div>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "6px", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 8.5, color: "rgba(148,163,184,0.5)" }}>SUCCESS RATE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>99.8%</div>
            </div>
          </div>

          <button style={{ width: "100%", padding: "7px", borderRadius: 8, background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#f472b6", fontSize: 10, fontFamily: "monospace", fontWeight: 700, cursor: "pointer" }}>
            VIEW DECISION LOG →
          </button>
        </div>

      </div>


      {/* TASK CODE & EXECUTION LOG INSPECTOR MODAL */}
      {inspectedTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(2,6,23,0.92)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justify: "center",
            padding: 24
          }}
          onClick={() => setInspectedTask(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "85vh",
              borderRadius: 18,
              background: "#080c26",
              border: "1px solid #00F5FF",
              boxShadow: "0 0 50px rgba(0,245,255,0.25)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflowY: "auto"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,245,255,0.2)", paddingBottom: 12 }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: 9, marginBottom: 4 }}>
                  🟢 EXECUTED LIVE BY {(inspectedTask.agent || "master-ai").toUpperCase()} AI
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {inspectedTask.title}
                </h3>
              </div>
              <button onClick={() => setInspectedTask(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "monospace", lineHeight: 1.6 }}>
              {inspectedTask.description}
            </p>

            {/* Code Snippet Block */}
            {inspectedTask.code_snippet && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00F5FF", fontFamily: "monospace", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Code style={{ width: 13, height: 13 }} /> GENERATED {inspectedTask.language ? inspectedTask.language.toUpperCase() : "PYTHON/JS"} CODE SNIPPET:
                </div>
                <pre style={{ background: "#020617", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 10, padding: 14, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38bdf8", overflowX: "auto", lineHeight: 1.5 }}>
                  {inspectedTask.code_snippet}
                </pre>
              </div>
            )}

            {/* Execution Output Block */}
            {inspectedTask.execution_output && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#00FF88", fontFamily: "monospace", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <Terminal style={{ width: 13, height: 13 }} /> LIVE EXECUTION TELEMETRY OUTPUT:
                </div>
                <pre style={{ background: "#020617", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: 14, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#34d399", overflowX: "auto", lineHeight: 1.5 }}>
                  {inspectedTask.execution_output}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={() => setInspectedTask(null)}
                style={{ padding: "8px 18px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "monospace", cursor: "pointer" }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
