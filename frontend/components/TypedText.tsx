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
    return (
        <div>
            <MarkdownContent content={displayed} />
            {!done && <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#63b3ff', verticalAlign: 'text-bottom', animation: 'cursorBlink .6s step-end infinite' }} />}
        </div>
    );
}