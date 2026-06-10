import type { PartCategory } from "./types";

export interface CameraFraming {
  /** Unit-ish direction from the model center to the camera. */
  direction: [number, number, number];
  /** Multiplier applied to the model's bounding radius for distance. */
  distance: number;
  /** Offset (as a fraction of the bounding radius) added to the look-at target. */
  targetOffset?: [number, number, number];
}

/**
 * Category-aware camera framings, expressed relative to the loaded model's
 * bounding sphere so they adapt automatically to any replacement GLB.
 */
export const CAMERA_VIEWS: Record<"default" | PartCategory, CameraFraming> = {
  default: { direction: [1.1, 0.55, 1.5], distance: 2.4 },
  upper: { direction: [0.9, 0.4, 1.4], distance: 1.9, targetOffset: [0, 0.15, 0] },
  sole: { direction: [0.7, -0.85, 1.1], distance: 2.1, targetOffset: [0, -0.2, 0] },
  laces: { direction: [0.05, 1.05, 1.3], distance: 1.7, targetOffset: [0, 0.2, 0] },
  tongue: { direction: [0.1, 1.1, 1.25], distance: 1.6, targetOffset: [0, 0.25, 0] },
  branding: { direction: [1.25, 0.35, 0.95], distance: 1.8, targetOffset: [0, 0.05, 0] },
  accents: { direction: [-1.2, 0.45, 1.15], distance: 2, targetOffset: [0, 0, 0] },
};
