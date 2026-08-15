'use client';

import { useState } from 'react';

interface Props {
  onCommand: (cmd: string) => void;
  masterStatus: string;
}

export default function Header({ onCommand, masterStatus }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onCommand(query);
      setQuery('');
    }
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
    }}>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
          OMEGA NEXUS AI OS <span style={{ color: 'var(--accent-cyan)', fontSize: '14px' }}>2.0</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '14px' }}> | Master Control Center</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: '500px', margin: '0 24px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask anything to Master AI..."
          style={{
            width: '100%', padding: '10px 16px', borderRadius: '8px',
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: '13px', outline: 'none',
          }}
        />
      </form>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <div className="pulse-dot" style={{ background: masterStatus === 'online' ? 'var(--accent-green)' : 'var(--accent-orange)' }} />
          <span>Master AI: <strong style={{ color: masterStatus === 'online' ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{masterStatus.toUpperCase()}</strong></span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>May 21, 2026</div>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700,
        }}>PB</div>
        <div style={{ fontSize: '12px' }}>
          <div style={{ fontWeight: 600 }}>Pushkar Balyan</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>Super Administrator</div>
        </div>
      </div>
    </header>
  );
}
