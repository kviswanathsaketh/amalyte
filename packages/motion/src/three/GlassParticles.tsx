'use client';

// GlassParticles — interaction family #2 of the 2026-08-27 "Liquid
// Monochrome" direction: a full-viewport field of TINY liquid-glass droplets
// (THREE.Points, ~6000 by default) that collectively form a shape and morph
// between shapes. Raw Three.js, no @react-three/fiber — R3F's reconciler
// crashes at runtime under Next 16 + React 18 in this monorepo (see
// RawGlassHero.tsx's header comment for the full story). Same activation
// contract as the hero: useHeroActivation gates (>=1024px + WebGL2 + motion
// allowed), IntersectionObserver defers mounting until near the viewport and
// pauses rendering when offscreen, DPR capped at 2, ParticlesFallback poster
// in every other case (including prefers-reduced-motion).
//
// DRIVING MORPHS — pick one, in priority order:
//   1. `progress` prop (0..1 across `shapes`): fully controlled, e.g. a
//      parent scrubbing via its own GSAP ScrollTrigger.
//   2. `scrollDriven`: the component creates its own ScrollTrigger scrubbed
//      against its position travelling through the viewport (works with or
//      without ScrollProvider/Lenis — ScrollTrigger listens to native
//      scroll; a plain scroll-listener fallback covers exotic environments).
//   3. neither: slow auto-cycle ping-pong across the shapes (ambient mode
//      for standalone hero/background use).
// The segment fraction is eased with --ease-amalyte (see ./morphMath) and
// mixed between two shape-target attributes in the vertex shader, so morphs
// cost zero CPU per frame. A gentle per-droplet sinusoidal drift keeps the
// field liquid, and the only pointer interaction is surface tension:
// droplets near the cursor are displaced with a soft falloff and ease back.

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticlesFallback } from './ParticlesFallback';
import type { HeroPalette } from './palette';
import { LIQUID_MONOCHROME } from './palette';
import { useHeroActivation } from './useHeroActivation';
import { PARTICLES_FRAGMENT_SHADER, PARTICLES_VERTEX_SHADER } from './shaders';
import {
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_PARTICLE_SHAPES,
  generateShapeTargets,
  resolveParticleCount,
  type ParticleShapeId,
} from './particleShapes';
import { progressThroughViewport, resolveMorph } from './morphMath';

gsap.registerPlugin(ScrollTrigger);

const OBSERVER_ROOT_MARGIN = '240px 0px';
const DPR_CAP = 2;
// Auto-cycle (mode 3): seconds for a full 0 -> 1 pass across all shapes;
// the field then ping-pongs back. Easing per segment happens in resolveMorph.
const AUTO_CYCLE_SECONDS = 12;
// Pointer surface tension: attack is quick, release is slow (springy settle).
const POINTER_ATTACK_LAMBDA = 8;
const POINTER_RELEASE_LAMBDA = 2.5;
const POINTER_SPEED_TO_FORCE = 0.012;
const IDLE_SPIN_Y = 0.05;

export function GlassParticles({
  shapes = DEFAULT_PARTICLE_SHAPES,
  count = DEFAULT_PARTICLE_COUNT,
  progress,
  scrollDriven = false,
  palette = LIQUID_MONOCHROME,
  className,
}: {
  /** Shape ids to morph between, in order. */
  shapes?: ParticleShapeId[];
  /** Droplet count before auto-reduction (small viewports / 1x DPR scale down). */
  count?: number;
  /** Controlled morph progress, 0..1 across `shapes`. Overrides scrollDriven. */
  progress?: number;
  /** Scrub morphs from this component's own position in the document. */
  scrollDriven?: boolean;
  /** Refraction tint — defaults to the group-wide Liquid Monochrome trio. */
  palette?: HeroPalette;
  className?: string;
}) {
  const active = useHeroActivation();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // All high-frequency drivers live in refs — a scrub or pointermove must
  // never re-render the component.
  const progressRef = useRef(0);
  const elapsedRef = useRef(0);
  // Which driver owns progressRef — kept in a ref so toggling `progress` /
  // `scrollDriven` never rebuilds the renderer.
  const driverRef = useRef<'prop' | 'scroll' | 'auto'>('auto');
  driverRef.current = progress !== undefined ? 'prop' : scrollDriven ? 'scroll' : 'auto';

  // Mount the canvas only once the host nears the viewport (RawGlassHero's
  // one-shot observer pattern).
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

  // Mode 1: controlled progress prop wins outright.
  useEffect(() => {
    if (progress !== undefined) progressRef.current = progress;
  }, [progress]);

  // Mode 2: self-driven scroll scrub. ScrollTrigger handles both the Lenis
  // case (ScrollProvider calls ScrollTrigger.update) and plain native
  // scroll; the catch branch covers environments where ScrollTrigger can't
  // attach (locked-down embeds) with an equivalent plain scroll listener.
  useEffect(() => {
    if (!scrollDriven || progress !== undefined) return;
    const node = hostRef.current;
    if (!node) return;

    let trigger: ScrollTrigger | undefined;
    let removeFallback: (() => void) | undefined;
    try {
      trigger = ScrollTrigger.create({
        trigger: node,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    } catch {
      const update = () => {
        const rect = node.getBoundingClientRect();
        progressRef.current = progressThroughViewport(
          rect.top,
          rect.height,
          window.innerHeight
        );
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      removeFallback = () => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    }
    return () => {
      trigger?.kill();
      removeFallback?.();
    };
  }, [scrollDriven, progress]);

  const showCanvas = active && inView;
  const shapeKey = shapes.join(',');

  useEffect(() => {
    if (!showCanvas) return;
    const host = canvasHostRef.current;
    if (!host) return;

    const shapeIds = shapeKey.split(',') as ParticleShapeId[];

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    renderer.setPixelRatio(pixelRatio);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const resolvedCount = resolveParticleCount(count, pixelRatio, window.innerWidth);
    const targets = generateShapeTargets(shapeIds, resolvedCount);

    // THREE.BufferGeometry requires a `position` attribute; it doubles as the
    // aFrom target, and aTo starts as the second shape (or the same one).
    const fromAttribute = new THREE.BufferAttribute(targets[0].slice(), 3);
    const toAttribute = new THREE.BufferAttribute(
      (targets[1] ?? targets[0]).slice(),
      3
    );
    const seeds = new Float32Array(resolvedCount);
    for (let i = 0; i < resolvedCount; i++) seeds[i] = (i + 0.5) / resolvedCount;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', fromAttribute);
    geometry.setAttribute('aFrom', fromAttribute);
    geometry.setAttribute('aTo', toAttribute);
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: PARTICLES_VERTEX_SHADER,
      fragmentShader: PARTICLES_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      // Additive-ish: low per-droplet alpha so overlaps glow slightly without
      // blowing out on the matte-black canvas.
      blending: THREE.AdditiveBlending,
      uniforms: {
        uHighlight: { value: new THREE.Color(palette.highlight) },
        uCore: { value: new THREE.Color(palette.core) },
        uShadow: { value: new THREE.Color(palette.shadow) },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 3.2 },
        uPixelRatio: { value: pixelRatio },
        uPointer: { value: new THREE.Vector3(0, 0, 999) },
        uPointerForce: { value: 0 },
        uLightDir: { value: new THREE.Vector3(-0.35, 0.8, 0.6).normalize() },
      },
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

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

    // Pause-when-offscreen: a second observer (this one keeps observing)
    // toggles a flag the raf loop checks before doing any work.
    let visible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    visibilityObserver.observe(host);

    // Pointer state — normalized coords projected onto the z=0 plane, plus a
    // damped force so the displacement eases back out after the cursor slows.
    let pointerNormX = 0;
    let pointerNormY = 0;
    let pointerForceTarget = 0;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerNormX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNormY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      if (lastPointerX !== null && lastPointerY !== null) {
        const speed = Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY);
        pointerForceTarget = Math.min(1, pointerForceTarget + speed * POINTER_SPEED_TO_FORCE);
      }
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
    };
    const handlePointerLeave = () => {
      pointerForceTarget = 0;
      lastPointerX = null;
      lastPointerY = null;
    };
    host.addEventListener('pointermove', handlePointerMove);
    host.addEventListener('pointerleave', handlePointerLeave);

    // Which shape-pair the attributes currently hold — re-uploaded only when
    // resolveMorph crosses a boundary, not per frame.
    let boundFrom = 0;
    let boundTo = shapeIds.length > 1 ? 1 : 0;

    let raf = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      raf = window.requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!visible) return;

      elapsedRef.current += delta;
      (material.uniforms.uTime.value as number) = elapsedRef.current;

      // Mode 3: ambient ping-pong across the shapes when nothing drives us.
      if (driverRef.current === 'auto') {
        const phase = (elapsedRef.current / AUTO_CYCLE_SECONDS) % 2;
        progressRef.current = phase < 1 ? phase : 2 - phase;
      }

      const morph = resolveMorph(progressRef.current, shapeIds.length);
      if (morph.from !== boundFrom || morph.to !== boundTo) {
        fromAttribute.array.set(targets[morph.from]);
        fromAttribute.needsUpdate = true;
        toAttribute.array.set(targets[morph.to]);
        toAttribute.needsUpdate = true;
        boundFrom = morph.from;
        boundTo = morph.to;
      }
      (material.uniforms.uMix.value as number) = morph.mix;

      // Surface tension: force attacks fast while the cursor moves, damps to
      // zero after it stops — the field springs back to the formed shape.
      pointerForceTarget = THREE.MathUtils.damp(
        pointerForceTarget,
        0,
        POINTER_RELEASE_LAMBDA,
        delta
      );
      const force = material.uniforms.uPointerForce.value as number;
      material.uniforms.uPointerForce.value = THREE.MathUtils.damp(
        force,
        pointerForceTarget,
        POINTER_ATTACK_LAMBDA,
        delta
      );
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfWidth = halfHeight * camera.aspect;
      (material.uniforms.uPointer.value as THREE.Vector3).set(
        pointerNormX * halfWidth,
        pointerNormY * halfHeight,
        0
      );
      // The droplets' specular dot follows the cursor too — same light feel
      // as the mesh glass in RawGlassHero/GlassScrollScene.
      (material.uniforms.uLightDir.value as THREE.Vector3)
        .set(pointerNormX * 0.8, pointerNormY * 0.6 + 0.4, 0.6)
        .normalize();

      points.rotation.y += IDLE_SPIN_Y * delta;

      renderer.render(scene, camera);
    };
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener('pointermove', handlePointerMove);
      host.removeEventListener('pointerleave', handlePointerLeave);
      host.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // progress/scrollDriven feed progressRef via their own effects above —
    // changing them must not rebuild the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCanvas, shapeKey, count, palette.highlight, palette.core, palette.shadow]);

  return (
    // No hardcoded `relative` here — same reason as RawGlassHero: callers
    // pass `absolute inset-0` (or a sized block) and Tailwind's cascade would
    // otherwise let `relative` win and collapse the height to 0.
    <div ref={hostRef} aria-hidden="true" className={`overflow-hidden ${className ?? ''}`}>
      <ParticlesFallback palette={palette} className="absolute inset-0" />
      {showCanvas && <div ref={canvasHostRef} className="absolute inset-0" />}
    </div>
  );
}
