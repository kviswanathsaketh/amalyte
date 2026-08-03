'use client';

// FluidBlob — the "fluid gradient blob" base technique (spec §5.1), shared
// background art infrastructure for every property. Two-layer construction:
// a large, heavily-blurred base layer carrying the property's core gradient
// (highlight -> core -> shadow) with an organic drift + border-radius morph,
// plus a lighter, smaller highlight layer blended on top via
// `mix-blend-mode: overlay` for depth/gloss. A near-white, low-alpha,
// heavily-blurred core layer is added among the hued masses for a genuine
// luminosity peak (§5.1). The optional `metallic` prop layers on the
// brushed-metal band + polished-metal highlight streak from §5.5, used only
// for Parent's rose-gold blob art.

import { useId } from 'react';
import { useReducedMotion } from './lib/useReducedMotion';

export function FluidBlob({
  metallic = false,
  className,
}: {
  metallic?: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const baseDrift = `fluidBlobBaseDrift-${uid}`;
  const coreDrift = `fluidBlobCoreDrift-${uid}`;
  const highlightDrift = `fluidBlobHighlightDrift-${uid}`;

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} aria-hidden="true">
      <style>{`
        @keyframes ${baseDrift} {
          0% { border-radius: 42% 58% 63% 37% / 47% 45% 55% 53%; transform: translate(-4%, -3%) scale(1); }
          33% { border-radius: 58% 42% 37% 63% / 41% 60% 40% 59%; transform: translate(3%, 4%) scale(1.08); }
          66% { border-radius: 35% 65% 55% 45% / 62% 38% 63% 37%; transform: translate(-3%, 3%) scale(0.96); }
          100% { border-radius: 42% 58% 63% 37% / 47% 45% 55% 53%; transform: translate(-4%, -3%) scale(1); }
        }
        @keyframes ${coreDrift} {
          0% { transform: translate(-6%, 3%) scale(1); }
          50% { transform: translate(5%, -5%) scale(1.14); }
          100% { transform: translate(-6%, 3%) scale(1); }
        }
        @keyframes ${highlightDrift} {
          0% { border-radius: 55% 45% 40% 60% / 50% 55% 45% 50%; transform: translate(4%, -4%) scale(1); }
          50% { border-radius: 40% 60% 58% 42% / 60% 40% 62% 38%; transform: translate(-5%, 4%) scale(1.12); }
          100% { border-radius: 55% 45% 40% 60% / 50% 55% 45% 50%; transform: translate(4%, -4%) scale(1); }
        }
      `}</style>

      {/* Base layer: property core gradient, heavily blurred, organic drift + morph */}
      <div
        className="absolute inset-[-15%] bg-gradient-to-br from-gradient-highlight via-gradient-core to-gradient-shadow"
        style={{
          filter: 'blur(56px)',
          borderRadius: '42% 58% 63% 37% / 47% 45% 55% 53%',
          animation: prefersReducedMotion ? 'none' : `${baseDrift} 18s ease-in-out infinite`,
        }}
      />

      {/* Luminosity core: near-white, low-alpha, heavily blurred landmass among the hued masses */}
      <div
        className="absolute inset-[22%] rounded-full bg-white/25"
        style={{
          filter: 'blur(60px)',
          animation: prefersReducedMotion ? 'none' : `${coreDrift} 21s ease-in-out infinite`,
        }}
      />

      {/* Highlight layer: lighter tint, smaller, overlay-blended, independent drift for gloss */}
      <div
        className="absolute inset-[12%] bg-gradient-highlight opacity-70 mix-blend-overlay"
        style={{
          filter: 'blur(50px)',
          borderRadius: '55% 45% 40% 60% / 50% 55% 45% 50%',
          animation: prefersReducedMotion ? 'none' : `${highlightDrift} 15s ease-in-out infinite`,
        }}
      />

      {metallic && (
        <>
          {/* Brushed-metal diagonal band */}
          <div
            className="absolute inset-[-15%] opacity-25 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 2px, transparent 2px, transparent 14px)',
              borderRadius: '42% 58% 63% 37% / 47% 45% 55% 53%',
            }}
          />

          {/* Polished-metal highlight streak, catching the light diagonally */}
          <div
            className="absolute inset-[-30%] opacity-60 mix-blend-screen"
            style={{
              background:
                'linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.85) 50%, transparent 58%)',
              filter: 'blur(28px)',
              transform: 'rotate(-14deg)',
            }}
          />
        </>
      )}
    </div>
  );
}
