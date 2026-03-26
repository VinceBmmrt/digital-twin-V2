/* ── Bar-wave loader (original style) ── */
export function BarWave() {
    return (
        <div>
            <div style={{ fontSize: '7px', color: '#63b3ff', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'DM Mono, monospace' }}>
                V.BOMMERT <span style={{ color: '#2a4a6a' }}>— GÉNÉRATION...</span>
            </div>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '20px', paddingLeft: '2px' }}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{
                        width: '2px', height: '20px', background: 'rgba(99,179,255,0.5)',
                        borderRadius: '2px', transformOrigin: 'center',
                        animation: `barWave .88s ${i * 42}ms ease-in-out infinite`,
                    }} />
                ))}
            </div>
        </div>
    );
}