'use client';

// Parallax -- wraps children and translates them vertically as a scrubbed
// (not discrete) GSAP ScrollTrigger tied to scroll progress, so the element
// appears to move at a fraction of native scroll speed. `speed` is relative:
// 0.3 shifts the element by 30% of its own height across the scroll range it
// spends in the viewport (split evenly above/below its resting position),
// giving a classic parallax lag. Renders children statically, with no
// transform applied, when the user prefers reduced motion.

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const travel = el.offsetHeight * speed;

    const tween = gsap.fromTo(
      el,
      { y: -travel / 2 },
      {
        y: travel / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
