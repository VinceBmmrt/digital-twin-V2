'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Copy, Check, Sparkles, Cpu, Database, Globe, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/* ── Neural canvas ── */
function NeuralCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const resize = () => {
            canvas.width = canvas.offsetWidth * devicePixelRatio;
            canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);
        type N = { x: number; y: number; vx: number; vy: number; r: number; pulse: number; ps: number };
        const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight;
        const nodes: N[] = Array.from({ length: 38 }, () => ({
            x: Math.random() * W(), y: Math.random() * H(),
            vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
            r: Math.random() * 1.8 + 0.6, pulse: Math.random() * Math.PI * 2,
            ps: 0.012 + Math.random() * 0.018,
        }));
        let raf: number;
        const draw = () => {
            const w = W(), h = H();
            ctx.clearRect(0, 0, w, h);
            for (const n of nodes) {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;
                n.pulse += n.ps;
            }
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 160) {
                    ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(99,179,255,${(1 - d / 160) * 0.12})`; ctx.lineWidth = 0.6; ctx.stroke();
                }
            }
            for (const n of nodes) {
                const g = (Math.sin(n.pulse) + 1) / 2, r = n.r + g * 1.2;
                const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
                gr.addColorStop(0, `rgba(147,210,255,${0.18 + g * 0.38})`); gr.addColorStop(1, 'rgba(147,210,255,0)');
                ctx.beginPath(); ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,225,255,${0.4 + g * 0.5})`; ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ── Markdown ── */
function MarkdownContent({ content }: { content: string }) {
    return (
        <div style={{ color: '#9fbdd6', fontSize: '13.5px', lineHeight: 1.75, fontWeight: 300 }}>
            <ReactMarkdown components={{
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ff', textDecoration: 'underline' }}>{children}</a>,
                p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: '#c8e8ff', fontWeight: 600 }}>{children}</strong>,
                ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '6px 0' }}>{children}</ol>,
                ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '6px 0' }}>{children}</ul>,
                li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                code: ({ children }) => <code style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px', color: '#63b3ff', fontSize: '0.85em', fontFamily: 'DM Mono, monospace' }}>{children}</code>,
            }}>{content}</ReactMarkdown>
        </div>
    );
}

/* ── Typewriter ── */
function TypedText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        setDisplayed(''); setDone(false); let i = 0;
        const iv = setInterval(() => { i += 3; setDisplayed(text.slice(0, i)); if (i >= text.length) { clearInterval(iv); setDone(true); } }, 12);
        return () => clearInterval(iv);
    }, [text]);
    if (done) return <MarkdownContent content={text} />;
    return <span style={{ color: '#9fbdd6', fontSize: '13.5px', lineHeight: 1.75, fontWeight: 300 }}>{displayed}<span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#63b3ff', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'cursorBlink .6s step-end infinite' }} /></span>;
}

/* ── Bar-wave loader (original style) ── */
function BarWave() {
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

/* ── Boot lines ── */
const BOOT_LINES: [string, string, boolean][] = [
    ['> INITIALIZING AI DIGITAL TWIN...', '#3a7a6a', false],
    ['> LOADING LLM CONTEXT WINDOW.............. OK', '#3a8a70', false],
    ['> MOUNTING EXPERIENCE CORPUS...... OK', '#4a9a80', false],
    ['> INDEXING RAG KNOWLEDGE BASE............. OK', '#4aaa88', false],
    ['> CONNECTING TO NOVA MODELS.............. OK', '#5ab898', false],
    ['> ALL SYSTEMS OPERATIONAL.', '#63b3ff', true],
];

const SUGGESTIONS = [
    { text: 'Quelles sont tes expériences professionnelles ?', icon: '💼' },
    { text: 'Sur quels types de projets as-tu travaillé ?', icon: '🚀' },
    { text: 'Peux tu me parler de tes projets personnels en IA ?', icon: '🧠' },
    { text: 'Quelles technologies maîtrises tu le mieux ?', icon: '⚡' },
];

const SKILLS = [
    { label: 'LLM', icon: <Sparkles size={10} />, color: '#63b3ff' },
    { label: 'RAG', icon: <Database size={10} />, color: '#93d0ff' },
    { label: 'Agents', icon: <Cpu size={10} />, color: '#b8e0ff' },
    { label: 'Fullstack', icon: <Globe size={10} />, color: '#63b3ff' },
];

const SYSTEMS = [
    { label: 'LLM Core', ok: true },
    { label: 'RAG Index', ok: true },
    { label: 'Memory', ok: true },
];

const mono: React.CSSProperties = { fontFamily: 'DM Mono, monospace' };
const display: React.CSSProperties = { fontFamily: 'Syne, sans-serif' };

export default function Twin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [bootDone, setBootDone] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
    
        el.scrollTo({
            top: el.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages.length]);
    
    
    
    useEffect(() => { const t = setTimeout(() => setBootDone(true), BOOT_LINES.length * 220 + 300); return () => clearTimeout(t); }, []);

    const copyMessage = (text: string, id: string) => {
        navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
    };

    const sendMessage = useCallback(async (msg?: string) => {
        const text = msg ?? input;
        if (!text.trim() || isLoading) return;
        setInputHistory(prev => [text, ...prev.slice(0, 19)]); setHistoryIdx(-1);
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]); setInput(''); setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, session_id: sessionId || undefined }),
            });
            if (!res.ok) { let d = `Erreur ${res.status}`; try { const e = await res.json(); if (e?.detail) d = String(e.detail); } catch { } throw new Error(d); }
            const data = await res.json();
            if (!sessionId) setSessionId(data.session_id);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `Une erreur est survenue : ${err instanceof Error ? err.message : 'Erreur inconnue'}`, timestamp: new Date() }]);
        } finally { setIsLoading(false); }
    }, [input, isLoading, sessionId]);

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(historyIdx + 1, inputHistory.length - 1); setHistoryIdx(n); setInput(inputHistory[n] ?? ''); }
        if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(historyIdx - 1, -1); setHistoryIdx(n); setInput(n === -1 ? '' : inputHistory[n]); }
        if (e.key === 'Escape') { setInput(''); setHistoryIdx(-1); }
    };

    const [timeStr, setTimeStr] = useState('');
    useEffect(() => {
        const u = () => setTimeStr(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        u(); const iv = setInterval(u, 1000); return () => clearInterval(iv);
    }, []);

    const isEmpty = messages.length === 0;

    return (
        <div style={{ position: 'absolute', inset: 0, fontFamily: 'DM Mono, monospace', overflow: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
                * { box-sizing: border-box; }

                @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes barWave      { 0%,100%{transform:scaleY(.15)} 50%{transform:scaleY(1)} }
                @keyframes bootLine     { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
                @keyframes msgIn        { from{opacity:0;transform:translateY(8px) scale(.99)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
                @keyframes glowPulse   { 0%,100%{opacity:.5} 50%{opacity:1} }
                @keyframes avatarPulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,179,255,0)} 50%{box-shadow:0 0 0 6px rgba(99,179,255,0.1)} }
                @keyframes orbFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                @keyframes rotate360   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes chatAura    {
                    0%,100% { box-shadow: 0 0 0 1px rgba(99,179,255,.06), 0 0 40px rgba(99,179,255,.05); }
                    50%     { box-shadow: 0 0 0 1px rgba(99,179,255,.12), 0 0 60px rgba(99,179,255,.09); }
                }

                .msg-in   { animation: msgIn .3s cubic-bezier(.22,.68,0,1.2) both; }
                .fade-up  { animation: fadeUp .5s ease both; }

                .shimmer-text {
                    background: linear-gradient(90deg, #63b3ff 0%, #c8e8ff 38%, #fff 48%, #93d0ff 58%, #63b3ff 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text; background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 4s linear infinite;
                }
                .glass-msg {
                    background: linear-gradient(135deg, rgba(99,179,255,.07) 0%, rgba(99,179,255,.03) 100%);
                    border: 1px solid rgba(99,179,255,.14);
                    backdrop-filter: blur(12px);
                }
                .sug-card {
                    background: rgba(255,255,255,.025);
                    border: 1px solid rgba(99,179,255,.1);
                    transition: all .2s cubic-bezier(.22,.68,0,1.2);
                    cursor: pointer;
                }
                .sug-card:hover { background: rgba(99,179,255,.08); border-color: rgba(99,179,255,.3); transform: translateY(-1px); }

                .skill-chip { background: rgba(99,179,255,.07); border: 1px solid rgba(99,179,255,.15); transition: all .2s; }
                .skill-chip:hover { background: rgba(99,179,255,.14); border-color: rgba(99,179,255,.3); }

                .send-btn-on  { background: linear-gradient(135deg,rgba(99,179,255,.22),rgba(99,179,255,.12)); border: 1px solid rgba(99,179,255,.4); box-shadow: 0 0 20px rgba(99,179,255,.12); cursor: pointer; }
                .send-btn-on:hover { background: linear-gradient(135deg,rgba(99,179,255,.32),rgba(99,179,255,.18)); }
                .send-btn-off { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); cursor: not-allowed; }

                .input-wrap { border: 1px solid rgba(99,179,255,.1); background: rgba(255,255,255,.03); transition: border-color .25s, box-shadow .25s; border-radius: 14px; }
                .input-wrap.focused { border-color: rgba(99,179,255,.28); box-shadow: 0 0 0 3px rgba(99,179,255,.06); }

                .scroll-area { overflow-y: auto; }
                .scroll-area::-webkit-scrollbar { width: 3px; }
                .scroll-area::-webkit-scrollbar-thumb { background: rgba(99,179,255,.1); border-radius: 999px; }

                .avatar-ring { animation: avatarPulse 3s ease-in-out infinite; }
                .status-dot  { animation: glowPulse 2s ease-in-out infinite; }
                .orb1 { animation: orbFloat 7s ease-in-out infinite; }
                .orb2 { animation: orbFloat 9s ease-in-out infinite; animation-delay: -4s; }
            `}</style>

            {/* Root flex container — fills parent completely */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', width: '100%', height: '100%', background: '#08131f', overflow: 'hidden' }}>

                {/* Neural BG */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <NeuralCanvas />
                    <div className="orb1" style={{ position: 'absolute', top: '-15%', right: '-10%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,179,255,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
                    <div className="orb2" style={{ position: 'absolute', bottom: '-20%', left: '-8%', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,179,255,.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,13,24,.3), transparent, rgba(6,13,24,.6))' }} />
                </div>

                {/* ══ SIDEBAR ══ */}
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
                            { label: 'Messages', value: String(messages.length) },
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

                {/* ══ MAIN ══ */}
                <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10, background: 'rgba(10,20,36,.55)', overflow: 'hidden' }}>

                    {/* Header */}
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

                    {/* Messages scroll area - display:block NOT flex, so it scrolls correctly */}
                    <div
    ref={scrollRef}
    style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '28px 32px'
    }}
>

                        {/* ── BOOT ANIMATION ── */}
                        {!bootDone && (
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
                        )}

                        {/* ── EMPTY / WELCOME ── */}
                        {bootDone && isEmpty && (
                            <div className="fade-up" style={{ maxWidth: '560px', margin: '0 auto', width: '100%', paddingTop: '40px' }}>
                                <div className="glass-msg" style={{ borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
                                    <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgba(99,179,255,.2),rgba(99,179,255,.06))', border: '1px solid rgba(99,179,255,.2)' }}>
                                            <Sparkles size={16} color="#63b3ff" />
                                        </div>
                                        <div>
                                            <p style={{ ...display, fontWeight: 600, color: '#c8e8ff', fontSize: '15px', margin: '0 0 8px' }}>Bonjour, je suis le Digital Twin de Vincent.</p>
                                            <p style={{ ...mono, color: '#4a7a9b', fontSize: '12.5px', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>Mes expériences professionnelles, projets personnels et compétences techniques sont chargés en contexte. Posez-moi n'importe quelle question.</p>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ ...mono, fontSize: '9px', color: '#2a4a6a', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '12px' }}>Suggestions</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {SUGGESTIONS.map((s, i) => (
                                        <button key={s.text} className="sug-card" style={{ borderRadius: '12px', padding: '13px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', background: 'none', border: 'none', width: '100%', animationDelay: `${i * 60}ms` }}
                                            onClick={() => { setInput(s.text); inputRef.current?.focus(); }}>
                                            <span style={{ fontSize: '16px' }}>{s.icon}</span>
                                            <span style={{ ...mono, fontSize: '12.5px', color: '#5a8aaa', fontWeight: 300, flex: 1, textAlign: 'left' }}>{s.text}</span>
                                            <ChevronRight size={12} color="#2a4a6a" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── MESSAGES ── */}
                        {bootDone && !isEmpty && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {messages.map((msg, idx) => (
                                    <div key={msg.id} className="msg-in" style={{ animationDelay: `${Math.min(idx * 20, 80)}ms` }}>
                                        {msg.role === 'user' ? (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <div style={{ maxWidth: '72%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '6px' }}>
                                                        <span style={{ ...mono, fontSize: '9px', color: '#3a6480', letterSpacing: '.08em' }}>{msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <span style={{ ...mono, fontSize: '9px', color: '#4a7a9b', letterSpacing: '.1em', textTransform: 'uppercase' }}>Vous</span>
                                                    </div>
                                                    <div style={{ borderRadius: '16px 4px 16px 16px', padding: '12px 16px', background: 'linear-gradient(135deg,rgba(99,179,255,.14),rgba(99,179,255,.07))', border: '1px solid rgba(99,179,255,.2)' }}>
                                                        <p style={{ ...mono, color: '#b8d8f0', fontSize: '13.5px', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', background: 'linear-gradient(135deg,rgba(99,179,255,.18),rgba(99,179,255,.06))', border: '1px solid rgba(99,179,255,.2)' }}>
                                                    <span style={{ ...display, color: '#63b3ff', fontSize: '10px', fontWeight: 700 }}>VB</span>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <span style={{ ...display, fontSize: '10px', color: '#63b3ff', fontWeight: 600, letterSpacing: '.03em' }}>Vincent Bommert</span>
                                                        <span style={{ ...mono, fontSize: '9px', color: '#2a4a6a' }}>{msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <span style={{ ...mono, fontSize: '8px', color: '#2a4a6a' }}>MSG_{String(idx).padStart(3, '0')}</span>
                                                            <button onClick={() => copyMessage(msg.content, msg.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', background: copied === msg.id ? 'rgba(74,222,128,.1)' : 'rgba(99,179,255,.06)', border: copied === msg.id ? '1px solid rgba(74,222,128,.3)' : '1px solid rgba(99,179,255,.14)' }}>
                                                                {copied === msg.id ? <Check size={9} color="#4ade80" /> : <Copy size={9} color="#4a7a9b" />}
                                                                <span style={{ ...mono, fontSize: '8px', color: copied === msg.id ? '#4ade80' : '#4a7a9b' }}>{copied === msg.id ? 'Copié' : 'Copier'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="glass-msg" style={{ borderRadius: '4px 16px 16px 16px', padding: '16px 20px' }}>
                                                        {idx === messages.length - 1 && msg.role === 'assistant' ? <TypedText text={msg.content} /> : <MarkdownContent content={msg.content} />}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* ── BAR-WAVE LOADING ── */}
                                {isLoading && (
                                    <div className="msg-in">
                                        <BarWave />
                                    </div>
                                )}

                          
                            </div>
                        )}
                    </div>

                    {/* ── INPUT BAR — flexShrink:0 + never grows ── */}
                    <div style={{ flexShrink: 0, flexGrow: 0, padding: '18px 32px 16px', borderTop: '1px solid rgba(99,179,255,.1)', background: 'rgba(8,16,30,.95)', backdropFilter: 'blur(20px)' }}>
                        <div className={`input-wrap${inputFocused ? ' focused' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Posez votre question…"
                                disabled={isLoading || !bootDone}
                                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#b8d8f0', fontSize: '13.5px', ...mono, fontWeight: 300 }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading || !bootDone}
                                className={input.trim() && !isLoading ? 'send-btn-on' : 'send-btn-off'}
                                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', fontSize: '11px', ...mono, letterSpacing: '.12em', fontWeight: 500, color: input.trim() && !isLoading ? '#93d0ff' : '#2a4a6a', transition: 'all .2s' }}>
                                <span>ENVOYER</span>
                                <Send size={11} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '8px', paddingLeft: '4px' }}>
                            <span style={{ ...mono, fontSize: '9px', color: '#2a4a6a', letterSpacing: '.1em' }}>↵ Envoyer</span>
                            <span style={{ ...mono, fontSize: '9px', color: '#1e3a52', letterSpacing: '.1em' }}>↑↓ Historique</span>
                            <span style={{ ...mono, fontSize: '9px', color: '#1e3a52', letterSpacing: '.1em' }}>Esc Effacer</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}