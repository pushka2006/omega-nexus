'use client';

interface Props { metrics: any; }

export default function Footer({ metrics }: Props) {
  const uptime = metrics?.uptime_seconds || 4106160;
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const mins = Math.floor((uptime % 3600) / 60);

  return (
    <footer style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 24px', borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)', fontSize: '11px', color: 'var(--text-secondary)',
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Connected to Omega Nexus Cloud</span>
        <span>Network Latency: <strong style={{ color: 'var(--accent-green)' }}>23ms</strong></span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Uptime: <strong style={{ color: 'var(--accent-cyan)' }}>{days}d {hours}h {mins}m</strong></span>
        <span>Version: <strong>v2.0.0-OMEGA</strong></span>
        <span>Build: 2026.05.21</span>
      </div>
    </footer>
  );
}
