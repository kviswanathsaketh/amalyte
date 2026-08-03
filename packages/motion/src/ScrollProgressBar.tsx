'use client';

// ScrollProgressBar -- a thin fixed bar pinned to the top of the viewport
// whose width scales 0-100% with total page scroll progress, via a single
// GSAP ScrollTrigger bound to the whole document. Renders nothing when the
// user prefers reduced motion.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgressBar({ className }: { className?: string }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const fill = fillRef.current;
    if (!fill) return;

    gsap.set(fill, { scaleX: 0 });

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(fill, { scaleX: self.progress });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className={`fixed left-0 top-0 z-50 h-1 w-full ${className ?? ''}`}>
      <div ref={fillRef} className="h-full w-full origin-left bg-accent" />
    </div>
  );
}
