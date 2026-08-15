import { useState, useEffect } from "react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";
import {
  Settings as SettingsIcon, Key, Database, Globe, Palette, Save, Copy, Eye, EyeOff,
  Wifi, CheckCircle2, XCircle, Layout, PanelLeft, PanelRight, Bot
} from "lucide-react";

const LS_KEY = "nexus_settings";

const DEFAULTS = {
  llmKey: "",
  mongoUrl: "mongodb://localhost:27017",
  backendUrl: "http://localhost:8000",
  theme: "cyberpunk-dark",
};

export default function Settings() {
  const [form, setForm] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || "{}") }; }
    catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Dynamic Layout States
  const [sidebarPos, setSidebarPos] = useState(() => localStorage.getItem("nexus_sidebar_position") || "left");
  const [sideRobotPos, setSideRobotPos] = useState(() => localStorage.getItem("nexus_siderobot_position") || "bottom-right");

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

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast.success("Settings saved to local storage");
  };

  const testConnection = async () => {
    setTesting(true); setTestResult(null);
    try {
      await http.get("/");
      setTestResult("ok");
      toast.success("Backend connection successful!");
    } catch {
      setTestResult("fail");
      toast.error("Cannot reach backend — is it running?");
    }
    setTesting(false);
  };

  const copyKey = () => {
    if (!form.llmKey) { toast.error("No key to copy"); return; }
    navigator.clipboard.writeText(form.llmKey).then(() => toast.success("Key copied")).catch(() => toast.error("Copy failed"));
  };

  const resetDefaults = () => {
    setForm(DEFAULTS);
    localStorage.removeItem(LS_KEY);
    changeSidebarPosition("left");
    changeSideRobotPosition("bottom-right");
    toast.info("Settings reset to defaults");
  };

  const inputStyle = { width: "100%", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 8, color: "#e2e8f0", padding: "9px 14px", fontSize: 12, fontFamily: "monospace", outline: "none", transition: "border-color 0.15s" };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="nx-glass" style={{ borderRadius: 14, padding: "18px 22px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 14, height: 14, color: "#00F5FF" }} />
        </div>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{title}</span>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, hint, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label className="hud-label" style={{ display: "block", marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <p style={{ marginTop: 4, fontSize: 10.5, color: "rgba(148,163,184,0.45)", fontFamily: "monospace" }}>{hint}</p>}
    </div>
  );

  const THEMES = [
    { id: "cyberpunk-dark", label: "Cyberpunk Dark", accent: "#00F5FF" },
    { id: "midnight-blue",  label: "Midnight Blue",  accent: "#6E56FF" },
    { id: "neon-green",     label: "Neon Green",     accent: "#00FF88" },
    { id: "crimson-dark",   label: "Crimson Dark",   accent: "#FF4D4D" },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <div className="hud-label" style={{ marginBottom: 4 }}>CONFIGURATION</div>
        <h1 className="font-display nx-neon-cyan" style={{ fontSize: 26, fontWeight: 800 }}>Settings</h1>
        <p style={{ marginTop: 3, fontSize: 11, color: "rgba(148,163,184,0.5)", fontFamily: "monospace" }}>Persisted in local storage</p>
      </div>

      {/* ── 1. LAYOUT & SIDEBAR / SIDE ROBOT POSITION CUSTOMIZATION ── */}
      <Section icon={Layout} title="System Layout & Assistant Settings">
        
        {/* Sidebar Position Selector */}
        <Field label="SIDEBAR LOCATION FEATURE" hint="Select whether the main navigation sidebar appears on the Left or Right side of your screen.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6 }}>
            <div onClick={() => changeSidebarPosition("left")}
              style={{ background: sidebarPos === "left" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(59, 130, 246, 0.35))" : "rgba(15,23,42,0.8)", border: sidebarPos === "left" ? "2px solid #00F5FF" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", boxShadow: sidebarPos === "left" ? "0 0 20px rgba(0,245,255,0.3)" : "none", transition: "all 0.2s ease" }}>
              <PanelLeft style={{ width: 22, height: 22, color: sidebarPos === "left" ? "#00F5FF" : "#94a3b8" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>Left Sidebar</div>
                <div style={{ fontSize: 9.5, color: sidebarPos === "left" ? "#7dd3fc" : "#64748b", fontFamily: "monospace" }}>Standard Position</div>
              </div>
            </div>

            <div onClick={() => changeSidebarPosition("right")}
              style={{ background: sidebarPos === "right" ? "linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(59, 130, 246, 0.35))" : "rgba(15,23,42,0.8)", border: sidebarPos === "right" ? "2px solid #00F5FF" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", boxShadow: sidebarPos === "right" ? "0 0 20px rgba(0,245,255,0.3)" : "none", transition: "all 0.2s ease" }}>
              <PanelRight style={{ width: 22, height: 22, color: sidebarPos === "right" ? "#00F5FF" : "#94a3b8" }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>Right Sidebar</div>
                <div style={{ fontSize: 9.5, color: sidebarPos === "right" ? "#7dd3fc" : "#64748b", fontFamily: "monospace" }}>Flipped Position</div>
              </div>
            </div>
          </div>
        </Field>

        {/* Side Robot Position Selector */}
        <Field label="SIDE ROBOT LOCATION FEATURE" hint="Choose the screen corner for the floating 3D AI Assistant Robot (<SideRobot />).">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
            {[
              { id: "bottom-right", label: "↘ Bottom Right", desc: "Default Corner" },
              { id: "bottom-left", label: "↙ Bottom Left", desc: "Lower Left Corner" },
              { id: "top-right", label: "↗ Top Right", desc: "Upper Right Corner" },
              { id: "top-left", label: "↖ Top Left", desc: "Upper Left Corner" },
            ].map(p => (
              <div key={p.id} onClick={() => changeSideRobotPosition(p.id)}
                style={{ background: sideRobotPos === p.id ? "linear-gradient(135deg, rgba(2, 132, 199, 0.35), rgba(6, 182, 212, 0.35))" : "rgba(15,23,42,0.8)", border: sideRobotPos === p.id ? "2px solid #00FF88" : "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 12, cursor: "pointer", transition: "all 0.2s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Bot style={{ width: 14, height: 14, color: sideRobotPos === p.id ? "#00FF88" : "#38bdf8" }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{p.label}</span>
                </div>
                <div style={{ fontSize: 9, color: sideRobotPos === p.id ? "#86efac" : "#64748b", marginTop: 2, fontFamily: "monospace" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </Field>

      </Section>

      <Section icon={Key} title="AI & API Configuration">
        <Field label="EMERGENT LLM KEY" hint="Required for real AI responses. Stored locally in your browser only.">
          <div style={{ position: "relative" }}>
            <input
              type={showKey ? "text" : "password"}
              value={form.llmKey}
              onChange={e => set("llmKey", e.target.value)}
              placeholder="sk-emergent-..."
              style={{ ...inputStyle, paddingRight: 76 }}
              onFocus={e => e.target.style.borderColor = "rgba(0,245,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,245,255,0.2)"}
            />
            <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
              <button onClick={() => setShowKey(p => !p)} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.6)", cursor: "pointer", padding: 4 }} title={showKey ? "Hide" : "Show"}>
                {showKey ? <EyeOff style={{ width: 13, height: 13 }} /> : <Eye style={{ width: 13, height: 13 }} />}
              </button>
              <button onClick={copyKey} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.6)", cursor: "pointer", padding: 4 }} title="Copy">
                <Copy style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </Field>

        <Field label="BACKEND URL" hint="URL of your running FastAPI server">
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={form.backendUrl} onChange={e => set("backendUrl", e.target.value)} style={{ ...inputStyle, flex: 1 }}
              onFocus={e => e.target.style.borderColor = "rgba(0,245,255,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(0,245,255,0.2)"} />
            <button
              onClick={testConnection}
              disabled={testing}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "9px 14px", borderRadius: 8, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: testing ? "rgba(148,163,184,0.5)" : "#00F5FF", cursor: testing ? "not-allowed" : "pointer", fontSize: 12, fontFamily: "monospace", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              <Wifi style={{ width: 13, height: 13 }} />
              {testing ? "Testing…" : "Test"}
            </button>
          </div>
          {testResult && (
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "monospace", color: testResult === "ok" ? "#00FF88" : "#FF4D4D" }}>
              {testResult === "ok" ? <CheckCircle2 style={{ width: 13, height: 13 }} /> : <XCircle style={{ width: 13, height: 13 }} />}
              {testResult === "ok" ? "Connected to backend successfully" : "Failed to connect — start FastAPI server"}
            </div>
          )}
        </Field>
      </Section>

      <Section icon={Palette} title="Appearance">
        <Field label="THEME">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { set("theme", t.id); toast.info(`Theme: ${t.label}`); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 9, cursor: "pointer", border: `2px solid ${form.theme === t.id ? t.accent : "rgba(255,255,255,0.1)"}`, background: form.theme === t.id ? `${t.accent}15` : "rgba(255,255,255,0.03)", color: form.theme === t.id ? t.accent : "rgba(148,163,184,0.65)", fontSize: 12, fontFamily: "monospace", transition: "all 0.15s" }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.accent, boxShadow: `0 0 8px ${t.accent}66` }} />
                {t.label}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={save} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 26px", borderRadius: 9, background: "rgba(0,245,255,0.15)", border: "1px solid rgba(0,245,255,0.35)", color: "#00F5FF", cursor: "pointer", fontSize: 13, fontFamily: "monospace", transition: "all 0.18s" }}>
          <Save style={{ width: 13, height: 13 }} />
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
        <button onClick={resetDefaults} style={{ padding: "10px 16px", borderRadius: 9, background: "none", border: "1px solid rgba(255,77,77,0.25)", color: "rgba(255,77,77,0.7)", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
          Reset Defaults
        </button>
      </div>

      {/* System info */}
      <div className="nx-glass" style={{ borderRadius: 12, padding: "14px 18px" }}>
        <div className="hud-label" style={{ marginBottom: 10 }}>SYSTEM INFO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px", fontSize: 11, fontFamily: "monospace", color: "rgba(148,163,184,0.6)" }}>
          {[
            ["NEXUS Version", "1.0.0"],
            ["AI Model", "claude-sonnet-4.5"],
            ["Frontend", "React 18 + CRA"],
            ["Backend", "FastAPI 0.115"],
            ["Database", "MongoDB Motor"],
            ["3D Engine", "Three.js + R3F"],
            ["Charts", "Recharts"],
            ["CSS", "Vanilla CSS"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span>{k}</span>
              <span style={{ color: "#00F5FF" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
