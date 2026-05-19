import { createFileRoute } from "@tanstack/react-router";
import { HeroScrollSequence } from "@/components/HeroScrollSequence";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horologue — Precision. Redefined." },
      { name: "description", content: "Horologue luxury timepieces — mastery in every micro-second since 1884." },
      { property: "og:title", content: "Horologue — Precision. Redefined." },
      { property: "og:description", content: "Luxury mechanical timepieces hand-finished by master artisans." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/40 border-b border-primary/10">
        <nav className="max-w-[1280px] mx-auto flex items-center justify-between px-margin-mobile md:px-margin-desktop py-5">
          <div className="font-display-lg text-xl tracking-[0.3em] uppercase text-on-surface">
            Horo<span className="text-primary italic">logue</span>
          </div>
          <ul className="hidden md:flex items-center gap-10 font-label-caps text-label-caps uppercase tracking-[0.25em] text-on-surface-variant">
            <li className="hover:text-primary transition-colors cursor-pointer">Collections</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Heritage</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Artisanship</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Maison</li>
          </ul>
          <button className="font-label-caps text-label-caps uppercase tracking-[0.25em] text-primary border border-primary/30 px-5 py-2 hover:bg-primary hover:text-on-primary transition-all">
            Boutique
          </button>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero — frame-by-frame scroll sequence */}
        <HeroScrollSequence />

        {/* Artisanship */}
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-section-padding">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] uppercase">SINCE 1884</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 leading-tight">
                The Soul of Mechanical <br />Excellence
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-md leading-relaxed">
                Every Horologue timepiece is a testament to the patient pursuit of perfection. Our artisans spend hundreds of hours hand-finishing each gear, ensuring a legacy that transcends generations.
              </p>
              <button className="group relative overflow-hidden border border-primary/30 px-10 py-4 font-label-caps text-label-caps uppercase tracking-[0.25em] transition-all duration-500 hover:border-primary">
                <span className="relative z-10">Our Artisanship</span>
                <div className="absolute inset-0 gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-gutter pt-12 md:pt-0">
              <div className="mt-24 border border-primary/20 p-2 group overflow-hidden">
                <div className="aspect-[3/4] bg-surface-container relative overflow-hidden">
                  <img
                    alt="Master watchmaker assembling movement"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD36XMAQKGeel0C7WHk2_BKvgDU1HzUHKi7Ec9KC8XltvOU6aLRXYdjas-roBknDQR1-g6j5gUxxwHsdz0yNCxRiJOCmzb0pVTR7w231TgcZi6U1WquAl9QDsT0xAC1rVMN9WhRGwVtvvhRX0H1YZkspkhspqqQk4hOLVXzmRWS9s9dyKb2Q7_XpfDEj6p5OTeFe1twrec9w8Vjuh0-6QP6m-DEaY8SCqfAi1q8iZ07SSCVFTWABc6j3pLVKlxXsjLIZnjcriuRrA"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                </div>
              </div>
              <div className="border border-primary/20 p-2 group overflow-hidden">
                <div className="aspect-[3/4] bg-surface-container relative overflow-hidden">
                  <img
                    alt="Macro of watch components on velvet"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyWlA8bOL-KqAGMjPzCdFcUhcMT5SIG7El5mHEGKkPLQ_Lnji6WHGNGuFFVz58T91Ph8Vl9mXCv78a1UeRS-RlWn6BMxOysMUlAenFtYuEWD9yku-tgCIA7oJ8J-NUqZPW3TuoVvCN43UT5HiQ4T0Dm8G6_vtRr-u8hCi516g5rJnlxspRiajxdk3aOuoyDdOu4x0XNI9nbXKeTYWlY4oGh0B6enPXY_0dsC_YRduj3dbRUo7K8E1uMqcASgiimJ98GOjc5oYcAA"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/10 mt-12">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display-lg text-lg tracking-[0.3em] uppercase">
            Horo<span className="text-primary italic">logue</span>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 tracking-[0.3em] uppercase">
            © 1884 — Maison Horologue. Geneva.
          </p>
        </div>
      </footer>
    </div>
  );
}
