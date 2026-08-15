'use client';

import React from 'react';

interface Props { projects: any[]; }

const DEMO_PROJECTS = [
  { name: 'SmartShop SaaS', status: 'in_progress', completion: 73.6 },
  { name: 'Nexus CRM', status: 'deployed', completion: 100 },
  { name: 'Guide Robot OS', status: 'testing', completion: 85 },
  { name: 'IoT Dashboard', status: 'planning', completion: 15 },
  { name: 'Marketing Bot', status: 'in_progress', completion: 62 },
];

const STATUS_COLORS: Record<string, string> = {
  in_progress: 'var(--accent-blue)', testing: 'var(--accent-orange)',
  deployed: 'var(--accent-green)', planning: 'var(--text-secondary)',
};

export default function ProjectsOverview({ projects }: Props) {
  const items = projects.length > 0 ? projects : DEMO_PROJECTS;
  const totalCompletion = items.reduce((s, p) => s + (p.completion || 0), 0) / items.length;

  const segments = [
    { label: 'In Progress', pct: 38, color: '#3b82f6' },
    { label: 'Testing', pct: 19, color: '#f59e0b' },
    { label: 'Deployment', pct: 13, color: '#06b6d4' },
    { label: 'Completed', pct: 21, color: '#10b981' },
    { label: 'Planning', pct: 9, color: '#64748b' },
  ];

  return (
    <div className="card">
      <div className="card-header">Projects Overview ({items.length})</div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Donut chart */}
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {segments.reduce((acc, seg) => {
              const offset = acc.offset;
              acc.offset += seg.pct;
              acc.elements.push(
                <circle key={seg.label} cx="18" cy="18" r="15.9" fill="none"
                  stroke={seg.color} strokeWidth="3"
                  strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                  strokeDashoffset={`${100 - offset}`}
                />
              );
              return acc;
            }, { offset: 0, elements: [] as JSX.Element[] }).elements}
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', fontSize: '14px', fontWeight: 700,
          }}>
            {totalCompletion.toFixed(1)}%
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {segments.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{s.label}</span>
              <span style={{ fontWeight: 600 }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px' }}>
        {items.slice(0, 3).map(p => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span>{p.name}</span>
            <span style={{ color: STATUS_COLORS[p.status] || 'var(--text-secondary)' }}>{p.completion || 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
