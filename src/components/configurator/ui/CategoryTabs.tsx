import { useMemo } from "react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { CATEGORY_ORDER } from "@/lib/configurator/part-registry";
import { cn } from "@/lib/utils";

/** Horizontal category selector — drives both the part list filter and camera framing. */
export function CategoryTabs() {
  const partDefs = useConfiguratorStore((s) => s.partDefs);
  const activeCategory = useConfiguratorStore((s) => s.activeCategory);
  const setActiveCategory = useConfiguratorStore((s) => s.setActiveCategory);
  const selectPart = useConfiguratorStore((s) => s.selectPart);

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => partDefs.some((def) => def.category === cat.id)),
    [partDefs],
  );

  return (
    <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
      {categories.map((cat) => {
        const active = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveCategory(cat.id);
              selectPart(null);
            }}
            className={cn(
              "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
              active ? "bg-primary text-on-primary shadow-[0_0_20px_-4px_rgba(197,160,89,0.6)]" : "bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-on-surface",
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
