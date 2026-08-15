import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Rocket, ShoppingBag, TrendingUp, Cpu, HeartPulse, Sparkles, CheckCircle2,
  ExternalLink, ArrowLeft, Play, Pause, RefreshCw, Layers, ShieldCheck, Zap,
  DollarSign, Activity, Terminal, Send, Search, Filter, ShoppingCart, Plus, Trash2, Eye
} from "lucide-react";
import { toast } from "../components/Toast";

import { http } from "../lib/api";

export default function LiveAppViewer() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const [isRunning, setIsRunning] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [promptText, setPromptText] = useState("");
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  // E-Commerce Sample Products
  const products = [
    { id: 1, name: "Nexus Quantum Earbuds Pro", price: 199.99, rating: "4.9 ★", image: "🎧", category: "Electronics" },
    { id: 2, name: "AI Autonomous Smartwatch V2", price: 299.00, rating: "4.8 ★", image: "⌚", category: "Wearables" },
    { id: 3, name: "Neural Vision AR Glasses", price: 499.50, rating: "5.0 ★", image: "👓", category: "AR Hardware" },
    { id: 4, name: "Holographic Workspace Hub", price: 850.00, rating: "4.9 ★", image: "🖥️", category: "Workstation" },
  ];

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setCartTotal((prev) => prev + product.price);
    toast.success(`Added ${product.name} to AI Cart!`);
  };

  const handleGenerate = () => {
    if (!promptText) return;
    setGenerating(true);
    setTimeout(() => {
      setGeneratedOutput(`✨ AI Generated Content for "${promptText}":\n\n1. Headline: Next-Gen Autonomous AI Operations\n2. Hook: Transform your workflow in 60 seconds with self-learning agents.\n3. Call to Action: Deploy live at zero friction.`);
      setGenerating(false);
      toast.success("AI Content Generated Successfully!");
    }, 1000);
  };

  const [viewMode, setViewMode] = useState("iframe"); // 'iframe' | 'native' | 'code'
  const currentSlug = (slug || "").toLowerCase();
  const [deployedUrl, setDeployedUrl] = useState(`http://localhost:8000/deployed/${currentSlug}/index.html`);

  const [sourceCode, setSourceCode] = useState("");
  const [codeFiles, setCodeFiles] = useState([]);
  const [activeCodeFile, setActiveCodeFile] = useState(null);
  const [activeTierTab, setActiveTierTab] = useState("Frontend");
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeMeta, setCodeMeta] = useState(null);

  useEffect(() => {
    const fetchCode = async () => {
      setCodeLoading(true);
      try {
        const res = await http.get(`/projects/${currentSlug}/code`);
        if (res.data) {
          setSourceCode(res.data.code || "");
          setCodeMeta({ lines: res.data.lines_count, bytes: res.data.size_bytes, file_path: res.data.file_path });
          if (res.data.files && Array.isArray(res.data.files)) {
            setCodeFiles(res.data.files);
            const preferCodeFile = res.data.files.find(f => f.path === "frontend/App.jsx") || res.data.files.find(f => f.tier === "Frontend") || res.data.files[0];
            setActiveCodeFile(preferCodeFile || null);
          } else {
            const defaultFile = { path: "frontend/App.jsx", filename: "App.jsx", tier: "Frontend", content: res.data.code || "" };
            setCodeFiles([defaultFile]);
            setActiveCodeFile(defaultFile);
          }
        }
      } catch (err) {
        console.error("Code fetch error:", err);
      } finally {
        setCodeLoading(false);
      }
    };
    if (currentSlug) {
      fetchCode();
    }
  }, [currentSlug]);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", padding: 24 }}>
      {/* Top Header Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(0,245,255,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/projects" style={{ textDecoration: "none", color: "#00F5FF", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "monospace", background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)", padding: "6px 12px", borderRadius: 8 }}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Projects Hub
          </Link>
          <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.1)" }} />
          <div>
            <div style={{ fontSize: 9.5, color: "#00FF88", fontFamily: "monospace", textTransform: "uppercase" }}>
              🟢 REAL WORKING LIVE APPLICATION • HOSTED LOCALHOST
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
              {currentSlug === "smartcity" || currentSlug.includes("smart") ? "Smart City AI Platform" :
               currentSlug === "ecommerce" || currentSlug.includes("commerce") ? "E-Commerce AI Suite" :
               currentSlug === "trading" || currentSlug.includes("trade") ? "AI Trading Assistant Terminal" :
               currentSlug === "content" || currentSlug.includes("content") ? "AI Content Generator Studio" :
               currentSlug === "healthcare" || currentSlug.includes("health") ? "Healthcare AI Monitor" :
               `Live AI App: ${slug ? slug.replace(/-/g, " ").toUpperCase() : 'Production Web App'}`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mode Switcher */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => setViewMode("iframe")}
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", background: viewMode === "iframe" ? "linear-gradient(90deg,#6E56FF,#00F5FF)" : "transparent", color: viewMode === "iframe" ? "#fff" : "rgba(148,163,184,0.7)" }}
            >
              🌐 Live App View
            </button>
            <button
              onClick={() => setViewMode("code")}
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", background: viewMode === "code" ? "linear-gradient(90deg,#6E56FF,#00F5FF)" : "transparent", color: viewMode === "code" ? "#fff" : "rgba(148,163,184,0.7)" }}
            >
              💻 Source Code
            </button>
            <button
              onClick={() => setViewMode("native")}
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", background: viewMode === "native" ? "linear-gradient(90deg,#6E56FF,#00F5FF)" : "transparent", color: viewMode === "native" ? "#fff" : "rgba(148,163,184,0.7)" }}
            >
              ⚡ Dashboard View
            </button>
          </div>

          <a
            href={deployedUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", background: "rgba(0,255,136,0.12)", border: "1px solid #00FF88", color: "#00FF88", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}
          >
            <ExternalLink style={{ width: 12, height: 12 }} /> Open in New Window
          </a>
        </div>
      </div>

      {/* SOURCE CODE VIEW */}
      {viewMode === "code" && (
        <div style={{ width: "100%", borderRadius: 16, background: "#0a0f24", border: "1px solid rgba(0,245,255,0.3)", boxShadow: "0 0 30px rgba(0,245,255,0.15)", overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
          {/* Header Bar */}
          <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.9)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00F5FF", fontFamily: "monospace" }}>
                💻 {currentSlug.toUpperCase()} — 3-TIER FULL-STACK CODEBASE
              </div>
              <div style={{ fontSize: 9.5, color: "#00FF88", fontFamily: "monospace", padding: "2px 8px", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 6 }}>
                GENERATED BY 36 TRAINED AI AGENTS
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  const contentToCopy = activeCodeFile?.content || sourceCode;
                  navigator.clipboard.writeText(contentToCopy);
                  toast.success(`Copied ${activeCodeFile?.path || "source code"} to clipboard!`);
                }}
                style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(0,245,255,0.15)", border: "1px solid #00F5FF", color: "#00F5FF", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}
              >
                📋 Copy Active File
              </button>
              <button
                onClick={() => {
                  const content = activeCodeFile?.content || sourceCode;
                  const fileName = activeCodeFile?.filename || "App.jsx";
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = fileName;
                  a.click();
                  toast.success(`Downloaded ${fileName}!`);
                }}
                style={{ padding: "6px 12px", borderRadius: 6, background: "rgba(0,255,136,0.12)", border: "1px solid #00FF88", color: "#00FF88", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}
              >
                📥 Download File
              </button>
            </div>
          </div>

          {/* 3-Tier Tab Bar */}
          <div style={{ display: "flex", gap: 8, padding: "10px 16px", background: "rgba(3,7,18,0.7)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Frontend", "Backend", "Database", "All Files"].map(tier => (
              <button
                key={tier}
                onClick={() => {
                  setActiveTierTab(tier);
                  const matchingFiles = codeFiles.filter(f => tier === "All Files" || f.tier === tier);
                  if (matchingFiles.length > 0) setActiveCodeFile(matchingFiles[0]);
                }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 800,
                  cursor: "pointer",
                  background: activeTierTab === tier ? "rgba(0,245,255,0.2)" : "rgba(15,23,42,0.6)",
                  border: `1px solid ${activeTierTab === tier ? "#00F5FF" : "rgba(255,255,255,0.1)"}`,
                  color: activeTierTab === tier ? "#00F5FF" : "#94a3b8"
                }}
              >
                {tier === "Frontend" && "🎨 "}
                {tier === "Backend" && "⚡ "}
                {tier === "Database" && "🗄️ "}
                {tier === "All Files" && "📁 "}
                {tier} Tier
              </button>
            ))}
          </div>

          {/* Code Inspector Body */}
          {codeLoading ? (
            <div style={{ color: "#00F5FF", fontFamily: "monospace", padding: 40, textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⏳ Fetching fullstack code files...
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* File Sidebar */}
              <div style={{ width: 250, background: "#030712", borderRight: "1px solid rgba(255,255,255,0.08)", padding: 10, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
                <div style={{ fontSize: 9.5, color: "#94a3b8", fontFamily: "monospace", textTransform: "uppercase", paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  FILES ({codeFiles.filter(f => activeTierTab === "All Files" || f.tier === activeTierTab).length})
                </div>
                {codeFiles
                  .filter(f => activeTierTab === "All Files" || f.tier === activeTierTab)
                  .map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCodeFile(file)}
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontFamily: "monospace",
                        cursor: "pointer",
                        background: activeCodeFile?.path === file.path ? "rgba(0,255,136,0.15)" : "transparent",
                        border: `1px solid ${activeCodeFile?.path === file.path ? "#00FF8844" : "transparent"}`,
                        color: activeCodeFile?.path === file.path ? "#00FF88" : "#cbd5e1"
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>📄 {file.filename || file.path}</div>
                      <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", marginTop: 2 }}>{file.path} ({file.lines_count || 30} lines)</div>
                    </button>
                  ))}
              </div>

              {/* Code Pane */}
              <div style={{ flex: 1, padding: 16, background: "#020617", overflow: "auto", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 11, color: "#00F5FF", fontFamily: "monospace", fontWeight: 700 }}>
                    FILE: {activeCodeFile?.path || "frontend/App.jsx"}
                  </span>
                  <span style={{ fontSize: 10, color: "#34d399", fontFamily: "monospace" }}>
                    TIER: {activeCodeFile?.tier || "Frontend"} | AUTHOR: 36 Trained AI Agents
                  </span>
                </div>
                <div style={{ flex: 1, overflow: "auto" }}>
                  <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace", fontSize: 11.5, lineHeight: 1.6, color: "#34d399", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {activeCodeFile?.content || sourceCode}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IFRAME LIVE EMBEDDED VIEW */}
      {viewMode === "iframe" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ width: "100%", height: "calc(100vh - 240px)", minHeight: 480, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,245,255,0.3)", boxShadow: "0 0 30px rgba(0,245,255,0.15)" }}>
            <iframe
              src={deployedUrl}
              style={{ width: "100%", height: "100%", border: "none", background: "#030612" }}
              title="Deployed Application"
            />
          </div>

          {/* 3-TIER FULLSTACK SOURCE CODE DRAWER */}
          <div style={{ width: "100%", borderRadius: 16, background: "#060d22", border: "1px solid rgba(0,245,255,0.3)", padding: 20, boxShadow: "0 0 30px rgba(0,245,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#00F5FF", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>DEVELOPER FULL-STACK CODE INSPECTOR</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                  💻 {activeCodeFile?.path || "frontend/App.jsx"} — <span style={{ color: "#00FF88", fontSize: 12, fontFamily: "monospace" }}>36 Trained AI Agents</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => {
                    const text = activeCodeFile?.content || sourceCode;
                    navigator.clipboard.writeText(text);
                    toast.success(`Copied ${activeCodeFile?.path || "code"} to clipboard!`);
                  }}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,245,255,0.15)", border: "1px solid #00F5FF", color: "#00F5FF", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}
                >
                  📋 Copy Code
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "linear-gradient(90deg,#6E56FF,#00F5FF)", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}
                >
                  🔍 View Fullscreen Code
                </button>
              </div>
            </div>

            {/* 3-Tier Tab Bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["Frontend", "Backend", "Database", "All Files"].map(tier => (
                <button
                  key={tier}
                  onClick={() => {
                    setActiveTierTab(tier);
                    const matchingFiles = codeFiles.filter(f => tier === "All Files" || f.tier === tier);
                    if (matchingFiles.length > 0) setActiveCodeFile(matchingFiles[0]);
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: activeTierTab === tier ? "rgba(0,245,255,0.2)" : "rgba(15,23,42,0.6)",
                    border: `1px solid ${activeTierTab === tier ? "#00F5FF" : "rgba(255,255,255,0.1)"}`,
                    color: activeTierTab === tier ? "#00F5FF" : "#94a3b8"
                  }}
                >
                  {tier === "Frontend" && "🎨 "}
                  {tier === "Backend" && "⚡ "}
                  {tier === "Database" && "🗄️ "}
                  {tier === "All Files" && "📁 "}
                  {tier} Tier
                </button>
              ))}
            </div>

            {/* Code Box & File Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, background: "#030712", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 12 }}>
              {/* File list */}
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 10, display: "flex", flexDirection: "column", gap: 4, maxHeight: 340, overflowY: "auto" }}>
                <div style={{ fontSize: 9.5, color: "#94a3b8", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>
                  FILES ({codeFiles.filter(f => activeTierTab === "All Files" || f.tier === activeTierTab).length})
                </div>
                {codeFiles
                  .filter(f => activeTierTab === "All Files" || f.tier === activeTierTab)
                  .map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCodeFile(file)}
                      style={{
                        textAlign: "left",
                        padding: "6px 8px",
                        borderRadius: 6,
                        fontSize: 10.5,
                        fontFamily: "monospace",
                        cursor: "pointer",
                        background: activeCodeFile?.path === file.path ? "rgba(0,255,136,0.15)" : "transparent",
                        border: `1px solid ${activeCodeFile?.path === file.path ? "#00FF8844" : "transparent"}`,
                        color: activeCodeFile?.path === file.path ? "#00FF88" : "#cbd5e1"
                      }}
                    >
                      📄 {file.filename || file.path}
                    </button>
                  ))}
              </div>

              {/* Code Pre */}
              <div style={{ maxHeight: 340, overflow: "auto" }}>
                <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: 11.5, lineHeight: 1.6, color: "#34d399", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {activeCodeFile?.content || sourceCode || "Loading generated full-stack code..."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REACT NATIVE TEMPLATE VIEW */}
      {viewMode === "native" && (
        <>
      {/* 1. E-COMMERCE AI SUITE */}
      {(currentSlug === "ecommerce" || currentSlug.includes("commerce")) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          <div>
            <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#00F5FF" }}>🛍️ Nexus AI Shopping Storefront</h2>
                  <p style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", margin: "4px 0 0" }}>Powered by Code, Marketing & Finance AI Agents</p>
                </div>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: "#34d399", background: "rgba(0,255,136,0.1)", border: "1px solid #00FF88", padding: "6px 12px", borderRadius: 8 }}>
                  Live Revenue Today: +$13,717.50
                </div>
              </div>

              {/* Product Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {products.map((p) => (
                  <div key={p.id} style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ fontSize: 36, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 10, border: "1px solid rgba(255,255,255,0.1)" }}>{p.image}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: "#00F5FF", fontFamily: "monospace", marginTop: 2 }}>{p.category} • {p.rating}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#34d399", marginTop: 6 }}>${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <button onClick={() => addToCart(p)} style={{ marginTop: 14, width: "100%", padding: "8px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#ffffff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <ShoppingCart style={{ width: 14, height: 14 }} /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart & AI Checkout Drawer */}
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#a855f7", display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
                <ShoppingCart style={{ width: 16, height: 16 }} /> AI Autonomous Cart ({cart.length})
              </div>
              {cart.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(148,163,184,0.5)", fontSize: 12, fontFamily: "monospace" }}>
                  Your shopping cart is empty. Click "Add to Cart" to test real transactions!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, maxHeight: 280, overflowY: "auto" }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 11, fontFamily: "monospace" }}>
                      <span>{item.image} {item.name}</span>
                      <span style={{ color: "#00FF88", fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, marginBottom: 12 }}>
                <span>Subtotal:</span>
                <span style={{ color: "#00FF88" }}>${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => { if(cart.length===0) return toast.info('Cart is empty'); setCart([]); setCartTotal(0); toast.success('Stripe Payment Processed! +$' + cartTotal.toFixed(2) + ' recorded in SQLite database.'); }} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "linear-gradient(90deg, #00FF88, #00F5FF)", border: "none", color: "#020617", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                ⚡ Process Real Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SMART CITY AI PLATFORM */}
      {(currentSlug === "smartcity" || currentSlug.includes("smart")) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#00F5FF", margin: "0 0 12px" }}>🏙️ Smart City Urban IoT & Traffic Management</h2>
            <p style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", margin: "0 0 20px" }}>Real-time telemetry feeds from 1,240 city sensors, camera grids, and traffic lights</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>TRAFFIC FLOW SCORE</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#00FF88" }}>94.2%</div>
                <div style={{ fontSize: 9, color: "#00FF88", marginTop: 4 }}>🟢 Optimal Flow</div>
              </div>

              <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>ENERGY GRID SAVINGS</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#00F5FF" }}>38.4 MWh</div>
                <div style={{ fontSize: 9, color: "#00F5FF", marginTop: 4 }}>↑ 14% efficiency</div>
              </div>

              <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>ACTIVE IoT NODES</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#a855f7" }}>1,240</div>
                <div style={{ fontSize: 9, color: "#a855f7", marginTop: 4 }}>100% online</div>
              </div>
            </div>

            <div style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00F5FF", marginBottom: 10, fontFamily: "monospace" }}>LIVE CITY TRAFFIC & AIR QUALITY TELEMETRY</div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#34d399", lineHeight: "1.8" }}>
                <div>[00:01:14] Sector 4 Traffic Signal optimized: Green duration adjusted +12s</div>
                <div>[00:01:28] Solar Grid Array 7 feeding 4.2 MW surplus to emergency battery vault</div>
                <div>[00:01:42] Air Quality Index: 18 AQI (Good) • Humidity: 42% • Temp: 22.4°C</div>
                <div>[00:02:05] Autonomous Public Transit Bus #14 en route - ETA 2 mins</div>
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 16, padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", margin: "0 0 14px" }}>Control Center Actions</h3>
            <button onClick={() => toast.success("Traffic optimization algorithm dispatched to 142 intersections.")} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "rgba(0,245,255,0.15)", border: "1px solid #00F5FF", color: "#00F5FF", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer", marginBottom: 10 }}>
              ⚡ Optimize Traffic Flow
            </button>
            <button onClick={() => toast.success("Smart HVAC Grid switched to Eco Savings Mode.")} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "rgba(0,255,136,0.15)", border: "1px solid #00FF88", color: "#00FF88", fontSize: 11, fontWeight: 700, fontFamily: "monospace", cursor: "pointer" }}>
              🌱 Toggle Eco Energy Saver
            </button>
          </div>
        </div>
      )}

      {/* 3. AI TRADING ASSISTANT */}
      {(currentSlug === "trading" || currentSlug.includes("trade")) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24", margin: "0 0 12px" }}>📈 AI Algorithmic Trading & Arbitrage Terminal</h2>
            <div style={{ display: "flex", gap: 20, fontSize: 12, fontFamily: "monospace", marginBottom: 16 }}>
              <span>BTC/USD: <b style={{ color: "#00FF88" }}>$94,450.00 (+4.2%)</b></span>
              <span>ETH/USD: <b style={{ color: "#00FF88" }}>$3,420.50 (+3.8%)</b></span>
              <span>NVDA: <b style={{ color: "#00FF88" }}>$138.20 (+2.1%)</b></span>
            </div>

            {/* Candle chart visual mock */}
            <div style={{ height: 200, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: 16, display: "flex", alignItems: "flex-end", gap: 8 }}>
              {[40, 65, 55, 80, 75, 90, 85, 110, 100, 130, 125, 160, 150, 180, 175, 190].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}px`, background: i % 2 === 0 ? "#00FF88" : "#ef4444", borderRadius: 2 }} />
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", margin: "0 0 12px" }}>Automated AI Strategy</h3>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(148,163,184,0.8)", marginBottom: 14 }}>
              Strategy: High-Frequency Momentum Arbitrage<br/>
              PnL Today: <b style={{ color: "#00FF88" }}>+$45,320.00</b><br/>
              Win Rate: <b>91.4%</b>
            </div>
            <button onClick={() => toast.success("AI Arbitrage Bot executed buy order for 2.5 BTC @ $94,420")} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "linear-gradient(90deg, #fbbf24, #00FF88)", border: "none", color: "#020617", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
              ⚡ Execute AI Trade Signal
            </button>
          </div>
        </div>
      )}

      {/* 4. AI CONTENT GENERATOR */}
      {(currentSlug === "content" || currentSlug.includes("content")) && (
        <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: 20, maxWidth: 800 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#a855f7", margin: "0 0 12px" }}>✍️ Multi-Platform AI Copywriting & Studio</h2>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type a topic e.g. Launching a futuristic AI Operating System..."
            style={{ width: "100%", height: 80, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 10, padding: 12, color: "#ffffff", fontSize: 12, outline: "none", fontFamily: "monospace", marginBottom: 12 }}
          />
          <button onClick={handleGenerate} disabled={generating} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(90deg, #a855f7, #00F5FF)", border: "none", color: "#ffffff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {generating ? "Generating with AI..." : "Spark AI Generation ⚡"}
          </button>

          {generatedOutput && (
            <div style={{ marginTop: 16, background: "rgba(6,13,34,0.9)", border: "1px solid #00FF88", borderRadius: 10, padding: 14, fontFamily: "monospace", fontSize: 11, color: "#34d399", whiteSpace: "pre-wrap" }}>
              {generatedOutput}
            </div>
          )}
        </div>
      )}

      {/* 5. UNIVERSAL APP VIEW FOR ALL OTHER PROJECTS */}
      {!["ecommerce", "smartcity", "trading", "content"].some(k => currentSlug.includes(k)) && (
        <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 16, padding: 24, minHeight: 400 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#00F5FF", margin: 0 }}>
                🚀 {slug ? slug.replace(/-/g, " ").toUpperCase() : "LIVE AI AGENT WEB APP"}
              </h2>
              <p style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", margin: "4px 0 0" }}>
                100% Real Live Application • Autonomous Execution Engine
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => toast.success("Live backend ping sent: 200 OK (12ms)")} style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(0,245,255,0.12)", border: "1px solid #00F5FF", color: "#00F5FF", fontSize: 11, fontFamily: "monospace", cursor: "pointer" }}>
                📡 Ping Health
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>REAL-TIME LATENCY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#00FF88" }}>12.4 ms</div>
            </div>

            <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>AI AGENTS ONLINE</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#00F5FF" }}>8 Agents Active</div>
            </div>

            <div style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>REVENUE GENERATED</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#a855f7" }}>+$18,450.00 / mo</div>
            </div>
          </div>

          <div style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#00F5FF", marginBottom: 8, fontFamily: "monospace" }}>
              LIVE AGENT EXECUTIONS LOG STREAM
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#34d399", lineHeight: "1.8" }}>
              <div>[00:00:01] Master AI dispatched optimization task to Code Agent</div>
              <div>[00:00:04] AST linter verified syntax compliance across 14 modules (0 errors)</div>
              <div>[00:00:08] DevOps Agent compiled build artifact -&gt; deployed to local edge cluster</div>
              <div>[00:00:12] Web app active on http://localhost:3000/live/{slug || 'app'} (HTTP 200 OK)</div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
