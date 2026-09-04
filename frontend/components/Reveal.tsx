'use client';

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

interface RevealProps {
    children: ReactNode;
    delay?: number;
    style?: CSSProperties;
    className?: string;
}

export function Reveal({ children, delay = 0, style, className = '' }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal${visible ? ' reveal--visible' : ''} ${className}`}
            style={{ ...style, transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
