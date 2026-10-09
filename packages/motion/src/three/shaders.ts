// Hand-built GLSL for the hero scene — the 3D translation of the locked v8
// liquid-glass technique (base spec §5.3) and the tube-line/orb motif (§5.4).
// No three.js built-in materials: the palette comes in as uniforms and every
// visual term below maps to a numbered item in the v8 checklist (called out
// inline). Both materials share the same vertex shader shape (world-space
// normal/position varyings) so cameraPosition-based view math works.

export const GLASS_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const GLASS_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uHighlight;
  uniform vec3 uCore;
  uniform vec3 uShadow;
  // Flow time — advanced at the scroll-driven flow speed, not wall-clock
  // time, so scrolling literally speeds the fluid up (addendum §3).
  uniform float uFlowTime;
  // Key-light direction, lerped toward the cursor position each frame in
  // GlassForm (crazy-hero pass) -- replaces the old fixed upper-left light.
  uniform vec3 uLightDir;
  // Per-object fade, driven by scroll-scene transitions (GlassScrollScene)
  // -- 1.0 everywhere the glass stands alone (RawGlassHero, GlassForm).
  uniform float uOpacity;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  // The procedural "scene behind the glass": two large soft palette
  // landmasses plus a near-white luminosity core, drifting slowly — the §5.1
  // blob construction as a shader function. Sampling it through the
  // refracted ray is what produces real color bleed-through (v8 #7), the
  // strongest single "real glass" cue per the spec.
  // Soft gaussian landmass at center c.
  float blob(vec2 p, vec2 c, float sharpness) {
    vec2 d = p - c;
    return exp(-sharpness * dot(d, d));
  }

  vec3 sceneBehind(vec3 dir) {
    vec2 p = dir.xy * 1.5;
    float t = uFlowTime;
    float massA = blob(p, vec2( 0.42 + 0.30 * sin(t * 0.21),  0.18 + 0.24 * cos(t * 0.17)), 2.4);
    float massB = blob(p, vec2(-0.46 + 0.34 * cos(t * 0.13), -0.12 + 0.28 * sin(t * 0.19)), 2.8);
    float luma  = blob(p, vec2( 0.05 + 0.16 * sin(t * 0.11),  0.10), 3.2);
    vec3 col = uShadow * 0.20;
    col += uCore * massA * 0.85;
    col += uHighlight * massB * 0.70;
    col += vec3(1.0) * luma * 0.16;
    return col;
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 incident = -viewDir;

    // v8 #1 + #2 — real refraction with TRUE per-channel chromatic
    // dispersion: one refract() per color channel at slightly different
    // IORs (R < G < B, matching how real glass splits light), the 3D analog
    // of the CSS filter's three feDisplacementMap scales. Total internal
    // reflection returns a zero vector, which sceneBehind maps to the calm
    // base color — no artifacts.
    vec3 dispersed;
    dispersed.r = sceneBehind(refract(incident, normal, 1.0 / 1.31)).r;
    dispersed.g = sceneBehind(refract(incident, normal, 1.0 / 1.33)).g;
    dispersed.b = sceneBehind(refract(incident, normal, 1.0 / 1.36)).b;

    // v8 #3 — near-zero interior fill: clear glass, not frosted milk.
    vec3 color = dispersed * 0.95 + vec3(1.0) * 0.015;

    // v8 #4 — curvature-correct rim highlight. On real 3D geometry a
    // fresnel term IS curvature-correct by construction (the CSS version
    // needs the conic-gradient + mask-composite trick to approximate this).
    // The topLight falloff reproduces the conic ring's "brightest at the
    // top, dimmest at the bottom" lighting direction.
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    float topLight = smoothstep(-0.6, 0.9, normal.y);
    color += uHighlight * fresnel * (0.20 + 0.80 * topLight) * 1.05;
    color += vec3(1.0) * fresnel * topLight * 0.30;

    // v8 #5 — curved specular patch: a broad, soft lobe from a key light
    // sitting upper-left, drifting slowly (the idle wander from GlassCard's
    // interactive tier, permanently on but subtle).
    vec3 lightDir = normalize(vec3(-0.35 + 0.12 * sin(uFlowTime * 0.15), 0.80, 0.60));
    float specular = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 18.0);
    color += vec3(1.0) * specular * 0.45;

    // v8 #6 — wall-thickness shading: bright inset along the very top edge,
    // a shadow-tinted dim along the bottom — the glass reads as having
    // depth, not as a flat pane.
    color += vec3(1.0) * smoothstep(0.72, 1.0, normal.y) * 0.10;
    color -= uShadow * smoothstep(0.35, 1.0, -normal.y) * 0.08;
    color = max(color, vec3(0.0));

    // Alpha: barely-there interior, opaque-ish rim — the silhouette carries
    // the shape while the center stays see-through. uOpacity multiplies the
    // whole thing so scene transitions can fade an object out entirely.
    float alpha = clamp(0.07 + fresnel * 0.85 + specular * 0.35, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const TUBE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// uv.x runs along the tube's length (TubeGeometry guarantees this), which is
// what lets the §5.4 tail->head gradient and the orb-tracking pulse ride the
// path without any per-frame CPU work.
export const TUBE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uHighlight;
  uniform vec3 uCore;
  uniform vec3 uShadow;
  // Position of the traveling orb along the path, 0..1 — the gradient pulse
  // follows it so the tube reads brightest where the energy currently is.
  uniform float uTravel;
  // 1.0 for the crisp core pass, lower for the additive glow pass.
  uniform float uAlpha;

  varying vec2 vUv;

  void main() {
    float t = vUv.x;

    // §5.4 gradient stroke: dim tail -> bright head
    // (shadow -> core at 55% -> highlight), matching the CSS TubeLine's
    // linearGradient stops exactly.
    vec3 color = mix(uShadow, uCore, smoothstep(0.0, 0.55, t));
    color = mix(color, uHighlight, smoothstep(0.55, 1.0, t));

    // Energy pulse centered on the orb's position — the "glowing" in
    // tube-line, replacing the CSS version's blurred drop-shadow trail.
    float pulse = exp(-14.0 * abs(t - uTravel));
    color += uHighlight * pulse * 0.85;

    gl_FragColor = vec4(color, uAlpha);
  }
`;

// The orb marker (§5.4): bright glossy sphere — highlight-hot center fading
// to core at the silhouette, with a small white gloss speck upper-left,
// mirroring the SVG orb's radialGradient + gloss ellipse.
export const ORB_VERTEX_SHADER = GLASS_VERTEX_SHADER;

export const ORB_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uHighlight;
  uniform vec3 uAccent;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float facing = max(dot(normal, viewDir), 0.0);

    vec3 color = mix(uAccent, uHighlight, pow(facing, 1.4));

    // Gloss speck, offset toward the key light like the SVG ellipse at
    // (-30%, -35%).
    vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.6));
    color += vec3(1.0) * pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 32.0) * 0.7;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Additive halo sphere behind the orb — stands in for the CSS version's
// double drop-shadow glow (no postprocessing bloom in this scene, per the
// frame-budget guardrails).
export const ORB_HALO_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uHighlight;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    gl_FragColor = vec4(uHighlight * rim * 0.6, rim * 0.5);
  }
`;

// ---------------------------------------------------------------------------
// GlassParticles (2026-08-27 "Liquid Monochrome" direction): tiny liquid-glass
// droplets (THREE.Points) that collectively form shapes and morph between
// them. Morphing happens entirely in the vertex shader — two shape-target
// attributes mixed by an eased uniform — so a 6k-droplet morph costs zero CPU
// per frame. A gentle per-seed sinusoidal drift keeps the field liquid, never
// static, and a CPU-damped pointer uniform displaces nearby droplets with a
// soft falloff (surface tension — the only pointer interaction here).
// ---------------------------------------------------------------------------

export const PARTICLES_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;

  uniform float uMix;
  uniform float uTime;
  // Base sprite size in px (already DPR-scaled on the CPU side via
  // uPixelRatio; attenuated by distance below).
  uniform float uSize;
  uniform float uPixelRatio;
  // Cursor position projected onto the z=0 plane, plus a damped force so the
  // displacement eases back out (springy) once the pointer slows or leaves.
  uniform vec3 uPointer;
  uniform float uPointerForce;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vSeed = aSeed;
    vec3 pos = mix(aFrom, aTo, uMix);

    // Continuous liquid drift: three low-amplitude sinusoids decorrelated by
    // seed, so the formed shape breathes without ever breaking apart.
    float t = uTime * 0.55 + aSeed * 6.2831;
    pos += 0.035 * vec3(
      sin(t * 1.1 + pos.y * 2.0),
      cos(t * 0.9 + pos.z * 2.0),
      sin(t * 0.7 + pos.x * 2.0)
    );

    // Surface tension: droplets within the pointer radius are pushed away
    // with a quadratic soft falloff; uPointerForce is damped on the CPU, so
    // the field settles back instead of staying dented.
    vec3 toParticle = pos - uPointer;
    float dist = length(toParticle);
    float falloff = 1.0 - smoothstep(0.0, 0.9, dist);
    pos += normalize(toParticle + vec3(1e-4)) * falloff * falloff * uPointerForce * 0.45;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;
    float sizeJitter = 0.7 + 0.6 * fract(aSeed * 7.31);
    gl_PointSize = uSize * sizeJitter * uPixelRatio * (4.2 / vDepth);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Each droplet is a tiny glass bead: near-clear interior, a fresnel-ish rim
// ring, a specular dot offset toward the key light, and a faint per-channel
// chromatic edge — the sprite-scale analog of the glass shader's three
// refract() calls, done by evaluating the disk mask at slightly different
// radii per channel (R widest, B tightest) and tinting the divergence with
// the palette's violet core. Rendered with additive blending at low alpha so
// overlaps glow slightly without blowing out on the matte-black canvas.
export const PARTICLES_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uHighlight;
  uniform vec3 uCore;
  uniform vec3 uShadow;
  uniform vec3 uLightDir;

  varying float vSeed;
  varying float vDepth;

  void main() {
    vec2 pc = gl_PointCoord - 0.5;

    // Per-channel disk masks at slightly different radii — where they
    // diverge at the edge, a violet-blue refraction fringe appears.
    float rR = length(pc) * 2.0 * 1.05;
    float rG = length(pc) * 2.0;
    float rB = length(pc) * 2.0 * 0.95;
    float diskR = 1.0 - smoothstep(0.86, 1.0, rR);
    float diskG = 1.0 - smoothstep(0.86, 1.0, rG);
    float diskB = 1.0 - smoothstep(0.86, 1.0, rB);

    // Clear glass interior: barely-there cool fill (white/silver, never a
    // flat violet fill — the palette only shows through refraction terms).
    vec3 color = vec3(0.92, 0.93, 1.0) * 0.10 * diskG;
    float alpha = diskG * 0.16;

    // Fresnel-ish rim ring, carrying the highlight tint like the mesh glass.
    float rim = smoothstep(0.55, 0.9, rG) * diskG;
    color += uHighlight * rim * 0.75;
    alpha += rim * 0.55;

    // Specular dot, offset toward the (cursor-reactive) key light.
    vec2 lightOffset = normalize(uLightDir.xy + vec2(1e-4)) * 0.16;
    vec2 toSpec = pc - lightOffset;
    float spec = exp(-38.0 * dot(toSpec, toSpec));
    color += vec3(1.0) * spec * 0.9;
    alpha += spec * 0.8;

    // Chromatic fringe: the R/B disk divergence at the very edge, tinted
    // with the violet core at low alpha.
    float fringe = clamp(diskR - diskB, 0.0, 1.0);
    color += uCore * fringe * 0.5;
    alpha += fringe * 0.22;

    // Depth fade so the far side of a formed shape recedes into the black.
    float depthFade = smoothstep(7.5, 3.2, vDepth);
    gl_FragColor = vec4(color * depthFade, alpha * depthFade);
  }
`;
