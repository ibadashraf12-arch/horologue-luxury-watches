import { forwardRef } from "react";

/** Top bar: brand mark + exit link, floating over the 3D scene. */
export const ConfiguratorHeader = forwardRef<HTMLElement>(function ConfiguratorHeader(_, ref) {
  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-8 md:py-6">
      <div className="pointer-events-auto flex items-baseline gap-3">
        <span className="font-display-lg text-lg uppercase tracking-[0.35em] text-on-surface">Forma</span>
        <span className="hidden text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/60 md:inline">
          Sneaker Configurator
        </span>
      </div>
      <a
        href="/"
        className="pointer-events-auto rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-on-surface-variant backdrop-blur-md transition-colors duration-200 hover:border-primary/40 hover:text-on-surface"
      >
        Exit
      </a>
    </header>
  );
});
