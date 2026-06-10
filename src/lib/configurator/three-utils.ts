import * as THREE from "three";

/**
 * Builds a fresh `MeshPhysicalMaterial` carrying over the texture maps and
 * base properties from a source material (typically the
 * `MeshStandardMaterial` produced by GLTFLoader), so clearcoat/sheen can be
 * tuned per material preset without losing the model's authored textures.
 */
export function toPhysicalMaterial(source: THREE.Material): THREE.MeshPhysicalMaterial {
  const std = source as THREE.MeshStandardMaterial;

  const physical = new THREE.MeshPhysicalMaterial({
    map: std.map ?? null,
    normalMap: std.normalMap ?? null,
    normalScale: std.normalScale?.clone(),
    roughnessMap: std.roughnessMap ?? null,
    metalnessMap: std.metalnessMap ?? null,
    aoMap: std.aoMap ?? null,
    aoMapIntensity: std.aoMapIntensity ?? 1,
    emissiveMap: std.emissiveMap ?? null,
    emissive: std.emissive?.clone() ?? new THREE.Color(0x000000),
    transparent: std.transparent,
    opacity: std.opacity,
    alphaTest: std.alphaTest,
    side: std.side,
  });

  physical.color.copy(std.color ?? new THREE.Color(0xffffff));
  physical.name = std.name;
  return physical;
}
