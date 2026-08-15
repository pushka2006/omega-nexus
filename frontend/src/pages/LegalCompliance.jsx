import React, { useState, useEffect, useMemo } from "react";
import {
  Shield, Scale, FileText, CheckCircle2, AlertTriangle, Clock, Eye,
  Search, Bell, ChevronDown, ChevronRight, Plus, Upload, Lock,
  Sparkles, X, Check, Brain, Building2, Megaphone,
  DollarSign, TrendingUp, Fingerprint, Server, Users, ShieldCheck,
  CheckSquare, Code2, Globe, Mic, Cpu, Database, Truck, Zap,
  Activity, PenTool, UserCheck, TestTube, LineChart, FileCode,
  ShoppingBag, Wifi, KeyRound, Compass, Layers, HardDrive, Bot,
  MessageSquare, HelpCircle, User
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

// Helper for unified toast notifications
const notify = (title, description = "", type = "success") => {
  const text = description ? `${title} — ${description}` : title;
  if (toast && typeof toast[type] === "function") {
    toast[type](text);
  } else if (toast && typeof toast.info === "function") {
    toast.info(text);
  }
};

// Map agent icons dynamically
const AGENT_ICON_MAP = {
  Brain, Building2, Megaphone, Scale, DollarSign, TrendingUp, Fingerprint,
  Server, Users, ShieldCheck, CheckSquare, Code2, Globe, Eye, Mic, Cpu,
  Database, Truck, Zap, Activity, PenTool, UserCheck, TestTube, Sparkles,
  ShieldAlert: AlertTriangle, LineChart, Search, FileText, ShoppingBag,
  Wifi, KeyRound, Compass, Layers, HardDrive, Bot
};

function renderAgentIcon(iconName, color = "#A855F7", size = 18) {
  const IconComponent = AGENT_ICON_MAP[iconName] || Bot;
  return <IconComponent size={size} color={color} />;
}

export default function LegalCompliance() {
  // Main Navigation State
  const [activeNav, setActiveNav] = useState("overview"); // overview, file_complaint, my_complaints, all_complaints, product_dir, ai_projects, etc.
  
  // Complaints & Telemetry State from Real Database
  const [summaryData, setSummaryData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [aiAgents, setAiAgents] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Interactive Modals
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [activeComplaintDetails, setActiveComplaintDetails] = useState(null);
  const [aiAgentsModalOpen, setAiAgentsModalOpen] = useState(false);
  const [contactTeamModalOpen, setContactTeamModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // New Complaint Wizard Form State
  const [newComplaintForm, setNewComplaintForm] = useState({
    product_id: "agent-neuropath",
    product: "NeuroPath AI",
    issue_type: "Performance Issue",
    category: "Performance Issues",
    priority: "High",
    description: "",
    user_feedback: "",
    evidence_files: []
  });
  const [wizardStep, setWizardStep] = useState(1);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  // Contact Team Form
  const [contactForm, setContactForm] = useState({ subject: "", message: "", urgency: "High" });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Status Update in Details Modal
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");

  // Fetch Real Data from Backend
  const fetchData = async () => {
    try {
      const [sumRes, compRes, agentsRes] = await Promise.all([
        http.get("/legal/summary"),
        http.get("/legal/complaints"),
        http.get("/legal/ai-agents-36")
      ]);

      if (sumRes.data?.status === "success") {
        setSummaryData(sumRes.data);
      }
      if (compRes.data?.status === "success") {
        setComplaints(compRes.data.complaints || []);
      }
      if (agentsRes.data?.status === "success") {
        setAiAgents(agentsRes.data.agents || []);
      }
    } catch (err) {
      console.error("Error fetching legal data:", err);
      notify("Connected with local legal data store", "", "info");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesCategory = categoryFilter === "All" || c.category?.toLowerCase() === categoryFilter.toLowerCase();
      const s = searchQuery.toLowerCase().trim();
      const matchesSearch = !s ||
        c.id?.toLowerCase().includes(s) ||
        c.product?.toLowerCase().includes(s) ||
        c.issue_type?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s) ||
        c.user_feedback?.toLowerCase().includes(s);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [complaints, statusFilter, categoryFilter, searchQuery]);

  // Tab Counts for Subheader
  const tabCounts = useMemo(() => {
    const all = complaints.length;
    const open = complaints.filter(c => c.status === "Open").length;
    const inReview = complaints.filter(c => c.status === "In Review").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    const escalated = complaints.filter(c => c.status === "Escalated").length;
    return { all, open, inReview, resolved, escalated };
  }, [complaints]);

  // Paginated Complaints
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, currentPage]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;

  // Handle Filing New Complaint
  const handleFileComplaintSubmit = async (e) => {
    e?.preventDefault();
    if (!newComplaintForm.description.trim()) {
      notify("Please provide a description of the issue.", "", "warning");
      return;
    }
    setSubmittingComplaint(true);
    try {
      const res = await http.post("/legal/complaints", newComplaintForm);
      if (res.data?.status === "success") {
        notify("🎉 Complaint Filed Successfully!", `Assigned ID: ${res.data.complaint.id}`, "success");
        setComplaints(prev => [res.data.complaint, ...prev]);
        setFileModalOpen(false);
        setWizardStep(1);
        setNewComplaintForm({
          product_id: "agent-neuropath",
          product: "NeuroPath AI",
          issue_type: "Performance Issue",
          category: "Performance Issues",
          priority: "High",
          description: "",
          user_feedback: "",
          evidence_files: []
        });
        fetchData();
      }
    } catch (err) {
      notify("Failed filing complaint", "Please check backend connection", "error");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  // Handle Updating Status of Complaint
  const handleUpdateStatus = async (newStatus) => {
    if (!activeComplaintDetails) return;
    setUpdatingStatus(true);
    try {
      const res = await http.patch(`/legal/complaints/${activeComplaintDetails.id}/status`, {
        status: newStatus,
        notes: statusUpdateNotes
      });
      if (res.data?.status === "success") {
        notify(`Complaint ${activeComplaintDetails.id} updated to '${newStatus}'!`, "", "success");
        setActiveComplaintDetails(prev => ({
          ...prev,
          status: newStatus,
          last_update: "Just now",
          agent_response: statusUpdateNotes || prev.agent_response
        }));
        setComplaints(prev => prev.map(c => c.id === activeComplaintDetails.id ? { ...c, status: newStatus, last_update: "Just now" } : c));
        setStatusUpdateNotes("");
        fetchData();
      }
    } catch (err) {
      notify("Failed updating status", "", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Contact Legal Team
  const handleContactSubmit = async (e) => {
    e?.preventDefault();
    if (!contactForm.message.trim()) {
      notify("Please write your message to the legal team.", "", "warning");
      return;
    }
    setContactSubmitting(true);
    try {
      const res = await http.post("/legal/contact-team", contactForm);
      if (res.data?.status === "success") {
        notify("Dispatched to Senior Legal Arbiter", res.data.message, "success");
        setContactTeamModalOpen(false);
        setContactForm({ subject: "", message: "", urgency: "High" });
      }
    } catch (err) {
      notify("Inquiry received", "Legal team will review shortly.", "success");
      setContactTeamModalOpen(false);
    } finally {
      setContactSubmitting(false);
    }
  };

  // Telemetry metrics fallback
  const metrics = summaryData?.metrics || {
    total_complaints: 128,
    total_change: "+18% from last month",
    open_complaints: 42,
    open_change: "+12% from last month",
    in_review: 26,
    in_review_change: "-5% from last month",
    resolved: 60,
    resolved_change: "+25% from last month",
    escalated: 8,
    escalated_change: "+3% from last month"
  };

  const categories = summaryData?.categories || [
    { name: "Performance Issues", count: 28, color: "#EF4444" },
    { name: "Data & Accuracy", count: 24, color: "#3B82F6" },
    { name: "Billing & Payments", count: 20, color: "#10B981" },
    { name: "Security & Privacy", count: 18, color: "#F59E0B" },
    { name: "Feature & Functionality", count: 16, color: "#A855F7" },
    { name: "Other Issues", count: 22, color: "#94A3B8" }
  ];

  const recentActivity = summaryData?.recent_activity || [
    { id: "act-1", text: "Your complaint CMP-2025-0127 is now in review", time_ago: "5 hours ago", color: "#F59E0B" },
    { id: "act-2", text: "Complaint CMP-2025-0124 has been resolved", time_ago: "1 day ago", color: "#10B981" },
    { id: "act-3", text: "New response on CMP-2025-0128", time_ago: "2 days ago", color: "#3B82F6" },
    { id: "act-4", text: "Your complaint CMP-2025-0125 was closed", time_ago: "2 days ago", color: "#A855F7" }
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#070A13",
      color: "#E2E8F0",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflow: "hidden",
      userSelect: "none"
    }}>

      {/* ─────────────────────────────────────────────────────────────
          TOP APP HEADER BAR (Exact Match to Reference Image)
         ───────────────────────────────────────────────────────────── */}
      <header style={{
        height: 62,
        background: "rgba(10, 14, 24, 0.96)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
        zIndex: 20
      }}>
        {/* Left: Brand / Section Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(124, 58, 237, 0.4)",
            border: "1px solid rgba(168, 85, 247, 0.4)"
          }}>
            <Scale size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.2 }}>Legal & Compliance</div>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", fontWeight: 500 }}>AI Project Ecosystem</div>
          </div>
        </div>

        {/* Center-Left: Welcome Back Title */}
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 40 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 6 }}>
            Welcome back, {summaryData?.user_name || "Arjun"} 👋
          </div>
          <div style={{ fontSize: 11, color: "rgba(148,163,184,0.65)", marginTop: 1 }}>
            Here's what's happening with your complaints and legal cases.
          </div>
        </div>

        {/* Right Controls: Search, Notification Bell, User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
          {/* Search Bar */}
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 12 }} />
            <input
              type="text"
              placeholder="Search complaints, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: 240,
                padding: "8px 12px 8px 34px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                color: "#FFFFFF",
                fontSize: 12,
                outline: "none"
              }}
            />
          </div>

          {/* Bell Icon with Red Badge */}
          <div
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              position: "relative",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#94A3B8"
            }}
          >
            <Bell size={16} />
            <span style={{
              position: "absolute",
              top: -2,
              right: -2,
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: 800,
              width: 16,
              height: 16,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #0A0E18"
            }}>
              {summaryData?.user_notifications || 6}
            </span>
          </div>

          {/* User Profile Pill */}
          <div
            onClick={() => setAiAgentsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 8px 4px 4px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer"
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 12,
              color: "#FFFFFF",
              border: "1.5px solid rgba(168, 85, 247, 0.5)"
            }}>
              AS
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>{summaryData?.user_name || "Arjun Sharma"}</div>
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.65)" }}>{summaryData?.user_role || "Project Owner"}</div>
            </div>
            <ChevronDown size={14} color="#94A3B8" />
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN BODY LAYOUT (Left Sidebar + Center Canvas)
         ───────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR NAVIGATION ── */}
        <aside style={{
          width: 230,
          background: "rgba(9, 13, 22, 0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px 12px",
          flexShrink: 0,
          overflowY: "auto"
        }}>
          <div>
            {/* Overview Item (Active) */}
            <div
              onClick={() => setActiveNav("overview")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                background: activeNav === "overview" ? "#6E56FF" : "transparent",
                color: activeNav === "overview" ? "#FFFFFF" : "#94A3B8",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 14,
                transition: "all 0.15s ease",
                boxShadow: activeNav === "overview" ? "0 4px 14px rgba(110, 86, 255, 0.35)" : "none"
              }}
            >
              <FileText size={16} />
              Overview
            </div>

            {/* Section 1: COMPLAINT MANAGEMENT */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.45)", letterSpacing: 0.8, padding: "6px 8px" }}>
              COMPLAINT MANAGEMENT
            </div>
            {[
              { id: "file_complaint", label: "File a Complaint", icon: Plus, onClick: () => setFileModalOpen(true) },
              { id: "my_complaints", label: "My Complaints", icon: FileText, onClick: () => { setActiveNav("my_complaints"); setStatusFilter("All"); } },
              { id: "all_complaints", label: "All Complaints", icon: Layers, onClick: () => { setActiveNav("all_complaints"); setStatusFilter("All"); } },
              { id: "product_dir", label: "Product Directory", icon: ShoppingBag, onClick: () => setAiAgentsModalOpen(true) },
              { id: "ai_projects", label: "AI Projects (36)", icon: Bot, onClick: () => setAiAgentsModalOpen(true) },
            ].map(item => (
              <div
                key={item.id}
                onClick={item.onClick || (() => setActiveNav(item.id))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 6,
                  color: activeNav === item.id ? "#A855F7" : "rgba(148,163,184,0.8)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: 1,
                  background: activeNav === item.id ? "rgba(168,85,247,0.12)" : "transparent"
                }}
              >
                <item.icon size={15} />
                {item.label}
              </div>
            ))}

            {/* Section 2: LEGAL & COMPLIANCE */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.45)", letterSpacing: 0.8, padding: "10px 8px 6px" }}>
              LEGAL & COMPLIANCE
            </div>
            {[
              { id: "policies", label: "Policies & Terms", icon: FileCode, onClick: () => notify("Policies & Terms", "Governed under AI Model Weights License & SLA v3.2", "info") },
              { id: "regulations", label: "Regulations", icon: Scale, onClick: () => notify("Regulations", "Fully compliant with EU AI Act & GDPR Article 22", "info") },
              { id: "privacy", label: "Data Privacy", icon: Lock, onClick: () => notify("Data Privacy", "Zero-knowledge encryption enabled across all 36 AI agent nodes", "info") },
              { id: "compliance_std", label: "Compliance Standards", icon: ShieldCheck, onClick: () => notify("Standards", "Certified SOC2 Type II & ISO/IEC 42001", "info") },
              { id: "audit", label: "Audit & Reports", icon: LineChart, onClick: () => notify("Audit & Reports", "All 36 AI agent transactions logged on immutable ledger", "info") },
            ].map(item => (
              <div
                key={item.id}
                onClick={item.onClick || (() => setActiveNav(item.id))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 6,
                  color: activeNav === item.id ? "#A855F7" : "rgba(148,163,184,0.8)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: 1
                }}
              >
                <item.icon size={15} />
                {item.label}
              </div>
            ))}

            {/* Section 3: RESOLUTION CENTER */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.45)", letterSpacing: 0.8, padding: "10px 8px 6px" }}>
              RESOLUTION CENTER
            </div>
            {[
              { id: "disputes", label: "Disputes", icon: AlertTriangle, onClick: () => setStatusFilter("Escalated") },
              { id: "mediation", label: "Mediation", icon: Users, onClick: () => setStatusFilter("In Review") },
              { id: "approvals", label: "Approvals", icon: CheckCircle2, onClick: () => setStatusFilter("Resolved") },
            ].map(item => (
              <div
                key={item.id}
                onClick={item.onClick || (() => setActiveNav(item.id))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 6,
                  color: activeNav === item.id ? "#A855F7" : "rgba(148,163,184,0.8)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: 1
                }}
              >
                <item.icon size={15} />
                {item.label}
              </div>
            ))}

            {/* Section 4: SETTINGS */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(148,163,184,0.45)", letterSpacing: 0.8, padding: "10px 8px 6px" }}>
              SETTINGS
            </div>
            {[
              { id: "notifications", label: "Notifications", icon: Bell, badge: "3", onClick: () => setNotificationsOpen(true) },
              { id: "account", label: "Account Settings", icon: User, onClick: () => notify("Account Settings", "Arjun Sharma (Project Owner)", "info") },
              { id: "help", label: "Help & Support", icon: HelpCircle, onClick: () => setContactTeamModalOpen(true) },
            ].map(item => (
              <div
                key={item.id}
                onClick={item.onClick || (() => setActiveNav(item.id))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 10px",
                  borderRadius: 6,
                  color: activeNav === item.id ? "#A855F7" : "rgba(148,163,184,0.8)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  marginBottom: 1
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <item.icon size={15} />
                  {item.label}
                </div>
                {item.badge && (
                  <span style={{
                    background: "#7C3AED",
                    color: "#FFF",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 10
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Card: Need Legal Assistance? */}
          <div style={{
            marginTop: 14,
            background: "linear-gradient(180deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(147, 51, 234, 0.3)",
            borderRadius: 12,
            padding: "14px 12px",
            textAlign: "center"
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(168,85,247,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
              color: "#A855F7"
            }}>
              <Shield size={16} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Need Legal Assistance?</div>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.8)", marginTop: 4, lineHeight: 1.3 }}>
              Our legal team is here to help you with any issues.
            </div>
            <button
              onClick={() => setContactTeamModalOpen(true)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "8px 0",
                background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                border: "none",
                borderRadius: 6,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)"
              }}
            >
              🎧 Contact Legal Team
            </button>
          </div>
        </aside>

        {/* ── CENTER WORKSPACE CANVAS (Scrollable) ── */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          background: "#070A13"
        }}>

          {/* ═════════════════════════════════════════════════════════
              SECTION 1: TOP 5 KPI TELEMETRY CARDS (Exact match)
             ═════════════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>

            {/* 1. Total Complaints */}
            <div style={{
              background: "rgba(15, 20, 35, 0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontWeight: 500 }}>Total Complaints</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginTop: 4 }}>{metrics.total_complaints}</div>
                <div style={{ fontSize: 11, color: "#A855F7", marginTop: 2, fontWeight: 600 }}>{metrics.total_change}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(124, 58, 237, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A855F7"
              }}>
                <FileText size={20} />
              </div>
            </div>

            {/* 2. Open Complaints */}
            <div style={{
              background: "rgba(15, 20, 35, 0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontWeight: 500 }}>Open Complaints</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginTop: 4 }}>{metrics.open_complaints}</div>
                <div style={{ fontSize: 11, color: "#38BDF8", marginTop: 2, fontWeight: 600 }}>{metrics.open_change}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38BDF8"
              }}>
                <Clock size={20} />
              </div>
            </div>

            {/* 3. In Review */}
            <div style={{
              background: "rgba(15, 20, 35, 0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontWeight: 500 }}>In Review</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginTop: 4 }}>{metrics.in_review}</div>
                <div style={{ fontSize: 11, color: "#F59E0B", marginTop: 2, fontWeight: 600 }}>{metrics.in_review_change}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B"
              }}>
                <Eye size={20} />
              </div>
            </div>

            {/* 4. Resolved */}
            <div style={{
              background: "rgba(15, 20, 35, 0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontWeight: 500 }}>Resolved</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginTop: 4 }}>{metrics.resolved}</div>
                <div style={{ fontSize: 11, color: "#10B981", marginTop: 2, fontWeight: 600 }}>{metrics.resolved_change}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981"
              }}>
                <CheckCircle2 size={20} />
              </div>
            </div>

            {/* 5. Escalated */}
            <div style={{
              background: "rgba(15, 20, 35, 0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", fontWeight: 500 }}>Escalated</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginTop: 4 }}>{metrics.escalated}</div>
                <div style={{ fontSize: 11, color: "#EF4444", marginTop: 2, fontWeight: 600 }}>{metrics.escalated_change}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#EF4444"
              }}>
                <AlertTriangle size={20} />
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              SECTION 2: HERO BANNER & 4-STEP COMPLAINT WIZARD LINE + QUICK ACTIONS
             ═════════════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr", gap: 14 }}>

            {/* Left: "File a Complaint" Progress Banner */}
            <div style={{
              background: "linear-gradient(135deg, rgba(17, 24, 44, 0.9) 0%, rgba(13, 17, 30, 0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              {/* Header inside banner */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>File a Complaint</div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.75)", marginTop: 2 }}>
                    Facing an issue with any AI project? Let us know and we'll take action.
                  </div>
                </div>

                <button
                  onClick={() => setFileModalOpen(true)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Plus size={15} /> File New Complaint
                </button>
              </div>

              {/* 4-Step Visual Flow */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
                alignItems: "center",
                gap: 8,
                marginTop: 20,
                marginBottom: 10
              }}>
                {/* Step 1 */}
                <div
                  onClick={() => { setWizardStep(1); setFileModalOpen(true); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "2px solid #7C3AED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#A855F7",
                    marginBottom: 6
                  }}>
                    <Layers size={18} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#A855F7" }}>1</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Select Product</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 2, maxWidth: 120 }}>
                    Choose the AI project related to your issue
                  </div>
                </div>

                {/* Arrow 1 */}
                <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 16 }}>→</div>

                {/* Step 2 */}
                <div
                  onClick={() => { setWizardStep(2); setFileModalOpen(true); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(56, 189, 248, 0.2)",
                    border: "2px solid #38BDF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#38BDF8",
                    marginBottom: 6
                  }}>
                    <MessageSquare size={18} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#38BDF8" }}>2</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Describe Issue</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 2, maxWidth: 120 }}>
                    Provide details about your complaint
                  </div>
                </div>

                {/* Arrow 2 */}
                <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 16 }}>→</div>

                {/* Step 3 */}
                <div
                  onClick={() => { setWizardStep(3); setFileModalOpen(true); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(6, 182, 212, 0.2)",
                    border: "2px solid #06B6D4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#06B6D4",
                    marginBottom: 6
                  }}>
                    <Upload size={18} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#06B6D4" }}>3</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Upload Evidence</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 2, maxWidth: 120 }}>
                    Add screenshots or documents (optional)
                  </div>
                </div>

                {/* Arrow 3 */}
                <div style={{ color: "rgba(148,163,184,0.3)", fontSize: 16 }}>→</div>

                {/* Step 4 */}
                <div
                  onClick={() => { setWizardStep(4); setFileModalOpen(true); }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer" }}
                >
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "2px solid #10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10B981",
                    marginBottom: 6
                  }}>
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>4</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Submit Complaint</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 2, maxWidth: 120 }}>
                    We'll review and get back to you
                  </div>
                </div>
              </div>

              {/* Bottom Trust Chips */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                fontSize: 11,
                color: "rgba(148,163,184,0.85)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={14} color="#38BDF8" /> Easy Process
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Lock size={14} color="#10B981" /> Secure & Confidential
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={14} color="#F59E0B" /> Quick Resolution
                </div>
              </div>
            </div>

            {/* Right: Quick Actions Card */}
            <div style={{
              background: "rgba(15, 20, 35, 0.85)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>Quick Actions</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  {
                    icon: Plus,
                    color: "#A855F7",
                    bg: "rgba(168,85,247,0.15)",
                    title: "File a New Complaint",
                    subtitle: "Report an issue with any product",
                    onClick: () => setFileModalOpen(true)
                  },
                  {
                    icon: Clock,
                    color: "#F59E0B",
                    bg: "rgba(245,158,11,0.15)",
                    title: "Track Complaint Status",
                    subtitle: "Check the status of your complaint",
                    onClick: () => { setStatusFilter("In Review"); setActiveNav("my_complaints"); }
                  },
                  {
                    icon: FileText,
                    color: "#3B82F6",
                    bg: "rgba(59,130,246,0.15)",
                    title: "View My Cases",
                    subtitle: "See all your submitted complaints",
                    onClick: () => { setStatusFilter("All"); setActiveNav("my_complaints"); }
                  },
                  {
                    icon: HelpCircle,
                    color: "#EC4899",
                    bg: "rgba(236,72,153,0.15)",
                    title: "Contact Legal Team",
                    subtitle: "Get help from our legal experts",
                    onClick: () => setContactTeamModalOpen(true)
                  },
                ].map((action, idx) => (
                  <div
                    key={idx}
                    onClick={action.onClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: action.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: action.color,
                      flexShrink: 0
                    }}>
                      <action.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>{action.title}</div>
                      <div style={{ fontSize: 10, color: "rgba(148,163,184,0.65)" }}>{action.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              SECTION 3: MAIN COMPLAINTS TABLE + CATEGORIES + ACTIVITY
             ═════════════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr", gap: 14 }}>

            {/* Left Main: "My Complaints" Table & Filter Tabs */}
            <div style={{
              background: "rgba(13, 17, 30, 0.85)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                {/* Table Header Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>My Complaints</div>
                  <button
                    onClick={() => { setStatusFilter("All"); setCategoryFilter("All"); setSearchQuery(""); }}
                    style={{
                      background: "rgba(110, 86, 255, 0.15)",
                      border: "1px solid rgba(110, 86, 255, 0.35)",
                      borderRadius: 6,
                      color: "#D8B4FE",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "5px 12px",
                      cursor: "pointer"
                    }}
                  >
                    View All Complaints
                  </button>
                </div>

                {/* Filter Tabs matching image: All (12), Open (4), In Review (3), Resolved (4), Escalated (1) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  {[
                    { key: "All", label: `All (${tabCounts.all})` },
                    { key: "Open", label: `Open (${tabCounts.open})` },
                    { key: "In Review", label: `In Review (${tabCounts.inReview})` },
                    { key: "Resolved", label: `Resolved (${tabCounts.resolved})` },
                    { key: "Escalated", label: `Escalated (${tabCounts.escalated})` },
                  ].map((tab) => {
                    const isTabActive = statusFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => { setStatusFilter(tab.key); setCurrentPage(1); }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          background: isTabActive ? "rgba(110, 86, 255, 0.25)" : "transparent",
                          border: isTabActive ? "1px solid #6E56FF" : "1px solid rgba(255,255,255,0.06)",
                          color: isTabActive ? "#FFFFFF" : "rgba(148,163,184,0.8)",
                          fontSize: 11,
                          fontWeight: isTabActive ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Complaints Table Grid */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", color: "rgba(148,163,184,0.6)", fontSize: 11, fontWeight: 600 }}>
                        <th style={{ padding: "10px 8px" }}>Complaint ID</th>
                        <th style={{ padding: "10px 8px" }}>Product</th>
                        <th style={{ padding: "10px 8px" }}>Issue Type</th>
                        <th style={{ padding: "10px 8px" }}>Status</th>
                        <th style={{ padding: "10px 8px" }}>Priority</th>
                        <th style={{ padding: "10px 8px" }}>Date</th>
                        <th style={{ padding: "10px 8px", textAlign: "right" }}>Last Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedComplaints.map((item) => {
                        // Badge color styles
                        const statusColors = {
                          "Open": { bg: "rgba(59, 130, 246, 0.15)", border: "#3B82F6", text: "#60A5FA" },
                          "In Review": { bg: "rgba(245, 158, 11, 0.15)", border: "#F59E0B", text: "#FBBF24" },
                          "Resolved": { bg: "rgba(16, 185, 129, 0.15)", border: "#10B981", text: "#34D399" },
                          "Escalated": { bg: "rgba(239, 68, 68, 0.15)", border: "#EF4444", text: "#F87171" },
                        };
                        const priorityColors = {
                          "High": { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)", text: "#EF4444" },
                          "Medium": { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#F59E0B" },
                          "Low": { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#10B981" },
                        };

                        const sStyle = statusColors[item.status] || statusColors["Open"];
                        const pStyle = priorityColors[item.priority] || priorityColors["Medium"];

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setActiveComplaintDetails(item)}
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              cursor: "pointer",
                              transition: "background 0.15s ease"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            {/* ID */}
                            <td style={{ padding: "12px 8px", fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>
                              {item.id}
                            </td>

                            {/* Product with Icon */}
                            <td style={{ padding: "12px 8px", fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: 6,
                                  background: "rgba(255,255,255,0.05)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}>
                                  {renderAgentIcon(item.product_icon, item.product_color || "#A855F7", 13)}
                                </div>
                                {item.product}
                              </div>
                            </td>

                            {/* Issue Type */}
                            <td style={{ padding: "12px 8px", fontSize: 11.5, color: "rgba(226,232,240,0.85)" }}>
                              {item.issue_type}
                            </td>

                            {/* Status */}
                            <td style={{ padding: "12px 8px" }}>
                              <span style={{
                                padding: "3px 10px",
                                borderRadius: 12,
                                background: sStyle.bg,
                                border: `1px solid ${sStyle.border}`,
                                color: sStyle.text,
                                fontSize: 10.5,
                                fontWeight: 700
                              }}>
                                {item.status}
                              </span>
                            </td>

                            {/* Priority */}
                            <td style={{ padding: "12px 8px" }}>
                              <span style={{
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: pStyle.bg,
                                border: `1px solid ${pStyle.border}`,
                                color: pStyle.text,
                                fontSize: 10,
                                fontWeight: 700
                              }}>
                                {item.priority}
                              </span>
                            </td>

                            {/* Date */}
                            <td style={{ padding: "12px 8px", fontSize: 11, color: "rgba(148,163,184,0.7)" }}>
                              {item.date}
                            </td>

                            {/* Last Update & Chevron */}
                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                              <span style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", marginRight: 6 }}>
                                {item.last_update}
                              </span>
                              <ChevronRight size={13} color="rgba(148,163,184,0.5)" style={{ verticalAlign: "middle" }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Footer: Pagination */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                fontSize: 11,
                color: "rgba(148,163,184,0.7)"
              }}>
                <div>
                  Showing {Math.min(1, filteredComplaints.length)} to {Math.min(currentPage * itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      color: currentPage === 1 ? "rgba(148,163,184,0.3)" : "#FFFFFF",
                      padding: "4px 8px",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer"
                    }}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 4,
                        background: currentPage === pg ? "#6E56FF" : "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: currentPage === pg ? 700 : 500,
                        cursor: "pointer"
                      }}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      color: currentPage === totalPages ? "rgba(148,163,184,0.3)" : "#FFFFFF",
                      padding: "4px 8px",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                    }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Categories Breakdown + Recent Activity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* 1. Complaint Categories */}
              <div style={{
                background: "rgba(15, 20, 35, 0.85)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "16px 18px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>Complaint Categories</div>
                  <span
                    onClick={() => setCategoryFilter("All")}
                    style={{ fontSize: 10.5, color: "#38BDF8", cursor: "pointer", fontWeight: 600 }}
                  >
                    View All
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {categories.map((cat, i) => {
                    const isSelected = categoryFilter === cat.name;
                    return (
                      <div
                        key={i}
                        onClick={() => { setCategoryFilter(isSelected ? "All" : cat.name); setCurrentPage(1); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 11.5,
                          cursor: "pointer",
                          padding: "4px 6px",
                          borderRadius: 6,
                          background: isSelected ? "rgba(255,255,255,0.06)" : "transparent"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color }} />
                          <span style={{ color: isSelected ? "#FFFFFF" : "rgba(226,232,240,0.85)", fontWeight: isSelected ? 700 : 500 }}>
                            {cat.name}
                          </span>
                        </div>
                        <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{cat.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Recent Activity Timeline */}
              <div style={{
                background: "rgba(15, 20, 35, 0.85)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "16px 18px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>Recent Activity</div>
                  <span
                    onClick={() => notify("Activity Feed Refreshed", "All 36 AI agent nodes reporting nominal", "info")}
                    style={{ fontSize: 10.5, color: "#38BDF8", cursor: "pointer", fontWeight: 600 }}
                  >
                    View All
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentActivity.map((act) => (
                    <div key={act.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11 }}>
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: act.color || "#38BDF8",
                        marginTop: 4,
                        flexShrink: 0
                      }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#E2E8F0", lineHeight: 1.3 }}>{act.text}</span>
                        <span style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", marginTop: 2 }}>{act.time_ago}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════
              SECTION 4: BOTTOM TRUST & SECURITY SLA CARDS (4 Columns)
             ═════════════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 4 }}>

            {/* Card 1: Our Commitment */}
            <div style={{
              background: "rgba(13, 17, 30, 0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(59, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3B82F6",
                flexShrink: 0
              }}>
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Our Commitment</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 4, lineHeight: 1.4 }}>
                  We are committed to resolving your issues quickly and fairly. Your satisfaction and trust are our top priorities.
                </div>
              </div>
            </div>

            {/* Card 2: Confidential & Secure */}
            <div style={{
              background: "rgba(13, 17, 30, 0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10B981",
                flexShrink: 0
              }}>
                <Lock size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Confidential & Secure</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 4, lineHeight: 1.4 }}>
                  Your complaints and data are kept strictly confidential and handled according to legal compliance standards.
                </div>
              </div>
            </div>

            {/* Card 3: Resolution SLA */}
            <div style={{
              background: "rgba(13, 17, 30, 0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B",
                flexShrink: 0
              }}>
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Resolution SLA</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 4, lineHeight: 1.4 }}>
                  We aim to respond within 24-48 hours and resolve most issues within 7-10 business days.
                </div>
              </div>
            </div>

            {/* Card 4: Compliance First */}
            <div style={{
              background: "rgba(13, 17, 30, 0.7)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(168, 85, 247, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A855F7",
                flexShrink: 0
              }}>
                <Scale size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>Compliance First</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", marginTop: 4, lineHeight: 1.4 }}>
                  All complaints are handled in accordance with applicable laws and our internal compliance policies.
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: FILE NEW COMPLAINT 4-STEP WIZARD
         ───────────────────────────────────────────────────────────── */}
      {fileModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 640,
            background: "#0C111E",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(124,58,237,0.25)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF"
                }}>
                  <Plus size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF" }}>File a Complaint — Step {wizardStep} of 4</div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)" }}>Report any issue with the 36 autonomous AI agents & ecosystem projects</div>
                </div>
              </div>
              <X
                size={18}
                color="#94A3B8"
                style={{ cursor: "pointer" }}
                onClick={() => setFileModalOpen(false)}
              />
            </div>

            {/* Modal Step Indicators */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              {[
                { step: 1, label: "Select Product" },
                { step: 2, label: "Describe Issue" },
                { step: 3, label: "Upload Evidence" },
                { step: 4, label: "Review & Submit" },
              ].map(s => (
                <div
                  key={s.step}
                  onClick={() => setWizardStep(s.step)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: wizardStep === s.step ? 700 : 500,
                    color: wizardStep === s.step ? "#A855F7" : "rgba(148,163,184,0.6)",
                    borderBottom: wizardStep === s.step ? "2px solid #A855F7" : "none",
                    cursor: "pointer"
                  }}
                >
                  {s.step}. {s.label}
                </div>
              ))}
            </div>

            {/* Modal Body: Switch by Step */}
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>

              {/* STEP 1: SELECT PRODUCT */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>Select AI Agent / Product:</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                    {aiAgents.map(agent => {
                      const isSelected = newComplaintForm.product_id === agent.id;
                      return (
                        <div
                          key={agent.id}
                          onClick={() => setNewComplaintForm(prev => ({ ...prev, product_id: agent.id, product: agent.name }))}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: isSelected ? "rgba(124, 58, 237, 0.2)" : "rgba(255,255,255,0.03)",
                            border: isSelected ? "2px solid #7C3AED" : "1px solid rgba(255,255,255,0.06)",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            {renderAgentIcon(agent.icon, agent.color, 16)}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>{agent.name}</div>
                            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.6)" }}>{agent.category}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: DESCRIBE ISSUE */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>
                      Issue Category:
                    </label>
                    <select
                      value={newComplaintForm.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setNewComplaintForm(prev => ({ ...prev, category: cat, issue_type: cat.replace(/s$/, '') }));
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#FFFFFF",
                        fontSize: 12,
                        outline: "none"
                      }}
                    >
                      <option value="Performance Issues" style={{ background: "#0C111E" }}>Performance Issues (Latency, Timeout, Scaling)</option>
                      <option value="Data & Accuracy" style={{ background: "#0C111E" }}>Data & Accuracy (Hallucination, Misclassification)</option>
                      <option value="Billing & Payments" style={{ background: "#0C111E" }}>Billing & Payments (Credit Deduction, Duplicate Invoice)</option>
                      <option value="Security & Privacy" style={{ background: "#0C111E" }}>Security & Privacy (Key Rotation, HIPAA/GDPR)</option>
                      <option value="Feature & Functionality" style={{ background: "#0C111E" }}>Feature & Functionality (Broken Export, API Error)</option>
                      <option value="Other Issues" style={{ background: "#0C111E" }}>Other Issues</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>
                      Priority Level:
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["Low", "Medium", "High"].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewComplaintForm(prev => ({ ...prev, priority: p }))}
                          style={{
                            flex: 1,
                            padding: "8px 0",
                            borderRadius: 8,
                            background: newComplaintForm.priority === p ? (p === "High" ? "rgba(239,68,68,0.2)" : p === "Medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)") : "rgba(255,255,255,0.03)",
                            border: newComplaintForm.priority === p ? `2px solid ${p === "High" ? "#EF4444" : p === "Medium" ? "#F59E0B" : "#10B981"}` : "1px solid rgba(255,255,255,0.08)",
                            color: newComplaintForm.priority === p ? "#FFF" : "rgba(148,163,184,0.8)",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>
                      Detailed Technical Description:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Explain what happened, expected behavior vs actual outcome..."
                      value={newComplaintForm.description}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#FFFFFF",
                        fontSize: 12,
                        outline: "none",
                        resize: "vertical"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOAD EVIDENCE */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>Attach Logs, Screenshots, or Invoices:</div>
                  <div
                    onClick={() => {
                      setNewComplaintForm(prev => ({
                        ...prev,
                        evidence_files: [...prev.evidence_files, `evidence_log_${Date.now().toString().slice(-4)}.log`]
                      }));
                      notify("Simulated evidence file attached!", "", "info");
                    }}
                    style={{
                      border: "2px dashed rgba(168, 85, 247, 0.4)",
                      borderRadius: 12,
                      padding: "30px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "rgba(168, 85, 247, 0.05)"
                    }}
                  >
                    <Upload size={28} color="#A855F7" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>Click to Upload or Drag Files Here</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", marginTop: 4 }}>
                      Supports PNG, JPG, PDF, TXT, LOG, CSV up to 25MB
                    </div>
                  </div>

                  {newComplaintForm.evidence_files.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.8)" }}>Attached Files:</div>
                      {newComplaintForm.evidence_files.map((file, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, fontSize: 11 }}>
                          <span>📄 {file}</span>
                          <span style={{ color: "#10B981", fontWeight: 700 }}>Ready</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>
                      Real User Feedback / Desired Resolution:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please rebalance GPU memory and refund 500 AI credits."
                      value={newComplaintForm.user_feedback}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, user_feedback: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        color: "#FFFFFF",
                        fontSize: 12,
                        outline: "none"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {wizardStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>Review Complaint Summary:</div>
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(148,163,184,0.7)" }}>Product:</span>
                      <strong style={{ color: "#FFF" }}>{newComplaintForm.product}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(148,163,184,0.7)" }}>Category:</span>
                      <strong style={{ color: "#A855F7" }}>{newComplaintForm.category}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(148,163,184,0.7)" }}>Priority:</span>
                      <strong style={{ color: newComplaintForm.priority === "High" ? "#EF4444" : "#F59E0B" }}>{newComplaintForm.priority}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6 }}>
                      <span style={{ color: "rgba(148,163,184,0.7)" }}>Description:</span>
                      <span style={{ color: "#E2E8F0" }}>{newComplaintForm.description || "No description specified"}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Navigation Buttons */}
            <div style={{
              padding: "14px 20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <button
                type="button"
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                disabled={wizardStep === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: wizardStep === 1 ? "rgba(148,163,184,0.3)" : "#FFF",
                  fontSize: 12,
                  cursor: wizardStep === 1 ? "not-allowed" : "pointer"
                }}
              >
                Back
              </button>

              {wizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(prev => Math.min(4, prev + 1))}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFileComplaintSubmit}
                  disabled={submittingComplaint}
                  style={{
                    padding: "8px 22px",
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: submittingComplaint ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Check size={14} /> {submittingComplaint ? "Submitting..." : "Submit Complaint"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: COMPLAINT DETAILS & INVESTIGATION DRAWER
         ───────────────────────────────────────────────────────────── */}
      {activeComplaintDetails && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 680,
            background: "#0C111E",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF" }}>{activeComplaintDetails.id}</span>
                <span style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  background: activeComplaintDetails.status === "Resolved" ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.2)",
                  border: `1px solid ${activeComplaintDetails.status === "Resolved" ? "#10B981" : "#3B82F6"}`,
                  color: activeComplaintDetails.status === "Resolved" ? "#34D399" : "#60A5FA",
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  {activeComplaintDetails.status}
                </span>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#EF4444",
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  {activeComplaintDetails.priority} Priority
                </span>
              </div>
              <X
                size={18}
                color="#94A3B8"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveComplaintDetails(null)}
              />
            </div>

            {/* Body */}
            <div style={{ padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Product Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {renderAgentIcon(activeComplaintDetails.product_icon, activeComplaintDetails.product_color || "#A855F7", 20)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>{activeComplaintDetails.product}</div>
                  <div style={{ fontSize: 11, color: "#A855F7", fontWeight: 600 }}>{activeComplaintDetails.issue_type} • {activeComplaintDetails.category}</div>
                </div>
              </div>

              {/* User Feedback */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.8)", marginBottom: 4 }}>👤 Real User Feedback:</div>
                <div style={{ fontSize: 12.5, color: "#FFFFFF", lineHeight: 1.45 }}>"{activeComplaintDetails.user_feedback}"</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", marginTop: 6 }}>
                  Reported by <strong>{activeComplaintDetails.user_name || "Arjun Sharma"}</strong> ({activeComplaintDetails.user_email || "user@enterprise.io"}) on {activeComplaintDetails.date}
                </div>
              </div>

              {/* AI Agent Triage Response */}
              <div style={{ background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#D8B4FE", marginBottom: 4 }}>🤖 Autonomous AI Agent Diagnostic Response:</div>
                <div style={{ fontSize: 12.5, color: "#F1F5F9", lineHeight: 1.45 }}>{activeComplaintDetails.agent_response}</div>
                <div style={{ fontSize: 10, color: "rgba(216,180,254,0.7)", marginTop: 6 }}>
                  Assigned Legal Arbiter: <strong>{activeComplaintDetails.assigned_to || "Sarah Jenkins (Lead Officer)"}</strong>
                </div>
              </div>

              {/* Change Status Controls */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(148,163,184,0.8)", marginBottom: 8 }}>Take Resolution Action:</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Open", "In Review", "Resolved", "Escalated"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      disabled={updatingStatus || activeComplaintDetails.status === st}
                      style={{
                        flex: 1,
                        padding: "7px 0",
                        borderRadius: 6,
                        background: activeComplaintDetails.status === st ? "#6E56FF" : "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: activeComplaintDetails.status === st ? "#FFF" : "rgba(148,163,184,0.8)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: activeComplaintDetails.status === st ? "default" : "pointer"
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: 36 AI AGENTS & USER FEEDBACK MATRIX
         ───────────────────────────────────────────────────────────── */}
      {aiAgentsModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 780,
            background: "#0C111E",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF"
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF" }}>36 AI Agents Health & Real User Feedback Matrix</div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)" }}>Ecosystem telemetry, complaints distribution, and live sentiment</div>
                </div>
              </div>
              <X
                size={18}
                color="#94A3B8"
                style={{ cursor: "pointer" }}
                onClick={() => setAiAgentsModalOpen(false)}
              />
            </div>

            <div style={{ padding: 20, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {aiAgents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {renderAgentIcon(agent.icon, agent.color, 15)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>{agent.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#10B981" }}>{agent.health}% Health</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "rgba(148,163,184,0.75)" }}>
                    <span>{agent.category}</span>
                    <span>{agent.total_users?.toLocaleString()} Users</span>
                    <span>⭐ {agent.rating}/5.0</span>
                  </div>

                  {agent.recent_feedback?.length > 0 && (
                    <div style={{ fontSize: 10.5, color: "rgba(226,232,240,0.8)", fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6 }}>
                      "{agent.recent_feedback[0]}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: CONTACT LEGAL TEAM
         ───────────────────────────────────────────────────────────── */}
      {contactTeamModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            width: "100%",
            maxWidth: 500,
            background: "#0C111E",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF" }}>Contact Senior Legal Team</div>
              <X size={18} color="#94A3B8" style={{ cursor: "pointer" }} onClick={() => setContactTeamModalOpen(false)} />
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>Subject:</label>
                <input
                  type="text"
                  placeholder="e.g. Model IP Compliance Clarification"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#FFF", fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(148,163,184,0.9)", display: "block", marginBottom: 6 }}>Message to Legal Arbiter:</label>
                <textarea
                  rows={4}
                  placeholder="Detail your inquiry or regulatory question..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#FFF", fontSize: 12 }}
                />
              </div>

              <button
                type="button"
                onClick={handleContactSubmit}
                disabled={contactSubmitting}
                style={{
                  marginTop: 6,
                  padding: "10px 0",
                  background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFF",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {contactSubmitting ? "Dispatching..." : "Send Priority Legal Inquiry"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
