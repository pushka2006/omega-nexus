'use client';

export default function WorldMap() {
  const regions = [
    { name: 'US East', x: 25, y: 35, active: true },
    { name: 'US West', x: 15, y: 38, active: true },
    { name: 'EU West', x: 48, y: 30, active: true },
    { name: 'EU Central', x: 52, y: 28, active: true },
    { name: 'Asia Pacific', x: 75, y: 42, active: true },
    { name: 'India', x: 68, y: 45, active: true },
    { name: 'Japan', x: 82, y: 35, active: true },
    { name: 'Australia', x: 82, y: 65, active: true },
    { name: 'Brazil', x: 32, y: 58, active: false },
    { name: 'South Africa', x: 55, y: 62, active: false },
  ];

  return (
    <div className="card">
      <div className="card-header">Live World Map</div>
      <div style={{ position: 'relative', height: '180px', background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.05), transparent)', borderRadius: '8px' }}>
        <svg viewBox="0 0 100 70" style={{ width: '100%', height: '100%' }}>
          {/* Simplified continent outlines */}
          <ellipse cx="22" cy="36" rx="14" ry="10" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" strokeWidth="0.3" />
          <ellipse cx="50" cy="32" rx="12" ry="8" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="0.3" />
          <ellipse cx="75" cy="40" rx="16" ry="12" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.2)" strokeWidth="0.3" />
          <ellipse cx="33" cy="58" rx="8" ry="10" fill="rgba(59,130,246,0.05)" stroke="rgba(59,130,246,0.15)" strokeWidth="0.3" />
          <ellipse cx="82" cy="63" rx="7" ry="5" fill="rgba(59,130,246,0.05)" stroke="rgba(59,130,246,0.15)" strokeWidth="0.3" />

          {/* Connection lines */}
          {regions.filter(r => r.active).map((r, i, arr) =>
            arr.slice(i + 1, i + 3).map(target => (
              <line key={`${r.name}-${target.name}`}
                x1={r.x} y1={r.y} x2={target.x} y2={target.y}
                stroke="rgba(59,130,246,0.15)" strokeWidth="0.2" strokeDasharray="1 1"
              />
            ))
          )}

          {/* Region dots */}
          {regions.map(r => (
            <g key={r.name}>
              <circle cx={r.x} cy={r.y} r={r.active ? 1.2 : 0.6}
                fill={r.active ? '#3b82f6' : '#475569'} opacity={r.active ? 1 : 0.5}
              />
              {r.active && (
                <circle cx={r.x} cy={r.y} r={2.5} fill="none" stroke="#3b82f6" strokeWidth="0.3" opacity="0.4">
                  <animate attributeName="r" from="1.5" to="4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '11px' }}>
        <div><span style={{ color: 'var(--text-secondary)' }}>Active Regions</span><br /><strong style={{ color: 'var(--accent-blue)' }}>32</strong></div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Requests/sec</span><br /><strong style={{ color: 'var(--accent-cyan)' }}>18,367</strong></div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Data Transfer</span><br /><strong style={{ color: 'var(--accent-purple)' }}>2.48 TB/s</strong></div>
      </div>
    </div>
  );
}
