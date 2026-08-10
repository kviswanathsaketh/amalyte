// springs — shared spring presets for Motion (motion/react), mapped from
// Apple's damping/response vocabulary (fluid-ui skill, "Behavior over
// animation" + Quick Reference table). Motion's `bounce` + `duration` spring
// API is the closest web equivalent: bounce 0 == critically damped
// (damping 1.0), higher bounce == lower damping / more overshoot.
//
// Use `default` for anything that isn't gesture-driven (menus, fades, layout
// shifts). Reserve `momentum` for interactions where the gesture itself
// carried velocity (a flick, a drag release, a magnetic snap-back) -- adding
// bounce to a transition nothing threw feels wrong.
import type { Transition } from 'motion/react';

export const springs = {
  // Critically damped, no overshoot -- the house default (damping 1.0, response 0.4).
  default: { type: 'spring', bounce: 0, duration: 0.4 } satisfies Transition,

  // Snappier critically damped variant for immediate feedback (press states,
  // toggles) where a 0.4s settle reads as sluggish.
  press: { type: 'spring', bounce: 0, duration: 0.25 } satisfies Transition,

  // Slight bounce, only for momentum-driven interactions (damping ~0.8, response 0.4).
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 } satisfies Transition,

  // Drawer/sheet feel (damping ~0.8, response 0.3).
  sheet: { type: 'spring', bounce: 0.25, duration: 0.3 } satisfies Transition,
} as const;

// Reduced-motion equivalent: fluid-ui §14 -- cross-fade, no spring/overshoot.
export const reducedMotionTransition = { duration: 0.15, ease: 'linear' } satisfies Transition;
