'use client';

// Marquee -- wraps children in an infinite horizontal scrolling loop. This
// is a continuous ambient loop, not scroll-driven, so a plain CSS keyframe
// translateX is enough -- no GSAP/ScrollTrigger involved. The children are
// duplicated once internally (second copy marked aria-hidden) so the -50%
// loop point lines up seamlessly with the first copy. Renders children once,
// statically, with no duplication or animation, when the user prefers
// reduced motion.

import { useId } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from './lib/useReducedMotion';

export function Marquee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  // Per-instance keyframe name so multiple Marquees on one page never clash.
  const animationName = `amalyte-marquee-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <style>{`
        @keyframes ${animationName} {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex w-max"
        style={{ animation: `${animationName} 30s linear infinite` }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
