import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Cpu, Bot, Wifi, Activity, ShieldCheck, Zap, Globe, Layers, Settings,
  Bell, ChevronRight, Laptop, Camera, Radio, Mic, HardDrive, RefreshCw,
  CheckCircle2, AlertCircle, Power, Bluetooth, Usb, Monitor, Volume2,
  Gamepad2, Battery, Network, Eye, Smartphone, Server, ChevronDown, X,
  Signal, Plug, Search, Info
} from "lucide-react";
import { http } from "../lib/api";
import { toast } from "../components/Toast";

// ─── Colour palette helpers ───────────────────────────────────────────────────
const STATUS_COLOR = {
  ACTIVE: "#00FF88", STREAMING: "#00FF88", CONNECTED: "#00FF88",
  SUCCESS: "#00FF88", PAIRED: "#38bdf8", EXECUTING: "#f59e0b",
  IDLE: "#64748b", DISCONNECTED: "#ef4444", ERROR: "#ef4444",
};
const statusColor = (s = "") => STATUS_COLOR[s.toUpperCase()] ?? "#94a3b8";

// ─── Icon map for device types detected by browser ────────────────────────────
const typeIcon = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("camera") || t.includes("videoinput")) return Camera;
  if (t.includes("audio") || t.includes("audioinput") || t.includes("mic")) return Volume2;
  if (t.includes("speaker") || t.includes("audiooutput")) return Volume2;
  if (t.includes("bluetooth")) return Bluetooth;
  if (t.includes("usb")) return Usb;
  if (t.includes("hid") || t.includes("keyboard") || t.includes("mouse")) return Monitor;
  if (t.includes("game") || t.includes("pad")) return Gamepad2;
  if (t.includes("serial") || t.includes("arduino") || t.includes("esp")) return Cpu;
  if (t.includes("network") || t.includes("wifi")) return Wifi;
  if (t.includes("battery")) return Battery;
  if (t.includes("sensor")) return Activity;
  return HardDrive;
};

// ─── Utility: enumerate real browser hardware ────────────────────────────────
async function enumerateRealDevices() {
  const devices = [];
  const warnings = [];

  // 1. Media Devices (cameras + microphones + speakers)
  try {
    const mediaDevs = await navigator.mediaDevices.enumerateDevices();
    mediaDevs.forEach((d) => {
      if (!d.deviceId || d.deviceId === "") return; // skip blank
      devices.push({
        id: `media-${d.deviceId.slice(0, 8)}`,
        name: d.label || `${d.kind === "videoinput" ? "Camera" : d.kind === "audioinput" ? "Microphone" : "Speaker"} (no label)`,
        type: d.kind === "videoinput" ? "Camera" : d.kind === "audioinput" ? "Microphone (Audio Input)" : "Speaker (Audio Output)",
        protocol: "MediaDevices API",
        source: "browser",
        status: "CONNECTED",
        details: `DeviceId: ${d.deviceId.slice(0, 16)}...`,
        group: d.groupId,
      });
    });
  } catch (e) {
    warnings.push("MediaDevices: " + e.message);
  }

  // 2. WebHID – Human Interface Devices (keyboards, mice, gamepads, controllers)
  if (navigator.hid) {
    try {
      const hidDevices = await navigator.hid.getDevices();
      hidDevices.forEach((d) => {
        devices.push({
          id: `hid-${d.vendorId}-${d.productId}`,
          name: d.productName || `HID Device (${d.vendorId.toString(16)}:${d.productId.toString(16)})`,
          type: "HID / Input Device",
          protocol: "WebHID API",
          source: "browser",
          status: d.opened ? "ACTIVE" : "CONNECTED",
          details: `VendorID: 0x${d.vendorId.toString(16).toUpperCase()}  ProductID: 0x${d.productId.toString(16).toUpperCase()}`,
        });
      });
    } catch (e) {
      warnings.push("WebHID: " + e.message);
    }
  }

  // 3. WebUSB – USB devices previously granted
  if (navigator.usb) {
    try {
      const usbDevices = await navigator.usb.getDevices();
      usbDevices.forEach((d) => {
        devices.push({
          id: `usb-${d.vendorId}-${d.productId}`,
          name: d.productName || `USB Device (${d.vendorId.toString(16)}:${d.productId.toString(16)})`,
          type: "USB Device",
          protocol: "WebUSB API",
          source: "browser",
          status: d.opened ? "ACTIVE" : "CONNECTED",
          details: `Serial: ${d.serialNumber || "N/A"} · Manufacturer: ${d.manufacturerName || "Unknown"}`,
        });
      });
    } catch (e) {
      warnings.push("WebUSB: " + e.message);
    }
  }

  // 4. Web Serial – COM/TTY ports (Arduino, ESP32 previously granted)
  if (navigator.serial) {
    try {
      const ports = await navigator.serial.getPorts();
      ports.forEach((p, i) => {
        const info = p.getInfo?.() ?? {};
        devices.push({
          id: `serial-${i}-${info.usbVendorId ?? "x"}-${info.usbProductId ?? "x"}`,
          name: `Serial Port ${i + 1} (Microcontroller / COM Device)`,
          type: "Serial / COM Port",
          protocol: "Web Serial API",
          source: "browser",
          status: "CONNECTED",
          details: `VendorID: 0x${(info.usbVendorId ?? 0).toString(16).toUpperCase()}  ProductID: 0x${(info.usbProductId ?? 0).toString(16).toUpperCase()}`,
        });
      });
    } catch (e) {
      warnings.push("Web Serial: " + e.message);
    }
  }

  // 5. Web Bluetooth – BLE devices previously paired
  if (navigator.bluetooth) {
    try {
      const btDevices = await navigator.bluetooth.getDevices();
      for (const d of btDevices) {
        devices.push({
          id: `ble-${d.id}`,
          name: d.name || `BLE Device (${d.id.slice(0, 8)})`,
          type: "Bluetooth (BLE)",
          protocol: "Web Bluetooth API",
          source: "browser",
          status: d.gatt?.connected ? "ACTIVE" : "PAIRED",
          details: `GATT: ${d.gatt?.connected ? "Connected" : "Known / Not Connected"}`,
        });
      }
    } catch (e) {
      warnings.push("Web Bluetooth: " + e.message);
    }
  }

  // 6. Gamepad API
  try {
    const gamepads = Array.from(navigator.getGamepads?.() ?? []).filter(Boolean);
    gamepads.forEach((gp) => {
      devices.push({
        id: `gp-${gp.index}`,
        name: gp.id || `Gamepad ${gp.index}`,
        type: "Gamepad / Controller",
        protocol: "Gamepad API",
        source: "browser",
        status: gp.connected ? "ACTIVE" : "DISCONNECTED",
        details: `Axes: ${gp.axes.length} · Buttons: ${gp.buttons.length} · Mapping: ${gp.mapping}`,
      });
    });
  } catch (e) {
    warnings.push("Gamepad: " + e.message);
  }

  return { devices, warnings };
}

// ─── Battery info helper ──────────────────────────────────────────────────────
async function getBatteryInfo() {
  try {
    if (!navigator.getBattery) return null;
    const b = await navigator.getBattery();
    return {
      level: Math.round(b.level * 100),
      charging: b.charging,
      chargingTime: b.chargingTime,
      dischargingTime: b.dischargingTime,
    };
  } catch { return null; }
}

// ─── Network info helper ──────────────────────────────────────────────────────
function getNetworkInfo() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return null;
  return {
    type: c.effectiveType || c.type || "unknown",
    downlink: c.downlink,
    rtt: c.rtt,
    saveData: c.saveData,
  };
}

// ─── Pulsing dot component ────────────────────────────────────────────────────
const Dot = ({ color = "#00FF88", pulse = false }) => (
  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, animation: pulse ? "pulse 1.5s infinite" : "none" }} />
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, accent = "#00FF88", right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon style={{ width: 16, height: 16, color: accent }} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 8.5, color: "#64748b", fontFamily: "monospace", marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
    {right}
  </div>
);

// ─── Device card ─────────────────────────────────────────────────────────────
const DeviceCard = ({ dev, onRequest }) => {
  const Icon = typeIcon(dev.type);
  const sc = statusColor(dev.status);
  return (
    <div style={{ background: "rgba(15,23,42,0.9)", border: `1px solid ${sc}25`, borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5, transition: "border-color 0.2s", cursor: "default" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = sc + "60"}
      onMouseLeave={e => e.currentTarget.style.borderColor = sc + "25"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          <Icon style={{ width: 14, height: 14, color: sc, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dev.name}</span>
        </div>
        <span style={{ fontSize: 7, fontWeight: 900, color: sc, background: sc + "18", padding: "2px 6px", borderRadius: 4, flexShrink: 0, fontFamily: "monospace" }}>{dev.status}</span>
      </div>
      <div style={{ fontSize: 8, color: "#38bdf8", fontFamily: "monospace" }}>{dev.type} · {dev.protocol}</div>
      <div style={{ fontSize: 7.5, color: "#64748b" }}>{dev.details}</div>
      {dev.agent && <div style={{ fontSize: 7.5, color: "#a855f7", fontFamily: "monospace" }}>🤖 {dev.agent}</div>}
      {onRequest && (
        <button onClick={() => onRequest(dev)} style={{ marginTop: 2, padding: "3px 8px", borderRadius: 5, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: "#38bdf8", fontSize: 7.5, fontWeight: 700, cursor: "pointer", textAlign: "center" }}>
          REQUEST ACCESS
        </button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoboticsIoTStudio() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [telemetry, setTelemetry] = useState(null);
  const [iotDevices, setIotDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real browser-detected hardware
  const [browserDevices, setBrowserDevices] = useState([]);
  const [scanWarnings, setScanWarnings] = useState([]);
  const [scanning, setScanning] = useState(false);

  // System info
  const [battery, setBattery] = useState(null);
  const [network, setNetwork] = useState(null);
  const [userAgent] = useState(navigator.userAgent);

  // Request flows
  const [requestModal, setRequestModal] = useState(null); // 'usb'|'serial'|'bluetooth'|'hid'
  const [requestedDevice, setRequestedDevice] = useState(null);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("ALL");

  // Refresh timer
  const scanInterval = useRef(null);

  // ── fetch backend IoT telemetry ─────────────────────────────────────────
  const fetchTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      const [tel, devs] = await Promise.all([
        http.get("/iot/telemetry"),
        http.get("/iot/devices"),
      ]);
      if (tel.data?.status === "success") setTelemetry(tel.data);
      if (devs.data) setIotDevices(devs.data);
    } catch {
      // backend offline – keep statics
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Scan real browser hardware ──────────────────────────────────────────
  const scanBrowserDevices = useCallback(async () => {
    setScanning(true);
    const { devices, warnings } = await enumerateRealDevices();
    setBrowserDevices(devices);
    setScanWarnings(warnings);
    const batt = await getBatteryInfo();
    setBattery(batt);
    setNetwork(getNetworkInfo());
    setScanning(false);
    if (devices.length === 0) {
      toast.info("No devices granted yet. Click REQUEST ACCESS to pair new devices.");
    } else {
      toast.success(`Found ${devices.length} device(s) connected to this browser session.`);
    }
  }, []);

  // ── Request permission for specific hardware APIs ───────────────────────
  const requestUsbDevice = async () => {
    if (!navigator.usb) { toast.error("WebUSB not supported in this browser."); return; }
    try {
      const dev = await navigator.usb.requestDevice({ filters: [] });
      toast.success(`USB device paired: ${dev.productName || "Unknown"}`);
      scanBrowserDevices();
    } catch (e) {
      if (!e.message.includes("No device")) toast.error("USB pairing cancelled or denied.");
    }
  };

  const requestSerialPort = async () => {
    if (!navigator.serial) { toast.error("Web Serial not supported. Use Chrome/Edge."); return; }
    try {
      await navigator.serial.requestPort({ filters: [] });
      toast.success("Serial port granted!");
      scanBrowserDevices();
    } catch (e) {
      if (!e.message.includes("No port")) toast.error("Serial port access denied.");
    }
  };

  const requestBleDevice = async () => {
    if (!navigator.bluetooth) { toast.error("Web Bluetooth not supported in this browser."); return; }
    try {
      const dev = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "device_information"],
      });
      toast.success(`Bluetooth device paired: ${dev.name || dev.id}`);
      scanBrowserDevices();
    } catch (e) {
      if (!e.message.includes("cancelled")) toast.error("Bluetooth pairing cancelled.");
    }
  };

  const requestHidDevice = async () => {
    if (!navigator.hid) { toast.error("WebHID not supported in this browser."); return; }
    try {
      const devs = await navigator.hid.requestDevice({ filters: [] });
      toast.success(`HID device(s) paired: ${devs.length}`);
      scanBrowserDevices();
    } catch (e) {
      toast.error("HID access denied.");
    }
  };

  const requestMediaCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(t => t.stop()); // release immediately
      toast.success("Camera & Microphone access granted — scanning...");
      scanBrowserDevices();
    } catch (e) {
      toast.error("Camera/Microphone access denied.");
    }
  };

  useEffect(() => {
    fetchTelemetry();
    scanBrowserDevices();
    scanInterval.current = setInterval(scanBrowserDevices, 30000); // auto re-scan every 30s
    return () => clearInterval(scanInterval.current);
  }, [fetchTelemetry, scanBrowserDevices]);

  // Gamepad hotplug
  useEffect(() => {
    const onGP = () => scanBrowserDevices();
    window.addEventListener("gamepadconnected", onGP);
    window.addEventListener("gamepaddisconnected", onGP);
    return () => {
      window.removeEventListener("gamepadconnected", onGP);
      window.removeEventListener("gamepaddisconnected", onGP);
    };
  }, [scanBrowserDevices]);

  // ── Derived data ────────────────────────────────────────────────────────
  const kpis = telemetry?.kpis ?? {
    connected_devices: browserDevices.length + (iotDevices.length),
    connected_devices_growth: "↗ Live browser + AI data",
    active_robots: iotDevices.filter(d => d.status === "ACTIVE" || d.status === "EXECUTING").length,
    active_robots_growth: "↗ Real-time",
    iot_sensors: browserDevices.length,
    iot_sensors_growth: "↗ Browser-detected",
    automation_tasks: "192",
    automation_tasks_growth: "↗ 23.1% from last week",
  };

  const agentActivity = telemetry?.agent_iot_activity ?? [];
  const netTop = telemetry?.network_topology ?? {};
  const sysInfo = telemetry?.system_info ?? {};

  // Combined device list for the "All Devices" view
  const allDevices = [
    ...browserDevices.map(d => ({ ...d, _src: "browser" })),
    ...iotDevices.map(d => ({ ...d, source: "agent", _src: "agent", details: `Protocol: ${d.protocol} · Firmware: ${d.firmware}` })),
  ];

  const filteredDevices = allDevices.filter(d => {
    const matchSearch = !deviceSearch || d.name.toLowerCase().includes(deviceSearch.toLowerCase()) || d.type.toLowerCase().includes(deviceSearch.toLowerCase());
    const matchAgent = agentFilter === "ALL" || (agentFilter === "BROWSER" && d._src === "browser") || (agentFilter === "AGENT" && d._src === "agent");
    return matchSearch && matchAgent;
  });

  const NAV_ITEMS = [
    { label: "Overview",    icon: Activity },
    { label: "All Devices", icon: HardDrive },
    { label: "Robotics",    icon: Bot },
    { label: "IoT Devices", icon: Wifi },
    { label: "Sensors",     icon: Cpu },
    { label: "Automation",  icon: Zap },
    { label: "Digital Twin",icon: Globe },
    { label: "Edge AI",     icon: ShieldCheck },
    { label: "Settings",    icon: Settings },
  ];

  return (
    <div style={{ background: "#030612", minHeight: "100vh", color: "#f8fafc", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column", padding: 16, gap: 16 }}>

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0284c7, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(6,182,212,0.6)" }}>
              <Bot style={{ width: 22, height: 22, color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "0.02em", color: "#fff" }}>ROBOTICS &amp; IoT</h1>
              <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, fontFamily: "monospace" }}>Intelligent Machines. Connected World. Real Hardware.</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", maxWidth: 480, marginTop: 6, lineHeight: 1.4 }}>
            Live hardware detection via WebUSB, Web Serial, WebHID, Web Bluetooth &amp; MediaDevices APIs — combined with 36 AI agent IoT telemetry.
          </p>
        </div>

        {/* KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, flex: 1, maxWidth: 640 }}>
          {[
            { label: "BROWSER DEVICES",  value: browserDevices.length,              sub: scanning ? "Scanning..." : "Live detected",      color: "#00FF88" },
            { label: "AI AGENT DEVICES", value: iotDevices.length,                  sub: "Agent-managed",                                  color: "#38bdf8" },
            { label: "IoT SENSORS",      value: kpis.iot_sensors,                   sub: kpis.iot_sensors_growth,                          color: "#a855f7" },
            { label: "AUTOMATION TASKS", value: kpis.automation_tasks,              sub: kpis.automation_tasks_growth,                     color: "#f59e0b" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} style={{ background: "rgba(10,16,35,0.9)", border: `1px solid ${color}20`, borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, color: "#64748b", fontFamily: "monospace" }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 2 }}>{value}</div>
              <div style={{ fontSize: 8, color, fontFamily: "monospace", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Status + Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 9, fontFamily: "monospace", color: "#00FF88", fontWeight: 800 }}>
            <Dot pulse color="#00FF88" />
            {scanning ? "SCANNING..." : "HARDWARE LIVE"}
          </div>
          <button onClick={() => { fetchTelemetry(); scanBrowserDevices(); }}
            style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "#38bdf8", fontSize: 9, fontWeight: 800, fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <RefreshCw style={{ width: 12, height: 12 }} />
            {loading ? "Loading..." : "Rescan All"}
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 14, flex: 1 }}>

        {/* LEFT SIDEBAR NAV */}
        <div style={{ background: "rgba(8,12,28,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isAct = item.label === activeTab;
            return (
              <div key={item.label} onClick={() => setActiveTab(item.label)}
                style={{ padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: isAct ? 800 : 500, color: isAct ? "#fff" : "#94a3b8", background: isAct ? "linear-gradient(90deg, #0284c7 0%, #06b6d4 100%)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s ease" }}>
                <Icon style={{ width: 14, height: 14, color: isAct ? "#fff" : "#64748b" }} />
                <span>{item.label}</span>
              </div>
            );
          })}

          {/* Battery widget in sidebar */}
          {battery && (
            <div style={{ marginTop: "auto", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <Battery style={{ width: 14, height: 14, color: "#00FF88" }} />
                <div style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>BATTERY</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ width: `${battery.level}%`, height: "100%", background: battery.level > 20 ? "#00FF88" : "#ef4444", borderRadius: 4, transition: "width 0.5s" }} />
              </div>
              <div style={{ fontSize: 8, color: "#64748b", marginTop: 4, fontFamily: "monospace" }}>
                {battery.level}% · {battery.charging ? "⚡ Charging" : "🔋 Discharging"}
              </div>
            </div>
          )}

          {/* Network widget */}
          {network && (
            <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 10, padding: 10, marginTop: battery ? 8 : "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <Signal style={{ width: 14, height: 14, color: "#38bdf8" }} />
                <div style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>NETWORK</div>
              </div>
              <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace", lineHeight: 1.5 }}>
                Type: {network.type.toUpperCase()}<br />
                DL: {network.downlink ?? "?"}Mbps · RTT: {network.rtt ?? "?"}ms
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── REQUEST HARDWARE ACCESS STRIP ──────────────────────────────── */}
          <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 14, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8", marginBottom: 8, letterSpacing: "0.06em" }}>
              ⚡ CONNECT EXTERNAL HARDWARE
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "📷 Camera / Mic",    action: requestMediaCamera,  color: "#a855f7" },
                { label: "🔌 USB Device",      action: requestUsbDevice,    color: "#38bdf8" },
                { label: "🔗 Serial / COM",    action: requestSerialPort,   color: "#00FF88" },
                { label: "📡 Bluetooth BLE",   action: requestBleDevice,    color: "#06b6d4" },
                { label: "🕹️ HID Device",      action: requestHidDevice,    color: "#f59e0b" },
              ].map(({ label, action, color }) => (
                <button key={label} onClick={action}
                  style={{ padding: "6px 14px", borderRadius: 20, background: `${color}15`, border: `1px solid ${color}40`, color, fontSize: 9.5, fontWeight: 800, cursor: "pointer", fontFamily: "monospace", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}30`; e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.borderColor = `${color}40`; }}
                >
                  {label}
                </button>
              ))}
              <div style={{ fontSize: 8.5, color: "#64748b", alignSelf: "center", marginLeft: 4, fontFamily: "monospace" }}>
                Click to pair · Chrome/Edge required for USB/Serial/BLE/HID
              </div>
            </div>
          </div>

          {/* ── BROWSER DETECTED DEVICES ────────────────────────────────────── */}
          <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 16, padding: 16, boxShadow: "0 0 30px rgba(0,255,136,0.08)" }}>
            <SectionHeader
              icon={Laptop}
              title="BROWSER-DETECTED HARDWARE"
              subtitle={`Host: ${navigator.platform} · ${scanning ? "Scanning..." : `${browserDevices.length} device(s) detected`}`}
              accent="#00FF88"
              right={
                <button onClick={scanBrowserDevices}
                  style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88", fontSize: 8.5, fontWeight: 800, fontFamily: "monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <RefreshCw style={{ width: 11, height: 11, animation: scanning ? "spin 1s linear infinite" : "none" }} />
                  {scanning ? "Scanning..." : "Rescan"}
                </button>
              }
            />

            {browserDevices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#64748b" }}>
                <Plug style={{ width: 32, height: 32, margin: "0 auto 8px", color: "#334155" }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>No hardware detected yet</div>
                <div style={{ fontSize: 10, marginTop: 4 }}>
                  Click <strong style={{ color: "#38bdf8" }}>Camera/Mic</strong>, <strong style={{ color: "#38bdf8" }}>USB</strong>, <strong style={{ color: "#38bdf8" }}>Serial</strong>, <strong style={{ color: "#38bdf8" }}>Bluetooth</strong> or <strong style={{ color: "#38bdf8" }}>HID</strong> above to pair devices.
                </div>
                <div style={{ fontSize: 9, marginTop: 8, color: "#334155", fontFamily: "monospace" }}>
                  Already paired devices will appear automatically on page load.
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {browserDevices.map(dev => <DeviceCard key={dev.id} dev={dev} />)}
              </div>
            )}

            {scanWarnings.length > 0 && (
              <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, fontSize: 8, fontFamily: "monospace", color: "#f59e0b" }}>
                ⚠ API Limitations: {scanWarnings.join(" | ")}
              </div>
            )}
          </div>

          {/* ── AI AGENT DEVICE REGISTRY ─────────────────────────────────────── */}
          <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 16, padding: 16, boxShadow: "0 0 30px rgba(168,85,247,0.08)" }}>
            <SectionHeader
              icon={Bot}
              title="AI AGENT IoT DEVICE REGISTRY"
              subtitle={`${iotDevices.length} devices managed by 36 autonomous agents`}
              accent="#a855f7"
              right={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ position: "relative" }}>
                    <Search style={{ width: 11, height: 11, color: "#64748b", position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      value={deviceSearch}
                      onChange={e => setDeviceSearch(e.target.value)}
                      placeholder="Search devices..."
                      style={{ paddingLeft: 24, paddingRight: 8, paddingTop: 5, paddingBottom: 5, borderRadius: 8, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 9.5, width: 140, outline: "none", fontFamily: "monospace" }}
                    />
                  </div>
                </div>
              }
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {iotDevices
                .filter(d => !deviceSearch || d.name.toLowerCase().includes(deviceSearch.toLowerCase()))
                .map(dev => <DeviceCard key={dev.id} dev={{ ...dev, details: `Protocol: ${dev.protocol} · Firmware: ${dev.firmware}` }} />)
              }
            </div>
          </div>

          {/* ── AGENT IoT ACTIVITY FEED + NETWORK TOPOLOGY ──────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Activity Feed */}
            <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 16, padding: 16 }}>
              <SectionHeader icon={Activity} title="AGENT IoT ACTIVITY" subtitle="Live hardware actions by AI agents" accent="#38bdf8" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {agentActivity.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 10px", borderRadius: 8, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <Dot pulse color={statusColor(a.status)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, color: "#fff" }}>{a.agent}</div>
                      <div style={{ fontSize: 8, color: "#64748b", fontFamily: "monospace" }}>{a.action} · {a.device}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: 7.5, color: statusColor(a.status), fontFamily: "monospace", fontWeight: 800 }}>{a.status}</span>
                      <span style={{ fontSize: 7, color: "#475569", fontFamily: "monospace" }}>{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Topology + System Info */}
            <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 16, padding: 16 }}>
              <SectionHeader icon={Network} title="NETWORK &amp; SYSTEM INFO" subtitle="Live connection topology" accent="#06b6d4" />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Network Topology */}
                {Object.keys(netTop).length > 0 && (
                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: "#06b6d4", marginBottom: 6, fontFamily: "monospace" }}>NETWORK TOPOLOGY</div>
                    {[
                      ["Wi-Fi SSID",   netTop.wifi_ssid],
                      ["Standard",     netTop.wifi_standard],
                      ["Band",         netTop.wifi_band],
                      ["Bluetooth",    netTop.bluetooth_version],
                      ["Local IP",     netTop.local_ip],
                      ["Endpoints",    netTop.connected_endpoints],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, fontFamily: "monospace", marginBottom: 3 }}>
                        <span style={{ color: "#64748b" }}>{k}</span>
                        <span style={{ color: "#fff" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Browser Network */}
                {network && (
                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: "#38bdf8", marginBottom: 6, fontFamily: "monospace" }}>BROWSER NETWORK (LIVE)</div>
                    {[
                      ["Effective Type", network.type?.toUpperCase()],
                      ["Downlink",       network.downlink ? `${network.downlink} Mbps` : "N/A"],
                      ["RTT Latency",    network.rtt ? `${network.rtt} ms` : "N/A"],
                      ["Data Saver",     network.saveData ? "ON" : "OFF"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, fontFamily: "monospace", marginBottom: 3 }}>
                        <span style={{ color: "#64748b" }}>{k}</span>
                        <span style={{ color: v === "ON" ? "#f59e0b" : "#fff" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI System Info */}
                {Object.keys(sysInfo).length > 0 && (
                  <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: "#a855f7", marginBottom: 6, fontFamily: "monospace" }}>AI SYSTEM</div>
                    {[
                      ["Host",       sysInfo.host],
                      ["OS",         sysInfo.os],
                      ["Kernel",     sysInfo.kernel],
                      ["Agents",     sysInfo.agent_count],
                      ["Uptime",     `${sysInfo.uptime_hours}h`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, fontFamily: "monospace", marginBottom: 3 }}>
                        <span style={{ color: "#64748b" }}>{k}</span>
                        <span style={{ color: "#fff" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── FOOTER FEATURES STRIP ─────────────────────────────────────────────── */}
      <div style={{ background: "rgba(10,16,35,0.95)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 16, padding: 14, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, textAlign: "center" }}>
        {[
          { icon: Usb,        label: "WebUSB",         sub: "Pair USB devices",               color: "#38bdf8" },
          { icon: Radio,      label: "Web Bluetooth",  sub: "BLE IoT sensors",                color: "#a855f7" },
          { icon: Cpu,        label: "Web Serial",     sub: "Arduino / ESP32 / COM",          color: "#00FF88" },
          { icon: Monitor,    label: "WebHID",         sub: "Keyboards, mice, controllers",   color: "#f59e0b" },
          { icon: Camera,     label: "MediaDevices",   sub: "Cameras & microphones",          color: "#ec4899" },
          { icon: Gamepad2,   label: "Gamepad API",    sub: "Game controllers",               color: "#06b6d4" },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Icon style={{ width: 18, height: 18, color }} />
            <div style={{ fontSize: 9.5, fontWeight: 900, color: "#fff" }}>{label}</div>
            <div style={{ fontSize: 7.5, color: "#64748b" }}>{sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
