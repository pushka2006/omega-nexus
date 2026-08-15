'use client';

interface Props {
  metrics: any;
  revenue: any;
}

const DEFAULT_STATS = [
  { label: 'Total Agents', value: '1,842', change: '+156 today', color: 'var(--accent-blue)' },
  { label: 'Active Projects', value: '47', change: '+8 in progress', color: 'var(--accent-purple)' },
  { label: 'Deployed Apps', value: '23', change: '+3 this week', color: 'var(--accent-cyan)' },
  { label: 'Total Revenue', value: '$248,729', change: '+24.6% this month', color: 'var(--accent-green)' },
  { label: 'Users Served', value: '128,946', change: '+17.8% this month', color: 'var(--accent-orange)' },
  { label: 'Tasks Completed', value: '24,875', change: '+112 today', color: 'var(--accent-blue)' },
  { label: 'System Health', value: '99.6%', change: 'Optimal', color: 'var(--accent-green)' },
];

export default function StatsBar({ metrics, revenue }: Props) {
  const stats = metrics ? [
    { label: 'Total Agents', value: metrics.total_agents?.toLocaleString() || '1,842', change: `+${metrics.active_agents || 156} active`, color: 'var(--accent-blue)' },
    { label: 'Active Projects', value: metrics.active_projects?.toString() || '47', change: `${metrics.total_projects || 47} total`, color: 'var(--accent-purple)' },
    { label: 'Deployed Apps', value: metrics.deployed_apps?.toString() || '23', change: 'Running', color: 'var(--accent-cyan)' },
    { label: 'Total Revenue', value: revenue ? `$${revenue.total_revenue?.toLocaleString()}` : '$248,729', change: `MRR: $${revenue?.mrr?.toLocaleString() || '128,457'}`, color: 'var(--accent-green)' },
    { label: 'Tasks Completed', value: metrics.tasks_completed?.toLocaleString() || '24,875', change: 'Today', color: 'var(--accent-orange)' },
    { label: 'Neural Load', value: `${metrics.neural_load || 72}%`, change: 'Processing', color: 'var(--accent-blue)' },
    { label: 'System Health', value: `${metrics.system_health || 99.6}%`, change: 'Optimal', color: 'var(--accent-green)' },
  ] : DEFAULT_STATS;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px',
      padding: '16px 24px', borderBottom: '1px solid var(--border-color)',
    }}>
      {stats.map(s => (
        <div key={s.label} className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{s.label}</div>
          <div className="stat-value" style={{ fontSize: '20px' }}>{s.value}</div>
          <div style={{ fontSize: '10px', color: s.color, marginTop: '2px' }}>{s.change}</div>
        </div>
      ))}
    </div>
  );
}
