'use client';

// GlassScrollFallback — the static stand-in for GlassScrollScene whenever
// the activation rule (useHeroActivation) fails: mobile/tablet, reduced
// motion, no WebGL2, or before the canvas mounts. Same construction as
// HeroFallback (layered radial landmasses from the palette on the deep
// shadow stop) plus a faint ring silhouette hinting at the glass object that
// would be floating here — the section is never blank. Decorative only.

import type { HeroPalette } from './palette';

export function GlassScrollFallback({
  palette,
  className,
}: {
  palette: HeroPalette;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        background: `
          radial-gradient(38% 38% at 50% 46%, transparent 58%, ${palette.highlight}33 66%, transparent 74%),
          radial-gradient(45% 45% at 50% 45%, #FFFFFF21, transparent 70%),
          radial-gradient(55% 70% at 66% 30%, ${palette.highlight}40, transparent 72%),
          radial-gradient(70% 85% at 30% 70%, ${palette.core}40, transparent 74%),
          radial-gradient(110% 110% at 50% 110%, ${palette.shadow}8C, transparent 78%)
        `,
      }}
    />
  );
}
