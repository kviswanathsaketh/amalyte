'use client';

// HeroSceneContents — everything inside the R3F Canvas: the glass form, the
// tube-line + orb, and the rig that wires scroll into the scene. Scroll
// progress (0→1, measured by HeroScene from the shared Lenis-driven window
// scroll) drives all three terms named in addendum §3: camera dolly, the
// shader flow-speed uniform, and the orb's travel along the tube path.

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { HeroPalette } from './palette';
import { GlassForm } from './GlassForm';
import { TubeLine3D } from './TubeLine3D';

const CAMERA_Z_REST = 7.5;
const CAMERA_Z_DOLLY = 2.6;
// Idle flow speed, and how much scrolling adds to it.
const FLOW_SPEED_BASE = 0.35;
const FLOW_SPEED_SCROLL = 2.0;
// How far one full hero-height of scroll carries the orb along the path.
const TRAVEL_PER_SCROLL = 0.9;

export function HeroSceneContents({
  palette,
  intensityScale,
  progressRef,
}: {
  palette: HeroPalette;
  intensityScale: number;
  // Mutable 0→1 scroll progress, owned and updated by HeroScene.
  progressRef: React.RefObject<number>;
}) {
  const flowTimeRef = useRef(0);
  const travelRef = useRef(0);

  useFrame(({ camera }, delta) => {
    const progress = progressRef.current ?? 0;
    const flowSpeed = (FLOW_SPEED_BASE + progress * FLOW_SPEED_SCROLL) * intensityScale;

    flowTimeRef.current += delta * flowSpeed;
    // Slow idle drift keeps the orb alive at rest; scroll carries it along
    // the path (fract keeps both terms continuous, no jump at wraparound).
    travelRef.current = (flowTimeRef.current * 0.05 + progress * TRAVEL_PER_SCROLL) % 1;

    // Camera dolly: ease in toward the glass form as the hero scrolls away,
    // damped so Lenis's inertia reads through the camera too.
    const targetZ = CAMERA_Z_REST - progress * CAMERA_Z_DOLLY;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -progress * 0.4, 4, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <GlassForm palette={palette} flowTimeRef={flowTimeRef} intensityScale={intensityScale} />
      <TubeLine3D palette={palette} travelRef={travelRef} />
    </>
  );
}
