import { useMemo } from "react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { PartRow } from "./PartRow";

/** Renders all customizable parts belonging to the active category. */
export function PartList() {
  const partDefs = useConfiguratorStore((s) => s.partDefs);
  const activeCategory = useConfiguratorStore((s) => s.activeCategory);

  const parts = useMemo(
    () => partDefs.filter((def) => def.category === activeCategory),
    [partDefs, activeCategory],
  );

  return (
    <div className="flex flex-col gap-2">
      {parts.map((def) => (
        <PartRow key={def.id} def={def} />
      ))}
    </div>
  );
}
