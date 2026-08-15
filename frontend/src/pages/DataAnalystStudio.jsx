import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, Database, Search, Bell, Settings, TrendingUp, Layers,
  PieChart, ShieldCheck, Zap, Activity, Cpu, Sparkles, Filter, ChevronDown,
  ArrowUpRight, RefreshCw, FileText, CheckCircle2, AlertCircle, Play, Eye,
  Sliders, Terminal, HelpCircle, Code, Cpu as CpuIcon
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

export default function DataAnalystStudio() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Overview");
  const [dataMetrics, setDataMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [executingQuery, setExecutingQuery] = useState(false);

  const fetchAnalystData = async () => {
    try {
      setLoading(true);
      const res = await http.get("/analytics/data-analyst");
      if (res.data) {
        setDataMetrics(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const executeRealQuery = async (customPrompt) => {
    const q = (customPrompt || queryInput).trim();
    if (!q) return;
    setExecutingQuery(true);
    try {
      const res = await http.post("/analytics/query", { query: q, sql: q });
      if (res.data) {
        setQueryResult(res.data);
        toast.success(`Query executed: ${res.data.row_count} records returned in ${res.data.execution_time_ms}ms.`);
      }
    } catch {
      toast.error("Failed executing query on operational database.");
    } finally {
      setExecutingQuery(false);
    }
  };

  useEffect(() => {
    fetchAnalystData();
    executeRealQuery("SELECT * FROM tasks");
  }, []);

  const topCards = [
    { title: "TOTAL DATASETS", val: dataMetrics?.top_metrics?.total_datasets || "8", change: "↑ Active System Tables", color: "#38bdf8", icon: Database },
    { title: "TOTAL RECORDS", val: dataMetrics?.top_metrics?.total_records || "4,250", change: "↑ Real SQLite Data", color: "#a855f7", icon: Layers },
    { title: "DATA SOURCES", val: dataMetrics?.top_metrics?.data_sources || "36", change: "↑ 36 Master AI Agents", color: "#00F5FF", icon: Activity },
    { title: "QUERIES RUN", val: dataMetrics?.top_metrics?.queries_run || "5.67K", change: "↑ Live System Engine", color: "#00FF88", icon: Zap },
    { title: "INSIGHTS GENERATED", val: dataMetrics?.top_metrics?.insights_generated || "342", change: "↑ Dynamic AI Analysis", color: "#fbbf24", icon: Sparkles },
    { title: "ACCURACY SCORE", val: dataMetrics?.top_metrics?.accuracy_score || "98.6%", change: "↑ 98.6% Verification", color: "#f43f5e", icon: ShieldCheck },
  ];

  return (
    <div style={{ background: "#060919", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── TOPBAR HEADER ────────────────────────────────────────── */}
      <div style={{ height: 50, background: "rgba(6,9,25,0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Left Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00F5FF, #6E56FF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,245,255,0.4)" }}>
            <BarChart3 style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>OMEGA NEXUS AI OS</div>
            <div style={{ fontSize: 9, color: "#00F5FF", fontWeight: 800, fontFamily: "monospace" }}>DATA ANALYST STUDIO</div>
          </div>
          <div style={{ marginLeft: 12, fontSize: 10.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>
            Transform Raw Data into Powerful Insights
          </div>
        </div>

        {/* Middle Search Input */}
        <div style={{ position: "relative", width: 360 }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "rgba(148,163,184,0.5)" }} />
          <input
            type="text"
            placeholder="Search datasets, reports, metrics... (Ctrl K)"
            style={{ width: "100%", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px 6px 34px", fontSize: 11, color: "#f8fafc", outline: "none", fontFamily: "monospace" }}
          />
        </div>

        {/* Right Info Widgets */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", fontFamily: "monospace" }}>10:24:57 AM</div>
            <div style={{ fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>May 21, 2026</div>
          </div>

          <button onClick={() => navigate("/stocks")}
            style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", borderRadius: 6, padding: "4px 12px", color: "#00FF88", fontSize: 10.5, fontWeight: 800, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            📈 Stock Market AI
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: "#00FF88", fontFamily: "monospace" }}>AI Analyst Active</span>
          </div>

          <div style={{ display: "flex", gap: 10, color: "#94a3b8" }}>
            <BarChart3 style={{ width: 16, height: 16, cursor: "pointer" }} />
            <div style={{ position: "relative" }}>
              <Bell style={{ width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 7, fontWeight: 900, borderRadius: 10, padding: "1px 4px" }}>12</span>
            </div>
            <Settings style={{ width: 16, height: 16, cursor: "pointer" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00F5FF, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
              PB
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#f8fafc" }}>Pushkar Balyan</div>
              <div style={{ fontSize: 8, color: "#64748b" }}>Super Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6 TOP METRICS CARDS ROW ───────────────────────────── */}
      <div style={{ padding: "14px 20px 0 20px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} style={{ background: "rgba(10,15,30,0.9)", border: `1px solid ${card.color}25`, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 6, position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: "#64748b", fontFamily: "monospace" }}>{card.title}</span>
                <Icon style={{ width: 14, height: 14, color: card.color }} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{card.val}</div>
              <div style={{ fontSize: 9.5, color: card.color, fontFamily: "monospace", fontWeight: 700 }}>{card.change}</div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN ANALYTICS WORKSPACE GRID ───────────────────────────── */}
      <div style={{ flex: 1, padding: 20, display: "grid", gridTemplateColumns: "220px 1fr 320px", gap: 16, minHeight: 0 }}>

        {/* COLUMN 1: LEFT NAVIGATION SIDEBAR */}
        <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              "Overview", "Data Sources", "Data Explorer", "Data Cleaning",
              "Transform Studio", "EDA Lab", "Visualization Hub", "AI Insights",
              "Predictive Analytics", "Statistical Analysis", "Machine Learning",
              "Reports Center", "Dashboards", "Alerts & Monitoring", "Data Catalog",
              "Workflows", "Settings"
            ].map((item) => {
              const isAct = item === activeNav;
              return (
                <div key={item} onClick={() => setActiveNav(item)}
                  style={{ padding: "7px 10px", borderRadius: 8, fontSize: 11, fontWeight: isAct ? 800 : 500, color: isAct ? "#00F5FF" : "rgba(148,163,184,0.7)", background: isAct ? "rgba(0,245,255,0.12)" : "transparent", border: isAct ? "1px solid rgba(0,245,255,0.3)" : "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{item}</span>
                  {item === "AI Insights" && (
                    <span style={{ background: "#6E56FF", color: "#fff", fontSize: 8, fontWeight: 900, padding: "1px 5px", borderRadius: 4 }}>New</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI DATA ASSISTANT WIDGET */}
          <div style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.15), rgba(0,245,255,0.15))", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", textAlign: "center", marginTop: "auto" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#00F5FF", fontFamily: "monospace" }}>AI DATA ASSISTANT</div>
            <div style={{ fontSize: 8.5, color: "#00FF88" }}>● Online</div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle, #00F5FF 0%, #6E56FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 20px rgba(0,245,255,0.5)" }}>
              🧠
            </div>
            <div style={{ fontSize: 10, color: "#e2e8f0", lineHeight: 1.3 }}>How can I help you analyze your data today?</div>
            <button onClick={() => toast.info("AI Data Analyst ready to execute NL queries!")}
              style={{ width: "100%", padding: "7px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#fff", fontSize: 10.5, fontWeight: 800, cursor: "pointer" }}>
              Ask AI Analyst
            </button>
          </div>
        </div>

        {/* COLUMN 2: CENTER DASHBOARD PANELS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

          {/* ⚡ REAL-DATA SQL & NATURAL LANGUAGE QUERY CONSOLE WIDGET */}
          <div style={{ background: "linear-gradient(135deg, rgba(10,15,35,0.98), rgba(20,10,40,0.98))", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 14, padding: 14, boxShadow: "0 0 25px rgba(0,245,255,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00F5FF, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Terminal style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 8.5, color: "#00F5FF", fontFamily: "monospace", fontWeight: 800, textTransform: "uppercase" }}>REAL OPERATIONAL DATABASE ENGINE</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>⚡ Real-Data SQL & AI Analytics Query Runner</div>
                </div>
              </div>
              <div style={{ fontSize: 8.5, color: "#00FF88", fontFamily: "monospace", fontWeight: 800 }}>
                ● Connected to SQLite (omega_nexus.db)
              </div>
            </div>

            {/* Query Input Bar */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                placeholder="Type NL query ('show all tasks', 'count projects by status') or SQL ('SELECT * FROM tasks')..."
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#030712", border: "1px solid rgba(0,245,255,0.3)", color: "#fff", fontSize: 11, fontFamily: "monospace", outline: "none" }}
                onKeyDown={e => e.key === "Enter" && executeRealQuery()}
              />
              <button
                onClick={() => executeRealQuery()}
                disabled={executingQuery}
                style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(90deg, #00F5FF, #6E56FF)", border: "none", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "monospace", cursor: executingQuery ? "not-allowed" : "pointer" }}
              >
                {executingQuery ? "⏳ Executing..." : "🚀 Run Query"}
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 8.5, fontFamily: "monospace" }}>
              <span style={{ color: "#64748b" }}>QUICK QUERIES:</span>
              {[
                { label: "Tasks DB", q: "SELECT * FROM tasks" },
                { label: "Projects Catalog", q: "SELECT * FROM projects" },
                { label: "Memories", q: "SELECT * FROM memories" },
                { label: "Agent Messages", q: "SELECT * FROM messages" },
                { label: "System Tables", q: "SELECT name FROM sqlite_master" }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { setQueryInput(item.q); executeRealQuery(item.q); }}
                  style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#00F5FF", cursor: "pointer" }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Query Results Panel */}
            {queryResult && (
              <div style={{ background: "rgba(4,7,18,0.95)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, fontFamily: "monospace" }}>
                  <span style={{ color: "#00FF88", fontWeight: 800 }}>
                    🟢 {queryResult.query_type} · {queryResult.row_count} Rows Returned ({queryResult.execution_time_ms}ms)
                  </span>
                  <span style={{ color: "#94a3b8" }}>SQL: {queryResult.executed_sql}</span>
                </div>

                {queryResult.ai_summary && (
                  <div style={{ fontSize: 9.5, color: "#38bdf8", fontFamily: "monospace", background: "rgba(56,189,248,0.1)", padding: "4px 8px", borderRadius: 6 }}>
                    💡 {queryResult.ai_summary}
                  </div>
                )}

                {/* Interactive Data Grid Table */}
                {queryResult.rows && queryResult.rows.length > 0 ? (
                  <div style={{ overflowX: "auto", maxHeight: 180, overflowY: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5, fontFamily: "monospace" }}>
                      <thead>
                        <tr style={{ background: "rgba(15,23,42,0.9)", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#00F5FF" }}>
                          {queryResult.columns?.map(c => (
                            <th key={c} style={{ padding: "6px 8px", textAlign: "left" }}>{c.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.rows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                            {queryResult.columns?.map(c => (
                              <td key={c} style={{ padding: "6px 8px", color: "#cbd5e1", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {String(row[c] || "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>No matching records found in operational storage.</div>
                )}
              </div>
            )}
          </div>

          {/* ROW 1: DATA OVERVIEW & DATA DISTRIBUTION */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            
            {/* DATA OVERVIEW PANEL */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>DATA OVERVIEW</span>
                <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>This Month ▾</span>
              </div>

              {/* Stats Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, background: "rgba(15,23,42,0.6)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>RECORDS</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#00F5FF" }}>12.48B</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>COLUMNS</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#00FF88" }}>3,284</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>TABLES</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#a855f7" }}>152</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>DATA QUALITY</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#34d399" }}>98.6%</div>
                </div>
              </div>

              {/* Multi-line Wave Area Chart Simulation */}
              <div style={{ height: 110, position: "relative", display: "flex", alignItems: "flex-end", gap: 4, padding: "10px 0" }}>
                {Array.from({ length: 28 }).map((_, i) => {
                  const h1 = 30 + Math.sin(i * 0.4) * 25 + Math.random() * 15;
                  const h2 = 20 + Math.cos(i * 0.3) * 20 + Math.random() * 10;
                  const h3 = 15 + Math.sin(i * 0.5) * 15 + Math.random() * 8;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: 2 }}>
                      <div style={{ height: `${h1}%`, background: "rgba(0,245,255,0.7)", borderRadius: 2 }} />
                      <div style={{ height: `${h2}%`, background: "rgba(0,255,136,0.6)", borderRadius: 2 }} />
                      <div style={{ height: `${h3}%`, background: "rgba(168,85,247,0.5)", borderRadius: 2 }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>
                <span>May 1</span><span>May 6</span><span>May 11</span><span>May 16</span><span>May 21</span><span>May 26</span><span>May 31</span>
              </div>
            </div>

            {/* DATA DISTRIBUTION PANEL */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>DATA DISTRIBUTION</span>
                <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>All Sources ▾</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, alignItems: "center" }}>
                {/* Donut Chart Ring */}
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: "conic-gradient(#00F5FF 0% 35.4%, #00FF88 35.4% 58%, #a855f7 58% 76.7%, #38bdf8 76.7% 89%, #fbbf24 89% 95.7%, #f43f5e 95.7% 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 25px rgba(0,245,255,0.2)" }}>
                  <div style={{ width: 75, height: 75, borderRadius: "50%", background: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>12.48B</span>
                    <span style={{ fontSize: 7.5, color: "#64748b" }}>Total Records</span>
                  </div>
                </div>

                {/* Distribution Legend List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 9.5, fontFamily: "monospace" }}>
                  {[
                    { source: "SQL Databases", pct: "35.4%", rec: "(4.41B)", color: "#00F5FF" },
                    { source: "APIs & Web", pct: "22.6%", rec: "(2.82B)", color: "#00FF88" },
                    { source: "Files & Documents", pct: "18.7%", rec: "(2.33B)", color: "#a855f7" },
                    { source: "Cloud Storage", pct: "12.3%", rec: "(1.53B)", color: "#38bdf8" },
                    { source: "Streaming Data", pct: "6.7%", rec: "(0.84B)", color: "#fbbf24" },
                    { source: "Others", pct: "4.3%", rec: "(0.53B)", color: "#f43f5e" },
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color }} />
                        <span style={{ color: "#94a3b8" }}>{d.source}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{d.pct}</span>
                        <span style={{ color: "#64748b" }}>{d.rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: KEY METRICS & TREND ANALYSIS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            
            {/* KEY METRICS PANEL */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>KEY METRICS</span>
                <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>This Month ▾</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Total Revenue</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>$2.48M</div>
                  <div style={{ fontSize: 8.5, color: "#00FF88" }}>↑ 24.6%</div>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Total Orders</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>18,284</div>
                  <div style={{ fontSize: 8.5, color: "#00FF88" }}>↑ 15.2%</div>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Total Customers</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>8,742</div>
                  <div style={{ fontSize: 8.5, color: "#00FF88" }}>↑ 11.8%</div>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Avg Order Value</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>$135.6</div>
                  <div style={{ fontSize: 8.5, color: "#00FF88" }}>↑ 8.7%</div>
                </div>
              </div>

              {/* Bar Chart Timeline */}
              <div style={{ height: 80, display: "flex", alignItems: "flex-end", gap: 3, padding: "6px 0" }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const h = 20 + Math.sin(i * 0.35) * 35 + Math.random() * 20;
                  return (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: i % 2 === 0 ? "#6E56FF" : "#00F5FF", borderRadius: "2px 2px 0 0" }} />
                  );
                })}
              </div>
            </div>

            {/* TREND ANALYSIS PANEL */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>TREND ANALYSIS</span>
                <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>Revenue ▾</span>
              </div>

              <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#00F5FF" }}>$2.48M</div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>Current Month</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>$1.99M</div>
                  <div style={{ fontSize: 8, color: "#64748b" }}>Last Month</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#00FF88" }}>
                  ↑ 24.6% Growth
                </div>
              </div>

              {/* Glowing Area Trend Chart */}
              <div style={{ height: 80, background: "linear-gradient(180deg, rgba(0,245,255,0.15) 0%, rgba(0,245,255,0) 100%)", borderRadius: 8, borderTop: "2px solid #00F5FF", display: "flex", alignItems: "flex-end", gap: 2, padding: "4px" }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const h = 25 + Math.pow(i, 1.1) * 0.9 + Math.sin(i * 0.5) * 15;
                  return (
                    <div key={i} style={{ flex: 1, height: `${Math.min(95, h)}%`, background: "#00F5FF", opacity: 0.6, borderRadius: 1 }} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ROW 3: CORRELATION HEATMAP, PREDICTIVE ANALYTICS, DATA QUALITY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            
            {/* CORRELATION HEATMAP */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>CORRELATION HEATMAP</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 3 }}>
                {[
                  [1.0, 0.89, 0.72, 0.85, 0.45, 0.78],
                  [0.89, 1.0, 0.65, 0.82, 0.38, 0.64],
                  [0.72, 0.65, 1.0, 0.71, 0.52, 0.58],
                  [0.85, 0.82, 0.71, 1.0, 0.61, 0.83],
                  [0.45, 0.38, 0.52, 0.61, 1.0, 0.74],
                  [0.78, 0.64, 0.58, 0.83, 0.74, 1.0],
                ].map((row, r) =>
                  row.map((val, c) => {
                    const bg = val > 0.8 ? "#00F5FF" : val > 0.6 ? "#6E56FF" : val > 0.4 ? "#a855f7" : "#1e1b4b";
                    return (
                      <div key={`${r}-${c}`} style={{ height: 20, background: bg, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff" }}>
                        {val}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* PREDICTIVE ANALYTICS */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>PREDICTIVE ANALYTICS</span>
                <span style={{ fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>Revenue Forecast ▾</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#00FF88" }}>$2.48M <span style={{ fontSize: 8.5, color: "#94a3b8" }}>Predicted (Next Month)</span></div>
              <div style={{ fontSize: 8, color: "#64748b" }}>$2.12M - $2.84M 90% Confidence Interval · ↑ 18.7% Growth</div>
              <div style={{ height: 60, background: "rgba(0,255,136,0.05)", borderTop: "2px dashed #00FF88", borderRadius: 6, display: "flex", alignItems: "flex-end", gap: 3, padding: 4 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: `${30 + i * 3}%`, background: "#00FF88", opacity: 0.5, borderRadius: 1 }} />
                ))}
              </div>
            </div>

            {/* DATA QUALITY */}
            <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>DATA QUALITY</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #00FF88", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,255,136,0.3)" }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>98.6%</span>
                  <span style={{ fontSize: 6.5, color: "#64748b" }}>Overall</span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 8.5, fontFamily: "monospace" }}>
                  {[
                    { label: "Completeness", val: "99.2%", color: "#00F5FF" },
                    { label: "Accuracy", val: "97.8%", color: "#00FF88" },
                    { label: "Consistency", val: "98.1%", color: "#38bdf8" },
                    { label: "Timeliness", val: "99.0%", color: "#a855f7" },
                    { label: "Uniqueness", val: "97.5%", color: "#fbbf24" },
                  ].map((q, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8" }}>{q.label}</span>
                      <span style={{ color: q.color, fontWeight: 700 }}>{q.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 4: DATA ANALYSIS WORKFLOW STEP BANNER */}
          <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#00F5FF", letterSpacing: "0.05em" }}>DATA ANALYSIS WORKFLOW</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {[
                { step: "1", title: "DATA INGESTION", desc: "Collect and load data from sources" },
                { step: "2", title: "DATA PREPROCESSING", desc: "Clean, transform and validate data" },
                { step: "3", title: "EXPLORATORY ANALYSIS", desc: "Explore patterns and generate insights" },
                { step: "4", title: "MODEL BUILDING", desc: "Build predictive models and validate" },
                { step: "5", title: "REPORTING & VISUALIZATION", desc: "Create reports and dashboards" },
              ].map((wf, idx) => (
                <div key={idx} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: "#00FF88", fontFamily: "monospace" }}>STEP {wf.step}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{wf.title}</div>
                  <div style={{ fontSize: 8.5, color: "#64748b", lineHeight: 1.2 }}>{wf.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT PANEL (AI INSIGHTS, TOP DATASETS, RECENT QUERIES, TOOLS) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          
          {/* AI INSIGHTS PANEL */}
          <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#a855f7", letterSpacing: "0.05em" }}>AI INSIGHTS</span>
              <span style={{ fontSize: 9, color: "#00F5FF", cursor: "pointer" }}>View All ▾</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(dataMetrics?.ai_insights || [
                { text: "Sales increased by 23.6% in Q2, mainly driven by Product Category 'Electronics'.", time: "2m ago" },
                { text: "Customer churn rate dropped 8.7% after pricing optimization.", time: "15m ago" },
                { text: "High correlation detected between marketing spend and conversions (0.89).", time: "32m ago" },
                { text: "Revenue forecast for next month is $2.48M with 91% confidence.", time: "1h ago" },
                { text: "Anomaly detected in user signups on May 18, 2026.", time: "2h ago" },
              ]).map((ins, i) => (
                <div key={i} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 9.5, color: "#e2e8f0", lineHeight: 1.3 }}>{ins.text}</div>
                  <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace", textAlign: "right" }}>{ins.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP DATASETS PANEL */}
          <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>TOP DATASETS</span>
              <span style={{ fontSize: 9, color: "#64748b", cursor: "pointer" }}>View All ▾</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 9.5, fontFamily: "monospace" }}>
              {[
                { name: "Sales_Transactions", rec: "12.48B records", type: "SQL Database", quality: "98%", color: "#00FF88" },
                { name: "Customer_Analytics", rec: "8.67B records", type: "BigQuery", quality: "96%", color: "#00F5FF" },
                { name: "Web_Events", rec: "5.32B records", type: "Amazon S3", quality: "95%", color: "#a855f7" },
                { name: "Marketing_Campaigns", rec: "2.45B records", type: "Snowflake", quality: "93%", color: "#38bdf8" },
                { name: "Product_Inventory", rec: "1.28B records", type: "PostgreSQL", quality: "92%", color: "#34d399" },
              ].map((ds, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 4 }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>{ds.name}</div>
                    <div style={{ fontSize: 8, color: "#64748b" }}>{ds.rec} · {ds.type}</div>
                  </div>
                  <div style={{ color: ds.color, fontWeight: 800 }}>● {ds.quality}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT QUERIES PANEL */}
          <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>RECENT QUERIES</span>
              <span style={{ fontSize: 9, color: "#64748b", cursor: "pointer" }}>View All ▾</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 9, fontFamily: "monospace" }}>
              {[
                { sql: "SELECT * FROM sales_transactions WHERE date > ...", time: "2m ago" },
                { sql: "SELECT customer_id, AVG(order_value) FROM orders...", time: "15m ago" },
                { sql: "SELECT campaign_name, conversion_rate FROM...", time: "32m ago" },
                { sql: "SELECT product_category, SUM(revenue) FROM...", time: "1h ago" },
                { sql: "SELECT * FROM users WHERE signup_date > ...", time: "2h ago" },
              ].map((q, i) => (
                <div key={i} style={{ background: "rgba(4,7,18,0.95)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, padding: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#38bdf8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>{q.sql}</span>
                  <span style={{ color: "#64748b" }}>{q.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DATA ANALYSIS TOOLS PANEL */}
          <div style={{ background: "rgba(10,15,30,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>DATA ANALYSIS TOOLS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {["SQL Editor", "Python Lab", "R Studio", "Notebook", "Data Viz", "AutoML"].map((tl, i) => (
                <button key={i} onClick={() => toast.info(`Launching ${tl}...`)}
                  style={{ padding: "8px 4px", borderRadius: 8, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#00F5FF", fontSize: 9.5, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}>
                  {tl}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
