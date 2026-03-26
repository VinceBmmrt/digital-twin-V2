'use client';

import { BOOT_LINES } from './constants';


export default function BootAnimation() {
const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };

    return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ ...mono, fontSize: '11px', lineHeight: 2.2 }}>
                {BOOT_LINES.map(([line, color, glow], i) => (
                    <div key={String(line)} style={{
                        color,
                        textShadow: glow ? '0 0 12px rgba(99,179,255,.5)' : undefined,
                        opacity: 0,
                        animation: `bootLine .22s ${i * 220}ms ease both`,
                    }}>
                        {line}
                    </div>
                ))}
            </div>
        </div>
    );
}