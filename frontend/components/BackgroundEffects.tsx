'use client';

import { NeuralCanvas } from './NeuralCanvas';

export default function BackgroundEffects() {
    return (
        <>
            <NeuralCanvas />
            <div className="orb1" style={{ position: 'absolute', top: '-15%', right: '-10%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,179,255,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div className="orb2" style={{ position: 'absolute', bottom: '-20%', left: '-8%', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,179,255,.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,13,24,.3), transparent, rgba(6,13,24,.6))' }} />
        </>
    );
}