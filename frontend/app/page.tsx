'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import MasterBrain from '@/components/MasterBrain';
import ActivityStream from '@/components/ActivityStream';
import ProjectsOverview from '@/components/ProjectsOverview';
import RevenueChart from '@/components/RevenueChart';
import AgentTopology from '@/components/AgentTopology';
import CodeStudio from '@/components/CodeStudio';
import AIAssistant from '@/components/AIAssistant';
import ApprovalCenter from '@/components/ApprovalCenter';
import SystemAlerts from '@/components/SystemAlerts';
import WorldMap from '@/components/WorldMap';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [masterStatus, setMasterStatus] = useState('online');

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, actRes, apprRes, projRes, revRes] = await Promise.all([
        fetch(`${API}/api/v1/status`).then(r => r.json()).catch(() => null),
        fetch(`${API}/api/v1/activity`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/v1/approvals`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/v1/projects`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/v1/business/revenue`).then(r => r.json()).catch(() => null),
      ]);
      if (statusRes) { setMetrics(statusRes.metrics); setMasterStatus(statusRes.status); }
      setActivities(actRes);
      setApprovals(apprRes);
      setProjects(projRes);
      setRevenue(revRes);
    } catch { /* backend may not be running yet */ }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCommand = async (command: string) => {
    try {
      await fetch(`${API}/api/v1/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      fetchData();
    } catch { /* silent */ }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onCommand={handleCommand} masterStatus={masterStatus} />
        <StatsBar metrics={metrics} revenue={revenue} />
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'auto' }}>
          {/* Row 1: Brain + Activity + Map */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', minHeight: '320px' }}>
            <MasterBrain metrics={metrics} />
            <ActivityStream activities={activities} />
            <WorldMap />
          </div>
          {/* Row 2: Projects + Revenue + Topology */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', minHeight: '240px' }}>
            <ProjectsOverview projects={projects} />
            <RevenueChart revenue={revenue} />
            <AgentTopology metrics={metrics} />
          </div>
          {/* Row 3: Code Studio + Assistant + Approvals + Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', minHeight: '280px' }}>
            <CodeStudio />
            <AIAssistant onCommand={handleCommand} />
            <ApprovalCenter approvals={approvals} onRefresh={fetchData} />
            <SystemAlerts />
          </div>
        </div>
        <Footer metrics={metrics} />
      </div>
    </div>
  );
}
