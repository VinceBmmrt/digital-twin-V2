'use client';

import { useRef, type ReactNode, type CSSProperties } from 'react';

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export function SpotlightCard({ children, className = '', style }: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMouseMove}
            className={`spotlight-card ${className}`}
            style={style}
        >
            <div className="spotlight-glow" />
            <div className="spotlight-content">{children}</div>
        </div>
    );
}
