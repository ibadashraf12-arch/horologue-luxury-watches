import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

/**
 * Full-screen preloader shown while the GLB, HDRI and textures stream in.
 * Tracks `@react-three/drei`'s global loading manager and fades out with a
 * GSAP transition once everything is ready.
 */
export function LoadingScreen() {
  const { progress, active } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [readyAt, setReadyAt] = useState<number | null>(null);

  useEffect(() => {
    if (!active && progress >= 100 && readyAt === null) {
      setReadyAt(Date.now());
    }
  }, [active, progress, readyAt]);

  useEffect(() => {
    if (readyAt === null) return;
    const timeout = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => setHidden(true),
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [readyAt]);

  if (hidden) return null;

  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#08070a]"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"
            style={{ animationDuration: "1.4s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-body-lg text-xs tracking-widest text-primary">
            {displayProgress}%
          </div>
        </div>
        <p className="font-label-caps text-label-caps uppercase tracking-[0.4em] text-on-surface-variant">
          Preparing Configurator
        </p>
      </div>

      <div className="h-px w-48 overflow-hidden bg-white/10">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
