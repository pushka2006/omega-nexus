'use client';

interface Props { activities: any[]; }

const DEMO_ACTIVITIES = [
  { agent: 'Code AI', action: 'Pushed new commit to SmartShop SaaS', type: 'code' },
  { agent: 'Marketing AI', action: 'Launched Instagram campaign', type: 'marketing' },
  { agent: 'Revenue', action: 'Received $4,250 from SmartShop subscriptions', type: 'finance' },
  { agent: 'Security AI', action: 'Blocked suspicious API request', type: 'security' },
  { agent: 'Research AI', action: 'Completed market analysis report', type: 'research' },
  { agent: 'DevOps AI', action: 'Deployed Nexus CRM v2.1 to production', type: 'deploy' },
  { agent: 'Data AI', action: 'Generated weekly analytics dashboard', type: 'data' },
  { agent: 'Testing AI', action: 'Passed 847 unit tests for Guide Robot OS', type: 'code' },
];

const TYPE_COLORS: Record<string, string> = {
  code: 'var(--accent-blue)', marketing: 'var(--accent-orange)', finance: 'var(--accent-green)',
  security: 'var(--accent-red)', research: 'var(--accent-purple)', deploy: 'var(--accent-cyan)', data: '#6366f1',
};

export default function ActivityStream({ activities }: Props) {
  const items = activities.length > 0 ? activities : DEMO_ACTIVITIES;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">Live Activity Stream</div>
      <div style={{ maxHeight: '280px', overflow: 'auto' }}>
        {items.map((item, i) => (
          <div key={i} className="activity-item" style={{ borderLeftColor: TYPE_COLORS[item.type] || 'var(--accent-blue)' }}>
            <span style={{ fontWeight: 600, color: TYPE_COLORS[item.type] || 'var(--accent-blue)' }}>{item.agent}</span>
            <span style={{ color: 'var(--text-secondary)', margin: '0 6px' }}>→</span>
            <span>{item.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
