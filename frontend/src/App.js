import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Shell from "./components/Shell";
import { ToastProvider } from "./components/Toast";
import { SecurityProvider } from "./lib/SecurityContext";
import { VoiceProvider } from "./lib/VoiceContext";
import CommandCenter from "./pages/CommandCenter";
import MasterBrainView from "./pages/MasterBrainView";
import ChatHub from "./pages/ChatHub";
import AgentsHub from "./pages/AgentsHub";
import MemoryCenter from "./pages/MemoryCenter";
import KnowledgeBase from "./pages/KnowledgeBase";
import CodeAssistant from "./pages/CodeAssistant";
import TerminalConsole from "./pages/TerminalConsole";
import BrowserConsole from "./pages/BrowserConsole";
import TaskManager from "./pages/TaskManager";
import ProjectsHub from "./pages/ProjectsHub";
import SystemMonitor from "./pages/SystemMonitor";
import Settings from "./pages/Settings";
import BiometricSecurity from "./pages/BiometricSecurity";
import CameraConsole from "./pages/CameraConsole";
import ParticlePlayground from "./pages/ParticlePlayground";
import AnimationStudio from "./pages/AnimationStudio";
import HandParticleStudio from "./pages/HandParticleStudio";
import MockAuth from "./pages/MockAuth";

import CreativeStudio from "./pages/CreativeStudio";
import ImageGenerator from "./pages/ImageGenerator";
import LiveAppViewer from "./pages/LiveAppViewer";
import DataAnalystStudio from "./pages/DataAnalystStudio";
import StockMarketStudio from "./pages/StockMarketStudio";
import BusinessIntelligence from "./pages/BusinessIntelligence";
import RevenueHub from "./pages/RevenueHub";
import RoboticsIoTStudio from "./pages/RoboticsIoTStudio";
import MarketingSuite from "./pages/MarketingSuite";
import FinanceOS from "./pages/FinanceOS";
import LegalCompliance from "./pages/LegalCompliance";
import SpiderManAI from "./pages/SpiderManAI";

function App() {
  return (
    <ToastProvider>
      <SecurityProvider>
        <div className="nx-grid-bg min-h-screen text-white">
          <BrowserRouter>
            <VoiceProvider>
              <Shell>
                <Routes>
                  <Route path="/"          element={<MasterBrainView />} />
                  <Route path="/brain"     element={<MasterBrainView />} />
                  <Route path="/cmd"       element={<CommandCenter />} />
                  <Route path="/chat"      element={<ChatHub />} />
                  <Route path="/marketing" element={<MarketingSuite />} />
                  <Route path="/marketing-suite" element={<MarketingSuite />} />
                  <Route path="/finance"   element={<FinanceOS />} />
                  <Route path="/finance-os"element={<FinanceOS />} />
                  <Route path="/legal"     element={<LegalCompliance />} />
                  <Route path="/compliance"element={<LegalCompliance />} />
                  <Route path="/legal-compliance" element={<LegalCompliance />} />
                  <Route path="/agents"    element={<AgentsHub />} />
                  <Route path="/memory"    element={<MemoryCenter />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/code"      element={<CodeAssistant />} />
                  <Route path="/studio"    element={<CodeAssistant />} />
                  <Route path="/data"      element={<DataAnalystStudio />} />
                  <Route path="/data-analyst" element={<DataAnalystStudio />} />
                  <Route path="/stocks"    element={<StockMarketStudio />} />
                  <Route path="/stock-market" element={<StockMarketStudio />} />
                  <Route path="/business"  element={<BusinessIntelligence />} />
                  <Route path="/bi"        element={<BusinessIntelligence />} />
                  <Route path="/revenue"   element={<RevenueHub />} />
                  <Route path="/revenue-hub" element={<RevenueHub />} />
                  <Route path="/iot"       element={<RoboticsIoTStudio />} />
                  <Route path="/robotics"  element={<RoboticsIoTStudio />} />
                  <Route path="/terminal"  element={<TerminalConsole />} />
                  <Route path="/browser"   element={<BrowserConsole />} />
                  <Route path="/projects"  element={<ProjectsHub />} />
                  <Route path="/creative"  element={<CreativeStudio />} />
                  <Route path="/image-gen" element={<ImageGenerator />} />
                  <Route path="/live/:slug" element={<LiveAppViewer />} />
                  <Route path="/live-app/:projectId" element={<LiveAppViewer />} />
                  <Route path="/deployed/:slug" element={<LiveAppViewer />} />
                  <Route path="/deployed/:slug/*" element={<LiveAppViewer />} />
                  <Route path="/tasks"     element={<TaskManager />} />
                  <Route path="/monitor"   element={<FinanceOS />} />
                  <Route path="/settings"  element={<Settings />} />
                  <Route path="/biometrics"element={<LegalCompliance />} />
                  <Route path="/camera"    element={<CameraConsole />} />
                  <Route path="/particles" element={<ParticlePlayground />} />
                  <Route path="/animate"   element={<CreativeStudio />} />
                  <Route path="/handanim"  element={<HandParticleStudio />} />
                  <Route path="/spiderman" element={<SpiderManAI />} />
                  <Route path="/spiderman-ai" element={<SpiderManAI />} />
                  <Route path="/spider-nexus" element={<SpiderManAI />} />
                  <Route path="/auth/mock/:provider" element={<MockAuth />} />
                  <Route path="*"          element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            </VoiceProvider>
          </BrowserRouter>
        </div>
      </SecurityProvider>
    </ToastProvider>
  );
}

export default App;
