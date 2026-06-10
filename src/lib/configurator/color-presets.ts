import type { ColorPalette } from "./types";

/** Quick-pick color palettes shown beneath the custom color picker. */
export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "signature",
    label: "Signature",
    swatches: [
      { name: "Espresso", hex: "#3b2415" },
      { name: "Roast", hex: "#6f4426" },
      { name: "Latte", hex: "#c9a06b" },
      { name: "Cream", hex: "#efe3d2" },
      { name: "Onyx", hex: "#161616" },
      { name: "Bone", hex: "#f5f1ea" },
    ],
  },
  {
    id: "earth",
    label: "Earth Tones",
    swatches: [
      { name: "Clay", hex: "#a9613f" },
      { name: "Sand", hex: "#d8c3a0" },
      { name: "Olive", hex: "#5e5b3f" },
      { name: "Moss", hex: "#4a5240" },
      { name: "Rust", hex: "#9c4625" },
      { name: "Khaki", hex: "#a89a78" },
    ],
  },
  {
    id: "vibrant",
    label: "Vibrant",
    swatches: [
      { name: "Crimson", hex: "#c8102e" },
      { name: "Cobalt", hex: "#1d4ed8" },
      { name: "Emerald", hex: "#0f9d58" },
      { name: "Sunflower", hex: "#f4b400" },
      { name: "Violet", hex: "#7c3aed" },
      { name: "Tangerine", hex: "#f4622a" },
    ],
  },
  {
    id: "monochrome",
    label: "Monochrome",
    swatches: [
      { name: "Pure White", hex: "#fafafa" },
      { name: "Fog", hex: "#cfcfcf" },
      { name: "Slate", hex: "#6b7280" },
      { name: "Graphite", hex: "#3a3a3a" },
      { name: "Jet Black", hex: "#0a0a0a" },
      { name: "Ivory", hex: "#f3ede4" },
    ],
  },
  {
    id: "metallics",
    label: "Metallics",
    swatches: [
      { name: "Gold", hex: "#caa14b" },
      { name: "Silver", hex: "#c4c8cc" },
      { name: "Rose Gold", hex: "#d6a692" },
      { name: "Gunmetal", hex: "#4b4f54" },
      { name: "Bronze", hex: "#8c5a2b" },
      { name: "Copper", hex: "#b5663b" },
    ],
  },
];
