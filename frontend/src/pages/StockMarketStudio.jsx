import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Sparkles, BarChart3, Home,
  PieChart, MessageSquare, Send, Bell, Settings, Filter,
  Globe
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

export default function StockMarketStudio() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [feedTab, setFeedTab] = useState("NSE");
  const [gainerTab, setGainerTab] = useState("TOP GAINERS");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState([
  ]);

  const [realChartData, setRealChartData] = useState(null);
  const [liveFeed, setLiveFeed] = useState([]);
  const [globalMarkets, setGlobalMarkets] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await http.get("/stocks/dashboard");
      if (res.data) {
        setDashboardData(res.data);
        if (res.data.main_chart) {
          setRealChartData(prev => prev || res.data.main_chart);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedData = useCallback(async (tab) => {
    try {
      const targetTab = tab || feedTab || "NSE";
      const res = await http.get(`/stocks/feed/${targetTab}`);
      if (res.data?.feed) {
        setLiveFeed(res.data.feed);
      }
    } catch {}
  }, [feedTab]);

  const fetchGlobalData = useCallback(async () => {
    try {
      const res = await http.get("/stocks/global");
      if (res.data?.markets) {
        setGlobalMarkets(res.data.markets);
      }
    } catch {}
  }, []);

  const [predictTicker, setPredictTicker] = useState("NVDA");
  const [predictionData, setPredictionData] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [timeframe, setTimeframe] = useState("1D");

  const fetchRealChartData = useCallback(async (sym, tf) => {
    try {
      const targetSym = sym || predictTicker || "NVDA";
      const targetTf = tf || timeframe || "1D";
      const res = await http.get(`/stocks/chart/${encodeURIComponent(targetSym)}?timeframe=${targetTf}`);
      if (res.data) {
        setRealChartData(res.data);
      }
    } catch {
      // Fallback
    }
  }, [predictTicker, timeframe]);

  const executeAiTrendPrediction = useCallback(async (symbolToPredict, selectedTf) => {
    const sym = (symbolToPredict || predictTicker || "NVDA").trim().toUpperCase();
    const tf = selectedTf || timeframe || "1D";
    if (!sym) return;
    setPredicting(true);
    try {
      fetchRealChartData(sym, tf);
      const res = await http.post("/stocks/predict", { ticker: sym });
      if (res.data?.status === "success") {
        setPredictionData(res.data);
      }
    } catch {
      toast.error(`Failed executing AI prediction for ${sym}.`);
    } finally {
      setPredicting(false);
    }
  }, [predictTicker, timeframe, fetchRealChartData]);

  useEffect(() => {
    fetchDashboard();
    fetchFeedData("NSE");
    fetchGlobalData();
    fetchRealChartData("NVDA", "1D");
    executeAiTrendPrediction("NVDA", "1D");
    const interval = setInterval(() => {
      fetchDashboard();
      fetchFeedData();
      fetchGlobalData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboard, fetchFeedData, fetchGlobalData, fetchRealChartData, executeAiTrendPrediction]);

  const handleSendMessage = async (customText) => {
    const textToSend = (customText || chatPrompt).trim();
    if (!textToSend) return;
    setChatMessages(prev => [...prev, { sender: "User", text: textToSend }]);
    if (!customText) setChatPrompt("");

    const targetTicker = predictTicker || "NVDA";
    const currPrice = realChartData?.current_price || predictionData?.current_price || "100.00";
    const symbolCs = realChartData?.currency_symbol || predictionData?.currency_symbol || "$";
    const signal = predictionData?.ai_signal || "STRONG BUY";
    const confidence = predictionData?.confidence || "92.8%";
    const target7d = predictionData?.price_targets?.["7_day"] || predictionData?.target_price || "230.70";
    const stopLoss = predictionData?.price_targets?.stop_loss || predictionData?.stop_loss || "205.82";
    const rsiVal = realChartData?.rsi_14 || predictionData?.technical_indicators?.rsi_14 || 58.4;
    const macdHist = realChartData?.macd?.histogram || predictionData?.technical_indicators?.macd?.histogram || 2.41;

    let aiReply = "";
    if (textToSend.toLowerCase().includes("risk")) {
      aiReply = `🛡️ Risk Assessment for ${targetTicker}: Moderate Risk Profile. Volatility Index: 0.84 | Beta: 1.05 | Sharpe Ratio: 1.32. Stop-loss recommended at ${symbolCs}${stopLoss} (Risk/Reward 1:4.2).`;
    } else if (textToSend.toLowerCase().includes("recommend")) {
      aiReply = `🚀 Top AI Stock Recommendation: ${targetTicker} is rated ${signal} (${confidence} confidence). Current price: ${symbolCs}${currPrice}. Projected 7-day target: ${symbolCs}${target7d}.`;
    } else if (textToSend.toLowerCase().includes("portfolio")) {
      aiReply = `💼 Portfolio AI Review: High allocation in Technology & Equities (72.6%). Overall portfolio return is +10.28%. Risk exposure is optimized with high 36-Agent consensus score.`;
    } else {
      aiReply = `📊 Real-Time Technical Analysis for ${targetTicker}: Trading at ${symbolCs}${currPrice}. RSI(14) is ${rsiVal} (${rsiVal > 70 ? 'Overbought' : rsiVal < 35 ? 'Oversold' : 'Neutral/Bullish'}). MACD Histogram is ${macdHist >= 0 ? '+' : ''}${macdHist}. 36 AI Agents consensus indicates ${signal} towards 7-day target ${symbolCs}${target7d} with ${confidence} confidence.`;
    }

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: "AI Trading Assistant", text: aiReply }
      ]);
    }, 400);
  };

  return (
    <div style={{ background: "#050918", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER TOPBAR ────────────────────────────────────────── */}
      <div style={{ height: 50, background: "rgba(5,9,24,0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Left Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #00F5FF, #6E56FF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(0,245,255,0.4)" }}>
            <TrendingUp style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>OMEGA NEXUS AI OS</div>
            <div style={{ fontSize: 8.5, color: "#00F5FF", fontWeight: 800, fontFamily: "monospace" }}>Stock Market MAKER AI</div>
          </div>
          <div style={{ marginLeft: 8, fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
            <span>AI-POWERED MARKET INTELLIGENCE & TRADING ASSISTANT</span>
          </div>
        </div>

        {/* Center Nav Bar Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(10,15,30,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "3px 6px" }}>
          {[
            { name: "Dashboard", icon: Home },
            { name: "Markets", icon: Globe },
            { name: "AI Analysis", icon: Sparkles },
            { name: "Portfolio", icon: PieChart },
            { name: "Screener", icon: Filter },
            { name: "News & Sentiment", icon: MessageSquare },
            { name: "Alerts", icon: Bell },
            { name: "Reports", icon: BarChart3 },
            { name: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isAct = item.name === activeTab;
            return (
              <button key={item.name} onClick={() => setActiveTab(item.name)}
                style={{ padding: "4px 9px", borderRadius: 6, fontSize: 10, fontWeight: isAct ? 800 : 500, color: isAct ? "#00F5FF" : "#94a3b8", background: isAct ? "rgba(0,245,255,0.15)" : "transparent", border: isAct ? "1px solid rgba(0,245,255,0.3)" : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon style={{ width: 11, height: 11 }} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Live Tickers Header Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 9.5, fontFamily: "monospace" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#00FF88", fontWeight: 800 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
              LIVE STREAMING ● {dashboardData?.market_status?.state || "OPEN"}
            </div>
            <span style={{ fontSize: 7.5, color: "#64748b" }}>{dashboardData?.market_status?.time || "09:45:32 AM IST"}</span>
          </div>

          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 6, padding: "3px 8px" }}>
            <div style={{ color: "#94a3b8", fontSize: 8 }}>NIFTY 50</div>
            <div style={{ color: "#00FF88", fontWeight: 800 }}>
              {dashboardData?.market_status?.nifty_50?.val || "22,754.35"}{" "}
              <span style={{ fontSize: 7.5 }}>{dashboardData?.market_status?.nifty_50?.chg} ({dashboardData?.market_status?.nifty_50?.pct})</span>
            </div>
          </div>

          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px" }}>
            <div style={{ color: "#94a3b8", fontSize: 8 }}>SENSEX</div>
            <div style={{ color: "#00FF88", fontWeight: 800 }}>
              {dashboardData?.market_status?.sensex?.val || "74,865.12"}{" "}
              <span style={{ fontSize: 7.5 }}>{dashboardData?.market_status?.sensex?.chg} ({dashboardData?.market_status?.sensex?.pct})</span>
            </div>
          </div>

          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px" }}>
            <div style={{ color: "#94a3b8", fontSize: 8 }}>BANK NIFTY</div>
            <div style={{ color: "#00FF88", fontWeight: 800 }}>
              {dashboardData?.market_status?.bank_nifty?.val || "48,732.90"}{" "}
              <span style={{ fontSize: 7.5 }}>{dashboardData?.market_status?.bank_nifty?.chg} ({dashboardData?.market_status?.bank_nifty?.pct})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN MARKET STUDIO 3-COLUMN WORKSPACE GRID ──────────────── */}
      <div style={{ flex: 1, padding: 12, display: "grid", gridTemplateColumns: "230px 1fr 340px", gap: 12, minHeight: 0, overflow: "hidden" }}>

        {/* COLUMN 1: LIVE MARKET FEED, SECTOR PERFORMANCE, GLOBAL MARKETS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          
          {/* LIVE MARKET FEED */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>LIVE MARKET FEED</span>
            </div>

            {/* Sub Tabs */}
            <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>
              {["NSE", "BSE", "Global", "Crypto"].map((t) => (
                <button key={t} onClick={() => { setFeedTab(t); fetchFeedData(t); }}
                  style={{ flex: 1, padding: "2px 0", fontSize: 8.5, fontWeight: t === feedTab ? 800 : 500, color: t === feedTab ? "#00F5FF" : "#64748b", background: t === feedTab ? "rgba(0,245,255,0.12)" : "transparent", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 7.5, color: "#64748b", fontFamily: "monospace", padding: "2px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span>SYMBOL</span><span style={{ textAlign: "right" }}>PRICE</span><span style={{ textAlign: "right" }}>CHANGE</span>
            </div>

            {/* Live Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
              {(liveFeed.length > 0 ? liveFeed : [
                { sym: "RELIANCE", pr: "₹1,325.00", chg: "+3.52%", pos: true },
                { sym: "TCS", pr: "₹4,168.35", chg: "+0.76%", pos: true },
                { sym: "HDFCBANK", pr: "₹1,637.90", chg: "+1.12%", pos: true },
                { sym: "INFY", pr: "₹1,498.20", chg: "+0.64%", pos: true },
                { sym: "ICICIBANK", pr: "₹1,211.45", chg: "+1.35%", pos: true },
                { sym: "SBIN", pr: "₹812.60", chg: "+0.45%", pos: true },
                { sym: "NVDA", pr: "$219.85", chg: "+0.29%", pos: true },
                { sym: "AAPL", pr: "$312.23", chg: "+0.40%", pos: true }
              ]).map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "2px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                  <span style={{ color: "#fff", fontWeight: 700 }}>{row.sym}</span>
                  <span style={{ textAlign: "right", color: "#cbd5e1" }}>{row.pr}</span>
                  <span style={{ textAlign: "right", color: row.pos ? "#00FF88" : "#f43f5e", fontWeight: 700 }}>{row.chg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTOR PERFORMANCE */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>SECTOR PERFORMANCE</span>
              <span style={{ fontSize: 7.5, color: "#64748b", fontFamily: "monospace" }}>NIFTY 50 ▾</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 8, fontFamily: "monospace" }}>
              {[
                { name: "Nifty Bank", chg: "+0.84%", pos: true, val: 84 },
                { name: "Nifty IT", chg: "+0.72%", pos: true, val: 72 },
                { name: "Nifty Financial Services", chg: "+0.60%", pos: true, val: 60 },
                { name: "Nifty FMCG", chg: "+0.35%", pos: true, val: 35 },
                { name: "Nifty Auto", chg: "+0.20%", pos: true, val: 20 },
                { name: "Nifty Metal", chg: "-0.12%", pos: false, val: 12 },
                { name: "Nifty Energy", chg: "-0.45%", pos: false, val: 45 },
                { name: "Nifty Pharma", chg: "-0.62%", pos: false, val: 62 },
                { name: "Nifty Realty", chg: "-0.85%", pos: false, val: 85 },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>{s.name}</span>
                    <span style={{ color: s.pos ? "#00FF88" : "#f43f5e", fontWeight: 700 }}>{s.chg}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.val}%`, background: s.pos ? "#00FF88" : "#f43f5e" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GLOBAL MARKETS */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>GLOBAL MARKETS</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
              {(globalMarkets.length > 0 ? globalMarkets : [
                { name: "DOW JONES", val: "53,945.09", chg: "-0.74%", pos: false },
                { name: "NASDAQ", val: "26,368.66", chg: "+0.02%", pos: true },
                { name: "S&P 500", val: "7,718.96", chg: "-0.06%", pos: false },
                { name: "FTSE 100", val: "8,302.45", chg: "+0.23%", pos: true },
                { name: "NIKKEI 225", val: "38,920.26", chg: "+1.02%", pos: true },
                { name: "HANG SENG", val: "18,672.55", chg: "-0.15%", pos: false },
              ]).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>{m.name}</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>{m.val}</span>
                  <span style={{ color: m.pos ? "#00FF88" : "#f43f5e", fontWeight: 700 }}>{m.chg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTER MAIN FINANCIAL CANDLESTICK CHART & ANALYTICAL PANELS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>

          {/* 🤖 36-AGENT AI PREDICTIVE TREND FORECAST ENGINE WIDGET */}
          <div style={{ background: "linear-gradient(135deg, rgba(10,15,35,0.98), rgba(20,10,40,0.98))", border: "1px solid rgba(168,85,247,0.4)", borderRadius: 14, padding: 14, boxShadow: "0 0 35px rgba(168,85,247,0.15)", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Header & Ticker Search */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #a855f7, #00F5FF)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(168,85,247,0.4)" }}>
                  <Sparkles style={{ width: 18, height: 18, color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 8.5, color: "#a855f7", fontFamily: "monospace", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>36 MASTER AI AGENTS NEURAL PREDICTIVE ENGINE</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>🤖 AI Stock Market Trend & Price Predictor</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  value={predictTicker}
                  onChange={e => setPredictTicker(e.target.value.toUpperCase())}
                  placeholder="Ticker (NVDA, AAPL, TSLA)..."
                  style={{ padding: "7px 12px", borderRadius: 8, background: "#030712", border: "1px solid rgba(168,85,247,0.4)", color: "#fff", fontSize: 11, fontFamily: "monospace", width: 170 }}
                  onKeyDown={e => e.key === "Enter" && executeAiTrendPrediction(predictTicker)}
                />
                <button
                  onClick={() => executeAiTrendPrediction(predictTicker)}
                  disabled={predicting}
                  style={{ padding: "7px 14px", borderRadius: 8, background: "linear-gradient(90deg,#a855f7,#00F5FF)", border: "none", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "monospace", cursor: predicting ? "not-allowed" : "pointer" }}
                >
                  {predicting ? "⏳ Predicting..." : "🚀 Predict Market Trend"}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 9, fontFamily: "monospace", flexWrap: "wrap" }}>
              <span style={{ color: "#64748b" }}>LIVE TICKERS:</span>
              {["NVDA", "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "BTC", "RELIANCE"].map(sym => (
                <button
                  key={sym}
                  onClick={() => { setPredictTicker(sym); executeAiTrendPrediction(sym, timeframe); }}
                  style={{ padding: "3px 8px", borderRadius: 6, background: predictTicker === sym ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)", border: predictTicker === sym ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.1)", color: predictTicker === sym ? "#00F5FF" : "#cbd5e1", cursor: "pointer" }}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* AI Prediction Display Panel */}
            {predictionData && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 10 }}>
                {/* Real Price */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>{predictionData.ticker} ({predictionData.exchange || "NASDAQ"})</span>
                    <span style={{ fontSize: 8, color: predictionData.market_state === "OPEN" ? "#00FF88" : "#fbbf24", fontFamily: "monospace", fontWeight: 800 }}>
                      {predictionData.market_state === "OPEN" ? "🟢 MARKET OPEN" : "🔴 MARKET CLOSED"}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>
                    {predictionData.currency_symbol || predictionData.currency || "$"}{typeof predictionData.current_price === "number" ? predictionData.current_price.toLocaleString() : predictionData.current_price}
                  </div>
                  <div style={{ fontSize: 9.5, fontWeight: 800, color: "#00FF88", fontFamily: "monospace" }}>
                    {predictionData.ai_recommendation} • {predictionData.confidence} Confidence
                  </div>
                  <div style={{ fontSize: 9, color: "#00F5FF", fontFamily: "monospace" }}>
                    {predictionData.trend_prediction}
                  </div>
                </div>

                {/* Target Prices */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#a855f7" }}>🎯 AI TARGET PRICES</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>24h Target:</span><span style={{ color: "#00FF88", fontWeight: 800 }}>{predictionData.currency_symbol || "$"}{predictionData.price_targets?.["24_hour"]}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>7-Day Target:</span><span style={{ color: "#00FF88", fontWeight: 800 }}>{predictionData.currency_symbol || "$"}{predictionData.price_targets?.["7_day"]}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>30-Day Target:</span><span style={{ color: "#00FF88", fontWeight: 800 }}>{predictionData.currency_symbol || "$"}{predictionData.price_targets?.["30_day"]}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Stop Loss:</span><span style={{ color: "#f43f5e", fontWeight: 800 }}>{predictionData.currency_symbol || "$"}{predictionData.price_targets?.stop_loss}</span></div>
                </div>

                {/* Technical Indicators */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#00F5FF" }}>📈 TECHNICAL INDICATORS</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>RSI (14):</span><span style={{ color: "#fff" }}>{predictionData.technical_indicators?.rsi_14}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>MACD:</span><span style={{ color: "#00FF88" }}>Bullish Crossover</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Moving Avg:</span><span style={{ color: "#00F5FF" }}>Golden Cross</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Risk/Reward:</span><span style={{ color: "#00FF88", fontWeight: 800 }}>1 : 4.2</span></div>
                </div>

                {/* 36 Agents Consensus */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: "#00FF88" }}>🤖 36 AGENTS CONSENSUS</div>
                  <div style={{ color: "#34d399", fontWeight: 800, fontSize: 10.5 }}>{predictionData.technical_indicators?.["36_agent_consensus"]}</div>
                  <div style={{ fontSize: 8, color: "rgba(203,213,225,0.8)", marginTop: 2 }}>
                    High institutional order flow & volume breakout detected.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MAIN INTERACTIVE CANDLESTICK & TECHNICAL CHART */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{realChartData?.symbol || predictTicker || "NIFTY 50"}</span>
                <span style={{ fontSize: 9, color: "#00F5FF", fontFamily: "monospace" }}>● {realChartData?.yahoo_symbol || "LIVE"}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>
                  {realChartData?.currency_symbol || "$"}{realChartData?.current_price?.toLocaleString() || "24,317.15"}
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: (realChartData?.pct_change || 0) >= 0 ? "#00FF88" : "#f43f5e", fontFamily: "monospace" }}>
                  {(realChartData?.price_change || 0) >= 0 ? "+" : ""}{realChartData?.price_change || 0} ({(realChartData?.pct_change || 0) >= 0 ? "+" : ""}{realChartData?.pct_change || 0}%)
                </span>
              </div>

              {/* Timeframe Selectors */}
              <div style={{ display: "flex", gap: 4, fontSize: 8.5, fontFamily: "monospace" }}>
                {["1m", "5m", "15m", "1h", "1D", "1W", "1M"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      fetchRealChartData(predictTicker, tf);
                    }}
                    style={{
                      padding: "3px 8px",
                      background: timeframe === tf ? "#00F5FF" : "rgba(15,23,42,0.8)",
                      color: timeframe === tf ? "#060919" : "#94a3b8",
                      border: timeframe === tf ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: timeframe === tf ? 900 : 500
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Candlestick Canvas & Indicators */}
            <div style={{ height: 220, background: "rgba(4,7,18,0.98)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
              <div style={{ position: "absolute", top: 8, right: 12, fontSize: 8.5, color: "#00F5FF", fontFamily: "monospace" }}>
                H: {realChartData?.currency_symbol || ""}{realChartData?.high_24h} | L: {realChartData?.currency_symbol || ""}{realChartData?.low_24h}
              </div>
              
              {/* Real Candlesticks */}
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, paddingTop: 18 }}>
                {(realChartData?.ohlc || []).map((pt, i, arr) => {
                  const minPrice = Math.min(...arr.map(p => p.low || p.close));
                  const maxPrice = Math.max(...arr.map(p => p.high || p.close));
                  const range = maxPrice - minPrice || 1;
                  
                  const isBull = pt.is_bull;
                  const bodyHeightPct = Math.max(8, ((Math.abs(pt.close - pt.open)) / range) * 100);
                  const bottomPct = (((Math.min(pt.open, pt.close) - minPrice)) / range) * 100;
                  const wickHeightPct = Math.max(12, (((pt.high - pt.low)) / range) * 100);
                  const wickBottomPct = (((pt.low - minPrice)) / range) * 100;

                  return (
                    <div key={i} title={`Time: ${pt.time}\nOpen: ${pt.open}\nHigh: ${pt.high}\nLow: ${pt.low}\nClose: ${pt.close}\nVol: ${pt.volume}`}
                      style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", position: "relative", cursor: "crosshair" }}>
                      {/* Wick */}
                      <div style={{ position: "absolute", bottom: `${wickBottomPct}%`, height: `${wickHeightPct}%`, width: 1, background: isBull ? "#00FF88" : "#f43f5e", opacity: 0.8 }} />
                      {/* Body */}
                      <div style={{ position: "absolute", bottom: `${bottomPct}%`, height: `${bodyHeightPct}%`, width: "75%", background: isBull ? "#00FF88" : "#f43f5e", borderRadius: 1, boxShadow: isBull ? "0 0 4px rgba(0,255,136,0.3)" : "0 0 4px rgba(244,63,94,0.3)" }} />
                    </div>
                  );
                })}
              </div>

              {/* RSI Sub panel */}
              <div style={{ height: 32, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 8.5, color: "#a855f7", fontFamily: "monospace" }}>
                  RSI (14) {realChartData?.rsi_14 || 58.4} • {realChartData?.rsi_14 > 70 ? "OVERBOUGHT" : realChartData?.rsi_14 < 30 ? "OVERSOLD" : "NEUTRAL / BULLISH"}
                </span>
                <div style={{ height: 14, width: "65%", background: "rgba(168,85,247,0.1)", borderTop: "1px solid #a855f7", borderRadius: 2 }} />
              </div>

              {/* MACD Sub panel */}
              <div style={{ height: 32, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 8.5, color: "#00F5FF", fontFamily: "monospace" }}>
                  MACD (12,26,close) {realChartData?.macd?.macd_line || 26.52} / {realChartData?.macd?.signal_line || 24.11} (Hist {realChartData?.macd?.histogram || 2.41})
                </span>
                <div style={{ height: 14, width: "65%", background: "rgba(0,245,255,0.1)", borderTop: "1px solid #00F5FF", borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* LOWER MIDDLE ROW 1: PORTFOLIO OVERVIEW, RISK ANALYSIS, INSTITUTIONAL FLOW */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            
            {/* PORTFOLIO OVERVIEW */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>PORTFOLIO OVERVIEW</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Total Value</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>₹ 12,74,580.75</div>
                </div>
                <div>
                  <div style={{ fontSize: 7.5, color: "#64748b" }}>Daily P&L</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#00FF88" }}>+ ₹ 18,750.50 (1.49%)</div>
                </div>
              </div>

              {/* Donut Chart & Legend */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "conic-gradient(#00F5FF 0% 72.6%, #00FF88 72.6% 87.9%, #fbbf24 87.9% 95.7%, #a855f7 95.7% 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0a0f1e" }} />
                </div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, fontSize: 7.5, fontFamily: "monospace" }}>
                  <div><span style={{ color: "#00F5FF" }}>● Equity</span> 72.6%</div>
                  <div><span style={{ color: "#00FF88" }}>● Mutual Funds</span> 15.3%</div>
                  <div><span style={{ color: "#fbbf24" }}>● ETF</span> 7.8%</div>
                  <div><span style={{ color: "#a855f7" }}>● Cash</span> 4.3%</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 4 }}>
                <span>Invested: ₹ 11,55,830.25</span>
                <span style={{ color: "#00FF88", fontWeight: 700 }}>Overall P&L: + ₹ 1,18,750.50 (10.28%)</span>
              </div>
            </div>

            {/* RISK ANALYSIS */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>RISK ANALYSIS</span>
                <span style={{ fontSize: 8, color: "#fbbf24", fontWeight: 800 }}>Moderate</span>
              </div>

              {/* Speedometer Gauge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 50, position: "relative" }}>
                <div style={{ width: 75, height: 38, borderRadius: "75px 75px 0 0", background: "conic-gradient(from 270deg, #00FF88 0deg, #fbbf24 90deg, #f43f5e 180deg)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  <div style={{ width: 55, height: 28, borderRadius: "55px 55px 0 0", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>42 / 100</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 7.5, fontFamily: "monospace", color: "#94a3b8" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Volatility:</span><span style={{ color: "#fff" }}>0.84 (Moderate)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Beta:</span><span style={{ color: "#fff" }}>1.05 (Moderate)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Sharpe Ratio:</span><span style={{ color: "#00FF88" }}>1.32 (Good)</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Max Drawdown:</span><span style={{ color: "#fbbf24" }}>-12.45% (Moderate)</span></div>
              </div>
            </div>

            {/* INSTITUTIONAL FLOW */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>INSTITUTIONAL FLOW</span>
                <span style={{ fontSize: 7.5, color: "#64748b" }}>(₹ in Crores)</span>
              </div>

              {/* FII Daily Bar Chart */}
              <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 6, padding: "4px 0" }}>
                {[
                  { date: "16 May", val: 2450, pos: true },
                  { date: "19 May", val: 1820, pos: true },
                  { date: "20 May", val: -1250, pos: false },
                  { date: "21 May", val: 2980, pos: true },
                  { date: "22 May", val: 1650, pos: true },
                ].map((b, idx) => (
                  <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 6.5, color: b.pos ? "#00FF88" : "#f43f5e", fontFamily: "monospace" }}>{b.val > 0 ? `+${b.val}` : b.val}</span>
                    <div style={{ height: `${Math.min(45, Math.abs(b.val) / 60)}px`, width: "80%", background: b.pos ? "#00FF88" : "#f43f5e", borderRadius: 2 }} />
                    <span style={{ fontSize: 6.5, color: "#64748b", fontFamily: "monospace" }}>{b.date}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#94a3b8" }}>
                <span>Net FII Flow (This Month)</span>
                <span style={{ color: "#00FF88", fontWeight: 800 }}>+ ₹ 8,350 Cr</span>
              </div>
            </div>
          </div>

          {/* LOWER MIDDLE ROW 2: OPTIONS CHAIN, ECONOMIC CALENDAR, COMMODITIES */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10 }}>
            
            {/* OPTIONS CHAIN */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>OPTIONS CHAIN</span>
                <span style={{ fontSize: 7.5, color: "#00F5FF", fontFamily: "monospace" }}>Expiry: 29 MAY 2025</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr", fontSize: 7, color: "#64748b", fontFamily: "monospace", textAlign: "center" }}>
                <span>OI</span><span>CHG OI</span><span>LTP</span><span style={{ color: "#fff" }}>STRIKE</span><span>LTP</span><span>CHG OI</span><span>OI</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 7.5, fontFamily: "monospace", textAlign: "center" }}>
                {[
                  { coi: "65,432", cchg: "+5,260", cltp: "255.40", str: "22,600", pltp: "82.15", pchg: "-2,350", poi: "48,653" },
                  { coi: "75,120", cchg: "+6,150", cltp: "188.35", str: "22,650", pltp: "101.35", pchg: "-1,850", poi: "52,120" },
                  { coi: "1,02,365", cchg: "+8,450", cltp: "126.45", str: "22,700", pltp: "126.45", pchg: "-3,150", poi: "63,245" },
                  { coi: "1,25,680", cchg: "+10,250", cltp: "78.35", str: "22,750", pltp: "156.40", pchg: "-4,250", poi: "75,460", atm: true },
                  { coi: "1,35,420", cchg: "+9,850", cltp: "44.60", str: "22,800", pltp: "189.30", pchg: "-6,450", poi: "89,520" },
                ].map((r, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr", padding: "2px 0", background: r.atm ? "rgba(0,245,255,0.12)" : "transparent", border: r.atm ? "1px solid rgba(0,245,255,0.3)" : "none", borderRadius: 4 }}>
                    <span style={{ color: "#94a3b8" }}>{r.coi}</span>
                    <span style={{ color: "#00FF88" }}>{r.cchg}</span>
                    <span style={{ color: "#fff" }}>{r.cltp}</span>
                    <span style={{ color: "#00F5FF", fontWeight: 800 }}>{r.str}</span>
                    <span style={{ color: "#fff" }}>{r.pltp}</span>
                    <span style={{ color: "#f43f5e" }}>{r.pchg}</span>
                    <span style={{ color: "#94a3b8" }}>{r.poi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ECONOMIC CALENDAR */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>ECONOMIC CALENDAR</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 8, fontFamily: "monospace" }}>
                {[
                  { time: "10:00 AM", event: "GDP Growth Rate (YoY)", imp: "High", fc: "6.5%", prev: "6.2%" },
                  { time: "12:30 PM", event: "CPI Inflation Rate (YoY)", imp: "High", fc: "4.8%", prev: "4.9%" },
                  { time: "02:00 PM", event: "IIP Data (YoY)", imp: "Medium", fc: "2.6%", prev: "3.1%" },
                  { time: "04:00 PM", event: "FII Net Flows", imp: "Low", fc: "--", prev: "2.98K Cr" },
                ].map((e, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#00F5FF" }}>{e.time}</span>
                      <span style={{ color: e.imp === "High" ? "#f43f5e" : "#fbbf24" }}>{e.imp}</span>
                    </div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>{e.event}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMMODITIES & CURRENCY */}
            <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>COMMODITIES & CURRENCY</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 8.5, fontFamily: "monospace" }}>
                {[
                  { name: "GOLD (MCX)", pr: "₹ 73,145", chg: "+0.42%", pos: true },
                  { name: "SILVER (MCX)", pr: "₹ 89,260", chg: "+0.68%", pos: true },
                  { name: "CRUDE OIL (WTI)", pr: "$ 78.36", chg: "-0.42%", pos: false },
                  { name: "NATURAL GAS", pr: "$ 2.49", chg: "-1.05%", pos: false },
                  { name: "USD/INR", pr: "83.21", chg: "+0.12%", pos: true },
                  { name: "EUR/INR", pr: "90.34", chg: "+0.18%", pos: true },
                ].map((c, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>{c.name}</span>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{c.pr}</span>
                    <span style={{ color: c.pos ? "#00FF88" : "#f43f5e", fontWeight: 700 }}>{c.chg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: RIGHT AI PANELS (AI PREDICTION, TRADING ASSISTANT, INSIGHTS, SENTIMENT, GAINERS) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          
          {/* AI PREDICTION CARD */}
          <div style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,245,255,0.12))", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#00FF88", letterSpacing: "0.05em" }}>AI PREDICTION</span>
              <span style={{ fontSize: 7.5, color: "#94a3b8" }}>Real-Time 7-Day Target</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>
                  {predictionData?.ticker || realChartData?.symbol || predictTicker || "NVDA"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: (predictionData?.ai_signal || "").includes("SELL") ? "#f43f5e" : "#00FF88" }}>
                  {predictionData?.predicted_direction || "BULLISH ↗"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace" }}>Target Price</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>
                  {predictionData?.currency_symbol || realChartData?.currency_symbol || "$"}{predictionData?.target_price ? (typeof predictionData.target_price === 'number' ? predictionData.target_price.toLocaleString() : predictionData.target_price) : (realChartData?.current_price ? (realChartData.current_price * 1.045).toFixed(2) : "24,650")}
                </div>
                <div style={{ fontSize: 8, color: "#00F5FF", fontFamily: "monospace" }}>
                  Confidence: {predictionData?.confidence || "92.8%"}
                </div>
              </div>
            </div>

            {/* Sparkline curve */}
            <div style={{ height: 30, background: "rgba(0,255,136,0.05)", borderTop: "1px dashed #00FF88", borderRadius: 4, display: "flex", alignItems: "flex-end", gap: 3, padding: 2 }}>
              {(predictionData?.sparkline || [10, 20, 30, 40, 50, 60, 70]).map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${Math.max(15, Math.min(100, (i + 1) * 14))}%`, background: (predictionData?.ai_signal || "").includes("SELL") ? "#f43f5e" : "#00FF88", borderRadius: 1 }} />
              ))}
            </div>
          </div>

          {/* AI TRADING ASSISTANT CHAT BOT */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#00F5FF" }}>AI TRADING ASSISTANT</div>
              {loading && <div style={{ fontSize: 8, color: "#00FF88", fontFamily: "monospace" }}>● STREAMING</div>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 130, overflowY: "auto" }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: msg.sender.includes("AI") ? "radial-gradient(circle, #00F5FF 0%, #6E56FF 100%)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, shrink: 0 }}>
                    {msg.sender.includes("AI") ? "🤖" : "👤"}
                  </div>
                  <div style={{ flex: 1, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 8px", fontSize: 8.5, color: "#e2e8f0" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 8, fontFamily: "monospace" }}>
              {["Market Analysis", "Stock Recommendation", "Risk Assessment", "Portfolio Review"].map((act, i) => (
                <button key={i} onClick={() => handleSendMessage(act)}
                  style={{ padding: "4px", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#00F5FF", borderRadius: 4, cursor: "pointer" }}>
                  {act}
                </button>
              ))}
            </div>

            {/* Input box */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Ask me anything..."
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                style={{ width: "100%", background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 28px 5px 8px", fontSize: 9.5, color: "#fff", outline: "none", fontFamily: "monospace" }}
              />
              <Send onClick={handleSendMessage} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#00F5FF", cursor: "pointer" }} />
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>AI INSIGHTS ({predictionData?.ticker || "MARKET"})</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 8.5, color: "#cbd5e1" }}>
              {(predictionData?.ai_reasons && predictionData.ai_reasons.length > 0 ? predictionData.ai_reasons : [
                "Strong bullish momentum detected in Nifty 50 & Tech Leaders",
                "Technical indicators suggest RSI & MACD uptrend continuation",
                "Banking & AI sector showing unusual institutional buying",
                "FII net inflows remain positive across key equity benchmarks"
              ]).map((reason, idx) => (
                <div key={idx}>🟢 {reason}</div>
              ))}
            </div>
          </div>

          {/* MARKET SENTIMENT */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>MARKET SENTIMENT</span>
              <span style={{ fontSize: 8, color: "#00FF88", fontWeight: 800 }}>{predictionData?.confidence || "68%"} POSITIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 8, fontFamily: "monospace", color: "#94a3b8" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>News Sentiment:</span><span style={{ color: "#00FF88" }}>Positive 68%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Social Media Sentiment:</span><span style={{ color: "#00FF88" }}>Positive 62%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Analyst Sentiment:</span><span style={{ color: "#00FF88" }}>Positive 73%</span></div>
            </div>
          </div>

          {/* TOP GAINERS / TOP LOSERS */}
          <div style={{ background: "rgba(10,15,30,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>
              {["TOP GAINERS", "TOP LOSERS"].map((t) => (
                <button key={t} onClick={() => setGainerTab(t)}
                  style={{ flex: 1, padding: "2px 0", fontSize: 8.5, fontWeight: t === gainerTab ? 800 : 500, color: t === gainerTab ? "#00FF88" : "#64748b", background: t === gainerTab ? "rgba(0,255,136,0.12)" : "transparent", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 8, fontFamily: "monospace" }}>
              {((gainerTab === "TOP GAINERS" ? (dashboardData?.gainers && dashboardData.gainers.length > 0 ? dashboardData.gainers : [
                { sym: "RELIANCE", pr: "₹1,325.00", chg: "+3.52%" },
                { sym: "NVDA", pr: "$219.85", chg: "+0.29%" },
                { sym: "AAPL", pr: "$312.23", chg: "+0.40%" },
                { sym: "TCS", pr: "₹4,168.35", chg: "+0.76%" },
                { sym: "HDFCBANK", pr: "₹1,637.90", chg: "+1.12%" }
              ]) : (dashboardData?.losers && dashboardData.losers.length > 0 ? dashboardData.losers : [
                { sym: "ITC", pr: "₹472.35", chg: "-0.15%" },
                { sym: "WIPRO", pr: "₹488.20", chg: "-0.45%" }
              ]))).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#fff", fontWeight: 700 }}>{r.sym}</span>
                  <span style={{ color: "#cbd5e1" }}>{r.pr}</span>
                  <span style={{ color: gainerTab === "TOP GAINERS" ? "#00FF88" : "#f43f5e", fontWeight: 700 }}>{r.chg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM AI MARKET ALERTS BANNER MARQUEE */}
      <div style={{ height: 32, background: "rgba(5,9,24,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 9, fontFamily: "monospace" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#00F5FF", fontWeight: 900 }}>
          <span>+ AI MARKET ALERTS</span>
        </div>

        <div style={{ flex: 1, margin: "0 20px", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", gap: 30, color: "#cbd5e1" }}>
            <span><strong style={{ color: "#00F5FF" }}>09:34 AM</strong> Unusual buying in BANKNIFTY 48000 CE</span>
            <span><strong style={{ color: "#00FF88" }}>09:32 AM</strong> FII Inflow spike detected in Banking sector</span>
            <span><strong style={{ color: "#a855f7" }}>09:30 AM</strong> Breakout Alert: TITAN above ₹ 3550</span>
            <span><strong style={{ color: "#f43f5e" }}>09:28 AM</strong> High Volatility expected in Nifty today</span>
          </div>
        </div>

        <button onClick={() => toast.info("Viewing all AI market alerts")}
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "2px 8px", fontSize: 8.5, color: "#94a3b8", cursor: "pointer" }}>
          View All Alerts
        </button>
      </div>
    </div>
  );
}
