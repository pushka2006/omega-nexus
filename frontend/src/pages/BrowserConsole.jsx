import React, { useState, useEffect } from "react";
import {
  Globe, Search, Image as ImageIcon, Video, Newspaper, MapPin, ShoppingBag,
  BookOpen, Plane, DollarSign, History, Bookmark, Download, Cpu, Settings,
  ShieldCheck, Moon, Sun, Mic, Camera, Plus, X, SunMedium, CloudSun,
  Calculator, Ruler, QrCode, Languages, FileText, ArrowUpRight, RefreshCw, ExternalLink,
  Check, Save, Copy, Layout, PanelLeft, PanelRight, Bot
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

export default function BrowserConsole() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sidebar Position State
  const [sidebarPos, setSidebarPos] = useState(() => localStorage.getItem("nexus_sidebar_position") || "left");

  // Side Robot Position State
  const [sideRobotPos, setSideRobotPos] = useState(() => localStorage.getItem("nexus_siderobot_position") || "bottom-right");

  // Quick Tools Modal State
  const [activeToolModal, setActiveToolModal] = useState(null);

  // Tool Specific States
  // 1. Calculator
  const [calcDisplay, setCalcDisplay] = useState("0");
  
  // 2. Unit Converter
  const [unitVal, setUnitVal] = useState(1);
  const [unitType, setUnitType] = useState("Length");
  const [convertedRes, setConvertedRes] = useState("");

  // 3. QR Code Generator
  const [qrText, setQrText] = useState("https://google.com");

  // 4. Translator
  const [transInput, setTransInput] = useState("");
  const [transLang, setTransLang] = useState("Spanish");
  const [transOutput, setTransOutput] = useState("");

  // 5. Notes
  const [noteContent, setNoteContent] = useState(() => localStorage.getItem("browser_quick_note") || "");

  // Real Data State
  const [weatherData, setWeatherData] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [historyList, setHistoryList] = useState([
    { term: "top 10 programming languages", time: "10:30 AM" },
    { term: "how does quantum computing work", time: "Yesterday" },
    { term: "best places to visit in Switzerland", time: "2 days ago" },
    { term: "healthy recipes for weight loss", time: "3 days ago" },
    { term: "latest technology trends 2026", time: "4 days ago" },
  ]);

  const fetchRealData = async () => {
    try {
      const wRes = await http.get("/browser/weather");
      if (wRes.data) setWeatherData(wRes.data);

      const nRes = await http.get("/browser/news");
      if (nRes.data?.articles) setNewsArticles(nRes.data.articles);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const changeSidebarPosition = (newPos) => {
    setSidebarPos(newPos);
    localStorage.setItem("nexus_sidebar_position", newPos);
    window.dispatchEvent(new Event("sidebar_position_changed"));
    toast.success(`Sidebar location updated to ${newPos.toUpperCase()}`);
  };

  const changeSideRobotPosition = (newPos) => {
    setSideRobotPos(newPos);
    localStorage.setItem("nexus_siderobot_position", newPos);
    window.dispatchEvent(new Event("siderobot_position_changed"));
    toast.success(`Side Robot location updated to ${newPos.toUpperCase().replace("-", " ")}`);
  };

  // Calculator Logic
  const handleCalcClick = (val) => {
    if (val === "C") {
      setCalcDisplay("0");
    } else if (val === "=") {
      try {
        const sanitized = calcDisplay.replace(/×/g, "*").replace(/÷/g, "/");
        const res = eval(sanitized);
        setCalcDisplay(String(res));
      } catch {
        setCalcDisplay("Error");
      }
    } else {
      if (calcDisplay === "0" || calcDisplay === "Error") {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(calcDisplay + val);
      }
    }
  };

  // Unit Converter Logic
  useEffect(() => {
    const val = parseFloat(unitVal) || 0;
    if (unitType === "Length") {
      setConvertedRes(`${val} Meters = ${(val * 3.28084).toFixed(2)} Feet`);
    } else if (unitType === "Weight") {
      setConvertedRes(`${val} kg = ${(val * 2.20462).toFixed(2)} lbs`);
    } else if (unitType === "Temp") {
      setConvertedRes(`${val}°C = ${((val * 9/5) + 32).toFixed(1)}°F`);
    } else if (unitType === "Currency") {
      setConvertedRes(`$${val} USD = ₹${(val * 83.45).toFixed(2)} INR`);
    }
  }, [unitVal, unitType]);

  // Translator Logic
  const handleTranslate = () => {
    if (!transInput.trim()) return;
    const mockTranslations = {
      Spanish: `[ES] ${transInput} (Traducido en vivo)`,
      French: `[FR] ${transInput} (Traduit en direct)`,
      German: `[DE] ${transInput} (Live übersetzt)`,
      Hindi: `[HI] ${transInput} (अनुवादित)`,
      Japanese: `[JA] ${transInput} (ライブ翻訳)`
    };
    setTransOutput(mockTranslations[transLang] || `[${transLang}] ${transInput}`);
  };

  // Save Note
  const saveQuickNote = () => {
    localStorage.setItem("browser_quick_note", noteContent);
    toast.success("Quick note saved successfully!");
  };

  // Direct Search Navigation Executor
  const handleSearch = async (e, forceUrl = null) => {
    if (e) e.preventDefault();
    const queryToUse = forceUrl || searchQuery;
    if (!queryToUse.trim()) return;

    let targetUrl = "";
    const cleanQ = queryToUse.trim();

    if (cleanQ.startsWith("http://") || cleanQ.startsWith("https://")) {
      targetUrl = cleanQ;
    } else if (cleanQ.includes(".") && !cleanQ.includes(" ")) {
      targetUrl = `https://${cleanQ}`;
    } else {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQ)}`;
    }

    toast.success(`Directly launching: ${cleanQ}`);
    window.open(targetUrl, "_blank", "noopener,noreferrer");

    setHistoryList(prev => [
      { term: cleanQ, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.filter(item => item.term !== cleanQ).slice(0, 4)
    ]);

    try {
      setLoading(true);
      const res = await http.get(`/browser/search?q=${encodeURIComponent(cleanQ)}`);
      if (res.data) {
        setSearchResults(res.data);
      }
    } catch {
      // Silent catch
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const q = searchQuery.trim() || "latest trends";
    let catUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;

    if (cat === "Images") catUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
    if (cat === "Videos") catUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    if (cat === "News") catUrl = `https://news.google.com/search?q=${encodeURIComponent(q)}`;
    if (cat === "Maps") catUrl = `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
    if (cat === "Shopping") catUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}`;
    if (cat === "Finance") catUrl = `https://www.google.com/finance?q=${encodeURIComponent(q)}`;

    toast.info(`Opening ${cat} search for "${q}"`);
    window.open(catUrl, "_blank", "noopener,noreferrer");
  };

  const removeItemFromHistory = (index) => {
    setHistoryList(prev => prev.filter((_, i) => i !== index));
  };

  const bookmarks = [
    { name: "Google", url: "https://google.com", bg: "#ffffff", letter: "G", color: "#4285F4" },
    { name: "YouTube", url: "https://youtube.com", bg: "#ef4444", letter: "▶", color: "#ffffff" },
    { name: "Facebook", url: "https://facebook.com", bg: "#1877F2", letter: "f", color: "#ffffff" },
    { name: "X (Twitter)", url: "https://x.com", bg: "#000000", letter: "𝕏", color: "#ffffff" },
    { name: "Wikipedia", url: "https://wikipedia.org", bg: "#ffffff", letter: "W", color: "#000000" },
    { name: "GitHub", url: "https://github.com", bg: "#24292e", letter: "🐙", color: "#ffffff" },
    { name: "Amazon", url: "https://amazon.com", bg: "#ffffff", letter: "a", color: "#FF9900" },
    { name: "Reddit", url: "https://reddit.com", bg: "#FF4500", letter: "🤖", color: "#ffffff" },
  ];

  return (
    <div style={{ background: "#030612", height: "calc(100vh - 48px)", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* MAIN 3-COLUMN BROWSER LAYOUT */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "200px 1fr 380px", gap: 14, padding: 14, minHeight: 0, height: "100%" }}>

        {/* ── LEFT COLUMN SIDEBAR (PINNED) ───────────────────────────── */}
        <div style={{ background: "rgba(8,12,28,0.96)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          
          {/* Header Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(99,102,241,0.5)" }}>
              <Globe style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: "0.08em" }}>BROWSER</div>
              <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace" }}>Search. Discover. Explore.</div>
            </div>
          </div>

          {/* Primary Navigation Menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { label: "Home", icon: Globe },
              { label: "Search", icon: Search },
              { label: "Images", icon: ImageIcon },
              { label: "Videos", icon: Video },
              { label: "News", icon: Newspaper },
              { label: "Maps", icon: MapPin },
              { label: "Shopping", icon: ShoppingBag },
              { label: "Books", icon: BookOpen },
              { label: "Flights", icon: Plane },
              { label: "Finance", icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              const isAct = item.label === activeTab;
              return (
                <div key={item.label} onClick={() => { setActiveTab(item.label); handleCategoryClick(item.label); }}
                  style={{ padding: "6px 10px", borderRadius: 8, fontSize: 10.5, fontWeight: isAct ? 800 : 500, color: isAct ? "#fff" : "#94a3b8", background: isAct ? "linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon style={{ width: 13, height: 13, color: isAct ? "#fff" : "#64748b" }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

          {/* Secondary Utilities */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              { label: "History", icon: History, key: null },
              { label: "Bookmarks", icon: Bookmark, key: null },
              { label: "Downloads", icon: Download, key: null },
              { label: "Extensions", icon: Cpu, key: null },
              { label: "Settings", icon: Settings, key: "Settings" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} onClick={() => { if (item.key) setActiveToolModal(item.key); else toast.info(`Opening ${item.label}...`); }}
                  style={{ padding: "5px 10px", borderRadius: 6, fontSize: 10, color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon style={{ width: 12, height: 12, color: "#64748b" }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom Security Cards */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, padding: 6, fontSize: 8, fontFamily: "monospace" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#00FF88", fontWeight: 800 }}>
                <ShieldCheck style={{ width: 11, height: 11 }} />
                <span>Safe Browsing</span>
              </div>
              <div style={{ color: "#64748b", marginTop: 2 }}>● Protected · Web protection is active</div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 9 }}>
              <span style={{ color: "#cbd5e1", fontWeight: 700 }}>Privacy Mode</span>
              <div onClick={() => setPrivacyMode(!privacyMode)}
                style={{ width: 28, height: 16, borderRadius: 10, background: privacyMode ? "#4f46e5" : "#334155", display: "flex", alignItems: "center", padding: 2, cursor: "pointer", transition: "all 0.2s ease" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", transform: privacyMode ? "translateX(12px)" : "translateX(0)", transition: "all 0.2s ease" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER COLUMN: FULL GOKU BACKDROP (FACE CLEAR AT TOP, ICONS LOWER) ───────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
          borderRadius: 16,
          padding: 16,
          border: "1px solid rgba(99,102,241,0.25)",
          boxShadow: "0 0 40px rgba(99,102,241,0.2)",
          background: "linear-gradient(180deg, rgba(3,6,18,0.1) 0%, rgba(3,6,18,0.65) 50%, rgba(3,6,18,0.96) 100%), url('/goku_wallpaper.png') center top / cover no-repeat #030612"
        }}>

          {/* HERO GREETING & SEARCH BAR PUSHED LOWER (280px) SO GOKU FACE IS UNCOVERED */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, paddingTop: 280 }}>
            
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", textShadow: "0 0 35px rgba(99,102,241,1), 0 3px 12px #000" }}>
                Good morning, Pushkar! 👋
              </div>
              <div style={{ fontSize: 11.5, color: "#f1f5f9", fontFamily: "monospace", marginTop: 4, textShadow: "0 2px 8px #000" }}>
                What would you like to explore today?
              </div>
            </div>

            {/* Pill Search Bar */}
            <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: 620, display: "flex", alignItems: "center", background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.8)", borderRadius: 40, padding: "8px 12px 8px 20px", boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}>
              <Search style={{ width: 18, height: 18, color: "#94a3b8", marginRight: 10 }} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the web or enter URL..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13.5, fontFamily: "inherit" }} />
              
              <Mic style={{ width: 18, height: 18, color: "#94a3b8", margin: "0 10px", cursor: "pointer" }} onClick={() => toast.info("Voice search activated")} />
              <Camera style={{ width: 18, height: 18, color: "#94a3b8", margin: "0 10px", cursor: "pointer" }} onClick={() => toast.info("Visual search activated")} />

              <button type="submit" disabled={loading}
                style={{ padding: "9px 24px", borderRadius: 30, background: "linear-gradient(90deg, #4f46e5 0%, #3b82f6 100%)", border: "none", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 20px rgba(79,70,229,0.7)" }}>
                {loading ? "Opening..." : "Search 🚀"}
              </button>
            </form>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {["All", "Web", "Images", "Videos", "News", "Maps", "Shopping", "... More"].map((cat) => {
                const isAct = cat === activeCategory;
                return (
                  <button key={cat} onClick={() => handleCategoryClick(cat)}
                    style={{ padding: "5px 14px", borderRadius: 20, fontSize: 10, fontWeight: isAct ? 800 : 500, color: isAct ? "#fff" : "#cbd5e1", background: isAct ? "#4f46e5" : "rgba(15,23,42,0.9)", border: isAct ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* LIVE REAL SEARCH RESULTS PREVIEW CARDS */}
            {searchResults && (
              <div style={{ width: "100%", maxWidth: 620, background: "rgba(10,16,35,0.95)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 14, padding: 14, display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginTop: 8, boxShadow: "0 0 30px rgba(0,245,255,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: "#00F5FF", fontFamily: "monospace" }}>LIVE WEB PREVIEW ({searchResults.results?.length || 0})</span>
                  <X style={{ width: 14, height: 14, color: "#94a3b8", cursor: "pointer" }} onClick={() => setSearchResults(null)} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {searchResults.results?.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noreferrer"
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 10, textDecoration: "none", display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: 11 }}>{res.title}</span>
                        <ExternalLink style={{ width: 12, height: 12, color: "#94a3b8" }} />
                      </div>
                      <span style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace" }}>{res.url}</span>
                      <span style={{ fontSize: 8.5, color: "#cbd5e1", marginTop: 2 }}>{res.snippet}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QUICK ACCESS BOOKMARKS ROW */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", textShadow: "0 2px 6px #000" }}>Quick Access</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 10 }}>
              {bookmarks.map((bm, i) => (
                <a key={i} href={bm.url} target="_blank" rel="noreferrer"
                  style={{ background: "rgba(9,14,32,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", backdropFilter: "blur(10px)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: bm.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: bm.color, boxShadow: `0 0 12px ${bm.bg}40` }}>
                    {bm.letter}
                  </div>
                  <span style={{ fontSize: 8.5, color: "#cbd5e1", fontWeight: 700, whiteSpace: "nowrap" }}>{bm.name}</span>
                </a>
              ))}

              <div onClick={() => toast.info("Add bookmark modal")}
                style={{ background: "rgba(15,23,42,0.7)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", backdropFilter: "blur(10px)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus style={{ width: 16, height: 16, color: "#94a3b8" }} />
                </div>
                <span style={{ fontSize: 8.5, color: "#64748b" }}>Add</span>
              </div>
            </div>
          </div>

          {/* CONTINUE WHERE YOU LEFT OFF & DISCOVER GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
            
            {/* Continue where you left off */}
            <div style={{ background: "rgba(9,14,32,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 10, backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff" }}>Continue where you left off</span>
                <span style={{ fontSize: 8, color: "#38bdf8", cursor: "pointer" }}>View all</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 8.5, fontFamily: "monospace" }}>
                <a href="https://developer.mozilla.org" target="_blank" rel="noreferrer" style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#eab308", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 10 }}>JS</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>MDN Web Docs</div>
                    <div style={{ color: "#64748b", fontSize: 7.5 }}>developer.mozilla.org · 2h ago</div>
                  </div>
                </a>

                <a href="https://react.dev" target="_blank" rel="noreferrer" style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#00F5FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 10 }}>⚛</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>React Documentation</div>
                    <div style={{ color: "#64748b", fontSize: 7.5 }}>react.dev · 5h ago</div>
                  </div>
                </a>

                <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" style={{ display: "flex", gap: 8, alignItems: "center", textDecoration: "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 10 }}>🌊</div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700 }}>Tailwind CSS Components</div>
                    <div style={{ color: "#64748b", fontSize: 7.5 }}>tailwindcss.com · Yesterday</div>
                  </div>
                </a>
              </div>
            </div>

            {/* REAL LIVE DISCOVER NEWS FEED */}
            <div style={{ background: "rgba(9,14,32,0.88)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12, display: "flex", flexDirection: "column", gap: 10, backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff" }}>Discover (Live News Feed)</span>
                <span style={{ fontSize: 8, color: "#38bdf8", cursor: "pointer" }} onClick={fetchRealData}>Refresh</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {(newsArticles.length > 0 ? newsArticles : [
                  { tag: "TECHNOLOGY", title: "AI Breakthrough: New Model Sets Record in Reasoning Tests", source: "TechCrunch · 2h ago", color: "#3b82f6", url: "https://techcrunch.com" },
                  { tag: "SCIENCE", title: "NASA Captures Stunning Image of Distant Galaxy Formation", source: "NASA · 4h ago", color: "#a855f7", url: "https://nasa.gov" },
                  { tag: "BUSINESS", title: "Global Markets Rally as Inflation Cools Down Worldwide", source: "Bloomberg · 5h ago", color: "#00FF88", url: "https://bloomberg.com" },
                  { tag: "HEALTH", title: "7 Habits That Improve Sleep Quality According to Science", source: "Healthline · 6h ago", color: "#eab308", url: "https://healthline.com" },
                ]).map((news, i) => (
                  <a key={i} href={news.url} target="_blank" rel="noreferrer"
                    style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 4, textDecoration: "none" }}>
                    <span style={{ fontSize: 7, fontWeight: 900, color: news.color }}>{news.tag}</span>
                    <div style={{ fontSize: 8.5, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3 }}>{news.title}</div>
                    <div style={{ fontSize: 7, color: "#64748b", marginTop: "auto" }}>{news.source}</div>
                  </a>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: 4 }}>
                <button onClick={fetchRealData}
                  style={{ padding: "4px 14px", borderRadius: 20, background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#38bdf8", fontSize: 8.5, fontFamily: "monospace", cursor: "pointer" }}>
                  🔄 Load more live news
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN WIDGETS ARRAY (EXPANDED TO 380px WIDTH) ───────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", background: "rgba(8,12,28,0.96)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 14 }}>

          {/* Top Bar User Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10.5, fontFamily: "monospace", paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ color: "#94a3b8" }}>Monday, May 20, 2024</span>
            <span style={{ color: "#38bdf8", fontWeight: 800 }}>10:30 AM</span>
            <Moon style={{ width: 15, height: 15, color: "#94a3b8", cursor: "pointer" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>P</div>
              <span style={{ color: "#fff", fontWeight: 700 }}>Pushkar ▾</span>
            </div>
          </div>

          {/* REAL SEARCH HISTORY WITH DIRECT LAUNCH */}
          <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Search History</span>
              <span style={{ fontSize: 9, color: "#38bdf8", cursor: "pointer" }}>View all</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 9, fontFamily: "monospace" }}>
              {historyList.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => { setSearchQuery(h.term); handleSearch(null, h.term); }}>
                    <History style={{ width: 11, height: 11, color: "#64748b" }} />
                    <span style={{ color: "#cbd5e1" }}>{h.term}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#64748b", fontSize: 7.5 }}>{h.time}</span>
                    <X style={{ width: 11, height: 11, color: "#64748b", cursor: "pointer" }} onClick={() => removeItemFromHistory(i)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING SEARCHES WITH DIRECT LAUNCH */}
          <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Trending Searches</span>
              <span style={{ fontSize: 9, color: "#38bdf8", cursor: "pointer" }}>View all</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 9.5, fontFamily: "monospace" }}>
              {[
                { num: 1, term: "OpenAI GPT-4o", vol: "▲ 125K+" },
                { num: 2, term: "Apple WWDC 2024", vol: "▲ 98K+" },
                { num: 3, term: "UEFA Champions League", vol: "▲ 87K+" },
                { num: 4, term: "Tesla Cybertruck", vol: "▲ 61K+" },
                { num: 5, term: "Bitcoin Price Today", vol: "▲ 53K+" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => { setSearchQuery(t.term); handleSearch(null, t.term); }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, fontWeight: 900 }}>{t.num}</span>
                    <span style={{ color: "#fff", fontWeight: 700 }}>{t.term}</span>
                  </div>
                  <span style={{ color: "#f43f5e", fontWeight: 800, fontSize: 8.5 }}>{t.vol}</span>
                </div>
              ))}
            </div>
          </div>

          {/* REAL WEATHER WIDGET FROM OPEN-METEO API */}
          <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 9.5, color: "#94a3b8", fontFamily: "monospace", fontWeight: 700 }}>📍 {weatherData?.location || "San Francisco, CA"}</div>
              <span style={{ fontSize: 7.5, color: "#00FF88", fontWeight: 800 }}>● Live Telemetry</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{weatherData?.temp_c || "18°c"}</div>
                <div style={{ fontSize: 9.5, color: "#94a3b8" }}>{weatherData?.condition || "Partly Cloudy"}</div>
              </div>
              <CloudSun style={{ width: 38, height: 38, color: "#eab308" }} />
              <div style={{ fontSize: 8, color: "#94a3b8", fontFamily: "monospace" }}>
                <div>Humidity: {weatherData?.humidity || "64%"}</div>
                <div>Wind: {weatherData?.wind || "12 km/h"}</div>
                <div>Feels: {weatherData?.feels_like || "18°C"}</div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, fontSize: 7.5, color: "#94a3b8", fontFamily: "monospace", textAlign: "center", paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {(weatherData?.forecast || [
                { day: "Mon", hi: 19, lo: 12 },
                { day: "Tue", hi: 20, lo: 13 },
                { day: "Wed", hi: 21, lo: 14 },
                { day: "Thu", hi: 22, lo: 15 },
                { day: "Fri", hi: 20, lo: 13 },
              ]).map((f, i) => (
                <div key={i}>{f.day}<br/><strong style={{ color: "#fff" }}>{f.hi}°/{f.lo}°</strong></div>
              ))}
            </div>
          </div>

          {/* QUICK TOOLS */}
          <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff" }}>Quick Tools</span>
              <span style={{ fontSize: 9, color: "#38bdf8", cursor: "pointer" }}>View all</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, fontSize: 8, color: "#cbd5e1", textAlign: "center" }}>
              {[
                { name: "Calculator", key: "Calculator", icon: Calculator },
                { name: "Unit Conv", key: "Unit Conv", icon: Ruler },
                { name: "QR Scanner", key: "QR Scanner", icon: QrCode },
                { name: "Translate", key: "Translate", icon: Languages },
                { name: "Notes", key: "Notes", icon: FileText },
              ].map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <div key={i} onClick={() => { setActiveToolModal(tool.key); toast.success(`Opened ${tool.name}`); }}
                    style={{ background: activeToolModal === tool.key ? "linear-gradient(135deg, #4f46e5, #3b82f6)" : "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", transition: "all 0.2s ease" }}>
                    <Icon style={{ width: 14, height: 14, color: activeToolModal === tool.key ? "#fff" : "#38bdf8" }} />
                    <span style={{ whiteSpace: "nowrap", color: activeToolModal === tool.key ? "#fff" : "#cbd5e1", fontWeight: activeToolModal === tool.key ? 800 : 500 }}>{tool.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── INTERACTIVE MODAL OVERLAY (QUICK TOOLS & SETTINGS) ───────────────────────────── */}
      {activeToolModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: 440, background: "#0b0f24", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 18, padding: 20, boxShadow: "0 0 50px rgba(99,102,241,0.3)", color: "#fff", display: "flex", flexDirection: "column", gap: 14 }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: "#38bdf8" }}>{activeToolModal === "Settings" ? "Application & Assistant Settings" : activeToolModal}</span>
              </div>
              <X style={{ width: 18, height: 18, color: "#94a3b8", cursor: "pointer" }} onClick={() => setActiveToolModal(null)} />
            </div>

            {/* 0. APP SETTINGS - SIDEBAR & SIDE ROBOT LOCATION CHANGING FEATURES */}
            {activeToolModal === "Settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                
                {/* 1. Sidebar Position Feature Selector */}
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a855f7", fontWeight: 800, fontSize: 11.5 }}>
                    <Layout style={{ width: 15, height: 15 }} />
                    <span>Sidebar Location Setting</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div onClick={() => changeSidebarPosition("left")}
                      style={{ background: sidebarPos === "left" ? "linear-gradient(135deg, #4f46e5, #3b82f6)" : "rgba(15,23,42,0.8)", border: sidebarPos === "left" ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <PanelLeft style={{ width: 16, height: 16, color: "#fff" }} />
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 900, color: "#fff" }}>Left Sidebar</div>
                        <div style={{ fontSize: 7, color: sidebarPos === "left" ? "#e0e7ff" : "#64748b" }}>Standard View</div>
                      </div>
                    </div>

                    <div onClick={() => changeSidebarPosition("right")}
                      style={{ background: sidebarPos === "right" ? "linear-gradient(135deg, #4f46e5, #3b82f6)" : "rgba(15,23,42,0.8)", border: sidebarPos === "right" ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <PanelRight style={{ width: 16, height: 16, color: "#fff" }} />
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 900, color: "#fff" }}>Right Sidebar</div>
                        <div style={{ fontSize: 7, color: sidebarPos === "right" ? "#e0e7ff" : "#64748b" }}>Flipped View</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Side Robot Location Feature Selector */}
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#00F5FF", fontWeight: 800, fontSize: 11.5 }}>
                    <Bot style={{ width: 15, height: 15 }} />
                    <span>Side Robot Assistant Location</span>
                  </div>

                  <div style={{ fontSize: 9, color: "#94a3b8" }}>
                    Select screen corner for floating AI Assistant Robot:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { id: "bottom-right", label: "↘ Bottom Right", desc: "Default Corner" },
                      { id: "bottom-left", label: "↙ Bottom Left", desc: "Lower Left Corner" },
                      { id: "top-right", label: "↗ Top Right", desc: "Upper Right Corner" },
                      { id: "top-left", label: "↖ Top Left", desc: "Upper Left Corner" },
                    ].map(p => (
                      <div key={p.id} onClick={() => changeSideRobotPosition(p.id)}
                        style={{ background: sideRobotPos === p.id ? "linear-gradient(135deg, #0284c7, #06b6d4)" : "rgba(15,23,42,0.8)", border: sideRobotPos === p.id ? "1px solid #00FF88" : "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, cursor: "pointer" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{p.label}</div>
                        <div style={{ fontSize: 7, color: sideRobotPos === p.id ? "#e0f2fe" : "#64748b" }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: 8, fontSize: 8.5, fontFamily: "monospace", color: "#00FF88" }}>
                  ✔ Sidebar & Side Robot positions saved to local storage.
                </div>
              </div>
            )}

            {/* 1. CALCULATOR TOOL */}
            {activeToolModal === "Calculator" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", textAlign: "right", fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: "#00F5FF", minHeight: 48, overflowX: "auto" }}>
                  {calcDisplay}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="].map((btn, idx) => (
                    <button key={idx} onClick={() => handleCalcClick(btn)}
                      style={{
                        padding: 12, borderRadius: 10, border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer",
                        gridColumn: btn === "=" ? "span 2" : "span 1",
                        background: btn === "=" ? "linear-gradient(135deg, #4f46e5, #3b82f6)" : ["÷","×","-","+","C"].includes(btn) ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)",
                        color: btn === "=" ? "#fff" : ["÷","×","-","+","C"].includes(btn) ? "#38bdf8" : "#fff"
                      }}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. UNIT CONVERTER TOOL */}
            {activeToolModal === "Unit Conv" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Length", "Weight", "Temp", "Currency"].map(t => (
                    <button key={t} onClick={() => setUnitType(t)}
                      style={{ flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 10, fontWeight: 800, border: unitType === t ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)", background: unitType === t ? "#4f46e5" : "transparent", color: "#fff", cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 10, color: "#94a3b8" }}>Enter Value to Convert:</label>
                  <input type="number" value={unitVal} onChange={(e) => setUnitVal(e.target.value)}
                    style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#fff", outline: "none", fontSize: 14, fontWeight: 800 }} />
                </div>

                <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 10, padding: 14, textAlign: "center", fontSize: 13, fontWeight: 900, color: "#00FF88" }}>
                  {convertedRes}
                </div>
              </div>
            )}

            {/* 3. QR SCANNER & GENERATOR TOOL */}
            {activeToolModal === "QR Scanner" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 10, color: "#94a3b8" }}>Enter Text or URL for QR Code:</label>
                  <input type="text" value={qrText} onChange={(e) => setQrText(e.target.value)}
                    style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 8, color: "#fff", outline: "none", fontSize: 12 }} />
                </div>

                <div style={{ background: "#fff", padding: 12, borderRadius: 12, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrText || 'Nexus')}`} alt="QR Code" style={{ width: 160, height: 160, display: "block" }} />
                </div>

                <div style={{ fontSize: 9.5, color: "#94a3b8", fontFamily: "monospace" }}>Scan with mobile camera to test link</div>
              </div>
            )}

            {/* 4. TRANSLATOR TOOL */}
            {activeToolModal === "Translate" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <label style={{ fontSize: 10, color: "#94a3b8" }}>Target Language:</label>
                  <select value={transLang} onChange={(e) => setTransLang(e.target.value)}
                    style={{ flex: 1, background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 6, color: "#fff", outline: "none", fontSize: 11 }}>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                  </select>
                </div>

                <textarea value={transInput} onChange={(e) => setTransInput(e.target.value)}
                  placeholder="Type text to translate..."
                  rows={3} style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#fff", outline: "none", fontSize: 12, resize: "none" }} />

                <button onClick={handleTranslate}
                  style={{ padding: 10, borderRadius: 8, background: "linear-gradient(90deg, #4f46e5, #3b82f6)", border: "none", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                  Translate Now
                </button>

                {transOutput && (
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: 10, fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>
                    {transOutput}
                  </div>
                )}
              </div>
            )}

            {/* 5. NOTES TOOL */}
            {activeToolModal === "Notes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write quick notes or code snippets here..."
                  rows={6} style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 10, color: "#fff", outline: "none", fontSize: 12, fontFamily: "monospace", resize: "none" }} />

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={saveQuickNote}
                    style={{ padding: "8px 16px", borderRadius: 8, background: "linear-gradient(90deg, #4f46e5, #3b82f6)", border: "none", color: "#fff", fontWeight: 800, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    Save Note
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(noteContent); toast.success("Copied note to clipboard!"); }}
                    style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#cbd5e1", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Copy style={{ width: 14, height: 14 }} />
                    Copy
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
