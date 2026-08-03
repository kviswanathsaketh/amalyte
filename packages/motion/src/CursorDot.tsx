'use client';

// CursorDot -- a small circular dot that follows the cursor with a slight
// trailing delay (GSAP quickTo easing the lag, rather than 1:1 tracking).
// Fixed-position, pointer-events-none, filled with bg-accent. Renders
// nothing when the user prefers reduced motion.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './lib/useReducedMotion';

export function CursorDot({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const handlePointerMove = (event: PointerEvent) => {
      quickX(event.clientX);
      quickY(event.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ${className ?? ''}`}
    />
  );
}
