'use client';

// ParentHero — thin client boundary around @amalyte/motion/three's HeroScene.
// next/dynamic({ ssr: false }) must live inside a Client Component, hence
// this file existing separately from page.tsx (a Server Component).

import dynamic from 'next/dynamic';
import type { HeroPalette } from '@amalyte/motion/three';

// RawGlassHero, not HeroScene -- @react-three/fiber's reconciler crashes at
// runtime in this monorepo (see RawGlassHero.tsx's header comment).
const RawGlassHero = dynamic(
  () => import('@amalyte/motion/three').then((m) => m.RawGlassHero),
  { ssr: false }
);

// Liquid Monochrome glass refraction tint (tokens-parent/tokens.css:
// --gradient-highlight/core/shadow) — the cool violet trio sampled through
// refraction, never a flat fill. This subpath never imports token packages
// itself (addendum §2), so the app supplies it.
const PARENT_HERO_PALETTE: HeroPalette = {
  highlight: '#EDEBFF',
  core: '#6C63FF',
  shadow: '#14122B',
  accent: '#5B54E6',
};

export function ParentHero({
  posterSrc,
  className,
}: {
  posterSrc: string;
  className?: string;
}) {
  return (
    // @ts-ignore -- React 18/19 @types split (see HeroScene.tsx); runtime
    // unaffected, ignoreBuildErrors covers the actual build.
    <RawGlassHero
      palette={PARENT_HERO_PALETTE}
      intensity="medium"
      posterSrc={posterSrc}
      className={className}
    />
  );
}
