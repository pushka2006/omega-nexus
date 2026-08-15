'use client';

interface Props { metrics: any; }

export default function AgentTopology({ metrics }: Props) {
  const coreAgents = 18;
  const activeAgents = metrics?.total_agents || 1842;
  const subAgents = 3256;

  const nodes = Array.from({ length: 30 }).map((_, i) => ({
    x: 20 + Math.random() * 260,
    y: 20 + Math.random() * 140,
    r: i < 5 ? 6 : i < 12 ? 4 : 2.5,
    color: i < 5 ? '#3b82f6' : i < 12 ? '#8b5cf6' : '#06b6d4',
    opacity: i < 5 ? 1 : i < 12 ? 0.8 : 0.5,
  }));

  return (
    <div className="card">
      <div className="card-header">Agent Network Topology</div>
      <svg viewBox="0 0 300 180" style={{ width: '100%', height: '140px' }}>
        {nodes.map((n, i) => nodes.slice(i + 1, i + 3).map((target, j) => (
          <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={target.x} y2={target.y}
            stroke="rgba(59,130,246,0.1)" strokeWidth="0.5" />
        )))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={n.opacity}>
            {i < 5 && <animate attributeName="opacity" values="1;0.6;1" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />}
          </circle>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', marginTop: '4px' }}>
        <div><span style={{ color: '#3b82f6' }}>●</span> Core Agents: <strong>{coreAgents}</strong></div>
        <div><span style={{ color: '#8b5cf6' }}>●</span> Active: <strong>{activeAgents.toLocaleString()}</strong></div>
        <div><span style={{ color: '#06b6d4' }}>●</span> Sub-Agents: <strong>{subAgents.toLocaleString()}</strong></div>
      </div>
    </div>
  );
}
