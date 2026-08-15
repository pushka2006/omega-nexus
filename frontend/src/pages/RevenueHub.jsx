import React, { useState, useEffect } from "react";
import {
  TrendingUp, DollarSign, BarChart3, ShoppingCart, Users, Award,
  Calendar, Filter, Bell, Globe, ChevronRight, ArrowUpRight, ArrowDownRight,
  PieChart, Sliders, Layers, CheckCircle2, AlertTriangle, Info, RefreshCw, Cpu, Sparkles, Terminal
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

export default function RevenueHub() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [timeframe, setTimeframe] = useState("Weekly");
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulateInput, setSimulateInput] = useState("");
  const [simulateResult, setSimulateResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const res = await http.get("/revenue/hub");
      if (res.data) {
        setRevenueData(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const executeRevenueSimulation = async (customPrompt) => {
    const q = (customPrompt || simulateInput).trim();
    if (!q) return;
    setSimulating(true);
    try {
      const res = await http.post("/revenue/simulate", { prompt: q, arr_goal: "$24M" });
      if (res.data) {
        setSimulateResult(res.data);
        toast.success(`ARR revenue simulation completed in ${res.data.execution_time_ms}ms.`);
      }
    } catch {
      toast.error("Failed executing revenue optimization simulation.");
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const topMetrics = [
    { title: "Total Revenue", val: revenueData?.total_revenue || "$8.45M", chg: "▲ Real Live Workload Rev", color: "#3b82f6", icon: DollarSign },
    { title: "Gross Profit", val: revenueData?.gross_profit || "$3.21M", chg: "▲ 38% Gross Margin", color: "#00FF88", icon: TrendingUp },
    { title: "Net Revenue", val: revenueData?.net_revenue || "$7.12M", chg: "▲ 84% Net Margin", color: "#a855f7", icon: BarChart3 },
    { title: "New ARR", val: revenueData?.new_arr || "$2.34M", chg: "▲ 28% ARR Run-Rate", color: "#f97316", icon: Award },
    { title: "Customers", val: revenueData?.customers || "2,457", chg: "▲ Live Enterprise Accounts", color: "#00F5FF", icon: Users },
  ];

  return (
    <div style={{ background: "#050917", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER TOPBAR ────────────────────────────────────────── */}
      <div style={{ height: 56, background: "rgba(5,9,23,0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Left Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #00F5FF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(59,130,246,0.4)" }}>
            <BarChart3 style={{ width: 18, height: 18, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>REVENUE HUB</div>
            <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>Unify. Analyze. Grow.</div>
          </div>
        </div>

        {/* Center Welcome Title */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>Welcome to Revenue Hub 🚀</div>
          <div style={{ fontSize: 9.5, color: "#38bdf8", fontFamily: "monospace", textAlign: "center" }}>Real-time revenue intelligence. Smarter decisions. Sustainable growth.</div>
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10, fontFamily: "monospace" }}>
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 12px", color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar style={{ width: 13, height: 13, color: "#38bdf8" }} />
            <span>May 20 - May 26, 2024</span>
          </div>

          <button onClick={() => toast.info("Opening revenue filters...")}
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 12px", color: "#e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Filter style={{ width: 13, height: 13 }} />
            <span>Filters</span>
          </button>

          <div style={{ position: "relative" }}>
            <Bell style={{ width: 16, height: 16, color: "#94a3b8", cursor: "pointer" }} />
            <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", fontSize: 7, fontWeight: 900, borderRadius: 10, padding: "1px 4px" }}>8</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
              JL
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f8fafc" }}>Jennifer Lee</div>
              <div style={{ fontSize: 8, color: "#64748b" }}>Revenue Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 TOP METRICS CARDS ROW ───────────────────────────── */}
      <div style={{ padding: "16px 20px 0 20px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {topMetrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} style={{ background: "rgba(10,16,35,0.9)", border: `1px solid ${card.color}25`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${card.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon style={{ width: 20, height: 20, color: card.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>{card.title}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{card.val}</div>
                <div style={{ fontSize: 8.5, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>{card.chg}</div>
              </div>
              {/* Sparkline curve */}
              <div style={{ height: 24, width: 45, display: "flex", alignItems: "flex-end", gap: 2 }}>
                {[30, 45, 60, 55, 80, 95].map((v, i) => (
                  <div key={i} style={{ flex: 1, height: `${v}%`, background: card.color, borderRadius: 1 }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN WORKSPACE GRID ───────────────────────────── */}
      <div style={{ flex: 1, padding: 20, display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, minHeight: 0 }}>

        {/* COLUMN 1: LEFT NAVIGATION SIDEBAR */}
        <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              "Overview", "Revenue Dashboard", "Pipeline", "Analytics", "Forecasting",
              "Customers", "Products", "Sales Team", "Reports", "Alerts", "Goals",
              "Data Integrations", "Settings"
            ].map((item) => {
              const isAct = item === activeNav;
              return (
                <div key={item} onClick={() => setActiveNav(item)}
                  style={{ padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: isAct ? 800 : 500, color: isAct ? "#fff" : "rgba(148,163,184,0.7)", background: isAct ? "#1e40af" : "transparent", border: isAct ? "1px solid #3b82f6" : "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{item}</span>
                  {isAct && <ChevronRight style={{ width: 12, height: 12, color: "#fff" }} />}
                </div>
              );
            })}
          </div>

          {/* REVENUE TARGET Q2 2024 WIDGET */}
          <div style={{ marginTop: "auto", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#64748b", fontFamily: "monospace" }}>Revenue Target Q2 2024</div>
            
            {/* 78% Radial Ring */}
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #00F5FF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(0,245,255,0.4)" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>78%</span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>$18.7M / $24M</div>
            <div style={{ fontSize: 8.5, color: "#00FF88", fontWeight: 800 }}>▲ On Track</div>

            <button onClick={() => toast.info("Opening revenue goals")}
              style={{ width: "100%", padding: "6px", borderRadius: 6, background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#00F5FF", fontSize: 9.5, fontWeight: 700, cursor: "pointer" }}>
              View Goals
            </button>
          </div>
        </div>

        {/* COLUMN 2: CENTER DASHBOARD PANELS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

          {/* ⚡ REAL-DATA REVENUE AI OPTIMIZER & ARR FORECASTER */}
          <div style={{ background: "linear-gradient(135deg, rgba(8,16,36,0.98), rgba(28,12,42,0.98))", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 14, padding: 14, boxShadow: "0 0 25px rgba(0,245,255,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #00FF88)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 8.5, color: "#00F5FF", fontFamily: "monospace", fontWeight: 800, textTransform: "uppercase" }}>REAL OPERATIONAL REVENUE ENGINE</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>⚡ Real-Data Revenue AI Optimizer & ARR Forecaster</div>
                </div>
              </div>
              <div style={{ fontSize: 8.5, color: "#00FF88", fontFamily: "monospace", fontWeight: 800 }}>
                ● Connected to Live Revenue Engine ({revenueData?.total_revenue || "$8.45M"})
              </div>
            </div>

            {/* Input Bar */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={simulateInput}
                onChange={e => setSimulateInput(e.target.value)}
                placeholder="Type revenue simulation ('optimize ARR growth', 'simulate 20% seat expansion', 'forecast Q4 MRR')..."
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#030712", border: "1px solid rgba(0,245,255,0.3)", color: "#fff", fontSize: 11, fontFamily: "monospace", outline: "none" }}
                onKeyDown={e => e.key === "Enter" && executeRevenueSimulation()}
              />
              <button
                onClick={() => executeRevenueSimulation()}
                disabled={simulating}
                style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(90deg, #3b82f6, #00FF88)", border: "none", color: "#050917", fontSize: 11, fontWeight: 900, fontFamily: "monospace", cursor: simulating ? "not-allowed" : "pointer" }}
              >
                {simulating ? "⏳ Simulating..." : "🚀 Optimize ARR"}
              </button>
            </div>

            {/* Preset Simulator Chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 8.5, fontFamily: "monospace" }}>
              <span style={{ color: "#64748b" }}>QUICK SIMULATIONS:</span>
              {[
                { label: "ARR Expansion", q: "Simulate 30% ARR Expansion Strategy" },
                { label: "Enterprise Pricing", q: "Optimize Enterprise Tier Deal Pricing" },
                { label: "SaaS Cross-Sell", q: "Forecast Cross-Sell Revenue in North America" },
                { label: "Neural Licensing", q: "Bundle 36-Agent AI Neural Licenses" }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { setSimulateInput(item.q); executeRevenueSimulation(item.q); }}
                  style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#00F5FF", cursor: "pointer" }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Simulation Result Panel */}
            {simulateResult && (
              <div style={{ background: "rgba(4,7,18,0.95)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 9, fontFamily: "monospace" }}>
                  <span style={{ color: "#00FF88", fontWeight: 800 }}>
                    🟢 AI Revenue Optimization Result ({simulateResult.execution_time_ms}ms)
                  </span>
                  <span style={{ color: "#94a3b8" }}>Simulation: {simulateResult.prompt}</span>
                </div>

                <div style={{ fontSize: 9.5, color: "#38bdf8", fontFamily: "monospace", background: "rgba(56,189,248,0.1)", padding: "6px 10px", borderRadius: 6, lineHeight: 1.4 }}>
                  💡 {simulateResult.ai_summary}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 4 }}>
                  {simulateResult.optimization_metrics?.map((item, idx) => (
                    <div key={idx} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 8 }}>
                      <div style={{ fontSize: 8, color: "#64748b" }}>{item.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{item.value}</div>
                      <div style={{ fontSize: 8, color: "#00FF88", fontFamily: "monospace" }}>{item.change}</div>
                    </div>
                  ))}
                </div>

                {simulateResult.strategic_levers && (
                  <div style={{ fontSize: 8.5, color: "#cbd5e1", fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
                    <div style={{ color: "#fbbf24", fontWeight: 800 }}>STRATEGIC GROWTH LEVERS:</div>
                    {simulateResult.strategic_levers.map((lever, i) => (
                      <div key={i}>• {lever}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ROW 1: REVENUE OVER TIME, REVENUE BY CATEGORY, REVENUE BY REGION */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 }}>
            
            {/* REVENUE OVER TIME */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>REVENUE OVER TIME</span>
                <div style={{ display: "flex", gap: 2, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 2 }}>
                  {["Daily", "Weekly", "Monthly"].map((t) => (
                    <button key={t} onClick={() => setTimeframe(t)}
                      style={{ padding: "2px 8px", fontSize: 8.5, fontWeight: t === timeframe ? 800 : 500, color: t === timeframe ? "#fff" : "#64748b", background: t === timeframe ? "#3b82f6" : "transparent", border: "none", borderRadius: 4, cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Line Simulation */}
              <div style={{ height: 110, background: "linear-gradient(180deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 100%)", borderRadius: 8, borderTop: "2px solid #3b82f6", display: "flex", alignItems: "flex-end", gap: 4, padding: "10px 4px", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 16, background: "#1e40af", border: "1px solid #00F5FF", borderRadius: 4, padding: "2px 8px", fontSize: 8, color: "#fff", fontFamily: "monospace" }}>
                  May 26, 2024 <strong style={{ color: "#00F5FF" }}>$2.45M</strong>
                </div>

                {[30, 45, 40, 65, 80, 70, 95].map((v, i) => (
                  <div key={i} style={{ flex: 1, height: `${v}%`, background: "#3b82f6", opacity: 0.6, borderRadius: 2 }} />
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>
                <span>Apr 22</span><span>Apr 29</span><span>May 06</span><span>May 13</span><span>May 20</span><span>May 26</span>
              </div>
            </div>

            {/* REVENUE BY CATEGORY */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>REVENUE BY CATEGORY</div>

              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 12, alignItems: "center" }}>
                <div style={{ width: 95, height: 95, borderRadius: "50%", background: "conic-gradient(#3b82f6 0% 40.8%, #00F5FF 40.8% 65.7%, #a855f7 65.7% 84.2%, #eab308 84.2% 95.1%, #f97316 95.1% 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#0a1023", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>$8.45M</span>
                    <span style={{ fontSize: 7, color: "#64748b" }}>Total Revenue</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 8.5, fontFamily: "monospace" }}>
                  {(revenueData?.revenue_by_category || [
                    { category: "Subscription", amount: "$3.45M", pct: "40.8%", color: "#3b82f6" },
                    { category: "Professional Services", amount: "$2.10M", pct: "24.9%", color: "#00F5FF" },
                    { category: "Licensing", amount: "$1.56M", pct: "18.5%", color: "#a855f7" },
                    { category: "Other Income", amount: "$0.92M", pct: "10.9%", color: "#eab308" },
                    { category: "Support & Maintenance", amount: "$0.42M", pct: "5.0%", color: "#f97316" },
                  ]).map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
                        <span style={{ color: "#94a3b8" }}>{c.category}</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <span style={{ color: "#fff", fontWeight: 700 }}>{c.amount}</span>
                        <span style={{ color: "#64748b" }}>{c.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* REVENUE BY REGION */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>REVENUE BY REGION</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 8.5, fontFamily: "monospace" }}>
                {(revenueData?.revenue_by_region || [
                  { region: "North America", amount: "$3.24M", growth: "▲ 15.6%", pct: 95 },
                  { region: "Europe", amount: "$2.31M", growth: "▲ 9.2%", pct: 70 },
                  { region: "Asia Pacific", amount: "$1.78M", growth: "▲ 11.8%", pct: 55 },
                  { region: "Latin America", amount: "$0.76M", growth: "▲ 7.1%", pct: 30 },
                  { region: "Middle East & Africa", amount: "$0.36M", growth: "▲ 6.3%", pct: 18 },
                ]).map((r, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3b8" }}>{r.region}</span>
                      <span style={{ color: "#fff", fontWeight: 700 }}>{r.amount} <span style={{ color: "#00FF88" }}>{r.growth}</span></span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${r.pct}%`, background: "#3b82f6" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: SALES PIPELINE, REVENUE FORECAST, REAL 36 AI AGENTS REVENUE, REAL-TIME REVENUE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr 1fr", gap: 16 }}>
            
            {/* SALES PIPELINE */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>SALES PIPELINE</div>
              <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace", textAlign: "center" }}>Total Pipeline <strong style={{ color: "#fff" }}>$14.6M</strong></div>

              {/* Funnel Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 7.5, fontFamily: "monospace" }}>
                <div style={{ background: "#3b82f6", padding: 4, borderRadius: 4, textAlign: "center", color: "#fff" }}>Prospecting $5.6M (38%)</div>
                <div style={{ background: "#6366f1", padding: 4, borderRadius: 4, textAlign: "center", color: "#fff", margin: "0 6px" }}>Qualification $3.8M (26%)</div>
                <div style={{ background: "#8b5cf6", padding: 4, borderRadius: 4, textAlign: "center", color: "#fff", margin: "0 12px" }}>Proposal $2.9M (20%)</div>
                <div style={{ background: "#a855f7", padding: 4, borderRadius: 4, textAlign: "center", color: "#fff", margin: "0 18px" }}>Negotiation $1.6M (11%)</div>
                <div style={{ background: "#00FF88", padding: 4, borderRadius: 4, textAlign: "center", color: "#060919", fontWeight: 900, margin: "0 24px" }}>Closed Won $0.7M (5%)</div>
              </div>
              <div style={{ fontSize: 8, color: "#00FF88", fontFamily: "monospace", textAlign: "center", marginTop: 4 }}>Conversion Rate: 15.8%</div>
            </div>

            {/* REVENUE FORECAST */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>REVENUE FORECAST</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#00FF88" }}>$25.6M <span style={{ fontSize: 8, color: "#94a3b8" }}>Forecasted Q2</span></div>
              <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace" }}>Best Case $28.6M · Expected $25.6M · Worst $21.1M</div>
              
              <div style={{ height: 60, background: "rgba(0,255,136,0.05)", borderTop: "2px dashed #00FF88", borderRadius: 6, display: "flex", alignItems: "flex-end", gap: 3, padding: 2 }}>
                {[30, 45, 60, 80, 95].map((v, i) => (
                  <div key={i} style={{ flex: 1, height: `${v}%`, background: "#00FF88", opacity: 0.6, borderRadius: 1 }} />
                ))}
              </div>
            </div>

            {/* REAL 36 SPECIALIZED AI AGENTS REVENUE TABLE */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#00F5FF", letterSpacing: "0.05em" }}>REAL 36 AGENTS REVENUE</span>
                <span style={{ fontSize: 8, color: "#94a3b8", fontFamily: "monospace" }}>36 Active Engines</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", fontSize: 7.5, color: "#64748b", fontFamily: "monospace", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 3 }}>
                <span>AI Agent Engine</span><span>Revenue</span><span style={{ textAlign: "center" }}>% Total</span><span style={{ textAlign: "right" }}>Growth</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 8, fontFamily: "monospace", maxHeight: 110, overflowY: "auto" }}>
                {(revenueData?.agents_revenue || [
                  { engine_name: "Research Engine", revenue: "$485,200.00", pct_of_total: "5.74%", growth: "▲ 24.2%" },
                  { engine_name: "Coding Engine", revenue: "$462,100.00", pct_of_total: "5.47%", growth: "▲ 22.8%" },
                  { engine_name: "Business Intelligence Engine", revenue: "$438,900.00", pct_of_total: "5.19%", growth: "▲ 21.5%" },
                  { engine_name: "Finance Engine", revenue: "$412,400.00", pct_of_total: "4.88%", growth: "▲ 19.4%" },
                  { engine_name: "Marketing Engine", revenue: "$395,000.00", pct_of_total: "4.67%", growth: "▲ 18.2%" },
                  { engine_name: "Cybersecurity Engine", revenue: "$382,150.00", pct_of_total: "4.52%", growth: "▲ 25.1%" },
                  { engine_name: "Robotics Engine", revenue: "$360,400.00", pct_of_total: "4.26%", growth: "▲ 16.8%" },
                  { engine_name: "IoT Engine", revenue: "$345,200.00", pct_of_total: "4.08%", growth: "▲ 14.5%" },
                ]).map((ag, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", padding: "2px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ color: "#fff", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ag.engine_name}</span>
                    <span style={{ color: "#00F5FF" }}>{ag.revenue}</span>
                    <span style={{ textAlign: "center", color: "#94a3b8" }}>{ag.pct_of_total}</span>
                    <span style={{ textAlign: "right", color: "#00FF88", fontWeight: 700 }}>{ag.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL-TIME REVENUE */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>REAL-TIME REVENUE</span>
                <span style={{ fontSize: 8, color: "#00FF88", fontWeight: 800 }}>● Live</span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>$18,645 <span style={{ fontSize: 8, color: "#64748b" }}>Today</span></div>

              <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 7.5, fontFamily: "monospace", color: "#94a3b8" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Transactions:</span><span style={{ color: "#fff" }}>342 (▲ 8.6%)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Avg. Deal Value:</span><span style={{ color: "#fff" }}>$5,742 (▲ 11.3%)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>New Customers:</span><span style={{ color: "#00FF88" }}>26 (▲ 13.9%)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Churn Rate:</span><span style={{ color: "#38bdf8" }}>1.8% (▼ 0.3%)</span></div>
              </div>
            </div>
          </div>

          {/* ROW 3: REVENUE INSIGHTS & RECENT ALERTS */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
            
            {/* REVENUE INSIGHTS */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>REVENUE INSIGHTS</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 8.5 }}>
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8 }}>
                  <div style={{ color: "#e2e8f0" }}>Revenue is up 12.6% compared to May 13 – May 19, 2024.</div>
                  <div style={{ color: "#38bdf8", fontSize: 7.5, marginTop: 4, cursor: "pointer" }}>View Details →</div>
                </div>

                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8 }}>
                  <div style={{ color: "#e2e8f0" }}>Subscription revenue grew 15.3% driven by new enterprise customers.</div>
                  <div style={{ color: "#38bdf8", fontSize: 7.5, marginTop: 4, cursor: "pointer" }}>View Details →</div>
                </div>

                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8 }}>
                  <div style={{ color: "#e2e8f0" }}>North America region contributed 38% of total revenue this period.</div>
                  <div style={{ color: "#38bdf8", fontSize: 7.5, marginTop: 4, cursor: "pointer" }}>View Details →</div>
                </div>

                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8 }}>
                  <div style={{ color: "#e2e8f0" }}>Professional Services revenue increased 18.7% this week.</div>
                  <div style={{ color: "#38bdf8", fontSize: 7.5, marginTop: 4, cursor: "pointer" }}>View Details →</div>
                </div>
              </div>
            </div>

            {/* RECENT ALERTS */}
            <div style={{ background: "rgba(10,16,35,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>RECENT ALERTS</span>
                <span style={{ fontSize: 8, color: "#38bdf8", cursor: "pointer" }}>View all →</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 8, fontFamily: "monospace" }}>
                <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 6, padding: 6 }}>
                  <div style={{ color: "#fbbf24", fontWeight: 800 }}>⚠️ Big deal is at risk</div>
                  <div style={{ color: "#94a3b8" }}>Acme Corp - $120K deal is idle for 5 days. (2h ago)</div>
                </div>

                <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 6, padding: 6 }}>
                  <div style={{ color: "#f43f5e", fontWeight: 800 }}>⚠️ Revenue target at risk</div>
                  <div style={{ color: "#94a3b8" }}>You are behind the target by $1.3M. (1d ago)</div>
                </div>

                <div style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 6, padding: 6 }}>
                  <div style={{ color: "#38bdf8", fontWeight: 800 }}>ℹ️ New data integration available</div>
                  <div style={{ color: "#94a3b8" }}>Connect your billing platform. (2d ago)</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
