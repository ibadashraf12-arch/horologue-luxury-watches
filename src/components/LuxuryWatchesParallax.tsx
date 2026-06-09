import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Watch {
  name: string;
  collection: string;
  price: string;
  description: string;
  image: string;
  accent: string;
}

const WATCHES: Watch[] = [
  {
    name: "Chronographe Éternel",
    collection: "Horlogerie Suisse",
    price: "CHF 285,000",
    description:
      "A masterpiece of perpetual calendar engineering with moon-phase indicator, housed in a 41mm platinum case with sapphire exhibition back.",
    image: "/watches/watch-bronze-skeleton.webp.webp",
    accent: "oklch(0.76 0.11 75)",
  },
  {
    name: "Tourbillon Céleste",
    collection: "Horlogerie Suisse",
    price: "CHF 420,000",
    description:
      "Flying tourbillon with celestial chart dial, hand-engraved 18k rose-gold bridges, and 72-hour power reserve. Limited to 25 pieces worldwide.",
    image: "/watches/watch-luminor-navigator.webp.webp",
    accent: "oklch(0.72 0.08 50)",
  },
  {
    name: "Répétition Minutes",
    collection: "Horlogerie Suisse",
    price: "CHF 560,000",
    description:
      "Chiming complication strikes hours, quarters, and minutes on demand. Cathedral gongs deliver crystalline acoustics from a 39mm white-gold case.",
    image: "/watches/watch-silver-skeleton.webp.webp",
    accent: "oklch(0.68 0.06 200)",
  },
  {
    name: "Quantième Perpétuel",
    collection: "Horlogerie Suisse",
    price: "CHF 195,000",
    description:
      "Ultra-thin perpetual calendar — merely 3.95mm movement height — with retrograde date and grand-feu enamel dial in polished steel.",
    image: "/watches/watch-titanium-sport.webp.png",
    accent: "oklch(0.74 0.10 130)",
  },
];

export function LuxuryWatchesParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!section || !track || !heading) return;

    const ctx = gsap.context(() => {
      // Heading reveal animation
      gsap.fromTo(
        heading,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      // Calculate the horizontal scroll distance
      const totalScrollWidth = track.scrollWidth - window.innerWidth;

      // Horizontal scroll — the main pinned animation
      const horizontalTween = gsap.to(track, {
        x: -totalScrollWidth,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalScrollWidth * 1.2}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        animation: horizontalTween,
      });

      // Parallax depth for each card's image and content
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      cards.forEach((card) => {
        const img = card.querySelector(".watch-img") as HTMLElement;
        const content = card.querySelector(".watch-content") as HTMLElement;
        const number = card.querySelector(".watch-number") as HTMLElement;

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.2, y: 40 },
            {
              scale: 1,
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "left right",
                end: "right left",
                scrub: 1,
                containerAnimation: horizontalTween,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { x: 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "left 80%",
                end: "left 40%",
                scrub: 1,
                containerAnimation: horizontalTween,
              },
            }
          );
        }

        if (number) {
          gsap.fromTo(
            number,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 0.06,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "left 90%",
                end: "left 30%",
                scrub: 1,
                containerAnimation: horizontalTween,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
      id="luxury-watches"
    >
      {/* Section Heading — fixed during scroll */}
      <div
        ref={headingRef}
        className="absolute top-0 left-0 w-full z-20 pt-10 pb-6 px-margin-mobile md:px-margin-desktop pointer-events-none"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-[1px] bg-primary" />
            <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] uppercase">
              The Collection
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface leading-tight">
            Exceptional <span className="text-primary italic">Timepieces</span>
          </h2>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-stretch pt-32 pb-12"
        style={{ width: `${WATCHES.length * 85 + 15}vw` }}
      >
        {/* Intro spacer */}
        <div className="flex-shrink-0 w-[10vw]" />

        {WATCHES.map((watch, i) => (
          <div
            key={watch.name}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="flex-shrink-0 relative flex items-center"
            style={{ width: "80vw", paddingRight: "5vw" }}
          >
            {/* Big background number */}
            <span
              className="watch-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display-lg text-[28rem] leading-none select-none pointer-events-none opacity-0"
              style={{ color: watch.accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Card container */}
            <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center h-[75vh] min-h-[500px]">
              {/* Image side */}
              <div className="md:col-span-6 h-full relative overflow-hidden group bg-neutral-950">
                <div className="absolute inset-0 border border-primary/15 z-10 pointer-events-none" />
                <div className="watch-img absolute inset-0">
                  <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Uniform dark tint to normalise different photo backgrounds */}
                <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none" />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10" />
                {/* Collection badge */}
                <div className="absolute bottom-6 left-6 z-20">
                  <span
                    className="font-label-caps text-[10px] tracking-[0.4em] uppercase px-4 py-2 backdrop-blur-md border"
                    style={{
                      borderColor: `color-mix(in oklch, ${watch.accent}, transparent 70%)`,
                      background: `color-mix(in oklch, ${watch.accent}, transparent 90%)`,
                      color: watch.accent,
                    }}
                  >
                    {watch.collection}
                  </span>
                </div>
              </div>

              {/* Content side */}
              <div className="watch-content md:col-span-5 md:col-start-8 flex flex-col justify-center px-4 md:px-0">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: watch.accent }}
                  />
                  <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant">
                    Piece {String(i + 1).padStart(2, "0")} /{" "}
                    {String(WATCHES.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-display-lg text-[2.5rem] md:text-[3.5rem] text-on-surface leading-[1.1] mb-6">
                  {watch.name}
                </h3>

                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8 max-w-md">
                  {watch.description}
                </p>

                <div className="flex items-end gap-8 mb-10">
                  <div>
                    <span className="font-label-caps text-[10px] tracking-[0.3em] uppercase text-on-surface-variant block mb-1">
                      Starting at
                    </span>
                    <span
                      className="font-display-lg text-2xl"
                      style={{ color: watch.accent }}
                    >
                      {watch.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    className="group relative overflow-hidden border px-8 py-4 font-label-caps text-label-caps uppercase tracking-[0.25em] transition-all duration-500"
                    style={{
                      borderColor: `color-mix(in oklch, ${watch.accent}, transparent 50%)`,
                      color: watch.accent,
                    }}
                  >
                    <span className="relative z-10">Discover</span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(120deg, transparent 20%, color-mix(in oklch, ${watch.accent}, transparent 80%) 50%, transparent 80%)`,
                      }}
                    />
                  </button>
                  <button className="font-label-caps text-label-caps uppercase tracking-[0.25em] text-on-surface-variant hover:text-on-surface transition-colors">
                    Specifications →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[10vw]" />
      </div>

      {/* Decorative line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
