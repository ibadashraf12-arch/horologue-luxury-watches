import { Disc3 } from "lucide-react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { cn } from "@/lib/utils";

/** Floating auto-rotate toggle, bottom-left of the viewport. */
export function ViewControls() {
  const autoRotate = useConfiguratorStore((s) => s.autoRotate);
  const setAutoRotate = useConfiguratorStore((s) => s.setAutoRotate);

  return (
    <div className="pointer-events-auto fixed bottom-6 left-5 z-30 md:left-8">
      <button
        type="button"
        onClick={() => setAutoRotate(!autoRotate)}
        title={autoRotate ? "Pause rotation" : "Resume rotation"}
        className={cn(
          "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200",
          autoRotate
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-white/15 bg-white/[0.03] text-on-surface-variant hover:border-white/30 hover:text-on-surface",
        )}
      >
        <Disc3 className={cn("h-4 w-4", autoRotate && "animate-spin")} style={autoRotate ? { animationDuration: "3s" } : undefined} />
      </button>
    </div>
  );
}
