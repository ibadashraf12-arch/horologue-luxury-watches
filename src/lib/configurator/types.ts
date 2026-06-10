/** Material families available for any customizable shoe part. */
export type MaterialId =
  | "leather"
  | "suede"
  | "mesh"
  | "knit"
  | "rubber"
  | "glossy-plastic"
  | "matte";

/** Logical grouping used to organize the customization panel. */
export type PartCategory =
  | "upper"
  | "sole"
  | "laces"
  | "tongue"
  | "branding"
  | "accents";

/** Per-part user configuration (color + material). */
export interface PartConfig {
  color: string;
  material: MaterialId;
}

/** Full configuration map, keyed by part id. */
export type PartsConfig = Record<string, PartConfig>;

/** Static metadata describing a customizable part, derived from the model. */
export interface PartDefinition {
  id: string;
  label: string;
  category: PartCategory;
  default: PartConfig;
}

/** A single PBR tuning preset for a material family. */
export interface MaterialPreset {
  id: MaterialId;
  label: string;
  description: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  sheenRoughness: number;
  envMapIntensity: number;
  /** Added to the base price when applied to a part. */
  priceModifier: number;
}

/** A named color usable in quick-pick palettes. */
export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ColorPalette {
  id: string;
  label: string;
  swatches: ColorSwatch[];
}

/** Camera framing used for category-aware transitions. */
export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}
