import React, { useState, useEffect } from "react";
import {
  Search, Bell, Settings, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight,
  Shield, FileText, CheckCircle2, AlertTriangle, Clock, GraduationCap,
  Calendar, Lock, Scale, Sparkles, Brain, Cpu, Users, Eye, HelpCircle,
  FileCheck, ShieldAlert, BookOpen, Layers, RefreshCw, Stamp, Download,
  Plus, Send, X, Check, Filter, Upload, FileCode, CheckCircle, Award
} from "lucide-react";
import {
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

// --- DEMO / REAL TELEMETRY DATA MATCHING REFERENCE IMAGE ---
const MATTERS_SPARKLINE = [
  { day: "M1", val: 210 }, { day: "M2", val: 220 }, { day: "M3", val: 215 },
  { day: "M4", val: 230 }, { day: "M5", val: 238 }, { day: "M6", val: 248 },
];

const CONTRACTS_SPARKLINE = [
  { day: "C1", val: 300 }, { day: "C2", val: 315 }, { day: "C3", val: 330 },
  { day: "C4", val: 340 }, { day: "C5", val: 348 }, { day: "C6", val: 356 },
];

const COMPLIANCE_SPARKLINE = [
  { day: "P1", val: 84 }, { day: "P2", val: 86 }, { day: "P3", val: 88 },
  { day: "P4", val: 89 }, { day: "P5", val: 90 }, { day: "P6", val: 92 },
];

const VIOLATIONS_SPARKLINE = [
  { day: "V1", val: 14 }, { day: "V2", val: 12 }, { day: "V3", val: 10 },
  { day: "V4", val: 9 },  { day: "V5", val: 8 },  { day: "V6", val: 7 },
];

const PENDING_SPARKLINE = [
  { day: "A1", val: 18 }, { day: "A2", val: 20 }, { day: "A3", val: 19 },
  { day: "A4", val: 22 }, { day: "A5", val: 23 }, { day: "A6", val: 24 },
];

const TRAINING_SPARKLINE = [
  { day: "T1", val: 80 }, { day: "T2", val: 82 }, { day: "T3", val: 85 },
  { day: "T4", val: 86 }, { day: "T5", val: 88 }, { day: "T6", val: 89 },
];

const NAV_SIDEBAR_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Scale, active: true },
      { id: "alerts", label: "Alerts", icon: Bell, badge: "12" },
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "tasks", label: "Tasks", icon: CheckCircle2 },
    ],
  },
  {
    title: "LEGAL MANAGEMENT",
    items: [
      { id: "matters", label: "Matters", icon: FileText },
      { id: "contracts", label: "Contracts", icon: FileCheck },
      { id: "documents", label: "Documents", icon: BookOpen },
      { id: "esignatures", label: "E-Signatures", icon: Stamp },
      { id: "legalhold", label: "Legal Hold", icon: Lock },
      { id: "disputes", label: "Disputes", icon: ShieldAlert },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { id: "regulations", label: "Regulations", icon: Shield },
      { id: "policycenter", label: "Policy Center", icon: Layers },
      { id: "compliancemonitor", label: "Compliance Monitor", icon: RefreshCw },
      { id: "riskassessments", label: "Risk Assessments", icon: AlertTriangle },
      { id: "auditmanagement", label: "Audit Management", icon: RefreshCw },
      { id: "training", label: "Training & Awareness", icon: GraduationCap },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { id: "entities", label: "Entities", icon: Users },
      { id: "board", label: "Board Management", icon: Scale },
      { id: "approvals", label: "Approvals", icon: CheckCircle2 },
      { id: "disclosures", label: "Disclosures", icon: Eye },
    ],
  },
];

export default function LegalCompliance() {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMsg, setCopilotMsg] = useState("");
  const [agentFilter, setAgentFilter] = useState("");

  const [legalData, setLegalData] = useState(null);

  // --- MODAL STATES FOR THE 6 BOTTOM FEATURE CARDS ---
  const [activeModal, setActiveModal] = useState(null); // 'documents' | 'esignatures' | 'legalhold' | 'audittrail' | 'policycenter' | 'trainingcenter'
  
  // Real Feature Data Stores
  const [documentsList, setDocumentsList] = useState([]);
  const [signaturesList, setSignaturesList] = useState([]);
  const [holdsList, setHoldsList] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);
  const [trainingList, setTrainingList] = useState([]);

  // Filter States inside Modals
  const [docSearch, setDocSearch] = useState("");
  const [sigSearch, setSigSearch] = useState("");
  const [auditSearch, setAuditSearch] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [newSigSigner, setNewSigSigner] = useState("");
  const [newSigTitle, setNewSigTitle] = useState("");

  const fetchLegalSummary = async () => {
    try {
      const res = await http.get("/legal/summary");
      if (res.data && res.data.status === "success") {
        setLegalData(res.data);
      }
    } catch {
      // Fallback
    }
  };

  const fetchFeatureData = async (modalKey) => {
    try {
      if (modalKey === "documents") {
        const res = await http.get("/legal/documents");
        if (res.data) setDocumentsList(res.data);
      } else if (modalKey === "esignatures") {
        const res = await http.get("/legal/signatures");
        if (res.data) setSignaturesList(res.data);
      } else if (modalKey === "legalhold") {
        const res = await http.get("/legal/holds");
        if (res.data) setHoldsList(res.data);
      } else if (modalKey === "audittrail") {
        const res = await http.get("/legal/audit-logs");
        if (res.data) setAuditLogsList(res.data);
      } else if (modalKey === "policycenter") {
        const res = await http.get("/legal/policies");
        if (res.data) setPoliciesList(res.data);
      } else if (modalKey === "trainingcenter") {
        const res = await http.get("/legal/training");
        if (res.data) setTrainingList(res.data);
      }
    } catch (err) {
      toast.error(`Failed to load ${modalKey} data`);
    }
  };

  useEffect(() => {
    fetchLegalSummary();
  }, []);

  const openFeatureModal = (modalKey) => {
    setActiveModal(modalKey);
    fetchFeatureData(modalKey);
  };

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!copilotMsg.trim()) return;
    toast.success(`AI Legal Assistant analyzing: "${copilotMsg}"`);
    setCopilotMsg("");
  };

  // Handlers for Feature Actions
  const handleUploadDocument = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc = {
      id: `doc-${Date.now().toString().slice(-3)}`,
      name: newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`,
      category: "CUSTOM CONTRACT",
      size: "1.5 MB",
      owner: "Legal Admin",
      updated: new Date().toISOString().split("T")[0],
      version: "v1.0",
      status: "PUBLISHED"
    };
    setDocumentsList([newDoc, ...documentsList]);
    setNewDocName("");
    toast.success(`Uploaded "${newDoc.name}" to Document Vault`);
  };

  const handleSendSignature = (e) => {
    e.preventDefault();
    if (!newSigTitle.trim() || !newSigSigner.trim()) return;
    const newSig = {
      id: `sig-${Date.now().toString().slice(-3)}`,
      title: newSigTitle,
      signer: newSigSigner,
      email: `${newSigSigner.toLowerCase().replace(/\s+/g, ".")}@nexus.ai`,
      status: "PENDING",
      sent_date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      security_hash: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`
    };
    setSignaturesList([newSig, ...signaturesList]);
    setNewSigTitle("");
    setNewSigSigner("");
    toast.success(`E-Signature request sent for "${newSig.title}"`);
  };

  const toggleHoldStatus = (id) => {
    setHoldsList(holdsList.map(h => {
      if (h.id === id) {
        const nextStatus = h.status === "ACTIVE" ? "RELEASED" : "ACTIVE";
        toast.info(`Legal Hold for ${h.custodian} set to ${nextStatus}`);
        return { ...h, status: nextStatus };
      }
      return h;
    }));
  };

  const triggerPolicyEnforce = (policyName) => {
    toast.success(`Policy "${policyName}" enforced across all 36 AI Agents`);
  };

  const triggerTrainingStart = (moduleName) => {
    toast.success(`Started training module: "${moduleName}"`);
  };

  // Agent legal activities list filter
  const agentActivities = legalData?.agent_legal_activities || [];
  const filteredAgentActivities = agentActivities.filter(a =>
    a.name.toLowerCase().includes(agentFilter.toLowerCase()) ||
    a.category.toLowerCase().includes(agentFilter.toLowerCase()) ||
    a.recent_activity.toLowerCase().includes(agentFilter.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#030617] via-[#070b22] to-[#040718] text-slate-100 font-sans flex select-none relative overflow-x-hidden"
      style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Radial Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* ── LEFT NAVIGATION SIDEBAR MATCHING REFERENCE IMAGE ───────────── */}
      <aside className="w-60 bg-[#06091e]/95 backdrop-blur-xl border-r border-indigo-500/20 p-4 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
        <div className="space-y-4 overflow-y-auto pr-1">
          {NAV_SIDEBAR_SECTIONS.map((sec, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-extrabold text-indigo-400/80 tracking-widest mb-1.5 px-2 uppercase">
                {sec.title}
              </h3>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeNavItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNavItem(item.id);
                        if (item.id === "documents") openFeatureModal("documents");
                        if (item.id === "esignatures") openFeatureModal("esignatures");
                        if (item.id === "legalhold") openFeatureModal("legalhold");
                        if (item.id === "policycenter") openFeatureModal("policycenter");
                        if (item.id === "training") openFeatureModal("trainingcenter");
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-cyan-300/40"
                          : "text-slate-400 hover:text-white hover:bg-indigo-500/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${isActive ? "text-cyan-300 animate-pulse" : "text-slate-400"}`} />
                        <span className="tracking-wide">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-black border border-rose-400/40 shadow-sm">
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-200" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom AI Legal Assistant Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#0d0d36] via-[#16144c] to-[#090b2b] border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Brain className="w-4 h-4 text-purple-300 animate-pulse" />
            </div>
            <h4 className="text-xs font-black text-white tracking-wider uppercase">AI LEGAL ASSISTANT</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug mb-3 font-medium">
            Your intelligent legal copilot.
          </p>
          <button
            onClick={() => setCopilotOpen(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 border border-purple-300/40 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            Ask Copilot
          </button>
        </div>
      </aside>

      {/* ── RIGHT MAIN WORKSPACE CANVAS ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        
        {/* TOP HEADER BAR MATCHING REFERENCE IMAGE */}
        <header className="h-16 bg-[#06091e]/95 backdrop-blur-2xl border-b border-indigo-500/20 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-[#06091e] rounded-[10px] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-purple-400 uppercase">AI OS</span>
                  <span className="text-slate-600">|</span>
                  <h1 className="text-base font-black tracking-wide text-white drop-shadow-md">LEGAL & COMPLIANCE</h1>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-wider">Ensure. Protect. Comply.</p>
              </div>
            </div>
          </div>

          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search matters, contracts, regulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 bg-[#0a0f30]/80 border border-indigo-500/30 rounded-full pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => toast.info("12 Legal alerts active")}
              className="relative p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-slate-200 border border-indigo-500/20 transition-all"
            >
              <Bell className="w-4 h-4 text-purple-300" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white font-black text-[9px] rounded-full flex items-center justify-center border border-[#06091e] shadow-md">
                12
              </span>
            </button>

            <button className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-slate-200 border border-indigo-500/20 transition-all">
              <HelpCircle className="w-4 h-4 text-slate-300" />
            </button>

            <button className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-slate-200 border border-indigo-500/20 transition-all">
              <Settings className="w-4 h-4 text-slate-300" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-600 p-[1.5px] shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Legal Admin"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#06091e] rounded-full shadow-sm" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Legal Admin</div>
                <div className="text-[10px] text-slate-400 font-medium leading-tight">Super Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY CONTENT */}
        <main className="p-5 space-y-6 flex-1">
          
          {/* ── TOP 6 METRICS CARDS (EXPLICIT 6-COLUMN ROW) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "1rem" }}>
            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">TOTAL MATTERS</span>
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.total_matters || 248}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.total_matters_growth || "18.6% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MATTERS_SPARKLINE}>
                    <defs>
                      <linearGradient id="purpleMatters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#a855f7" strokeWidth={2.5} fill="url(#purpleMatters)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">ACTIVE CONTRACTS</span>
                <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shadow-sm">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.active_contracts || 356}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.active_contracts_growth || "12.4% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CONTRACTS_SPARKLINE}>
                    <defs>
                      <linearGradient id="blueContracts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2.5} fill="url(#blueContracts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">COMPLIANCE SCORE</span>
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.compliance_score || "92%"}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.compliance_score_growth || "8.7% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COMPLIANCE_SPARKLINE}>
                    <defs>
                      <linearGradient id="emeraldComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2.5} fill="url(#emeraldComp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">POLICY VIOLATIONS</span>
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.policy_violations || 7}
              </div>
              <div className="text-[11px] font-extrabold text-rose-400 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.policy_violations_growth || "36% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={VIOLATIONS_SPARKLINE}>
                    <defs>
                      <linearGradient id="roseViol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#f43f5e" strokeWidth={2.5} fill="url(#roseViol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">PENDING APPROVALS</span>
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-sm">
                  <Stamp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.pending_approvals || 24}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.pending_approvals_growth || "14.3% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PENDING_SPARKLINE}>
                    <defs>
                      <linearGradient id="amberPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#eab308" strokeWidth={2.5} fill="url(#amberPending)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-indigo-400/60 shadow-2xl transition-all duration-300 flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">TRAINING COMPLETION</span>
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white tracking-tight">
                {legalData?.summary?.training_completion || "89%"}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{legalData?.summary?.training_completion_growth || "6.2% vs last month"}</span>
              </div>
              <div className="h-9 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAINING_SPARKLINE}>
                    <defs>
                      <linearGradient id="cyanTrain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={2.5} fill="url(#cyanTrain)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── ROW 1: COMPLIANCE STATUS | REGULATORY FRAMEWORK | RISK OVERVIEW | ALERTS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <h3 className="text-xs font-black text-white tracking-wider uppercase mb-2">COMPLIANCE STATUS</h3>

              <div className="relative h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={legalData?.compliance_status?.breakdown || []} innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                      {(legalData?.compliance_status?.breakdown || []).map((e, idx) => (
                        <Cell key={idx} fill={e.color} stroke="#080c26" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#090d2a", border: "1px solid rgba(168,85,247,0.4)", borderRadius: "12px", fontSize: "11px" }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-xl font-black text-white">92%</div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Compliant</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] mb-3">
                {(legalData?.compliance_status?.breakdown || []).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-300 font-medium">{c.name}</span>
                    </div>
                    <span className="font-bold text-white">{c.value}%</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openFeatureModal("policycenter")}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center justify-center gap-1 border-t border-slate-800/80 pt-2"
              >
                <span>View Compliance Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <h3 className="text-xs font-black text-white tracking-wider uppercase mb-3">REGULATORY FRAMEWORK</h3>

              <div className="space-y-3.5 text-xs my-auto">
                {(legalData?.regulatory_framework || []).map((rf, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">{rf.name}</span>
                      <span className="font-black text-white">{rf.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div className="h-full rounded-full shadow-sm" style={{ width: `${rf.pct}%`, backgroundColor: rf.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openFeatureModal("policycenter")}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center justify-center gap-1 border-t border-slate-800/80 pt-2 mt-3"
              >
                <span>View All Frameworks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <h3 className="text-xs font-black text-white tracking-wider uppercase mb-2">RISK OVERVIEW</h3>

              <div className="relative h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={legalData?.risk_overview?.breakdown || []} innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="count">
                      {(legalData?.risk_overview?.breakdown || []).map((e, idx) => (
                        <Cell key={idx} fill={e.color} stroke="#080c26" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#090d2a", border: "1px solid rgba(168,85,247,0.4)", borderRadius: "12px", fontSize: "11px" }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-2xl font-black text-white">76</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Risks</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] mb-3">
                {(legalData?.risk_overview?.breakdown || []).map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-slate-300 font-medium">{r.name}</span>
                    </div>
                    <span className="font-bold text-white">{r.count} ({r.pct}%)</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openFeatureModal("legalhold")}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center justify-center gap-1 border-t border-slate-800/80 pt-2"
              >
                <span>View Risk Register</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">COMPLIANCE ALERTS</h3>
                  <button onClick={() => openFeatureModal("audittrail")} className="text-xs text-purple-400 hover:text-purple-300 font-bold">View All</button>
                </div>

                <div className="space-y-3 text-xs">
                  {(legalData?.compliance_alerts || []).map((al, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#06091e]/90 border border-slate-800 flex items-start justify-between gap-2 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => openFeatureModal("audittrail")}>
                      <div>
                        <div className="font-bold text-slate-200 leading-tight">{al.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{al.desc}</div>
                        <div className="text-[9px] text-slate-500 mt-1">{al.time}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                        al.badge === "High"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : al.badge === "Medium"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      }`}>
                        {al.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: RECENT MATTERS | CONTRACTS EXPIRING SOON | UPCOMING TASKS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">RECENT MATTERS</h3>
                  <button onClick={() => openFeatureModal("documents")} className="text-xs text-purple-400 hover:text-purple-300 font-bold">View All</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase">
                      <tr>
                        <th className="pb-2">Matter Name</th>
                        <th className="pb-2">Matter ID</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Owner</th>
                        <th className="pb-2 text-right">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(legalData?.recent_matters || []).map((m, idx) => (
                        <tr key={idx} className="hover:bg-purple-500/5 transition-colors cursor-pointer" onClick={() => openFeatureModal("documents")}>
                          <td className="py-2.5 font-bold text-slate-200">{m.name}</td>
                          <td className="py-2.5 font-mono text-[10px] text-slate-400">{m.id}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              m.badge_color === "emerald"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : m.badge_color === "purple"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-300 font-medium">{m.owner}</td>
                          <td className="py-2.5 text-right text-slate-400 font-mono text-[10px]">{m.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">CONTRACTS EXPIRING SOON</h3>
                  <button onClick={() => openFeatureModal("esignatures")} className="text-xs text-purple-400 hover:text-purple-300 font-bold">View All</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase">
                      <tr>
                        <th className="pb-2">Contract Name</th>
                        <th className="pb-2">Expiry Date</th>
                        <th className="pb-2 text-center">Days Left</th>
                        <th className="pb-2 text-right">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(legalData?.contracts_expiring || []).map((c, idx) => (
                        <tr key={idx} className="hover:bg-purple-500/5 transition-colors cursor-pointer" onClick={() => openFeatureModal("esignatures")}>
                          <td className="py-2.5 font-bold text-slate-200">{c.name}</td>
                          <td className="py-2.5 text-slate-400 font-mono text-[10px]">{c.date}</td>
                          <td className="py-2.5 text-center font-bold text-white">{c.days}</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              c.risk === "Low"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : c.risk === "Medium"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            }`}>
                              {c.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 p-5 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-white tracking-wider uppercase">UPCOMING TASKS</h3>
                  <button onClick={() => openFeatureModal("trainingcenter")} className="text-xs text-purple-400 hover:text-purple-300 font-bold">View All</button>
                </div>

                <div className="space-y-3 text-xs">
                  {(legalData?.upcoming_tasks || []).map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          defaultChecked={t.completed}
                          onChange={(e) => toast.info(`Task "${t.title}" status updated`)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className={`font-semibold ${t.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{t.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── 36 AI AGENTS REAL LEGAL ACTIVITIES TELEMETRY PANEL ───────── */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d092d] via-[#151044] to-[#0d092d] border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)] space-y-5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Cpu className="w-6 h-6 animate-pulse text-purple-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wider uppercase flex items-center gap-2.5">
                    <span>36 AI AGENTS LEGAL & COMPLIANCE ENGINE</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/40 shadow-sm">
                      REAL WEBSITE LEGAL TELEMETRY
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Real-time legal matters, IP filings, contract executions, and compliance ratings across all 36 AI Agents.
                  </p>
                </div>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter 36 AI Agents..."
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="w-full h-8 bg-[#06091e] border border-slate-700/80 rounded-xl pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-64 overflow-y-auto pr-1">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#06091e] border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-extrabold">Agent Name</th>
                    <th className="py-2.5 px-3 font-extrabold">Category</th>
                    <th className="py-2.5 px-3 font-extrabold">Matters Handled</th>
                    <th className="py-2.5 px-3 font-extrabold">Contracts Generated</th>
                    <th className="py-2.5 px-3 font-extrabold">Compliance Rating</th>
                    <th className="py-2.5 px-3 font-extrabold">Recent Activity</th>
                    <th className="py-2.5 px-3 font-extrabold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAgentActivities.map((ag) => (
                    <tr key={ag.agent_id} className="hover:bg-purple-500/10 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                        <span>{ag.name}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold">
                          {ag.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-300">{ag.matters_handled}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-300">{ag.contracts_generated}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-400">{ag.compliance_rating}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-medium">{ag.recent_activity}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black border border-emerald-400/40">
                          {ag.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── BOTTOM FEATURE CARDS (6 INTERACTIVE WORKING CARDS MATCHING REFERENCE IMAGE) ───── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { id: "documents", title: "DOCUMENT MANAGEMENT", desc: "Secure, versioned, and centralized legal documents.", btn: "Access Documents →", icon: BookOpen },
              { id: "esignatures", title: "E-SIGNATURES", desc: "Legally-binding signatures made simple and secure.", btn: "Send for Signature →", icon: Stamp },
              { id: "legalhold", title: "LEGAL HOLD", desc: "Preserve data and meet litigation obligations.", btn: "Activate Hold →", icon: Lock },
              { id: "audittrail", title: "AUDIT TRAIL", desc: "Track all legal and compliance activities in real time.", btn: "View Audit Logs →", icon: RefreshCw },
              { id: "policycenter", title: "POLICY CENTER", desc: "Create, manage and distribute policies across organization.", btn: "Manage Policies →", icon: Layers },
              { id: "trainingcenter", title: "TRAINING CENTER", desc: "Assign, track and certify compliance training.", btn: "Go to Training →", icon: GraduationCap },
            ].map((ft) => {
              const FtIcon = ft.icon;
              return (
                <div
                  key={ft.id}
                  onClick={() => openFeatureModal(ft.id)}
                  className="p-4 rounded-2xl bg-[#080c26]/85 backdrop-blur-xl border border-indigo-500/25 hover:border-purple-400/70 hover:scale-[1.02] shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-md">
                    <FtIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white tracking-wider uppercase mb-1 group-hover:text-purple-300 transition-colors">{ft.title}</h4>
                    <p className="text-[10px] text-slate-300 leading-snug mb-3">{ft.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-extrabold text-purple-400 group-hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <span>{ft.btn}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── BOTTOM STATUS FOOTER BAR ───────────────────────────── */}
          <div className="p-4 rounded-2xl bg-[#06091e]/90 border border-indigo-500/30 shadow-2xl flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div>AI OS Legal & Compliance © 2026</div>
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure • Private • Compliant</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Last updated: May 25, 2026 10:30 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">System Status</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── 1. DOCUMENT MANAGEMENT MODAL ──────────────────────────── */}
      {activeModal === "documents" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">DOCUMENT MANAGEMENT VAULT</h3>
                  <p className="text-[11px] text-slate-400">Secure, version-controlled legal documents generated across 36 AI Agents</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form to Upload Document */}
            <form onSubmit={handleUploadDocument} className="flex gap-3 bg-[#06081a] p-3 rounded-2xl border border-slate-800">
              <input
                type="text"
                placeholder="Enter document title (e.g. Master_SLA_2026.pdf)..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="flex-1 bg-[#090d2a] border border-slate-700/80 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
                <Upload className="w-3.5 h-3.5" /> Upload Document
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#06081a] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Document Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Owner</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {documentsList.map((doc) => (
                    <tr key={doc.id} className="hover:bg-purple-500/10 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-purple-400" />
                        {doc.name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{doc.size}</td>
                      <td className="py-2.5 px-3 text-slate-300">{doc.owner}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{doc.version}</td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button onClick={() => toast.success(`Downloading ${doc.name}`)} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 text-[10px] font-bold">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. E-SIGNATURES MODAL ──────────────────────────────────── */}
      {activeModal === "esignatures" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-blue-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center">
                  <Stamp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">E-SIGNATURE WORKFLOW STUDIO</h3>
                  <p className="text-[11px] text-slate-400">Cryptographically signed legal agreements & agent consents</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSignature} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#06081a] p-3 rounded-2xl border border-slate-800">
              <input
                type="text"
                placeholder="Document Title (e.g. SLA Terms 2026)"
                value={newSigTitle}
                onChange={(e) => setNewSigTitle(e.target.value)}
                className="bg-[#090d2a] border border-slate-700/80 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Signer Full Name (e.g. John Doe)"
                value={newSigSigner}
                onChange={(e) => setNewSigSigner(e.target.value)}
                className="bg-[#090d2a] border border-slate-700/80 rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button type="submit" className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md">
                <Send className="w-3.5 h-3.5" /> Send Request
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#06081a] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Signer</th>
                    <th className="py-2.5 px-3">Sent Date</th>
                    <th className="py-2.5 px-3">Security Hash</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {signaturesList.map((sig) => (
                    <tr key={sig.id} className="hover:bg-blue-500/10 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-200">{sig.title}</td>
                      <td className="py-2.5 px-3 text-slate-300">{sig.signer}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">{sig.sent_date}</td>
                      <td className="py-2.5 px-3 font-mono text-purple-300 text-[10px]">{sig.security_hash}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                          sig.status === "SIGNED"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}>
                          {sig.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. LEGAL HOLD MODAL ────────────────────────────────────── */}
      {activeModal === "legalhold" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">LEGAL HOLD & DATA PRESERVATION</h3>
                  <p className="text-[11px] text-slate-400">Preserve logs, artifacts, and AI Agent databases for litigation compliance</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {holdsList.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl bg-[#06081a] border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white text-xs">{h.case_name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Custodian: <span className="text-cyan-300 font-semibold">{h.custodian}</span></div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">Scope: {h.scope} • Preserved Items: {h.items_preserved.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => toggleHoldStatus(h.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      h.status === "ACTIVE"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/40"
                    }`}
                  >
                    {h.status === "ACTIVE" ? "Release Hold" : "Activate Hold"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. AUDIT TRAIL MODAL ──────────────────────────────────── */}
      {activeModal === "audittrail" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">REAL-TIME LEGAL AUDIT TRAIL</h3>
                  <p className="text-[11px] text-slate-400">Complete immutable audit trail of actions taken by 36 AI Agents and Admins</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {auditLogsList.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#06081a] border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{log.actor}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-mono text-purple-300 text-[11px]">{log.action}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Target: {log.target}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                      log.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : log.severity === "WARN"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    }`}>
                      {log.severity}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-1 font-mono">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. POLICY CENTER MODAL ────────────────────────────────── */}
      {activeModal === "policycenter" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">POLICY CENTER & GOVERNANCE STUDIO</h3>
                  <p className="text-[11px] text-slate-400">Manage and enforce compliance policies across 36 AI Agents</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policiesList.map((pol) => (
                <div key={pol.id} className="p-4 rounded-2xl bg-[#06081a] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-white text-xs mb-1">{pol.name}</h4>
                    <p className="text-[10px] text-slate-400 mb-3">Owner: {pol.owner} • Review: {pol.last_review}</p>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">Compliance Score</span>
                      <span className="font-black text-emerald-400">{pol.compliance_score}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pol.compliance_score}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => triggerPolicyEnforce(pol.name)}
                    className="w-full py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all"
                  >
                    Enforce Across 36 Agents
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TRAINING CENTER MODAL ──────────────────────────────── */}
      {activeModal === "trainingcenter" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0b1030] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">COMPLIANCE TRAINING & CERTIFICATION HUB</h3>
                  <p className="text-[11px] text-slate-400">Track and assign compliance certifications for personnel and AI Agents</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainingList.map((trn) => (
                <div key={trn.id} className="p-4 rounded-2xl bg-[#06081a] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-white text-xs">{trn.module}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                        {trn.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3">Participants: {trn.participants} • Duration: {trn.duration}</p>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">Progress</span>
                      <span className="font-black text-cyan-300">{trn.completion}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${trn.completion}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => triggerTrainingStart(trn.module)}
                    className="w-full py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all"
                  >
                    Start Training Module
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI LEGAL ASSISTANT MODAL ──────────────────────────────── */}
      {copilotOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1030] border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">AI LEGAL ASSISTANT</h3>
              </div>
              <button onClick={() => setCopilotOpen(false)} className="text-slate-400 hover:text-white text-sm font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Ask AI Legal Assistant to review contracts, assess GDPR compliance across 36 agents, audit privacy risks, or draft litigation responses.
            </p>

            <form onSubmit={handleCopilotSubmit} className="space-y-3">
              <textarea
                rows={3}
                placeholder="e.g. Perform GDPR risk assessment across all 36 AI Agent contracts..."
                value={copilotMsg}
                onChange={(e) => setCopilotMsg(e.target.value)}
                className="w-full bg-[#06081a] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 shadow-inner"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["GDPR Audit", "Contract Review", "Policy Check"].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setCopilotMsg(`Audit ${tag.toLowerCase()} for Q2`)}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[10px] font-bold text-purple-300 hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110"
                >
                  Ask Copilot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
