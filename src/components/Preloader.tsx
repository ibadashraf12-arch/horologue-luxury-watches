import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function Preloader({ onEnter, onStart }: { onEnter: () => void; onStart?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enterReady, setEnterReady] = useState(false);

  useEffect(() => {
    const obj = { v: 0 };
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(obj, {
      v: 100,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate() {
        const n = Math.floor(obj.v);
        if (counterRef.current)
          counterRef.current.textContent = String(n).padStart(3, "0");
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${obj.v / 100})`;
      },
      onComplete() {
        setEnterReady(true);
      },
    });

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!enterReady || !btnRef.current) return;
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [enterReady]);

  const handleEnter = () => {
    onStart?.();
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.75;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    gsap.to(overlayRef.current, {
      yPercent: -105,
      duration: 1.1,
      ease: "power4.inOut",
      delay: 0.05,
      onComplete: onEnter,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: "oklch(0.09 0.004 60)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          backgroundImage: `linear-gradient(oklch(0.76 0.11 75) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.76 0.11 75) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner brackets */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-12 h-12 ${cls}`}
          style={{ borderColor: "oklch(0.76 0.11 75 / 0.25)" }}
        />
      ))}

      {/* Horizontal rule top */}
      <div
        className="absolute top-0 left-0 w-full h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.76 0.11 75 / 0.4), transparent)" }}
      />

      {/* Brand name with glitch */}
      <div className="mb-3">
        <div
          className="preloader-brand font-display-lg tracking-[0.55em] uppercase"
          data-text="HOROLOGUE"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "oklch(0.96 0.01 80)" }}
        >
          HORO<span style={{ color: "oklch(0.76 0.11 75)", fontStyle: "italic" }}>LOGUE</span>
        </div>
      </div>

      {/* Tagline */}
      <p
        className="font-label-caps uppercase tracking-[0.55em] mb-20"
        style={{ fontSize: "0.6rem", color: "oklch(0.78 0.015 75 / 0.4)", letterSpacing: "0.5em" }}
      >
        Precision · Redefined · Since 1884
      </p>

      {/* Loading counter */}
      <span
        ref={counterRef}
        className="font-display-lg tabular-nums leading-none mb-5"
        style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "oklch(0.76 0.11 75 / 0.12)" }}
      >
        000
      </span>

      {/* Progress bar */}
      <div
        className="w-56 h-[1px] mb-20 relative"
        style={{ backgroundColor: "oklch(0.76 0.11 75 / 0.15)" }}
      >
        <div
          ref={barRef}
          className="absolute inset-0 origin-left"
          style={{ backgroundColor: "oklch(0.76 0.11 75)", transform: "scaleX(0)" }}
        />
      </div>

      {/* Enter button */}
      <button
        ref={btnRef}
        onClick={handleEnter}
        className="preloader-enter font-label-caps uppercase border transition-all duration-500"
        style={{
          opacity: 0,
          fontSize: "0.68rem",
          letterSpacing: "0.45em",
          color: "oklch(0.76 0.11 75)",
          borderColor: "oklch(0.76 0.11 75 / 0.45)",
          padding: "1.1rem 3.5rem",
          pointerEvents: enterReady ? "auto" : "none",
          cursor: enterReady ? "pointer" : "default",
        }}
      >
        Enter
      </button>

      {/* Bottom rule */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.76 0.11 75 / 0.4), transparent)" }}
      />

      <audio ref={audioRef} src="/sounds/glitch.mp3" preload="auto" />
    </div>
  );
}
