import { readFileSync } from "node:fs";

const path = process.argv[2];
const buf = readFileSync(path);

const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
const length = buf.readUInt32LE(8);

if (magic !== 0x46546c67) {
  throw new Error("Not a glb file");
}

let offset = 12;
let json = null;
while (offset < length) {
  const chunkLength = buf.readUInt32LE(offset);
  const chunkType = buf.readUInt32LE(offset + 4);
  const chunkData = buf.subarray(offset + 8, offset + 8 + chunkLength);
  if (chunkType === 0x4e4f534a) {
    json = JSON.parse(chunkData.toString("utf-8"));
  }
  offset += 8 + chunkLength;
}

console.log("=== MESHES ===");
json.meshes?.forEach((m, i) => {
  console.log(i, m.name, "primitives:", m.primitives.length, "materials:", m.primitives.map(p => p.material));
});

console.log("\n=== MATERIALS ===");
json.materials?.forEach((mat, i) => {
  console.log(i, mat.name, JSON.stringify({
    baseColor: mat.pbrMetallicRoughness?.baseColorFactor,
    metallic: mat.pbrMetallicRoughness?.metallicFactor,
    roughness: mat.pbrMetallicRoughness?.roughnessFactor,
    hasBaseColorTex: !!mat.pbrMetallicRoughness?.baseColorTexture,
    hasNormalTex: !!mat.normalTexture,
  }));
});

console.log("\n=== NODES (with mesh) ===");
json.nodes?.forEach((n, i) => {
  if (n.mesh !== undefined) {
    console.log(i, n.name, "-> mesh", n.mesh);
  }
});

console.log("\n=== SCENE GRAPH (root nodes) ===");
const scene = json.scenes[json.scene ?? 0];
function printNode(idx, depth) {
  const n = json.nodes[idx];
  console.log(" ".repeat(depth * 2) + `[${idx}] ${n.name ?? "(unnamed)"}` + (n.mesh !== undefined ? ` (mesh ${n.mesh})` : ""));
  n.children?.forEach(c => printNode(c, depth + 1));
}
scene.nodes.forEach(idx => printNode(idx, 0));

console.log("\n=== STATS ===");
console.log("meshes:", json.meshes?.length, "materials:", json.materials?.length, "images:", json.images?.length, "textures:", json.textures?.length);
console.log("file size:", (buf.length / 1024 / 1024).toFixed(2), "MB");
