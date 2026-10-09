// HeroPalette — the per-property color contract for the 3D hero scene.
// The consuming app passes its own tokens (`gradient.{highlight,core,shadow}`
// + `accent` from `@amalyte/tokens-{parent,studio,tech,learn,labs}`); this
// subpath deliberately does NOT import the token packages itself, so the
// palette stays a single source of truth owned by the app (addendum §2) and
// no property's tokens leak into another property's bundle.

export type HeroPalette = {
  /** Lightest gradient stop — rim highlights, orb gloss, tube head. */
  highlight: string;
  /** Mid gradient stop — the property's primary hue. */
  core: string;
  /** Deepest gradient stop — tube tail, shading, scene base. */
  shadow: string;
  /** The property's surgical accent — reserved for the orb core. */
  accent: string;
};

// Motion intensity mirrors the tokens' `motionIntensity` field verbatim, so
// an app can pass `tokens.motionIntensity` straight through.
export type HeroIntensity = 'low' | 'medium-low' | 'medium' | 'medium-high' | 'high';

// Multiplier applied to every motion term in the scene (flow speed, orb
// travel, rotation, dolly amount). Tech ("low") should barely move; Studio
// ("high") is the loud cinematic end (base spec §13.5).
export const INTENSITY_SCALE: Record<HeroIntensity, number> = {
  low: 0.45,
  'medium-low': 0.7,
  medium: 1,
  'medium-high': 1.4,
  high: 1.8,
};

// The group-wide "Liquid Monochrome" default (2026-08-27 direction): the
// cool violet glass refraction tint from tokens-core
// (--gradient-highlight/core/shadow). Rendering-only — these values are
// sampled through refraction/fresnel terms, never used as flat fills. New
// three.js scenes (GlassParticles, GlassScrollScene) default to this so a
// page can mount them with zero props; apps may still override per property.
export const LIQUID_MONOCHROME: HeroPalette = {
  highlight: '#EDEBFF',
  core: '#6C63FF',
  shadow: '#14122B',
  accent: '#5B54E6',
};
