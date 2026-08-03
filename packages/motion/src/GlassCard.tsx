'use client';

// GlassCard — the design system's locked "v8 liquid glass" surface (spec §5.3).
// Real per-channel refraction via the shared GlassDispersionFilter, a
// near-zero interior fill (this is clear glass, not frosted milk), a
// curvature-correct conic-gradient rim ring (masked to a thin stroke via
// padding + mask-composite: exclude so it wraps pill end-caps correctly
// instead of breaking like a border-image would), a curved specular patch,
// and top/bottom wall-thickness shading. Used system-wide: cards, pill nav,
// tag pills, CTA buttons -- hence the `as` prop and className passthrough.
//
// Safari/Firefox don't support the SVG-filter term inside backdrop-filter,
// so the whole backdrop-filter value there is simply ignored per the CSS
// cascade -- the rim ring, near-zero fill, and shading stay intact as an
// intentional fallback (see §5.3's honesty note), not a broken build.

import {
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { GlassDispersionFilter } from './lib/svgFilters';
import { useReducedMotion } from './lib/useReducedMotion';

type GlassCardOwnProps = {
  as?: 'div' | 'button';
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
};

type GlassCardProps = GlassCardOwnProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof GlassCardOwnProps>;

// Slow idle wander for the specular patch (interactive tier, pointer not
// currently present) -- keeps the card from reading as static without ever
// looking like a deliberate "sweep" animation. Stays within the inner-top
// area, echoing where light pools on the curved top of a real glass tube.
const IDLE_DRIFT_STOPS = [
  { x: 32, y: 16 },
  { x: 64, y: 14 },
  { x: 52, y: 26 },
  { x: 38, y: 18 },
];
const IDLE_DRIFT_INTERVAL_MS = 4000;

export function GlassCard({
  as = 'div',
  interactive = false,
  className = '',
  children,
  ...rest
}: GlassCardProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const scopeClass = `glass-${rawId}`;
  const filterId = `glass-dispersion-${rawId}`;

  const prefersReducedMotion = useReducedMotion();
  const trackingEnabled = interactive && !prefersReducedMotion;

  // The specular patch's position is transient, pointer-driven, high-frequency
  // state -- it's written directly to the DOM node (ref) rather than through
  // useState, so a mousemove never triggers a React re-render of the card.
  const specularRef = useRef<HTMLSpanElement | null>(null);
  const driftIndexRef = useRef(0);
  // Explicitly `number`, not `ReturnType<typeof window.setInterval>` -- with both
  // @types/node and DOM lib in scope in this monorepo, that alias can resolve to
  // Node's `NodeJS.Timeout` instead of the browser's numeric handle. This component
  // is client-only (window/pointer events), so the browser type is what's correct.
  const driftTimerRef = useRef<number | null>(null);

  const applySpecularPosition = (pos: { x: number; y: number }) => {
    const node = specularRef.current;
    if (!node) return;
    node.style.left = `${pos.x}%`;
    node.style.top = `${pos.y}%`;
  };

  const stopIdleDrift = () => {
    if (driftTimerRef.current === null) return;
    window.clearInterval(driftTimerRef.current);
    driftTimerRef.current = null;
  };

  const startIdleDrift = () => {
    if (!trackingEnabled || driftTimerRef.current !== null) return;
    driftTimerRef.current = window.setInterval(() => {
      driftIndexRef.current = (driftIndexRef.current + 1) % IDLE_DRIFT_STOPS.length;
      applySpecularPosition(IDLE_DRIFT_STOPS[driftIndexRef.current]);
    }, IDLE_DRIFT_INTERVAL_MS);
  };

  useEffect(() => {
    startIdleDrift();
    return stopIdleDrift;
    // trackingEnabled flips only if `interactive` or the reduced-motion
    // preference changes at runtime -- both rare, both fine to re-arm on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingEnabled]);

  const handlePointerEnter = () => {
    if (!trackingEnabled) return;
    stopIdleDrift();
  };

  const handlePointerLeave = () => {
    if (!trackingEnabled) return;
    startIdleDrift();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!trackingEnabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    applySpecularPosition({
      x: Math.min(95, Math.max(5, x)),
      y: Math.min(60, Math.max(5, y)),
    });
  };

  // `as` is 'div' | 'button', but `rest` is typed against the button variant's
  // props (the widest of the two allowed elements) -- widening Comp to
  // ElementType here (and the spread below) is the standard escape hatch for
  // this polymorphic-component pattern: TS can't otherwise reconcile
  // ComponentPropsWithoutRef<'button'> against JSX.IntrinsicElements['div'],
  // even though every prop we actually pass is valid on both elements.
  const Comp = as as ElementType;

  return (
    <Comp
      {...(rest as Record<string, unknown>)}
      className={`${scopeClass} relative isolate overflow-hidden rounded-lg shadow-e2 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: `url(#${filterId}) blur(14px) saturate(1.35)`,
        WebkitBackdropFilter: `url(#${filterId}) blur(14px) saturate(1.35)`,
      }}
      onPointerMove={trackingEnabled ? handlePointerMove : undefined}
      onPointerEnter={trackingEnabled ? handlePointerEnter : undefined}
      onPointerLeave={trackingEnabled ? handlePointerLeave : undefined}
    >
      <GlassDispersionFilter id={filterId} />

      {/* Rim ring + wall-thickness shading, scoped to this instance's
          generated class so multiple GlassCards on one page never collide.
          Static after mount (only depends on scopeClass), independent of
          the specular patch's imperatively-driven position. */}
      <style>{`
        .${scopeClass}::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from 0deg at 50% 50%,
            rgba(255, 255, 255, 0.85) 0deg,
            rgba(255, 255, 255, 0.45) 60deg,
            rgba(255, 255, 255, 0.08) 120deg,
            rgba(255, 255, 255, 0.03) 180deg,
            rgba(255, 255, 255, 0.08) 240deg,
            rgba(255, 255, 255, 0.45) 300deg,
            rgba(255, 255, 255, 0.85) 360deg
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
        }

        .${scopeClass}::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -10px 16px -12px rgba(0, 0, 0, 0.4);
          pointer-events: none;
        }
      `}</style>

      <span
        ref={specularRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${IDLE_DRIFT_STOPS[0].x}%`,
          top: `${IDLE_DRIFT_STOPS[0].y}%`,
          width: '46%',
          height: '30%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
          transition: trackingEnabled
            ? 'left var(--duration-slow) var(--ease-amalyte), top var(--duration-slow) var(--ease-amalyte)'
            : undefined,
        }}
      />
      <span className="relative z-10">{children}</span>
    </Comp>
  );
}
