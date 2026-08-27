import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Cpu, MessageSquare, Network, Brain, Library, Code2, Terminal, Globe,
  ListTodo, Activity, Settings as SettingsIcon, Sparkles, Search, ShieldAlert, Lock, Mic, Camera, Atom, Clapperboard, Wind,
  Briefcase, TrendingUp, Zap, DollarSign, Bot, Database, FlaskConical, Megaphone, Scale, Layers, Radio, Volume2,
  Image as ImageIcon, MapPin, CloudSun, Sun, CloudRain, CloudFog, CloudSnow, CloudLightning
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "./Toast";
import { useDeviceWeather } from "../lib/locationWeather";
import CommandPalette from "./CommandPalette";
import { useSecurity } from "../lib/SecurityContext";
import { useVoice } from "../lib/VoiceContext";
import LockScreen from "./LockScreen";
import BiometricPrompt from "./BiometricPrompt";
import VoicePromptOverlay from "./VoicePromptOverlay";
import ShutdownScreen from "./ShutdownScreen";
import WelcomeScreen from "./WelcomeScreen";
import SideRobot from "./SideRobot";
import { SpiderEmblem } from "../pages/SpiderManAI";

const NAV_SECTIONS = [
  {
    title: "MAIN NAVIGATION",
    items: [
      { to: "/",          label: "Command Center",       icon: Cpu,           id: "cmd" },
      { to: "/spiderman", label: "Spider-Man AI",        icon: ShieldAlert,   id: "spiderman", badge: "ACTIVE", isSpider: true },
      { to: "/",          label: "Master AI Brain",      icon: Brain,         id: "brain" },
      { to: "/agents",    label: "Agents Network",       icon: Network,       id: "agents", badge: "182" },
      { to: "/projects",  label: "Projects",             icon: Briefcase,     id: "projects", badge: "47" },
      { to: "/projects",  label: "Deployments",          icon: Layers,        id: "deployments", badge: "47 Live" },
      { to: "/code",      label: "Code Studio",          icon: Code2,         id: "code" },
      { to: "/data-analyst", label: "Data Analyst Studio",  icon: TrendingUp,    id: "data" },
      { to: "/stocks",    label: "Stock Market AI",      icon: DollarSign,    id: "stocks", badge: "AI" },
      { to: "/business",  label: "Business Intelligence",icon: Zap,           id: "business" },
      { to: "/revenue",   label: "Revenue Hub",          icon: DollarSign,    id: "revenue" },
      { to: "/iot",       label: "Robotics & IoT",       icon: Bot,           id: "robotics" },
      { to: "/knowledge", label: "Knowledge Hub",        icon: Library,       id: "kb" },
      { to: "/memory",    label: "Memory Core",          icon: Database,      id: "memory" },
      { to: "/browser",   label: "Automation Center",    icon: Globe,         id: "browser" },
      { to: "/biometrics",label: "Security Center",      icon: ShieldAlert,   id: "security" },
      { to: "/monitor",   label: "System Monitor",       icon: Activity,      id: "monitor" },
      { to: "/terminal",  label: "Logs & Audit",         icon: Terminal,      id: "terminal" },
    ]
  },
  {
    title: "AI OS MODULES",
    items: [
      { to: "/spiderman", label: "Spider-Nexus HUD",     icon: ShieldAlert,   id: "spiderhud", badge: "v1.0", isSpider: true },
      { to: "/iot",       label: "Research Lab",         icon: FlaskConical,  id: "research" },
      { to: "/creative",  label: "Creative Studio",      icon: Sparkles,      id: "creative" },
      { to: "/image-gen", label: "AI Image Generator",   icon: ImageIcon,     id: "imagegen", badge: "NEW" },
      { to: "/marketing", label: "Marketing Suite",      icon: Megaphone,     id: "marketing" },
      { to: "/finance",   label: "Finance OS",           icon: DollarSign,    id: "finance" },
      { to: "/legal",     label: "Legal & Compliance",    icon: Scale,         id: "legal" },
    ]
  }
];

export default function Shell({ children }) {
  const loc = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [shellStats, setShellStats] = useState({ agents: "36", projects: "42", live: "42 Live" });
  const { lockSystem } = useSecurity();
  const { startListening } = useVoice();
  const { weather, loading: weatherLoading, requestGpsLocation, isGps } = useDeviceWeather();

  // Fetch real counts from backend
  useEffect(() => {
    http.get("/projects").then(res => {
      if (res.data && Array.isArray(res.data)) {
        setShellStats(prev => ({ ...prev, projects: String(res.data.length), live: `${res.data.length} Live` }));
      }
    }).catch(() => {});
    http.get("/agents").then(res => {
      if (res.data && Array.isArray(res.data)) {
        setShellStats(prev => ({ ...prev, agents: String(res.data.length) }));
      }
    }).catch(() => {});
  }, []);

  // Sidebar Position Preference (Left vs Right)
  const [sidebarPosition, setSidebarPosition] = useState(() => localStorage.getItem("nexus_sidebar_position") || "left");

  useEffect(() => {
    const handleSidebarChange = () => {
      setSidebarPosition(localStorage.getItem("nexus_sidebar_position") || "left");
    };
    window.addEventListener("sidebar_position_changed", handleSidebarChange);
    return () => window.removeEventListener("sidebar_position_changed", handleSidebarChange);
  }, []);

  const toggleSidebarPosition = () => {
    const newPos = sidebarPosition === "left" ? "right" : "left";
    localStorage.setItem("nexus_sidebar_position", newPos);
    setSidebarPosition(newPos);
    window.dispatchEvent(new Event("sidebar_position_changed"));
  };

  // Live clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activePage = "MASTER CONTROL CENTER";

  const isAuthPage = loc.pathname.startsWith("/auth/mock/") || loc.pathname.startsWith("/live") || loc.pathname.startsWith("/deployed") || loc.pathname.startsWith("/spiderman") || loc.pathname.startsWith("/spider-nexus");
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", flexDirection: sidebarPosition === "right" ? "row-reverse" : "row", minHeight: "100vh", background: "#030712", color: "#e2e8f0" }}>
      {/* Biometric & Voice Security Overlays */}
      <LockScreen />
      <BiometricPrompt />
      <VoicePromptOverlay />
      <ShutdownScreen />
      <WelcomeScreen />
      <SideRobot />

      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Sidebar */}
      <aside
        style={{
          width: 230, flexShrink: 0, display: "flex", flexDirection: "column",
          borderRight: sidebarPosition === "left" ? "1px solid rgba(0,245,255,0.12)" : "none",
          borderLeft: sidebarPosition === "right" ? "1px solid rgba(0,245,255,0.12)" : "none",
          background: "rgba(3, 7, 18, 0.95)",
          backdropFilter: "blur(20px)", position: "sticky", top: 0, height: "100vh", zIndex: 40
        }}
        data-testid="nexus-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid rgba(0,245,255,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles style={{ width: 24, height: 24, color: "#00F5FF" }} />
              <span style={{ position: "absolute", inset: 0, background: "rgba(0,245,255,0.25)", borderRadius: "50%", filter: "blur(8px)" }} />
            </div>
            <div>
              <div className="font-display nx-neon-cyan" style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.01em" }}>OMEGA NEXUS</div>
              <div className="hud-label" style={{ marginTop: 2, fontSize: "0.58rem", color: "rgba(148,163,184,0.7)" }}>AI OS 2.0 | MASTER CONTROL CENTER</div>
            </div>
          </div>
        </div>

        {/* Search/palette button */}
        <div style={{ padding: "10px 12px 4px" }}>
          <button
            onClick={() => setPaletteOpen(true)}
            title="Command Palette (Ctrl+K)"
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 8, cursor: "pointer",
              background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)",
              color: "rgba(148,163,184,0.7)", transition: "all 0.15s", fontFamily: "monospace", fontSize: 11,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = "#00F5FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.12)"; e.currentTarget.style.color = "rgba(148,163,184,0.7)"; }}
          >
            <Search style={{ width: 12, height: 12 }} />
            <span style={{ flex: 1, textAlign: "left" }}>Ask anything to Master AI...</span>
            <kbd style={{ fontSize: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 4px" }}>Ctrl K</kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {NAV_SECTIONS.map((sec, sIdx) => (
            <div key={sec.title} style={{ marginBottom: sIdx === 0 ? 14 : 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(148,163,184,0.5)", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.1em", padding: "6px 8px 4px" }}>
                {sec.title}
              </div>
              {sec.items.map(n => {
                const active = (n.id === "cmd" && (loc.pathname === "/" || loc.pathname === "/cmd")) ||
                               (n.id !== "cmd" && loc.pathname === n.to);
                const Icon = n.icon;
                const isSpider = n.isSpider || n.id === "spiderman" || n.id === "spiderhud";
                return (
                  <Link
                    key={n.id + n.label}
                    to={n.to}
                    data-testid={`nav-${n.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "6px 10px", borderRadius: 7, marginBottom: 2,
                      textDecoration: "none", transition: "all 0.15s ease",
                      background: active 
                        ? (isSpider 
                            ? "linear-gradient(90deg, rgba(255, 42, 77, 0.3), rgba(181, 15, 40, 0.15))" 
                            : "linear-gradient(90deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.15))")
                        : "transparent",
                      border: active 
                        ? (isSpider ? "1px solid rgba(255, 42, 77, 0.6)" : "1px solid rgba(168, 85, 247, 0.4)")
                        : (isSpider ? "1px solid rgba(255, 42, 77, 0.15)" : "1px solid transparent"),
                      color: active ? "#ffffff" : (isSpider ? "#ff4d6d" : "rgba(148,163,184,0.8)"),
                    }}
                    onMouseEnter={e => { 
                      if (!active) { 
                        e.currentTarget.style.background = isSpider ? "rgba(255,42,77,0.12)" : "rgba(255,255,255,0.04)"; 
                        e.currentTarget.style.color = "#ffffff"; 
                      } 
                    }}
                    onMouseLeave={e => { 
                      if (!active) { 
                        e.currentTarget.style.background = "transparent"; 
                        e.currentTarget.style.color = isSpider ? "#ff4d6d" : "rgba(148,163,184,0.8)"; 
                      } 
                    }}
                  >
                    {isSpider ? (
                      <SpiderEmblem size={14} color={active ? "#ff2a4d" : "#ff4d6d"} />
                    ) : (
                      <Icon style={{ width: 14, height: 14, flexShrink: 0, color: active ? "#a855f7" : "rgba(148,163,184,0.7)" }} />
                    )}
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: (active || isSpider) ? 600 : 400, flex: 1 }}>{n.label}</span>
                    {n.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
                        background: isSpider ? "rgba(255, 42, 77, 0.2)" : "rgba(99, 102, 241, 0.2)",
                        border: isSpider ? "1px solid rgba(255, 42, 77, 0.5)" : "1px solid rgba(99, 102, 241, 0.4)",
                        color: isSpider ? "#ff2a4d" : "#818cf8",
                        fontFamily: "monospace"
                      }}>
                        {n.id === "agents" ? shellStats.agents :
                         n.id === "projects" ? shellStats.projects :
                         n.id === "deployments" ? shellStats.live : n.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

            </div>
          ))}
        </nav>

        {/* Voice Command Widget */}
        <div style={{ padding: "12px 12px 16px", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(0, 245, 255, 0.15)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#818cf8", letterSpacing: "0.1em", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>VOICE COMMAND</span>
              <span className="nx-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#00F5FF" }} />
            </div>

            {/* Audio equalizer animation */}
            <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 8 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{
                  width: 3, height: `${Math.sin(i * 0.5) * 8 + 10}px`,
                  background: "#6366f1", borderRadius: 2,
                  animation: `pulse ${0.6 + (i % 5) * 0.1}s ease-in-out infinite alternate`
                }} />
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", marginBottom: 8 }}>
              Listening...
            </div>

            <button
              onClick={startListening}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "6px", borderRadius: 6, background: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.4)", color: "#a5b4fc",
                fontSize: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99, 102, 241, 0.35)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"}
            >
              <Mic style={{ width: 12, height: 12 }} /> Tap to Speak
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          padding: "10px 24px", borderBottom: "1px solid rgba(0,245,255,0.1)",
          background: "rgba(3,7,18,0.85)", backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="hud-label">SECTOR</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#7dd3fc", fontWeight: 600 }}>COMMAND CENTER</span>
            </div>
            <span style={{ color: "rgba(148,163,184,0.3)", fontSize: 11, fontFamily: "monospace" }}>›</span>
            <span style={{ fontSize: 11, color: "rgba(148,163,184,0.4)", fontFamily: "monospace" }}>nexus://os{loc.pathname}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontFamily: "monospace" }}>
            {/* Live Real Device Location & Weather Badge */}
            <div
              onClick={() => {
                requestGpsLocation();
                toast.success(`Location synced: ${weather?.location || "Device GPS active"}`);
              }}
              title={`Device Real Location: ${weather?.location || "Detecting..."} | Condition: ${weather?.condition || "Live"} | Click to Sync GPS`}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(0, 245, 255, 0.06)", border: "1px solid rgba(0, 245, 255, 0.2)",
                borderRadius: 6, padding: "4px 9px", cursor: "pointer", color: "#e2e8f0",
                transition: "all 0.15s", fontSize: 10.5, fontFamily: "monospace"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; e.currentTarget.style.background = "rgba(0,245,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)"; e.currentTarget.style.background = "rgba(0,245,255,0.06)"; }}
            >
              <MapPin style={{ width: 11, height: 11, color: "#00f5ff", flexShrink: 0 }} />
              <span style={{ color: "#fff", fontWeight: 700, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {weather?.city || (weatherLoading ? "Locating..." : "Device")}
              </span>
              <span style={{ color: "#38bdf8", fontWeight: 800 }}>
                {weather?.temp_str || (weather?.temp !== undefined ? `${weather.temp}°C` : "24°C")}
              </span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: isGps ? "#00FF88" : "#38bdf8", display: "inline-block" }} />
            </div>

            <button
              onClick={() => setPaletteOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 9px", cursor: "pointer", color: "rgba(148,163,184,0.5)", transition: "all 0.15s", fontSize: 10 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = "#00F5FF"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(148,163,184,0.5)"; }}
            >
              <Search style={{ width: 10, height: 10 }} />
              <kbd style={{ fontFamily: "monospace" }}>Ctrl+K</kbd>
            </button>
            <button
              onClick={startListening}
              title="Voice Directive Assistant"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(0, 245, 255, 0.08)", border: "1px solid rgba(0, 245, 255, 0.25)",
                borderRadius: 6, padding: "4px 9px", cursor: "pointer", color: "#00f5ff",
                transition: "all 0.15s", fontSize: 10, fontFamily: "monospace",
                boxShadow: "0 0 10px rgba(0, 245, 255, 0.1)"
              }}
            >
              <Mic style={{ width: 11, height: 11 }} /> VOICE
            </button>
            <button
              onClick={toggleSidebarPosition}
              title={`Switch Sidebar Position to ${sidebarPosition === "left" ? "Right" : "Left"}`}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: 6, padding: "4px 9px", cursor: "pointer", color: "#c084fc",
                transition: "all 0.15s", fontSize: 10, fontFamily: "monospace"
              }}
            >
              <SettingsIcon style={{ width: 11, height: 11 }} /> Sidebar: {sidebarPosition === "left" ? "LEFT ◀" : "RIGHT ▶"}
            </button>
            <button
              onClick={lockSystem}
              title="Lock System"
              style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, padding: "4px 9px", cursor: "pointer", color: "#f87171", transition: "all 0.15s", fontSize: 10 }}
            >
              <Lock style={{ width: 10, height: 10 }} /> LOCK
            </button>
            <div style={{ color: "rgba(148,163,184,0.4)" }}>{time}</div>
          </div>
        </header>

        {/* Workspace views */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>

        {/* Global Footer */}
        <footer style={{ padding: "8px 24px", borderTop: "1px solid rgba(0,245,255,0.1)", background: "rgba(2,6,23,0.9)", fontSize: 10, fontFamily: "monospace", color: "rgba(148,163,184,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#34d399", display: "flex", alignItems: "center", gap: 4 }}>
              <span className="nx-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              Connected to Omega Nexus Cloud
            </span>
            <span>Network Latency: 23ms</span>
            <span>Uptime: 47d 12h 36m</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Version: v2.0.0-OMEGA</span>
            <span>Build: 2026.05.21.1642</span>
            <span>© 2026 OMEGA NEXUS AI OS. All Rights Reserved.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
