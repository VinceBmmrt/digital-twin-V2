'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

function MarkdownContent({ content }: { content: string }) {
    return (
        <div className="text-[#00b844] text-[13px] leading-[1.78] font-light font-['IBM_Plex_Mono',monospace]">
            <ReactMarkdown
                components={{
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00d250] underline underline-offset-[3px] [text-shadow:0_0_8px_rgba(0,210,80,.3)] hover:opacity-80 transition-opacity"
                        >
                            {children}
                        </a>
                    ),
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="text-[#00d250] font-medium">{children}</strong>,
                    ol: ({ children }) => <ol className="pl-[18px] my-1 mb-2">{children}</ol>,
                    ul: ({ children }) => <ul className="pl-[18px] my-1 mb-2">{children}</ul>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
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

    if (done) return <MarkdownContent content={text} />;

    return (
        <span className="text-[#00b844] text-[13px] leading-[1.78] font-light">
            {displayed}
            <span className="[animation:blink_.6s_step-end_infinite] text-[#00d250]">▌</span>
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
        <div className="relative h-full font-['IBM_Plex_Mono',monospace]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Bebas+Neue&display=swap');

                @keyframes blink      { 0%,100%{opacity:1}  50%{opacity:0} }
                @keyframes scanline   { 0%{top:-2px} 100%{top:calc(100% + 2px)} }
                @keyframes bootLine   { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }
                @keyframes msgIn      { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
                @keyframes barWave    { 0%,100%{transform:scaleY(.2)} 50%{transform:scaleY(1)} }
                @keyframes pulseGlow  { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
                @keyframes tagIn      { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }

                .msg-in  { animation: msgIn .18s ease both; }
                .ctx-tag { animation: tagIn .3s ease both; }

                ::-webkit-scrollbar       { width: 2px; }
                ::-webkit-scrollbar-thumb { background: rgba(0,210,80,.12); border-radius: 2px; }

                input::placeholder { color:#3a7a50; font-family:'IBM Plex Mono',monospace; font-style:italic; font-size:15px; }

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
            <div className={`h-full bg-gradient-to-b from-[#03080a] to-[#020507] flex flex-col overflow-hidden relative transition-[filter] duration-75 ${glitch ? 'brightness-125 hue-rotate-[14deg]' : ''}`}>

                {/* Scanline + CRT overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div className="absolute left-0 right-0 h-px bg-gradient-to-b from-transparent via-[rgba(0,210,80,.04)] to-transparent [animation:scanline_6s_linear_infinite]" />
                    <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,.09)_3px,rgba(0,0,0,.09)_4px)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_42%,rgba(0,0,0,.55)_100%)]" />
                </div>

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-5 py-[11px] border-b border-[rgba(0,210,80,.08)] bg-[rgba(2,5,4,.94)] shrink-0 z-[2]">
                    <div className="flex items-center gap-[13px]">
                        <div className="relative w-2 h-2 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#00d250] shadow-[0_0_6px_#00d250,0_0_16px_rgba(0,210,80,.5)] [animation:pulseGlow_2.8s_ease-in-out_infinite]" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-['Bebas_Neue',cursive] text-[17px] tracking-[.15em] text-[#00d250] [text-shadow:0_0_10px_rgba(0,210,80,.4)]">
                                    DIGITAL TWIN
                                </span>
                                <span className="text-[8px] text-[#2a6640] tracking-[.08em]">— Vincent Bommert</span>
                            </div>
                            <div className="text-[7px] text-[#2a6640] tracking-[.12em] mt-px">
                                LLM · RAG · MULTI-AGENTS · FULLSTACK
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-[18px] items-center">
                        <span className="text-[8px] text-[#2a6640] tracking-[.08em]">
                            CTX&nbsp;<span className="text-[#00d250]">{messages.length * 2 + 1}K</span>
                        </span>
                        <span className="text-[8px] text-[#2a6640] tracking-[.06em]">{timeStr}</span>
                        {sessionId && (
                            <span className="text-[7px] text-[#2a6640] bg-[rgba(0,210,80,.04)] border border-[rgba(0,210,80,.08)] rounded-sm px-[7px] py-0.5 tracking-[.05em]">
                                #{sessionId.slice(0, 7).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── MESSAGES AREA ── */}
                <div className="flex-1 overflow-y-auto px-[22px] py-5 flex flex-col z-[2]">

                    {/* ── BOOT ── */}
                    {!bootDone ? (
                        <div className="text-[10px] leading-[2.2]">
                            {([
                                ['> INITIALIZING AI DIGITAL TWIN...', '#3a7a50', false],
                                ['> LOADING LLM CONTEXT WINDOW.............. OK', '#3a7a50', false],
                                ['> MOUNTING EXPERIENCE CORPUS...... OK', '#3a7a50', false],
                                ['> INDEXING RAG KNOWLEDGE BASE............. OK', '#4a9060', false],
                                ['> CONNECTING TO NOVA MODELS.............. OK', '#4a9060', false],
                                ['> ALL SYSTEMS OPERATIONAL.', '#00d250', true],
                            ] as [string, string, boolean][]).map(([line, color, glow], i) => (
                                <div
                                    key={String(line)}
                                    style={{
                                        animation: `bootLine .22s ${i * 220}ms ease both`,
                                        opacity: 0,
                                        color,
                                        textShadow: glow ? '0 0 10px rgba(0,210,80,.4)' : undefined,
                                    }}
                                >
                                    {line}
                                </div>
                            ))}
                        </div>

                    ) : messages.length === 0 ? (

                        /* ── EMPTY STATE ── */
                        <div className="[animation:msgIn_.4s_ease_both]">
                            <div className="mb-5 px-[18px] py-[14px] bg-[rgba(0,210,80,.025)] border border-[rgba(0,210,80,.09)] border-l-2 border-l-[rgba(0,210,80,.6)] rounded-r-[3px]">
                                <p className="text-[#00b844] text-[13px] m-0 mb-[5px] font-normal leading-[1.5]">
                                    Bonjour — je suis le Digital Twin de{' '}
                                    <span className="text-[#00d250] font-medium [text-shadow:0_0_6px_rgba(0,210,80,.3)]">
                                        Vincent Bommert
                                    </span>.
                                </p>
                                <p className="text-[#3a8050] text-[10px] m-0 font-light italic leading-[1.6]">
                                    Mes expériences en LLM, RAG et production cloud sont chargées en contexte.
                                </p>
                            </div>

                            <div className="flex items-center gap-[10px] mb-3">
                                <div className="flex-1 h-px bg-[rgba(0,210,80,.06)]" />
                                <span className="text-[7px] text-[#2a6640] tracking-[.14em]">SUGGESTIONS</span>
                                <div className="flex-1 h-px bg-[rgba(0,210,80,.06)]" />
                            </div>

                            <div className="flex flex-col gap-[5px]">
                                {SUGGESTIONS.map(p => (
                                    <button
                                        key={p}
                                        className="sug-btn bg-transparent border border-[rgba(0,210,80,.09)] border-l-2 border-l-[rgba(0,210,80,.3)] rounded-r-sm px-3 py-[7px] cursor-pointer text-left font-['IBM_Plex_Mono',monospace] text-[11px] text-[#3a8050] font-light leading-[1.4] transition-all duration-150"
                                        onClick={() => setInput(p)}
                                    >
                                        <span className="text-[#2a6640] mr-[6px]">›</span>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                    ) : (

                        /* ── MESSAGES ── */
                        <>
                            {messages.map((msg, idx) => (
                                <div key={msg.id} className="msg-in mb-4">
                                    {msg.role === 'user' ? (
                                        <div>
                                            <div className="flex items-center gap-[9px] mb-[3px]">
                                                <span className="text-[7px] text-[#3a8050] tracking-[.12em] font-medium">VOUS</span>
                                                <span className="text-[7px] text-[#2a6640] tracking-[.06em]">
                                                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="pl-[13px] border-l-2 border-l-[rgba(0,210,80,.22)] text-[#2ecc5a] text-[13px] leading-[1.68] font-light">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-[10px] mb-[5px]">
                                                <span className="text-[7px] text-[#00d250] tracking-[.12em] font-medium [text-shadow:0_0_5px_rgba(0,210,80,.3)]">
                                                    V.BOMMERT
                                                </span>
                                                <span className="text-[7px] text-[#2a6640] tracking-[.06em]">
                                                    {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                                <span className="text-[7px] text-[#2a6640] ml-auto tracking-[.05em]">
                                                    MSG_{String(idx).padStart(3, '0')}
                                                </span>
                                                <button
                                                    onClick={() => copyMessage(msg.content, msg.id)}
                                                    className={`rounded-sm cursor-pointer text-[7px] tracking-[.08em] font-['IBM_Plex_Mono',monospace] transition-all duration-150 px-[7px] py-0.5 ${
                                                        copied === msg.id
                                                            ? 'bg-[rgba(0,210,80,.15)] border border-[rgba(0,210,80,.5)] text-[#00d250]'
                                                            : 'bg-[rgba(0,210,80,.06)] border border-[rgba(0,210,80,.25)] text-[#5aaa70]'
                                                    }`}
                                                >
                                                    {copied === msg.id ? 'COPIÉ ✓' : 'COPIER'}
                                                </button>
                                            </div>
                                            <div className="bg-gradient-to-br from-[rgba(0,210,80,.04)] to-[rgba(0,210,80,.015)] border border-[rgba(0,210,80,.1)] border-l-2 border-l-[rgba(0,210,80,.6)] px-4 py-3 rounded-r-[3px] shadow-[0_2px_18px_rgba(0,0,0,.22)]">
                                                {idx === messages.length - 1 && msg.role === 'assistant'
                                                    ? <TypedText text={msg.content} />
                                                    : <MarkdownContent content={msg.content} />
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading bar-wave */}
                            {isLoading && (
                                <div className="mb-4">
                                    <div className="text-[7px] text-[#00d250] tracking-[.1em] mb-[7px]">
                                        V.BOMMERT&nbsp;
                                        <span className="text-[#2a6640]">— GÉNÉRATION...</span>
                                    </div>
                                    <div className="flex gap-[3px] items-center h-5 pl-[13px]">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-0.5 h-5 bg-[rgba(0,210,80,.45)] rounded-sm origin-center"
                                                style={{ animation: `barWave .88s ${i * 42}ms ease-in-out infinite` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── INPUT ── */}
                <div className="border-t border-[rgba(0,210,80,.07)] px-6 py-4 bg-[rgba(2,4,3,.96)] shrink-0 z-[2]">
                    <div className="input-wrap flex items-center gap-3 bg-[rgba(0,210,80,.025)] border border-[rgba(0,210,80,.09)] rounded-[3px] px-4 py-3 transition-[border-color,box-shadow] duration-200">
                        <span className="text-[14px] text-[#00d250] [text-shadow:0_0_5px_rgba(0,210,80,.5)] font-medium shrink-0 tracking-[.04em]">~$</span>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="posez votre question..."
                            disabled={isLoading || !bootDone}
                            className="flex-1 bg-transparent border-none outline-none text-[#00d250] text-[15px] font-['IBM_Plex_Mono',monospace] font-light caret-[#00d250] tracking-[.02em]"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading || !bootDone}
                            className={`send-btn rounded-sm px-4 py-2 flex items-center gap-[6px] transition-all duration-150 text-[11px] font-['IBM_Plex_Mono',monospace] tracking-[.12em] font-medium ${
                                input.trim() && !isLoading
                                    ? 'bg-[rgba(0,210,80,.1)] border border-[rgba(0,210,80,.3)] text-[#00d250] cursor-pointer'
                                    : 'bg-transparent border border-[rgba(0,210,80,.05)] text-[#3a7a50] cursor-not-allowed'
                            }`}
                        >
                            ENVOYER <Send size={11} />
                        </button>
                    </div>

                    <div className="mt-2 flex gap-4">
                        <span className="text-[9px] text-[#5aaa70] tracking-[.08em]">↵ ENVOYER</span>
                        <span className="text-[9px] text-[#3a7a50] tracking-[.08em]">↑↓ HISTORIQUE</span>
                        <span className="text-[9px] text-[#3a7a50] tracking-[.08em]">ESC EFFACER</span>
                    </div>
                </div>

            </div>
        </div>
    );
}