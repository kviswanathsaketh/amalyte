'use client';

// HeroFallback — the static stand-in rendered whenever the activation rule
// (useHeroActivation) fails: mobile/tablet, reduced motion, no WebGL2, or
// simply before the canvas has mounted. Two tiers, per addendum §3
// guardrail 3: a generated poster still (creative-studio's QC'd glass-tube
// frames) when the app supplies `posterSrc`, otherwise a pure-CSS gradient
// composition from the palette — the hero is never blank. Decorative only;
// hero copy always lives outside this component as real DOM text.

import type { HeroPalette } from './palette';

export function HeroFallback({
  palette,
  posterSrc,
  className,
}: {
  palette: HeroPalette;
  posterSrc?: string;
  className?: string;
}) {
  if (posterSrc) {
    return (
      <div aria-hidden="true" className={className}>
        <img
          src={posterSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  // Layered radial landmasses echoing FluidBlob's 2D construction (base spec
  // §5.1): two hued masses from the property gradient plus a near-white
  // luminosity core, sitting on the deep shadow stop. The 8-digit hex alpha
  // suffixes are safe — every property's tokens are #RRGGBB.
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `
          radial-gradient(55% 75% at 68% 28%, ${palette.highlight}59, transparent 72%),
          radial-gradient(70% 85% at 28% 68%, ${palette.core}66, transparent 74%),
          radial-gradient(45% 45% at 50% 45%, #FFFFFF30, transparent 70%),
          radial-gradient(110% 110% at 50% 110%, ${palette.shadow}8C, transparent 78%)
        `,
      }}
    />
  );
}
