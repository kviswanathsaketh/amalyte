'use client';

// HeroScene — the scroll-driven 3D hero (addendum spec §3). Renders the
// property's glass/fluid-tube motif as real 3D geometry with hand-built
// GLSL shader materials: the v8 liquid-glass technique (refraction, true
// per-channel chromatic dispersion, near-zero interior fill,
// curvature-correct rim highlight, color bleed-through) plus the glowing
// tube-line with its traveling orb.
//
// Consumption contract — BOTH are load-bearing guardrails from spec §3:
//
// 1. Load this component via `next/dynamic({ ssr: false })`, and render the
//    hero H1/headline as real DOM text BEFORE it. The headline is the LCP
//    element (base spec §13.4) and must never be blocked by, or baked into,
//    the 3D scene. This component is decorative (`aria-hidden`) by design.
//
//      const HeroScene = dynamic(
//        () => import('@amalyte/motion/three').then((m) => m.HeroScene),
//        { ssr: false }
//      );
//
// 2. Pass the property's own tokens as `palette` (gradient highlight/core/
//    shadow + accent from `@amalyte/tokens-<property>`). This subpath
//    intentionally never imports token packages itself.
//
// Activation (spec §3 guardrail 3, implemented in useHeroActivation): the
// canvas only exists when viewport >= 1024px AND WebGL2 is available AND
// prefers-reduced-motion is NOT set — and even then it doesn't mount until
// an IntersectionObserver reports the hero near/in viewport (guardrail 2).
// Every other case renders HeroFallback: the poster still when `posterSrc`
// is given, else a pure-CSS gradient from the palette — never blank.
//
// Scroll: progress is read from the hero element's bounding rect each frame,
// which tracks window scroll — the same scroll position Lenis (via
// ScrollProvider) already drives. No second Lenis or ScrollTrigger instance
// is created; standalone pages without ScrollProvider work identically via
// native scroll.

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroFallback } from './HeroFallback';
import { HeroSceneContents } from './HeroSceneContents';
import { INTENSITY_SCALE, type HeroIntensity, type HeroPalette } from './palette';
import { useHeroActivation } from './useHeroActivation';

export type HeroSceneProps = {
  palette: HeroPalette;
  /** Matches the tokens' `motionIntensity` field; pass it straight through. */
  intensity?: HeroIntensity;
  /** Creative-studio poster still shown whenever the 3D scene doesn't activate. */
  posterSrc?: string;
  className?: string;
};

// Canvas mounts once the hero is this far outside the viewport — early
// enough that the scene is warm before it scrolls in.
const OBSERVER_ROOT_MARGIN = '240px 0px';

export function HeroScene({
  palette,
  intensity = 'medium',
  posterSrc,
  className,
}: HeroSceneProps) {
  const active = useHeroActivation();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // High-frequency scroll progress lives in a ref, written from a rAF loop
  // and read inside the R3F frame loop — scroll never triggers a re-render.
  const progressRef = useRef(0);

  // Guardrail 2: don't mount the canvas until the hero is near/in viewport.
  useEffect(() => {
    if (!active || inView) return;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      // No observer support: the user is on a desktop with WebGL2 — just mount.
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

  // Scroll progress: 0 when the hero's top is at the viewport top, 1 after
  // one hero-height of scroll. Rect-based, so it stays in sync with
  // whatever drives window scroll (Lenis via ScrollProvider, or native).
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const measure = () => {
      const node = hostRef.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        progressRef.current = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      }
      raf = window.requestAnimationFrame(measure);
    };
    raf = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(raf);
  }, [inView]);

  const showCanvas = active && inView;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className ?? ''}`}
    >
      {/* The fallback stays mounted underneath the canvas: the hero is never
          blank while WebGL warms up, and it remains the poster for anyone
          the activation rule excludes. */}
      <HeroFallback palette={palette} posterSrc={posterSrc} className="absolute inset-0" />
      {showCanvas && (
        // @ts-ignore -- React 18/19 @types split (documented in
        // apps/parent/next.config.js): @react-three/fiber's Canvas JSX
        // typing doesn't match @types/react 18.3's newer ReactNode shape.
        // Whether this actually errors depends on the consuming tsconfig
        // context, so @ts-ignore (not @ts-expect-error, which would fail
        // when *not* erroring) is the correct suppression here. Runtime
        // unaffected; ignoreBuildErrors covers the actual build either way.
        <Canvas
          // `flat` disables R3F's default ACES tone mapping so the palette
          // hexes render true, matching the 2D primitives exactly.
          flat
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 7.5], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <HeroSceneContents
            palette={palette}
            intensityScale={INTENSITY_SCALE[intensity]}
            progressRef={progressRef}
          />
        </Canvas>
      )}
    </div>
  );
}
