import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_PARTICLE_SHAPES,
  MIN_PARTICLE_COUNT,
  generateShapeTargets,
  resolveParticleCount,
} from './particleShapes';

describe('generateShapeTargets', () => {
  it('returns one count*3 Float32Array per shape id', () => {
    const targets = generateShapeTargets(DEFAULT_PARTICLE_SHAPES, 500);
    expect(targets).toHaveLength(DEFAULT_PARTICLE_SHAPES.length);
    for (const target of targets) {
      expect(target).toBeInstanceOf(Float32Array);
      expect(target).toHaveLength(500 * 3);
    }
  });

  it('is deterministic (same shapes + count => identical buffers)', () => {
    const a = generateShapeTargets(['sphere', 'torus'], 200);
    const b = generateShapeTargets(['sphere', 'torus'], 200);
    expect(Array.from(a[0])).toEqual(Array.from(b[0]));
    expect(Array.from(a[1])).toEqual(Array.from(b[1]));
  });

  it('keeps every shape within the shared camera framing (~1.9 units)', () => {
    const targets = generateShapeTargets(DEFAULT_PARTICLE_SHAPES, 1000);
    for (const target of targets) {
      for (let i = 0; i < target.length; i += 3) {
        const r = Math.hypot(target[i], target[i + 1], target[i + 2]);
        expect(r).toBeLessThan(1.9);
      }
    }
  });

  it('lays sphere points on a shell of radius ~1.35', () => {
    const [sphere] = generateShapeTargets(['sphere'], 1000);
    for (let i = 0; i < sphere.length; i += 3) {
      const r = Math.hypot(sphere[i], sphere[i + 1], sphere[i + 2]);
      expect(r).toBeGreaterThan(1.35 - 0.06);
      expect(r).toBeLessThan(1.35 + 0.06);
    }
  });

  it('lays torus points on the major=1.15 minor~0.5 tube', () => {
    const [torus] = generateShapeTargets(['torus'], 1000);
    for (let i = 0; i < torus.length; i += 3) {
      const x = torus[i];
      const y = torus[i + 1];
      const z = torus[i + 2];
      const tubeDistance = Math.hypot(Math.hypot(x, z) - 1.15, y);
      expect(tubeDistance).toBeGreaterThan(0.5 - 0.05);
      expect(tubeDistance).toBeLessThan(0.5 + 0.05);
    }
  });

  it('produces distinct buffers per shape (a morph actually moves points)', () => {
    const [a, b] = generateShapeTargets(['sphere', 'wave'], 300);
    let divergent = 0;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i] - b[i]) > 0.01) divergent++;
    }
    expect(divergent).toBeGreaterThan(a.length * 0.5);
  });

  it('throws on an empty shape list or an unknown shape id', () => {
    expect(() => generateShapeTargets([], 100)).toThrow();
    expect(() =>
      generateShapeTargets(['sphere', 'nope' as never], 100)
    ).toThrow(/unknown shape id/);
  });
});

describe('resolveParticleCount', () => {
  it('keeps the requested count on large high-DPR viewports', () => {
    expect(resolveParticleCount(DEFAULT_PARTICLE_COUNT, 2, 1920)).toBe(DEFAULT_PARTICLE_COUNT);
  });

  it('reduces on smaller viewports and 1x displays', () => {
    expect(resolveParticleCount(6000, 2, 1280)).toBe(4500);
    expect(resolveParticleCount(6000, 1, 1920)).toBe(4800);
    expect(resolveParticleCount(6000, 1, 1280)).toBe(3600);
  });

  it('never thins out below the minimum', () => {
    expect(resolveParticleCount(100, 1, 800)).toBe(MIN_PARTICLE_COUNT);
  });
});
