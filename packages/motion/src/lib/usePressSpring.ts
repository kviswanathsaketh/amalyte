'use client';

// usePressSpring — instant, on-pointer-down press feedback for tappable
// elements (fluid-ui skill §1 "Respond on pointer-down, not on release").
// Spread the result onto a `motion.button` / `motion.a` element: Motion's
// `whileTap` fires on pointerdown and springs back on release, which is
// exactly the immediate-feedback behavior the skill asks for -- no manual
// pointer listeners needed. Returns an empty object under reduced motion,
// which leaves the element fully static (no scale, no transition).

import { springs } from './springs';
import { useReducedMotion } from './useReducedMotion';

export function usePressSpring(scale = 0.97) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return {};

  return {
    whileTap: { scale },
    transition: springs.press,
  };
}
