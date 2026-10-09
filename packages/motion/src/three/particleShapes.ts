// particleShapes — parametric point-cloud shape targets for GlassParticles.
// Pure functions only (no three.js import) so the generators are testable
// headlessly and the component stays a thin imperative shell. Every shape is
// sampled into a flat Float32Array of count*3 xyz values, roughly bounded to
// a ~1.8-unit radius so all shapes share one camera framing. Sampling is
// deterministic (seeded mulberry32) — tests assert shape invariants exactly.

export type ParticleShapeId = 'sphere' | 'torus' | 'wave' | 'shell';

export const DEFAULT_PARTICLE_SHAPES: ParticleShapeId[] = ['sphere', 'torus', 'wave', 'shell'];

export const DEFAULT_PARTICLE_COUNT = 6000;
export const MIN_PARTICLE_COUNT = 1500;

// Deterministic PRNG so shape targets are stable frame-to-frame and in tests.
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fibonacci-sphere shell with slight radial jitter — reads as a blown-glass
// bubble rather than a solid ball.
function fillSphere(target: Float32Array, count: number, rand: () => number): void {
  const radius = 1.35;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const r = radius + (rand() - 0.5) * 0.1;
    target[i * 3] = Math.cos(theta) * ringRadius * r;
    target[i * 3 + 1] = y * r;
    target[i * 3 + 2] = Math.sin(theta) * ringRadius * r;
  }
}

// Torus ring, uniformly sampled over both angles with a small tube jitter.
function fillTorus(target: Float32Array, count: number, rand: () => number): void {
  const major = 1.15;
  const minor = 0.5;
  for (let i = 0; i < count; i++) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 2;
    const tube = minor + (rand() - 0.5) * 0.08;
    const ringRadius = major + tube * Math.cos(v);
    target[i * 3] = ringRadius * Math.cos(u);
    target[i * 3 + 1] = tube * Math.sin(v);
    target[i * 3 + 2] = ringRadius * Math.sin(u);
  }
}

// Rippling plane: a liquid surface caught mid-wave, sampled uniformly in xz.
// Extent 1.3 keeps the corners (hypot(1.3, 1.3) ~ 1.84) inside the shared
// ~1.9-unit camera framing.
function fillWave(target: Float32Array, count: number, rand: () => number): void {
  const extent = 1.3;
  for (let i = 0; i < count; i++) {
    const x = (rand() * 2 - 1) * extent;
    const z = (rand() * 2 - 1) * extent;
    const y = 0.28 * Math.sin(2.2 * x + 0.8) * Math.cos(2.6 * z) + (rand() - 0.5) * 0.06;
    target[i * 3] = x;
    target[i * 3 + 1] = y;
    target[i * 3 + 2] = z;
  }
}

// Shell/fan: layered arcs like a scallop shell (reference: stacked glass
// louvers). Seven layers of growing radius, each a ~220° arc tilted back a
// little more than the last, with a small depth offset per layer.
function fillShell(target: Float32Array, count: number, rand: () => number): void {
  const layers = 7;
  const arcStart = (20 * Math.PI) / 180;
  const arcEnd = (160 * Math.PI) / 180;
  for (let i = 0; i < count; i++) {
    const layer = i % layers;
    const radius = 0.45 + layer * 0.18;
    const theta = arcStart + rand() * (arcEnd - arcStart);
    const tilt = 0.16 * layer;
    const x = radius * Math.cos(theta);
    const yRaw = radius * Math.sin(theta);
    target[i * 3] = x + (rand() - 0.5) * 0.05;
    target[i * 3 + 1] = yRaw * Math.cos(tilt) - 0.55 + layer * 0.02 + (rand() - 0.5) * 0.05;
    target[i * 3 + 2] = -yRaw * Math.sin(tilt) + (rand() - 0.5) * 0.05;
  }
}

const FILLERS: Record<ParticleShapeId, (t: Float32Array, n: number, r: () => number) => void> = {
  sphere: fillSphere,
  torus: fillTorus,
  wave: fillWave,
  shell: fillShell,
};

// One target buffer per shape id, all `count` points long. Throws on an
// unknown id — the prop is typed, but a mistyped id surfacing as a silent
// black screen is much worse than a loud build-time error.
export function generateShapeTargets(
  shapes: readonly ParticleShapeId[],
  count: number
): Float32Array[] {
  if (shapes.length === 0) {
    throw new Error('generateShapeTargets: at least one shape is required');
  }
  return shapes.map((shape, shapeIndex) => {
    const filler = FILLERS[shape];
    if (!filler) {
      throw new Error(`generateShapeTargets: unknown shape id "${String(shape)}"`);
    }
    const target = new Float32Array(count * 3);
    // Seed per shape so reordering `shapes` never reshuffles another shape's
    // point distribution (which would read as a morph glitch).
    filler(target, count, mulberry32(0xa1a000 + shapeIndex * 7919));
    return target;
  });
}

// Auto-reduction for weak hardware: smaller viewports and 1x displays get
// fewer droplets, clamped so the shape never thins out into noise.
export function resolveParticleCount(count: number, dpr: number, viewportWidth: number): number {
  let resolved = count;
  if (viewportWidth < 1440) resolved *= 0.75;
  if (dpr < 1.5) resolved *= 0.8;
  return Math.max(MIN_PARTICLE_COUNT, Math.round(resolved));
}
