import { MATERIAL_ORDER, MATERIAL_PRESETS } from "@/lib/configurator/material-presets";
import type { MaterialId } from "@/lib/configurator/types";
import { cn } from "@/lib/utils";

interface MaterialPickerProps {
  value: MaterialId;
  onChange: (material: MaterialId) => void;
}

/** Grid of selectable material finishes with live price deltas. */
export function MaterialPicker({ value, onChange }: MaterialPickerProps) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/60">Material</p>
      <div className="grid grid-cols-2 gap-1.5">
        {MATERIAL_ORDER.map((id) => {
          const preset = MATERIAL_PRESETS[id];
          const active = id === value;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              title={preset.description}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-left transition-all duration-200",
                active
                  ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_rgba(197,160,89,0.25)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
              )}
            >
              <p className="text-xs font-medium text-on-surface">{preset.label}</p>
              <p className="text-[10px] text-on-surface-variant/70">
                {preset.priceModifier > 0 ? `+$${preset.priceModifier}` : "Included"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
