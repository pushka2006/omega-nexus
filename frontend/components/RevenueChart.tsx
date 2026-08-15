'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props { revenue: any; }

const DEMO_DATA = [
  { month: 'Jan', revenue: 82000, mrr: 65000 },
  { month: 'Feb', revenue: 95000, mrr: 72000 },
  { month: 'Mar', revenue: 108000, mrr: 85000 },
  { month: 'Apr', revenue: 125000, mrr: 98000 },
  { month: 'May', revenue: 148000, mrr: 128457 },
  { month: 'Jun', revenue: 172000, mrr: 145000 },
];

export default function RevenueChart({ revenue }: Props) {
  return (
    <div className="card">
      <div className="card-header">Revenue Analytics</div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={DEMO_DATA}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={45}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #2a3050', borderRadius: '8px', fontSize: '12px' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '11px' }}>
        <div><span style={{ color: 'var(--text-secondary)' }}>MRR</span><br /><strong style={{ color: 'var(--accent-green)' }}>${revenue?.mrr?.toLocaleString() || '128,457'}</strong></div>
        <div><span style={{ color: 'var(--text-secondary)' }}>ARR</span><br /><strong style={{ color: 'var(--accent-green)' }}>$1.54M+</strong></div>
        <div><span style={{ color: 'var(--text-secondary)' }}>Churn</span><br /><strong style={{ color: 'var(--accent-orange)' }}>2.18%</strong></div>
      </div>
    </div>
  );
}
