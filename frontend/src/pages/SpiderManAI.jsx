import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic, Search, BarChart3, Crosshair, Shield, ShieldAlert,
  CheckCircle2, Bell, MapPin, CloudRain, Sun, CloudSun,
  CloudFog, CloudSnow, CloudLightning, Navigation,
  RefreshCw, Sparkles, Terminal, Sliders, Database as DbIcon,
  X, Eye, Compass, Send, Activity, ArrowLeft
} from "lucide-react";
import { http } from "../lib/api";
import { useDeviceWeather } from "../lib/locationWeather";

// ── Authentic Marvel / Insomniac Spider Emblem (Matching User Reference) ──
export function SpiderEmblem({ size = 22, color = "#ff2a4d", glow = true, className = "" }) {
  const [useImg, setUseImg] = useState(true);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        verticalAlign: "middle"
      }}
    >
      {useImg ? (
        <img
          src="/assets/real_spider_logo_hd.png"
          alt="Spider Logo"
          onError={() => setUseImg(false)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: glow ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}aa)` : "none"
          }}
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          style={{
            filter: glow ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}88)` : "none"
          }}
        >
          {/* Sharp Head & Diamond Abdomen */}
          <polygon points="50,14 44,22 50,28 56,22" fill={color} />
          <polygon points="50,30 42,42 45,74 50,88 55,74 58,42" fill={color} />

          {/* Sharp Angular Legs */}
          <polyline points="45,24 28,10 16,18 26,30 43,32" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="44,28 20,18 10,30 22,44 42,40" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="43,46 14,52 8,66 24,74 42,58" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="45,58 20,74 22,90 34,86 46,70" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />

          <polyline points="55,24 72,10 84,18 74,30 57,32" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="56,28 80,18 90,30 78,44 58,40" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="57,46 86,52 92,66 76,74 58,58" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
          <polyline points="55,58 80,74 78,90 66,86 54,70" stroke={color} strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      )}
    </div>
  );
}


// ── Spider-Man Holographic Mask Avatar ──
export function SpiderMaskAvatar({ size = 38, glowing = true }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle, #2a0b12 0%, #0c0508 100%)",
        border: "1.5px solid #ff2a4d",
        boxShadow: glowing ? "0 0 14px rgba(255,42,77,0.6), inset 0 0 8px rgba(255,42,77,0.4)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0
      }}
    >
      {!imgErr ? (
        <img
          src="/assets/spiderman_mask.png"
          alt="Mask"
          onError={() => setImgErr(true)}
          style={{
            width: "85%",
            height: "85%",
            objectFit: "contain",
            filter: "brightness(1.1) contrast(1.1) drop-shadow(0 0 4px rgba(255,42,77,0.5))"
          }}
        />
      ) : (
        <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 60 60" fill="none">
          <path d="M30 6 C16 6 8 18 10 34 C12 46 22 54 30 56 C38 54 48 46 50 34 C52 18 44 6 30 6 Z" fill="#cf142b" stroke="#ff4d6d" strokeWidth="1.5" />
          <path d="M30 6 L30 56 M10 34 Q30 38 50 34 M14 22 Q30 25 46 22 M18 44 Q30 46 42 44" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" fill="none" />
          <path d="M16 25 Q24 23 27 32 Q21 34 16 25 Z" fill="#ffffff" stroke="#000" strokeWidth="2" style={{ filter: "drop-shadow(0 0 3px #00f5ff)" }} />
          <path d="M44 25 Q36 23 33 32 Q39 34 44 25 Z" fill="#ffffff" stroke="#000" strokeWidth="2" style={{ filter: "drop-shadow(0 0 3px #00f5ff)" }} />
        </svg>
      )}
    </div>
  );
}

// ── Center Spider-Man Crouching Hero Illustration Component ──
function SpiderManHeroIllustration({ isListening, isSpeaking, size = 215 }) {
  const [imgError, setImgError] = useState(false);
  const heroImgSize = Math.round(size * 0.82);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Dual Color Outer HUD Arc: Cyan Left, Red Right */}
      <svg width={size} height={size} viewBox="0 0 290 290" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Left Semi-Circle Arc (Cyan) */}
        <path
          d="M 145 10 A 135 135 0 0 0 145 280"
          fill="none"
          stroke="#00f5ff"
          strokeWidth="2.2"
          strokeDasharray="180 8 40 8"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,245,255,0.6))" }}
        />
        {/* Right Semi-Circle Arc (Red) */}
        <path
          d="M 145 10 A 135 135 0 0 1 145 280"
          fill="none"
          stroke="#ff2a4d"
          strokeWidth="2.8"
          strokeDasharray="140 10 30 10 50 10"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,42,77,0.7))" }}
        />
        {/* Concentric Inner Tech Ring with ticks */}
        <circle
          cx="145"
          cy="145"
          r="118"
          fill="none"
          stroke="rgba(255,42,77,0.25)"
          strokeWidth="1.2"
          strokeDasharray="8 6"
        />
        {/* Concentric Blue Radar Ring */}
        <circle
          cx="145"
          cy="145"
          r="105"
          fill="rgba(5, 8, 18, 0.7)"
          stroke="rgba(0,245,255,0.3)"
          strokeWidth="1"
        />
        {/* HUD Markers */}
        <circle cx="280" cy="145" r="4.5" fill="#ff2a4d" style={{ filter: "drop-shadow(0 0 6px #ff2a4d)" }} />
        <circle cx="10" cy="145" r="4.5" fill="#00f5ff" style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
      </svg>

      {/* Top spider marker */}
      <div style={{ position: "absolute", top: Math.round(size * 0.04), left: "50%", transform: "translateX(-50%)", zIndex: 12 }}>
        <SpiderEmblem size={Math.round(size * 0.08)} color="#ff2a4d" />
      </div>

      {/* Spider-Man Hero Image (Photorealistic Iron Spider / Spider-Man Crouching Hero) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: heroImgSize,
          height: heroImgSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(255,42,77,0.45))",
          transform: isListening ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.3s ease"
        }}
      >
        {!imgError ? (
          <img
            src="/assets/spiderman_mcu.png"
            alt="Spider-Man"
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "brightness(1.15) contrast(1.18) drop-shadow(0 0 12px rgba(255,42,77,0.4))"
            }}
          />
        ) : (
          <img
            src="/assets/spiderman_crouch_3.png"
            alt="Spider-Man"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "brightness(1.12) contrast(1.15)"
            }}
          />
        )}
      </div>
    </div>
  );
}




// ── Circular Arc Speedometer / System Status Gauge ──
function RadialStatusGauge({ percentage = 98 }) {
  const radius = 48;
  const stroke = 6.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * (circumference * 0.75);

  return (
    <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg height={100} width={100} style={{ transform: "rotate(135deg)" }}>
        <circle
          stroke="rgba(255, 42, 77, 0.15)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          r={normalizedRadius}
          cx={50}
          cy={50}
          strokeLinecap="round"
        />
        <circle
          stroke="url(#spiderGaugeGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease" }}
          r={normalizedRadius}
          cx={50}
          cy={50}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="spiderGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#ff7700" />
            <stop offset="100%" stopColor="#ff2a4d" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SpiderEmblem size={18} color="#ff2a4d" />
        <span style={{ fontSize: 19, fontWeight: 900, fontFamily: "monospace", color: "#ffffff", marginTop: 1 }}>
          {percentage}%
        </span>
        <span style={{ fontSize: 8.5, color: "#34d399", letterSpacing: "0.1em", fontWeight: 700 }}>
          OPTIMAL
        </span>
      </div>
    </div>
  );
}



// ── Multi-Bar Sound Wave Equalizer ──
function SoundWaveEqualizer({ bars = 26, height = 20, color = "#00f5ff", active = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const factor = Math.sin((i / (bars - 1)) * Math.PI);
        const baseH = Math.max(3, Math.floor(factor * (height - 3)));
        const isCenter = i >= bars * 0.4 && i <= bars * 0.6;
        const barColor = isCenter ? "#ff2a4d" : color;

        return (
          <div
            key={i}
            style={{
              width: 2,
              height: active ? `${baseH}px` : "3px",
              background: barColor,
              borderRadius: 1,
              boxShadow: active ? `0 0 5px ${barColor}` : "none",
              animation: active ? `spider-audio-wave ${0.4 + (i % 6) * 0.12}s ease-in-out infinite alternate` : "none",
              animationDelay: `${(i % 5) * 0.1}s`,
              transition: "height 0.2s ease"
            }}
          />
        );
      })}
    </div>
  );
}

// ── Dual Spectrum Wide Waveform (for Voice Command Card) ──
function DualSpectrumWaveform({ active = true, statusText = "Listening..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2.2, width: "100%", height: 44 }}>
        {Array.from({ length: 48 }).map((_, i) => {
          const factor = Math.sin((i / 47) * Math.PI);
          const barHeight = Math.max(5, Math.floor(factor * 40 * (active ? 0.9 + Math.random() * 0.2 : 0.4)));
          const isRed = i > 30;
          const barColor = isRed ? "#ff2a4d" : "#00f5ff";

          return (
            <div
              key={i}
              style={{
                width: 2.6,
                height: `${barHeight}px`,
                background: barColor,
                borderRadius: 2,
                boxShadow: `0 0 6px ${barColor}`,
                animation: active ? `spider-audio-wave ${0.5 + (i % 8) * 0.08}s ease-in-out infinite alternate` : "none",
                animationDelay: `${(i % 6) * 0.07}s`
              }}
            />
          );
        })}
      </div>
      <div style={{ fontSize: 13, color: "rgba(148,163,184,0.95)", fontFamily: "monospace", letterSpacing: "0.06em", fontWeight: 700 }}>
        {statusText}
      </div>
    </div>
  );
}

export default function SpiderManAI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HOME");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("Standing by for Peter's voice directive.");
  const [aiResponse, setAiResponse] = useState("I'm listening, Peter. What would you like me to do?");
  const [modalMode, setModalMode] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [textInput, setTextInput] = useState("");
  const [modalSearchInput, setModalSearchInput] = useState("");
  const [activeGadget, setActiveGadget] = useState(null);
  const [karenVolume, setKarenVolume] = useState(1.0);
  const [karenPitch, setKarenPitch] = useState(1.1);
  const [karenRate, setKarenRate] = useState(1.03);

  // Real Device Location & Live Weather Hook
  const { weather, loading: weatherLoading, refresh: refreshWeather, requestGpsLocation, isGps } = useDeviceWeather();

  const recRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  // Live real-time formatted clock matching reference image
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

      setCurrentDate(`${dayName}, ${dayNum} ${monthName} ${year}`);
      setCurrentTime(formattedTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Karen AI Voice Synthesis
  const speakKaren = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = karenPitch || 1.1;
        utterance.rate = karenRate || 1.03;
        utterance.volume = karenVolume || 1.0;
        const voices = window.speechSynthesis.getVoices() || [];
        const preferredVoice = voices.find(v =>
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Karen") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Zira") ||
          (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
        ) || voices.find(v => v.lang.startsWith("en")) || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }
  };

  // Trigger Action / Command
  const handleTriggerCommand = async (commandType, promptText) => {
    setIsListening(false);
    setVoiceQuery(`Directive received: "${promptText}"`);

    const lower = (promptText || "").toLowerCase();

    // Auto-detect intent if marked as GENERAL
    let resolvedType = commandType;
    if (resolvedType === "GENERAL" || !resolvedType) {
      if (lower.includes("weather") || lower.includes("temperature") || lower.includes("forecast") || lower.includes("climate") || lower.includes("rain") || lower.includes("hot") || lower.includes("cold") || lower.includes("where am i") || lower.includes("location") || lower.includes("gps")) {
        resolvedType = "WEATHER_LOCATION";
      } else if (lower.includes("search") || lower.includes("stark") || lower.includes("web") || lower.includes("google")) {
        resolvedType = "WEB_SEARCH";
      } else if (lower.includes("data") || lower.includes("crime") || lower.includes("analyze") || lower.includes("analysis")) {
        resolvedType = "DATA_ANALYSIS";
      } else if (lower.includes("threat") || lower.includes("scan") || lower.includes("radar") || lower.includes("perimeter") || lower.includes("detect")) {
        resolvedType = "SCAN_DETECT";
      } else if (lower.includes("code") || lower.includes("python") || lower.includes("program") || lower.includes("algorithm") || lower.includes("debug")) {
        resolvedType = "CODE_ASSISTANT";
      } else if (lower.includes("image") || lower.includes("camera") || lower.includes("drone") || lower.includes("identify") || lower.includes("object")) {
        resolvedType = "IMAGE_RECOGNITION";
      } else if (lower.includes("suit") || lower.includes("status") || lower.includes("armor") || lower.includes("telemetry") || lower.includes("power")) {
        resolvedType = "SUIT_STATUS";
      } else if (lower.includes("gadget") || lower.includes("weapon") || lower.includes("web shooter")) {
        resolvedType = "GADGETS";
      }
    }

    try {
      if (resolvedType === "WEATHER_LOCATION") {
        setModalMode("WEATHER_LOCATION");
        const city = weather?.city || "your sector";
        const loc = weather?.location || city;
        const temp = weather?.temp_str || (weather?.temp !== undefined ? `${weather.temp}°C` : "24°C");
        const cond = weather?.condition || "Partly Cloudy";
        const hum = weather?.humidity || "55%";
        const wind = weather?.wind || "10 km/h";
        const spiderAdvice = weather?.spider_text || "Optimal flight conditions. Optical radar nominal.";
        const reply = `Live Sector Telemetry for ${loc}: Current temperature is ${temp} with ${cond}. Humidity is at ${hum}, wind speed at ${wind}. Suit Assessment: ${spiderAdvice}`;
        setVoiceQuery(`Location & Weather telemetry synced: ${loc}`);
        setAiResponse(reply);
        speakKaren(`Currently in ${city}, it is ${temp} with ${cond}. ${spiderAdvice}`);
      } else if (resolvedType === "WEB_SEARCH") {
        let cleanQ = (promptText || "")
          .replace(/^(search for|search|web search|google|look up)\s+/i, "")
          .trim();
        
        if (!cleanQ || cleanQ.toLowerCase() === "latest stark industries developments" || cleanQ.toLowerCase() === "web search activated") {
          cleanQ = "Spider-Man Marvel MCU latest news";
        }

        setVoiceQuery(`Opening Real Web Search: "${cleanQ}"`);
        const reply = `Launched real-time Google Web Search for "${cleanQ}". Opening live browser search tab.`;
        setAiResponse(reply);
        speakKaren(`Opening real web search for ${cleanQ}.`);

        const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQ)}`;
        try {
          const win = window.open(targetUrl, "_blank", "noopener,noreferrer");
          if (!win || win.closed || typeof win.closed === "undefined") {
            window.location.href = targetUrl;
          }
        } catch (_) {
          window.location.href = targetUrl;
        }
      } else if (resolvedType === "DATA_ANALYSIS") {
        setModalMode("DATA_ANALYSIS");
        setVoiceQuery("Running crime data analysis across Queens and Manhattan...");
        const reply = "Analysis complete. Crime incidents are down 14% across Queens. Minor anomaly detected near Oscorp Tower, Sector 4.";
        setAiResponse(reply);
        speakKaren("Analysis complete. Crime incidents are down 14% across Queens. Minor anomaly detected near Oscorp Tower.");
      } else if (resolvedType === "SCAN_DETECT") {
        setVoiceQuery("Activating Optical Radar & Surveillance Mode...");
        setModalMode("THREAT_MAP");
        const reply = "Surveillance mode engaged. Scanning 4-kilometer perimeter for biological, thermal, and seismic threats. No major threats detected.";
        setAiResponse(reply);
        speakKaren("Surveillance mode engaged. Scanning four kilometer perimeter for active threats. All sectors clear.");
      } else if (resolvedType === "SUIT_STATUS") {
        setVoiceQuery("Running full Iron Spider telemetry diagnostics...");
        setModalMode("SUIT_STATUS");
        const reply = "All suit telemetry nominal. Armor integrity at 100%, web fluid at 96%, mechanical waldoes armed and ready.";
        setAiResponse(reply);
        speakKaren("All suit systems operational Peter. Nano armor integrity is at 100%, and web fluid cartridges are full.");
      } else if (resolvedType === "GADGETS") {
        setVoiceQuery("Arming weapon systems and gadget arsenal...");
        setModalMode("GADGETS");
        const reply = "Gadget arsenal ready: Electric Web (12 charges), Web Grenades (4 charges), Web Wings active, Spider-Drones on standby.";
        setAiResponse(reply);
        speakKaren("Arsenal online. Electric webs, web grenades, and spider drones are primed for combat.");
      } else if (resolvedType === "CODE_ASSISTANT") {
        setVoiceQuery("Debugging Suit Nano-Weave routing algorithm in Python...");
        const reply = "Optimizer algorithm verified: Execution latency dropped from 12ms to 0.4ms with zero memory leaks.";
        setAiResponse(reply);
        speakKaren("Optimizer algorithm verified. Nano weave latency reduced to point four milliseconds.");
      } else if (resolvedType === "IMAGE_RECOGNITION") {
        setVoiceQuery("Identifying target object in surveillance stream...");
        const reply = "Target classified: Quad-copter delivery drone. Signature: Stark Industries Logistics #4492. Threat level: Zero.";
        setAiResponse(reply);
        speakKaren("Target identified as Stark Industries logistics drone. Threat level zero.");
      } else {
        // Query master AI backend
        const res = await http.post("/chat", {
          message: promptText,
          agent: "master_brain"
        }).catch(() => null);

        if (res && res.data && res.data.response) {
          setAiResponse(res.data.response);
          speakKaren(res.data.response.slice(0, 160));
        } else {
          const defaultReply = `I'm on it, Peter. Executing "${promptText}". Telemetry and suit weapons are operating at peak efficiency.`;
          setAiResponse(defaultReply);
          speakKaren(defaultReply);
        }
      }
    } catch (err) {
      setAiResponse("All systems operational, Peter. Standing by for your next directive.");
      speakKaren("All systems operational, Peter. Standing by for your next directive.");
    } finally {
      setIsListening(false);
    }
  };

  const handleToggleVoice = () => {
    // If currently listening, stop it cleanly
    if (isListening) {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (recRef.current) {
        try { recRef.current.abort(); } catch (_) {}
      }
      setIsListening(false);
      setVoiceQuery("Voice command standby.");
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    // Start listening
    setIsListening(true);
    setVoiceQuery("Listening for Peter's voice... Speak your directive now");
    speakKaren("I'm listening, Peter.");

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognitionStarted = false;

    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-US";
        recRef.current = rec;

        rec.onresult = (e) => {
          if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }
          const results = Array.from(e.results);
          const transcript = results.map(r => r[0].transcript).join("");
          setVoiceQuery(`"${transcript}"`);

          const isFinal = results.some(r => r.isFinal);
          if (isFinal && transcript.trim()) {
            handleTriggerCommand("GENERAL", transcript.trim());
          }
        };

        rec.onerror = (err) => {
          console.warn("[Karen Voice] SpeechRecognition notice:", err.error);
          // If no speech heard or permission issue, trigger default directive so experience never fails
          if (!fallbackTimerRef.current) {
            fallbackTimerRef.current = setTimeout(() => {
              handleTriggerCommand("GENERAL", "Run system diagnostics and check surrounding threats");
            }, 1800);
          }
        };

        rec.onend = () => {
          if (!recognitionStarted) {
            setIsListening(false);
          }
        };

        rec.start();
        recognitionStarted = true;

        // Safety fallback timer if no words received in 4.5 seconds
        fallbackTimerRef.current = setTimeout(() => {
          handleTriggerCommand("GENERAL", "Run system diagnostics and scan Queens perimeter");
        }, 4500);

      } catch (err) {
        console.warn("[Karen Voice] Failed to start native SpeechRecognition, running fallback directive:", err);
        fallbackTimerRef.current = setTimeout(() => {
          handleTriggerCommand("GENERAL", "Check all suit telemetry and weapon systems");
        }, 1800);
      }
    } else {
      // Browser doesn't support Web Speech API - provide seamless simulated voice directive
      fallbackTimerRef.current = setTimeout(() => {
        handleTriggerCommand("GENERAL", "Run Spider-Suit diagnostic sweep and scan perimeter threats");
      }, 1800);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput("");
    handleTriggerCommand("GENERAL", q);
  };

  return (
    <div
      className="spider-hud-bg"
      style={{
        minHeight: "100vh",
        color: "#ffffff",
        padding: "8px 12px 14px",
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        gap: 8,
        position: "relative"
      }}
    >
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP HUD FRAME HEADER                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "linear-gradient(90deg, rgba(255, 42, 77, 0.15) 0%, rgba(10, 14, 26, 0.85) 50%, rgba(255, 42, 77, 0.15) 100%)",
          border: "1px solid rgba(255, 42, 77, 0.4)",
          borderRadius: 8,
          boxShadow: "0 0 20px rgba(255, 42, 77, 0.12), inset 0 0 15px rgba(255, 42, 77, 0.05)",
          position: "relative",
          flexShrink: 0
        }}
      >
        <div className="spider-hud-bracket-tl" />
        <div className="spider-hud-bracket-tr" />
        <div className="spider-hud-bracket-bl" />
        <div className="spider-hud-bracket-br" />

        {/* Left Header Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "4px 6px", background: "rgba(255,42,77,0.15)", borderRadius: 6, border: "1px solid rgba(255,42,77,0.3)" }}>
            <SpiderEmblem size={26} color="#ff2a4d" />
          </div>
          <div>
            <div className="spider-neon-red" style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", lineHeight: 1.1 }}>
              AI MODE: ACTIVE
            </div>
            <div style={{ fontSize: 8.5, color: "rgba(255, 42, 77, 0.7)", fontFamily: "monospace", letterSpacing: "0.08em", marginTop: 2 }}>
              SPIDER-NEXUS v1.0
            </div>
          </div>
        </div>

        {/* Center Glowing Spider Icon */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: -8 }}>
          <div style={{ background: "#060913", padding: "4px 16px", borderRadius: 16, border: "1px solid rgba(255,42,77,0.5)", boxShadow: "0 0 15px rgba(255,42,77,0.4)" }}>
            <SpiderEmblem size={28} color="#ff2a4d" />
          </div>
        </div>

        {/* Right Header Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, fontSize: 10.5, fontWeight: 700, fontFamily: "monospace", color: "#34d399" }}>
              <span>SYSTEM ONLINE</span>
              <span className="nx-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            </div>
            <div style={{ fontSize: 8.5, color: "rgba(148, 163, 184, 0.6)", fontFamily: "monospace", marginTop: 1 }}>
              {currentDate || "FRIDAY, 24 MAY 2024"} | {currentTime || "11:48 AM"}
            </div>
          </div>

          {/* Spider Avatar Badge */}
          <SpiderMaskAvatar size={34} />

          {/* Exit / Return to Omega Nexus button */}
          <button
            onClick={() => navigate("/")}
            title="Return to Main Omega Nexus OS"
            style={{
              background: "rgba(255,42,77,0.1)",
              border: "1px solid rgba(255,42,77,0.3)",
              borderRadius: 6,
              padding: "4px 8px",
              color: "rgba(255,42,77,0.8)",
              fontSize: 9,
              fontFamily: "monospace",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,42,77,0.25)"; e.currentTarget.style.color = "#ffffff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,42,77,0.1)"; e.currentTarget.style.color = "rgba(255,42,77,0.8)"; }}
          >
            <ArrowLeft size={10} /> OS
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. MAIN 3-COLUMN DASHBOARD GRID                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr 330px", gap: 10, flex: 1, minHeight: 0, alignItems: "start" }}>
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: AI ASSISTANT, QUICK ACTIONS, SYSTEM STATUS   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Card 1: AI ASSISTANT */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
              <Sparkles size={22} color="#ff2a4d" /> AI ASSISTANT
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: 2 }}>
              Hey Peter! 👋
            </div>
            <div style={{ fontSize: 13, color: "rgba(203, 213, 225, 0.9)", marginBottom: 8 }}>
              How can I help you today?
            </div>
            <SoundWaveEqualizer bars={34} height={24} color="#00f5ff" active={true} />
          </div>

          {/* Card 2: QUICK ACTIONS */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              QUICK ACTIONS
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {/* Action 1: Voice Command */}
              <button
                onClick={handleToggleVoice}
                style={{
                  display: "flex", alignItems: "center", gap: 13, padding: "8px 12px",
                  borderRadius: 8, background: isListening ? "rgba(255, 42, 77, 0.25)" : "rgba(255, 42, 77, 0.08)",
                  border: isListening ? "1px solid #ff2a4d" : "1px solid rgba(255, 42, 77, 0.25)", color: "#ffffff",
                  textAlign: "left", transition: "all 0.2s", cursor: "pointer",
                  boxShadow: isListening ? "0 0 12px rgba(255,42,77,0.4)" : "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255, 42, 77, 0.2)"; e.currentTarget.style.borderColor = "#ff2a4d"; }}
                onMouseLeave={e => { e.currentTarget.style.background = isListening ? "rgba(255, 42, 77, 0.25)" : "rgba(255, 42, 77, 0.08)"; e.currentTarget.style.borderColor = isListening ? "#ff2a4d" : "rgba(255, 42, 77, 0.25)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,42,77,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff2a4d", flexShrink: 0 }}>
                  <Mic size={22} className={isListening ? "nx-pulse" : ""} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>Voice Command</div>
                  <div style={{ fontSize: 10, color: isListening ? "#ff2a4d" : "rgba(148,163,184,0.75)", marginTop: 1, fontWeight: isListening ? 700 : 400 }}>
                    {isListening ? "Listening... (Tap to stop)" : "Tap to activate"}
                  </div>
                </div>
              </button>

              {/* Action 2: Web Search */}
              <button
                onClick={() => {
                  setModalMode("WEB_SEARCH");
                  handleTriggerCommand("WEB_SEARCH", "Latest Stark Industries developments");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 13, padding: "8px 12px",
                  borderRadius: 8, background: "rgba(0, 245, 255, 0.06)",
                  border: "1px solid rgba(0, 245, 255, 0.2)", color: "#ffffff",
                  textAlign: "left", transition: "all 0.2s", cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0, 245, 255, 0.18)"; e.currentTarget.style.borderColor = "#00f5ff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(0, 245, 255, 0.06)"; e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.2)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(0,245,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", flexShrink: 0 }}>
                  <Search size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>Web Search</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.75)", marginTop: 1 }}>Search the web</div>
                </div>
              </button>

              {/* Action 3: Analyze Data */}
              <button
                onClick={() => {
                  setModalMode("DATA_ANALYSIS");
                  handleTriggerCommand("DATA_ANALYSIS", "Analyze crime data in NYC");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 13, padding: "8px 12px",
                  borderRadius: 8, background: "rgba(251, 146, 60, 0.06)",
                  border: "1px solid rgba(251, 146, 60, 0.2)", color: "#ffffff",
                  textAlign: "left", transition: "all 0.2s", cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(251, 146, 60, 0.18)"; e.currentTarget.style.borderColor = "#fb923c"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(251, 146, 60, 0.06)"; e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.2)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(251,146,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fb923c", flexShrink: 0 }}>
                  <BarChart3 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>Analyze Data</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.75)", marginTop: 1 }}>Deep analysis</div>
                </div>
              </button>

              {/* Action 4: Scan & Detect */}
              <button
                onClick={() => {
                  setModalMode("THREAT_MAP");
                  handleTriggerCommand("SCAN_DETECT", "Optical Scan perimeter");
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 13, padding: "8px 12px",
                  borderRadius: 8, background: "rgba(56, 189, 248, 0.06)",
                  border: "1px solid rgba(56, 189, 248, 0.2)", color: "#ffffff",
                  textAlign: "left", transition: "all 0.2s", cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(56, 189, 248, 0.18)"; e.currentTarget.style.borderColor = "#38bdf8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(56, 189, 248, 0.06)"; e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.2)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", flexShrink: 0 }}>
                  <Crosshair size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>Scan & Detect</div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.75)", marginTop: 1 }}>Surveillance mode</div>
                </div>
              </button>
            </div>
          </div>

          {/* Card 3: SYSTEM STATUS */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>
              SYSTEM STATUS
            </div>

            <RadialStatusGauge percentage={98} />

            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,42,77,0.15)", fontSize: 11, fontFamily: "monospace" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(148,163,184,0.8)" }}>AI CORE</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>ONLINE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(148,163,184,0.8)" }}>DATABASE</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>SYNCED</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(148,163,184,0.8)" }}>NETWORK</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>SECURE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(148,163,184,0.8)" }}>POWER LEVEL</span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>






        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CENTER COLUMN: SPIDER HERO, VOICE CONTROLS, RECENT CONVS   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          
          {/* Main Hero Card with Crouched Spider-Man & Tap to Speak */}
          <div className="spider-hud-card" style={{ padding: "8px 12px 6px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div className="spider-hud-bracket-bl" />
            <div className="spider-hud-bracket-br" />

            {/* Central Spider-Man Crouching Hero Illustration */}
            <SpiderManHeroIllustration isListening={isListening} isSpeaking={isSpeaking} />

            {/* Audio Wave Wings Flanking Central Red Pill Button: TAP TO SPEAK */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "90%", margin: "2px auto 0" }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <SoundWaveEqualizer bars={14} height={12} color="#ff2a4d" active={isListening || isSpeaking} />
              </div>

              <button
                onClick={handleToggleVoice}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 14px",
                  borderRadius: 20,
                  background: isListening
                    ? "linear-gradient(90deg, #ff1e42 0%, #b50f28 100%)"
                    : "linear-gradient(90deg, rgba(255, 42, 77, 0.25) 0%, rgba(181, 15, 40, 0.35) 100%)",
                  border: "1.5px solid #ff2a4d",
                  boxShadow: isListening ? "0 0 25px rgba(255,42,77,0.7)" : "0 0 10px rgba(255,42,77,0.3)",
                  color: "#ffffff",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', monospace",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <Mic size={11} color="#ff2a4d" />
                <span>{isListening ? "LISTENING..." : "TAP TO SPEAK"}</span>
              </button>

              <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                <SoundWaveEqualizer bars={14} height={12} color="#ff2a4d" active={isListening || isSpeaking} />
              </div>
            </div>

          </div>

          {/* Middle Row: Two Split Cards (VOICE COMMAND & AI RESPONSE) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            
            {/* VOICE COMMAND CARD */}
            <div className="spider-hud-card" style={{ padding: "12px 16px" }}>
              <div className="spider-hud-bracket-tl" />
              <div className="spider-hud-bracket-tr" />
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                VOICE COMMAND
              </div>
              <DualSpectrumWaveform active={isListening} statusText={voiceQuery} />
            </div>

            {/* AI RESPONSE CARD */}
            <div className="spider-hud-card" style={{ padding: "12px 16px" }}>
              <div className="spider-hud-bracket-tl" />
              <div className="spider-hud-bracket-tr" />
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                AI RESPONSE
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <SpiderMaskAvatar size={42} glowing={isSpeaking} />
                <div style={{ flex: 1, fontSize: 13.5, color: "rgba(241, 245, 249, 0.95)", lineHeight: 1.45, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {aiResponse}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: RECENT CONVERSATIONS */}
          <div className="spider-hud-card" style={{ padding: "14px 18px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                RECENT CONVERSATIONS
              </div>
              <button
                onClick={() => setModalMode("CONVERSATIONS")}
                style={{ fontSize: 10.5, color: "rgba(148,163,184,0.75)", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.color = "#00f5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.75)"}
              >
                VIEW ALL
              </button>
            </div>

            {/* 4 Interactive Conversation Tiles Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Tile 1: Web Search */}
              <div
                onClick={() => handleTriggerCommand("WEB_SEARCH", "Latest Stark Industries developments")}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 8, background: "rgba(3, 5, 10, 0.95)",
                  border: "1px solid rgba(0, 245, 255, 0.25)", cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5ff"; e.currentTarget.style.background = "rgba(0, 245, 255, 0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.25)"; e.currentTarget.style.background = "rgba(3, 5, 10, 0.95)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,245,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", flexShrink: 0 }}>
                  <Search size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>Web Search</div>
                  <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                    Latest Stark Industries developments
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(148,163,184,0.65)", fontFamily: "monospace" }}>11:10 AM</span>
              </div>

              {/* Tile 2: Data Analysis */}
              <div
                onClick={() => handleTriggerCommand("DATA_ANALYSIS", "Analyze crime data from last 24 hours")}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 8, background: "rgba(3, 5, 10, 0.95)",
                  border: "1px solid rgba(251, 146, 60, 0.25)", cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fb923c"; e.currentTarget.style.background = "rgba(251, 146, 60, 0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(251, 146, 60, 0.25)"; e.currentTarget.style.background = "rgba(3, 5, 10, 0.95)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(251,146,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fb923c", flexShrink: 0 }}>
                  <BarChart3 size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>Data Analysis</div>
                  <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                    Analyze crime data from last 24 hours
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(148,163,184,0.65)", fontFamily: "monospace" }}>10:47 AM</span>
              </div>

              {/* Tile 3: Code Assistant */}
              <div
                onClick={() => handleTriggerCommand("CODE_ASSISTANT", "Debugging Python algorithm")}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 8, background: "rgba(3, 5, 10, 0.95)",
                  border: "1px solid rgba(52, 211, 153, 0.25)", cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#34d399"; e.currentTarget.style.background = "rgba(52, 211, 153, 0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.25)"; e.currentTarget.style.background = "rgba(3, 5, 10, 0.95)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", fontFamily: "monospace", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                  &lt;/&gt;
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>Code Assistant</div>
                  <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                    Debugging Python algorithm
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(148,163,184,0.65)", fontFamily: "monospace" }}>09:33 AM</span>
              </div>

              {/* Tile 4: Image Recognition */}
              <div
                onClick={() => handleTriggerCommand("IMAGE_RECOGNITION", "Identify object in surveillance feed")}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 8, background: "rgba(3, 5, 10, 0.95)",
                  border: "1px solid rgba(168, 85, 247, 0.25)", cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.background = "rgba(168, 85, 247, 0.16)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.25)"; e.currentTarget.style.background = "rgba(3, 5, 10, 0.95)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", flexShrink: 0 }}>
                  <Eye size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>Image Recognition</div>
                  <div style={{ fontSize: 10.5, color: "rgba(148,163,184,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                    Identify object in surveillance feed
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(148,163,184,0.65)", fontFamily: "monospace" }}>Yesterday</span>
              </div>
            </div>

            {/* Quick Text Input for Commands */}
            <form onSubmit={handleTextSubmit} style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Ask Spider-Man AI (Karen)..."
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "rgba(2, 4, 8, 0.95)",
                  border: "1px solid rgba(255, 42, 77, 0.35)",
                  color: "#ffffff",
                  fontSize: 13,
                  fontFamily: "'Space Grotesk', sans-serif",
                  outline: "none"
                }}
              />

              <button
                type="submit"
                style={{
                  padding: "10px 18px",
                  borderRadius: 6,
                  background: "rgba(255, 42, 77, 0.2)",
                  border: "1px solid rgba(255, 42, 77, 0.4)",
                  color: "#ff2a4d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255, 42, 77, 0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255, 42, 77, 0.2)"; }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: CAPABILITIES, LOCATION, ACTIVITY, NOTIFS, THREAT */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          
          {/* Card 1: AI CAPABILITIES */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                AI CAPABILITIES
              </div>
              <button
                onClick={() => setModalMode("CAPABILITIES")}
                style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = "#00f5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.7)"}
              >
                VIEW ALL
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
              {[
                { name: "Natural Conversations", icon: Shield },
                { name: "Web Search", icon: Search },
                { name: "Data Analysis", icon: BarChart3 },
                { name: "Image Recognition", icon: Eye },
                { name: "Code Assistant", icon: Terminal },
                { name: "Smart Reminders", icon: CheckCircle2 }
              ].map(cap => {
                const Icon = cap.icon;
                return (
                  <div key={cap.name} style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(241, 245, 249, 0.95)", fontWeight: 500 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0, 245, 255, 0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <span>{cap.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: LOCATION & WEATHER */}
          <div
            className="spider-hud-card"
            onClick={() => setModalMode("WEATHER_LOCATION")}
            style={{ padding: "10px 14px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#00f5ff"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.2)"}
            title="Click to view full real-time weather & GPS location radar"
          >
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                LOCATION & WEATHER
              </div>
              <span style={{ fontSize: 8, color: isGps ? "#00FF88" : "#00f5ff", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 3, fontWeight: 700 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: isGps ? "#00FF88" : "#00f5ff", display: "inline-block" }} />
                {isGps ? "DEVICE GPS" : "LIVE IP"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, marginRight: 8 }}>
                <MapPin size={18} color="#00f5ff" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {weather?.city ? `${weather.city}, ${weather.country || weather.region}` : (weather?.location || (weatherLoading ? "Detecting GPS..." : "Device Location"))}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {weather?.icon === "Sun" ? <Sun size={18} color="#fbbf24" /> :
                 weather?.icon === "CloudFog" ? <CloudFog size={18} color="#a5b4fc" /> :
                 weather?.icon === "CloudRain" || weather?.icon === "CloudDrizzle" ? <CloudRain size={18} color="#00f5ff" /> :
                 weather?.icon === "CloudSnow" || weather?.icon === "Snowflake" ? <CloudSnow size={18} color="#e2e8f0" /> :
                 weather?.icon === "CloudLightning" ? <CloudLightning size={18} color="#eab308" /> :
                 <CloudSun size={18} color="#00f5ff" />}
                <span style={{ fontSize: 15, fontWeight: 900, color: "#00f5ff", fontFamily: "monospace" }}>
                  {weather?.temp_str || (weather?.temp !== undefined ? `${weather.temp}°C` : "24°C")}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "rgba(148, 163, 184, 0.8)", fontFamily: "monospace" }}>
              <span style={{ color: "#38bdf8", fontWeight: 600 }}>{weather?.condition || "Partly Cloudy"}</span>
              <span>Humidity: {weather?.humidity || "55%"}</span>
              <span>Wind: {weather?.wind || "10 km/h"}</span>
            </div>
          </div>

          {/* Card 3: ACTIVITY FEED */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                ACTIVITY FEED
              </div>
              <button
                onClick={() => setModalMode("ACTIVITY")}
                style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = "#00f5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.7)"}
              >
                VIEW ALL
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,245,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", flexShrink: 0 }}>
                    <Search size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>Web search performed</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.75)" }}>Quantum Mechanics</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>11:30 AM</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,42,77,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff2a4d", flexShrink: 0 }}>
                    <ShieldAlert size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>New threat detected</div>
                    <div style={{ fontSize: 9.5, color: "#ff4d6d", fontWeight: 600 }}>Downtown, New York</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>10:42 AM</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(168,85,247,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", flexShrink: 0 }}>
                    <Sliders size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>Suit systems updated</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.75)" }}>AI Module v2.4</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>09:15 AM</span>
              </div>
            </div>
          </div>

          {/* Card 4: NOTIFICATIONS */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                <Bell size={14} color="#ff2a4d" />
                <span>NOTIFICATIONS</span>
              </div>
              <button
                onClick={() => setModalMode("NOTIFICATIONS")}
                style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = "#00f5ff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(148,163,184,0.7)"}
              >
                VIEW ALL
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,42,77,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff2a4d", fontSize: 10.5, fontWeight: 900, flexShrink: 0 }}>
                    MJ
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>MJ: Missed Call</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)" }}>11:20 AM</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,245,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", fontSize: 10.5, fontWeight: 900, flexShrink: 0 }}>
                    H
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>Happy: System Check</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)" }}>10:15 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: THREAT LEVEL */}
          <div className="spider-hud-card" style={{ padding: "12px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 3 }}>
              THREAT LEVEL
            </div>

            <div className="spider-neon-orange" style={{ fontSize: 15, fontWeight: 900, letterSpacing: "0.08em", marginBottom: 5 }}>
              MODERATE
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
              <SpiderMaskAvatar size={38} glowing={true} />
              <div style={{ flex: 1 }}>
                <SoundWaveEqualizer bars={16} height={18} color="#ff7700" active={true} />
              </div>
            </div>

            <div style={{ fontSize: 9.5, color: "rgba(148, 163, 184, 0.9)", marginBottom: 6, lineHeight: 1.3 }}>
              No major threats detected in your area.
            </div>

            <button
              onClick={() => setModalMode("THREAT_MAP")}
              style={{
                width: "100%", padding: "7px 12px", borderRadius: 6,
                background: "rgba(255, 42, 77, 0.18)", border: "1px solid rgba(255, 42, 77, 0.45)",
                color: "#ff4d6d", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                fontFamily: "monospace", cursor: "pointer", transition: "all 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255, 42, 77, 0.35)"; e.currentTarget.style.borderColor = "#ff2a4d"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255, 42, 77, 0.18)"; e.currentTarget.style.borderColor = "rgba(255, 42, 77, 0.45)"; }}
            >
              VIEW THREAT MAP
            </button>
          </div>
        </div>
      </div>


      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. BOTTOM HUD NAVIGATION BAR                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          marginTop: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "linear-gradient(90deg, rgba(255, 42, 77, 0.15) 0%, rgba(10, 14, 26, 0.9) 50%, rgba(255, 42, 77, 0.15) 100%)",
          border: "1px solid rgba(255, 42, 77, 0.4)",
          borderRadius: 8,
          boxShadow: "0 0 20px rgba(255, 42, 77, 0.12), inset 0 0 15px rgba(255, 42, 77, 0.05)",
          position: "relative",
          flexShrink: 0
        }}
      >
        <div className="spider-hud-bracket-tl" />
        <div className="spider-hud-bracket-tr" />
        <div className="spider-hud-bracket-bl" />
        <div className="spider-hud-bracket-br" />

        {/* Left: WEB SHOOTER READY */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <SpiderEmblem size={24} color="#ff2a4d" />
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: "#ffffff" }}>
              WEB SHOOTER
            </div>
            <div style={{ fontSize: 7.5, color: "#34d399", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: "#34d399" }} /> READY
            </div>
          </div>
        </div>

        {/* Center Tabs: HOME, SUIT STATUS, GADGETS, MAP, DATABASE, SETTINGS */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { id: "HOME", label: "HOME", icon: SpiderEmblem },
            { id: "SUIT STATUS", label: "SUIT STATUS", icon: Activity },
            { id: "GADGETS", label: "GADGETS", icon: Crosshair },
            { id: "MAP", label: "MAP", icon: Compass },
            { id: "DATABASE", label: "DATABASE", icon: DbIcon },
            { id: "SETTINGS", label: "SETTINGS", icon: Sliders }
          ].map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "HOME") setModalMode(tab.id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  cursor: "pointer",
                  color: active ? "#ff2a4d" : "rgba(148, 163, 184, 0.6)",
                  transition: "all 0.15s",
                  padding: "2px 8px",
                  position: "relative"
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(148, 163, 184, 0.6)"; }}
              >
                {tab.id === "HOME" ? (
                  <SpiderEmblem size={22} color={active ? "#ff2a4d" : "rgba(148, 163, 184, 0.6)"} />
                ) : (
                  <Icon size={18} />
                )}
                <span style={{ fontSize: 8.5, fontWeight: active ? 800 : 500, letterSpacing: "0.1em", fontFamily: "monospace" }}>
                  {tab.label}
                </span>
                {active && (
                  <div style={{ position: "absolute", bottom: -6, width: 22, height: 2, background: "#ff2a4d", boxShadow: "0 0 6px #ff2a4d" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: SUIT POWER 100% */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>
              SUIT POWER
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#ffffff", fontFamily: "'Unbounded', monospace" }}>
              100%
            </div>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: "rgba(255,42,77,0.2)", border: "1px solid rgba(255,42,77,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SpiderEmblem size={18} color="#ff2a4d" />
          </div>
        </div>


      </nav>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. MODALS & POPUPS FOR TABS & DETAILS                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {modalMode && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(3, 7, 18, 0.88)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setModalMode(null)}
        >
          <div
            className="spider-hud-card"
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "85vh",
              overflowY: "auto",
              padding: 20,
              border: "1.5px solid #ff2a4d",
              boxShadow: "0 0 40px rgba(255,42,77,0.35)",
              background: "#0a0e1a"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div className="spider-hud-bracket-bl" />
            <div className="spider-hud-bracket-br" />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,42,77,0.3)", paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SpiderEmblem size={20} color="#ff2a4d" />
                <div className="spider-neon-red" style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em" }}>
                  {modalMode === "WEATHER_LOCATION" && "LIVE DEVICE LOCATION & WEATHER RADAR TELEMETRY"}
                  {modalMode === "THREAT_MAP" && "NEW YORK SECTOR SURVEILLANCE & THREAT MAP"}
                  {modalMode === "WEB_SEARCH" && "STARK CLOUD INTELLIGENCE & WEB SEARCH"}
                  {modalMode === "DATA_ANALYSIS" && "NEW YORK CRIME TELEMETRY & DATA ANALYTICS"}
                  {modalMode === "SUIT_STATUS" && "STARK IRON SPIDER ARMOR TELEMETRY"}
                  {modalMode === "GADGETS" && "SUIT WEAPONS & GADGET ARSENAL"}
                  {modalMode === "MAP" && "QUEENS & MANHATTAN LIVE RADAR"}
                  {modalMode === "DATABASE" && "STARK INDUSTRIES CLOUD DATA ARCHIVE"}
                  {modalMode === "SETTINGS" && "KAREN AI & PROTOCOL CONFIGURATION"}
                  {modalMode === "NOTIFICATIONS" && "ALL SYSTEM NOTIFICATIONS & COMMS"}
                  {modalMode === "CAPABILITIES" && "FULL KAREN AI CAPABILITIES MATRIX"}
                  {modalMode === "CONVERSATIONS" && "ALL MISSION CONVERSATION LOGS"}
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                style={{ background: "rgba(255,42,77,0.15)", border: "1px solid rgba(255,42,77,0.4)", borderRadius: 5, color: "#ff2a4d", padding: 5, cursor: "pointer" }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 0. REAL DEVICE LOCATION & WEATHER TELEMETRY MODAL */}
            {modalMode === "WEATHER_LOCATION" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Header telemetry bar */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <MapPin size={20} color="#00f5ff" />
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                        {weather?.location || "Your Device Location"}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(148,163,184,0.8)", fontFamily: "monospace", marginTop: 4, display: "flex", gap: 12 }}>
                      <span>LAT: <strong style={{ color: "#00f5ff" }}>{weather?.latitude?.toFixed?.(4) ?? "12.9716"}</strong></span>
                      <span>LNG: <strong style={{ color: "#00f5ff" }}>{weather?.longitude?.toFixed?.(4) ?? "77.5946"}</strong></span>
                      <span>SOURCE: <strong style={{ color: isGps ? "#00FF88" : "#38bdf8" }}>{isGps ? "REAL DEVICE GPS" : "IP TELEMETRY"}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { requestGpsLocation(); }}
                      style={{
                        padding: "7px 12px", borderRadius: 6, background: "rgba(0,245,255,0.18)",
                        border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 10.5, fontWeight: 800,
                        fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      <Navigation size={12} /> SYNC GPS
                    </button>
                    <button
                      onClick={() => refreshWeather()}
                      style={{
                        padding: "7px 10px", borderRadius: 6, background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.2)", color: "#cbd5e1", fontSize: 10.5,
                        fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                      }}
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>

                {/* Primary Weather & Suit Advisory Card */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                  <div style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.7))", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 8, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1, fontFamily: "'Unbounded', sans-serif" }}>
                        {weather?.temp_str || (weather?.temp !== undefined ? `${weather.temp}°C` : "24°C")}
                      </div>
                      <div style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>
                        {weather?.condition || "Partly Cloudy"}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(148,163,184,0.8)", fontFamily: "monospace", marginTop: 4 }}>
                        Feels like: <strong style={{ color: "#fff" }}>{weather?.feels_like || `${weather?.temp ?? 24}°C`}</strong> ({weather?.temp_f || "75°F"})
                      </div>
                    </div>
                    <div>
                      {weather?.icon === "Sun" ? <Sun size={52} color="#fbbf24" /> :
                       weather?.icon === "CloudFog" ? <CloudFog size={52} color="#a5b4fc" /> :
                       weather?.icon === "CloudRain" || weather?.icon === "CloudDrizzle" ? <CloudRain size={52} color="#00f5ff" /> :
                       weather?.icon === "CloudSnow" || weather?.icon === "Snowflake" ? <CloudSnow size={52} color="#e2e8f0" /> :
                       weather?.icon === "CloudLightning" ? <CloudLightning size={52} color="#eab308" /> :
                       <CloudSun size={52} color="#fbbf24" />}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,42,77,0.3)", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: 9.5, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                      KAREN AI FLIGHT ASSESSMENT
                    </div>
                    <div style={{ fontSize: 11, color: "#f1f5f9", lineHeight: 1.4 }}>
                      {weather?.spider_text || "Optimal flight conditions across your sector perimeter."}
                    </div>
                  </div>
                </div>

                {/* 4 Environmental Telemetry Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>HUMIDITY</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#00f5ff", marginTop: 2 }}>{weather?.humidity || "55%"}</div>
                  </div>
                  <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>WIND SPEED</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#34d399", marginTop: 2 }}>{weather?.wind || "10 km/h"}</div>
                  </div>
                  <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>PRESSURE</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#c084fc", marginTop: 2 }}>{weather?.pressure || "1013 hPa"}</div>
                  </div>
                  <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>UV INDEX</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", marginTop: 2 }}>{weather?.uv_index ?? "4.2"}</div>
                  </div>
                </div>

                {/* 7-Day Live Forecast */}
                <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(148,163,184,0.8)", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.1em" }}>
                    7-DAY EXTENDED SECTOR FORECAST
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(weather?.forecast?.length || 5, 7)}, 1fr)`, gap: 6 }}>
                    {(weather?.forecast && weather.forecast.length > 0 ? weather.forecast : [
                      { day: "Today", hi: 27, lo: 19, condition: "Partly Cloudy" },
                      { day: "Fri", hi: 28, lo: 20, condition: "Clear Sky" },
                      { day: "Sat", hi: 26, lo: 19, condition: "Rain Showers" },
                      { day: "Sun", hi: 27, lo: 19, condition: "Clear Sky" },
                      { day: "Mon", hi: 28, lo: 20, condition: "Partly Cloudy" },
                    ]).map((f, idx) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 8, textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: idx === 0 ? "#00f5ff" : "#fff" }}>{f.day}</div>
                        <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", margin: "4px 0" }}>{f.condition}</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>{f.hi}°<span style={{ color: "rgba(148,163,184,0.6)", fontSize: 10 }}>/{f.lo}°</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 1. REAL WEB SEARCH MODAL */}
            {modalMode === "WEB_SEARCH" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = (modalSearchInput.trim() || "Spider-Man Marvel MCU latest news");
                    handleTriggerCommand("WEB_SEARCH", q);
                  }}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    value={modalSearchInput}
                    onChange={e => setModalSearchInput(e.target.value)}
                    placeholder="Search Google, Stark Archives, or Web..."
                    style={{
                      flex: 1, padding: "11px 16px", borderRadius: 6,
                      background: "rgba(3, 7, 18, 0.95)", border: "1px solid rgba(0, 245, 255, 0.4)",
                      color: "#ffffff", fontSize: 13.5, fontFamily: "'Space Grotesk', sans-serif", outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "11px 20px", borderRadius: 6, background: "rgba(0, 245, 255, 0.2)",
                      border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 12, fontWeight: 900,
                      fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Search size={15} /> SEARCH GOOGLE ↗
                  </button>
                </form>

                {/* 6 Real Search Engines Launchers Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { name: "Google Web", url: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`, color: "#00f5ff" },
                    { name: "YouTube", url: q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, color: "#ff2a4d" },
                    { name: "Google News", url: q => `https://news.google.com/search?q=${encodeURIComponent(q)}`, color: "#34d399" },
                    { name: "Google Maps", url: q => `https://www.google.com/maps/search/${encodeURIComponent(q || "Queens New York")}`, color: "#fb923c" },
                    { name: "GitHub Search", url: q => `https://github.com/search?q=${encodeURIComponent(q)}`, color: "#c084fc" },
                    { name: "Wikipedia", url: q => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q || "Spider-Man")}`, color: "#e2e8f0" }
                  ].map(engine => (
                    <button
                      key={engine.name}
                      onClick={() => {
                        const q = modalSearchInput.trim() || "Spider-Man Marvel";
                        const targetUrl = engine.url(q);
                        window.open(targetUrl, "_blank", "noopener,noreferrer");
                        speakKaren(`Opening ${engine.name} for ${q}.`);
                      }}
                      style={{
                        padding: "8px 10px", borderRadius: 6, background: "rgba(15,23,42,0.85)",
                        border: `1px solid ${engine.color}40`, color: "#ffffff",
                        fontSize: 11, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = engine.color; e.currentTarget.style.background = `${engine.color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${engine.color}40`; e.currentTarget.style.background = "rgba(15,23,42,0.85)"; }}
                    >
                      <span>{engine.name}</span>
                      <span style={{ color: engine.color, fontSize: 10 }}>↗</span>
                    </button>
                  ))}
                </div>

                {/* Trending Real Search Topics */}
                <div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", marginBottom: 6 }}>
                    POPULAR SEARCH DIRECTIVES (CLICK TO SEARCH LIVE)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[
                      "Spider-Man Beyond the Spider-Verse",
                      "Marvel Cinematic Universe Phase 6",
                      "Latest NYC Crime Statistics and Reports",
                      "Quantum mechanics nano-materials physics",
                      "Stark Industries Avengers Tower Queens"
                    ].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setModalSearchInput(tag);
                          handleTriggerCommand("WEB_SEARCH", tag);
                        }}
                        style={{
                          padding: "5px 12px", borderRadius: 14, background: "rgba(0,245,255,0.08)",
                          border: "1px solid rgba(0,245,255,0.25)", color: "rgba(226,232,240,0.9)",
                          fontSize: 10.5, cursor: "pointer", fontFamily: "monospace"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5ff"; e.currentTarget.style.background = "rgba(0,245,255,0.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.25)"; e.currentTarget.style.background = "rgba(0,245,255,0.08)"; }}
                      >
                        🔍 {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Execution Status */}
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#00f5ff" }}>Live Search Engine Status</div>
                    <span style={{ fontSize: 9, color: "#34d399", fontFamily: "monospace" }}>REAL WEB ACCESS ONLINE</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(226,232,240,0.95)", lineHeight: 1.45 }}>
                    {aiResponse}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DATA ANALYSIS MODAL */}
            {modalMode === "DATA_ANALYSIS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(251,146,60,0.3)" }}>
                    <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>NYC CRIME TELEMETRY (24H)</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#34d399", margin: "4px 0" }}>-14.2%</div>
                    <div style={{ fontSize: 10, color: "rgba(226,232,240,0.85)" }}>Overall drop across Queens and Manhattan patrol zones.</div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,42,77,0.3)" }}>
                    <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>ANOMALY ALERT</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#ff2a4d", margin: "4px 0" }}>Oscorp Sector 4</div>
                    <div style={{ fontSize: 10, color: "rgba(226,232,240,0.85)" }}>Seismic energy fluctuation flagged at 10:42 AM.</div>
                  </div>
                </div>

                {/* Borough Telemetry Breakdown */}
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#ffffff", marginBottom: 8, letterSpacing: "0.08em" }}>
                    BOROUGH INCIDENT FREQUENCY
                  </div>
                  {[
                    { borough: "Queens", stat: "-14%", val: 26, color: "#34d399" },
                    { borough: "Manhattan", stat: "+2%", val: 48, color: "#fb923c" },
                    { borough: "Brooklyn", stat: "Nominal", val: 32, color: "#00f5ff" },
                    { borough: "Bronx", stat: "-5%", val: 38, color: "#34d399" }
                  ].map(item => (
                    <div key={item.borough} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 2 }}>
                        <span style={{ color: "#ffffff", fontWeight: 600 }}>{item.borough}</span>
                        <span style={{ color: item.color, fontFamily: "monospace", fontWeight: 700 }}>{item.stat}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${item.val}%`, background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Dataset Analysis Filters */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button
                    onClick={() => {
                      handleTriggerCommand("DATA_ANALYSIS", "Analyze Queens patrol zones and crime telemetry");
                    }}
                    style={{
                      padding: "8px 10px", borderRadius: 6, background: "rgba(0,245,255,0.1)",
                      border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff",
                      fontSize: 10.5, fontWeight: 700, fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    📊 QUEENS TELEMETRY
                  </button>
                  <button
                    onClick={() => {
                      handleTriggerCommand("DATA_ANALYSIS", "Run Oscorp Sector 4 seismic fluctuation scan");
                    }}
                    style={{
                      padding: "8px 10px", borderRadius: 6, background: "rgba(255,42,77,0.1)",
                      border: "1px solid rgba(255,42,77,0.3)", color: "#ff2a4d",
                      fontSize: 10.5, fontWeight: 700, fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    ⚠️ OSCORP ANOMALY SCAN
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleTriggerCommand("DATA_ANALYSIS", "Rerun full NYC crime pattern simulation")}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 6, background: "rgba(251, 146, 60, 0.2)",
                      border: "1px solid #fb923c", color: "#fb923c", fontSize: 11, fontWeight: 800,
                      fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    RERUN SIMULATION
                  </button>

                  <button
                    onClick={() => navigate("/data")}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 6, background: "rgba(56, 189, 248, 0.2)",
                      border: "1px solid #38bdf8", color: "#38bdf8", fontSize: 11, fontWeight: 800,
                      fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    LAUNCH STUDIO ↗
                  </button>
                </div>
              </div>
            )}

            {/* 3. THREAT MAP & RADAR SCAN */}
            {(modalMode === "THREAT_MAP" || modalMode === "MAP") && (
              <div>
                <div style={{ position: "relative", height: 220, borderRadius: 8, background: "#050811", border: "1px solid rgba(255,42,77,0.3)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,42,77,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,42,77,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "1px dashed rgba(255,42,77,0.4)", animation: "spider-rotate 10s linear infinite" }} />
                  <div style={{ position: "absolute", top: "35%", left: "45%", width: 10, height: 10, borderRadius: "50%", background: "#ff2a4d", boxShadow: "0 0 10px #ff2a4d" }} />
                  <div style={{ position: "absolute", top: "32%", left: "48%", fontSize: 8, color: "#ff2a4d", fontFamily: "monospace" }}>Downtown Anomaly (10:42 AM)</div>
                  
                  <div style={{ position: "absolute", top: "65%", left: "60%", width: 8, height: 8, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 8px #00f5ff" }} />
                  <div style={{ position: "absolute", top: "62%", left: "63%", fontSize: 8, color: "#00f5ff", fontFamily: "monospace" }}>Peter Parker (Queens HQ)</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 10, marginBottom: 10 }}>
                  <div style={{ padding: 8, borderRadius: 6, background: "rgba(255,42,77,0.08)", border: "1px solid rgba(255,42,77,0.2)" }}>
                    <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8 }}>THREAT LEVEL</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#ff7700" }}>MODERATE</div>
                  </div>
                  <div style={{ padding: 8, borderRadius: 6, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)" }}>
                    <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8 }}>SURVEILLANCE DRONES</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#00f5ff" }}>6 ACTIVE</div>
                  </div>
                  <div style={{ padding: 8, borderRadius: 6, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8 }}>POLICE SCANNER</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#34d399" }}>CLEAR</div>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerCommand("SCAN_DETECT", "Run 360-degree perimeter thermal radar sweep")}
                  style={{
                    padding: "10px", borderRadius: 6, background: "rgba(255, 42, 77, 0.2)",
                    border: "1px solid #ff2a4d", color: "#ff2a4d", fontSize: 11, fontWeight: 800,
                    fontFamily: "monospace", cursor: "pointer", width: "100%"
                  }}
                >
                  TRIGGER 360° OPTICAL RADAR SWEEP
                </button>
              </div>
            )}

            {/* 4. SUIT STATUS MODAL */}
            {modalMode === "SUIT_STATUS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,42,77,0.2)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>Nano-Tech Armor Integrity</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#34d399" }}>100%</div>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", marginTop: 1 }}>Micro-repairs operational</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,42,77,0.2)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>Web Fluid Level</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#00f5ff" }}>96% (Cartridges 1-6 Full)</div>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", marginTop: 1 }}>Tensile strength: 120 MPa</div>
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,42,77,0.2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#ff2a4d", marginBottom: 4 }}>Iron Spider Mechanical Arms (Waldoes)</div>
                  <div style={{ fontSize: 11, color: "rgba(226,232,240,0.85)" }}>4 Retractable titanium arms online with repulsor thrusters and micro-grippers. Ready for deployment.</div>
                </div>
                <button
                  onClick={() => handleTriggerCommand("SUIT_STATUS", "Run full suit diagnostic check")}
                  style={{
                    padding: "10px", borderRadius: 6, background: "rgba(52, 211, 153, 0.2)",
                    border: "1px solid #34d399", color: "#34d399", fontSize: 11, fontWeight: 800,
                    fontFamily: "monospace", cursor: "pointer"
                  }}
                >
                  RUN FULL SUIT REPAIR & DIAGNOSTICS
                </button>
              </div>
            )}

            {/* 5. GADGETS MODAL */}
            {modalMode === "GADGETS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { name: "Electric Web", status: "READY", ammo: "12 charges" },
                    { name: "Web Grenade", status: "READY", ammo: "4 charges" },
                    { name: "Spider-Drone", status: "STANDBY", ammo: "2 units" },
                    { name: "Web Wings", status: "DEPLOYABLE", ammo: "Gliding active" },
                    { name: "Holographic Decoy", status: "READY", ammo: "8 charges" },
                    { name: "Impact Web", status: "READY", ammo: "10 charges" }
                  ].map(g => (
                    <div key={g.name} style={{ padding: 10, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>{g.name}</div>
                        <div style={{ fontSize: 9.5, color: "#34d399", fontFamily: "monospace", marginTop: 2 }}>{g.status} • {g.ammo}</div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveGadget(g.name);
                          speakKaren(`${g.name} armed and ready for deployment.`);
                        }}
                        style={{
                          marginTop: 8, padding: "5px 8px", borderRadius: 4,
                          background: activeGadget === g.name ? "rgba(255,42,77,0.4)" : "rgba(0,245,255,0.15)",
                          border: activeGadget === g.name ? "1px solid #ff2a4d" : "1px solid #00f5ff",
                          color: activeGadget === g.name ? "#ffffff" : "#00f5ff",
                          fontSize: 9, fontWeight: 800, fontFamily: "monospace", cursor: "pointer"
                        }}
                      >
                        {activeGadget === g.name ? "ARMED & READY" : "DEPLOY / ARM"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SETTINGS & KAREN CONFIG MODAL */}
            {modalMode === "SETTINGS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,42,77,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#ff2a4d", marginBottom: 8, letterSpacing: "0.08em" }}>
                    KAREN AI VOICE SYNTHESIS CONTROLS
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, color: "rgba(226,232,240,0.9)" }}>
                        <span>Master Volume ({Math.round(karenVolume * 100)}%)</span>
                        <span style={{ color: "#34d399", fontFamily: "monospace" }}>100% (Nominal)</span>
                      </div>
                      <input
                        type="range" min="0.1" max="1.0" step="0.05"
                        value={karenVolume}
                        onChange={e => setKarenVolume(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#34d399" }}
                      />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, color: "rgba(226,232,240,0.9)" }}>
                        <span>Speech Pitch ({karenPitch})</span>
                        <span style={{ color: "#00f5ff", fontFamily: "monospace" }}>1.1x (Enhanced Clarity)</span>
                      </div>
                      <input
                        type="range" min="0.8" max="1.4" step="0.05"
                        value={karenPitch}
                        onChange={e => setKarenPitch(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#ff2a4d" }}
                      />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, color: "rgba(226,232,240,0.9)" }}>
                        <span>Speech Rate ({karenRate})</span>
                        <span style={{ color: "#00f5ff", fontFamily: "monospace" }}>1.03x (Tactical Speed)</span>
                      </div>
                      <input
                        type="range" min="0.8" max="1.5" step="0.05"
                        value={karenRate}
                        onChange={e => setKarenRate(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#00f5ff" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff", marginBottom: 4 }}>
                    PETER PARKER BIOMETRICS LINK
                  </div>
                  <div style={{ fontSize: 10.5, color: "#34d399", fontFamily: "monospace" }}>
                    STATUS: SECURE • IDENTITY CONFIRMED • QUEENS RESIDENT
                  </div>
                </div>
              </div>
            )}

            {/* 7. NOTIFICATIONS & COMMS */}
            {modalMode === "NOTIFICATIONS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { sender: "MJ", msg: "Missed call: 'Call me when you're done patrolling Queens!'", time: "11:20 AM", color: "#ff2a4d" },
                  { sender: "Happy Hogan", msg: "System Check: 'Stark satellite uplink active. Don't break the suit.'", time: "10:15 AM", color: "#00f5ff" },
                  { sender: "Aunt May", msg: "Dinner reminder: 'Don't be late for dinner at 7:00 PM!'", time: "09:30 AM", color: "#34d399" },
                  { sender: "Stark Industries", msg: "Firmware v2.4 successfully patched into Iron Spider Waldoes.", time: "Yesterday", color: "#c084fc" }
                ].map(item => (
                  <div key={item.sender + item.time} style={{ padding: 10, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: `1px solid ${item.color}40`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, fontWeight: 900, fontSize: 11, flexShrink: 0 }}>
                      {item.sender.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>{item.sender}</div>
                        <span style={{ fontSize: 9.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: "rgba(226,232,240,0.85)", marginTop: 2 }}>{item.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. CAPABILITIES MATRIX */}
            {modalMode === "CAPABILITIES" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { name: "Natural Conversations", desc: "Full natural dialogue with Karen AI neural assistant.", cmd: "GENERAL" },
                  { name: "Web Search", desc: "Live queries into Stark intelligence and web knowledge.", cmd: "WEB_SEARCH" },
                  { name: "Data Analysis", desc: "Real-time crime statistics and neighborhood telemetry.", cmd: "DATA_ANALYSIS" },
                  { name: "Image Recognition", desc: "Surveillance drone and camera feed object classification.", cmd: "IMAGE_RECOGNITION" },
                  { name: "Code Assistant", desc: "Python script and nano-weave algorithm optimization.", cmd: "CODE_ASSISTANT" },
                  { name: "Smart Reminders", desc: "Mission alerts, calendar, and superhero patrol schedules.", cmd: "SUIT_STATUS" }
                ].map(c => (
                  <div key={c.name} style={{ padding: 10, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff" }}>{c.name}</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", margin: "4px 0 8px 0" }}>{c.desc}</div>
                    <button
                      onClick={() => handleTriggerCommand(c.cmd, `Test ${c.name}`)}
                      style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(0,245,255,0.15)", border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}
                    >
                      TEST CAPABILITY
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 9. DATABASE ARCHIVE */}
            {modalMode === "DATABASE" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { file: "nano_web_formula_v4.py", size: "48 KB", desc: "Tensile polymer synthesis equations" },
                  { file: "waldoes_servo_calibration.json", size: "12 KB", desc: "Mechanical arms torque and balance limits" },
                  { file: "stark_satellite_uplink.bin", size: "1.2 MB", desc: "Direct orbital radar telemetry link" }
                ].map(item => (
                  <div key={item.file} style={{ padding: 10, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#00f5ff", fontFamily: "monospace" }}>{item.file}</div>
                      <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)" }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: 10, color: "#34d399", fontFamily: "monospace" }}>{item.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
