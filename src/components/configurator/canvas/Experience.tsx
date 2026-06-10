import { Suspense, useCallback, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { SceneEffects } from "./SceneEffects";
import { ShoeModel } from "./ShoeModel";
import { Showroom } from "./Showroom";

/**
 * Root R3F canvas: PBR-tuned renderer, showroom environment, the
 * configurable shoe model, camera rig and post-processing pipeline.
 */
export function Experience() {
  const [center, setCenter] = useState(() => new THREE.Vector3(0, 0.3, 0));
  const [radius, setRadius] = useState(1);

  const handleFramed = useCallback((nextCenter: THREE.Vector3, nextRadius: number) => {
    setCenter(nextCenter);
    setRadius(nextRadius);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 32, near: 0.1, far: 100, position: [3, 1.6, 4] }}
    >
      <color attach="background" args={["#08070a"]} />
      <fog attach="fog" args={["#08070a", 8, 18]} />

      <Suspense fallback={null}>
        <Showroom />
        <ShoeModel onFramed={handleFramed} />
        <SceneEffects />
      </Suspense>

      <CameraRig center={center} radius={radius} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
