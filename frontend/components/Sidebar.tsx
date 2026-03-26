'use client';

import { SKILLS, SYSTEMS } from './constants';




interface SidebarProps {
    messagesCount: number;
    timeStr: string;
    sessionId: string;
}

export default function Sidebar({ messagesCount, timeStr, sessionId }: SidebarProps) {
    const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };
const display: React.CSSProperties = { fontFamily: 'Syne, sans-serif' };
    
    return (
        <aside style={{
            position: 'relative', zIndex: 10,
            width: '240px', minWidth: '240px', maxWidth: '240px',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(4,8,16,0.97)',
            borderRight: '1px solid rgba(99,179,255,0.15)',
            flexShrink: 0,
        }}>
            {/* Profile */}
            <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid rgba(99,179,255,.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                    <div className="avatar-ring" style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(99,179,255,.2),rgba(99,179,255,.06))', border: '1px solid rgba(99,179,255,.25)' }}>
                        <span style={{ ...display, fontSize: '22px', fontWeight: 700, color: '#63b3ff' }}>VB</span>
                    </div>
                    <div className="status-dot" style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '13px', height: '13px', borderRadius: '50%', background: '#4ade80', border: '2px solid #060d18', boxShadow: '0 0 6px #4ade80' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ ...display, fontWeight: 700, fontSize: '15px', color: '#fff', letterSpacing: '.03em' }}>Vincent Bommert</div>
                    <div style={{ ...mono, fontSize: '10px', color: '#4a7a9b', marginTop: '3px', letterSpacing: '.1em', textTransform: 'uppercase' }}>Digital Twin</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {SKILLS.map(s => (
                        <span key={s.label} className="skill-chip" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', ...mono, fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: s.color }}>
                            {s.icon} {s.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Session info */}
            <div style={{ padding: '20px 20px' }}>
                <div style={{ ...mono, fontSize: '9px', color: '#2a4a6a', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '14px' }}>Session Info</div>
                {[
                    { label: 'Messages', value: String(messagesCount) },
                    { label: 'Heure', value: timeStr },
                    ...(sessionId ? [{ label: 'ID', value: `#${sessionId.slice(0, 6).toUpperCase()}` }] : []),
                ].map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ ...mono, fontSize: '10px', color: '#4a7a9b', flex: 1 }}>{r.label}</span>
                        <span style={{ ...mono, fontSize: '10px', color: '#63b3ff', fontWeight: 500 }}>{r.value}</span>
                    </div>
                ))}
            </div>

            <div style={{ height: '1px', background: 'rgba(99,179,255,.06)', margin: '0 20px' }} />

            {/* Systems */}
            <div style={{ marginTop: 'auto', padding: '20px 20px' }}>
                <div style={{ ...mono, fontSize: '9px', color: '#2a4a6a', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '14px' }}>Systèmes</div>
                {SYSTEMS.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ ...mono, fontSize: '10px', color: '#4a7a9b', flex: 1 }}>{s.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80', animation: 'glowPulse 2.5s ease-in-out infinite' }} />
                            <span style={{ ...mono, fontSize: '9px', color: '#4ade80' }}>OK</span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}