import { create } from "zustand";
import type { MaterialId, PartCategory, PartDefinition, PartsConfig } from "@/lib/configurator/types";

const HISTORY_LIMIT = 50;

interface ConfiguratorStore {
  /** Metadata for every customizable part, derived from the loaded model. */
  partDefs: PartDefinition[];
  /** Factory default configuration, derived from the loaded model. */
  defaults: PartsConfig;
  /** Live, user-editable configuration. */
  parts: PartsConfig;
  /** True once the model has been parsed and parts registered. */
  isReady: boolean;

  selectedPartId: string | null;
  hoveredPartId: string | null;
  activeCategory: PartCategory | null;
  autoRotate: boolean;

  past: PartsConfig[];
  future: PartsConfig[];

  registerParts: (defs: PartDefinition[], initial?: PartsConfig | null) => void;
  setPartColor: (id: string, color: string) => void;
  setPartMaterial: (id: string, material: MaterialId) => void;
  selectPart: (id: string | null) => void;
  hoverPart: (id: string | null) => void;
  setActiveCategory: (category: PartCategory | null) => void;
  setAutoRotate: (value: boolean) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  loadConfig: (parts: PartsConfig) => void;
}

function commit(past: PartsConfig[], current: PartsConfig): PartsConfig[] {
  const next = [...past, current];
  return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
}

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  partDefs: [],
  defaults: {},
  parts: {},
  isReady: false,

  selectedPartId: null,
  hoveredPartId: null,
  activeCategory: "upper",
  autoRotate: true,

  past: [],
  future: [],

  registerParts: (defs, initial) => {
    if (get().isReady) return;

    const defaults: PartsConfig = {};
    for (const def of defs) defaults[def.id] = { ...def.default };

    let parts = defaults;
    if (initial) {
      const merged: PartsConfig = { ...defaults };
      for (const [id, config] of Object.entries(initial)) {
        if (merged[id] && config?.color && config?.material) {
          merged[id] = { color: config.color, material: config.material };
        }
      }
      parts = merged;
    }

    set({ partDefs: defs, defaults, parts, isReady: true });
  },

  setPartColor: (id, color) =>
    set((state) => {
      if (!state.parts[id]) return state;
      return {
        parts: { ...state.parts, [id]: { ...state.parts[id], color } },
        past: commit(state.past, state.parts),
        future: [],
      };
    }),

  setPartMaterial: (id, material) =>
    set((state) => {
      if (!state.parts[id]) return state;
      return {
        parts: { ...state.parts, [id]: { ...state.parts[id], material } },
        past: commit(state.past, state.parts),
        future: [],
      };
    }),

  selectPart: (id) => set((state) => (state.selectedPartId === id ? state : { selectedPartId: id })),
  hoverPart: (id) => set((state) => (state.hoveredPartId === id ? state : { hoveredPartId: id })),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setAutoRotate: (value) => set({ autoRotate: value }),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        parts: previous,
        past: state.past.slice(0, -1),
        future: [state.parts, ...state.future],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        parts: next,
        past: commit(state.past, state.parts),
        future: rest,
      };
    }),

  reset: () =>
    set((state) => ({
      parts: { ...state.defaults },
      past: commit(state.past, state.parts),
      future: [],
      selectedPartId: null,
      hoveredPartId: null,
    })),

  loadConfig: (parts) =>
    set((state) => ({
      parts: { ...state.defaults, ...parts },
      past: commit(state.past, state.parts),
      future: [],
    })),
}));
