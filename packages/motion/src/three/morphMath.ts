// morphMath — pure transition math shared by GlassParticles and
// GlassScrollScene: the --ease-amalyte cubic-bezier as a JS function, the
// shape-morph resolver (progress -> from/to attribute pair + eased mix), the
// per-object scroll envelope (ease in / hold / ease out), and the two scroll
// progress formulas used by the standalone (no-ScrollTrigger) fallback
// listeners. No three.js / GSAP imports — everything here is headlessly
// testable.

// --- Easing ----------------------------------------------------------------

// --ease-amalyte = cubic-bezier(0.22, 1, 0.36, 1) from tokens-core, evaluated
// as y(x) via Newton-Raphson with a bisection fallback (the standard CSS
// timing-function solver). Used wherever scroll progress needs to feel
// spring-eased rather than linear.
const BEZIER_X1 = 0.22;
const BEZIER_Y1 = 1;
const BEZIER_X2 = 0.36;
const BEZIER_Y2 = 1;

function sampleBezierX(t: number): number {
  const inv = 1 - t;
  return 3 * inv * inv * t * BEZIER_X1 + 3 * inv * t * t * BEZIER_X2 + t * t * t;
}

function sampleBezierY(t: number): number {
  const inv = 1 - t;
  return 3 * inv * inv * t * BEZIER_Y1 + 3 * inv * t * t * BEZIER_Y2 + t * t * t;
}

function sampleBezierDerivativeX(t: number): number {
  const inv = 1 - t;
  return 3 * inv * inv * BEZIER_X1 + 6 * inv * t * (BEZIER_X2 - BEZIER_X1) + 3 * t * t * (1 - BEZIER_X2);
}

export function easeAmalyte(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  // Newton-Raphson: solve sampleBezierX(t) = x for t.
  let t = x;
  for (let i = 0; i < 8; i++) {
    const error = sampleBezierX(t) - x;
    if (Math.abs(error) < 1e-6) return sampleBezierY(t);
    const derivative = sampleBezierDerivativeX(t);
    if (Math.abs(derivative) < 1e-6) break;
    t -= error / derivative;
  }
  // Bisection fallback for near-vertical tangents.
  let lo = 0;
  let hi = 1;
  t = x;
  while (hi - lo > 1e-6) {
    if (sampleBezierX(t) < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return sampleBezierY(t);
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// --- Particle morphs -------------------------------------------------------

export type MorphState = {
  /** Index of the shape target bound to the aFrom attribute. */
  from: number;
  /** Index of the shape target bound to the aTo attribute. */
  to: number;
  /** Eased 0..1 mix between the two (fed to the uMix uniform). */
  mix: number;
};

// Maps a 0..1 progress across N shapes to the current attribute pair. With
// one shape the field simply holds it (from === to, mix 0). The raw segment
// fraction is eased so a scrubbed morph accelerates out of one shape and
// settles into the next instead of lerping robotically.
export function resolveMorph(progress: number, shapeCount: number): MorphState {
  if (shapeCount <= 1) return { from: 0, to: 0, mix: 0 };
  const segment = clamp01(progress) * (shapeCount - 1);
  const from = Math.min(Math.floor(segment), shapeCount - 1);
  const to = Math.min(from + 1, shapeCount - 1);
  return { from, to, mix: easeAmalyte(segment - from) };
}

// --- Scroll-scene object envelopes -----------------------------------------

// Fraction of an object's scroll window spent easing in (and, mirrored, out).
const TRANSITION_FRAC = 0.35;

export type ObjectEnvelope = {
  /** 0..1 overall presence — drives the material's uOpacity. */
  presence: number;
  /** Scale multiplier: objects grow in from / shrink out to 0.72. */
  scale: number;
  /** Vertical drift in world units: objects enter from below, exit upward. */
  offsetY: number;
};

// Where object `index` stands within a 0..1 scroll scrub across `steps`
// objects. Each object's local window is [0, 1], but its exit runs over
// [1, 1 + TRANSITION_FRAC] — exactly while the next object enters over its
// [0, TRANSITION_FRAC] — so the handoff is a true crossfade with no blank
// frame at the boundary. The first object starts fully formed (no entrance)
// and the last never exits, so the scene opens and closes on a settled
// object rather than an empty frame.
export function scrollObjectEnvelope(
  progress: number,
  index: number,
  steps: number
): ObjectEnvelope {
  if (steps <= 0) return { presence: 0, scale: 0, offsetY: 0 };
  const local = clamp01(progress) * steps - index;
  const enter = index === 0 ? 1 : easeAmalyte(clamp01(local / TRANSITION_FRAC));
  const exit =
    index === steps - 1
      ? 1
      : easeAmalyte(clamp01((1 + TRANSITION_FRAC - local) / TRANSITION_FRAC));
  return {
    presence: enter * exit,
    scale: (0.72 + 0.28 * enter) * (0.72 + 0.28 * exit),
    offsetY: -0.9 * (1 - enter) + 0.9 * (1 - exit),
  };
}

// --- Standalone scroll progress (no-ScrollTrigger fallback) -----------------

// Progress of an element travelling through the viewport: 0 when its top
// enters at the bottom edge, 1 when its bottom leaves at the top edge.
export function progressThroughViewport(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number
): number {
  const range = viewportHeight + rectHeight;
  if (range <= 0) return 0;
  return clamp01((viewportHeight - rectTop) / range);
}

// Progress within a tall scroll track that pins a sticky viewport-height
// canvas: 0 when the track's top reaches the viewport top, 1 when its bottom
// reaches the viewport bottom.
export function progressWithinTrack(
  rectTop: number,
  trackHeight: number,
  viewportHeight: number
): number {
  const range = trackHeight - viewportHeight;
  if (range <= 0) return 0;
  return clamp01(-rectTop / range);
}
