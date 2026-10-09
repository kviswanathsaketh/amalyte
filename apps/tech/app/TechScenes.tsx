'use client';

// TechScenes — client boundary for the two "Liquid Monochrome" interaction
// families from @amalyte/motion/three (GlassScrollScene, GlassParticles).
// next/dynamic({ ssr: false }) is only legal inside a Client Component, so
// the Server Component pages import these wrappers instead (same pattern as
// apps/parent/app/HeroSceneClient.tsx). Both scenes assume a matte-black
// backdrop — callers mount them inside <section data-theme="dark">.

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const GlassScrollScene = dynamic(
  () => import('@amalyte/motion/three').then((m) => m.GlassScrollScene),
  { ssr: false }
);

const GlassParticles = dynamic(
  () => import('@amalyte/motion/three').then((m) => m.GlassParticles),
  { ssr: false }
);

// Dark-hero scroll scene: the page's dark sections (children) scroll over a
// pinned canvas that scrubs transitions between 2–4 glass objects. Palette
// defaults to the group-wide LIQUID_MONOCHROME trio.
export function TechHeroScene({
  steps = 3,
  children,
}: {
  steps?: number;
  children: ReactNode;
}) {
  // @ts-ignore -- React 18/19 @types split (same as apps/parent's
  // HeroSceneClient); runtime unaffected, ignoreBuildErrors covers the build.
  return <GlassScrollScene steps={steps}>{children}</GlassScrollScene>;
}

// Particle band background: liquid-glass droplets forming shapes, morphs
// scrubbed by the band's own travel through the viewport. No intrinsic size —
// always rendered absolute inset-0 inside a positioned, sized dark section.
export function TechParticleBand() {
  // @ts-ignore -- React 18/19 @types split (see TechHeroScene above).
  return <GlassParticles scrollDriven className="absolute inset-0" />;
}
