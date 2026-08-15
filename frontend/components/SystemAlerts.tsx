'use client';

const ALERTS = [
  { message: 'High CPU Usage on Server 3', severity: 'critical', time: '2 min ago' },
  { message: 'Database Backup Completed Successfully', severity: 'info', time: '15 min ago' },
  { message: 'SSL Certificate Expiring in 14 Days', severity: 'warning', time: '1 hr ago' },
  { message: 'New Agent Registered: Patent Research AI', severity: 'info', time: '2 hr ago' },
  { message: 'Memory Core at 54% Capacity', severity: 'warning', time: '3 hr ago' },
];

const SEV_COLORS: Record<string, string> = {
  critical: 'badge-red', info: 'badge-blue', warning: 'badge-orange',
};

export default function SystemAlerts() {
  return (
    <div className="card">
      <div className="card-header">System Alerts</div>
      <div style={{ maxHeight: '220px', overflow: 'auto' }}>
        {ALERTS.map((alert, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '11px',
          }}>
            <span className={`badge ${SEV_COLORS[alert.severity]}`}>{alert.severity}</span>
            <div style={{ flex: 1 }}>
              <div>{alert.message}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>{alert.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
