import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder, Image as ImageIcon, Sparkles, Clock, HardDrive, Search, Plus, Bell,
  MessageSquare, HelpCircle, Video, Box, User, Rocket, Shield, Music, Volume2,
  Play, Eye, Heart, Layers, Upload, ArrowRight, Wand2, Palette, Scissors,
  Maximize2, Expand, CheckCircle2, ChevronRight, X
} from "lucide-react";
import { toast } from "../components/Toast";

export default function CreativeStudio() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(5);

  const handleLaunchTool = (toolName) => {
    if (toolName === "Image Generation") { navigate("/image-gen"); return; }
    setActiveModal(toolName);
    toast.info(`Engaging ${toolName}...`);
  };

  const handleGenerateAsset = () => {
    if (!promptInput) {
      toast.error("Please enter a creative prompt first!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveModal(null);
      toast.success(`✨ Created new asset for "${promptInput}"! Saved to Assets Library.`);
      setPromptInput("");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060919", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", padding: 24 }}>
      {/* ── TOP HEADER BAR ───────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#ffffff", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 10 }}>
            CREATIVE STUDIO
          </div>
          <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", marginTop: 2 }}>
            Imagine. Create. Inspire.
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Search bar */}
          <div style={{ position: "relative", width: 280 }}>
            <Search style={{ position: "absolute", left: 12, top: 10, width: 14, height: 14, color: "rgba(148,163,184,0.5)" }} />
            <input
              placeholder="Search your assets, projects, tools..."
              style={{ width: "100%", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px 8px 34px", color: "#f8fafc", fontSize: 11, outline: "none" }}
            />
            <span style={{ position: "absolute", right: 10, top: 8, fontSize: 9, color: "rgba(148,163,184,0.5)", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>Ctrl K</span>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => handleLaunchTool("New Project Generator")}
            style={{ padding: "8px 16px", borderRadius: 10, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#ffffff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 0 20px rgba(110,86,255,0.4)" }}
          >
            <Plus style={{ width: 14, height: 14 }} /> New Project
          </button>

          {/* Icon Badges */}
          <div style={{ position: "relative", width: 34, height: 34, borderRadius: 10, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell style={{ width: 15, height: 15, color: "rgba(148,163,184,0.8)" }} />
            <span style={{ position: "absolute", top: 4, right: 4, background: "#ef4444", color: "#fff", fontSize: 8, fontWeight: 800, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>12</span>
          </div>

          <div style={{ position: "relative", width: 34, height: 34, borderRadius: 10, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <MessageSquare style={{ width: 15, height: 15, color: "rgba(148,163,184,0.8)" }} />
            <span style={{ position: "absolute", top: 4, right: 4, background: "#3b82f6", color: "#fff", fontSize: 8, fontWeight: 800, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>7</span>
          </div>

          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <HelpCircle style={{ width: 15, height: 15, color: "rgba(148,163,184,0.8)" }} />
          </div>

          {/* User Profile Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 12px 4px 6px", borderRadius: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #00F5FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>
              PB
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", lineHeight: 1.1 }}>Pushkar Balyan</div>
              <div style={{ fontSize: 9, color: "#a855f7", fontFamily: "monospace" }}>Super Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP METRICS ROW (6 Cards) ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 24 }}>
        {/* Card 1: Total Projects */}
        <div className="nx-glass" style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Folder style={{ width: 20, height: 20, color: "#fbbf24" }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>TOTAL PROJECTS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>24</div>
            <div style={{ fontSize: 9.5, color: "#34d399", fontFamily: "monospace" }}>↑ 8 this month</div>
          </div>
        </div>

        {/* Card 2: Assets Created */}
        <div className="nx-glass" style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon style={{ width: 20, height: 20, color: "#a855f7" }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>ASSETS CREATED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>1,248</div>
            <div style={{ fontSize: 9.5, color: "#a855f7", fontFamily: "monospace" }}>↑ 156 this month</div>
          </div>
        </div>

        {/* Card 3: AI Generations */}
        <div className="nx-glass" style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(0,245,255,0.3)", background: "rgba(0,245,255,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,245,255,0.2)", border: "1px solid rgba(0,245,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles style={{ width: 20, height: 20, color: "#00F5FF" }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>AI GENERATIONS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>5,687</div>
            <div style={{ fontSize: 9.5, color: "#00F5FF", fontFamily: "monospace" }}>↑ 23.6% this month</div>
          </div>
        </div>

        {/* Card 4: Render Time Saved */}
        <div className="nx-glass" style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Clock style={{ width: 20, height: 20, color: "#34d399" }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>RENDER TIME SAVED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>312 hrs</div>
            <div style={{ fontSize: 9.5, color: "#34d399", fontFamily: "monospace" }}>↑ 68% this month</div>
          </div>
        </div>

        {/* Card 5: Storage Used */}
        <div className="nx-glass" style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HardDrive style={{ width: 20, height: 20, color: "#a855f7" }} />
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>STORAGE USED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>256 GB</div>
            <div style={{ fontSize: 9.5, color: "#a855f7", fontFamily: "monospace" }}>↑ 42% this month</div>
          </div>
        </div>

        {/* Card 6: Creativity Score Circular Gauge */}
        <div className="nx-glass" style={{ padding: "12px 16px", borderRadius: 14, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", textTransform: "uppercase" }}>CREATIVITY SCORE</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>92.4/100</div>
            <div style={{ fontSize: 9.5, color: "#a855f7", fontFamily: "monospace", fontWeight: 700 }}>Excellent</div>
          </div>
          <div style={{ position: "relative", width: 46, height: 46 }}>
            <svg width="46" height="46" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#purpleGlow)" strokeWidth="3" strokeDasharray="92, 100" />
              <defs>
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#00F5FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD GRID (Left Content + Right Sidebar) ──────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24 }}>
        {/* LEFT SECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 1. CREATE ANYTHING QUICK LAUNCHER (8 Tools Grid) */}
          <div className="nx-glass" style={{ padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              CREATE ANYTHING
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10 }}>
              {[
                { name: "Image Generation", icon: ImageIcon, color: "#a855f7" },
                { name: "AI Video Generation", icon: Video, color: "#ec4899" },
                { name: "3D Scene Generator", icon: Box, color: "#00F5FF" },
                { name: "Character Creator", icon: User, color: "#ef4444" },
                { name: "Concept Art Generator", icon: Rocket, color: "#fbbf24" },
                { name: "Logo & Brand Designer", icon: Shield, color: "#38bdf8" },
                { name: "Music Composer", icon: Music, color: "#8b5cf6" },
                { name: "Voice & SFX Generator", icon: Volume2, color: "#34d399" }
              ].map((tool, idx) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleLaunchTool(tool.name)}
                    style={{
                      background: "rgba(10,16,38,0.8)", border: `1px solid ${tool.color}33`, borderRadius: 12, padding: "14px 8px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 0.15s ease",
                      textAlign: "center"
                    }}
                    className="nx-row-hover"
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${tool.color}18`, border: `1px solid ${tool.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComponent style={{ width: 18, height: 18, color: tool.color }} />
                    </div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. RECENT CREATIONS GALLERY GRID (8 Rich Cards) */}
          <div className="nx-glass" style={{ padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                RECENT CREATIONS
              </div>
              <button onClick={() => toast.info("Showing all assets in Library.")} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.6)", fontSize: 10.5, fontFamily: "monospace", cursor: "pointer" }}>
                View All
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { title: "Cyberpunk Cityscape", tag: "IMAGE", tagBg: "#a855f7", time: "2 min ago", views: "4K", likes: 128, img: "/assets/cyberpunk_cityscape.png" },
                { title: "AI Warrior Concept", tag: "CHARACTER", tagBg: "#ec4899", time: "1 hour ago", views: "4K", likes: 96, img: "/assets/ai_warrior_concept.png" },
                { title: "Ancient Temple Environment", tag: "3D SCENE", tagBg: "#00F5FF", time: "3 hours ago", views: "8K", likes: 156, img: "/assets/ancient_temple_env.png" },
                { title: "Space Exploration Trailer", tag: "VIDEO", duration: "00:45", tagBg: "#fbbf24", time: "5 hours ago", views: "4K", likes: 89, isVideo: true, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
                { title: "Nexus Tech Logo", tag: "LOGO", tagBg: "#38bdf8", time: "1 day ago", views: "2K", likes: 78, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
                { title: "Fantasy Landscape", tag: "CONCEPT ART", tagBg: "#34d399", time: "1 day ago", views: "4K", likes: 112, img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
                { title: "Epic Orchestral Score", tag: "MUSIC", duration: "02:58", tagBg: "#8b5cf6", time: "2 days ago", views: null, likes: 64, isAudio: true, img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
                { title: "AI Neural Portrait", tag: "IMAGE", tagBg: "#a855f7", time: "2 days ago", views: "4K", likes: 93, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" }
              ].map((card, idx) => (
                <div key={idx} style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }} className="nx-row-hover">
                  {/* Thumbnail Preview with Tag */}
                  <div style={{ position: "relative", height: 120, width: "100%", background: "#0f172a", overflow: "hidden" }}>
                    <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    
                    {/* Tag badge */}
                    <span style={{ position: "absolute", top: 8, left: 8, background: card.tagBg, color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>
                      {card.tag}
                    </span>

                    {/* Duration badge if video/music */}
                    {card.duration && (
                      <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 8, fontFamily: "monospace", padding: "2px 6px", borderRadius: 4 }}>
                        {card.duration}
                      </span>
                    )}

                    {/* Play button overlay if Video */}
                    {card.isVideo && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Play style={{ width: 12, height: 12, color: "#020617", marginLeft: 2 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Meta */}
                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {card.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 8.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>
                      <span>{card.time}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {card.views && <span>👁️ {card.views}</span>}
                        <span>❤️ {card.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR PANELS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* 1. ACTIVE PROJECTS */}
          <div className="nx-glass" style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#f8fafc", fontFamily: "monospace", textTransform: "uppercase" }}>
                ACTIVE PROJECTS
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", cursor: "pointer" }}>View All</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Smart City 3D Visualizer", type: "3D Scene", progress: 75, color: "#00F5FF" },
                { name: "AI Game Development Kit", type: "Game Assets", progress: 45, color: "#a855f7" },
                { name: "Brand Identity Design", type: "Branding", progress: 90, color: "#38bdf8" },
                { name: "Marketing Video Campaign", type: "Video", progress: 60, color: "#ec4899" },
                { name: "Mobile App UI/UX", type: "UI/UX Design", progress: 80, color: "#34d399" }
              ].map((p, idx) => (
                <div key={idx} style={{ background: "rgba(6,13,34,0.8)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "#f8fafc" }}>{p.name}</span>
                    <span style={{ fontSize: 9.5, color: p.color, fontFamily: "monospace" }}>{p.progress}%</span>
                  </div>
                  <div style={{ fontSize: 8.5, color: "rgba(148,163,184,0.6)", marginBottom: 6 }}>{p.type}</div>
                  <div style={{ height: 4, width: "100%", borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${p.progress}%`, height: "100%", background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. AI CREATIVE TOOLS */}
          <div className="nx-glass" style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#a855f7", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 12 }}>
              AI CREATIVE TOOLS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Prompt Enhancer", desc: "Enhance your prompts", icon: Wand2 },
                { name: "Style Transfer", desc: "Apply art styles", icon: Palette },
                { name: "Background Remover", desc: "Remove backgrounds", icon: Scissors },
                { name: "Image Upscaler", desc: "Increase resolution", icon: Maximize2 },
                { name: "Magic Expand", desc: "Extend images", icon: Expand }
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon style={{ width: 14, height: 14, color: "#a855f7" }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc" }}>{tool.name}</div>
                        <div style={{ fontSize: 8.5, color: "rgba(148,163,184,0.6)" }}>{tool.desc}</div>
                      </div>
                    </div>
                    <button onClick={() => toast.success(`Applied ${tool.name} tool!`)} style={{ background: "rgba(168,85,247,0.2)", border: "1px solid #a855f7", color: "#a855f7", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, cursor: "pointer" }}>
                      AI
                    </button>
                  </div>
                );
              })}
            </div>

            <button onClick={() => toast.info("Opening AI Creative Tools directory.")} style={{ width: "100%", marginTop: 12, padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(148,163,184,0.8)", fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>
              Explore All Tools
            </button>
          </div>

          {/* 3. INSPIRATION FEED */}
          <div className="nx-glass" style={{ padding: 16, borderRadius: 16, border: "1px solid rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#00F5FF", fontFamily: "monospace", textTransform: "uppercase" }}>
                INSPIRATION FEED
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", cursor: "pointer" }}>View All</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 10 }}>
              <img src="/assets/cyberpunk_cityscape.png" alt="Inspiration 1" style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 6 }} />
              <img src="/assets/ai_warrior_concept.png" alt="Inspiration 2" style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 6 }} />
              <img src="/assets/ancient_temple_env.png" alt="Inspiration 3" style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 6 }} />
            </div>

            <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", textAlign: "center", marginBottom: 10 }}>
              Daily dose of creativity from around the world
            </div>

            <button onClick={() => toast.success("Refreshed Inspiration Feed with 20 new community artworks!")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#ffffff", fontSize: 10.5, fontWeight: 700, cursor: "pointer" }}>
              Get Inspired
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: WORKFLOW & QUICK ACTIONS ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* CREATIVE WORKFLOW */}
        <div className="nx-glass" style={{ padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>
            CREATIVE WORKFLOW
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {[
              { num: 1, name: "IDEA", desc: "Capture your idea" },
              { num: 2, name: "GENERATE", desc: "AI creates concepts" },
              { num: 3, name: "REFINE", desc: "Edit and enhance" },
              { num: 4, name: "PERFECT", desc: "Polish to perfection" },
              { num: 5, name: "EXPORT", desc: "Use anywhere", active: true }
            ].map((step) => (
              <div
                key={step.num}
                onClick={() => setActiveWorkflowStep(step.num)}
                style={{
                  background: step.num === activeWorkflowStep ? "linear-gradient(135deg, #6E56FF, #00F5FF)" : "rgba(6,13,34,0.8)",
                  border: step.num === activeWorkflowStep ? "1px solid #00F5FF" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "12px 10px", cursor: "pointer"
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 900, color: step.num === activeWorkflowStep ? "#ffffff" : "rgba(148,163,184,0.5)" }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: step.num === activeWorkflowStep ? "#ffffff" : "#f8fafc", marginTop: 4 }}>
                  {step.name}
                </div>
                <div style={{ fontSize: 8.5, color: step.num === activeWorkflowStep ? "rgba(255,255,255,0.8)" : "rgba(148,163,184,0.6)" }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="nx-glass" style={{ padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 14 }}>
            QUICK ACTIONS
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => handleLaunchTool("Start New Project")} style={{ padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 10.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Folder style={{ width: 13, height: 13, color: "#00F5FF" }} /> Start New Project
            </button>

            <button onClick={() => handleLaunchTool("Import Files")} style={{ padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 10.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Upload style={{ width: 13, height: 13, color: "#a855f7" }} /> Import Files
            </button>

            <button onClick={() => handleLaunchTool("AI Generate")} style={{ padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 10.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles style={{ width: 13, height: 13, color: "#fbbf24" }} /> AI Generate
            </button>

            <button onClick={() => handleLaunchTool("Batch Create")} style={{ padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: 10.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Layers style={{ width: 13, height: 13, color: "#34d399" }} /> Batch Create
            </button>
          </div>
        </div>
      </div>

      {/* ── TOOL GENERATION MODAL ────────────────────────────────────── */}
      {activeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(2,6,23,0.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setActiveModal(null)}
        >
          <div onClick={e => e.stopPropagation()} className="nx-fadein"
            style={{ width: "100%", maxWidth: 540, borderRadius: 18, background: "#060d22", border: "1px solid #a855f7", boxShadow: "0 0 50px rgba(168,85,247,0.3)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(168,85,247,0.2)", paddingBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#a855f7" }}>
                ✨ {activeModal}
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.6)", cursor: "pointer" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: 10, color: "#00F5FF", display: "block", marginBottom: 6, fontFamily: "monospace" }}>ENTER CREATIVE PROMPT</label>
              <textarea
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="e.g. Futuristic cyberpunk city with glowing neon rain, 8k resolution hyperrealistic..."
                style={{ width: "100%", height: 90, background: "rgba(15,23,42,0.9)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 10, padding: 12, color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "monospace" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setActiveModal(null)} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", fontSize: 11, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleGenerateAsset} disabled={isGenerating} style={{ padding: "8px 20px", borderRadius: 8, background: "linear-gradient(90deg, #6E56FF, #00F5FF)", border: "none", color: "#ffffff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {isGenerating ? "Generating..." : "Generate Asset ⚡"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
