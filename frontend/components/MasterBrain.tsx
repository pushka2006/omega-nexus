'use client';

interface Props { metrics: any; }

const AGENT_CLUSTERS = [
  { name: 'Code AI', count: 326, angle: 0, color: '#3b82f6' },
  { name: 'Data AI', count: 256, angle: 45, color: '#06b6d4' },
  { name: 'Marketing AI', count: 186, angle: 90, color: '#f59e0b' },
  { name: 'Business AI', count: 168, angle: 135, color: '#10b981' },
  { name: 'DevOps AI', count: 139, angle: 180, color: '#8b5cf6' },
  { name: 'Robotics AI', count: 129, angle: 225, color: '#ec4899' },
  { name: 'Research AI', count: 128, angle: 270, color: '#6366f1' },
  { name: 'Security AI', count: 112, angle: 315, color: '#ef4444' },
];

export default function MasterBrain({ metrics }: Props) {
  const cpu = metrics?.master_ai_cpu || 64;
  const neural = metrics?.neural_load || 72;
  const memUsed = metrics?.memory_used_tb || 8.7;
  const memTotal = metrics?.memory_total_tb || 16;
  const threads = metrics?.quantum_threads || 12288;

  return (
    <div className="card glow-blue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="card-header" style={{ alignSelf: 'flex-start' }}>Master AI Brain</div>

      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '8px 0' }}>
        {/* Outer ring */}
        <svg className="brain-ring" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="110" cy="110" r="85" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
        </svg>

        {/* Agent cluster nodes */}
        {AGENT_CLUSTERS.map(cluster => {
          const rad = (cluster.angle * Math.PI) / 180;
          const x = 110 + 90 * Math.cos(rad);
          const y = 110 + 90 * Math.sin(rad);
          return (
            <div key={cluster.name} style={{
              position: 'absolute', left: x - 30, top: y - 14, textAlign: 'center', width: '60px',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', background: cluster.color,
                margin: '0 auto 2px', boxShadow: `0 0 8px ${cluster.color}`,
              }} />
              <div style={{ fontSize: '8px', color: 'var(--text-secondary)' }}>{cluster.name}</div>
              <div style={{ fontSize: '9px', fontWeight: 600, color: cluster.color }}>{cluster.count}</div>
            </div>
          );
        })}

        {/* Brain center */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.4), rgba(139,92,246,0.2))',
          border: '2px solid rgba(59,130,246,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', boxShadow: '0 0 40px rgba(59,130,246,0.3)',
        }}>🧠</div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '12px' }}>
        THINKING • PLANNING • EXECUTING
      </div>

      {/* Resource meters */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
        <Meter label="Master AI CPU" value={cpu} unit="%" color="var(--accent-blue)" />
        <Meter label="Neural Load" value={neural} unit="%" color="var(--accent-purple)" />
        <Meter label="Memory Core" value={(memUsed / memTotal) * 100} unit={`${memUsed}/${memTotal} TB`} color="var(--accent-cyan)" />
        <Meter label="Quantum Threads" value={75} unit={threads.toLocaleString()} color="var(--accent-green)" />
      </div>
    </div>
  );
}

function Meter({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{unit}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
        <div style={{ height: '100%', width: `${Math.min(value, 100)}%`, background: color, borderRadius: '2px', transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}
