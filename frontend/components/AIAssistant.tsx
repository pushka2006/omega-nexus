'use client';

import { useState } from 'react';

interface Props { onCommand: (cmd: string) => void; }

const QUICK_ACTIONS = [
  'Generate Code', 'Analyze Project', 'Research Idea', 'Create Agent', 'Deploy App',
];

export default function AIAssistant({ onCommand }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your AI Assistant. How can I help you today?' },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }, { role: 'assistant', text: `Processing: "${text}". Master AI is analyzing your request...` }]);
    onCommand(text);
    setMessage('');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">AI Assistant</div>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 8px',
        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
      }}>🤖</div>
      <div style={{ flex: 1, overflow: 'auto', maxHeight: '100px', marginBottom: '8px' }}>
        {messages.slice(-3).map((m, i) => (
          <div key={i} style={{
            fontSize: '11px', padding: '4px 8px', marginBottom: '4px', borderRadius: '6px',
            background: m.role === 'user' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.05)',
            color: m.role === 'user' ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a} onClick={() => send(a)} style={{
            fontSize: '9px', padding: '3px 8px', borderRadius: '9999px',
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            color: 'var(--accent-purple)', cursor: 'pointer',
          }}>{a}</button>
        ))}
      </div>
      <input value={message} onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send(message)}
        placeholder="Ask AI Assistant..."
        style={{
          width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '11px',
          background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none',
        }}
      />
    </div>
  );
}
