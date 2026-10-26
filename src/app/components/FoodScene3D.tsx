"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

type FoodScene3DProps = {
  progress: React.RefObject<number>;
};

type PlateAndFoodProps = {
  progress: React.RefObject<number>;
  reducedMotion: boolean;
};

function PlateAndFood({
  progress,
  reducedMotion,
}: PlateAndFoodProps) {
  const plateRef = useRef<THREE.Group>(null);
  const foodRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);

  const pastaCurves = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.65, 0.24, -0.15),
      new THREE.Vector3(-0.35, 0.38, 0.1),
      new THREE.Vector3(0.05, 0.28, 0.25),
      new THREE.Vector3(0.4, 0.4, 0.05),
      new THREE.Vector3(0.55, 0.25, -0.25),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 0.3, 0.3),
      new THREE.Vector3(-0.15, 0.42, 0.0),
      new THREE.Vector3(0.2, 0.28, -0.2),
      new THREE.Vector3(0.45, 0.36, 0.2),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 0.32, -0.35),
      new THREE.Vector3(0.0, 0.42, -0.05),
      new THREE.Vector3(-0.25, 0.3, 0.2),
      new THREE.Vector3(0.15, 0.38, 0.35),
    ]),
  ];

  useFrame((state) => {
    const plate = plateRef.current;
    const food = foodRef.current;
    const steam = steamRef.current;

    if (!plate || !food || !steam) return;

    const rawProgress = progress.current ?? 0;
    const p = THREE.MathUtils.clamp(rawProgress, 0, 1);

    if (reducedMotion) {
      plate.rotation.set(0, 0, 0);
      plate.position.set(0, 0, 0);
      plate.scale.setScalar(1);

      food.position.set(0, 0.15, 0);
      food.rotation.set(0, 0, 0);

      steam.visible = false;
      return;
    }

    const movement = Math.sin(p * Math.PI);

    plate.rotation.z = THREE.MathUtils.lerp(
      0,
      -0.22,
      movement
    );

    plate.rotation.y = p * 0.55;
    plate.position.x = -0.55 * movement;

    const scale = 1 + 0.1 * movement;
    plate.scale.setScalar(scale);

    food.position.y = 0.15 + movement * 0.65;
    food.rotation.y = p * Math.PI * 0.65;

    steam.visible = p > 0.35 && p < 0.95;

    if (steam.visible) {
      steam.position.y =
        0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.025;

      steam.rotation.y =
        Math.sin(state.clock.elapsedTime) * 0.08;
    }
  });

  return (
    <>
      <group ref={plateRef}>
        {/* Plate */}
        <mesh
          position={[0, 0, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[1.65, 1.55, 0.13, 96]} />
          <meshStandardMaterial
            color="#f1e9d8"
            roughness={0.23}
            metalness={0.03}
          />
        </mesh>

        {/* Plate rim */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.07, 0]}
        >
          <torusGeometry args={[1.48, 0.035, 12, 96]} />
          <meshStandardMaterial
            color="#c5a56a"
            metalness={0.55}
            roughness={0.3}
          />
        </mesh>

        {/* Food */}
        <group ref={foodRef} position={[0, 0.15, 0]}>
          {pastaCurves.map((curve, index) => (
            <mesh
              key={index}
              castShadow
              geometry={
                new THREE.TubeGeometry(curve, 64, 0.055, 10, false)
              }
            >
              <meshStandardMaterial
                color={index === 1 ? "#e9b64e" : "#f3d17c"}
                roughness={0.4}
              />
            </mesh>
          ))}

          {/* Tomato pieces */}
          {[
            [-0.55, 0.28, 0.15],
            [0.42, 0.3, -0.12],
            [0.05, 0.34, 0.38],
            [-0.15, 0.3, -0.4],
          ].map((position, index) => (
            <mesh
              key={`tomato - ${index} `}
              position={position as [number, number, number]}
              castShadow
            >
              <sphereGeometry args={[0.13, 20, 20]} />
              <meshStandardMaterial
                color="#c8442e"
                roughness={0.35}
              />
            </mesh>
          ))}

          {/* Basil leaves */}
          {[
            [-0.3, 0.4, -0.15],
            [0.25, 0.4, 0.12],
            [0.1, 0.42, -0.25],
          ].map((position, index) => (
            <mesh
              key={`basil - ${index} `}
              position={position as [number, number, number]}
              rotation={[
                0.3 + index * 0.2,
                index * 0.8,
                0.4 + index * 0.2,
              ]}
              castShadow
            >
              <sphereGeometry args={[0.18, 16, 12]} />
              <meshStandardMaterial
                color="#387447"
                roughness={0.65}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Steam */}
      <group ref={steamRef} visible={false}>
        {[0, 1, 2].map((index) => {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(
              -0.2 + index * 0.2,
              0.3,
              0
            ),
            new THREE.Vector3(
              -0.15 + index * 0.2,
              0.55,
              0
            ),
            new THREE.Vector3(
              -0.25 + index * 0.2,
              0.8,
              0
            ),
            new THREE.Vector3(
              -0.1 + index * 0.2,
              1.05,
              0
            ),
          ]);

          return (
            <mesh key={`steam - ${index} `}>
              <tubeGeometry
                args={[curve, 24, 0.018, 8, false]}
              />
              <meshBasicMaterial
                color="#fff5df"
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const mobileQuery = window.matchMedia(
      "(max-width: 600px)"
    );

    const updateMotion = () => {
      setReducedMotion(motionQuery.matches);
    };

    const updateMobile = () => {
      setIsMobile(mobileQuery.matches);
    };

    updateMotion();
    updateMobile();

    motionQuery.addEventListener("change", updateMotion);
    mobileQuery.addEventListener("change", updateMobile);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      mobileQuery.removeEventListener("change", updateMobile);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 4.5, 7], fov: 38 }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "low-power",
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.5}
      />

      <pointLight
        position={[-4, 3, -3]}
        intensity={1.2}
        color="#d8a75a"
      />

      <Environment preset="studio" />

      <PlateAndFood
        progress={progress}
        reducedMotion={reducedMotion}
      />

      <ContactShadows
        position={[0, -0.12, 0]}
        opacity={0.35}
        scale={5}
        blur={2.5}
        far={2}
      />
    </Canvas>
  );
}