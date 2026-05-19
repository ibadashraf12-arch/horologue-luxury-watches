import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const frameUrl = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;

export function HeroScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    let loaded = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = container.clientWidth + "px";
      canvas.style.height = container.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const render = () => {
      const img = images[state.frame];
      if (!img || !img.complete) return;
      const cw = canvas.width / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, cw, ch);
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw, dh, dx, dy;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
      } else {
        dh = ch;
        dw = ch * ir;
      }
      dx = (cw - dw) / 2;
      dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loaded++;
        if (i === 0) render();
      };
      images.push(img);
    }

    resize();
    window.addEventListener("resize", resize);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const frame = Math.min(
          FRAME_COUNT - 1,
          Math.floor(self.progress * (FRAME_COUNT - 1))
        );
        if (frame !== state.frame) {
          state.frame = frame;
          render();
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(20,16,12,0.55)_70%,rgba(20,16,12,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between py-24 px-margin-mobile md:px-margin-desktop">
        <div className="text-center mt-12">
          <p className="font-label-caps text-label-caps text-primary opacity-80 tracking-[0.5em] uppercase mb-6">
            Maison Horologue
          </p>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase tracking-[0.25em] text-on-surface leading-none">
            PRECISION. <span className="text-primary italic">REDEFINED.</span>
          </h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 tracking-[0.5em] uppercase mt-6">
            Mastery in every micro-second
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 opacity-60">
          <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase">
            Scroll to reveal
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  );
}
