'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

function TypedText({ text, speed = 5 }: { text: string; speed?: number }) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        setDisplayed(''); setDone(false);
        let i = 0;
        const iv = setInterval(() => {
            i += 2;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) { clearInterval(iv); setDone(true); }
        }, speed);
        return () => clearInterval(iv);
    }, [text, speed]);
    return (
        <span>
            {displayed}
            {!done && <span style={{ animation: 'blink .6s step-end infinite', color: '#00d250' }}>▌</span>}
        </span>
    );
}

const SUGGESTIONS = [
    'Quelles sont tes expériences professionnelles ?',
    'Sur quels types de projets as-tu travaillé ?',
    'Peux tu me parler de tes projets personnels en IA ?',
    'Quelles technologies maîtrises tu le mieux ?',
];



export default function Twin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [bootDone, setBootDone] = useState(false);
    const [glitch, setGlitch] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { const t = setTimeout(() => setBootDone(true), 1600); return () => clearTimeout(t); }, []);

    const triggerGlitch = () => { setGlitch(true); setTimeout(() => setGlitch(false), 220); };

    const copyMessage = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 1500);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        triggerGlitch();
        setInputHistory(prev => [input, ...prev.slice(0, 19)]);
        setHistoryIdx(-1);
        const msg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, msg]);
        setInput(''); setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, session_id: sessionId || undefined }),
            });
            if (!res.ok) {
                let detail = `ERR_${res.status}`;
                try { const e = await res.json(); if (e?.detail) detail = String(e.detail); } catch { }
                throw new Error(detail);
            }
            const data = await res.json();
            if (!sessionId) setSessionId(data.session_id);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.response, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `[ERREUR] ${err instanceof Error ? err.message : 'Échec inconnu.'}`, timestamp: new Date() }]);
        } finally { setIsLoading(false); }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(historyIdx + 1, inputHistory.length - 1);
            setHistoryIdx(next);
            setInput(inputHistory[next] ?? '');
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(historyIdx - 1, -1);
            setHistoryIdx(next);
            setInput(next === -1 ? '' : inputHistory[next]);
        }
        if (e.key === 'Escape') { setInput(''); setHistoryIdx(-1); }
    };

    const [timeStr, setTimeStr] = useState('--:--:--');
    useEffect(() => {
        const update = () => setTimeStr(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div style={{ position: 'relative', height: '100%', fontFamily: "'IBM Plex Mono', monospace" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Bebas+Neue&display=swap');

                @keyframes blink      { 0%,100%{opacity:1}  50%{opacity:0} }
                @keyframes scanline   { 0%{top:-2px} 100%{top:calc(100% + 2px)} }
                @keyframes bootLine   { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }
                @keyframes msgIn      { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
                @keyframes barWave    { 0%,100%{transform:scaleY(.2)} 50%{transform:scaleY(1)} }
                @keyframes pulseGlow  { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
                @keyframes tagIn      { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }

                .msg-in    { animation: msgIn .18s ease both; }
                .ctx-tag   { animation: tagIn .3s ease both; }

                ::-webkit-scrollbar       { width: 2px; }
                ::-webkit-scrollbar-thumb { background: rgba(0,210,80,.12); border-radius: 2px; }

                input::placeholder { color:#3a7a50; font-family:'IBM Plex Mono',monospace; font-style:italic; font-size:12px; }

                .sug-btn:hover {
                    background:  rgba(0,210,80,.06) !important;
                    border-color: rgba(0,210,80,.25) !important;
                    color: #00d250 !important;
                }
                .send-btn:hover {
                    background:  rgba(0,210,80,.18) !important;
                    box-shadow:  0 0 12px rgba(0,210,80,.2) !important;
                }
                .input-wrap:focus-within {
                    border-color: rgba(0,210,80,.22) !important;
                    box-shadow: 0 0 0 1px rgba(0,210,80,.06) !important;
                }
            `}</style>

            {/* ── CRT shell ── */}
            <div style={{
                height: '100%',
                background: 'linear-gradient(180deg,#03080a 0%,#020507 100%)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                position: 'relative',
                filter: glitch ? 'brightness(1.25) hue-rotate(14deg)' : undefined,
                transition: 'filter .07s',
            }}>

                {/* Scanline + CRT overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(transparent,rgba(0,210,80,.04),transparent)',
                        animation: 'scanline 6s linear infinite',
                    }}/>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.09) 3px,rgba(0,0,0,.09) 4px)',
                    }}/>
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(0,0,0,.55) 100%)',
                    }}/>
                </div>

                {/* ── HEADER ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 20px',
                    borderBottom: '1px solid rgba(0,210,80,.08)',
                    background: 'rgba(2,5,4,.94)',
                    flexShrink: 0, zIndex: 2,
                }}>
                    {/* Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                        {/* Live dot */}
                        <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: '#00d250',
                                boxShadow: '0 0 6px #00d250, 0 0 16px rgba(0,210,80,.5)',
                                animation: 'pulseGlow 2.8s ease-in-out infinite',
                            }}/>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{
                                    fontFamily: "'Bebas Neue',cursive",
                                    fontSize: '17px', letterSpacing: '.15em',
                                    color: '#00d250',
                                    textShadow: '0 0 10px rgba(0,210,80,.4)',
                                }}>DIGITAL TWIN</span>
                                <span style={{ fontSize: '8px', color: '#2a6640', letterSpacing: '.08em' }}>
                                    — Vincent Bommert
                                </span>
                            </div>
                            <div style={{ fontSize: '7px', color: '#2a6640', letterSpacing: '.12em', marginTop: '1px' }}>
                                LLM · RAG · MULTI-AGENTS · FULLSTACK
                            </div>
                        </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                        <span style={{ fontSize: '8px', color: '#2a6640', letterSpacing: '.08em' }}>
                            CTX&nbsp;<span style={{ color: '#00d250' }}>{messages.length * 2 + 1}K</span>
                        </span>
                        <span style={{ fontSize: '8px', color: '#2a6640', letterSpacing: '.06em' }}>{timeStr}</span>
                        {sessionId && (
                            <span style={{
                                fontSize: '7px', color: '#2a6640',
                                background: 'rgba(0,210,80,.04)',
                                border: '1px solid rgba(0,210,80,.08)',
                                borderRadius: '2px', padding: '2px 7px', letterSpacing: '.05em',
                            }}>#{sessionId.slice(0, 7).toUpperCase()}</span>
                        )}
                    </div>
                </div>

                {/* ── MESSAGES AREA ── */}
                <div style={{
                    flex: 1, overflowY: 'auto',
                    padding: '20px 22px',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 2,
                }}>

                    {/* ── BOOT ── */}
                    {!bootDone ? (
                        <div style={{ fontSize: '10px', lineHeight: 2.2 }}>
                            {([
                                ['> INITIALIZING AI DIGITAL TWIN...', '#3a7a50', false],
                                ['> LOADING LLM CONTEXT WINDOW.............. OK', '#3a7a50', false],
                                ['> MOUNTING EXPERIENCE CORPUS...... OK', '#3a7a50', false],
                                ['> INDEXING RAG KNOWLEDGE BASE............. OK', '#4a9060', false],
                                ['> CONNECTING TO NOVA MODELS.............. OK', '#4a9060', false],
                                ['> ALL SYSTEMS OPERATIONAL.', '#00d250', true],
                            ] as [string, string, boolean][]).map(([line, color, glow], i) => (
                                <div key={String(line)} style={{
                                    animation: `bootLine .22s ${i * 220}ms ease both`,
                                    opacity: 0,
                                    color,
                                    textShadow: glow ? '0 0 10px rgba(0,210,80,.4)' : undefined,
                                }}>
                                    {line}
                                </div>
                            ))}
                        </div>

                    ) : messages.length === 0 ? (

                        /* ── EMPTY STATE ── */
                        <div style={{ animation: 'msgIn .4s ease both' }}>

                            {/* Greeting card */}
                            <div style={{
                                marginBottom: '20px',
                                padding: '14px 18px',
                                background: 'rgba(0,210,80,.025)',
                                border: '1px solid rgba(0,210,80,.09)',
                                borderLeft: '2px solid rgba(0,210,80,.6)',
                                borderRadius: '0 3px 3px 0',
                            }}>
                                <p style={{ color: '#00b844', fontSize: '13px', margin: '0 0 5px', fontWeight: 400, lineHeight: 1.5 }}>
                                    Bonjour — je suis le Digital Twin de{' '}
                                    <span style={{ color: '#00d250', fontWeight: 500, textShadow: '0 0 6px rgba(0,210,80,.3)' }}>
                                        Vincent Bommert
                                    </span>.
                                </p>
                                <p style={{ color: '#3a8050', fontSize: '10px', margin: 0, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.6 }}>
                                    Mes expériences en LLM, RAG et production cloud sont chargées en contexte.
                                </p>
                            </div>



                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                margin: '0 0 12px',
                            }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(0,210,80,.06)' }}/>
                                <span style={{ fontSize: '7px', color: '#2a6640', letterSpacing: '.14em' }}>SUGGESTIONS</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(0,210,80,.06)' }}/>
                            </div>

                            {/* Suggestions — clean single column, not grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {SUGGESTIONS.map(p => (
                                    <button key={p} className="sug-btn" onClick={() => setInput(p)} style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(0,210,80,.09)',
                                        borderLeft: '2px solid rgba(0,210,80,.3)',
                                        borderRadius: '0 2px 2px 0',
                                        padding: '7px 12px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontFamily: "'IBM Plex Mono',monospace",
                                        fontSize: '11px', color: '#3a8050',
                                        fontWeight: 300, lineHeight: 1.4,
                                        transition: 'all .15s',
                                    }}>
                                        <span style={{ color: '#2a6640', marginRight: '6px' }}>›</span>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                    ) : (

                        /* ── MESSAGES ── */
                        <>
                            {messages.map((msg, idx) => (
                                <div key={msg.id} className="msg-in" style={{ marginBottom: '16px' }}>
                                    {msg.role === 'user' ? (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '7px', color: '#3a8050', letterSpacing: '.12em', fontWeight: 500 }}>VOUS</span>
                                                <span style={{ fontSize: '7px', color: '#2a6640', letterSpacing: '.06em' }}>
                                                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <div style={{
                                                paddingLeft: '13px',
                                                borderLeft: '2px solid rgba(0,210,80,.22)',
                                                color: '#2ecc5a',
                                                fontSize: '13px', lineHeight: 1.68, fontWeight: 300,
                                            }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                                <span style={{ fontSize: '7px', color: '#00d250', letterSpacing: '.12em', fontWeight: 500, textShadow: '0 0 5px rgba(0,210,80,.3)' }}>
                                                    V.BOMMERT
                                                </span>
                                                <span style={{ fontSize: '7px', color: '#2a6640', letterSpacing: '.06em' }}>
                                                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                                <span style={{ fontSize: '7px', color: '#2a6640', marginLeft: 'auto', letterSpacing: '.05em' }}>
                                                    MSG_{String(idx).padStart(3, '0')}
                                                </span>
                                                <button
                                                    onClick={() => copyMessage(msg.content, msg.id)}
                                                    style={{
                                                        background: copied === msg.id ? 'rgba(0,210,80,.15)' : 'rgba(0,210,80,.06)',
                                                        border: `1px solid ${copied === msg.id ? 'rgba(0,210,80,.5)' : 'rgba(0,210,80,.25)'}`,
                                                        borderRadius: '2px', cursor: 'pointer',
                                                        fontSize: '7px', color: copied === msg.id ? '#00d250' : '#5aaa70',
                                                        letterSpacing: '.08em', fontFamily: "'IBM Plex Mono',monospace",
                                                        transition: 'all .15s', padding: '2px 7px',
                                                    }}
                                                >
                                                    {copied === msg.id ? 'COPIÉ ✓' : 'COPIER'}
                                                </button>
                                            </div>
                                            <div style={{
                                                background: 'linear-gradient(135deg,rgba(0,210,80,.04) 0%,rgba(0,210,80,.015) 100%)',
                                                border: '1px solid rgba(0,210,80,.1)',
                                                borderLeft: '2px solid rgba(0,210,80,.6)',
                                                padding: '12px 16px',
                                                borderRadius: '0 3px 3px 0',
                                                color: '#00b844',
                                                fontSize: '13px', lineHeight: 1.78, fontWeight: 300,
                                                boxShadow: '0 2px 18px rgba(0,0,0,.22)',
                                                whiteSpace: 'pre-wrap',
                                            }}>
                                                {idx === messages.length - 1 && msg.role === 'assistant'
                                                    ? <TypedText text={msg.content}/>
                                                    : msg.content}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading bar-wave */}
                            {isLoading && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '7px', color: '#00d250', letterSpacing: '.1em', marginBottom: '7px' }}>
                                        V.BOMMERT&nbsp;
                                        <span style={{ color: '#2a6640' }}>— GÉNÉRATION...</span>
                                    </div>
                                    <div style={{
                                        display: 'flex', gap: '3px', alignItems: 'center',
                                        height: '20px', paddingLeft: '13px',
                                    }}>
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div key={i} style={{
                                                width: '2px', height: '20px',
                                                background: 'rgba(0,210,80,.45)',
                                                borderRadius: '1px', transformOrigin: 'center',
                                                animation: `barWave .88s ${i * 42}ms ease-in-out infinite`,
                                            }}/>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div ref={messagesEndRef}/>
                </div>

                {/* ── INPUT ── */}
                <div style={{
                    borderTop: '1px solid rgba(0,210,80,.07)',
                    padding: '12px 18px',
                    background: 'rgba(2,4,3,.96)',
                    flexShrink: 0, zIndex: 2,
                }}>
                    <div className="input-wrap" style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'rgba(0,210,80,.025)',
                        border: '1px solid rgba(0,210,80,.09)',
                        borderRadius: '3px', padding: '9px 12px',
                        transition: 'border-color .2s, box-shadow .2s',
                    }}>
                        <span style={{
                            fontSize: '11px', color: '#00d250',
                            textShadow: '0 0 5px rgba(0,210,80,.5)',
                            fontWeight: 500, flexShrink: 0, letterSpacing: '.04em',
                        }}>~$</span>
                        <input
                            type="text" value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="posez votre question..."
                            disabled={isLoading || !bootDone}
                            style={{
                                flex: 1, background: 'transparent',
                                border: 'none', outline: 'none',
                                color: '#00d250', fontSize: '12px',
                                fontFamily: "'IBM Plex Mono',monospace",
                                fontWeight: 300, caretColor: '#00d250', letterSpacing: '.02em',
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading || !bootDone}
                            className="send-btn"
                            style={{
                                background: input.trim() && !isLoading ? 'rgba(0,210,80,.1)' : 'transparent',
                                border: `1px solid ${input.trim() && !isLoading ? 'rgba(0,210,80,.3)' : 'rgba(0,210,80,.05)'}`,
                                borderRadius: '2px', padding: '5px 14px',
                                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                transition: 'all .15s',
                                color: input.trim() && !isLoading ? '#00d250' : '#3a7a50',
                                fontSize: '8px', fontFamily: "'IBM Plex Mono',monospace",
                                letterSpacing: '.12em', fontWeight: 500,
                            }}
                        >
                            ENVOYER <Send size={8}/>
                        </button>
                    </div>

                    <div style={{ marginTop: '7px', display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '7px', color: '#5aaa70', letterSpacing: '.08em' }}>↵ ENVOYER</span>
                        <span style={{ fontSize: '7px', color: '#3a7a50', letterSpacing: '.08em' }}>↑↓ HISTORIQUE</span>
                        <span style={{ fontSize: '7px', color: '#3a7a50', letterSpacing: '.08em' }}>ESC EFFACER</span>
                    </div>
                </div>

            </div>
        </div>
    );
}