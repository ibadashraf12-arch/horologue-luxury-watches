import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useConfiguratorStore } from "@/store/configurator-store";
import { MATERIAL_PRESETS } from "@/lib/configurator/material-presets";
import { PART_OVERRIDES, inferPartMeta, resolvePartKey } from "@/lib/configurator/part-registry";
import { toPhysicalMaterial } from "@/lib/configurator/three-utils";
import { readConfigFromUrl } from "@/lib/configurator/share";
import type { PartDefinition } from "@/lib/configurator/types";

export const MODEL_URL = "/models/shoe.glb";
export const DRACO_PATH = "/draco/";

useGLTF.preload(MODEL_URL, DRACO_PATH);

interface ShoeModelProps {
  /** Reports the model's world-space center and bounding radius once loaded. */
  onFramed?: (center: THREE.Vector3, radius: number) => void;
}

/**
 * Loads the configurable GLB, auto-detects customizable parts from its mesh
 * hierarchy, and reactively applies color/material changes from the store.
 *
 * To swap in a different model, replace `/public/models/shoe.glb` — any mesh
 * not covered by `PART_OVERRIDES` is still picked up automatically via
 * `inferPartMeta`.
 */
export function ShoeModel({ onFramed }: ShoeModelProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

  const groupRef = useRef<THREE.Group>(null);
  const meshMap = useRef(new Map<string, THREE.Mesh>());

  const parts = useConfiguratorStore((s) => s.parts);
  const isReady = useConfiguratorStore((s) => s.isReady);
  const registerParts = useConfiguratorStore((s) => s.registerParts);
  const selectPart = useConfiguratorStore((s) => s.selectPart);
  const hoverPart = useConfiguratorStore((s) => s.hoverPart);
  const hoveredPartId = useConfiguratorStore((s) => s.hoveredPartId);
  const selectedPartId = useConfiguratorStore((s) => s.selectedPartId);

  // Clone so HMR / repeated mounts never mutate the cached GLTF scene.
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const discovered: { mesh: THREE.Mesh; key: string }[] = [];
    meshMap.current.clear();

    clonedScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const key = resolvePartKey(obj.name, obj.parent?.name);
      obj.material = toPhysicalMaterial(obj.material as THREE.Material);

      discovered.push({ mesh: obj, key });
      meshMap.current.set(key, obj);
    });

    if (!isReady) {
      const defs: PartDefinition[] = discovered.map(({ mesh, key }) => {
        const material = mesh.material as THREE.MeshPhysicalMaterial;
        const meta = PART_OVERRIDES[key] ?? inferPartMeta(mesh.name, material.name ?? "");
        return {
          id: key,
          label: meta.label,
          category: meta.category,
          default: { color: `#${material.color.getHexString()}`, material: meta.material },
        };
      });

      registerParts(defs, readConfigFromUrl());
    }

    // Center the model at the origin, sitting on the ground plane (y = 0),
    // and normalize its scale so any replacement GLB frames consistently.
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.6 / maxDim;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    }

    onFramed?.(new THREE.Vector3(0, (size.y * scale) / 2, 0), (maxDim * scale) / 2);
  }, [clonedScene, isReady, registerParts, onFramed]);

  // Apply live color/material configuration to each tracked mesh.
  useEffect(() => {
    for (const [id, config] of Object.entries(parts)) {
      const mesh = meshMap.current.get(id);
      if (!mesh) continue;

      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const preset = MATERIAL_PRESETS[config.material];

      material.color.set(config.color);
      material.sheenColor.set(config.color);
      material.roughness = preset.roughness;
      material.metalness = preset.metalness;
      material.clearcoat = preset.clearcoat;
      material.clearcoatRoughness = preset.clearcoatRoughness;
      material.sheen = preset.sheen;
      material.sheenRoughness = preset.sheenRoughness;
      material.envMapIntensity = preset.envMapIntensity;
    }
  }, [parts]);

  // Highlight the hovered/selected part with a warm rim glow.
  useEffect(() => {
    meshMap.current.forEach((mesh, id) => {
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      if (id === selectedPartId) {
        material.emissive.set("#c5a059");
        material.emissiveIntensity = 0.22;
      } else if (id === hoveredPartId) {
        material.emissive.set("#c5a059");
        material.emissiveIntensity = 0.1;
      } else {
        material.emissive.set("#000000");
        material.emissiveIntensity = 0;
      }
    });
  }, [hoveredPartId, selectedPartId]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const key = resolvePartKey(e.object.name, e.object.parent?.name);
    if (meshMap.current.has(key)) hoverPart(key);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoverPart(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const key = resolvePartKey(e.object.name, e.object.parent?.name);
    if (meshMap.current.has(key)) selectPart(key);
  };

  return (
    <group
      ref={groupRef}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
