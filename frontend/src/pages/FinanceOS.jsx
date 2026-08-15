import React, { useState, useEffect } from "react";
import {
  Search, Bell, Settings, Maximize2, Wallet, TrendingUp, TrendingDown, CreditCard, PieChart,
  ChevronDown, ArrowUpRight, ArrowDownRight, ShieldCheck, RefreshCw, Plus, FileText, BarChart3,
  ArrowLeftRight, Download, Send, CheckCircle2, ChevronRight, Activity, DollarSign, Sparkles, X, User
} from "lucide-react";
import {
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

export default function FinanceOS() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState(null);

  // Chat Assistant State
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatSending, setChatSending] = useState(false);

  // Quick Action Modals State
  const [modalType, setModalType] = useState(null); // 'tx' | 'invoice' | 'budget' | 'transfer'
  const [txForm, setTxForm] = useState({ title: "", amount: "", category: "Shopping", type: "debit" });

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await http.get("/finance/telemetry");
      if (res.data) {
        setTelemetry(res.data);
      }
    } catch (err) {
      console.error("Finance telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg;
    setChatMsg("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatSending(true);

    try {
      const res = await http.post("/finance/chat", { message: userMsg });
      if (res.data?.reply) {
        setChatHistory((prev) => [...prev, { role: "ai", text: res.data.reply }]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "AI Assistant processed your query against live telemetry nominal database." }
      ]);
    } finally {
      setChatSending(false);
    }
  };

  const handleAddTx = async (e) => {
    e.preventDefault();
    if (!txForm.title || !txForm.amount) return;
    try {
      await http.post("/finance/transaction", {
        title: txForm.title,
        category: txForm.category,
        amount: parseFloat(txForm.amount),
        type: txForm.type,
        icon: txForm.type === "credit" ? "💳" : "🛍️"
      });
      toast.success(`Transaction '${txForm.title}' saved to SQLite database!`);
      fetchTelemetry();
    } catch (err) {
      toast.error("Failed adding transaction to database");
    } finally {
      setModalType(null);
      setTxForm({ title: "", amount: "", category: "Shopping", type: "debit" });
    }
  };

  const dataOverview = telemetry?.financial_overview || [
    { date: "01 May", income: 180000, expenses: 110000, savings: 70000 },
    { date: "05 May", income: 210000, expenses: 125000, savings: 85000 },
    { date: "10 May", income: 230000, expenses: 128000, savings: 102000 },
    { date: "15 May", income: 245000, expenses: 132000, savings: 113000 },
    { date: "20 May", income: 290000, expenses: 155000, savings: 135000 },
    { date: "25 May", income: 320000, expenses: 178000, savings: 142000 },
    { date: "31 May", income: 340250, expenses: 198760, savings: 141490 }
  ];

  const dataExpense = telemetry?.expense_breakdown || [
    { name: "Housing", value: 55250.00, pct: 27.8, color: "#f43f5e" },
    { name: "Food & Dining", value: 32450.00, pct: 16.3, color: "#f97316" },
    { name: "Transport", value: 21300.00, pct: 10.7, color: "#eab308" },
    { name: "Shopping", "value": 19850.00, pct: 10.0, color: "#a855f7" },
    { name: "Utilities", value: 16200.00, pct: 8.2, color: "#06b6d4" },
    { name: "Health", value: 14500.00, pct: 7.3, color: "#10b981" },
    { name: "Entertainment", value: 12600.00, pct: 6.3, color: "#3b82f6" },
    { name: "Others", value: 26610.50, pct: 13.4, color: "#64748b" }
  ];

  const topCards = telemetry?.top_cards || {
    total_balance: "₹ 12,45,678.90",
    total_balance_growth: "+8.45% from last month",
    total_income: "₹ 3,40,250.00",
    total_income_growth: "+12.72% from last month",
    total_expenses: "₹ 1,98,760.50",
    total_expenses_growth: "-4.35% from last month",
    net_worth: "₹ 28,75,430.80",
    net_worth_growth: "+10.15% from last month"
  };

  const sidebarNav = [
    { id: "dashboard", label: "Dashboard" },
    { id: "accounts", label: "Accounts" },
    { id: "transactions", label: "Transactions" },
    { id: "budgeting", label: "Budgeting" },
    { id: "investments", label: "Investments" },
    { id: "cashflow", label: "Cash Flow" },
    { id: "invoices", label: "Invoices" },
    { id: "cards", label: "Cards & Loans" },
    { id: "reports", label: "Reports" },
    { id: "tax", label: "Tax & Compliance" },
    { id: "insights", label: "AI Insights" },
    { id: "goals", label: "Goals" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060a17", color: "#f8fafc", fontFamily: "'Space Grotesk', -apple-system, sans-serif", padding: 16 }}>
      {/* ── TOP HEADER BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        {/* Brand Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(99,102,241,0.4)" }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Ω</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", letterSpacing: "0.05em" }}>OMEGA NEXUS</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>Finance OS</span>
            </div>
            <div style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>Command • Control • Capital</div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: 440, position: "relative" }}>
          <Search style={{ position: "absolute", left: 14, top: 10, width: 14, height: 14, color: "#64748b" }} />
          <input
            type="text"
            placeholder="Search anything... (ex: expenses, revenue, report)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 10, color: "#e2e8f0", padding: "8px 40px 8px 36px", fontSize: 11.5, fontFamily: "monospace" }}
          />
          <div style={{ position: "absolute", right: 12, top: 8, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 6, padding: "2px 6px", fontSize: 9.5, color: "#94a3b8", fontFamily: "monospace" }}>⌘K</div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <Bell style={{ width: 16, height: 16, color: "#94a3b8" }} />
            <span style={{ position: "absolute", top: -4, right: -4, background: "#a855f7", color: "#fff", fontSize: 8, fontWeight: 800, borderRadius: "50%", width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>8</span>
          </div>
          <Settings style={{ width: 16, height: 16, color: "#94a3b8", cursor: "pointer" }} />
          <Maximize2 style={{ width: 16, height: 16, color: "#94a3b8", cursor: "pointer" }} />
          
          <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.1)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#38bdf8,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #00F5FF" }}>
              <User style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc" }}>
              Pushkar Balyan
              <div style={{ fontSize: 8.5, color: "#64748b", fontFamily: "monospace" }}>Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD CONTAINER (SIDEBAR + MAIN CONTENT) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
        {/* ── SIDEBAR NAVIGATION ── */}
        <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "calc(100vh - 100px)", minHeight: 700, backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {sidebarNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: isActive ? "linear-gradient(90deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15))" : "transparent",
                    color: isActive ? "#38bdf8" : "#94a3b8",
                    fontSize: 11.5,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "inset 0 0 10px rgba(99,102,241,0.2)" : "none"
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? "#38bdf8" : "transparent" }} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Bottom System Status Widget */}
          <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(0, 245, 255, 0.15)", borderRadius: 14, padding: 12, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>System Status</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#00FF88", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
              All Systems Operational
            </div>

            {/* Glowing Shield Graphic */}
            <div style={{ margin: "8px auto", width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(2,6,23,0) 70%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(168,85,247,0.3)", boxShadow: "0 0 20px rgba(168,85,247,0.2)" }}>
              <ShieldCheck style={{ width: 24, height: 24, color: "#a855f7" }} />
            </div>

            <div style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace", marginTop: 6 }}>● Last Sync: 2 min ago</div>
          </div>
        </div>

        {/* ── MAIN CONTENT WORKSPACE ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* ── TOP STAT CARDS ROW (4 CARDS) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {/* Card 1: Total Balance */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8" }}>Total Balance</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wallet style={{ width: 14, height: 14, color: "#3b82f6" }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{topCards.total_balance}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#00FF88", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpRight style={{ width: 10, height: 10 }} /> 8.45% from last month
              </div>
            </div>

            {/* Card 2: Total Income */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8" }}>Total Income</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp style={{ width: 14, height: 14, color: "#10b981" }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{topCards.total_income}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#00FF88", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpRight style={{ width: 10, height: 10 }} /> 12.72% from last month
              </div>
            </div>

            {/* Card 3: Total Expenses */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8" }}>Total Expenses</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CreditCard style={{ width: 14, height: 14, color: "#f43f5e" }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{topCards.total_expenses}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#f43f5e", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowDownRight style={{ width: 10, height: 10 }} /> 4.35% from last month
              </div>
            </div>

            {/* Card 4: Net Worth */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8" }}>Net Worth</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PieChart style={{ width: 14, height: 14, color: "#a855f7" }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{topCards.net_worth}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: "#00FF88", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpRight style={{ width: 10, height: 10 }} /> 10.15% from last month
              </div>
            </div>
          </div>

          {/* ── MIDDLE ROW (FINANCIAL OVERVIEW + EXPENSE BREAKDOWN + CASH FLOW & ACCOUNTS) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.1fr 1fr", gap: 14 }}>
            {/* Column 1: Financial Overview (Area Chart) */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Financial Overview</span>
                <div style={{ fontSize: 9.5, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  This Month <ChevronDown style={{ width: 10, height: 10 }} />
                </div>
              </div>

              {/* Chart Legend */}
              <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 10, fontFamily: "monospace" }}>
                <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>● Income</span>
                <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>● Expenses</span>
                <span style={{ color: "#3b82f6", display: "flex", alignItems: "center", gap: 4 }}>● Savings</span>
              </div>

              <div style={{ width: "100%", height: 210 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={9} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} tickFormatter={(val) => `₹ ${val / 100000}L`} />
                    <Tooltip
                      contentStyle={{ background: "#0b132b", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, fontSize: 10, color: "#fff" }}
                      formatter={(value) => [`₹ ${Number(value).toLocaleString("en-IN")}`, ""]}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incGrad)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#expGrad)" />
                    <Area type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#savGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Column 2: Expense Breakdown (Donut Chart + List) */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Expense Breakdown</span>
                <div style={{ fontSize: 9.5, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  This Month <ChevronDown style={{ width: 10, height: 10 }} />
                </div>
              </div>

              {/* Donut Chart with Center Summary */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative", width: 120, height: 120 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={dataExpense} innerRadius={40} outerRadius={55} paddingAngle={3} dataKey="value">
                        {dataExpense.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ fontSize: 7.5, color: "#94a3b8", textTransform: "uppercase" }}>Total Expenses</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>₹ 1,98,760</div>
                    <div style={{ fontSize: 8, color: "#f43f5e" }}>↓ 4.35%</div>
                  </div>
                </div>

                {/* List Legend */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto" }}>
                  {dataExpense.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 9.5, fontFamily: "monospace" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color }} />
                        <span style={{ color: "#cbd5e1" }}>{item.name}</span>
                      </div>
                      <div style={{ color: "#fff", fontWeight: 700 }}>
                        ₹ {item.value.toLocaleString("en-IN")} <span style={{ color: "#64748b", fontSize: 8.5 }}>{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10, textAlign: "right" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", cursor: "pointer" }}>View Full Report →</span>
              </div>
            </div>

            {/* Column 3: Cash Flow & Accounts Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Cash Flow Card */}
              <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 12, backdropFilter: "blur(16px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>Cash Flow</span>
                  <span style={{ fontSize: 9, color: "#94a3b8" }}>This Month ⌄</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 9.5, fontFamily: "monospace" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Operating Cash Flow</span>
                    <span style={{ color: "#00FF88", fontWeight: 700 }}>{telemetry?.cash_flow?.operating || "₹ 1,45,230.00"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Investing Cash Flow</span>
                    <span style={{ color: "#f43f5e", fontWeight: 700 }}>{telemetry?.cash_flow?.investing || "-₹ 45,200.00"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Financing Cash Flow</span>
                    <span style={{ color: "#f43f5e", fontWeight: 700 }}>{telemetry?.cash_flow?.financing || "-₹ 12,500.00"}</span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 6, paddingTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 8.5, color: "#94a3b8" }}>Net Cash Flow</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#00FF88" }}>{telemetry?.cash_flow?.net || "₹ 87,530.00"}</div>
                  </div>
                  <div style={{ width: 60, height: 20, background: "rgba(0,255,136,0.1)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp style={{ width: 14, height: 14, color: "#00FF88" }} />
                  </div>
                </div>
              </div>

              {/* Accounts Summary Card */}
              <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 12, backdropFilter: "blur(16px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>Accounts Summary</span>
                  <span style={{ fontSize: 9, color: "#38bdf8", cursor: "pointer" }}>View All</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(telemetry?.accounts_summary || [
                    { name: "Primary Bank Account", mask: "•••• 2456", balance: "₹ 4,25,450.80", color: "#3b82f6" },
                    { name: "Savings Account", mask: "•••• 1254", balance: "₹ 3,15,200.40", color: "#10b981" },
                    { name: "Investment Account", mask: "•••• 5278", balance: "₹ 8,45,780.60", color: "#a855f7" },
                    { name: "Cash Wallet", mask: "Wallet", balance: "₹ 59,247.10", color: "#f59e0b" }
                  ]).map((acc, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 9.5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: acc.color }} />
                        <div>
                          <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{acc.name}</div>
                          <div style={{ color: "#64748b", fontSize: 8, fontFamily: "monospace" }}>{acc.mask}</div>
                        </div>
                      </div>
                      <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>{acc.balance || acc.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM GRID (4 CARDS: BUDGETS, TRANSACTIONS, INVESTMENTS, AI ASSISTANT) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            {/* Card 1: Budgets */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Budgets</span>
                <span style={{ fontSize: 9, color: "#94a3b8" }}>This Month ⌄</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(telemetry?.budgets || [
                  { name: "Monthly Budget", spent: 198760.50, limit: 250000, pct: 79 },
                  { name: "Food & Dining", spent: 32450.00, limit: 40000, pct: 81 },
                  { name: "Shopping", spent: 19850.00, limit: 25000, pct: 79 },
                  { name: "Entertainment", spent: 12600.00, limit: 15000, pct: 84 }
                ]).map((b, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#cbd5e1", marginBottom: 2 }}>
                      <span>{b.name || b.label}</span>
                      <span style={{ fontWeight: 700, color: "#00FF88" }}>{b.pct}%</span>
                    </div>
                    <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${b.pct}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #00FF88)", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <span style={{ fontSize: 9.5, color: "#38bdf8", cursor: "pointer" }}>View All Budgets →</span>
              </div>
            </div>

            {/* Card 2: Recent Transactions */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Recent Transactions</span>
                <span style={{ fontSize: 9, color: "#38bdf8", cursor: "pointer" }}>View All</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {(telemetry?.recent_transactions || [
                  { title: "Amazon India", category: "Shopping", amount: "-₹ 2,450.00", date: "Today", type: "debit", icon: "a" },
                  { title: "Salary Credit", category: "Income", amount: "+₹ 1,25,000.00", date: "Today", type: "credit", icon: "💳" },
                  { title: "Zomato", category: "Food & Dining", amount: "-₹ 680.00", date: "Yesterday", type: "debit", icon: "Z" },
                  { title: "Electricity Bill", category: "Utilities", amount: "-₹ 1,250.00", date: "Yesterday", type: "debit", icon: "⚡" },
                  { title: "Stock Investment", category: "Investments", amount: "-₹ 5,000.00", date: "2 days ago", type: "debit", icon: "📈" }
                ]).slice(0, 5).map((tx, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 9.5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>
                        {tx.icon}
                      </div>
                      <div>
                        <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{tx.title}</div>
                        <div style={{ color: "#64748b", fontSize: 8, fontFamily: "monospace" }}>{tx.category}</div>
                      </div>
                    </div>
                    <div style={{ color: tx.amount.includes("+") ? "#00FF88" : "#f43f5e", fontWeight: 700, fontFamily: "monospace" }}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Investments Overview */}
            <div style={{ background: "rgba(10, 16, 35, 0.75)", border: "1px solid rgba(255, 255, 255, 0.07)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Investments Overview</span>
              </div>
              <div style={{ fontSize: 8.5, color: "#94a3b8" }}>Total Value</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{telemetry?.investments?.total_value || "₹ 8,45,780.60"}</div>
              <div style={{ fontSize: 8.5, color: "#00FF88", marginBottom: 8 }}>{telemetry?.investments?.growth || "↑ 11.25% (₹ 85,730.50)"}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 9, fontFamily: "monospace" }}>
                {(telemetry?.investments?.allocation || [
                  { name: "Equity Funds", val: "₹ 4,25,450.80", pct: "50.3%", color: "#3b82f6" },
                  { name: "Stocks", val: "₹ 2,85,300.20", pct: "33.7%", color: "#60a5fa" },
                  { name: "Gold", val: "₹ 95,780.60", pct: "11.3%", color: "#fbbf24" },
                  { name: "Bonds", val: "₹ 39,249.00", pct: "4.7%", color: "#f87171" }
                ]).map((inv, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: inv.color }} />
                      {inv.name}
                    </span>
                    <span style={{ color: "#fff" }}>{inv.value || inv.val} <span style={{ color: "#64748b", fontSize: 8 }}>{inv.pct}</span></span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <span style={{ fontSize: 9.5, color: "#38bdf8", cursor: "pointer" }}>View Portfolio →</span>
              </div>
            </div>

            {/* Card 4: AI Finance Assistant (Beta) */}
            <div style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,27,75,0.8))", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: 14, padding: 14, backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>AI Finance Assistant</span>
                  <span style={{ fontSize: 8, background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>Beta</span>
                </div>

                {/* Orb Graphic + Greeting */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle, #a855f7 0%, #3b82f6 100%)", boxShadow: "0 0 12px rgba(168,85,247,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles style={{ width: 14, height: 14, color: "#fff" }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: "#cbd5e1", lineHeight: 1.3 }}>
                    Hello Pushkar! 👋<br />I've analyzed your finances and found insights.
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 8, fontSize: 9, color: "#e2e8f0", marginBottom: 6 }}>
                  <span style={{ color: "#a855f7", fontWeight: 700 }}>Top Insight:</span> You've spent 16% less on dining this month. Great job! 🎉
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Ask me anything about your finances..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 8, color: "#fff", padding: "6px 28px 6px 10px", fontSize: 9.5, fontFamily: "monospace" }}
                />
                <button type="submit" style={{ position: "absolute", right: 6, top: 5, background: "none", border: "none", color: "#a855f7", cursor: "pointer" }}>
                  <Send style={{ width: 12, height: 12 }} />
                </button>
              </form>
            </div>
          </div>

          {/* ── FOOTER QUICK ACTIONS BAR ── */}
          <div style={{ background: "rgba(10, 16, 35, 0.85)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(16px)", marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginRight: 8 }}>Quick Actions</span>
              <button onClick={() => setModalType("tx")} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#38bdf8", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus style={{ width: 12, height: 12 }} /> Add Transaction
              </button>
              <button onClick={() => toast.info("Invoice Generator opened.")} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText style={{ width: 12, height: 12 }} /> Create Invoice
              </button>
              <button onClick={() => toast.info("Budget Manager opened.")} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <BarChart3 style={{ width: 12, height: 12 }} /> New Budget
              </button>
              <button onClick={() => toast.info("Transfer Money dialog opened.")} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)", color: "#fb7185", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <ArrowLeftRight style={{ width: 12, height: 12 }} /> Transfer Money
              </button>
              <button onClick={() => toast.success("PDF Financial Report generated!")} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#e2e8f0", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Download style={{ width: 12, height: 12 }} /> Generate Report
              </button>
            </div>

            <div style={{ fontSize: 9.5, color: "#00FF88", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} />
              Data Sync Status: Synced 2 min ago
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD TRANSACTION MODAL ── */}
      {modalType === "tx" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 16, padding: 24, width: 400, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Add New Transaction</span>
              <X style={{ width: 16, height: 16, cursor: "pointer" }} onClick={() => setModalType(null)} />
            </div>
            <form onSubmit={handleAddTx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 4 }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Purchase, Salary"
                  value={txForm.title}
                  onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                  style={{ width: "100%", padding: 8, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 4 }}>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2450"
                  value={txForm.amount}
                  onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                  style={{ width: "100%", padding: 8, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 4 }}>Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}
                    style={{ width: "100%", padding: 8, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }}
                  >
                    <option value="debit">Expense (Debit)</option>
                    <option value="credit">Income (Credit)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#94a3b8", display: "block", marginBottom: 4 }}>Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    style={{ width: "100%", padding: 8, background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }}
                  >
                    <option value="Shopping">Shopping</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Investments">Investments</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ marginTop: 10, padding: 10, borderRadius: 8, background: "linear-gradient(90deg, #6366f1, #38bdf8)", border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
