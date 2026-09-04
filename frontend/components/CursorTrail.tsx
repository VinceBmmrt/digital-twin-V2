'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    r: number;
}

export function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let particles: Particle[] = [];
        let lastSpawn = 0;

        const onMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastSpawn < 25) return;
            lastSpawn = now;
            particles.push({
                x: e.clientX,
                y: e.clientY,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 0.5 - 0.15,
                life: 1,
                r: Math.random() * 1.8 + 0.8,
            });
            if (particles.length > 100) particles.splice(0, particles.length - 100);
        };
        window.addEventListener('mousemove', onMove);

        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter((p) => p.life > 0);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.025;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(p.r * p.life, 0), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 179, 255, ${p.life * 0.55})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
    );
}
