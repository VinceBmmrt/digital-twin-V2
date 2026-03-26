'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MarkdownContent } from './MarkdownContent';

/* ── Typewriter ── */
export function TypedText({ text }: { text: string }) {
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