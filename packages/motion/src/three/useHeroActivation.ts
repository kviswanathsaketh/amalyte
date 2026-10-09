'use client';

// useHeroActivation — the explicit activation rule from the addendum spec
// §3 guardrail 3: the R3F hero renders ONLY when the viewport is >= 1024px
// AND WebGL2 is available AND `prefers-reduced-motion` is not set. Every
// other case (mobile, tablet, reduced motion, no WebGL2) gets the static
// poster/CSS fallback instead. SSR-safe: returns false until after mount,
// then re-evaluates on viewport/preference changes for the component's
// lifetime (WebGL2 support is probed once — it doesn't change at runtime).

import { useEffect, useState } from 'react';

export const HERO_MIN_VIEWPORT_WIDTH = 1024;

const WIDTH_QUERY = `(min-width: ${HERO_MIN_VIEWPORT_WIDTH}px)`;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function isWebGL2Available(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    return document.createElement('canvas').getContext('webgl2') !== null;
  } catch {
    // jsdom and some locked-down environments throw instead of returning null.
    return false;
  }
}

export function useHeroActivation(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const widthQuery = window.matchMedia(WIDTH_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const evaluate = () => {
      // Short-circuit order matters: skip the WebGL2 probe entirely when the
      // viewport/preference already rules the scene out.
      setActive(widthQuery.matches && !motionQuery.matches && isWebGL2Available());
    };

    evaluate();
    widthQuery.addEventListener('change', evaluate);
    motionQuery.addEventListener('change', evaluate);
    return () => {
      widthQuery.removeEventListener('change', evaluate);
      motionQuery.removeEventListener('change', evaluate);
    };
  }, []);

  return active;
}
