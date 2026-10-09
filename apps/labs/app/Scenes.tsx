'use client';

// LabsScenes — thin client boundary around @amalyte/motion/three's two
// Liquid Monochrome interaction families. next/dynamic({ ssr: false }) must
// live inside a Client Component, hence this file existing separately from
// page.tsx (a Server Component). Prop types are restated explicitly on the
// exported wrappers (same pattern as parent/HeroSceneClient): the React
// 18/19 @types split makes the dynamic() handles unusable as typed JSX
// components, so they render under @ts-ignore.

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { HeroPalette, ParticleShapeId } from '@amalyte/motion/three';

const GlassScrollScene = dynamic(
  () => import('@amalyte/motion/three').then((m) => m.GlassScrollScene),
  { ssr: false }
);
const GlassParticles = dynamic(
  () => import('@amalyte/motion/three').then((m) => m.GlassParticles),
  { ssr: false }
);

export function ScrollScene({
  steps,
  progress,
  palette,
  className,
  children,
}: {
  /** How many glass objects the scrub passes through (2–4). */
  steps?: number;
  /** Controlled scrub progress, 0..1 across the track. */
  progress?: number;
  /** Refraction tint — defaults to the group-wide Liquid Monochrome trio. */
  palette?: HeroPalette;
  /** Applied to the outer track (the element scroll progress is measured against). */
  className?: string;
  /** Page sections scrolled over the pinned canvas. */
  children?: ReactNode;
}) {
  return (
    // @ts-ignore -- React 18/19 @types split (see parent/HeroSceneClient);
    // runtime unaffected, ignoreBuildErrors covers the actual build.
    <GlassScrollScene
      steps={steps}
      progress={progress}
      palette={palette}
      className={className}
    >
      {children}
    </GlassScrollScene>
  );
}

export function Particles({
  shapes,
  count,
  progress,
  scrollDriven,
  palette,
  className,
}: {
  /** Shape ids to morph between, in order. */
  shapes?: ParticleShapeId[];
  /** Droplet count before auto-reduction. */
  count?: number;
  /** Controlled morph progress, 0..1 across `shapes`. Overrides scrollDriven. */
  progress?: number;
  /** Scrub morphs from this component's own position in the document. */
  scrollDriven?: boolean;
  /** Refraction tint — defaults to the group-wide Liquid Monochrome trio. */
  palette?: HeroPalette;
  className?: string;
}) {
  return (
    // @ts-ignore -- React 18/19 @types split, same as above.
    <GlassParticles
      shapes={shapes}
      count={count}
      progress={progress}
      scrollDriven={scrollDriven}
      palette={palette}
      className={className}
    />
  );
}
