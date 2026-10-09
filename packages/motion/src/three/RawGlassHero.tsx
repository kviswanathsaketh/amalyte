'use client';

// RawGlassHero — the crazy-hero pass, built on raw Three.js (no
// @react-three/fiber). @react-three/fiber's reconciler crashes at runtime
// in this monorepo (Next.js 16's app-router runtime resolves React 19
// internals regardless of the app's declared React 18 dependency -- a
// known, already-flagged gap here, "papered over" via next.config.js's
// ignoreBuildErrors pending a real React 19 migration). Rather than force
// that migration under time pressure, this sidesteps react-reconciler
// entirely: same v8-glass GLSL (./shaders), same activation contract
// (./useHeroActivation, ./HeroFallback), same interaction design as
// GlassForm.tsx (cursor-reactive light + draggable-with-inertia rotation)
// -- just driven imperatively instead of through JSX/fiber.

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeroFallback } from './HeroFallback';
import type { HeroPalette, HeroIntensity } from './palette';
import { INTENSITY_SCALE } from './palette';
import { useHeroActivation } from './useHeroActivation';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER } from './shaders';

const OBSERVER_ROOT_MARGIN = '240px 0px';
const IDLE_SPIN_Y = 0.08;
const DRAG_SENSITIVITY = 0.006;
const SPIN_DAMP_LAMBDA = 2.2;
const LIGHT_DAMP_LAMBDA = 5;

export function RawGlassHero({
  palette,
  intensity = 'medium',
  posterSrc,
  className,
}: {
  palette: HeroPalette;
  intensity?: HeroIntensity;
  posterSrc?: string;
  className?: string;
}) {
  const active = useHeroActivation();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!active || inView) return;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: OBSERVER_ROOT_MARGIN }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active, inView]);

  const showCanvas = active && inView;

  useEffect(() => {
    if (!showCanvas) return;
    const host = canvasHostRef.current;
    if (!host) return;

    const intensityScale = INTENSITY_SCALE[intensity];

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const material = new THREE.ShaderMaterial({
      vertexShader: GLASS_VERTEX_SHADER,
      fragmentShader: GLASS_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uHighlight: { value: new THREE.Color(palette.highlight) },
        uCore: { value: new THREE.Color(palette.core) },
        uShadow: { value: new THREE.Color(palette.shadow) },
        uFlowTime: { value: 0 },
        uLightDir: { value: new THREE.Vector3(-0.35, 0.8, 0.6).normalize() },
        uOpacity: { value: 1 },
      },
    });
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.36, 220, 48);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Pointer state -- drag rotates the mesh with inertia; otherwise the
    // cursor position is the key light's target direction (crazy-hero pass).
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let spinVelocityX = 0;
    let spinVelocityY = IDLE_SPIN_Y;
    let pointerNormX = 0;
    let pointerNormY = 0;

    const setPointerFromEvent = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerNormX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNormY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerDown = (event: PointerEvent) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      host.setPointerCapture?.(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      setPointerFromEvent(event);
      if (!isDragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      spinVelocityX = dy * DRAG_SENSITIVITY * 30;
      spinVelocityY = dx * DRAG_SENSITIVITY * 30;
      mesh.rotation.y += dx * DRAG_SENSITIVITY;
      mesh.rotation.x += dy * DRAG_SENSITIVITY;
    };
    const handlePointerUp = () => {
      isDragging = false;
    };

    host.addEventListener('pointerdown', handlePointerDown);
    host.addEventListener('pointermove', handlePointerMove);
    host.addEventListener('pointerup', handlePointerUp);
    host.addEventListener('pointerleave', handlePointerUp);

    let raf = 0;
    let lastTime = performance.now();
    const flowSpeedBase = 0.35;

    const animate = (now: number) => {
      raf = window.requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const flowSpeed = flowSpeedBase * intensityScale;
      (material.uniforms.uFlowTime.value as number) += delta * flowSpeed;

      const light = material.uniforms.uLightDir.value as THREE.Vector3;
      const targetX = pointerNormX * 0.8;
      const targetY = pointerNormY * 0.6 + 0.4;
      light.x = THREE.MathUtils.damp(light.x, targetX, LIGHT_DAMP_LAMBDA, delta);
      light.y = THREE.MathUtils.damp(light.y, targetY, LIGHT_DAMP_LAMBDA, delta);
      light.z = THREE.MathUtils.damp(light.z, 0.6, LIGHT_DAMP_LAMBDA, delta);
      light.normalize();

      if (!isDragging) {
        spinVelocityX = THREE.MathUtils.damp(spinVelocityX, 0, SPIN_DAMP_LAMBDA, delta);
        spinVelocityY = THREE.MathUtils.damp(
          spinVelocityY,
          IDLE_SPIN_Y * intensityScale,
          SPIN_DAMP_LAMBDA,
          delta
        );
        mesh.rotation.y += spinVelocityY * delta;
        mesh.rotation.x += spinVelocityX * delta;
      }

      renderer.render(scene, camera);
    };
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      host.removeEventListener('pointerdown', handlePointerDown);
      host.removeEventListener('pointermove', handlePointerMove);
      host.removeEventListener('pointerup', handlePointerUp);
      host.removeEventListener('pointerleave', handlePointerUp);
      host.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [showCanvas, palette.highlight, palette.core, palette.shadow, intensity]);

  return (
    // No hardcoded `relative` here -- callers pass `absolute inset-0`
    // (this needs to size against ITS OWN ancestor, not establish its own
    // containing block), and Tailwind's generated stylesheet defines
    // `.relative` after `.absolute`, so combining them here would make
    // `relative` win regardless of className prop order, collapsing this
    // div's height to 0 since its children are all position:absolute.
    <div ref={hostRef} aria-hidden="true" className={`overflow-hidden ${className ?? ''}`}>
      <HeroFallback palette={palette} posterSrc={posterSrc} className="absolute inset-0" />
      {showCanvas && <div ref={canvasHostRef} className="absolute inset-0" />}
    </div>
  );
}
