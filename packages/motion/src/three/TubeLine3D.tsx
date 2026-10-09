'use client';

// TubeLine3D — the §5.4 glowing tube-line with orb marker as real 3D
// geometry: a TubeGeometry swept along a CatmullRom curve behind the glass
// form, drawn twice (wide additive glow pass + crisp core pass, the same
// two-layer trick as the CSS version's blurred trail + crisp stroke), with
// the glossy orb riding the curve. The orb's position along the path is the
// scroll-driven `uTravel` uniform — zero per-frame React state.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HeroPalette } from './palette';
import {
  ORB_FRAGMENT_SHADER,
  ORB_HALO_FRAGMENT_SHADER,
  ORB_VERTEX_SHADER,
  TUBE_FRAGMENT_SHADER,
  TUBE_VERTEX_SHADER,
} from './shaders';

const CORE_RADIUS = 0.045;
const GLOW_RADIUS = 0.11;
const ORB_RADIUS = 0.11;

// A lazy S-curve sweeping across the hero behind the glass form — the
// connective device between the blob art and the content, per §5.4.
const CURVE_POINTS: [number, number, number][] = [
  [-3.4, -1.0, -0.8],
  [-1.5, 0.75, 0.3],
  [0.5, -0.45, -0.4],
  [2.2, 0.65, 0.1],
  [3.5, -0.3, -0.7],
];

function paletteUniforms(palette: HeroPalette) {
  return {
    uHighlight: { value: new THREE.Color(palette.highlight) },
    uCore: { value: new THREE.Color(palette.core) },
    uShadow: { value: new THREE.Color(palette.shadow) },
  };
}

export function TubeLine3D({
  palette,
  travelRef,
}: {
  palette: HeroPalette;
  // Orb position along the path, 0..1 — advanced by the scene rig from
  // scroll progress plus a slow idle drift.
  travelRef: React.RefObject<number>;
}) {
  const orbRef = useRef<THREE.Group>(null);

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(CURVE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    []
  );
  const coreGeometry = useMemo(() => new THREE.TubeGeometry(curve, 220, CORE_RADIUS, 16, false), [curve]);
  const glowGeometry = useMemo(() => new THREE.TubeGeometry(curve, 220, GLOW_RADIUS, 16, false), [curve]);
  const orbGeometry = useMemo(() => new THREE.SphereGeometry(ORB_RADIUS, 32, 32), []);
  const haloGeometry = useMemo(() => new THREE.SphereGeometry(ORB_RADIUS * 2.1, 32, 32), []);
  // Scratch vector for getPointAt — avoids a per-frame allocation.
  const orbScratch = useMemo(() => new THREE.Vector3(), []);

  const coreMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TUBE_VERTEX_SHADER,
        fragmentShader: TUBE_FRAGMENT_SHADER,
        uniforms: { ...paletteUniforms(palette), uTravel: { value: 0 }, uAlpha: { value: 1 } },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette.highlight, palette.core, palette.shadow]
  );
  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TUBE_VERTEX_SHADER,
        fragmentShader: TUBE_FRAGMENT_SHADER,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { ...paletteUniforms(palette), uTravel: { value: 0 }, uAlpha: { value: 0.3 } },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette.highlight, palette.core, palette.shadow]
  );
  const orbMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ORB_VERTEX_SHADER,
        fragmentShader: ORB_FRAGMENT_SHADER,
        uniforms: {
          uHighlight: { value: new THREE.Color(palette.highlight) },
          uAccent: { value: new THREE.Color(palette.accent) },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette.highlight, palette.accent]
  );
  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ORB_VERTEX_SHADER,
        fragmentShader: ORB_HALO_FRAGMENT_SHADER,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: { uHighlight: { value: new THREE.Color(palette.highlight) } },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette.highlight]
  );

  useFrame(() => {
    const travel = travelRef.current ?? 0;
    coreMaterial.uniforms.uTravel.value = travel;
    glowMaterial.uniforms.uTravel.value = travel;
    orbRef.current?.position.copy(
      curve.getPointAt(Math.min(1, Math.max(0, travel % 1)), orbScratch)
    );
  });

  return (
    <>
      {/* Glow trail first (additive, behind), then the crisp core stroke */}
      <mesh geometry={glowGeometry} material={glowMaterial} />
      <mesh geometry={coreGeometry} material={coreMaterial} />
      <group ref={orbRef}>
        <mesh geometry={haloGeometry} material={haloMaterial} />
        <mesh geometry={orbGeometry} material={orbMaterial} />
      </group>
    </>
  );
}
