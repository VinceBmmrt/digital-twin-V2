'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, Cloud, Network, Zap, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

const NODES = [
    { label: 'Navigateur', sub: 'Next.js', icon: <Globe size={18} /> },
    { label: 'CloudFront', sub: 'CDN', icon: <Cloud size={18} /> },
    { label: 'API Gateway', sub: 'REST', icon: <Network size={18} /> },
    { label: 'Lambda', sub: 'FastAPI', icon: <Zap size={18} /> },
    { label: 'AWS Bedrock', sub: 'LLM', icon: <Sparkles size={18} /> },
];

const STEP_MS = 160;

export default function ArchitectureDiagram() {
    const [activeIndex, setActiveIndex] = useState(-1);
    const [thinking, setThinking] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const clearTimers = () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];
        };

        const onPulse = (e: Event) => {
            const phase = (e as CustomEvent<{ phase: 'start' | 'end' }>).detail?.phase;
            clearTimers();
            if (phase === 'start') {
                setThinking(false);
                NODES.forEach((_, i) => {
                    timers.current.push(
                        setTimeout(() => {
                            setActiveIndex(i);
                            if (i === NODES.length - 1) setThinking(true);
                        }, i * STEP_MS),
                    );
                });
            } else if (phase === 'end') {
                setThinking(false);
                for (let i = NODES.length - 1; i >= -1; i--) {
                    timers.current.push(
                        setTimeout(() => setActiveIndex(i), (NODES.length - 1 - i) * STEP_MS),
                    );
                }
            }
        };

        window.addEventListener('twin:pulse', onPulse);
        return () => {
            window.removeEventListener('twin:pulse', onPulse);
            clearTimers();
        };
    }, []);

    return (
        <section className="arch-section">
            <div className="bento-heading">
                <div className="bento-eyebrow">
                    <span>{'//'}</span> ARCHITECTURE EN DIRECT
                </div>
            </div>

            <Reveal>
                <div className="arch-row">
                    {NODES.map((n, i) => (
                        <div key={n.label} className="arch-node-wrap">
                            <div
                                className={`arch-node${i <= activeIndex ? ' arch-node--active' : ''}${i === activeIndex && thinking ? ' arch-node--thinking' : ''}`}
                            >
                                <div className="arch-node-icon">{n.icon}</div>
                                <div className="arch-node-text">
                                    <div className="arch-node-label">{n.label}</div>
                                    <div className="arch-node-sub">{n.sub}</div>
                                </div>
                            </div>
                            {i < NODES.length - 1 && (
                                <div className={`arch-connector${i < activeIndex ? ' arch-connector--active' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}
