'use client';

interface Props {
  approvals: any[];
  onRefresh: () => void;
}

const DEMO_APPROVALS = [
  { title: 'Deploy SmartShop SaaS to Production', priority: 'high', request_type: 'deployment' },
  { title: 'Process Vendor Payment – $12,500', priority: 'high', request_type: 'financial' },
  { title: 'Deploy Guide Robot OS Update', priority: 'medium', request_type: 'deployment' },
  { title: 'Accept SaaS Terms of Service v2', priority: 'medium', request_type: 'legal' },
];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ApprovalCenter({ approvals, onRefresh }: Props) {
  const items = approvals.length > 0 ? approvals : DEMO_APPROVALS;

  const handleAction = async (id: string | undefined, action: string, index: number) => {
    if (!id) return;
    try {
      await fetch(`${API}/api/v1/approvals/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, action }),
      });
      onRefresh();
    } catch { /* silent */ }
  };

  return (
    <div className="card">
      <div className="card-header">
        Approval Center
        <span className="badge badge-orange" style={{ marginLeft: '8px' }}>{items.length} Pending</span>
      </div>
      <div style={{ maxHeight: '220px', overflow: 'auto' }}>
        {items.map((item, i) => (
          <div key={item.id || i} style={{
            padding: '8px', marginBottom: '6px', borderRadius: '6px',
            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge badge-${item.priority === 'high' ? 'red' : 'orange'}`}>{item.priority}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => handleAction(item.id, 'approve', i)} style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer',
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--accent-green)',
                }}>Approve</button>
                <button onClick={() => handleAction(item.id, 'reject', i)} style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--accent-red)',
                }}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
