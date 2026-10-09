'use client';

// ParticlesFallback — the static stand-in for GlassParticles whenever the
// activation rule (useHeroActivation) fails: mobile/tablet, reduced motion,
// no WebGL2, or before the canvas mounts. A pure-CSS droplet cluster on
// matte black: near-white bead cores with silver rims and a faint violet
// fringe ring, echoing the WebGL droplet sprite (rim + spec + chromatic
// edge) without any rendering. Decorative only.

import type { HeroPalette } from './palette';

export function ParticlesFallback({
  palette,
  className,
}: {
  palette: HeroPalette;
  className?: string;
}) {
  // Each bead: white spec core -> near-clear middle -> silver rim, then a
  // hairline violet fringe just past the rim (the CSS analog of the shader's
  // per-channel disk divergence). The 8-digit hex alpha suffixes are safe —
  // every property's tokens are #RRGGBB.
  const bead = (size: string, x: string, y: string) => `
    radial-gradient(${size} at ${x} ${y},
      #FFFFFFE6 0%,
      #FFFFFF59 28%,
      ${palette.highlight}40 52%,
      ${palette.highlight}1F 62%,
      ${palette.core}26 66%,
      transparent 72%)
  `;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `
          ${bead('9% 12%', '38%', '42%')},
          ${bead('7% 9%', '52%', '36%')},
          ${bead('8% 10%', '62%', '48%')},
          ${bead('6% 8%', '46%', '56%')},
          ${bead('7% 9%', '58%', '62%')},
          ${bead('5% 7%', '34%', '56%')},
          ${bead('6% 8%', '66%', '34%')},
          radial-gradient(60% 60% at 50% 48%, ${palette.core}14, transparent 70%),
          radial-gradient(90% 90% at 50% 50%, transparent 55%, ${palette.shadow}59 100%)
        `,
      }}
    />
  );
}
