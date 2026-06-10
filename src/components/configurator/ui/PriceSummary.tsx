import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useConfiguratorStore } from "@/store/configurator-store";
import { calculatePrice } from "@/lib/configurator/pricing";
import { cn } from "@/lib/utils";

/** Live, animated price readout with an expandable cost breakdown. */
export function PriceSummary() {
  const parts = useConfiguratorStore((s) => s.parts);
  const partDefs = useConfiguratorStore((s) => s.partDefs);
  const [expanded, setExpanded] = useState(false);
  const [displayTotal, setDisplayTotal] = useState(0);
  const previousTotal = useRef(0);

  const breakdown = calculatePrice(parts, partDefs);

  useEffect(() => {
    const tween = { value: previousTotal.current };
    const animation = gsap.to(tween, {
      value: breakdown.total,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setDisplayTotal(Math.round(tween.value)),
    });
    previousTotal.current = breakdown.total;
    return () => {
      animation.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown.total]);

  return (
    <div className="border-t border-white/10 pt-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/70">Estimated Price</span>
        <span className="flex items-center gap-1.5">
          <span className="font-display-lg text-2xl text-on-surface">${displayTotal.toLocaleString()}</span>
          <ChevronDown className={cn("h-4 w-4 text-on-surface-variant transition-transform duration-300", expanded && "rotate-180")} />
        </span>
      </button>

      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
            <div className="flex justify-between">
              <span>Base configuration</span>
              <span>${breakdown.base.toLocaleString()}</span>
            </div>
            {breakdown.lineItems.map((item) => (
              <div key={item.label} className="flex justify-between text-primary/90">
                <span>{item.label}</span>
                <span>+${item.amount.toLocaleString()}</span>
              </div>
            ))}
            {breakdown.lineItems.length === 0 && (
              <p className="text-on-surface-variant/50">No premium upgrades selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
