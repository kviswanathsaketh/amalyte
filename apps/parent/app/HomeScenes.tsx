'use client';

// HomeScenes — the parent homepage's client boundary for the two "Liquid
// Monochrome" interaction families from @amalyte/motion/three:
//   1. HomeScrollScene  — scroll-driven transitions between 3D glass objects,
//      pinned behind the dark hero track (torus knot -> sphere -> shell).
//   2. HomeParticles    — the tiny-liquid-glass-droplet particle field,
//      scrubbed by its own travel through the viewport.
// page.tsx is a Server Component, so the three.js imports live behind this
// boundary. Static imports (not next/dynamic ssr:false) on purpose: both
// components are SSR-safe — browser APIs are touched only inside effects —
// and GlassScrollScene's children (the hero H1 and statements) must stay in
// the server-rendered HTML. Default LIQUID_MONOCHROME palette is intended.

import type { ReactNode } from 'react';
import { GlassParticles, GlassScrollScene } from '@amalyte/motion/three';

export function HomeScrollScene({ children }: { children: ReactNode }) {
  // steps=3: one glass object per band of the dark hero track (hero,
  // what-we-do, thesis) — the scrub morphs one object into the next as the
  // visitor scrolls between them.
  return <GlassScrollScene steps={3}>{children}</GlassScrollScene>;
}

export function HomeParticles({ className }: { className?: string }) {
  // No intrinsic sizing — the caller positions/sizes via className
  // (`absolute inset-0` inside a sized, positioned dark band).
  return <GlassParticles scrollDriven className={className} />;
}
