import { useEffect, useState } from "react";
import { COLOR_PALETTES } from "@/lib/configurator/color-presets";
import { cn } from "@/lib/utils";

const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

interface ColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
}

/** Custom color picker: native swatch + hex input + curated palette grid. */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(color);

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const commitHex = () => {
    if (HEX_PATTERN.test(hexInput)) {
      onChange(hexInput);
    } else {
      setHexInput(color);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-white/20 shadow-inner transition-transform hover:scale-105">
          <span className="absolute inset-0" style={{ backgroundColor: color }} />
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 cursor-pointer opacity-0"
            aria-label="Custom color"
          />
        </label>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={commitHex}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          spellCheck={false}
          className="h-9 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs uppercase tracking-[0.15em] text-on-surface outline-none transition-colors focus:border-primary/50 focus:bg-white/[0.06]"
        />
      </div>

      <div className="space-y-2.5">
        {COLOR_PALETTES.map((palette) => (
          <div key={palette.id}>
            <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/60">
              {palette.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {palette.swatches.map((swatch) => {
                const active = swatch.hex.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    aria-label={swatch.name}
                    onClick={() => onChange(swatch.hex)}
                    className={cn(
                      "h-6 w-6 rounded-full border transition-all duration-200 hover:scale-110",
                      active ? "border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-[#0c0a08]" : "border-white/15",
                    )}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
