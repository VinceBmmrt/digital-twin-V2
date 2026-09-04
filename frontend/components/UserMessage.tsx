'use client';

import { User } from 'lucide-react';
import { Message } from '../types/types';

interface UserMessageProps {
    message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
    const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ maxWidth: '72%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ ...mono, fontSize: '9px', color: '#3a6480', letterSpacing: '.08em' }}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ ...mono, fontSize: '9px', color: '#4a7a9b', letterSpacing: '.1em', textTransform: 'uppercase' }}>Vous</span>
                </div>
                <div style={{ borderRadius: '16px 4px 16px 16px', padding: '12px 16px', background: 'linear-gradient(135deg,rgba(99,179,255,.14),rgba(99,179,255,.07))', border: '1px solid rgba(99,179,255,.2)' }}>
                    <p style={{ ...mono, color: '#b8d8f0', fontSize: '13.5px', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{message.content}</p>
                </div>
            </div>
            <div style={{ flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(148,163,184,.3)', background: 'linear-gradient(135deg,rgba(148,163,184,.18),rgba(148,163,184,.07))' }}>
                <User size={16} color="#94a3b8" />
            </div>
        </div>
    );
}