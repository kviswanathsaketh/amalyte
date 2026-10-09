'use client';

// GlassScrollScene — interaction family #1 of the 2026-08-27 "Liquid
// Monochrome" direction: scroll-driven transitions between 3D glass objects.
// A sticky full-viewport canvas renders `steps` glass primitive meshes
// (torus knot -> rounded sphere -> icosahedron -> stacked-arc shell) using
// the shared v8 glass shader (./shaders: per-channel refract() dispersion,
// fresnel rim, wall-thickness shading), tinted by the Liquid Monochrome
// gradient trio so refractions carry the faint violet. Raw Three.js, no
// @react-three/fiber — see RawGlassHero.tsx's header comment for why.
//
// Layout contract: the component renders a relative track containing a
// sticky 100vh canvas layer, with `children` (the page's sections) pulled up
// over it via a -100vh margin. As the user scrolls through the children the
// canvas stays pinned and progress (0..1 across the track) scrubs the
// transitions: the current object eases out (scale down + drift up + fade)
// while the next eases in, both --ease-amalyte-spring-eased (./morphMath).
// If `children` are omitted the caller must drive `progress` itself.
//
// Scroll driver: GSAP ScrollTrigger scrubbed against the track — works with
// or without ScrollProvider/Lenis (ScrollTrigger listens to native scroll;
// Lenis just makes it smooth). A plain scroll-listener fallback covers
// environments where ScrollTrigger can't attach. The key light tracks the
// cursor (same feel as RawGlassHero), listening on window because page
// content overlays the canvas.
//
// Gating mirrors the hero: useHeroActivation (>=1024px + WebGL2 + motion
// allowed), IntersectionObserver mount deferral + offscreen pause, DPR cap
// 2, GlassScrollFallback poster otherwise (incl. prefers-reduced-motion).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlassScrollFallback } from './GlassScrollFallback';
import type { HeroPalette } from './palette';
import { LIQUID_MONOCHROME } from './palette';
import { useHeroActivation } from './useHeroActivation';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER } from './shaders';
import { progressWithinTrack, scrollObjectEnvelope } from './morphMath';

gsap.registerPlugin(ScrollTrigger);

const OBSERVER_ROOT_MARGIN = '240px 0px';
const DPR_CAP = 2;
const MIN_STEPS = 2;
const MAX_STEPS = 4;
const IDLE_SPIN_Y = 0.12;
const LIGHT_DAMP_LAMBDA = 5;

// One glass object per step, cycling through this set when steps < 4. The
// shell is a group of stacked partial tori (layered arcs like glass
// louvers); the rest are single meshes. All fit a ~1.6-unit radius.
function buildObject(kind: number): THREE.Group {
  const group = new THREE.Group();
  if (kind === 0) {
    group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(1.05, 0.34, 200, 40)));
  } else if (kind === 1) {
    group.add(new THREE.Mesh(new THREE.SphereGeometry(1.25, 96, 64)));
  } else if (kind === 2) {
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1)));
  } else {
    const layers = 5;
    for (let i = 0; i < layers; i++) {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(0.55 + i * 0.24, 0.09, 24, 96, Math.PI * 1.15)
      );
      arc.rotation.x = -0.45 - i * 0.1;
      arc.rotation.z = Math.PI * (1 - 1.15) * 0.5; // center the arc opening upward
      arc.position.y = -0.45 + i * 0.22;
      group.add(arc);
    }
  }
  return group;
}

export function GlassScrollScene({
  steps = 3,
  progress,
  palette = LIQUID_MONOCHROME,
  className,
  children,
}: {
  /** How many glass objects the scrub passes through (2–4). */
  steps?: number;
  /** Controlled scrub progress, 0..1 across the track. Overrides the built-in ScrollTrigger. */
  progress?: number;
  /** Refraction tint — defaults to the group-wide Liquid Monochrome trio. */
  palette?: HeroPalette;
  /** Applied to the outer track (the element scroll progress is measured against). */
  className?: string;
  /** Page sections scrolled over the pinned canvas. */
  children?: ReactNode;
}) {
  const active = useHeroActivation();
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const progressRef = useRef(0);

  const objectCount = Math.min(MAX_STEPS, Math.max(MIN_STEPS, Math.round(steps)));

  useEffect(() => {
    if (!active || inView) return;
    const node = trackRef.current;
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

  // Controlled progress prop wins outright.
  useEffect(() => {
    if (progress !== undefined) progressRef.current = progress;
  }, [progress]);

  // Built-in scrub: ScrollTrigger against the track (Lenis-aware via
  // ScrollProvider's ScrollTrigger.update, native-scroll otherwise), with a
  // plain scroll-listener fallback computing the same progress formula.
  useEffect(() => {
    if (progress !== undefined) return;
    const node = trackRef.current;
    if (!node) return;

    let trigger: ScrollTrigger | undefined;
    let removeFallback: (() => void) | undefined;
    try {
      trigger = ScrollTrigger.create({
        trigger: node,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    } catch {
      const update = () => {
        const rect = node.getBoundingClientRect();
        progressRef.current = progressWithinTrack(rect.top, rect.height, window.innerHeight);
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
  }, [progress]);

  const showCanvas = active && inView;

  useEffect(() => {
    if (!showCanvas) return;
    const host = canvasHostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // One material per object (per-object uOpacity for the crossfade), all
    // sharing one light-direction vector so the cursor light moves them in
    // lockstep.
    const lightDir = new THREE.Vector3(-0.35, 0.8, 0.6).normalize();
    const objects: Array<{ group: THREE.Group; material: THREE.ShaderMaterial }> = [];
    const disposables: Array<{ dispose(): void }> = [];
    for (let i = 0; i < objectCount; i++) {
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
          uLightDir: { value: lightDir },
          uOpacity: { value: 0 },
        },
      });
      const group = buildObject(i % MAX_STEPS);
      group.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.material = material;
          disposables.push((node as THREE.Mesh).geometry);
        }
      });
      disposables.push(material);
      scene.add(group);
      objects.push({ group, material });
    }

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

    let visible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    visibilityObserver.observe(host);

    // Cursor-reactive key light on window: page content (children) overlays
    // the canvas, so host-level listeners would never fire.
    let pointerNormX = 0;
    let pointerNormY = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerNormX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNormY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let raf = 0;
    let lastTime = performance.now();
    let flowTime = 0;

    const animate = (now: number) => {
      raf = window.requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!visible) return;

      flowTime += delta * 0.35;

      lightDir.x = THREE.MathUtils.damp(lightDir.x, pointerNormX * 0.8, LIGHT_DAMP_LAMBDA, delta);
      lightDir.y = THREE.MathUtils.damp(
        lightDir.y,
        pointerNormY * 0.6 + 0.4,
        LIGHT_DAMP_LAMBDA,
        delta
      );
      lightDir.z = THREE.MathUtils.damp(lightDir.z, 0.6, LIGHT_DAMP_LAMBDA, delta);
      lightDir.normalize();

      objects.forEach(({ group, material }, index) => {
        const envelope = scrollObjectEnvelope(progressRef.current, index, objectCount);
        group.scale.setScalar(envelope.scale);
        // Envelope drift plus a gentle idle float so a held object still breathes.
        group.position.y = envelope.offsetY + Math.sin(flowTime * 0.8 + index * 1.7) * 0.06;
        group.rotation.y += IDLE_SPIN_Y * delta;
        group.rotation.x = Math.sin(flowTime * 0.3 + index) * 0.08;
        material.uniforms.uFlowTime.value = flowTime;
        material.uniforms.uOpacity.value = envelope.presence;
      });

      renderer.render(scene, camera);
    };
    raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      host.removeChild(renderer.domElement);
      disposables.forEach((disposable) => disposable.dispose());
      renderer.dispose();
    };
    // progress feeds progressRef via its own effect — changing it must not
    // rebuild the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCanvas, objectCount, palette.highlight, palette.core, palette.shadow]);

  return (
    <div ref={trackRef} className={`relative ${className ?? ''}`}>
      {/* Sticky pinned canvas layer. Structural styles are inline (sticky /
          negative margin) so the layout doesn't depend on Tailwind arbitrary
          values; className styling stays available on the track. */}
      <div
        aria-hidden="true"
        className="overflow-hidden"
        style={{ position: 'sticky', top: 0, height: '100vh' }}
      >
        <GlassScrollFallback palette={palette} className="absolute inset-0" />
        {showCanvas && <div ref={canvasHostRef} className="absolute inset-0" />}
      </div>
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, marginTop: '-100vh' }}>{children}</div>
      ) : null}
    </div>
  );
}
