'use client';

import { useRef, useEffect } from 'react';


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

        const mouse = { x: -9999, y: -9999 };
        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        type Pulse = { x: number; y: number; start: number };
        const pulses: Pulse[] = [];
        const PULSE_DURATION = 1100, PULSE_MAX_RADIUS = 340;
        const onPulse = () => {
            pulses.push({ x: W() / 2, y: H() / 2, start: performance.now() });
        };
        window.addEventListener('twin:pulse', onPulse);

        let raf: number;
        let running = false;
        const draw = () => {
            if (!running) return;
            raf = requestAnimationFrame(draw);
            const w = W(), h = H();
            ctx.clearRect(0, 0, w, h);

            const now = performance.now();
            for (let i = pulses.length - 1; i >= 0; i--) {
                if (now - pulses[i].start > PULSE_DURATION) pulses.splice(i, 1);
            }

            for (const n of nodes) {
                const dx = n.x - mouse.x, dy = n.y - mouse.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const REPEL_RADIUS = 110;
                if (d < REPEL_RADIUS && d > 0.01) {
                    const force = (1 - d / REPEL_RADIUS) * 0.6;
                    n.vx += (dx / d) * force;
                    n.vy += (dy / d) * force;
                }
                n.vx *= 0.96; n.vy *= 0.96;
                const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
                if (speed < 0.05) { n.vx += (Math.random() - 0.5) * 0.02; n.vy += (Math.random() - 0.5) * 0.02; }

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

            for (const p of pulses) {
                const t = (now - p.start) / PULSE_DURATION;
                const radius = t * PULSE_MAX_RADIUS;
                const alpha = (1 - t) * 0.35;
                ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(99,179,255,${alpha})`; ctx.lineWidth = 1.4; ctx.stroke();

                for (const n of nodes) {
                    const dx = n.x - p.x, dy = n.y - p.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (Math.abs(d - radius) < 26) {
                        const boost = (1 - Math.abs(d - radius) / 26) * (1 - t);
                        const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
                        gr.addColorStop(0, `rgba(147,210,255,${boost * 0.6})`); gr.addColorStop(1, 'rgba(147,210,255,0)');
                        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
                    }
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
        };

        const startLoop = () => { if (running) return; running = true; draw(); };
        const stopLoop = () => { running = false; cancelAnimationFrame(raf); };
        const onVisibility = () => { if (document.hidden) stopLoop(); else startLoop(); };
        document.addEventListener('visibilitychange', onVisibility);
        startLoop();

        return () => {
            stopLoop();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('twin:pulse', onPulse);
        };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}