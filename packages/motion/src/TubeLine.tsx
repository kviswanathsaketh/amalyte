'use client';

// TubeLine — the glowing tube-line with orb marker motif (spec §5.4).
// A smoothly curved SVG path with a gradient stroke (dim at the tail, bright
// at the head -- gradient-shadow -> gradient-core -> gradient-highlight) and
// a glossy orb marker riding along it with a soft glow, reading as
// directional energy/momentum. Used in hero compositions as a connective
// device between the blob art (§5.1) and the content.
//
// Uncontrolled (no `progress`): the orb auto-loops along the path via a
// native SMIL <animateMotion>, no extra deps needed.
// Controlled (`progress` 0-1): the orb's position is computed once per
// change via the path element's own getPointAtLength(), ref-based.
// Reduced motion: the loop is skipped and the orb freezes at the path's
// midpoint, per spec §5.9.

import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from './lib/useReducedMotion';

const CORE_STROKE_WIDTH = 3;
const GLOW_STROKE_WIDTH = 9;
const ORB_RADIUS = 7;
const GLOSS_RADIUS = 2.25;
const AUTO_LOOP_DURATION = '4.5s';
const REDUCED_MOTION_PROGRESS = 0.5;
const ORB_GLOW_FILTER =
  'drop-shadow(0 0 6px var(--gradient-highlight)) drop-shadow(0 0 14px var(--gradient-core))';

type Point = { x: number; y: number };

function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function TubeLine({
  path,
  progress,
  className,
}: {
  path: string;
  progress?: number;
  className?: string;
}) {
  // useId() colons aren't safe inside url(#id) references, strip them.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradientId = `tubeline-gradient-${uid}`;
  const orbGradientId = `tubeline-orb-gradient-${uid}`;
  const pathId = `tubeline-path-${uid}`;

  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = typeof progress === 'number';
  const isFrozen = isControlled || prefersReducedMotion;

  const [ends, setEnds] = useState<{ start: Point; end: Point } | null>(null);
  const [orbPosition, setOrbPosition] = useState<Point | null>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const totalLength = pathEl.getTotalLength();
    if (totalLength === 0) return;

    setEnds({
      start: pathEl.getPointAtLength(0),
      end: pathEl.getPointAtLength(totalLength),
    });

    if (isFrozen) {
      const t = isControlled ? clampProgress(progress as number) : REDUCED_MOTION_PROGRESS;
      setOrbPosition(pathEl.getPointAtLength(t * totalLength));
    } else {
      setOrbPosition(null);
    }
  }, [path, isControlled, isFrozen, progress]);

  // Gradient runs tail -> head along the path's actual start/end points once
  // measured; falls back to a plain left-to-right guess for the first paint.
  const gradientCoords = ends
    ? {
        gradientUnits: 'userSpaceOnUse' as const,
        x1: ends.start.x,
        y1: ends.start.y,
        x2: ends.end.x,
        y2: ends.end.y,
      }
    : { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };

  const orbMarker = (
    <>
      <circle r={ORB_RADIUS} fill={`url(#${orbGradientId})`} />
      <ellipse
        cx={-ORB_RADIUS * 0.3}
        cy={-ORB_RADIUS * 0.35}
        rx={GLOSS_RADIUS}
        ry={GLOSS_RADIUS * 0.75}
        fill="#FFFFFF"
        opacity={0.6}
      />
    </>
  );

  return (
    <svg className={className} aria-hidden="true" focusable="false" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} {...gradientCoords}>
          <stop offset="0%" style={{ stopColor: 'var(--gradient-shadow)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--gradient-core)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--gradient-highlight)' }} />
        </linearGradient>
        <radialGradient id={orbGradientId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" style={{ stopColor: 'var(--gradient-highlight)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--gradient-core)' }} />
        </radialGradient>
      </defs>

      {/* Soft blurred glow trail beneath the crisp stroke -- the "glowing" in tube-line */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={GLOW_STROKE_WIDTH}
        strokeLinecap="round"
        opacity={0.35}
        style={{ filter: 'blur(6px)' }}
      />

      {/* Crisp core stroke -- doubles as the measurement reference for the orb/gradient */}
      <path
        ref={pathRef}
        id={pathId}
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={CORE_STROKE_WIDTH}
        strokeLinecap="round"
      />

      {isFrozen
        ? orbPosition && (
            <g
              transform={`translate(${orbPosition.x} ${orbPosition.y})`}
              style={{ filter: ORB_GLOW_FILTER }}
            >
              {orbMarker}
            </g>
          )
        : (
            <g style={{ filter: ORB_GLOW_FILTER }}>
              {orbMarker}
              <animateMotion dur={AUTO_LOOP_DURATION} repeatCount="indefinite" rotate="auto">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </g>
          )}
    </svg>
  );
}
