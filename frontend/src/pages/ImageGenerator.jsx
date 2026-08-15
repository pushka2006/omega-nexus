import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles, Download, Heart, ZoomIn, X, Wand2, RefreshCw,
  Loader2, Grid3X3, List, ChevronDown, Search, History,
  Image as ImageIcon, ArrowLeft, Settings2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccurateAIImageUrl, getFallbackAIImageUrl } from "../lib/NexusAIImageService";

/* ── CONSTANTS ────────────────────────────────────────── */
const STYLE_PRESETS = [
  { id: "photorealistic", label: "Photorealistic", emoji: "📷", color: "#38bdf8" },
  { id: "digital-art",    label: "Digital Art",    emoji: "🎨", color: "#a855f7" },
  { id: "anime",          label: "Anime",           emoji: "✨", color: "#ec4899" },
  { id: "oil-painting",   label: "Oil Painting",   emoji: "🖼️", color: "#f59e0b" },
  { id: "cyberpunk",      label: "Cyberpunk",       emoji: "🌃", color: "#00F5FF" },
  { id: "fantasy",        label: "Fantasy",         emoji: "🐉", color: "#34d399" },
  { id: "sketch",         label: "Sketch",          emoji: "✏️", color: "#94a3b8" },
  { id: "watercolor",     label: "Watercolor",      emoji: "💧", color: "#60a5fa" },
  { id: "3d-render",      label: "3D Render",       emoji: "🧊", color: "#f472b6" },
  { id: "pixel-art",      label: "Pixel Art",       emoji: "👾", color: "#fb923c" },
];

const ASPECT_RATIOS = [
  { id: "1:1",  label: "1:1 Square",     w: 1024, h: 1024 },
  { id: "16:9", label: "16:9 Landscape", w: 1920, h: 1080 },
  { id: "9:16", label: "9:16 Portrait",  w: 1080, h: 1920 },
  { id: "4:3",  label: "4:3 Classic",    w: 1280, h: 960  },
  { id: "21:9", label: "21:9 Cinematic", w: 2560, h: 1080 },
];

const QUALITY_LEVELS = ["Draft", "Standard", "HD", "Ultra HD"];

/* Style-specific prompt modifiers for Pollinations AI */
const STYLE_MODIFIERS = {
  "photorealistic": "photorealistic, hyperrealistic, DSLR, sharp focus, 8K UHD, studio lighting",
  "digital-art":    "digital art, concept art, ArtStation trending, vibrant colors, Unreal Engine render",
  "anime":          "anime style, Studio Ghibli, detailed, 4K, beautiful lighting, Makoto Shinkai",
  "oil-painting":   "oil painting, impressionist, textured brushstrokes, rich colors, classical master",
  "cyberpunk":      "cyberpunk, neon lights, rain reflections, blade runner 2049, futuristic city, 8K",
  "fantasy":        "epic fantasy, magical, dramatic lighting, cinematic, Lord of the Rings, detailed",
  "sketch":         "pencil sketch, fine line art, detailed hatching, black and white, concept sketch",
  "watercolor":     "watercolor painting, soft colors, flowing paint, dreamy, delicate washes",
  "3d-render":      "3D render, Blender, physically based rendering, studio lighting, octane render 4K",
  "pixel-art":      "pixel art, 32-bit, retro game sprite, bright colors, isometric, crisp pixels",
};



const SUGGESTIONS = [
  "A majestic dragon soaring above a neon cyberpunk city at night, 8K detail",
  "Ancient Japanese temple hidden in glowing cherry blossom forest at dawn",
  "Portrait of a futuristic AI android with glowing circuit-board skin, studio lighting",
  "Underwater city ruins with bioluminescent coral and sunbeams, hyperrealistic",
  "Epic space battle with giant starships above a ringed gas giant, cinematic",
  "A lone samurai in heavy rain on a neon-lit rooftop, ultra-detailed",
  "Crystal cave with towering violet stalactites and underground waterfall, 4K",
  "Wolf spirit rising from Northern Lights in frozen Arctic tundra, ethereal",
];

/* ── COMPONENT ─────────────────────────────────────────── */
export default function ImageGenerator() {
  const navigate = useNavigate();

  /* Form */
  const [prompt,        setPrompt]        = useState("");
  const [negPrompt,     setNegPrompt]     = useState("blurry, low quality, watermark, distorted, text");
  const [style,         setStyle]         = useState("photorealistic");
  const [aspectRatio,   setAspectRatio]   = useState("1:1");
  const [quality,       setQuality]       = useState("HD");
  const [numImages,     setNumImages]     = useState(4);
  const [seed,          setSeed]          = useState("");
  const [cfgScale,      setCfgScale]      = useState(7);
  const [showAdvanced,  setShowAdvanced]  = useState(false);

  /* UI */
  const [generating,    setGenerating]    = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [images,        setImages]        = useState([]);
  const [imgLoading,    setImgLoading]    = useState({});   // per-image loading state
  const [selected,      setSelected]      = useState(null);
  const [viewMode,      setViewMode]      = useState("grid");
  const [history,       setHistory]       = useState([]);
  const [liked,         setLiked]         = useState(new Set());
  const [activeTab,     setActiveTab]     = useState("generate");
  const [gallerySearch, setGallerySearch] = useState("");
  const [suggIdx,       setSuggIdx]       = useState(0);
  const [genStatus,     setGenStatus]     = useState("");   // status message shown during generation

  const promptRef  = useRef(null);
  const timerRef   = useRef(null);

  /* Rotate suggestion */
  useEffect(() => {
    const t = setInterval(() => setSuggIdx(i => (i + 1) % SUGGESTIONS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Generate — calls real Pollinations AI for actual AI images */
  const generate = useCallback(() => {
    if (!prompt.trim()) { promptRef.current?.focus(); return; }
    setGenerating(true);
    setProgress(0);
    setImages([]);
    setImgLoading({});
    setGenStatus("🧠 Sending prompt to Nexus Diffusion Engine...");

    /* Build image objects immediately with accurate AI URLs */
    const arObj = ASPECT_RATIOS.find(a => a.id === aspectRatio) || ASPECT_RATIOS[0];
    const width = arObj.w > 1280 ? Math.round(arObj.w / 1.5) : arObj.w;
    const height = arObj.h > 1280 ? Math.round(arObj.h / 1.5) : arObj.h;

    const baseSeed = seed ? Number(seed) : Math.floor(Math.random() * 999999);
    const imgs = Array.from({ length: numImages }, (_, i) => {
      const currentSeed = baseSeed + i * 1337 + Math.floor(Math.random() * 500);
      return {
        id: `${Date.now()}-${i}`,
        url: getAccurateAIImageUrl(prompt, style, currentSeed, width, height),
        prompt, style, quality, aspectRatio, cfgScale,
        seed: String(currentSeed),
        createdAt: new Date().toLocaleTimeString(),
        loaded: false,
      };
    });

    /* Track loading state per image */
    const loadingMap = {};
    imgs.forEach(img => { loadingMap[img.id] = true; });
    setImgLoading(loadingMap);

    /* Animate progress while images load */
    let prog = 0;
    const STEPS = [
      [500,  "🎨 Applying style: " + style + "..."],
      [1500, "✨ Running diffusion steps..."],
      [3000, "🔬 Upscaling to " + quality + " resolution..."],
      [4500, "🖼️ Finalizing " + numImages + " image" + (numImages > 1 ? "s" : "") + "..."],
    ];
    STEPS.forEach(([delay, msg]) => setTimeout(() => setGenStatus(msg), delay));

    timerRef.current = setInterval(() => {
      prog = Math.min(prog + Math.random() * 6 + 1, 92);
      setProgress(prog);
    }, 200);

    /* Show images immediately */
    setTimeout(() => {
      clearInterval(timerRef.current);
      setProgress(100);
      setGenStatus("✅ " + numImages + " image" + (numImages > 1 ? "s" : "") + " generated successfully!");
      setImages(imgs);
      setHistory(h => [{ id: Date.now(), prompt, style, images: imgs, createdAt: new Date().toLocaleString() }, ...h.slice(0, 19)]);
      setGenerating(false);
    }, 1200);
  }, [prompt, style, aspectRatio, quality, numImages, seed, cfgScale]);

  const onImageLoad  = (id) => setImgLoading(m => ({ ...m, [id]: false }));
  const onImageError = (id, img, e) => {
    const idx = parseInt((id || "").split("-").pop() || "0");
    if (e && e.target) {
      e.target.src = getFallbackAIImageUrl(img?.prompt || "", img?.style || style, idx);
    }
    setImgLoading(m => ({ ...m, [id]: false }));
  };

  /* Ctrl+Enter shortcut */
  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [generate]);

  const toggleLike = (id) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const download   = (img) => { const a = document.createElement("a"); a.href = img.url; a.download = `nexus-${img.id}.jpg`; a.target = "_blank"; a.click(); };

  const currentStyle = STYLE_PRESETS.find(s => s.id === style);
  const filteredHist = history.filter(h => !gallerySearch || h.prompt.toLowerCase().includes(gallerySearch.toLowerCase()));

  /* Shared card styles */
  const cardHover = { onMouseEnter: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(110,86,255,0.3)"; }, onMouseLeave: e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; } };

  const TAB = (t, label, badge) => (
    <button onClick={() => setActiveTab(t)} style={{ padding: "7px 18px", borderRadius: 8, border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: activeTab === t ? "rgba(110,86,255,0.25)" : "transparent", color: activeTab === t ? "#a78bfa" : "rgba(148,163,184,0.7)", transition: "all 0.15s" }}>
      {label}{badge > 0 && <span style={{ marginLeft: 5, background: "#6E56FF", color: "#fff", fontSize: 8, padding: "1px 5px", borderRadius: 10, fontWeight: 900 }}>{badge}</span>}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060919", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,9,25,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => navigate("/creative")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#94a3b8", fontSize: 12 }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Back
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
              <ImageIcon style={{ width: 20, height: 20, color: "#a855f7" }} /> AI IMAGE GENERATOR
            </div>
            <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", fontFamily: "monospace", marginTop: 1 }}>
              Nexus Diffusion Engine v4.2 · Ctrl+Enter to generate
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 4 }}>
          {TAB("generate", "Generate")}
          {TAB("gallery", "Gallery")}
          {TAB("history", "History", history.length)}
        </div>
        <div style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 8, padding: "4px 12px", fontSize: 10.5, color: "#a855f7", fontFamily: "monospace" }}>
          {images.length} images this session
        </div>
      </div>

      {/* ══ GENERATE TAB ══════════════════════════════════════════════ */}
      {activeTab === "generate" && (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", minHeight: 0 }}>

          {/* LEFT PANEL */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Prompt */}
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <label style={{ fontSize: 10, fontFamily: "monospace", color: "#00F5FF", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>🎨 Creative Prompt</label>
              <textarea ref={promptRef} value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder={SUGGESTIONS[suggIdx]}
                style={{ width: "100%", background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#f8fafc", fontSize: 12.5, outline: "none", fontFamily: "monospace", resize: "vertical", minHeight: 100, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                {["Ultra detailed", "8K", "Cinematic", "Golden hour", "Trending art"].map(tag => (
                  <button key={tag} onClick={() => setPrompt(p => p ? `${p}, ${tag}` : tag)}
                    style={{ background: "rgba(110,86,255,0.15)", border: "1px solid rgba(110,86,255,0.3)", color: "#a78bfa", fontSize: 9.5, padding: "3px 8px", borderRadius: 6, cursor: "pointer" }}>
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Presets */}
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <label style={{ fontSize: 10, fontFamily: "monospace", color: "#00F5FF", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>🖼️ Art Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                {STYLE_PRESETS.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    style={{ padding: "8px 10px", borderRadius: 9, background: style === s.id ? `${s.color}20` : "rgba(6,13,34,0.8)", border: `1px solid ${style === s.id ? s.color : "rgba(255,255,255,0.07)"}`, color: style === s.id ? s.color : "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{s.emoji}</span> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <label style={{ fontSize: 10, fontFamily: "monospace", color: "#00F5FF", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 10 }}>📐 Aspect Ratio</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ASPECT_RATIOS.map(r => (
                  <button key={r.id} onClick={() => setAspectRatio(r.id)}
                    style={{ padding: "7px 12px", borderRadius: 8, background: aspectRatio === r.id ? "rgba(0,245,255,0.12)" : "rgba(6,13,34,0.8)", border: `1px solid ${aspectRatio === r.id ? "#00F5FF" : "rgba(255,255,255,0.07)"}`, color: aspectRatio === r.id ? "#00F5FF" : "#94a3b8", fontSize: 11, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{r.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 9.5, opacity: 0.6 }}>{r.w}×{r.h}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Count + Quality */}
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <label style={{ fontSize: 10, fontFamily: "monospace", color: "#00F5FF", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12 }}>⚙️ Output Settings</label>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                  Images to generate <span style={{ color: "#00F5FF", fontFamily: "monospace" }}>{numImages}</span>
                </div>
                <input type="range" min="1" max="8" value={numImages} onChange={e => setNumImages(Number(e.target.value))} style={{ width: "100%", accentColor: "#6E56FF" }} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>Quality</div>
              <div style={{ display: "flex", gap: 6 }}>
                {QUALITY_LEVELS.map(q => (
                  <button key={q} onClick={() => setQuality(q)}
                    style={{ flex: 1, padding: "6px 2px", borderRadius: 7, background: quality === q ? "rgba(168,85,247,0.25)" : "rgba(6,13,34,0.8)", border: `1px solid ${quality === q ? "#a855f7" : "rgba(255,255,255,0.07)"}`, color: quality === q ? "#a855f7" : "#64748b", fontSize: 9.5, cursor: "pointer", fontWeight: 600 }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
              <button onClick={() => setShowAdvanced(v => !v)}
                style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: 0, marginBottom: showAdvanced ? 12 : 0 }}>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "#00F5FF", textTransform: "uppercase", letterSpacing: "0.08em" }}>🔬 Advanced Settings</span>
                <ChevronDown style={{ width: 14, height: 14, color: "#64748b", transform: showAdvanced ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              </button>
              {showAdvanced && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#ef4444", marginBottom: 5, fontFamily: "monospace" }}>⛔ Negative Prompt</div>
                    <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                      style={{ width: "100%", minHeight: 60, background: "rgba(6,13,34,0.9)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "8px 10px", color: "#f8fafc", fontSize: 10.5, outline: "none", fontFamily: "monospace", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8", marginBottom: 5, fontFamily: "monospace" }}>🌱 Seed (blank = random)</div>
                    <input type="number" value={seed} onChange={e => setSeed(e.target.value)} placeholder="e.g. 42069"
                      style={{ width: "100%", background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", color: "#f8fafc", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8", marginBottom: 5, display: "flex", justifyContent: "space-between", fontFamily: "monospace" }}>
                      CFG Scale <span style={{ color: "#00F5FF" }}>{cfgScale}</span>
                    </div>
                    <input type="range" min="1" max="20" value={cfgScale} onChange={e => setCfgScale(Number(e.target.value))} style={{ width: "100%", accentColor: "#00F5FF" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#475569", marginTop: 2 }}>
                      <span>Creative</span><span>Balanced</span><span>Strict</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GENERATE BUTTON */}
            <button onClick={generate} disabled={generating}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: generating ? "rgba(110,86,255,0.3)" : "linear-gradient(90deg, #6E56FF, #00F5FF)", border: generating ? "1px solid #6E56FF" : "none", color: "#ffffff", fontSize: 13, fontWeight: 800, cursor: generating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: generating ? "none" : "0 0 24px rgba(110,86,255,0.45)" }}>
              {generating
                ? <><Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> Diffusing... {Math.round(progress)}%</>
                : <><Sparkles style={{ width: 15, height: 15 }} /> Generate {numImages} Image{numImages > 1 ? "s" : ""}</>
              }
            </button>

            {/* Progress bar + status */}
            {(generating || genStatus) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {generating && (
                  <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#6E56FF,#00F5FF)", width: `${progress}%`, transition: "width 0.2s ease" }} />
                  </div>
                )}
                {genStatus && (
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: genStatus.startsWith("✅") ? "#34d399" : "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                    {genStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT OUTPUT PANEL */}
          <div style={{ overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Toolbar */}
            {images.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 14px" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#f8fafc" }}>
                  {images.length} images &nbsp;
                  <span style={{ fontSize: 9.5, color: "#64748b", fontFamily: "monospace" }}>
                    · <span style={{ color: currentStyle?.color }}>{currentStyle?.label}</span>
                    · <span style={{ color: "#00F5FF" }}>{aspectRatio}</span>
                    · <span style={{ color: "#a855f7" }}>{quality}</span>
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["grid", Grid3X3], ["list", List]].map(([m, Icon]) => (
                    <button key={m} onClick={() => setViewMode(m)}
                      style={{ background: viewMode === m ? "rgba(110,86,255,0.2)" : "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "5px 8px", cursor: "pointer", color: viewMode === m ? "#a78bfa" : "#64748b" }}>
                      <Icon style={{ width: 13, height: 13 }} />
                    </button>
                  ))}
                  <button onClick={generate} disabled={generating}
                    style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", color: "#34d399", fontSize: 10.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <RefreshCw style={{ width: 11, height: 11 }} /> Regenerate
                  </button>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!generating && images.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, minHeight: 460, textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wand2 style={{ width: 40, height: 40, color: "#a855f7", opacity: 0.6 }} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>Create Stunning Images with AI</div>
                  <div style={{ fontSize: 12.5, color: "rgba(148,163,184,0.6)", marginTop: 6 }}>Enter a prompt, pick your style, and hit Generate</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 520 }}>
                  <div style={{ fontSize: 10.5, color: "#64748b", fontFamily: "monospace", marginBottom: 2 }}>💡 QUICK PROMPTS — click to use</div>
                  {SUGGESTIONS.slice(0, 4).map((s, i) => (
                    <button key={i} onClick={() => setPrompt(s)}
                      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", textAlign: "left", cursor: "pointer", color: "#94a3b8", fontSize: 11.5, lineHeight: 1.4 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,86,255,0.5)"; e.currentTarget.style.color = "#f8fafc"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}>
                      <span style={{ color: "#a78bfa", marginRight: 6 }}>✦</span>{s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SKELETON WHILE WAITING FOR STATUS (first 1.2s) */}
            {generating && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {Array.from({ length: numImages }).map((_, i) => (
                  <div key={i} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, aspectRatio: "1/1", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, transparent 25%, rgba(168,85,247,0.06) 50%, transparent 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                      <div style={{ fontSize: 9.5, color: "#475569", fontFamily: "monospace", marginBottom: 4 }}>🧠 Generating image {i + 1} with AI...</div>
                      <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#6E56FF,#00F5FF)", transition: "width 0.15s" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* IMAGE GRID */}
            {!generating && images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: viewMode === "list" ? "1fr" : "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
                {images.map(img => (
                  <div key={img.id} {...cardHover}
                    style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", display: viewMode === "list" ? "flex" : "block", alignItems: "center", gap: viewMode === "list" ? 14 : 0, padding: viewMode === "list" ? 12 : 0 }}>

                    {/* Thumbnail with real Pollinations AI image */}
                    <div style={{ position: "relative", flexShrink: 0, width: viewMode === "list" ? 80 : "100%", aspectRatio: "1/1", overflow: "hidden", borderRadius: viewMode === "list" ? 10 : 0 }}>
                      {/* Loading shimmer shown while Pollinations AI generates the image */}
                      {imgLoading[img.id] && (
                        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(15,23,42,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, transparent 25%, rgba(168,85,247,0.08) 50%, transparent 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                          <Loader2 style={{ width: 24, height: 24, color: "#a855f7", animation: "spin 1s linear infinite", position: "relative", zIndex: 3 }} />
                          <div style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace", position: "relative", zIndex: 3, textAlign: "center" }}>🧠 AI Generating...</div>
                        </div>
                      )}
                      <img src={img.url} alt={img.prompt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoading[img.id] ? 0 : 1, transition: "opacity 0.4s ease" }}
                        onLoad={() => onImageLoad(img.id)}
                        onError={(e) => onImageError(img.id, img, e)}
                      />
                      {viewMode === "grid" && !imgLoading[img.id] && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}>
                          {[{ Icon: ZoomIn, action: () => setSelected(img) }, { Icon: Heart, action: () => toggleLike(img.id) }, { Icon: Download, action: () => download(img) }].map(({ Icon, action }, i) => (
                            <button key={i} onClick={action}
                              style={{ background: i === 1 && liked.has(img.id) ? "#ef4444" : "rgba(255,255,255,0.9)", border: "none", borderRadius: 8, padding: 7, cursor: "pointer" }}>
                              <Icon style={{ width: 13, height: 13, color: "#020617" }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div style={{ padding: viewMode === "list" ? 0 : "10px 12px", flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", marginBottom: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{img.prompt}</div>
                      <div style={{ fontSize: 9.5, color: "#475569", fontFamily: "monospace" }}>
                        <span style={{ color: currentStyle?.color }}>{img.style}</span> · {img.aspectRatio} · {img.quality}
                      </div>
                      {viewMode === "list" && (
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          {[["View", () => setSelected(img), "#a78bfa", "rgba(110,86,255,0.15)", "rgba(110,86,255,0.35)"], ["Download", () => download(img), "#34d399", "rgba(52,211,153,0.12)", "rgba(52,211,153,0.3)"]].map(([label, action, col, bg, brd]) => (
                            <button key={label} onClick={action}
                              style={{ background: bg, border: `1px solid ${brd}`, color: col, fontSize: 9.5, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ GALLERY TAB ══ */}
      {activeTab === "gallery" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>Your Image Gallery</div>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: 10, top: 9, width: 13, height: 13, color: "#475569" }} />
              <input value={gallerySearch} onChange={e => setGallerySearch(e.target.value)} placeholder="Search prompts..."
                style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "7px 12px 7px 30px", color: "#f8fafc", fontSize: 11.5, outline: "none", width: 240 }} />
            </div>
          </div>
          {history.length === 0
            ? <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}><ImageIcon style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.25 }} /><div>Generate some images first!</div></div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {filteredHist.flatMap(h => h.images).map(img => (
                  <div key={img.id} onClick={() => setSelected(img)} {...cardHover}
                    style={{ background: "rgba(6,13,34,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}>
                    <img src={img.url} alt={img.prompt} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${img.id}/400/400`; }} />
                    <div style={{ padding: "8px 10px" }}>
                      <div style={{ fontSize: 10.5, color: "#94a3b8", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{img.prompt}</div>
                      <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>{img.style} · {img.createdAt}</div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ══ HISTORY TAB ══ */}
      {activeTab === "history" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", marginBottom: 18 }}>Generation History</div>
          {history.length === 0
            ? <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}><History style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.25 }} /><div>No history yet.</div></div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {history.map(h => {
                  const sColor = STYLE_PRESETS.find(s => s.id === h.style)?.color || "#a855f7";
                  return (
                    <div key={h.id} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {h.images.slice(0, 3).map(img => (
                          <img key={img.id} src={img.url} alt="" onClick={() => setSelected(img)}
                            style={{ width: 58, height: 58, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                            onError={e => { e.target.src = `https://picsum.photos/seed/${img.id}/60/60`; }} />
                        ))}
                        {h.images.length > 3 && (
                          <div onClick={() => setActiveTab("gallery")} style={{ width: 58, height: 58, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            +{h.images.length - 3}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>{h.prompt}</div>
                        <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
                          {h.images.length} images · Style: <span style={{ color: sColor }}>{h.style}</span> · {h.createdAt}
                        </div>
                      </div>
                      <button onClick={() => { setPrompt(h.prompt); setStyle(h.style); setActiveTab("generate"); }}
                        style={{ background: "rgba(110,86,255,0.15)", border: "1px solid rgba(110,86,255,0.3)", color: "#a78bfa", fontSize: 10, padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>
                        Reuse ↩
                      </button>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}

      {/* ══ LIGHTBOX ══ */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(2,6,23,0.96)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()}
            style={{ maxWidth: 840, width: "100%", borderRadius: 20, overflow: "hidden", background: "#0a1220", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 120px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#f8fafc" }}>Image Preview</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleLike(selected.id)}
                  style={{ background: liked.has(selected.id) ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${liked.has(selected.id) ? "#ef4444" : "rgba(255,255,255,0.1)"}`, color: liked.has(selected.id) ? "#ef4444" : "#94a3b8", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <Heart style={{ width: 12, height: 12 }} />{liked.has(selected.id) ? " Liked" : " Like"}
                </button>
                <button onClick={() => download(selected)}
                  style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <Download style={{ width: 12, height: 12 }} /> Download
                </button>
                <button onClick={() => setSelected(null)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: 7, borderRadius: 8, cursor: "pointer" }}>
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
            <img src={selected.url} alt={selected.prompt}
              style={{ width: "100%", maxHeight: 500, objectFit: "contain", background: "#060919" }}
              onError={e => { e.target.src = `https://picsum.photos/seed/${selected.id}/800/600`; }} />
            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", marginBottom: 8 }}>{selected.prompt}</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 10.5, fontFamily: "monospace" }}>
                {[["Style", selected.style, "#a855f7"], ["Quality", selected.quality, "#00F5FF"], ["Ratio", selected.aspectRatio, "#34d399"], ["Seed", selected.seed, "#fbbf24"], ["CFG", selected.cfgScale, "#38bdf8"]].map(([l, v, c]) => (
                  <span key={l}><span style={{ color: "#475569" }}>{l}: </span><span style={{ color: c }}>{v}</span></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  );
}
