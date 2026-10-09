'use client';

// ScrollScrubVideo -- plays a pre-rendered video by mapping scroll position
// directly to video.currentTime (the technique behind Apple's product pages:
// AirPods Pro, the iPhone camera page), instead of a real-time WebGL scene.
// Supersedes the R3F MarkMorphScene plan for Parent's hero (design spec
// 2026-08-14-parent-site-design.md §7.1) -- generated video, not hand-shader
// geometry. Generic enough to reuse for any property's scroll-video moment
// (e.g. Studio's /reels, addendum spec §4 job 2), not Parent-only.
//
// Behavior by input:
// - prefers-reduced-motion: static poster image only, no video element
//   mounted (no bytes fetched).
// - small viewport (<768px): pin/scrub is notoriously janky on mobile
//   browsers (address-bar resize fighting the pinned scroll region), so
//   the video plays through once on load instead of scrubbing.
// - everything else: pins the container for `scrubDistance` of scroll and
//   maps scroll progress (0-1) to the video's timeline.

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}

export function ScrollScrubVideo({
  src,
  poster,
  reducedMotionPoster,
  scrubDistance = '150%',
  className,
  videoClassName,
  children,
}: {
  src: string;
  poster: string;
  reducedMotionPoster: string;
  scrubDistance?: string;
  /** Applied to the outer pin target -- the section that pins while the video scrubs. */
  className?: string;
  /** Applied to the <video>/fallback <img> itself (sizing/positioning, e.g. absolute inset-0 object-cover). */
  videoClassName?: string;
  /** Overlaid content (headline, copy, CTAs) that pins and holds together with the video. */
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let trigger: ScrollTrigger | undefined;

    const setup = () => {
      trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrubDistance}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });
    };

    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true });
    }

    return () => {
      trigger?.kill();
    };
  }, [prefersReducedMotion, isMobile, scrubDistance]);

  useEffect(() => {
    if (!isMobile || prefersReducedMotion) return;
    videoRef.current?.play().catch(() => {
      // Autoplay can be blocked by the browser; the poster frame still shows.
    });
  }, [isMobile, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static fallback, no next/image benefit for a single fixed hero asset */}
        <img src={reducedMotionPoster} alt="" aria-hidden="true" className={videoClassName} />
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={videoClassName}
      />
      {children}
    </div>
  );
}
