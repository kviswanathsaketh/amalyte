// Barrel for the `@amalyte/motion/three` subpath — kept separate from the
// package root so three.js/R3F tree-shakes out of every bundle that only
// uses the CSS/GSAP primitives (addendum §2).

// HeroScene (the @react-three/fiber-based path) is NOT exported here --
// importing it, even unused, drags @react-three/fiber's module-level
// createRenderer() call into the same Turbopack chunk as everything else
// from this barrel, which crashes at runtime in this monorepo (see
// RawGlassHero.tsx's header comment). The file stays in the tree as a
// reference for a future React-19-migrated build; nothing currently
// imports it.
export { RawGlassHero } from './RawGlassHero';
export { HeroFallback } from './HeroFallback';
export { GlassParticles } from './GlassParticles';
export { ParticlesFallback } from './ParticlesFallback';
export { GlassScrollScene } from './GlassScrollScene';
export { GlassScrollFallback } from './GlassScrollFallback';
export {
  useHeroActivation,
  isWebGL2Available,
  HERO_MIN_VIEWPORT_WIDTH,
} from './useHeroActivation';
export { INTENSITY_SCALE, LIQUID_MONOCHROME } from './palette';
export type { HeroPalette, HeroIntensity } from './palette';
export {
  DEFAULT_PARTICLE_SHAPES,
  DEFAULT_PARTICLE_COUNT,
} from './particleShapes';
export type { ParticleShapeId } from './particleShapes';
