import { useMemo } from "react";
import * as THREE from "three";
import { ContactShadows, Environment, MeshReflectorMaterial, RoundedBox } from "@react-three/drei";

/**
 * A simplified silhouette of a sneaker on a display shelf — used to dress
 * the background showroom without requiring extra model assets.
 */
function DisplaySneaker({ color = "#3a332b" }: { color?: string }) {
  return (
    <group>
      <RoundedBox args={[0.62, 0.16, 0.24]} radius={0.06} smoothness={4} position={[0, 0.1, 0]} castShadow>
        <meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.48, 0.14, 0.22]} radius={0.07} smoothness={4} position={[0.02, 0.21, 0]} rotation={[0, 0, 0.05]} castShadow>
        <meshPhysicalMaterial color="#cabba2" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.05, 0.26]} radius={0.025} smoothness={4} position={[0, 0.02, 0]} castShadow>
        <meshPhysicalMaterial color="#171311" roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

/** A floating display shelf carrying a couple of sneaker silhouettes. */
function ShowroomShelf({
  position,
  rotation = [0, 0, 0],
  shoeColors,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  shoeColors: [string, string];
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[1.6, 0.05, 0.5]} radius={0.02} smoothness={4} receiveShadow>
        <meshPhysicalMaterial color="#15110d" roughness={0.25} clearcoat={0.4} envMapIntensity={1.2} />
      </RoundedBox>
      <group position={[-0.35, 0.025, 0]}>
        <DisplaySneaker color={shoeColors[0]} />
      </group>
      <group position={[0.45, 0.025, 0]} rotation={[0, Math.PI * 0.65, 0]}>
        <DisplaySneaker color={shoeColors[1]} />
      </group>
    </group>
  );
}

/**
 * Premium sneaker-store environment: polished reflective floor, soft HDRI
 * ambient lighting, a warm three-point rig, and out-of-focus display shelves
 * to evoke a luxury retail atmosphere without distracting from the product.
 */
export function Showroom() {
  const floorColor = useMemo(() => new THREE.Color("#0c0a08"), []);

  return (
    <group>
      {/* HDRI ambient + reflections */}
      <Environment preset="city" environmentIntensity={0.6} />

      {/* Polished showroom floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <circleGeometry args={[12, 64]} />
        <MeshReflectorMaterial
          color={floorColor}
          blur={[256, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={35}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          metalness={0.6}
          mirror={0.4}
        />
      </mesh>

      {/* Soft contact shadow grounding the product (static — rendered once) */}
      <ContactShadows position={[0, 0.001, 0]} opacity={0.65} scale={6} blur={2.4} far={2} resolution={512} color="#000000" frames={1} />

      {/* Ambient fill */}
      <hemisphereLight args={["#fdf3e2", "#06050a", 0.35]} />

      {/* Key light */}
      <directionalLight
        position={[3.5, 5, 2.5]}
        intensity={2.4}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-radius={6}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
      </directionalLight>

      {/* Cool rim / accent light */}
      <spotLight position={[-4, 3, -3]} angle={0.5} penumbra={1} intensity={6} color="#9fc7ff" distance={14} />

      {/* Warm accent light */}
      <pointLight position={[2, 1.2, -2.5]} intensity={3} color="#e8b074" distance={10} />

      {/* Background showroom shelves, softly out of focus */}
      <group position={[0, 0.55, -3.2]}>
        <ShowroomShelf position={[-2.4, 0.6, -0.6]} rotation={[0, 0.35, 0]} shoeColors={["#9c4625", "#2c2c2c"]} />
        <ShowroomShelf position={[2.5, 0.1, -0.4]} rotation={[0, -0.4, 0]} shoeColors={["#1d4ed8", "#c9a06b"]} />
        <ShowroomShelf position={[0, -0.55, -1.6]} rotation={[0, 0, 0]} shoeColors={["#0f9d58", "#3b2415"]} />
      </group>

      {/* Subtle back wall to anchor reflections */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#0a0908" roughness={1} />
      </mesh>
    </group>
  );
}
