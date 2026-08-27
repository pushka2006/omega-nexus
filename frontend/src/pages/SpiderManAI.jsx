import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic, Search, BarChart3, Crosshair, Shield, ShieldAlert,
  CheckCircle2, Bell, MapPin, CloudRain, Sun, CloudSun,
  CloudFog, CloudSnow, CloudLightning, Navigation,
  RefreshCw, Sparkles, Terminal, Sliders, Database as DbIcon,
  X, Eye, Compass, Send, Activity, ArrowLeft, Camera,
  Upload, Scan, Smile, UserCheck, UserX, PlusCircle, Trash2, HeartHandshake, Zap,
  Brain, Cpu, Clock, Calendar, CheckSquare, Layers, HelpCircle, Code, Copy, Globe,
  Battery, BatteryCharging, Wifi, WifiOff, HardDrive, Laptop
} from "lucide-react";
import { http } from "../lib/api";
import { useDeviceWeather } from "../lib/locationWeather";
import {
  recognizeImage,
  drawBoundingBoxes,
  getStoredIdentities,
  saveKnownIdentity,
  deleteStoredIdentity
} from "../lib/visionRecognition";
import {
  executeKarenCapability,
  getKarenBrainStatus,
  triggerAutoLearningCycle,
  getSmartReminders,
  createSmartReminder,
  deleteSmartReminder
} from "../lib/karenBrain";
import {
  requestDesktopNotificationPermission,
  sendDesktopNotification,
  generateRealDeviceNotificationsList,
  getRealClientDeviceTelemetry
} from "../lib/deviceNotifications";
import {
  logRealActivity,
  getRealActivityLog,
  clearRealActivityLog
} from "../lib/activityLogger";

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

  // Karen AI Central Brain & Auto-Learning States
  const [brainTelemetry, setBrainTelemetry] = useState(null);
  const [isAutoLearning, setIsAutoLearning] = useState(false);
  const [remindersList, setRemindersList] = useState([]);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("Today at 6:00 PM");
  const [newReminderPriority, setNewReminderPriority] = useState("MEDIUM");

  // Real Device & System Notifications State
  const [deviceNotifications, setDeviceNotifications] = useState([]);
  const [nativeNotifPerm, setNativeNotifPerm] = useState("default");
  const [clientTelemetry, setClientTelemetry] = useState(null);

  // Real Activity Stream State
  const [realActivityLog, setRealActivityLog] = useState([]);

  const refreshActivityLog = () => {
    setRealActivityLog(getRealActivityLog());
  };

  useEffect(() => {
    refreshActivityLog();
    const handleNewActivity = () => refreshActivityLog();
    window.addEventListener("omega_nexus_activity_logged", handleNewActivity);
    window.addEventListener("omega_nexus_activity_cleared", handleNewActivity);
    return () => {
      window.removeEventListener("omega_nexus_activity_logged", handleNewActivity);
      window.removeEventListener("omega_nexus_activity_cleared", handleNewActivity);
    };
  }, []);

  // Sync Real Device Notifications
  const refreshDeviceNotifications = async () => {
    const list = await generateRealDeviceNotificationsList(remindersList, weather);
    setDeviceNotifications(list);
    const client = await getRealClientDeviceTelemetry();
    setClientTelemetry(client);
    setNativeNotifPerm(client.notificationPermission);
  };

  useEffect(() => {
    refreshDeviceNotifications();
    const interval = setInterval(refreshDeviceNotifications, 8000);
    return () => clearInterval(interval);
  }, [remindersList, weather]);

  // Specific Capability Execution States
  const [webSearchQuery, setWebSearchQuery] = useState("Spider-Man MCU tech developments");
  const [webSearchResults, setWebSearchResults] = useState([]);
  const [webSearchLoading, setWebSearchLoading] = useState(false);

  const [codeAssistantPrompt, setCodeAssistantPrompt] = useState("Optimize nano-weave power routing in Python");
  const [codeAssistantResult, setCodeAssistantResult] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);

  const [dataAnalysisQuery, setDataAnalysisQuery] = useState("Analyze NYC sector threat & telemetry distribution");
  const [dataAnalysisResult, setDataAnalysisResult] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [naturalConvInput, setNaturalConvInput] = useState("");
  const [naturalConvHistory, setNaturalConvHistory] = useState([
    { sender: "karen", text: "Hello Peter. All neural synapses and suit modules are operating at 100% capacity. How can I assist your mission today?" }
  ]);
  const [naturalConvLoading, setNaturalConvLoading] = useState(false);

  // Sync Brain Telemetry & Reminders
  const refreshBrainTelemetry = async () => {
    const status = await getKarenBrainStatus();
    setBrainTelemetry(status);
  };

  const refreshReminders = async () => {
    const list = await getSmartReminders();
    setRemindersList(list);
  };

  useEffect(() => {
    refreshBrainTelemetry();
    refreshReminders();
  }, []);

  // Handle manual trigger of auto-learning cycle
  const handleTriggerAutoLearning = async () => {
    setIsAutoLearning(true);
    speakKaren("Engaging autonomous neural learning cycle. Calibrating semantic knowledge nodes and comprehension heuristics.");
    try {
      const res = await triggerAutoLearningCycle();
      await refreshBrainTelemetry();
      speakKaren(`Auto learning cycle complete Peter. Cognitive comprehension is now at ${res.telemetry?.comprehension_score || '99.1%'}.`);
      setAiResponse(`Auto-Learning Cycle #${res.telemetry?.cycle || 145} completed. Comprehension calibrated to ${res.telemetry?.comprehension_score || '99.1%'}.`);
      logRealActivity({
        type: "AUTO_LEARN",
        title: `Auto-Learning Cycle #${res.telemetry?.cycle || 145} Completed`,
        detail: `Comprehension score calibrated to ${res.telemetry?.comprehension_score || '99.1%'}.`,
        category: "Cognitive Evolution",
        color: "#c084fc"
      });
    } catch (err) {
      console.warn("Auto-learning error:", err);
    } finally {
      setIsAutoLearning(false);
    }
  };

  // Real AI Vision & Person Recognition States
  const [visionResult, setVisionResult] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionCameraActive, setVisionCameraActive] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [knownIdentitiesList, setKnownIdentitiesList] = useState(() => getStoredIdentities());
  const [registerNameInput, setRegisterNameInput] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);

  const visionVideoRef = useRef(null);
  const visionCanvasRef = useRef(null);
  const visionStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startVisionCamera = async () => {
    try {
      if (visionStreamRef.current) {
        visionStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      visionStreamRef.current = stream;
      if (visionVideoRef.current) {
        visionVideoRef.current.srcObject = stream;
        visionVideoRef.current.play().catch(() => {});
      }
      setVisionCameraActive(true);
      setUploadedImagePreview(null);
    } catch (err) {
      console.warn("[Vision Camera] Hardware unavailable / permissions blocked:", err);
      setVisionCameraActive(false);
    }
  };

  const stopVisionCamera = () => {
    if (visionStreamRef.current) {
      visionStreamRef.current.getTracks().forEach(t => t.stop());
      visionStreamRef.current = null;
    }
    setVisionCameraActive(false);
    if (visionVideoRef.current) visionVideoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (modalMode === "IMAGE_RECOGNITION") {
      startVisionCamera();
    } else {
      stopVisionCamera();
    }
    return () => stopVisionCamera();
  }, [modalMode]);

  const handleScanVisionFrame = async (sourceOverride = null) => {
    setVisionLoading(true);
    try {
      let source = sourceOverride;
      if (!source) {
        if (visionVideoRef.current && visionCameraActive) {
          source = visionVideoRef.current;
        } else if (uploadedImagePreview) {
          source = uploadedImagePreview;
        }
      }
      if (!source) {
        setVoiceQuery("No active camera stream or image loaded to scan.");
        setVisionLoading(false);
        return;
      }

      const res = await recognizeImage(source, "surveillance", knownIdentitiesList);
      setVisionResult(res);

      if (visionCanvasRef.current && res.objects) {
        const cvs = visionCanvasRef.current;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const extraTag = res.recognition?.is_recognized
          ? `RECOGNIZED: ${res.recognition.name}`
          : (res.recognition ? "UNRECOGNIZED SUBJECT" : res.emotion?.primary);
        drawBoundingBoxes(ctx, res.objects, cvs.width, cvs.height, res.recognition?.is_recognized ? "#00FF88" : "#ff2a4d", extraTag);
      }

      const reply = res.recognition
        ? `[Biometric Telemetry] ${res.recognition.badge} · Emotion: ${res.emotion?.primary || 'Calm'} (${res.emotion?.score_str || '90%'}) · Confidence: ${res.confidence_meter?.confidence_str || '95%'}. Greeting: "${res.speech_summary}"`
        : `Target Identified: ${res.primary_target} (Confidence: ${res.confidence_str || '96%'}). ${res.tactical_assessment || 'Threat level is zero.'}`;
      setAiResponse(reply);
      setVoiceQuery(res.recognition?.badge || `Target: ${res.primary_target}`);
      speakKaren(res.speech_summary || `Target identified as ${res.primary_target}. Threat level zero.`);
    } catch (err) {
      console.error("[Vision Scan Error]:", err);
      setAiResponse("Optical scanner complete. Target classified: Physical Workspace Environment. Threat level zero.");
      speakKaren("Optical scan complete. All sectors clear. Threat level zero.");
    } finally {
      setVisionLoading(false);
    }
  };

  const handleRegisterCurrentFace = () => {
    if (!registerNameInput.trim()) return;
    const newIdentity = {
      id: `id-${Date.now()}`,
      name: registerNameInput.trim(),
      role: "Authorized Operator",
      signature: visionResult?.recognition?.face_signature || `sig_${Date.now()}`,
      is_primary_operator: true,
      visits: 1
    };
    const updated = saveKnownIdentity(newIdentity);
    setKnownIdentitiesList(updated);
    setRegisterNameInput("");
    setShowRegisterForm(false);
    // Re-scan with updated registry to trigger recognized greeting immediately
    setTimeout(() => {
      handleScanVisionFrame();
    }, 300);
  };

  const handleDeleteIdentity = (id) => {
    const updated = deleteStoredIdentity(id);
    setKnownIdentitiesList(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopVisionCamera();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setUploadedImagePreview(dataUrl);
      handleScanVisionFrame(dataUrl);
    };
    reader.readAsDataURL(file);
  };

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
      } else if (lower.includes("search") || lower.includes("stark web") || lower.includes("google") || lower.startsWith("search") || lower.includes("find online") || lower.includes("look up")) {
        resolvedType = "WEB_SEARCH";
      } else if (lower.includes("data") || lower.includes("statistics") || lower.includes("analytics") || lower.includes("chart") || lower.includes("variance")) {
        resolvedType = "DATA_ANALYSIS";
      } else if (lower.includes("threat map") || lower.includes("scan perimeter for threats") || lower.includes("scan threat")) {
        resolvedType = "SCAN_DETECT";
      } else if (lower.includes("code") || lower.includes("python") || lower.includes("program") || lower.includes("algorithm") || lower.includes("debug") || lower.includes("function") || lower.includes("react")) {
        resolvedType = "CODE_ASSISTANT";
      } else if (lower.includes("camera") || lower.includes("identify face") || lower.includes("look at this") || lower.includes("optical scanner")) {
        resolvedType = "IMAGE_RECOGNITION";
      } else if (lower.includes("remind") || lower.includes("schedule") || lower.includes("alarm") || lower.includes("calendar")) {
        resolvedType = "SMART_REMINDERS";
      } else if (lower.includes("suit status") || lower.includes("armor integrity") || lower.includes("power level")) {
        resolvedType = "SUIT_STATUS";
      } else if (lower.includes("gadget") || lower.includes("weapon arsenal") || lower.includes("web shooter")) {
        resolvedType = "GADGETS";
      } else {
        // Universal Natural Conversation with Karen AI Central Brain Engine!
        resolvedType = "NATURAL_CONVERSATION";
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
      } else if (resolvedType === "NATURAL_CONVERSATION") {
        setModalMode("NATURAL_CONVERSATION");
        setNaturalConvLoading(true);
        const queryText = (promptText && !promptText.toLowerCase().includes("launch natural conversation")) ? promptText : "Hello Karen, give me a status report and overview of capabilities.";
        const res = await executeKarenCapability("NATURAL_CONVERSATION", queryText);
        setNaturalConvHistory(prev => [
          ...prev,
          { sender: "user", text: queryText },
          { sender: "karen", text: res.response }
        ]);
        setAiResponse(res.response);
        setVoiceQuery(`Conversation: ${queryText}`);
        speakKaren(res.speech || res.response);
        setNaturalConvLoading(false);
        refreshBrainTelemetry();
        logRealActivity({
          type: "CONVERSATION",
          title: "Natural Conversation Exchange",
          detail: `User: "${queryText.slice(0, 60)}" • Karen replied with ${res.sentiment || 'high'} confidence.`,
          category: "Dialogue",
          color: "#00f5ff"
        });
      } else if (resolvedType === "WEB_SEARCH") {
        setModalMode("WEB_SEARCH");
        setWebSearchLoading(true);
        const queryToSearch = (promptText && !promptText.toLowerCase().includes("launch web search") && !promptText.toLowerCase().includes("search web for latest developments") && !promptText.toLowerCase().includes("web search activated"))
          ? promptText
          : (modalSearchInput.trim() || webSearchQuery.trim() || "Latest Artificial Intelligence and technology breakthroughs");
        
        setWebSearchQuery(queryToSearch);
        setModalSearchInput(queryToSearch);
        const res = await executeKarenCapability("WEB_SEARCH", queryToSearch);
        setWebSearchResults(res.results || []);
        setAiResponse(res.summary);
        setVoiceQuery(`Web Search: "${queryToSearch}"`);
        speakKaren(res.speech || `Search complete. Found verified intelligence for ${queryToSearch}.`);
        setWebSearchLoading(false);
        refreshBrainTelemetry();
        logRealActivity({
          type: "WEB_SEARCH",
          title: `Web Search: "${queryToSearch.slice(0, 40)}"`,
          detail: `Retrieved ${res.results_count || 3} verified intelligence sources across global nodes.`,
          category: "Intelligence",
          color: "#38bdf8"
        });
      } else if (resolvedType === "DATA_ANALYSIS") {
        setModalMode("DATA_ANALYSIS");
        setDataLoading(true);
        const queryText = (promptText && !promptText.toLowerCase().includes("launch data analysis")) ? promptText : "Analyze computational cluster throughput and anomaly distribution";
        const res = await executeKarenCapability("DATA_ANALYSIS", queryText);
        setDataAnalysisResult(res.analytics);
        setAiResponse(res.summary);
        setVoiceQuery("Data Analysis completed");
        speakKaren(res.speech || "Data analysis complete. All throughput metrics are optimal.");
        setDataLoading(false);
        refreshBrainTelemetry();
        logRealActivity({
          type: "DATA_ANALYSIS",
          title: "Data Analytics Computation",
          detail: `Processed records with 99.4% confidence and 0.02% anomaly rate.`,
          category: "Analytics",
          color: "#fb923c"
        });
      } else if (resolvedType === "CODE_ASSISTANT") {
        setModalMode("CODE_ASSISTANT");
        setCodeLoading(true);
        const promptCode = (promptText && !promptText.toLowerCase().includes("launch code assistant")) ? promptText : "Synthesize high-performance async API service in Python";
        const res = await executeKarenCapability("CODE_ASSISTANT", promptCode);
        setCodeAssistantResult(res);
        setAiResponse(res.analysis);
        setVoiceQuery("Code Assistant optimization complete");
        speakKaren(res.speech || "Code optimizer verified.");
        setCodeLoading(false);
        refreshBrainTelemetry();
        logRealActivity({
          type: "CODE",
          title: `Code Synthesis (${res.language?.toUpperCase() || 'PYTHON'})`,
          detail: res.analysis || "Synthesized clean asynchronous module.",
          category: "Engineering",
          color: "#00FF88"
        });
      } else if (resolvedType === "SMART_REMINDERS") {
        setModalMode("SMART_REMINDERS");
        const remTitle = (promptText && !promptText.toLowerCase().includes("launch smart reminders")) ? promptText : "Review system architecture and project roadmap";
        const res = await executeKarenCapability("SMART_REMINDERS", remTitle);
        await refreshReminders();
        setAiResponse(`Smart reminder logged: "${remTitle}". Automated voice alerts armed.`);
        setVoiceQuery(`Reminder Set: ${remTitle}`);
        speakKaren(res.speech || `Smart reminder set: ${remTitle}`);
        refreshBrainTelemetry();
        logRealActivity({
          type: "REMINDER",
          title: `Reminder Created: "${remTitle.slice(0, 40)}"`,
          detail: `Scheduled with automated voice alerts and notification triggers.`,
          category: "Scheduling",
          color: "#ff2a4d"
        });
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
        setModalMode("IMAGE_RECOGNITION");
        setVoiceQuery("Engaging Stark Optical Scanner & Real-Time Computer Vision Matrix...");
        const reply = "Optical Vision Scanner online. Streaming live device camera feed for real-time target recognition and object classification.";
        setAiResponse(reply);
        speakKaren("Optical vision scanner online, Peter. Scanning camera feed to identify surrounding targets.");
        setTimeout(() => {
          handleScanVisionFrame();
        }, 800);
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
    setVoiceQuery("Listening... Speak your directive now");
    speakKaren("I'm listening, Peter. Speak now.");

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

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
            rec.stop();
            handleTriggerCommand("GENERAL", transcript.trim());
          }
        };

        rec.onerror = (err) => {
          console.warn("[Karen Voice] SpeechRecognition notice:", err.error);
          setIsListening(false);
          if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }
          if (err.error !== "no-speech") {
            setVoiceQuery("Voice standby. Click microphone to speak again.");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.start();

        // If no speech detected in 6 seconds, gently return to standby without forcing any threat scan
        fallbackTimerRef.current = setTimeout(() => {
          if (isListening) {
            setIsListening(false);
            setVoiceQuery("Standing by for your directive.");
          }
        }, 6000);

      } catch (err) {
        console.warn("[Karen Voice] SpeechRecognition init issue:", err);
        setIsListening(false);
        setVoiceQuery("Standing by. Type or tap to speak.");
      }
    } else {
      // Browser doesn't support Web Speech API - open Natural Conversation modal
      setIsListening(false);
      setModalMode("NATURAL_CONVERSATION");
      speakKaren("Voice input is not supported in this browser. You can type directly to me.");
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
          
          {/* Card 1: AI CAPABILITIES (ALL 6 INTERACTIVE CAPABILITIES) */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                <span>AI CAPABILITIES</span>
                <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 4, background: "rgba(0,245,255,0.18)", color: "#00f5ff", border: "1px solid rgba(0,245,255,0.3)" }}>
                  BRAIN v2.0
                </span>
              </div>
              <button
                onClick={() => setModalMode("BRAIN_STUDIO")}
                style={{ fontSize: 9.5, color: "#00f5ff", background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 4, padding: "2px 7px", cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,245,255,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,245,255,0.12)"}
              >
                🧠 BRAIN STUDIO
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
              {[
                { name: "Natural Conversations", icon: Shield, cmd: "NATURAL_CONVERSATION", desc: "Dynamic dialogue & contextual comprehension" },
                { name: "Web Search", icon: Search, cmd: "WEB_SEARCH", desc: "Live verified search & intelligence extraction" },
                { name: "Data Analysis", icon: BarChart3, cmd: "DATA_ANALYSIS", desc: "Real telemetry calculations & anomaly detection" },
                { name: "Image Recognition", icon: Eye, cmd: "IMAGE_RECOGNITION", desc: "Optical object, emotion & face recognition" },
                { name: "Code Assistant", icon: Terminal, cmd: "CODE_ASSISTANT", desc: "Multi-language code generation & optimizer" },
                { name: "Smart Reminders", icon: CheckCircle2, cmd: "SMART_REMINDERS", desc: "Autonomous task scheduling & voice alerts" }
              ].map(cap => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.name}
                    onClick={() => handleTriggerCommand(cap.cmd, `Launch ${cap.name}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(0, 245, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                    title={`Click to execute ${cap.name}`}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(241, 245, 249, 0.95)", fontWeight: 600 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(0, 245, 255, 0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f5ff", flexShrink: 0 }}>
                        <Icon size={15} />
                      </div>
                      <span>{cap.name}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#00FF88", fontFamily: "monospace", fontWeight: 700 }}>ACTIVE</span>
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

          {/* Card 3: REAL LIVE ACTIVITY FEED */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                <span>ACTIVITY FEED</span>
                <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "rgba(0,245,255,0.15)", color: "#00f5ff", fontFamily: "monospace" }}>
                  REAL LOG
                </span>
              </div>
              <button
                onClick={() => setModalMode("ACTIVITY")}
                style={{ fontSize: 9.5, color: "#00f5ff", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = "#00f5ff"}
              >
                VIEW ALL ({realActivityLog.length})
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {realActivityLog.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  onClick={() => setModalMode("ACTIVITY")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 6px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,245,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, marginRight: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: `${act.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: act.color, flexShrink: 0 }}>
                      {act.type === "WEB_SEARCH" ? <Search size={13} /> :
                       act.type === "VISION" ? <Camera size={13} /> :
                       act.type === "CODE" ? <Code size={13} /> :
                       act.type === "AUTO_LEARN" ? <Zap size={13} /> :
                       act.type === "REMINDER" ? <CheckCircle2 size={13} /> :
                       act.type === "HARDWARE" ? <Laptop size={13} /> :
                       <Activity size={13} />}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {act.title}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(148,163,184,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {act.detail || act.category}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 8.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace", flexShrink: 0 }}>
                    {act.timeFormatted}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: REAL DEVICE & SYSTEM NOTIFICATIONS */}
          <div className="spider-hud-card" style={{ padding: "10px 14px" }}>
            <div className="spider-hud-bracket-tl" />
            <div className="spider-hud-bracket-tr" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 800, color: "#ff2a4d", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                <Bell size={14} color="#ff2a4d" />
                <span>NOTIFICATIONS</span>
                <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "rgba(0,255,136,0.15)", color: "#00FF88", fontFamily: "monospace" }}>
                  REAL DEVICE
                </span>
              </div>
              <button
                onClick={() => setModalMode("NOTIFICATIONS")}
                style={{ fontSize: 9.5, color: "#00f5ff", background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = "#00f5ff"}
              >
                VIEW ALL ({deviceNotifications.length})
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {deviceNotifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => setModalMode("NOTIFICATIONS")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 6px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,245,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, marginRight: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${notif.color}20`, display: "flex", alignItems: "center", justifyContent: "center", color: notif.color, flexShrink: 0 }}>
                      {notif.type === "battery" ? <Battery size={12} /> :
                       notif.type === "network" ? <Wifi size={12} /> :
                       notif.type === "gps" ? <MapPin size={12} /> :
                       notif.type === "host" ? <Laptop size={12} /> :
                       <Bell size={12} />}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(148,163,184,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {notif.sender}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 8.5, color: "rgba(148,163,184,0.6)", fontFamily: "monospace", flexShrink: 0 }}>
                    {notif.time}
                  </span>
                </div>
              ))}
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
                  {modalMode === "IMAGE_RECOGNITION" && "STARK OPTICAL SCANNER & REAL-TIME AI VISION RECOGNITION"}
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

            {/* 0. REAL AI IMAGE RECOGNITION & OPTICAL VISION MODAL */}
            {modalMode === "IMAGE_RECOGNITION" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Header Scanner Status */}
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,42,77,0.35)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Crosshair size={18} color="#ff2a4d" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>
                        REAL-TIME OPTICAL LIDAR & TARGET CLASSIFIER
                      </div>
                      <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", fontFamily: "monospace" }}>
                        Neural Vision Core // 640x480 Spatial Matrix // Karen AI
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 8, color: visionCameraActive ? "#00FF88" : "#fbbf24", fontWeight: 800, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: visionCameraActive ? "#00FF88" : "#fbbf24", display: "inline-block" }} />
                      {visionCameraActive ? "LIVE OPTICAL STREAM" : "PHOTO MATRIX"}
                    </span>
                  </div>
                </div>

                {/* Main Video / Image Viewport with Cyber HUD Overlays */}
                <div style={{ position: "relative", width: "100%", height: 320, background: "#020617", borderRadius: 10, overflow: "hidden", border: "1.5px solid rgba(0,245,255,0.4)", boxShadow: "0 0 30px rgba(0,245,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* Live WebCam Video Element */}
                  <video
                    ref={visionVideoRef}
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: visionCameraActive ? "block" : "none"
                    }}
                  />

                  {/* Uploaded Photo Viewport */}
                  {uploadedImagePreview && !visionCameraActive && (
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded frame"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  )}

                  {/* Standby screen if neither camera nor upload */}
                  {!visionCameraActive && !uploadedImagePreview && (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <Camera size={44} color="#ff2a4d" style={{ opacity: 0.8, marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>CAMERA STANDBY // READY TO SCAN</div>
                      <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", marginTop: 4 }}>
                        Click &quot;ACTIVATE WEBCAM&quot; or &quot;UPLOAD PHOTO&quot; to identify any object in real time
                      </div>
                    </div>
                  )}

                  {/* Canvas HUD Overlay for Bounding Boxes & Crosshairs */}
                  <canvas
                    ref={visionCanvasRef}
                    width={640}
                    height={480}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none"
                    }}
                  />

                  {/* Cyber Scanner Reticle */}
                  <div style={{ position: "absolute", inset: 16, border: "1px dashed rgba(0,245,255,0.25)", borderRadius: 6, pointerEvents: "none" }}>
                    <div style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" }} />
                    <div style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTop: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" }} />
                    <div style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottom: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" }} />
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" }} />
                  </div>

                  {/* Scanning Animation Sweep */}
                  {visionLoading && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0, right: 0, height: 4,
                        background: "linear-gradient(90deg, transparent, #00f5ff, #ff2a4d, transparent)",
                        boxShadow: "0 0 15px #00f5ff",
                        animation: "spider-audio-wave 1.2s ease-in-out infinite alternate"
                      }}
                    />
                  )}
                </div>

                {/* Control Action Toolbar */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleScanVisionFrame()}
                    disabled={visionLoading}
                    style={{
                      flex: 1.5, padding: "10px 16px", borderRadius: 6,
                      background: visionLoading ? "rgba(255,42,77,0.3)" : "linear-gradient(90deg, #ff2a4d, #b50f28)",
                      border: "1px solid #ff2a4d", color: "#ffffff", fontSize: 11.5, fontWeight: 900,
                      fontFamily: "monospace", cursor: visionLoading ? "wait" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 0 16px rgba(255,42,77,0.4)"
                    }}
                  >
                    <Scan size={15} /> {visionLoading ? "ANALYZING TARGET..." : "📸 SCAN & IDENTIFY TARGET"}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 6,
                      background: "rgba(0, 245, 255, 0.12)", border: "1px solid rgba(0, 245, 255, 0.4)",
                      color: "#00f5ff", fontSize: 11, fontWeight: 800, fontFamily: "monospace",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    <Upload size={14} /> UPLOAD PHOTO
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

                  <button
                    onClick={() => {
                      if (visionCameraActive) stopVisionCamera();
                      else startVisionCamera();
                    }}
                    style={{
                      padding: "10px 14px", borderRadius: 6,
                      background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "#cbd5e1", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Camera size={14} /> {visionCameraActive ? "PAUSE CAM" : "START CAM"}
                  </button>
                </div>

                {/* Real Vision Detection & Biometric Intelligence Results Card */}
                {visionResult && (
                  <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                    
                    {/* 1. PERSON RECOGNITION & KAREN VOICE GREETING BANNER */}
                    {visionResult.recognition && (
                      <div
                        style={{
                          background: visionResult.recognition.is_recognized ? "rgba(0, 255, 136, 0.08)" : "rgba(239, 68, 68, 0.08)",
                          border: `1.5px solid ${visionResult.recognition.is_recognized ? "#00FF88" : "#f87171"}`,
                          borderRadius: 8,
                          padding: "12px 14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {visionResult.recognition.is_recognized ? (
                              <UserCheck size={20} color="#00FF88" />
                            ) : (
                              <UserX size={20} color="#f87171" />
                            )}
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 900, color: visionResult.recognition.is_recognized ? "#00FF88" : "#f87171" }}>
                                {visionResult.recognition.badge}
                              </div>
                              <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", fontFamily: "monospace" }}>
                                Biometric Signature: {visionResult.recognition.face_signature} · {visionResult.recognition.role}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {!visionResult.recognition.is_recognized && (
                              <button
                                onClick={() => setShowRegisterForm(!showRegisterForm)}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 6,
                                  background: "linear-gradient(90deg, #ff2a4d, #991b1b)",
                                  border: "1px solid #ff2a4d",
                                  color: "#fff",
                                  fontSize: 10.5,
                                  fontWeight: 800,
                                  fontFamily: "monospace",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6
                                }}
                              >
                                <PlusCircle size={13} /> {showRegisterForm ? "CANCEL" : "REGISTER IDENTITY"}
                              </button>
                            )}

                            <button
                              onClick={() => setShowVaultModal(!showVaultModal)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#cbd5e1",
                                fontSize: 10,
                                fontFamily: "monospace",
                                cursor: "pointer"
                              }}
                            >
                              VAULT ({knownIdentitiesList.length})
                            </button>
                          </div>
                        </div>

                        {/* Karen AI Exact Voice Quote Bar */}
                        <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 6, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 13 }}>🎙️</span>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif" }}>
                            Karen AI Speech: <span style={{ color: visionResult.recognition.is_recognized ? "#00FF88" : "#38bdf8" }}>&quot;{visionResult.recognition.greeting}&quot;</span>
                          </div>
                        </div>

                        {/* Inline Registration Form */}
                        {showRegisterForm && (
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <input
                              type="text"
                              placeholder="Enter Operator / Person Name (e.g. Peter Parker / Pushkar)"
                              value={registerNameInput}
                              onChange={(e) => setRegisterNameInput(e.target.value)}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                background: "rgba(15,23,42,0.9)",
                                border: "1px solid #00f5ff",
                                borderRadius: 6,
                                color: "#fff",
                                fontSize: 11,
                                fontFamily: "monospace",
                                outline: "none"
                              }}
                            />
                            <button
                              onClick={handleRegisterCurrentFace}
                              style={{
                                padding: "8px 16px",
                                background: "#00FF88",
                                border: "none",
                                borderRadius: 6,
                                color: "#020617",
                                fontSize: 11,
                                fontWeight: 900,
                                fontFamily: "monospace",
                                cursor: "pointer"
                              }}
                            >
                              SAVE IDENTITY
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. EMOTION DETECTION & SUBJECT CONFIDENCE DUAL RADAR */}
                    {visionResult.emotion && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {/* Emotion Radar Card */}
                        <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,42,77,0.3)", borderRadius: 6, padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: "#ff2a4d", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
                              <Smile size={12} /> EMOTION RADAR
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 900, color: "#ff2a4d", fontFamily: "monospace" }}>
                              {visionResult.emotion.score_str}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
                            {visionResult.emotion.primary}
                          </div>

                          {/* Emotion Distribution Spectrum */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {Object.entries(visionResult.emotion.distribution || {}).map(([emo, val]) => (
                              <div key={emo} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 8.5, fontFamily: "monospace" }}>
                                <span style={{ width: 55, color: "rgba(148,163,184,0.8)" }}>{emo}</span>
                                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                                  <div style={{ width: `${val}%`, height: "100%", background: "#ff2a4d" }} />
                                </div>
                                <span style={{ width: 26, textAlign: "right", color: "#fff" }}>{val}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Subject Confidence & Poise Card */}
                        {visionResult.confidence_meter && (
                          <div style={{ background: "rgba(30,41,59,0.5)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 6, padding: "10px 12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <div style={{ fontSize: 9, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 4 }}>
                                <Zap size={12} /> POISE & CONFIDENCE
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 900, color: "#00FF88", fontFamily: "monospace" }}>
                                {visionResult.confidence_meter.confidence_str}
                              </span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                              {visionResult.confidence_meter.poise_level}
                            </div>
                            <div style={{ fontSize: 9, color: "rgba(148,163,184,0.8)", fontFamily: "monospace", lineHeight: 1.4 }}>
                              Stress Indicator: <strong style={{ color: "#00FF88" }}>{visionResult.confidence_meter.stress_indicator}</strong><br />
                              Gaze Focus: <strong style={{ color: "#38bdf8" }}>{visionResult.confidence_meter.gaze_alignment}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Known Identities Vault Slide-in */}
                    {showVaultModal && (
                      <div style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace", marginBottom: 8 }}>
                          BIOMETRIC IDENTITIES VAULT ({knownIdentitiesList.length} PROFILES)
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {knownIdentitiesList.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 4 }}>
                              <div>
                                <strong style={{ fontSize: 11, color: "#fff" }}>{item.name}</strong>
                                <span style={{ fontSize: 9, color: "#38bdf8", marginLeft: 6, fontFamily: "monospace" }}>[{item.role || 'Operator'}]</span>
                              </div>
                              <button
                                onClick={() => handleDeleteIdentity(item.id)}
                                style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", padding: 2 }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Classification & Objects Matrix */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>PRIMARY TARGET</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#00f5ff" }}>
                          {visionResult.primary_target}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>AI CERTAINTY</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#34d399", fontFamily: "monospace" }}>
                          {visionResult.confidence_str || `${Math.round(visionResult.confidence * 100)}%`}
                        </div>
                      </div>
                    </div>

                    {/* Karen AI Tactical Assessment */}
                    <div style={{ background: "rgba(255,42,77,0.1)", border: "1px solid rgba(255,42,77,0.3)", borderRadius: 6, padding: "8px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: "#ff2a4d", fontFamily: "monospace", letterSpacing: "0.1em", marginBottom: 3 }}>
                        KAREN AI TACTICAL TELEMETRY
                      </div>
                      <div style={{ fontSize: 11, color: "#f8fafc", lineHeight: 1.4 }}>
                        {visionResult.tactical_assessment}
                      </div>
                    </div>

                    {/* Detected Objects Matrix */}
                    {visionResult.objects && visionResult.objects.length > 0 && (
                      <div>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: "rgba(148,163,184,0.8)", fontFamily: "monospace", marginBottom: 6 }}>
                          DETECTED OBJECT ENTITIES ({visionResult.objects.length})
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {visionResult.objects.map((obj, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <strong style={{ fontSize: 11, color: "#fff" }}>{obj.label}</strong>
                                <span style={{ fontSize: 9, color: "#38bdf8", marginLeft: 8, fontFamily: "monospace" }}>[{obj.category}]</span>
                                {obj.description && <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.75)", marginTop: 2 }}>{obj.description}</div>}
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#00FF88", fontFamily: "monospace" }}>
                                {obj.confidence_str || `${Math.round(obj.confidence * 100)}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optical Telemetry Grid */}
                    {visionResult.visual_telemetry && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, fontSize: 8.5, fontFamily: "monospace", color: "rgba(148,163,184,0.8)", paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div>RESOLUTION: <strong style={{ color: "#fff" }}>{visionResult.visual_telemetry.resolution}</strong></div>
                        <div>LUMINANCE: <strong style={{ color: "#fff" }}>{visionResult.visual_telemetry.luminance}</strong></div>
                        <div>THREAT LEVEL: <strong style={{ color: "#00FF88" }}>{visionResult.threat_level}</strong></div>
                        <div>LATENCY: <strong style={{ color: "#38bdf8" }}>{visionResult.visual_telemetry.latency_ms || "14"}ms</strong></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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

            {/* 1. UNIVERSAL REAL WEB SEARCH & LIVE INTELLIGENCE MODAL */}
            {modalMode === "WEB_SEARCH" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Search Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = (modalSearchInput.trim() || webSearchQuery.trim() || "Latest Artificial Intelligence and technology breakthroughs");
                    handleTriggerCommand("WEB_SEARCH", q);
                  }}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    value={modalSearchInput}
                    onChange={e => {
                      setModalSearchInput(e.target.value);
                      setWebSearchQuery(e.target.value);
                    }}
                    placeholder="Search Google, Wikipedia, GitHub, or any topic (e.g. Artificial Intelligence, React 19, Space, News)..."
                    style={{
                      flex: 1, padding: "11px 16px", borderRadius: 6,
                      background: "rgba(3, 7, 18, 0.95)", border: "1px solid rgba(0, 245, 255, 0.4)",
                      color: "#ffffff", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={webSearchLoading}
                    style={{
                      padding: "11px 18px", borderRadius: 6, background: "rgba(0, 245, 255, 0.2)",
                      border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 11.5, fontWeight: 900,
                      fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Search size={14} /> {webSearchLoading ? "SEARCHING..." : "AI SEARCH"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const q = modalSearchInput.trim() || "Latest Artificial Intelligence breakthroughs";
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank", "noopener,noreferrer");
                    }}
                    style={{
                      padding: "11px 14px", borderRadius: 6, background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)", color: "#ffffff", fontSize: 11, fontWeight: 700,
                      fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                    }}
                  >
                    GOOGLE ↗
                  </button>
                </form>

                {/* 6 Real Search Engines Launchers Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { name: "Google Web", url: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`, color: "#00f5ff" },
                    { name: "YouTube", url: q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, color: "#ff2a4d" },
                    { name: "Google News", url: q => `https://news.google.com/search?q=${encodeURIComponent(q)}`, color: "#34d399" },
                    { name: "Google Maps", url: q => `https://www.google.com/maps/search/${encodeURIComponent(q || "Current Location")}`, color: "#fb923c" },
                    { name: "GitHub Search", url: q => `https://github.com/search?q=${encodeURIComponent(q)}`, color: "#c084fc" },
                    { name: "Wikipedia", url: q => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q || "Artificial Intelligence")}`, color: "#e2e8f0" }
                  ].map(engine => (
                    <button
                      key={engine.name}
                      onClick={() => {
                        const q = modalSearchInput.trim() || "Latest Artificial Intelligence breakthroughs";
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
                      title={`Search ${engine.name} for your query`}
                    >
                      <span>{engine.name}</span>
                      <span style={{ color: engine.color, fontSize: 10 }}>↗</span>
                    </button>
                  ))}
                </div>

                {/* Popular Universal Search Directives */}
                <div>
                  <div style={{ fontSize: 10, color: "rgba(148,163,184,0.7)", fontFamily: "monospace", marginBottom: 6 }}>
                    POPULAR TOPICS & DIRECTIVES (CLICK TO SEARCH LIVE)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[
                      "Artificial Intelligence & LLMs",
                      "Fullstack React & Python Development",
                      "Global Financial & Tech Markets",
                      "Quantum Computing Breakthroughs",
                      "Space Exploration & Astronomy",
                      "Latest World News & Headlines",
                      "Marvel & Spider-Man Universe"
                    ].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setModalSearchInput(tag);
                          setWebSearchQuery(tag);
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

                {/* In-App Live Intelligence Results */}
                {webSearchResults && webSearchResults.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace" }}>
                      VERIFIED WEB INTELLIGENCE ({webSearchResults.length} SOURCES)
                    </div>
                    {webSearchResults.map((res, i) => (
                      <div key={i} style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#00f5ff" }}>{res.title}</div>
                          <span style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>{res.source}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 4, lineHeight: 1.4 }}>{res.snippet}</div>
                        {res.url && (
                          <a href={res.url} target="_blank" rel="noreferrer" style={{ fontSize: 9.5, color: "#38bdf8", marginTop: 6, display: "inline-block", textDecoration: "none" }}>
                            🔗 {res.url} ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Execution Status */}
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#00f5ff" }}>Live Search Engine Telemetry</div>
                    <span style={{ fontSize: 9, color: "#34d399", fontFamily: "monospace" }}>GLOBAL WEB REAL-TIME ACCESS</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(226,232,240,0.95)", lineHeight: 1.45 }}>
                    {aiResponse}
                  </div>
                </div>
              </div>
            )}

            {/* 2. REAL DATA ANALYSIS & STATISTICAL COMPUTATION STUDIO */}
            {modalMode === "DATA_ANALYSIS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Search & Direct Numerical Input Bar */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const q = dataAnalysisQuery.trim() || "Analyze real host hardware telemetry metrics";
                    handleTriggerCommand("DATA_ANALYSIS", q);
                  }}
                  style={{ display: "flex", gap: 8 }}
                >
                  <input
                    type="text"
                    value={dataAnalysisQuery}
                    onChange={e => setDataAnalysisQuery(e.target.value)}
                    placeholder="Enter query, host telemetry, or numbers: e.g. 45, 82, 19, 94, 63, 110, 250..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: 6,
                      background: "rgba(3, 7, 18, 0.95)", border: "1px solid rgba(251, 146, 60, 0.4)",
                      color: "#ffffff", fontSize: 12.5, fontFamily: "'Space Grotesk', sans-serif", outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={dataLoading}
                    style={{
                      padding: "10px 16px", borderRadius: 6, background: "rgba(251, 146, 60, 0.2)",
                      border: "1px solid #fb923c", color: "#fb923c", fontSize: 11, fontWeight: 900,
                      fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <BarChart3 size={14} /> {dataLoading ? "ANALYZING..." : "ANALYZE"}
                  </button>
                </form>

                {/* Quick Real Dataset Triggers & CSV Upload */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const q = "Analyze real host hardware telemetry and resource utilization";
                      setDataAnalysisQuery(q);
                      handleTriggerCommand("DATA_ANALYSIS", q);
                    }}
                    style={{
                      padding: "8px 10px", borderRadius: 6, background: "rgba(0,245,255,0.08)",
                      border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff",
                      fontSize: 10, fontWeight: 800, fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    💻 HOST HARDWARE DATA
                  </button>

                  <label
                    style={{
                      padding: "8px 10px", borderRadius: 6, background: "rgba(52, 211, 153, 0.1)",
                      border: "1px solid rgba(52, 211, 153, 0.35)", color: "#34d399",
                      fontSize: 10, fontWeight: 800, fontFamily: "monospace", cursor: "pointer",
                      textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                    }}
                  >
                    📁 UPLOAD CSV/JSON
                    <input
                      type="file"
                      accept=".csv,.json,.txt"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const text = await file.text();
                        const numbers = [];
                        text.split(/[\r\n,;\t ]+/).forEach(token => {
                          const num = parseFloat(token.trim());
                          if (!isNaN(num)) numbers.push(num);
                        });
                        const sampleStr = numbers.slice(0, 20).join(", ");
                        const queryStr = `Analyze uploaded dataset '${file.name}' with ${numbers.length} values: [${sampleStr}]`;
                        setDataAnalysisQuery(queryStr);
                        handleTriggerCommand("DATA_ANALYSIS", queryStr);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const sampleStr = "45.2, 88.6, 19.4, 94.1, 63.8, 112.5, 75.0, 89.3, 240.5";
                      const q = `Calculate statistical variance on sample data: [${sampleStr}]`;
                      setDataAnalysisQuery(q);
                      handleTriggerCommand("DATA_ANALYSIS", q);
                    }}
                    style={{
                      padding: "8px 10px", borderRadius: 6, background: "rgba(192, 132, 252, 0.1)",
                      border: "1px solid rgba(192, 132, 252, 0.3)", color: "#c084fc",
                      fontSize: 10, fontWeight: 800, fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    🔢 NUMERICAL SAMPLE
                  </button>
                </div>

                {/* Primary Real KPIs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.85)", border: "1px solid rgba(251,146,60,0.35)" }}>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>
                      DATASET & RECORDS PROCESSED
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#fb923c", margin: "3px 0" }}>
                      {dataAnalysisResult?.total_records_processed ? `${dataAnalysisResult.total_records_processed} Records` : "4,096 Records"}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(226,232,240,0.85)" }}>
                      {dataAnalysisResult?.dataset_type || "Real Host Hardware & System Telemetry"}
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.85)", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>
                      CONFIDENCE & ANOMALY RATE
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#34d399", margin: "3px 0" }}>
                      {dataAnalysisResult?.confidence_interval || "99.9%"}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(226,232,240,0.85)" }}>
                      Anomaly / Outlier Rate: {dataAnalysisResult?.mean_anomaly_rate || "0.00%"}
                    </div>
                  </div>
                </div>

                {/* Real Metrics Grid */}
                {dataAnalysisResult?.metrics && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {dataAnalysisResult.metrics.map((m, idx) => (
                      <div key={idx} style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontSize: 9, color: "rgba(148,163,184,0.6)", fontFamily: "monospace" }}>{m.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#ffffff", marginTop: 2 }}>{m.val}</div>
                        <div style={{ fontSize: 8.5, color: "#38bdf8", fontFamily: "monospace", marginTop: 1 }}>{m.status} • {m.trend}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Real Distribution Breakdown */}
                {dataAnalysisResult?.distribution_breakdown && (
                  <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.85)", border: "1px solid rgba(0,245,255,0.2)" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: "#00f5ff", marginBottom: 8, letterSpacing: "0.08em", fontFamily: "monospace" }}>
                      STATISTICAL DISTRIBUTION BREAKDOWN
                    </div>
                    {dataAnalysisResult.distribution_breakdown.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 2 }}>
                          <span style={{ color: "#ffffff", fontWeight: 600 }}>{item.segment}</span>
                          <span style={{ color: "#34d399", fontFamily: "monospace", fontWeight: 700 }}>{item.status}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(100, Math.max(10, item.activity_index))}%`,
                              background: idx === 0 ? "#00f5ff" : idx === 1 ? "#34d399" : idx === 2 ? "#fb923c" : "#c084fc",
                              borderRadius: 3
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Analysis Summary and Actions */}
                <div style={{ padding: 12, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(251,146,60,0.3)" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#fb923c", fontFamily: "monospace", marginBottom: 4 }}>
                    CALCULATED STATISTICAL SUMMARY
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(226,232,240,0.95)", lineHeight: 1.45 }}>
                    {aiResponse}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => speakKaren(aiResponse)}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 6, background: "rgba(251, 146, 60, 0.2)",
                      border: "1px solid #fb923c", color: "#fb923c", fontSize: 11, fontWeight: 800,
                      fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    🔊 ANNOUNCE FINDINGS
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/data")}
                    style={{
                      flex: 1, padding: "10px", borderRadius: 6, background: "rgba(56, 189, 248, 0.2)",
                      border: "1px solid #38bdf8", color: "#38bdf8", fontSize: 11, fontWeight: 800,
                      fontFamily: "monospace", cursor: "pointer"
                    }}
                  >
                    ADVANCED DATA STUDIO ↗
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

            {/* 7. REAL DEVICE NOTIFICATIONS & DESKTOP ALERTS MODAL */}
            {modalMode === "NOTIFICATIONS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Action Banner for Native Desktop Notifications */}
                <div style={{ background: "linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))", border: "1px solid rgba(0,245,255,0.35)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Bell size={18} color="#00f5ff" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                          REAL DEVICE NOTIFICATIONS & TELEMETRY
                        </div>
                        <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", fontFamily: "monospace" }}>
                          STATUS: {nativeNotifPerm === "granted" ? "🟢 NATIVE DESKTOP PERMISSION ACTIVE" : "🟡 ACTION REQUIRED FOR WINDOWS POPUPS"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {nativeNotifPerm !== "granted" ? (
                      <button
                        onClick={async () => {
                          const res = await requestDesktopNotificationPermission();
                          setNativeNotifPerm(res);
                          if (res === "granted") {
                            sendDesktopNotification("Karen AI System", "Real Windows desktop notifications enabled successfully!");
                            speakKaren("Native desktop notifications enabled. System alerts will now dispatch to your Windows notifications center.");
                          }
                          refreshDeviceNotifications();
                        }}
                        style={{
                          padding: "6px 12px", borderRadius: 4, background: "rgba(0,255,136,0.2)",
                          border: "1px solid #00FF88", color: "#00FF88", fontSize: 10, fontWeight: 800,
                          fontFamily: "monospace", cursor: "pointer"
                        }}
                      >
                        🔔 ENABLE DESKTOP ALERTS
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sendDesktopNotification("Karen AI Telemetry Alert", "Device status: Battery & hardware operating within nominal parameters.", "/favicon.ico");
                          speakKaren("Test desktop notification dispatched to your device.");
                        }}
                        style={{
                          padding: "6px 12px", borderRadius: 4, background: "rgba(0,245,255,0.15)",
                          border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 10, fontWeight: 800,
                          fontFamily: "monospace", cursor: "pointer"
                        }}
                      >
                        TEST POPUP ↗
                      </button>
                    )}
                  </div>
                </div>

                {/* Real Device Telemetry Grid */}
                {clientTelemetry && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, fontSize: 9.5, fontFamily: "monospace", color: "rgba(148,163,184,0.85)" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 10px" }}>
                      <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8.5 }}>BATTERY</div>
                      <div style={{ color: "#34d399", fontWeight: 800, fontSize: 12, marginTop: 2 }}>
                        {clientTelemetry.battery ? `${clientTelemetry.battery.level}% (${clientTelemetry.battery.charging ? "Charging" : "Batt"})` : "AC Connected"}
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 10px" }}>
                      <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8.5 }}>NETWORK</div>
                      <div style={{ color: "#00f5ff", fontWeight: 800, fontSize: 12, marginTop: 2 }}>
                        {clientTelemetry.connection ? clientTelemetry.connection.downlink : "Online (High Speed)"}
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 10px" }}>
                      <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8.5 }}>HARDWARE CORES</div>
                      <div style={{ color: "#fb923c", fontWeight: 800, fontSize: 12, marginTop: 2 }}>
                        {clientTelemetry.cores} CPU Cores
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "8px 10px" }}>
                      <div style={{ color: "rgba(148,163,184,0.6)", fontSize: 8.5 }}>PERMISSIONS</div>
                      <div style={{ color: nativeNotifPerm === "granted" ? "#34d399" : "#fbbf24", fontWeight: 800, fontSize: 12, marginTop: 2 }}>
                        {nativeNotifPerm.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Device Notifications List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace" }}>
                    REAL DEVICE & SYSTEM NOTIFICATION FEED ({deviceNotifications.length})
                  </div>
                  {deviceNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: 10,
                        borderRadius: 6,
                        background: "rgba(15,23,42,0.85)",
                        border: `1px solid ${notif.color}40`,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start"
                      }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${notif.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: notif.color, flexShrink: 0 }}>
                        {notif.type === "battery" ? <Battery size={15} /> :
                         notif.type === "network" ? <Wifi size={15} /> :
                         notif.type === "gps" ? <MapPin size={15} /> :
                         notif.type === "host" ? <Laptop size={15} /> :
                         <Bell size={15} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 12.5, fontWeight: 800, color: "#ffffff" }}>{notif.title}</div>
                          <span style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>{notif.time}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#38bdf8", fontFamily: "monospace", marginTop: 1 }}>
                          {notif.sender} • [{notif.category}]
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(226,232,240,0.9)", marginTop: 4, lineHeight: 1.4 }}>
                          {notif.msg}
                        </div>

                        {notif.voice_alert && (
                          <button
                            onClick={() => speakKaren(notif.voice_alert)}
                            style={{
                              marginTop: 6, padding: "3px 8px", borderRadius: 4,
                              background: "rgba(0,245,255,0.15)", border: "1px solid #00f5ff",
                              color: "#00f5ff", fontSize: 9.5, fontFamily: "monospace", cursor: "pointer"
                            }}
                          >
                            🔊 ANNOUNCE ALERT
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7.5. REAL ACTIVITY LOG MODAL */}
            {modalMode === "ACTIVITY" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Header with stream stats & clear action */}
                <div style={{ background: "linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))", border: "1px solid rgba(0,245,255,0.35)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={18} color="#00f5ff" />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                        REAL-TIME ACTIVITY AUDIT LOG
                      </div>
                      <div style={{ fontSize: 9.5, color: "#34d399", fontFamily: "monospace" }}>
                        🟢 CHRONOLOGICAL STREAM ACTIVE • {realActivityLog.length} EVENTS LOGGED
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        clearRealActivityLog();
                        refreshActivityLog();
                      }}
                      style={{
                        padding: "6px 12px", borderRadius: 4, background: "rgba(255,42,77,0.15)",
                        border: "1px solid rgba(255,42,77,0.4)", color: "#ff8da1", fontSize: 10, fontWeight: 800,
                        fontFamily: "monospace", cursor: "pointer"
                      }}
                    >
                      CLEAR STREAM
                    </button>
                  </div>
                </div>

                {/* Real Activities Stream */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "55vh", overflowY: "auto" }}>
                  {realActivityLog.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: 10,
                        borderRadius: 6,
                        background: "rgba(15,23,42,0.85)",
                        border: `1px solid ${act.color}40`,
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start"
                      }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: 6, background: `${act.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: act.color, flexShrink: 0 }}>
                        {act.type === "WEB_SEARCH" ? <Search size={15} /> :
                         act.type === "VISION" ? <Camera size={15} /> :
                         act.type === "CODE" ? <Code size={15} /> :
                         act.type === "AUTO_LEARN" ? <Zap size={15} /> :
                         act.type === "REMINDER" ? <CheckCircle2 size={15} /> :
                         act.type === "HARDWARE" ? <Laptop size={15} /> :
                         <Activity size={15} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 12.5, fontWeight: 800, color: "#ffffff" }}>{act.title}</div>
                          <span style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>{act.timeFormatted}</span>
                        </div>
                        <div style={{ fontSize: 10, color: act.color, fontFamily: "monospace", marginTop: 1 }}>
                          [{act.category}] • STATUS: {act.status}
                        </div>
                        {act.detail && (
                          <div style={{ fontSize: 11, color: "rgba(226,232,240,0.9)", marginTop: 4, lineHeight: 1.4 }}>
                            {act.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CAPABILITIES MATRIX */}
            {modalMode === "CAPABILITIES" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { name: "Natural Conversations", desc: "Full natural dialogue with Karen AI neural assistant.", cmd: "NATURAL_CONVERSATION" },
                  { name: "Web Search", desc: "Live queries into Stark intelligence and web knowledge.", cmd: "WEB_SEARCH" },
                  { name: "Data Analysis", desc: "Real-time crime statistics and neighborhood telemetry.", cmd: "DATA_ANALYSIS" },
                  { name: "Image Recognition", desc: "Surveillance drone and camera feed object classification.", cmd: "IMAGE_RECOGNITION" },
                  { name: "Code Assistant", desc: "Python script and nano-weave algorithm optimization.", cmd: "CODE_ASSISTANT" },
                  { name: "Smart Reminders", desc: "Mission alerts, calendar, and superhero patrol schedules.", cmd: "SMART_REMINDERS" }
                ].map(c => (
                  <div key={c.name} style={{ padding: 10, borderRadius: 6, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#ffffff" }}>{c.name}</div>
                    <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", margin: "4px 0 8px 0" }}>{c.desc}</div>
                    <button
                      onClick={() => handleTriggerCommand(c.cmd, `Launch ${c.name}`)}
                      style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(0,245,255,0.15)", border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}
                    >
                      LAUNCH CAPABILITY
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 10. KAREN NEURAL BRAIN & AUTO-LEARNING STUDIO MODAL */}
            {modalMode === "BRAIN_STUDIO" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Cognitive Metrics Banner */}
                <div style={{ background: "linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))", border: "1px solid rgba(0,245,255,0.35)", borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Brain size={22} color="#00f5ff" />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#ffffff", letterSpacing: "0.05em" }}>
                          KAREN COGNITIVE BRAIN & AUTO-LEARNER
                        </div>
                        <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.8)", fontFamily: "monospace" }}>
                          AUTONOMOUS NEURAL HEURISTICS • KNOWLEDGE GRAPH v2.0
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerAutoLearning}
                    disabled={isAutoLearning}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      background: isAutoLearning ? "rgba(255,42,77,0.3)" : "linear-gradient(90deg, #ff2a4d 0%, #b50f28 100%)",
                      border: "1px solid #ff2a4d",
                      color: "#fff",
                      fontSize: 10.5,
                      fontWeight: 800,
                      fontFamily: "monospace",
                      cursor: isAutoLearning ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 0 15px rgba(255,42,77,0.4)"
                    }}
                  >
                    <Zap size={13} color="#fff" />
                    {isAutoLearning ? "OPTIMIZING..." : "TRIGGER AUTO-LEARN"}
                  </button>
                </div>

                {/* 4 Cognitive Telemetry Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>COMPREHENSION</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#34d399", fontFamily: "monospace" }}>
                      {brainTelemetry?.comprehension_score || "98.9%"}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>ACTIVE SYNAPSES</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#00f5ff", fontFamily: "monospace" }}>
                      {brainTelemetry?.active_synapses || 48} NODES
                    </div>
                  </div>

                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>LEARNING CYCLES</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#fb923c", fontFamily: "monospace" }}>
                      #{brainTelemetry?.learning_cycles || 144}
                    </div>
                  </div>

                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 6, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "rgba(148,163,184,0.7)", fontFamily: "monospace" }}>ADAPTATION RATE</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#c084fc", fontFamily: "monospace" }}>
                      {brainTelemetry?.adaptation_rate || "+0.4%/cyc"}
                    </div>
                  </div>
                </div>

                {/* Evolving Knowledge Nodes Matrix */}
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.1em" }}>
                    EVOLVING KNOWLEDGE NODES ({brainTelemetry?.knowledge_nodes?.length || 8})
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(brainTelemetry?.knowledge_nodes || []).map(node => (
                      <div key={node.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "6px 10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 3 }}>
                          <span style={{ color: "#fff", fontWeight: 700 }}>{node.topic}</span>
                          <span style={{ color: "#00FF88", fontFamily: "monospace", fontWeight: 800 }}>{node.mastery}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${node.mastery}%`, background: "linear-gradient(90deg, #00f5ff, #00FF88)", borderRadius: 2 }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "rgba(148,163,184,0.65)", fontFamily: "monospace", marginTop: 3 }}>
                          <span>CAT: {node.category}</span>
                          <span>UPDATED: {node.updated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-Learning Evolutionary Milestones */}
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#ff2a4d", fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.1em" }}>
                    RECENT AUTO-LEARNING MILESTONES
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(brainTelemetry?.recent_milestones || []).map((m, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderLeft: "3px solid #ff2a4d", padding: "6px 10px", borderRadius: "0 4px 4px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
                          <span style={{ color: "#00f5ff", fontWeight: 800, fontFamily: "monospace" }}>CYCLE #{m.cycle}</span>
                          <span style={{ color: "#34d399", fontFamily: "monospace", fontWeight: 700 }}>{m.improvement}</span>
                        </div>
                        <div style={{ fontSize: 10.5, color: "#cbd5e1", marginTop: 2 }}>{m.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 11. NATURAL CONVERSATIONS MODAL */}
            {modalMode === "NATURAL_CONVERSATION" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", height: 260, overflowY: "auto", gap: 8 }}>
                  {naturalConvHistory.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "80%",
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: msg.sender === "user" ? "rgba(255,42,77,0.25)" : "rgba(0,245,255,0.12)",
                        border: `1px solid ${msg.sender === "user" ? "#ff2a4d" : "#00f5ff"}`,
                        color: "#fff",
                        fontSize: 12,
                        lineHeight: 1.4
                      }}>
                        <div style={{ fontSize: 9, color: msg.sender === "user" ? "#ff8da1" : "#38bdf8", fontFamily: "monospace", marginBottom: 2 }}>
                          {msg.sender === "user" ? "PETER PARKER" : "KAREN AI"}
                        </div>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {naturalConvLoading && (
                    <div style={{ fontSize: 10, color: "#00f5ff", fontFamily: "monospace" }}>
                      Karen neural cognition active...
                    </div>
                  )}
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!naturalConvInput.trim()) return;
                  const prompt = naturalConvInput;
                  setNaturalConvInput("");
                  handleTriggerCommand("NATURAL_CONVERSATION", prompt);
                }} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={naturalConvInput}
                    onChange={e => setNaturalConvInput(e.target.value)}
                    placeholder="Speak or type to Karen..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 6, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(0,245,255,0.3)", color: "#fff", fontSize: 12, outline: "none" }}
                  />
                  <button type="submit" style={{ padding: "8px 14px", borderRadius: 6, background: "rgba(0,245,255,0.2)", border: "1px solid #00f5ff", color: "#00f5ff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                    SEND
                  </button>
                </form>
              </div>
            )}

            {/* 13. CODE ASSISTANT MODAL */}
            {modalMode === "CODE_ASSISTANT" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!codeAssistantPrompt.trim()) return;
                  handleTriggerCommand("CODE_ASSISTANT", codeAssistantPrompt);
                }} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={codeAssistantPrompt}
                    onChange={e => setCodeAssistantPrompt(e.target.value)}
                    placeholder="Enter code optimization or synthesis directive..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 6, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(0,245,255,0.35)", color: "#fff", fontSize: 12, outline: "none" }}
                  />
                  <button type="submit" disabled={codeLoading} style={{ padding: "8px 14px", borderRadius: 6, background: "rgba(0,255,136,0.2)", border: "1px solid #00FF88", color: "#00FF88", fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Code size={13} /> {codeLoading ? "SYNTHESIZING..." : "OPTIMIZE"}
                  </button>
                </form>

                {codeAssistantResult && (
                  <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 6, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: "#38bdf8", fontFamily: "monospace" }}>SYNTHESIZED {codeAssistantResult.language?.toUpperCase() || "PYTHON"} MODULE</span>
                      <button onClick={() => navigator.clipboard.writeText(codeAssistantResult.code)} style={{ background: "none", border: "none", color: "#34d399", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Copy size={11} /> COPY
                      </button>
                    </div>
                    <pre style={{ margin: 0, padding: 8, background: "rgba(0,0,0,0.5)", borderRadius: 4, color: "#34d399", fontSize: 11, fontFamily: "monospace", overflowX: "auto", lineHeight: 1.4 }}>
                      {codeAssistantResult.code}
                    </pre>
                    <div style={{ fontSize: 10, color: "rgba(148,163,184,0.85)", marginTop: 6 }}>
                      ⚡ <strong>Analysis:</strong> {codeAssistantResult.analysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 14. SMART REMINDERS MODAL */}
            {modalMode === "SMART_REMINDERS" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Create Reminder Form */}
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newReminderTitle.trim()) return;
                  await createSmartReminder(newReminderTitle, newReminderTime, newReminderPriority);
                  setNewReminderTitle("");
                  await refreshReminders();
                  speakKaren(`Smart reminder created Peter: ${newReminderTitle}.`);
                }} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#00f5ff", fontFamily: "monospace" }}>
                    + CREATE SMART MISSION REMINDER
                  </div>
                  <input
                    type="text"
                    value={newReminderTitle}
                    onChange={e => setNewReminderTitle(e.target.value)}
                    placeholder="Reminder title (e.g. Queens Rooftop Patrol)..."
                    style={{ padding: "8px 10px", borderRadius: 4, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 11.5 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={newReminderTime}
                      onChange={e => setNewReminderTime(e.target.value)}
                      placeholder="Trigger time (e.g. Today at 6:00 PM)"
                      style={{ flex: 1, padding: "6px 10px", borderRadius: 4, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 11 }}
                    />
                    <select
                      value={newReminderPriority}
                      onChange={e => setNewReminderPriority(e.target.value)}
                      style={{ padding: "6px 8px", borderRadius: 4, background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.15)", color: "#00FF88", fontSize: 11, fontFamily: "monospace" }}
                    >
                      <option value="HIGH">HIGH PRIORITY</option>
                      <option value="MEDIUM">MEDIUM PRIORITY</option>
                      <option value="LOW">LOW PRIORITY</option>
                    </select>
                    <button type="submit" style={{ padding: "6px 12px", borderRadius: 4, background: "rgba(0,255,136,0.2)", border: "1px solid #00FF88", color: "#00FF88", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                      ADD
                    </button>
                  </div>
                </form>

                {/* Reminders List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {remindersList.map(r => (
                    <div key={r.id} style={{ background: "rgba(15,23,42,0.85)", border: `1px solid ${r.priority === "HIGH" ? "rgba(255,42,77,0.4)" : "rgba(0,245,255,0.25)"}`, borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <CheckCircle2 size={13} color="#00FF88" />
                          <strong style={{ fontSize: 12, color: "#fff" }}>{r.title}</strong>
                          <span style={{ fontSize: 8.5, padding: "1px 5px", borderRadius: 3, background: r.priority === "HIGH" ? "rgba(255,42,77,0.2)" : "rgba(0,245,255,0.2)", color: r.priority === "HIGH" ? "#ff2a4d" : "#00f5ff", fontFamily: "monospace" }}>
                            {r.priority}
                          </span>
                        </div>
                        <div style={{ fontSize: 9.5, color: "rgba(148,163,184,0.75)", fontFamily: "monospace", marginTop: 2 }}>
                          ⏰ {r.time_str}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => speakKaren(r.voice_alert || `Reminder: ${r.title}`)}
                          style={{ background: "rgba(0,245,255,0.15)", border: "1px solid #00f5ff", color: "#00f5ff", borderRadius: 4, padding: "4px 8px", fontSize: 9.5, cursor: "pointer" }}
                        >
                          🔊 SPEAK
                        </button>
                        <button
                          onClick={async () => {
                            await deleteSmartReminder(r.id);
                            await refreshReminders();
                          }}
                          style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", padding: 4 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
