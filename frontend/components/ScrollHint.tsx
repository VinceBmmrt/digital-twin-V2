'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollHint() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 900);
        const onScroll = () => {
            if (window.scrollY > 40) setVisible(false);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            clearTimeout(showTimer);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className={`scroll-hint${visible ? ' scroll-hint--visible' : ''}`}>
            <span className="scroll-hint-label">Découvrir</span>
            <ChevronDown size={14} className="scroll-hint-chevron" />
        </div>
    );
}
