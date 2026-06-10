import { ChevronDown } from "lucide-react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { MATERIAL_PRESETS } from "@/lib/configurator/material-presets";
import type { PartDefinition } from "@/lib/configurator/types";
import { cn } from "@/lib/utils";
import { ColorPicker } from "./ColorPicker";
import { MaterialPicker } from "./MaterialPicker";

interface PartRowProps {
  def: PartDefinition;
}

/** A single customizable part: collapsible row exposing color & material editors. */
export function PartRow({ def }: PartRowProps) {
  const config = useConfiguratorStore((s) => s.parts[def.id]);
  const isSelected = useConfiguratorStore((s) => s.selectedPartId === def.id);
  const selectPart = useConfiguratorStore((s) => s.selectPart);
  const hoverPart = useConfiguratorStore((s) => s.hoverPart);
  const setPartColor = useConfiguratorStore((s) => s.setPartColor);
  const setPartMaterial = useConfiguratorStore((s) => s.setPartMaterial);

  if (!config) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border transition-colors duration-200",
        isSelected ? "border-primary/40 bg-primary/[0.06]" : "border-white/5 bg-white/[0.02] hover:border-white/15",
      )}
      onMouseEnter={() => hoverPart(def.id)}
      onMouseLeave={() => hoverPart(null)}
    >
      <button
        type="button"
        onClick={() => selectPart(isSelected ? null : def.id)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className="h-7 w-7 shrink-0 rounded-full border border-white/20 shadow-inner"
            style={{ backgroundColor: config.color }}
          />
          <div>
            <p className="text-sm font-medium text-on-surface">{def.label}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/70">
              {MATERIAL_PRESETS[config.material].label}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-on-surface-variant transition-transform duration-300", isSelected && "rotate-180 text-primary")}
        />
      </button>

      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isSelected ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-4 px-3 pb-4 pt-1">
            <ColorPicker color={config.color} onChange={(hex) => setPartColor(def.id, hex)} />
            <MaterialPicker value={config.material} onChange={(material) => setPartMaterial(def.id, material)} />
          </div>
        </div>
      </div>
    </div>
  );
}
