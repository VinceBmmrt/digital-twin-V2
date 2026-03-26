'use client';

import { useState, useRef, useEffect, useCallback } from 'react';


/* ── Neural canvas ── */
export function NeuralCanvas() {
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