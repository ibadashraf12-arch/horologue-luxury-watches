import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Toaster } from "sonner";
import { useConfiguratorStore } from "@/store/configurator-store";
import { Experience } from "./canvas/Experience";
import { LoadingScreen } from "./LoadingScreen";
import { ConfiguratorHeader } from "./ui/Header";
import { ConfiguratorPanel } from "./ui/ConfiguratorPanel";
import { ViewControls } from "./ui/ViewControls";

/** Top-level layout: 3D experience, floating UI chrome, and reveal animation. */
export function ConfiguratorApp() {
  const isReady = useConfiguratorStore((s) => s.isReady);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.6, defaults: { ease: "power3.out", duration: 1 } })
        .from(headerRef.current, { y: -32, opacity: 0 })
        .from(panelRef.current, { y: 48, opacity: 0 }, "-=0.7")
        .from(hintRef.current, { opacity: 0, duration: 0.6 }, "-=0.4");
    });

    return () => ctx.revert();
  }, [isReady]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#08070a] text-on-surface">
      <Experience />
      <LoadingScreen />

      <ConfiguratorHeader ref={headerRef} />
      <ConfiguratorPanel ref={panelRef} />
      <ViewControls />

      <div
        ref={hintRef}
        className="pointer-events-none fixed inset-x-0 bottom-3 z-20 text-center text-[10px] uppercase tracking-[0.35em] text-on-surface-variant/40 md:bottom-8"
      >
        Drag to rotate &middot; Click the shoe or a part to customize
      </div>

      <Toaster theme="dark" position="bottom-center" richColors />
    </div>
  );
}
