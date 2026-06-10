import { forwardRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryTabs } from "./CategoryTabs";
import { PartList } from "./PartList";
import { PriceSummary } from "./PriceSummary";
import { Toolbar } from "./Toolbar";

/**
 * Floating glassmorphism configuration panel. Docks to the right edge on
 * desktop and collapses into a bottom sheet on mobile/tablet.
 */
export const ConfiguratorPanel = forwardRef<HTMLElement>(function ConfiguratorPanel(_, ref) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <aside
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-30 flex max-h-[85vh] flex-col rounded-t-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-2xl md:inset-x-auto md:right-6 md:top-24 md:bottom-6 md:max-h-none md:w-[380px] md:rounded-3xl"
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-4 md:pt-5">
        <div>
          <h2 className="font-display-lg text-lg leading-none text-on-surface">Customize</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60">Live 3D Preview</p>
        </div>
        <Toolbar />
      </div>

      <div className="px-5 pb-3 pt-2">
        <CategoryTabs />
      </div>

      <div
        className={cn(
          "scrollbar-none overflow-y-auto px-5 transition-[max-height] duration-500 ease-out md:max-h-none md:flex-1 md:py-1",
          mobileExpanded ? "max-h-[42vh]" : "max-h-0",
        )}
      >
        <PartList />
      </div>

      <div className="px-5 pb-5 pt-3">
        <PriceSummary />
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/70 md:hidden"
        >
          {mobileExpanded ? "Show Less" : "Customize Parts"}
          <ChevronUp className={cn("h-3.5 w-3.5 transition-transform duration-300", mobileExpanded && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
});
