import React, { useState, useEffect } from "react";
import {
  Search, Bell, MessageSquare, Settings, Menu, ArrowUpRight, ChevronDown,
  DollarSign, Target, Users, Filter, Crown, Rocket,
  UserCheck, ChevronRight, Sparkles, LayoutGrid, Award,
  Mail, Workflow, MapPin, Brain, Megaphone, FileText, Monitor, Layers,
  Compass, Share2, BarChart2, Heart, Zap, Globe, Plus, X,
  ShoppingBag, Store, PackageCheck, Video, Copy, Check, Play, Pause,
  RefreshCw, ShoppingCart, Tag, TrendingUp, ShieldCheck, CheckCircle2,
  AlertCircle, ExternalLink, Sliders
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, BarChart, Bar
} from "recharts";
import { toast } from "../components/Toast";
import { http } from "../lib/api";

// --- INITIAL TELEMETRY & CHART DATA ---
const CAMPAIGN_PERFORMANCE_DATA = [
  { day: "May 15", Revenue: 7.2, Clicks: 5.1, Conversions: 3.4 },
  { day: "May 16", Revenue: 9.8, Clicks: 6.8, Conversions: 4.2 },
  { day: "May 17", Revenue: 12.4, Clicks: 8.9, Conversions: 5.6 },
  { day: "May 18", Revenue: 10.1, Clicks: 7.4, Conversions: 4.8 },
  { day: "May 19", Revenue: 13.8, Clicks: 9.5, Conversions: 6.2 },
  { day: "May 20", Revenue: 11.5, Clicks: 8.1, Conversions: 5.1 },
  { day: "May 21", Revenue: 14.2, Clicks: 10.4, Conversions: 6.9 },
];

const CHANNEL_PERFORMANCE_DATA = [
  { name: "Google Ads & Shopping", value: 42.5, color: "#3b82f6" },
  { name: "Meta Ads (IG/FB)", value: 29.8, color: "#a855f7" },
  { name: "TikTok Shop", value: 15.4, color: "#ec4899" },
  { name: "Amazon SP-API", value: 8.3, color: "#f59e0b" },
  { name: "Shopify Storefront", value: 4.0, color: "#10b981" },
];

const AUDIENCE_COUNTRIES = [
  { country: "United States", share: 34.6, color: "#3b82f6" },
  { country: "United Kingdom", share: 18.2, color: "#a855f7" },
  { country: "Germany", share: 14.7, color: "#06b6d4" },
  { country: "Canada", share: 12.3, color: "#10b981" },
  { country: "Australia", share: 10.8, color: "#eab308" },
  { country: "India & APAC", share: 9.4, color: "#f97316" }
];

const NAV_SIDEBAR_SECTIONS = [
  {
    title: "CORE INTELLIGENCE",
    items: [
      { id: "dashboard", label: "Executive Dashboard", icon: LayoutGrid },
      { id: "products", label: "Product Scout & Catalog", icon: ShoppingCart, badge: "AI Scout" },
      { id: "ad_studio", label: "Multi-Platform Ad Studio", icon: Sparkles, badge: "Google & Apps" },
      { id: "live_dispatch", label: "Ad Posting & Channels", icon: Rocket, badge: "6 Platforms" },
    ],
  },
  {
    title: "CAMPAIGN MANAGEMENT",
    items: [
      { id: "campaigns", label: "Active Campaigns", icon: Megaphone },
      { id: "agent_training", label: "AI Marketing Agents", icon: Brain, badge: "Level 21" },
      { id: "analytics", label: "ROAS & Analytics", icon: BarChart2 },
      { id: "audience", label: "Audience & Targeting", icon: Users },
    ],
  },
];

export default function MarketingSuite() {
  // Navigation State
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [timeRange, setTimeRange] = useState("This Week");
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Product Catalog State
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scoutingProduct, setScoutingProduct] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Electronics & Gaming",
    niche: "Smart Devices",
    selling_price: 79.99,
    cost_price: 19.50,
    stock: 350,
    target_audience: "Tech Enthusiasts, Early Adopters (18-40)",
    image_url: "",
    usps: "Ultra-low latency wireless audio, 38-hr battery, Active noise cancellation",
    keywords: "gaming earbuds, wireless headphones, anc earbuds"
  });

  // Ad Generation State
  const [adTone, setAdTone] = useState("persuasive");
  const [promoCode, setPromoCode] = useState("NEXUS20");
  const [discountPct, setDiscountPct] = useState(20);
  const [generatingAds, setGeneratingAds] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [selectedAdTab, setSelectedAdTab] = useState("google_search");
  const [copiedKey, setCopiedKey] = useState(null);

  // Deployment & Channel State
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(["google_ads", "google_merchant", "shopify", "tiktok_shop"]);
  const [deployBudget, setDeployBudget] = useState(120);
  const [deployingAds, setDeployingAds] = useState(false);
  const [deployedCampaigns, setDeployedCampaigns] = useState([]);
  const [deploymentLogs, setDeploymentLogs] = useState([]);

  // Agent Training State
  const [marketingAgents, setMarketingAgents] = useState({});
  const [trainingAgents, setTrainingAgents] = useState(false);
  const [trainingEpochs, setTrainingEpochs] = useState(50);
  const [trainingLogs, setTrainingLogs] = useState([]);

  // Copilot State
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("TARGET AUDIENCE");
  const [copilotMsg, setCopilotMsg] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState(null);

  // Fetch Initial Marketing Data
  useEffect(() => {
    fetchProducts();
    fetchPlatforms();
    fetchCampaigns();
    fetchAgentStatus();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await http.get("/marketing/products");
      if (res.data?.status === "success" && res.data.products) {
        setProducts(res.data.products);
        if (!selectedProduct && res.data.products.length > 0) {
          setSelectedProduct(res.data.products[0]);
        }
      }
    } catch {
      // Fallback
    }
  };

  const fetchPlatforms = async () => {
    try {
      const res = await http.get("/marketing/platforms/status");
      if (res.data?.status === "success") {
        setPlatforms(res.data.platforms);
      }
    } catch {}
  };

  const fetchCampaigns = async () => {
    try {
      const res = await http.get("/marketing/campaigns");
      if (res.data?.status === "success") {
        setDeployedCampaigns(res.data.campaigns);
      }
    } catch {}
  };

  const fetchAgentStatus = async () => {
    try {
      const res = await http.get("/marketing/agents/status");
      if (res.data?.status === "success") {
        setMarketingAgents(res.data.agents);
      }
    } catch {}
  };

  // AI Product Scout
  const handleScoutProduct = async () => {
    setScoutingProduct(true);
    try {
      const res = await http.post("/marketing/products/scout");
      if (res.data?.status === "success" && res.data.product) {
        toast.success(`🎯 ${res.data.message}`);
        setProducts((prev) => [res.data.product, ...prev]);
        setSelectedProduct(res.data.product);
        // Auto generate ads for this freshly scouted product
        handleGenerateAds(res.data.product);
      }
    } catch {
      toast.error("Failed running AI Product Scout.");
    } finally {
      setScoutingProduct(false);
    }
  };

  // Add Custom Product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }
    try {
      const payload = {
        ...newProductForm,
        selling_price: Number(newProductForm.selling_price),
        cost_price: Number(newProductForm.cost_price),
        stock: Number(newProductForm.stock),
        usps: newProductForm.usps.split(",").map((s) => s.trim()).filter(Boolean),
        keywords: newProductForm.keywords.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await http.post("/marketing/products/add", payload);
      if (res.data?.status === "success") {
        toast.success(`✨ ${res.data.message}`);
        setProducts((prev) => [res.data.product, ...prev]);
        setSelectedProduct(res.data.product);
        setAddProductModal(false);
      }
    } catch {
      toast.error("Failed adding product to catalog.");
    }
  };

  // Generate Multi-Platform Ads
  const handleGenerateAds = async (prod = selectedProduct) => {
    if (!prod) {
      toast.error("Please select a product first.");
      return;
    }
    setGeneratingAds(true);
    try {
      const res = await http.post("/marketing/ads/generate", {
        product_id: prod.id,
        tone: adTone,
        promo_code: promoCode,
        discount_pct: Number(discountPct)
      });
      if (res.data?.status === "success" && res.data.ad_campaign) {
        setGeneratedCampaign(res.data.ad_campaign);
        toast.success(`🚀 Generated multi-platform ad package for '${prod.name}'!`);
        setActiveNavItem("ad_studio");
      }
    } catch {
      toast.error("Failed generating ad campaign.");
    } finally {
      setGeneratingAds(false);
    }
  };

  // Deploy Ads to Selling Apps & Google Platforms
  const handleDeployAds = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product to deploy.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform to publish ads.");
      return;
    }
    setDeployingAds(true);
    try {
      const res = await http.post("/marketing/ads/deploy", {
        product_id: selectedProduct.id,
        platforms: selectedPlatforms,
        daily_budget: Number(deployBudget)
      });
      if (res.data?.status === "success") {
        toast.success(`🎉 ${res.data.message}`);
        setDeployedCampaigns((prev) => [...res.data.deployed_campaigns, ...prev]);
        setDeploymentLogs(res.data.deployed_campaigns.flatMap((c) => c.logs || []));
        setActiveNavItem("live_dispatch");
      }
    } catch {
      toast.error("Failed deploying ad campaigns.");
    } finally {
      setDeployingAds(false);
    }
  };

  // Toggle Campaign (Pause / Resume)
  const handleToggleCampaign = async (campId) => {
    try {
      const res = await http.post(`/marketing/campaigns/${campId}/toggle`);
      if (res.data?.status === "success") {
        toast.info(res.data.message);
        setDeployedCampaigns((prev) =>
          prev.map((c) => (c.id === campId ? res.data.campaign : c))
        );
      }
    } catch {
      toast.error("Failed toggling campaign status.");
    }
  };

  // Train AI Marketing Agents
  const handleTrainAgents = async () => {
    setTrainingAgents(true);
    try {
      const res = await http.post("/marketing/agents/train", { iterations: Number(trainingEpochs) });
      if (res.data?.status === "success") {
        toast.success(`🧠 ${res.data.message}`);
        setMarketingAgents(res.data.agents);
        setTrainingLogs(res.data.training_logs || []);
      }
    } catch {
      toast.error("Failed training AI marketing agents.");
    } finally {
      setTrainingAgents(false);
    }
  };

  // Copy to clipboard helper
  const copyText = (text, key) => {
    navigator.clipboard.writeText(typeof text === "object" ? JSON.stringify(text, null, 2) : text);
    setCopiedKey(key);
    toast.success("📋 Copied ad copy to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Toggle Platform Checkbox
  const togglePlatform = (pId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  // AI Copilot
  const handleCopilotSubmit = async (e) => {
    e.preventDefault();
    if (!copilotMsg.trim()) return;
    setCopilotLoading(true);
    try {
      const res = await http.post("/marketing/copilot", { prompt: copilotMsg, action: selectedAction });
      if (res.data?.status === "success") {
        setCopilotResult(res.data);
        toast.success("✨ AI Marketing Copilot generated strategy!");
      }
    } catch {
      toast.error("Failed running AI Marketing Copilot.");
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070914] text-slate-100 font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* ── TOP HEADER BAR ───────────────────────────────────────── */}
      <header className="h-16 bg-[#0a0d1d]/90 backdrop-blur-md border-b border-indigo-500/20 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left branding */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0d1d] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">AI OS</span>
                <span className="text-slate-600">|</span>
                <h1 className="text-base font-extrabold tracking-wide text-white">MARKETING & ADS SUITE</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                  REAL-TIME DISPATCH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wider">Product Scout • Multi-Platform Ads • Google & Selling Apps Auto-Post</p>
            </div>
          </div>
        </div>

        {/* Global Quick Action Buttons in Header */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={handleScoutProduct}
            disabled={scoutingProduct}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${scoutingProduct ? "animate-spin" : ""}`} />
            <span>{scoutingProduct ? "Scouting Winning Products..." : "AI Product Scout"}</span>
          </button>

          <button
            onClick={() => {
              if (selectedProduct) handleGenerateAds(selectedProduct);
              else toast.info("Select a product to generate ads!");
            }}
            disabled={generatingAds}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition-all"
          >
            <Rocket className={`w-3.5 h-3.5 ${generatingAds ? "animate-spin" : ""}`} />
            <span>Generate Ads</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-72 hidden xl:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, Google Ads, TikTok Shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-[#11152d]/80 border border-slate-700/60 rounded-full pl-10 pr-4 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
          />
        </div>

        {/* Right utilities */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCopilotOpen(true)}
            className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/40 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <Brain className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <button
            onClick={() => toast.info(`${deployedCampaigns.length} active campaigns running across Google & Selling Apps`)}
            className="relative p-2 rounded-lg text-slate-300 hover:bg-indigo-500/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-purple-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center border border-[#0a0d1d]">
              {deployedCampaigns.length}
            </span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1.5px]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Marketing Head"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0d1d] rounded-full" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Head of Growth & Ads</div>
              <div className="text-[10px] text-slate-400 leading-tight">OMEGA Media Buyer</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT LAYOUT WITH INTEGRATED SIDEBAR ──────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT NAVIGATION SIDEBAR */}
        <aside className="w-64 bg-[#0a0d1f]/95 border-r border-indigo-500/15 p-4 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
          <div className="space-y-6 overflow-y-auto pr-1">
            {NAV_SIDEBAR_SECTIONS.map((sec, idx) => (
              <div key={idx}>
                <h3 className="text-[10px] font-bold text-slate-500 tracking-wider mb-2 px-3">
                  {sec.title}
                </h3>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeNavItem === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveNavItem(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                            : "text-slate-400 hover:text-slate-200 hover:bg-indigo-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            isActive ? "bg-white/20 text-white" : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && !item.badge && <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Active Platforms Status Card */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#121636] to-[#1c1844] border border-purple-500/30 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="text-xs font-bold text-white tracking-wide">6 PLATFORMS SYNCED</h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">LIVE</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-3">
              Google Ads, Shopping, Shopify, Amazon SP-API, Meta & TikTok Shop ready for 1-click posting.
            </p>
            <button
              onClick={() => setActiveNavItem("live_dispatch")}
              className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-300" />
              Manage Postings
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN DASHBOARD CANVAS */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-gradient-to-b from-[#070914] via-[#090d21] to-[#060815]">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-indigo-500/20 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
                  {activeNavItem === "dashboard" && "Executive Ad Performance & Growth"}
                  {activeNavItem === "products" && "🛍️ Product Selection & AI Sourcing Scout"}
                  {activeNavItem === "ad_studio" && "🚀 Multi-Platform Ad Copy & Creative Studio"}
                  {activeNavItem === "live_dispatch" && "📡 Selling Apps & Google Ad Posting Center"}
                  {activeNavItem === "campaigns" && "📊 Live Telemetry & Campaign ROAS"}
                  {activeNavItem === "agent_training" && "🧠 Autonomous Marketing AI Agent Trainer"}
                  {activeNavItem === "analytics" && "📈 Full Funnel Conversion Analytics"}
                  {activeNavItem === "audience" && "👥 Global Audience & Demographic Segments"}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous product sourcing, tailored ad copy generation, and instant multi-platform posting.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleScoutProduct}
                disabled={scoutingProduct}
                className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-2 shadow-lg"
              >
                <Sparkles className={`w-4 h-4 text-cyan-300 ${scoutingProduct ? "animate-spin" : ""}`} />
                <span>{scoutingProduct ? "Scouting..." : "Scout Trending Product"}</span>
              </button>

              <button
                onClick={() => setAddProductModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#131938] hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-bold text-indigo-200 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => {
                  if (selectedProduct) handleGenerateAds(selectedProduct);
                  else toast.info("Select a product to generate ads!");
                }}
                disabled={generatingAds}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>{generatingAds ? "Synthesizing Ads..." : "Launch Ad Studio"}</span>
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 1: EXECUTIVE DASHBOARD */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNavItem === "dashboard" && (
            <div className="space-y-6">
              {/* TOP STATS METRICS BAR (6 CARDS ACROSS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL REVENUE</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">$ 12.74M</div>
                  <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+24.8% vs last month</span>
                  </div>
                  <div className="h-8 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CAMPAIGN_PERFORMANCE_DATA}>
                        <Area type="monotone" dataKey="Revenue" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">BLENDED ROAS</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">6.42x</div>
                  <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+31.2% via AI Targeting</span>
                  </div>
                  <div className="h-8 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CAMPAIGN_PERFORMANCE_DATA}>
                        <Area type="monotone" dataKey="Conversions" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PRODUCTS SCOUTED</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">{products.length} Heroes</div>
                  <div className="text-[11px] font-medium text-cyan-400 flex items-center gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Avg Margin: 77.4%</span>
                  </div>
                  <div className="h-8 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CAMPAIGN_PERFORMANCE_DATA}>
                        <Area type="monotone" dataKey="Clicks" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">CONVERSION RATE</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Filter className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">6.85%</div>
                  <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+14.6% vs benchmark</span>
                  </div>
                  <div className="h-8 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CAMPAIGN_PERFORMANCE_DATA}>
                        <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">ACTIVE PLATFORMS</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">6 Channels</div>
                  <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Google & Apps Synced</span>
                  </div>
                  <div className="h-8 mt-2 flex items-center justify-around text-xs font-mono text-slate-400">
                    <span className="text-blue-400 font-bold">G</span>
                    <span className="text-purple-400 font-bold">M</span>
                    <span className="text-pink-400 font-bold">TT</span>
                    <span className="text-amber-400 font-bold">AZ</span>
                    <span className="text-emerald-400 font-bold">SH</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">AI AGENT LEVEL</span>
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Brain className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-tight">Lv. 21 Master</div>
                  <div className="text-[11px] font-medium text-cyan-400 flex items-center gap-1 mt-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>99.9% Policy Accuracy</span>
                  </div>
                  <div className="h-8 mt-2 flex items-center">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[88%] h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: PERFORMANCE CHARTS & 3D HOLOGRAM SUITE */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* 8 COLUMNS: REVENUE & CHANNEL DONUT */}
                <div className="xl:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* CAMPAIGN PERFORMANCE CHART (7 COLUMNS) */}
                    <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xs font-bold text-white tracking-wider uppercase">MULTI-CHANNEL AD REVENUE</h3>
                          <p className="text-[10px] text-slate-400">Google Ads vs Meta Ads vs TikTok Shop telemetry</p>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowTimeMenu(!showTimeMenu)}
                            className="px-3 py-1.5 rounded-lg bg-[#151a3a] border border-slate-700/60 text-xs text-slate-300 hover:text-white flex items-center gap-2"
                          >
                            <span>{timeRange}</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          {showTimeMenu && (
                            <div className="absolute right-0 mt-1 w-32 bg-[#151a3a] border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden text-xs">
                              {["This Week", "Last Week", "This Month", "Quarterly"].map((range) => (
                                <button
                                  key={range}
                                  onClick={() => {
                                    setTimeRange(range);
                                    setShowTimeMenu(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-indigo-600/30 text-slate-300 hover:text-white"
                                >
                                  {range}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-6 mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 bg-purple-500 rounded-full" />
                          <span className="text-slate-300">Revenue ($M)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                          <span className="text-slate-300">Clicks (K)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                          <span className="text-slate-300">Conversions</span>
                        </div>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CAMPAIGN_PERFORMANCE_DATA}>
                            <defs>
                              <linearGradient id="areaRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="areaClk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="M" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                borderRadius: "12px",
                                fontSize: "12px",
                              }}
                            />
                            <Area type="monotone" dataKey="Revenue" stroke="#a855f7" strokeWidth={2.5} fill="url(#areaRev)" />
                            <Area type="monotone" dataKey="Clicks" stroke="#06b6d4" strokeWidth={2.5} fill="url(#areaClk)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* CHANNEL PERFORMANCE DONUT (5 COLUMNS) */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-white tracking-wider uppercase">CHANNEL REVENUE SPLIT</h3>
                        <button
                          onClick={() => setActiveNavItem("live_dispatch")}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          View Platforms →
                        </button>
                      </div>

                      <div className="relative h-44 flex items-center justify-center my-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={CHANNEL_PERFORMANCE_DATA}
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {CHANNEL_PERFORMANCE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                borderRadius: "12px",
                                fontSize: "11px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <div className="text-base font-black text-white">$12.74M</div>
                          <div className="text-[10px] text-slate-400 font-medium">Blended Sales</div>
                        </div>
                      </div>

                      {/* Channel Breakdown List */}
                      <div className="space-y-1.5 text-xs">
                        {CHANNEL_PERFORMANCE_DATA.map((ch, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                              <span className="text-slate-300">{ch.name}</span>
                            </div>
                            <span className="font-bold text-slate-100">{ch.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE LIVE CAMPAIGNS PREVIEW TABLE */}
                  <div className="p-5 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-bold text-white tracking-wider uppercase">LIVE DEPLOYED AD CAMPAIGNS</h3>
                      </div>
                      <button
                        onClick={() => setActiveNavItem("campaigns")}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Open Campaign Manager →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-2 font-semibold">Campaign Name</th>
                            <th className="pb-2 font-semibold">Platform</th>
                            <th className="pb-2 font-semibold">Status</th>
                            <th className="pb-2 font-semibold">Budget</th>
                            <th className="pb-2 font-semibold">ROAS</th>
                            <th className="pb-2 font-semibold text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {deployedCampaigns.slice(0, 4).map((cmp) => (
                            <tr key={cmp.id} className="hover:bg-indigo-500/5 transition-colors">
                              <td className="py-2.5 font-medium text-slate-200 truncate max-w-[200px]">
                                {cmp.name}
                              </td>
                              <td className="py-2.5 text-slate-300">
                                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-cyan-300">
                                  {cmp.platform}
                                </span>
                              </td>
                              <td className="py-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  cmp.status === "Active"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  ● {cmp.status}
                                </span>
                              </td>
                              <td className="py-2.5 text-slate-300 font-mono">${cmp.daily_budget}/day</td>
                              <td className="py-2.5 text-emerald-400 font-bold font-mono">{cmp.roas}x</td>
                              <td className="py-2.5 text-right text-white font-bold font-mono">${cmp.revenue?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 4 COLUMNS: 3D HOLOGRAPHIC EXECUTIVE SUITE */}
                <div className="xl:col-span-4 flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#0e122b]/95 via-[#0b0e24] to-[#070a1a] border border-cyan-500/30 shadow-2xl relative overflow-hidden group min-h-[500px]">
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                        HOLOGRAPHIC MARKETING EXECUTIVE
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-bold text-cyan-300">
                      LIVE 3D
                    </span>
                  </div>

                  {/* 3D Hologram Mannequin & Action Buttons */}
                  <div className="relative flex-1 flex items-center justify-center select-none my-4">
                    <div className="w-52 h-72 rounded-full border border-cyan-400/30 bg-gradient-to-b from-cyan-500/5 via-blue-600/10 to-indigo-900/20 backdrop-blur-sm relative flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
                      <div className="absolute top-6 w-40 h-7 border border-cyan-400/40 rounded-[100%] shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-[spin_8s_linear_infinite]" />
                      <div className="absolute bottom-10 w-44 h-8 border border-purple-400/40 rounded-[100%] shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-[spin_12s_linear_infinite]" />

                      {/* Suit Mannequin Silhouette */}
                      <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">
                        <svg width="120" height="200" viewBox="0 0 140 240" fill="none">
                          <circle cx="70" cy="30" r="14" stroke="#38bdf8" strokeWidth="2" fill="#38bdf8" fillOpacity={0.3} strokeDasharray="3 3" />
                          <path d="M40 55 L70 70 L100 55 L115 110 L105 170 L70 175 L35 170 L25 110 Z" fill="#1e3a8a" fillOpacity={0.8} stroke="#38bdf8" strokeWidth="2" />
                          <path d="M62 55 L70 95 L78 55 Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
                          <path d="M37 172 L66 177 L64 235 L40 235 Z" fill="#1d4ed8" fillOpacity={0.8} stroke="#38bdf8" strokeWidth="1.5" />
                          <path d="M74 177 L103 172 L100 235 L76 235 Z" fill="#1d4ed8" fillOpacity={0.8} stroke="#38bdf8" strokeWidth="1.5" />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-cyan-500/40 via-blue-600/20 to-transparent border-t border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-2 z-20">
                      {[
                        { name: "TARGET AUDIENCE", icon: Target, color: "from-blue-600 to-indigo-600" },
                        { name: "BRANDING", icon: Award, color: "from-purple-600 to-pink-600" },
                        { name: "MESSAGING", icon: MessageSquare, color: "from-cyan-600 to-teal-600" },
                        { name: "ENGAGEMENT", icon: Heart, color: "from-indigo-600 to-purple-600" },
                        { name: "CONVERSION", icon: Zap, color: "from-emerald-600 to-teal-600" },
                      ].map((btn, idx) => {
                        const BtnIcon = btn.icon;
                        const isSelected = selectedAction === btn.name;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedAction(btn.name);
                              setCopilotMsg(`Optimize ${btn.name.toLowerCase()} for our active Google Ads and TikTok campaigns.`);
                              setCopilotOpen(true);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-lg ${
                              isSelected
                                ? `bg-gradient-to-r ${btn.color} text-white ring-2 ring-cyan-400 scale-105 shadow-cyan-500/30`
                                : "bg-[#111638]/90 text-slate-300 border border-slate-700/60 hover:border-cyan-400 hover:text-white"
                            }`}
                          >
                            <BtnIcon className="w-3.5 h-3.5" />
                            <span>{btn.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-400">
                    <span>AGENT: <strong className="text-cyan-300 font-bold">MEDIA BUYER AI</strong></span>
                    <span>STATUS: <strong className="text-emerald-400 font-bold">ACTIVE & OPTIMIZING</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 2: PRODUCT SELECTION & AI SCOUT HUB */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNavItem === "products" && (
            <div className="space-y-6">
              {/* Top Filter and Action Bar */}
              <div className="p-5 rounded-2xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    AI SOURCED PRODUCT CATALOG
                  </h3>
                  <p className="text-xs text-slate-400">Select any winning product below to generate and dispatch multi-platform ads.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleScoutProduct}
                    disabled={scoutingProduct}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                  >
                    <Sparkles className={`w-4 h-4 ${scoutingProduct ? "animate-spin" : ""}`} />
                    <span>{scoutingProduct ? "Scouting Winning Products..." : "Scout New Product"}</span>
                  </button>

                  <button
                    onClick={() => setAddProductModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-white text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Product</span>
                  </button>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      className={`p-5 rounded-3xl bg-gradient-to-b from-[#0e122b] to-[#090c21] border transition-all flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? "border-cyan-400 ring-2 ring-cyan-500/30 shadow-2xl shadow-cyan-500/20"
                          : "border-indigo-500/20 hover:border-indigo-500/50"
                      }`}
                    >
                      {/* Trend Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-extrabold text-emerald-300">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Trend Score: {prod.trend_score}/100</span>
                        </div>
                      </div>

                      {/* Image & Product Details */}
                      <div className="flex gap-4 mb-4">
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shrink-0">
                          <img
                            src={prod.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                            {prod.name}
                          </h4>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-base font-black text-emerald-400">${prod.selling_price}</span>
                            <span className="text-xs text-slate-400 line-through">Cost: ${prod.cost_price}</span>
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              {prod.margin_pct}% Margin
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            Audience: {prod.target_audience}
                          </p>
                        </div>
                      </div>

                      {/* Key USPs */}
                      <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                        {(prod.usps || []).slice(0, 2).map((usp, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px]">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{usp}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Platforms */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(prod.recommended_platforms || ["Google", "Shopify", "TikTok"]).map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#151a3a] text-[10px] font-mono text-slate-300 border border-slate-700">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            toast.info(`Selected '${prod.name}'`);
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                              : "bg-[#141838] text-slate-300 hover:text-white border border-slate-700/60"
                          }`}
                        >
                          {isSelected ? "✓ Active Product" : "Select Product"}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            handleGenerateAds(prod);
                          }}
                          className="py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Generate Ads</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 3: MULTI-PLATFORM AD COPY & CREATIVE STUDIO */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNavItem === "ad_studio" && (
            <div className="space-y-6">
              {/* Product & Tone Selector Bar */}
              <div className="p-5 rounded-3xl bg-[#0e122b]/95 border border-indigo-500/20 shadow-xl space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      MULTI-PLATFORM AD GENERATOR & COPYWRITER
                    </h3>
                    <p className="text-xs text-slate-400">
                      Generating platform-compliant ads for Google Search (RSA), Google Shopping, Shopify, Amazon, Meta Ads, and TikTok Shop.
                    </p>
                  </div>

                  <button
                    onClick={() => handleGenerateAds(selectedProduct)}
                    disabled={generatingAds}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${generatingAds ? "animate-spin" : ""}`} />
                    <span>{generatingAds ? "Synthesizing Ad Creative..." : "Re-Generate All Platforms"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                  {/* Select Product */}
                  <div>
                    <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">SELECTED PRODUCT</label>
                    <select
                      value={selectedProduct?.id || ""}
                      onChange={(e) => {
                        const found = products.find((p) => p.id === e.target.value);
                        if (found) {
                          setSelectedProduct(found);
                          handleGenerateAds(found);
                        }
                      }}
                      className="w-full bg-[#090c21] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.selling_price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">CREATIVE TONE</label>
                    <select
                      value={adTone}
                      onChange={(e) => setAdTone(e.target.value)}
                      className="w-full bg-[#090c21] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                    >
                      <option value="persuasive">High-Converting Persuasive</option>
                      <option value="viral">Viral TikTok & Gen-Z Hook</option>
                      <option value="luxury">Luxury & Premium Tech</option>
                      <option value="urgent">Urgent Scarcity & Limited Promo</option>
                    </select>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">PROMO CODE</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full bg-[#090c21] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">DISCOUNT %</label>
                    <input
                      type="number"
                      value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value))}
                      className="w-full bg-[#090c21] border border-slate-700/80 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Platform Preview Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-indigo-500/20">
                {[
                  { id: "google_search", name: "Google Search (RSA)", icon: Search, color: "text-blue-400" },
                  { id: "google_shopping", name: "Google Shopping / Merchant", icon: ShoppingBag, color: "text-cyan-400" },
                  { id: "shopify", name: "Shopify Storefront", icon: Store, color: "text-emerald-400" },
                  { id: "amazon", name: "Amazon Sponsored (SP-API)", icon: PackageCheck, color: "text-amber-400" },
                  { id: "meta", name: "Meta Ads (Instagram / FB)", icon: Share2, color: "text-purple-400" },
                  { id: "tiktok", name: "TikTok Shop & Spark Ads", icon: Video, color: "text-pink-400" },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = selectedAdTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedAdTab(tab.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40"
                          : "bg-[#0e122b]/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <TabIcon className={`w-4 h-4 ${tab.color}`} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Generated Ad Content Display */}
              {generatedCampaign && generatedCampaign.platforms && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* LEFT 7 COLUMNS: STRUCTURED AD COPY ASSETS */}
                  <div className="xl:col-span-7 space-y-4">
                    
                    {/* GOOGLE SEARCH ADS TAB */}
                    {selectedAdTab === "google_search" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-blue-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                            GOOGLE RESPONSIVE SEARCH ADS (RSA)
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.google_search, "gsearch")}
                            className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            {copiedKey === "gsearch" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy RSA Package</span>
                          </button>
                        </div>

                        {/* Headlines */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">
                            HEADLINES (≤ 30 CHARS STRICT)
                          </label>
                          <div className="space-y-1.5">
                            {generatedCampaign.platforms.google_search.headlines.map((hl, i) => (
                              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs">
                                <span className="text-slate-100 font-medium">{hl}</span>
                                <span className="text-[10px] font-mono text-cyan-400">{hl.length}/30 chars</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Descriptions */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">
                            DESCRIPTIONS (≤ 90 CHARS STRICT)
                          </label>
                          <div className="space-y-1.5">
                            {generatedCampaign.platforms.google_search.descriptions.map((desc, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs flex justify-between gap-2">
                                <span className="text-slate-200">{desc}</span>
                                <span className="text-[10px] font-mono text-cyan-400 shrink-0">{desc.length}/90 chars</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Keywords & Sitelinks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">TARGET KEYWORDS (MATCH TYPES)</label>
                            <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-mono text-cyan-300 space-y-1">
                              {generatedCampaign.platforms.google_search.keywords.map((kw, i) => (
                                <div key={i}>• {kw}</div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">CALLOUT EXTENSIONS</label>
                            <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs text-slate-300 space-y-1">
                              {generatedCampaign.platforms.google_search.callouts.map((co, i) => (
                                <div key={i}>✓ {co}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GOOGLE SHOPPING TAB */}
                    {selectedAdTab === "google_shopping" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-cyan-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            GOOGLE MERCHANT CENTER & SHOPPING FEED
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.google_shopping, "gshop")}
                            className="px-3 py-1 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Shopping Feed</span>
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">OPTIMIZED PRODUCT TITLE</label>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-bold text-white">
                            {generatedCampaign.platforms.google_shopping.feed_title}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">RICH FEED DESCRIPTION</label>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            {generatedCampaign.platforms.google_shopping.optimized_description}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">GTIN</span>
                            <span className="font-mono text-cyan-300 font-bold">{generatedCampaign.platforms.google_shopping.gtin}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">MPN</span>
                            <span className="font-mono text-purple-300 font-bold">{generatedCampaign.platforms.google_shopping.mpn}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">REGULAR PRICE</span>
                            <span className="font-mono text-slate-300">{generatedCampaign.platforms.google_shopping.regular_price}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">SALE PRICE</span>
                            <span className="font-mono text-emerald-400 font-bold">{generatedCampaign.platforms.google_shopping.sale_price}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SHOPIFY TAB */}
                    {selectedAdTab === "shopify" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-emerald-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            SHOPIFY STOREFRONT LISTING & HTML COPY
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.shopify, "shopify")}
                            className="px-3 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Shopify HTML</span>
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">PRODUCT TITLE</label>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-bold text-white">
                            {generatedCampaign.platforms.shopify.product_title}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">HTML DESCRIPTION</label>
                          <pre className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                            {generatedCampaign.platforms.shopify.html_description}
                          </pre>
                        </div>

                        <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs">
                          <span className="text-[10px] font-bold text-indigo-300 block mb-0.5 uppercase">AI UPSELL HOOK</span>
                          <span className="text-slate-200">{generatedCampaign.platforms.shopify.upsell_recommendation}</span>
                        </div>
                      </div>
                    )}

                    {/* AMAZON TAB */}
                    {selectedAdTab === "amazon" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-amber-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            AMAZON SPONSORED PRODUCTS & BRANDS (SP-API)
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.amazon, "amazon")}
                            className="px-3 py-1 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Amazon Bullets</span>
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">SPONSORED HEADLINE</label>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-bold text-white">
                            {generatedCampaign.platforms.amazon.sponsored_headline}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">A+ BULLET POINTS</label>
                          <div className="space-y-1.5">
                            {generatedCampaign.platforms.amazon.bullet_points.map((bp, i) => (
                              <div key={i} className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs text-slate-200">
                                {bp}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">BACKEND SEARCH TERMS (250 BYTES)</label>
                          <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-mono text-amber-300">
                            {generatedCampaign.platforms.amazon.backend_search_terms}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* META ADS TAB */}
                    {selectedAdTab === "meta" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-purple-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                            META ADS (INSTAGRAM REELS / FEED & FACEBOOK SHOPS)
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.meta, "meta")}
                            className="px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Meta Ad</span>
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">PRIMARY FEED COPY & HOOK</label>
                          <div className="p-3.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {generatedCampaign.platforms.meta.primary_text}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block mb-0.5">HEADLINE</span>
                            <span className="font-bold text-white">{generatedCampaign.platforms.meta.headline}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800">
                            <span className="text-[10px] text-slate-400 block mb-0.5">CALL TO ACTION BUTTON</span>
                            <span className="font-bold text-cyan-300">{generatedCampaign.platforms.meta.call_to_action}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TIKTOK SHOP TAB */}
                    {selectedAdTab === "tiktok" && (
                      <div className="p-6 rounded-3xl bg-[#0e122b]/90 border border-pink-500/30 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                            TIKTOK SHOP & SPARK ADS VIRAL SCRIPT
                          </h4>
                          <button
                            onClick={() => copyText(generatedCampaign.platforms.tiktok, "tiktok")}
                            className="px-3 py-1 rounded-lg bg-pink-600/20 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy TikTok Script</span>
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-xs">
                          <span className="text-[10px] font-black text-pink-400 block mb-1 uppercase">⚡ 3-SECOND VIRAL HOOK SCRIPT</span>
                          <span className="text-white font-medium">{generatedCampaign.platforms.tiktok.hook_script_3sec}</span>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">FULL VIDEO SPOKEN SCRIPT</label>
                          <div className="p-3.5 rounded-xl bg-[#080b1e] border border-slate-800 text-xs text-slate-200 leading-relaxed">
                            {generatedCampaign.platforms.tiktok.video_script_body}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">CAPTION & VIRAL HASHTAGS</label>
                          <div className="p-3 rounded-xl bg-[#080b1e] border border-slate-800 text-xs font-mono text-cyan-300">
                            {generatedCampaign.platforms.tiktok.caption}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT 5 COLUMNS: PLATFORM-ACCURATE VISUAL AD MOCKUP PREVIEW */}
                  <div className="xl:col-span-5 space-y-4">
                    <div className="p-5 rounded-3xl bg-[#0b0e26] border border-indigo-500/30 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-widest text-slate-300 uppercase flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-cyan-400" />
                          LIVE PLATFORM PREVIEW
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-bold text-cyan-300">
                          {selectedAdTab.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      {/* GOOGLE SEARCH SERP AD PREVIEW */}
                      {selectedAdTab === "google_search" && (
                        <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-md space-y-2 select-none">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-black">Sponsored</span>
                            <span className="text-slate-500 text-[11px]">https://www.omega-nexus.ai › shop</span>
                          </div>
                          <div className="text-blue-800 font-semibold text-sm hover:underline cursor-pointer">
                            {generatedCampaign.platforms.google_search.headlines[0]} | {generatedCampaign.platforms.google_search.headlines[1]}
                          </div>
                          <div className="text-xs text-slate-700 leading-snug">
                            {generatedCampaign.platforms.google_search.descriptions[0]}
                          </div>
                          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                            {generatedCampaign.platforms.google_search.sitelinks.slice(0, 2).map((sl, i) => (
                              <div key={i} className="text-blue-700 font-semibold hover:underline">
                                <div>• {sl.title}</div>
                                <div className="text-[10px] text-slate-500 font-normal">{sl.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* INSTAGRAM / META AD PREVIEW */}
                      {selectedAdTab === "meta" && (
                        <div className="rounded-2xl bg-black border border-slate-800 text-white overflow-hidden shadow-md">
                          <div className="p-3 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold">
                                  NX
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-bold">omega.nexus.official</div>
                                <div className="text-[9px] text-slate-400">Sponsored</div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">•••</span>
                          </div>
                          <div className="h-44 bg-slate-900 overflow-hidden">
                            <img
                              src={selectedProduct?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"}
                              alt="Ad Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3 bg-[#111] flex items-center justify-between border-t border-slate-800">
                            <div>
                              <div className="text-[11px] font-bold">{generatedCampaign.platforms.meta.headline}</div>
                              <div className="text-[10px] text-slate-400">{generatedCampaign.platforms.meta.description}</div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">
                              Shop Now
                            </button>
                          </div>
                        </div>
                      )}

                      {/* TIKTOK SHOP VIDEO AD PREVIEW */}
                      {selectedAdTab === "tiktok" && (
                        <div className="relative rounded-2xl bg-black h-72 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-md">
                          <img
                            src={selectedProduct?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"}
                            alt="TikTok Preview"
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                          />
                          <div className="relative z-10 flex justify-between items-center text-xs">
                            <span className="font-bold text-white">Following | For You</span>
                            <Search className="w-4 h-4 text-white" />
                          </div>
                          <div className="relative z-10 space-y-2">
                            <div className="p-2 rounded-xl bg-amber-400/90 text-black text-xs font-extrabold flex items-center gap-2 shadow-lg">
                              <ShoppingCart className="w-4 h-4" />
                              <span>{generatedCampaign.platforms.tiktok.call_to_action_overlay}</span>
                            </div>
                            <div className="text-xs font-bold text-white">@nexus_finds</div>
                            <div className="text-[11px] text-slate-200 line-clamp-2">
                              {generatedCampaign.platforms.tiktok.caption}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* GOOGLE SHOPPING CARD PREVIEW */}
                      {selectedAdTab === "google_shopping" && (
                        <div className="p-4 rounded-2xl bg-white text-slate-900 space-y-2 shadow-md">
                          <div className="h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                            <img
                              src={selectedProduct?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"}
                              alt="Shopping Preview"
                              className="h-full object-contain"
                            />
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-2">
                            {generatedCampaign.platforms.google_shopping.feed_title}
                          </div>
                          <div className="text-sm font-black text-emerald-700">
                            {generatedCampaign.platforms.google_shopping.sale_price}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Free 2-day delivery • OMEGA Official
                          </div>
                        </div>
                      )}

                      {/* SHOPIFY PREVIEW */}
                      {selectedAdTab === "shopify" && (
                        <div className="p-4 rounded-2xl bg-[#090c21] border border-slate-700 text-white space-y-2 shadow-md">
                          <div className="text-xs font-black text-amber-400">🔥 BESTSELLER OF THE WEEK</div>
                          <div className="text-sm font-extrabold">{generatedCampaign.platforms.shopify.product_title}</div>
                          <div className="text-base font-black text-emerald-400">${selectedProduct?.selling_price}</div>
                          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold">
                            Add to Cart 🛒
                          </button>
                        </div>
                      )}

                      {/* AMAZON PREVIEW */}
                      {selectedAdTab === "amazon" && (
                        <div className="p-4 rounded-2xl bg-white text-slate-900 space-y-2 shadow-md">
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Sponsored</div>
                          <div className="text-xs font-bold text-blue-800 line-clamp-2">
                            {generatedCampaign.platforms.amazon.sponsored_headline}
                          </div>
                          <div className="text-sm font-black text-slate-900">${selectedProduct?.selling_price} <span className="text-xs font-normal text-slate-500">Prime</span></div>
                          <div className="text-[10px] text-amber-600 font-bold">⭐⭐⭐⭐⭐ 4.9 (1,280+)</div>
                        </div>
                      )}

                      {/* Direct Post Button */}
                      <button
                        onClick={handleDeployAds}
                        disabled={deployingAds}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white text-xs font-extrabold shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 mt-4"
                      >
                        <Rocket className={`w-4 h-4 ${deployingAds ? "animate-spin" : ""}`} />
                        <span>{deployingAds ? "Posting to Channels..." : "🚀 One-Click Post to Selected Channels"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 4: SELLING APPS & GOOGLE AD POSTING CENTER */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {(activeNavItem === "live_dispatch" || activeNavItem === "campaigns") && (
            <div className="space-y-6">
              {/* Channel Connectors Grid */}
              <div className="p-5 rounded-3xl bg-[#0e122b]/95 border border-indigo-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-cyan-400" />
                      CONNECTED SELLING APPS & GOOGLE AD ACCOUNTS
                    </h3>
                    <p className="text-xs text-slate-400">
                      Direct API connectors configured for live campaign dispatching, product syncing, and budget pacing.
                    </p>
                  </div>
                </div>

                {/* Platforms selection badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {platforms.map((plat) => {
                    const isChecked = selectedPlatforms.includes(plat.id);
                    return (
                      <div
                        key={plat.id}
                        onClick={() => togglePlatform(plat.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? "bg-indigo-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                            : "bg-[#090c21] border-slate-800 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isChecked ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-800 text-slate-400"
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{plat.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{plat.account_id}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            ● Connected
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-cyan-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Deploy Trigger Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-800 gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span>Deploying Product: <strong className="text-white">{selectedProduct?.name}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>Daily Budget:</span>
                    <input
                      type="number"
                      value={deployBudget}
                      onChange={(e) => setDeployBudget(Number(e.target.value))}
                      className="w-24 bg-[#090c21] border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleDeployAds}
                    disabled={deployingAds}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <Rocket className={`w-4 h-4 ${deployingAds ? "animate-spin" : ""}`} />
                    <span>{deployingAds ? "Dispatching Live Campaigns..." : "🚀 Launch & Post Ad Campaign"}</span>
                  </button>
                </div>
              </div>

              {/* Live Deployment Logs Terminal */}
              {deploymentLogs.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#060817] border border-cyan-500/30 font-mono text-xs text-cyan-300 space-y-1 shadow-xl">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>REAL-TIME MULTI-PLATFORM DISPATCH FEED</span>
                  </div>
                  {deploymentLogs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                      <span className="text-cyan-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Deployed Campaigns Telemetry Table */}
              <div className="p-5 rounded-3xl bg-[#0e122b]/90 border border-indigo-500/20 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      LIVE CAMPAIGN PERFORMANCE & ROAS TELEMETRY
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">{deployedCampaigns.length} Total Campaigns</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Campaign / Product</th>
                        <th className="pb-3 font-semibold">Platform</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Daily Budget</th>
                        <th className="pb-3 font-semibold">Spend</th>
                        <th className="pb-3 font-semibold">ROAS</th>
                        <th className="pb-3 font-semibold">Revenue</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {deployedCampaigns.map((cmp) => (
                        <tr key={cmp.id} className="hover:bg-indigo-500/5 transition-colors">
                          <td className="py-3 font-sans">
                            <div className="font-bold text-slate-100 truncate max-w-[220px]">{cmp.name}</div>
                            <div className="text-[10px] text-slate-400">{cmp.product_name}</div>
                          </td>
                          <td className="py-3 font-sans">
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-cyan-300">
                              {cmp.platform}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                              cmp.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              ● {cmp.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-300">${cmp.daily_budget}/day</td>
                          <td className="py-3 text-slate-300">${cmp.total_spend?.toFixed(2)}</td>
                          <td className="py-3 text-emerald-400 font-bold">{cmp.roas}x</td>
                          <td className="py-3 text-white font-bold">${cmp.revenue?.toLocaleString()}</td>
                          <td className="py-3 text-right font-sans">
                            <button
                              onClick={() => handleToggleCampaign(cmp.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                cmp.status === "Active"
                                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                              }`}
                            >
                              {cmp.status === "Active" ? "Pause" : "Resume"}
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

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* VIEW 5: AUTONOMOUS MARKETING AI AGENTS TRAINING LAB */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeNavItem === "agent_training" && (
            <div className="space-y-6">
              {/* Training Control Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121638] via-[#1a1444] to-[#121638] border border-purple-500/30 shadow-2xl space-y-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                      <Brain className="w-6 h-6 text-cyan-300 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white tracking-wide">
                        AUTONOMOUS MARKETING AGENTS TRAINING LAB
                      </h3>
                      <p className="text-xs text-slate-300">
                        Train 4 specialized AI agents on multi-platform ad policy compliance, CTR heuristics, and ROAS curves.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#0a0d20] px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-400">Epochs:</span>
                      {[25, 50, 100].map((ep) => (
                        <button
                          key={ep}
                          onClick={() => setTrainingEpochs(ep)}
                          className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                            trainingEpochs === ep ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {ep}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleTrainAgents}
                      disabled={trainingAgents}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2"
                    >
                      <Zap className={`w-4 h-4 ${trainingAgents ? "animate-spin" : ""}`} />
                      <span>{trainingAgents ? "Training Neural Weights..." : "🧠 Train All 4 Marketing Agents"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Agent Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(marketingAgents).map(([key, ag]) => (
                  <div key={key} className="p-6 rounded-3xl bg-[#0e122b]/95 border border-indigo-500/20 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-cyan-300">
                          <Brain className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{ag.name}</h4>
                          <p className="text-[11px] text-slate-400">{ag.role}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-xs font-extrabold text-purple-300">
                        Level {ag.level}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>XP Progress</span>
                        <span className="text-cyan-300 font-bold">{ag.xp} / {ag.xp_to_next} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (ag.xp / ag.xp_to_next) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2">
                      <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">POLICY COMPLIANCE</span>
                        <span className="font-mono text-emerald-400 font-bold">{ag.policy_compliance || 99.8}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">TRAINED CAMPAIGNS</span>
                        <span className="font-mono text-cyan-300 font-bold">{ag.trained_campaigns_count || 150}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#080b1e] border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">LAST TRAINED</span>
                        <span className="text-[10px] font-mono text-slate-300">Just Now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Logs */}
              {trainingLogs.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#060817] border border-purple-500/30 font-mono text-xs text-purple-300 space-y-1 shadow-xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">TRAINING EPOCH EXECUTION LOGS</div>
                  {trainingLogs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                      <span className="text-purple-400">[{i + 1}]</span> {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BOTTOM MARKETING INSIGHTS TICKER FOOTER BAR ─────────────── */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0e122b] via-[#14193d] to-[#0e122b] border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs font-black tracking-widest text-purple-300 uppercase">
                AI MARKETING TELEMETRY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
              <div className="p-2.5 rounded-xl bg-[#0a0d20] border border-indigo-500/20 text-xs">
                <span className="text-slate-300">Google Ads & Shopping budget optimized. </span>
                <span className="font-bold text-emerald-400">Target ROAS: 6.8x</span>
              </div>
              
              <div className="p-2.5 rounded-xl bg-[#0a0d20] border border-indigo-500/20 text-xs">
                <span className="text-slate-300">TikTok Shop viral script ready. </span>
                <span className="font-bold text-pink-400">Predicted Viral: 96/100</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0a0d20] border border-indigo-500/20 text-xs">
                <span className="text-slate-300">Shopify HTML promo synchronized. </span>
                <span className="font-bold text-cyan-300">Conversion rate: +34%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0a0d20] border border-indigo-500/20 text-xs">
                <span className="text-slate-300">Marketing AI Model Status: </span>
                <span className="font-bold text-emerald-400">100% Policy Compliant</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── AI COPILOT MODAL ────────────────────────────────────────── */}
      {copilotOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCopilotOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-[#0f1430] border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI MARKETING & AD COPILOT</h3>
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask AI Marketing Copilot to auto-optimize budget allocations, generate high-converting ad copy, or forecast ROI for Google Platforms and Selling Apps.
            </p>

            <form onSubmit={handleCopilotSubmit} className="space-y-3">
              <textarea
                rows={3}
                placeholder="e.g. Optimize my Google Ads & TikTok Shop ad copy for AeroGlow Earbuds to boost ROAS above 7.5x..."
                value={copilotMsg}
                onChange={(e) => setCopilotMsg(e.target.value)}
                className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  {["Optimize Budget", "Google Ad Copy", "TikTok Viral Hook"].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setCopilotMsg(`Please generate ${tag.toLowerCase()} for active campaigns`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-[10px] text-indigo-300 hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={copilotLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg hover:brightness-110"
                >
                  {copilotLoading ? "⏳ Thinking..." : "Ask Copilot ✨"}
                </button>
              </div>
            </form>

            {copilotResult && (
              <div className="mt-4 p-4 rounded-xl bg-[#080a1a] border border-cyan-500/30 space-y-2 text-xs font-mono text-cyan-300 max-h-60 overflow-y-auto">
                <div className="font-bold uppercase text-[10px] text-purple-400">🤖 AI Marketing Strategy Result</div>
                <pre className="whitespace-pre-wrap font-sans text-slate-200">{copilotResult.ai_recommendation}</pre>
                {copilotResult.generated_ad_copy && (
                  <div className="mt-2 space-y-1 pt-2 border-t border-slate-800">
                    <div className="font-bold text-emerald-400">✨ Generated Multi-Platform Ad Copy Samples:</div>
                    {copilotResult.generated_ad_copy.map((ad, i) => (
                      <div key={i} className="text-slate-300">• {ad}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD CUSTOM PRODUCT MODAL ─────────────────────────────────── */}
      {addProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAddProductModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-[#0f1430] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Product for AI Ad Automation</h3>
              </div>
              <button onClick={() => setAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-indigo-300 block mb-1">PRODUCT NAME *</label>
                <input
                  type="text"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. LuminoDesk Anti-Gravity Lamp"
                  className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-indigo-300 block mb-1">SELLING PRICE (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductForm.selling_price}
                    onChange={(e) => setNewProductForm((f) => ({ ...f, selling_price: e.target.value }))}
                    className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-300 block mb-1">COST PRICE (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProductForm.cost_price}
                    onChange={(e) => setNewProductForm((f) => ({ ...f, cost_price: e.target.value }))}
                    className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-indigo-300 block mb-1">KEY USPs (COMMA SEPARATED)</label>
                <textarea
                  rows={2}
                  value={newProductForm.usps}
                  onChange={(e) => setNewProductForm((f) => ({ ...f, usps: e.target.value }))}
                  placeholder="e.g. Magnetic levitation, Wireless Qi charging base, 3 ambient color modes"
                  className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-indigo-300 block mb-1">TARGET AUDIENCE</label>
                <input
                  type="text"
                  value={newProductForm.target_audience}
                  onChange={(e) => setNewProductForm((f) => ({ ...f, target_audience: e.target.value }))}
                  placeholder="e.g. Remote workers, Gamers, Aesthetic desk creators"
                  className="w-full bg-[#080a1a] border border-slate-700/80 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddProductModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-semibold shadow-lg"
                >
                  Add Product & Generate Ads ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
