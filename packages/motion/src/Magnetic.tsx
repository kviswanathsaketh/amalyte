'use client';

// Magnetic -- wraps children in a magnetic-button hover effect: on pointer
// move within the wrapper's bounds, the children are offset toward the
// cursor (scaled by `strength`) via Motion springs on independent x/y
// motion values (fluid-ui skill §3: decompose 2D motion into independent
// springs so differing X/Y velocities never desync), and reset to (0, 0) on
// pointer leave. Because springs re-target from their current value and
// velocity rather than restarting, a pointer that changes direction
// mid-flight redirects smoothly instead of snapping. Renders children with
// no pointer listeners attached (no offset ever applied) when the user
// prefers reduced motion.

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { springs } from './lib/springs';
import { useReducedMotion } from './lib/useReducedMotion';

export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.momentum);
  const springY = useSpring(y, springs.momentum);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const bounds = wrapperRef.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={wrapperRef}
      className={className}
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      onPointerLeave={prefersReducedMotion ? undefined : handlePointerLeave}
    >
      <motion.div style={prefersReducedMotion ? undefined : { x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
