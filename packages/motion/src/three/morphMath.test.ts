import { describe, expect, it } from 'vitest';
import {
  clamp01,
  easeAmalyte,
  progressThroughViewport,
  progressWithinTrack,
  resolveMorph,
  scrollObjectEnvelope,
} from './morphMath';

describe('easeAmalyte (cubic-bezier(0.22, 1, 0.36, 1))', () => {
  it('pins the endpoints', () => {
    expect(easeAmalyte(0)).toBe(0);
    expect(easeAmalyte(1)).toBe(1);
  });

  it('clamps outside [0, 1]', () => {
    expect(easeAmalyte(-0.5)).toBe(0);
    expect(easeAmalyte(1.5)).toBe(1);
  });

  it('is monotonically increasing', () => {
    let previous = 0;
    for (let x = 0.05; x < 1; x += 0.05) {
      const y = easeAmalyte(x);
      expect(y).toBeGreaterThan(previous);
      previous = y;
    }
  });

  it('is strongly ease-out (matches the --ease-amalyte curve)', () => {
    // Reference values for cubic-bezier(0.22, 1, 0.36, 1) (both control
    // points at y=1, so very strong ease-out): x=0.25 -> y ~0.765,
    // x=0.5 -> y ~0.961.
    expect(easeAmalyte(0.25)).toBeCloseTo(0.765, 2);
    expect(easeAmalyte(0.5)).toBeCloseTo(0.961, 2);
  });
});

describe('resolveMorph', () => {
  it('holds a single shape (from === to, mix 0)', () => {
    expect(resolveMorph(0, 1)).toEqual({ from: 0, to: 0, mix: 0 });
    expect(resolveMorph(0.7, 1)).toEqual({ from: 0, to: 0, mix: 0 });
  });

  it('starts on the first shape and ends fully on the last', () => {
    expect(resolveMorph(0, 4)).toEqual({ from: 0, to: 1, mix: 0 });
    expect(resolveMorph(1, 4)).toEqual({ from: 3, to: 3, mix: 0 });
  });

  it('walks shape pairs as progress advances', () => {
    const n = 4;
    expect(resolveMorph(0.2, n).from).toBe(0);
    expect(resolveMorph(0.2, n).to).toBe(1);
    // 0.5 * (4-1) = 1.5 -> halfway between shapes 1 and 2.
    const mid = resolveMorph(0.5, n);
    expect(mid.from).toBe(1);
    expect(mid.to).toBe(2);
    expect(mid.mix).toBeCloseTo(easeAmalyte(0.5), 6);
  });

  it('eases the mix within each segment (never linear)', () => {
    const { mix } = resolveMorph(0.5 / 3, 4); // raw segment fraction 0.5
    expect(mix).toBeCloseTo(easeAmalyte(0.5), 6);
    expect(mix).not.toBeCloseTo(0.5, 2);
  });

  it('clamps out-of-range progress', () => {
    expect(resolveMorph(-1, 4)).toEqual({ from: 0, to: 1, mix: 0 });
    expect(resolveMorph(2, 4)).toEqual({ from: 3, to: 3, mix: 0 });
  });
});

describe('scrollObjectEnvelope', () => {
  it('opens on a fully-formed first object (no entrance at progress 0)', () => {
    const env = scrollObjectEnvelope(0, 0, 3);
    expect(env.presence).toBe(1);
    expect(env.scale).toBe(1);
    expect(env.offsetY).toBe(0);
  });

  it('closes on the last object still fully present at progress 1', () => {
    const env = scrollObjectEnvelope(1, 2, 3);
    expect(env.presence).toBe(1);
    expect(env.scale).toBe(1);
  });

  it('keeps objects at zero presence before their window', () => {
    expect(scrollObjectEnvelope(0, 1, 3).presence).toBe(0);
    expect(scrollObjectEnvelope(0.1, 2, 3).presence).toBe(0);
  });

  it('peaks mid-window for middle objects', () => {
    const env = scrollObjectEnvelope(0.5, 1, 3);
    expect(env.presence).toBe(1);
    expect(env.scale).toBe(1);
    expect(env.offsetY).toBe(0);
  });

  it('crossfades: neighbors overlap during a handoff', () => {
    // Progress 1/3 is the boundary between objects 0 and 1 with steps=3.
    const outgoing = scrollObjectEnvelope(0.36, 0, 3);
    const incoming = scrollObjectEnvelope(0.36, 1, 3);
    expect(outgoing.presence).toBeGreaterThan(0);
    expect(outgoing.presence).toBeLessThan(1);
    expect(incoming.presence).toBeGreaterThan(0);
    expect(incoming.presence).toBeLessThan(1);
    // Outgoing drifts up + shrinks; incoming drifts up from below + grows.
    expect(outgoing.offsetY).toBeGreaterThan(0);
    expect(incoming.offsetY).toBeLessThan(0);
    expect(outgoing.scale).toBeLessThan(1);
    expect(incoming.scale).toBeLessThan(1);
  });

  it('handles degenerate step counts without NaN', () => {
    const env = scrollObjectEnvelope(0.5, 0, 0);
    expect(env.presence).toBe(0);
  });
});

describe('progressThroughViewport (particles fallback scroll listener)', () => {
  it('is 0 when the element top enters at the viewport bottom', () => {
    expect(progressThroughViewport(800, 400, 800)).toBe(0);
  });

  it('is 1 when the element bottom leaves at the viewport top', () => {
    expect(progressThroughViewport(-400, 400, 800)).toBe(1);
  });

  it('hits 0.5 when the element is centered', () => {
    expect(progressThroughViewport(200, 400, 800)).toBeCloseTo(0.5);
  });

  it('clamps outside the travel range', () => {
    expect(progressThroughViewport(1200, 400, 800)).toBe(0);
    expect(progressThroughViewport(-900, 400, 800)).toBe(1);
  });
});

describe('progressWithinTrack (scroll-scene fallback scroll listener)', () => {
  it('is 0 while the track top is at the viewport top', () => {
    expect(progressWithinTrack(0, 3200, 800)).toBe(0);
  });

  it('is 1 when the track bottom reaches the viewport bottom', () => {
    expect(progressWithinTrack(-2400, 3200, 800)).toBe(1);
  });

  it('scales linearly in between', () => {
    expect(progressWithinTrack(-1200, 3200, 800)).toBeCloseTo(0.5);
  });

  it('returns 0 for a track no taller than the viewport (no NaN)', () => {
    expect(progressWithinTrack(-50, 800, 800)).toBe(0);
  });
});

describe('clamp01', () => {
  it('clamps to [0, 1]', () => {
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(1.3)).toBe(1);
  });
});
