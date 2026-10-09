'use client';

// GlassForm — the hero's central glass object: a torus knot (organic,
// flowing, reads as liquid glass mid-motion) rendered with the v8 glass
// ShaderMaterial from ./shaders. All high-frequency state (uniforms,
// rotation, drag velocity) is written imperatively inside useFrame/pointer
// handlers — never through React state.
//
// Crazy-hero pass (2026-08-22): two things that make this a real object
// instead of a passive render --
// 1. The key light tracks the cursor (uLightDir lerps toward pointer
//    position every frame) instead of sitting fixed upper-left.
// 2. The form is draggable: grab it and rotate it by hand. On release it
//    keeps spinning from your drag velocity and decays back to the idle
//    auto-rotation, via THREE.MathUtils.damp -- same spring-feel primitive
//    already used for the camera dolly, not a new physics dependency.

import { useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { HeroPalette } from './palette';
import { GLASS_FRAGMENT_SHADER, GLASS_VERTEX_SHADER } from './shaders';

// Idle auto-rotation speed (rad/s at intensityScale=1) -- drag velocity
// decays toward this, never to a dead stop.
const IDLE_SPIN_Y = 0.08;
// How much a pointer-pixel of drag becomes radians of rotation.
const DRAG_SENSITIVITY = 0.006;
// Higher = drag velocity decays back to idle faster after release.
const SPIN_DAMP_LAMBDA = 2.2;
// Higher = the key light snaps to the cursor faster.
const LIGHT_DAMP_LAMBDA = 5;

export function GlassForm({
  palette,
  flowTimeRef,
  intensityScale,
}: {
  palette: HeroPalette;
  // Shared mutable flow-time, advanced once per frame by the scene rig so
  // every material stays in lockstep.
  flowTimeRef: React.RefObject<number>;
  intensityScale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GLASS_VERTEX_SHADER,
        fragmentShader: GLASS_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uHighlight: { value: new THREE.Color(palette.highlight) },
          uCore: { value: new THREE.Color(palette.core) },
          uShadow: { value: new THREE.Color(palette.shadow) },
          uFlowTime: { value: 0 },
          uLightDir: { value: new THREE.Vector3(-0.35, 0.8, 0.6).normalize() },
          uOpacity: { value: 1 },
        },
      }),
    // Material is rebuilt only if the palette identity changes (app-level
    // token switch) — not per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette.highlight, palette.core, palette.shadow]
  );

  const geometry = useMemo(() => new THREE.TorusKnotGeometry(1.1, 0.36, 220, 48), []);

  // Drag state lives in refs -- high-frequency pointer input never touches
  // React state/re-renders.
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const spinVelocityRef = useRef({ x: 0, y: IDLE_SPIN_Y });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    isDraggingRef.current = true;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDraggingRef.current) return;
    const dx = event.clientX - lastPointerRef.current.x;
    const dy = event.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    // Instantaneous velocity from this frame's drag delta -- what the mesh
    // keeps spinning at once you let go.
    spinVelocityRef.current = { x: dy * DRAG_SENSITIVITY * 30, y: dx * DRAG_SENSITIVITY * 30 };
    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += dx * DRAG_SENSITIVITY;
      mesh.rotation.x += dy * DRAG_SENSITIVITY;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useFrame((_, delta) => {
    material.uniforms.uFlowTime.value = flowTimeRef.current ?? 0;

    // Cursor-reactive key light: lerp uLightDir toward the pointer's
    // position, mapped onto a hemisphere in front of the form.
    const target = new THREE.Vector3(pointer.x * 0.8, pointer.y * 0.6 + 0.4, 0.6).normalize();
    const light = material.uniforms.uLightDir.value as THREE.Vector3;
    light.x = THREE.MathUtils.damp(light.x, target.x, LIGHT_DAMP_LAMBDA, delta);
    light.y = THREE.MathUtils.damp(light.y, target.y, LIGHT_DAMP_LAMBDA, delta);
    light.z = THREE.MathUtils.damp(light.z, target.z, LIGHT_DAMP_LAMBDA, delta);
    light.normalize();

    const mesh = meshRef.current;
    if (!mesh) return;

    if (isDraggingRef.current) return; // rotation already applied in handlePointerMove

    // Released (or never grabbed): decay drag velocity back toward the calm
    // idle spin, applying whatever velocity remains each frame.
    spinVelocityRef.current.x = THREE.MathUtils.damp(
      spinVelocityRef.current.x,
      0,
      SPIN_DAMP_LAMBDA,
      delta
    );
    spinVelocityRef.current.y = THREE.MathUtils.damp(
      spinVelocityRef.current.y,
      IDLE_SPIN_Y * intensityScale,
      SPIN_DAMP_LAMBDA,
      delta
    );
    mesh.rotation.y += spinVelocityRef.current.y * delta;
    mesh.rotation.x += spinVelocityRef.current.x * delta;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
    />
  );
}
