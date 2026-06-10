import type { MaterialId, PartCategory } from "./types";

export interface PartMeta {
  label: string;
  category: PartCategory;
  material: MaterialId;
}

export interface CategoryMeta {
  id: PartCategory;
  label: string;
  description: string;
}

/** Display order & copy for each customization category. */
export const CATEGORY_ORDER: CategoryMeta[] = [
  { id: "upper", label: "Body & Panels", description: "Primary upper construction" },
  { id: "sole", label: "Sole Unit", description: "Insole, midsole & outsole" },
  { id: "laces", label: "Laces & Eyelets", description: "Lacing system & hardware" },
  { id: "tongue", label: "Tongue", description: "Tongue, padding & badge" },
  { id: "branding", label: "Branding", description: "Logo & brand marks" },
  { id: "accents", label: "Comfort & Accents", description: "Straps, pulls & trims" },
];

/**
 * Curated metadata for the bundled "Bad Bunny x Adidas" coffee shoe model.
 *
 * Keys are matched against either the mesh's parent group name (for groups
 * that contain a single mesh — the cleanest, encoding-safe identifier) or
 * the mesh name itself (for groups containing multiple meshes).
 *
 * To use a different GLB, this table is optional: any mesh not listed here
 * falls back to {@link inferPartMeta}, which derives a readable label,
 * category and material guess from the mesh/material name automatically.
 */
export const PART_OVERRIDES: Record<string, PartMeta> = {
  // --- Body & Panels ---
  Cuero: { label: "Main Body", category: "upper", material: "leather" },
  DetalleMedios2: { label: "Side Panels", category: "upper", material: "leather" },
  DetalleFrente: { label: "Toe Box", category: "upper", material: "leather" },
  DetalleTrasero2: { label: "Heel Counter", category: "upper", material: "leather" },
  Zapato_Frente_0: { label: "Toe Cap Overlay", category: "upper", material: "leather" },

  // --- Sole Unit ---
  Plantilla: { label: "Sole", category: "sole", material: "leather" },
  Suela_Suela_0: { label: "Midsole", category: "sole", material: "rubber" },
  Suela_Suela2_0: { label: "Outsole", category: "sole", material: "rubber" },

  // --- Laces & Eyelets ---
  Cordones: { label: "Laces", category: "laces", material: "knit" },
  Orificios: { label: "Eyelets", category: "laces", material: "matte" },
  Cilindro: { label: "Lace Tips", category: "laces", material: "matte" },
  bordesCordones_CueroCordones_0: { label: "Lace Panel", category: "laces", material: "leather" },
  bordesCordones_BordesCordones_0: { label: "Stitching", category: "laces", material: "leather" },
  DetalleCordon: { label: "Lace Guard", category: "laces", material: "leather" },

  // --- Tongue ---
  Lengua_Lengua_0: { label: "Tongue", category: "tongue", material: "mesh" },
  Lengua_Almohadilla2_0: { label: "Tongue Padding", category: "tongue", material: "mesh" },
  Lengua_Logo_0: { label: "Tongue Badge", category: "tongue", material: "rubber" },

  // --- Branding ---
  Adidas: { label: "Logo", category: "branding", material: "glossy-plastic" },

  // --- Comfort & Accents ---
  almohadillas_Almohadilla_0: { label: "Collar Padding", category: "accents", material: "mesh" },
  almohadillas_Almohadilla2_0: { label: "Ankle Padding", category: "accents", material: "mesh" },
  Sujetador: { label: "Pull Tab", category: "accents", material: "rubber" },
  MiniCorrea: { label: "Strap Loop", category: "accents", material: "leather" },
  Correa_correa_0: { label: "Ankle Strap", category: "accents", material: "leather" },
  Correa_correadetalle_0: { label: "Strap Buckle", category: "accents", material: "matte" },
  CordonTrasero: { label: "Heel Pull Cord", category: "accents", material: "knit" },
};

/** Group names that uniquely identify a single mesh — preferred lookup keys. */
export const UNIQUE_GROUP_KEYS = new Set([
  "Cuero",
  "DetalleTrasero2",
  "DetalleMedios2",
  "DetalleFrente",
  "Plantilla",
  "Cordones",
  "Cilindro",
  "Adidas",
  "Sujetador",
  "Orificios",
  "MiniCorrea",
  "DetalleCordon",
  "CordonTrasero",
]);

const CATEGORY_KEYWORDS: Array<{ test: RegExp; category: PartCategory; material: MaterialId }> = [
  { test: /sole|suela|outsole|midsole|insole|plant/i, category: "sole", material: "rubber" },
  { test: /lace|cordon|eyelet|orificio|aglet|cilindro/i, category: "laces", material: "knit" },
  { test: /tongue|lengua/i, category: "tongue", material: "mesh" },
  { test: /logo|brand|adidas|emblem/i, category: "branding", material: "glossy-plastic" },
  { test: /strap|correa|pull|tab|sujetador|padding|almohadilla|cushion/i, category: "accents", material: "leather" },
];

/** Convert an arbitrary mesh/material name into a human-friendly label. */
export function prettifyName(raw: string): string {
  const cleaned = raw
    .replace(/_\d+$/, "")
    .replace(/[_.]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();

  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Best-effort metadata for a mesh that has no curated entry. Used so any
 * replacement GLB still produces a sensible, organized customization panel.
 */
export function inferPartMeta(meshName: string, materialName: string): PartMeta {
  const haystack = `${meshName} ${materialName}`;
  for (const { test, category, material } of CATEGORY_KEYWORDS) {
    if (test.test(haystack)) {
      return { label: prettifyName(materialName || meshName), category, material };
    }
  }
  return { label: prettifyName(materialName || meshName), category: "upper", material: "leather" };
}

/** Resolve a mesh's lookup key against {@link PART_OVERRIDES}. */
export function resolvePartKey(meshName: string, parentName: string | undefined): string {
  if (parentName && UNIQUE_GROUP_KEYS.has(parentName)) return parentName;
  return meshName;
}
