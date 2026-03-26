'use client';



export default function Header() {
    const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };
    const display: React.CSSProperties = { fontFamily: 'Syne, sans-serif' };
    return (
        <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid rgba(99,179,255,.1)', background: 'rgba(8,16,30,.95)', backdropFilter: 'blur(20px)' }}>
            <div>
                <h1 className="shimmer-text" style={{ ...display, fontSize: '20px', fontWeight: 700, margin: 0 }}>Intelligence Artificielle Personnelle</h1>
                <p style={{ ...mono, fontSize: '11px', color: '#3a6480', margin: '3px 0 0', letterSpacing: '.05em' }}>Propulsé par LLM + RAG — Contexte chargé en mémoire</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'glowPulse 2s ease-in-out infinite' }} />
                <span style={{ ...mono, fontSize: '10px', color: '#4a9b6a', letterSpacing: '.1em' }}>EN LIGNE</span>
            </div>
        </header>
    );
}