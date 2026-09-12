'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { VECTOR_CLUSTERS } from './constants';
import { Reveal } from './Reveal';

function makeGlowTexture(): THREE.Texture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(220, 240, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(147, 210, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(99, 179, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

interface NodeEntry {
    sprite: THREE.Sprite;
    label: string;
    cluster: number;
    centerX: number;
    centerY: number;
    centerZ: number;
}

interface FillerEntry {
    sprite: THREE.Sprite;
    centerX: number;
    centerY: number;
    centerZ: number;
}

const FILLER_PER_POINT = 4;

export default function VectorSpace3D() {
    const mountRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        const tooltip = tooltipRef.current;
        if (!mount || !tooltip) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();
        // Fog fades distant points toward the page background, so depth reads
        // immediately on load instead of only once auto-rotate has turned.
        scene.fog = new THREE.Fog(0x060d18, 6, 15);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        // Off-axis start position (not aligned with the cluster distribution's
        // pole axis) so the 3D depth is visible on the very first frame.
        camera.position.set(3.4, 2.4, 6.8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Bloom gives the glow sprites a neon halo, like a real embedding-space
        // visualization, instead of flat additive-blended dots.
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.9, 0.55, 0.15);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        // OrbitControls forces touchAction: 'none' on connect to capture touch
        // drags for rotation, which also blocks the page from scrolling past
        // this section on mobile. Disable touch rotation and hand the gesture
        // back to the browser so a vertical swipe scrolls the page as normal.
        controls.touches.ONE = null;
        controls.touches.TWO = null;
        renderer.domElement.style.touchAction = 'pan-y';

        const glowTexture = makeGlowTexture();
        const nodes: NodeEntry[] = [];
        const fillers: FillerEntry[] = [];

        const randomInSphere = (radius: number) => {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * Math.cbrt(Math.random());
            return {
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
            };
        };

        const clusterRadius = 3.6;
        VECTOR_CLUSTERS.forEach((cluster, ci) => {
            const t = ci / VECTOR_CLUSTERS.length;
            const phi = Math.acos(1 - 2 * (t + 0.5 / VECTOR_CLUSTERS.length));
            const theta = Math.PI * (1 + Math.sqrt(5)) * ci;
            // Vary the distance from center per cluster (not just the angle),
            // so clusters fill the whole 3D volume instead of sitting on a
            // single spherical shell, which looked flat/aligned from outside.
            const r = clusterRadius * (0.45 + Math.random() * 0.85);
            const cx = r * Math.sin(phi) * Math.cos(theta);
            const cy = r * Math.sin(phi) * Math.sin(theta);
            const cz = r * Math.cos(phi);
            const clusterColor = new THREE.Color(cluster.color);

            // Each cluster gets its own elongated/flattened shape instead of a
            // uniform sphere, so they don't all look like the same blob.
            const shapeAxis = {
                x: 0.5 + Math.random() * 1.4,
                y: 0.5 + Math.random() * 1.4,
                z: 0.5 + Math.random() * 1.4,
            };

            cluster.points.forEach((label, pi) => {
                const localT = pi / cluster.points.length;
                const localPhi = Math.acos(1 - 2 * (localT + 0.5 / cluster.points.length));
                const localTheta = Math.PI * (1 + Math.sqrt(5)) * pi * 1.3;
                const r = 0.5;
                const x = cx + r * Math.sin(localPhi) * Math.cos(localTheta) * shapeAxis.x;
                const y = cy + r * Math.sin(localPhi) * Math.sin(localTheta) * shapeAxis.y;
                const z = cz + r * Math.cos(localPhi) * shapeAxis.z;

                const material = new THREE.SpriteMaterial({
                    map: glowTexture,
                    color: clusterColor,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    opacity: 0.9,
                });
                const sprite = new THREE.Sprite(material);
                sprite.position.set(x, y, z);
                sprite.scale.setScalar(0.34);
                sprite.userData = { label, cluster: ci };
                scene.add(sprite);
                nodes.push({ sprite, label, cluster: ci, centerX: cx, centerY: cy, centerZ: cz });
            });

            // Dozens of small unlabeled points per cluster, purely to give the
            // impression of a dense embedding cloud (not real data points).
            // Density and spread scale with how many real skills are in the
            // cluster, so bigger areas of expertise read as bigger clouds.
            const fillerCount = cluster.points.length * FILLER_PER_POINT;
            const spread = 0.65 + cluster.points.length * 0.06 + (ci % 2) * 0.08;
            for (let i = 0; i < fillerCount; i++) {
                const offset = randomInSphere(spread);
                const x = cx + offset.x * shapeAxis.x;
                const y = cy + offset.y * shapeAxis.y;
                const z = cz + offset.z * shapeAxis.z;

                const material = new THREE.SpriteMaterial({
                    map: glowTexture,
                    color: clusterColor,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    opacity: 0.28 + Math.random() * 0.2,
                });
                const sprite = new THREE.Sprite(material);
                sprite.position.set(x, y, z);
                sprite.scale.setScalar(0.1 + Math.random() * 0.08);
                scene.add(sprite);
                fillers.push({ sprite, centerX: cx, centerY: cy, centerZ: cz });
            }
        });

        // Faint lines from each labeled point to its cluster centroid, for ambient structure.
        for (const n of nodes) {
            const cluster = VECTOR_CLUSTERS[n.cluster];
            const lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(cluster.color), transparent: true, opacity: 0.1 });
            const geo = new THREE.BufferGeometry().setFromPoints([
                n.sprite.position,
                new THREE.Vector3(n.centerX, n.centerY, n.centerZ),
            ]);
            scene.add(new THREE.Line(geo, lineMaterial));
        }

        // Hoisted once instead of rebuilt every animation frame, `nodes` never
        // changes after setup.
        const nodeSprites = nodes.map((n) => n.sprite);

        // Highlight line group, rebuilt on hover.
        let highlightLines = new THREE.Group();
        scene.add(highlightLines);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(-10, -10);
        let hovered: NodeEntry | null = null;

        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };
        const onPointerLeave = () => {
            pointer.set(-10, -10);
        };
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerleave', onPointerLeave);

        const resize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
            bloomPass.setSize(w, h);
        };
        window.addEventListener('resize', resize);

        const clock = new THREE.Clock();
        let raf = 0;
        let isRunning = false;

        const animate = () => {
            if (!isRunning) return;
            raf = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            for (const n of nodes) {
                n.sprite.position.y = n.centerY + Math.sin(t * 0.6 + n.centerX * 3) * 0.03;
            }
            for (const f of fillers) {
                f.sprite.position.y = f.centerY + Math.sin(t * 0.4 + f.centerX * 5) * 0.05;
            }

            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(nodeSprites);
            const hit = hits[0]?.object as THREE.Sprite | undefined;
            const newHovered = hit ? nodes.find((n) => n.sprite === hit) ?? null : null;

            if (newHovered !== hovered) {
                hovered = newHovered;
                scene.remove(highlightLines);
                highlightLines.traverse((obj) => {
                    if (obj instanceof THREE.Line) {
                        obj.geometry.dispose();
                        (obj.material as THREE.Material).dispose();
                    }
                });
                highlightLines = new THREE.Group();

                for (const n of nodes) {
                    const isHovered = n === hovered;
                    const isNeighbor = hovered && n.cluster === hovered.cluster && n !== hovered;
                    const mat = n.sprite.material as THREE.SpriteMaterial;
                    mat.opacity = hovered ? (isHovered ? 1 : isNeighbor ? 0.85 : 0.15) : 0.9;
                    n.sprite.scale.setScalar(isHovered ? 0.5 : isNeighbor ? 0.4 : 0.34);
                }
                for (const f of fillers) {
                    const mat = f.sprite.material as THREE.SpriteMaterial;
                    mat.opacity = hovered ? 0.08 : 0.28 + Math.random() * 0.2;
                }

                if (hovered) {
                    const hiColor = new THREE.Color(VECTOR_CLUSTERS[hovered.cluster].color);
                    const hiMat = new THREE.LineBasicMaterial({ color: hiColor, transparent: true, opacity: 0.6 });
                    for (const n of nodes) {
                        if (n.cluster === hovered.cluster && n !== hovered) {
                            const geo = new THREE.BufferGeometry().setFromPoints([hovered.sprite.position, n.sprite.position]);
                            highlightLines.add(new THREE.Line(geo, hiMat));
                        }
                    }
                }
                scene.add(highlightLines);
            }

            if (hovered) {
                const proj = hovered.sprite.position.clone().project(camera);
                const x = (proj.x * 0.5 + 0.5) * mount.clientWidth;
                const y = (-proj.y * 0.5 + 0.5) * mount.clientHeight;
                tooltip.style.opacity = '1';
                tooltip.style.left = `${x + 14}px`;
                tooltip.style.top = `${y - 20}px`;
                tooltip.innerHTML = `<b>${hovered.label}</b><br/>cluster : ${VECTOR_CLUSTERS[hovered.cluster].name}`;
            } else {
                tooltip.style.opacity = '0';
            }

            controls.update();
            composer.render();
        };

        // Only render while the section is actually visible on screen.
        // This is the most GPU-intensive component on the page, no reason
        // to keep it spinning while the user is reading somewhere else.
        const startLoop = () => {
            if (isRunning) return;
            isRunning = true;
            animate();
        };
        const stopLoop = () => {
            isRunning = false;
            cancelAnimationFrame(raf);
        };
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) startLoop();
                else stopLoop();
            },
            { threshold: 0.01 },
        );
        visibilityObserver.observe(mount);

        return () => {
            stopLoop();
            visibilityObserver.disconnect();
            window.removeEventListener('resize', resize);
            renderer.domElement.removeEventListener('pointermove', onPointerMove);
            renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
            controls.dispose();
            scene.traverse((obj) => {
                if (obj instanceof THREE.Sprite || obj instanceof THREE.Line) {
                    // THREE.Sprite instances share one module-level geometry
                    // singleton, so only Line geometries (unique per instance)
                    // should be disposed here.
                    if (obj instanceof THREE.Line) obj.geometry.dispose();
                    const mat = obj.material;
                    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
                    else mat?.dispose?.();
                }
            });
            glowTexture.dispose();
            composer.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <section className="vector-section">
            <Reveal>
                <div className="vector-canvas-wrap" ref={mountRef}>
                    <div ref={tooltipRef} className="vector-tooltip" />
                </div>
            </Reveal>
        </section>
    );
}
