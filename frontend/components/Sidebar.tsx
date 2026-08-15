'use client';

const NAV_ITEMS = [
  { section: 'Main Navigation', items: [
    { icon: '⬡', label: 'Command Center', active: true },
    { icon: '🧠', label: 'Master AI Brain' },
    { icon: '🔗', label: 'Agent Network' },
    { icon: '📊', label: 'Projects Hub' },
    { icon: '💻', label: 'Code Studio' },
    { icon: '🚀', label: 'Deployments' },
    { icon: '📈', label: 'Revenue Dashboard' },
    { icon: '✅', label: 'Approval Center' },
    { icon: '📝', label: 'Memory & Knowledge' },
    { icon: '🤖', label: 'Robotics & IoT' },
    { icon: '⚙️', label: 'System Settings' },
  ]},
  { section: 'AI OS Modules', items: [
    { icon: '🔬', label: 'Research Lab' },
    { icon: '🎨', label: 'Creative Studio' },
    { icon: '📣', label: 'Marketing Suite' },
    { icon: '💰', label: 'Finance OS' },
    { icon: '⚖️', label: 'Legal & Compliance' },
    { icon: '🛡️', label: 'Security Center' },
    { icon: '📡', label: 'IoT Control' },
    { icon: '🎮', label: 'Game Dev Studio' },
  ]},
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)',
      padding: '16px 8px', display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '8px 12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.1em' }}>OMEGA NEXUS</div>
        <div style={{ fontSize: '16px', fontWeight: 700 }}>AI OS 2.0</div>
      </div>
      {NAV_ITEMS.map(section => (
        <div key={section.section} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '4px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {section.section}
          </div>
          {section.items.map(item => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 'auto', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--accent-green)' }}>
          <div className="pulse-dot" style={{ background: 'var(--accent-green)' }} />
          Voice Command Active
        </div>
        <div style={{ marginTop: '8px', height: '24px', display: 'flex', alignItems: 'center', gap: '2px' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              width: '3px', height: `${Math.random() * 20 + 4}px`,
              background: 'var(--accent-cyan)', borderRadius: '1px', opacity: 0.6,
              animation: `pulse ${0.5 + Math.random()}s infinite`,
            }} />
          ))}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Listening...</div>
      </div>
    </aside>
  );
}
