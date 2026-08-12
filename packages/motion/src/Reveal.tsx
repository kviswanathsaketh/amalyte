'use client';

// Reveal -- wraps children and performs a discrete fade + slide-up reveal as
// they scroll into view, using a GSAP ScrollTrigger 'once' trigger (not
// scrubbed) -- a one-shot reveal, not a continuous scrub. Approximates the
// --duration-slow / --ease-amalyte token feel (GSAP can't read CSS custom
// properties directly) with ease 'power2.out' over ~0.5s. Renders children
// statically, with no animation, when the user prefers reduced motion.

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
