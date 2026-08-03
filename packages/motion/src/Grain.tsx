'use client';

// Grain -- a fine SVG feTurbulence-based noise overlay, absolutely
// positioned to cover its parent. NOTE: the parent element must be
// position:relative (or otherwise establish a positioning context) for this
// overlay to cover it correctly. Meant for dark-theme canvases only per the
// design spec, but this component makes no theme check itself -- pass
// `className` from the caller to conditionally show/hide it per-theme (e.g.
// `hidden dark:block`).

import { useId } from 'react';

export function Grain({ className }: { className?: string }) {
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
      style={{ mixBlendMode: 'overlay', opacity: 0.055 }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
