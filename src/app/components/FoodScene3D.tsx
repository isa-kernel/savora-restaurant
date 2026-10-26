"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

type FoodScene3DProps = {
  progress: React.RefObject<number>;
};

function PlateAndFood({
  progress,
}: FoodScene3DProps) {
  const plateRef = useRef<THREE.Group>(null);
  const foodRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);

  const pastaCurves = useMemo(() => {
    return [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.8, 0.2, 0.1),
        new THREE.Vector3(-0.45, 0.25, 0.35),
        new THREE.Vector3(0.0, 0.3, 0.15),
        new THREE.Vector3(0.45, 0.25, -0.15),
        new THREE.Vector3(0.75, 0.2, 0.1),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.6, 0.35, -0.2),
        new THREE.Vector3(-0.25, 0.4, -0.5),
        new THREE.Vector3(0.15, 0.35, -0.3),
        new THREE.Vector3(0.45, 0.3, 0.1),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4, 0.4, 0.5),
        new THREE.Vector3(-0.1, 0.45, 0.65),
        new THREE.Vector3(0.3, 0.4, 0.45),
        new THREE.Vector3(0.55, 0.35, 0.2),
      ]),
    ];
  }, []);

  useFrame((state) => {
    const p = THREE.MathUtils.clamp(
      progress.current,
      0,
      1
    );

    if (plateRef.current) {
      // Rotate and move the actual 3D plate.
      plateRef.current.rotation.z = THREE.MathUtils.lerp(
        0,
        -0.35,
        Math.sin(p * Math.PI)
      );

      plateRef.current.rotation.y = THREE.MathUtils.lerp(
        0,
        0.65,
        p
      );

      plateRef.current.position.x =
        -0.7 * Math.sin(p * Math.PI);

      plateRef.current.scale.setScalar(
        1 + 0.12 * Math.sin(p * Math.PI)
      );
    }

    if (foodRef.current) {
      // Ingredients lift away from the plate,
      // then return as the scroll progresses.
      const lift = Math.sin(p * Math.PI);

      foodRef.current.position.y = 0.15 + lift * 0.85;
      foodRef.current.rotation.y = p * Math.PI * 0.7;
    }

    if (steamRef.current) {
      // Steam becomes visible as the dish is revealed.
      steamRef.current.visible = p > 0.35 && p < 0.95;

      steamRef.current.position.y =
        0.75 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;

      steamRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.7) * 0.15;

      steamRef.current.scale.setScalar(
        0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      );
    }
  });

  return (
    <>
      {/* The plate */}
      <group ref={plateRef}>
        {/* Main ceramic body */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[2.05, 1.9, 0.18, 96]} />

          <meshStandardMaterial
            color="#e9ded0"
            roughness={0.24}
            metalness={0.05}
          />
        </mesh>

        {/* Raised rim */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.12, 0]}
        >
          <torusGeometry args={[1.75, 0.065, 16, 100]} />

          <meshStandardMaterial
            color="#c4a77e"
            metalness={0.45}
            roughness={0.3}
          />
        </mesh>

        {/* Food arrangement */}
        <group ref={foodRef} position={[0, 0.15, 0]}>
          {/* Pasta */}
          {pastaCurves.map((curve, index) => (
            <mesh
              key={index}
              castShadow
              receiveShadow
              position={[0, 0.2, 0]}
            >
              <tubeGeometry args={[curve, 48, 0.075, 10, false]} />

              <meshStandardMaterial
                color={index === 1 ? "#d99a45" : "#f2c36e"}
                roughness={0.32}
              />
            </mesh>
          ))}

          {/* Cherry tomatoes */}
          <mesh
            castShadow
            position={[-0.65, 0.28, 0.3]}
          >
            <sphereGeometry args={[0.23, 32, 32]} />

            <meshStandardMaterial
              color="#c92727"
              roughness={0.24}
            />
          </mesh>

          <mesh
            castShadow
            position={[0.65, 0.25, -0.25]}
          >
            <sphereGeometry args={[0.19, 32, 32]} />

            <meshStandardMaterial
              color="#e13c2e"
              roughness={0.25}
            />
          </mesh>

          {/* Basil leaves */}
          <mesh
            castShadow
            position={[-0.2, 0.38, 0.55]}
            rotation={[0.4, 0.2, -0.5]}
            scale={[0.25, 0.07, 0.45]}
          >
            <sphereGeometry args={[1, 32, 24]} />

            <meshStandardMaterial
              color="#477b37"
              roughness={0.55}
            />
          </mesh>

          <mesh
            castShadow
            position={[0.4, 0.35, 0.45]}
            rotation={[0.2, -0.5, 0.8]}
            scale={[0.22, 0.06, 0.38]}
          >
            <sphereGeometry args={[1, 32, 24]} />

            <meshStandardMaterial
              color="#679347"
              roughness={0.55}
            />
          </mesh>
        </group>
      </group>

      {/* Stylized steam ribbons */}
      <group ref={steamRef} position={[0, 0.75, 0]}>
        {[0, 1, 2].map((index) => {
          const points = Array.from({ length: 18 }, (_, i) => {
            const t = i / 17;

            return new THREE.Vector3(
              Math.sin(t * 5 + index * 1.5) * 0.12,
              t * 1.4,
              Math.cos(t * 4 + index) * 0.08
            );
          });

          const curve = new THREE.CatmullRomCurve3(points);

          return (
            <mesh key={index} position={[(index - 1) * 0.2, 0, 0]}>
              <tubeGeometry args={[curve, 32, 0.018, 8, false]} />

              <meshBasicMaterial
                color="#f3d7b5"
                transparent
                opacity={0.55}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function FoodScene3D({
  progress,
}: FoodScene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 4.5, 7],
        fov: 38,
      }}
      shadows
      gl={{
        antialias: true,
        alpha: true,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight
        position={[-4, 2, -2]}
        intensity={25}
        color="#e99b57"
      />

      <Environment preset="studio" />

      <PlateAndFood progress={progress} />

      <ContactShadows
        position={[0, -0.3, 0]}
        opacity={0.4}
        scale={7}
        blur={2}
        far={4}
      />
    </Canvas>
  );
}