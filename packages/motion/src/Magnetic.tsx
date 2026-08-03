'use client';

// Magnetic -- wraps children in a magnetic-button hover effect: on pointer
// move within the wrapper's bounds, the children are offset toward the
// cursor (scaled by `strength`) using GSAP's quickTo for smooth
// interpolation, and reset to (0, 0) on pointer leave. Renders children with
// no pointer listeners attached (no offset ever applied) when the user
// prefers reduced motion.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
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
  const childRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    const child = childRef.current;
    if (!wrapper || !child) return;

    const quickX = gsap.quickTo(child, 'x', { duration: 0.3, ease: 'power3.out' });
    const quickY = gsap.quickTo(child, 'y', { duration: 0.3, ease: 'power3.out' });

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);
      quickX(offsetX * strength);
      quickY(offsetY * strength);
    };

    const handlePointerLeave = () => {
      quickX(0);
      quickY(0);
    };

    wrapper.addEventListener('pointermove', handlePointerMove);
    wrapper.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      wrapper.removeEventListener('pointermove', handlePointerMove);
      wrapper.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [prefersReducedMotion, strength]);

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={childRef}>{children}</div>
    </div>
  );
}
