import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ContactParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const form = formRef.current;
    const left = leftRef.current;
    const decor = decorRef.current;
    if (!section || !inner || !form || !left || !decor) return;

    const ctx = gsap.context(() => {
      // Left column content fades/slides in
      gsap.fromTo(
        left.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // Form fields slide in from right
      const fields = form.querySelectorAll(".form-field");
      gsap.fromTo(
        fields,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            end: "top 10%",
            scrub: 1,
          },
        }
      );

      // Decorative circle parallax — moves slower
      gsap.fromTo(
        decor,
        { y: 200, rotate: -45, scale: 0.8 },
        {
          y: -100,
          rotate: 45,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      id="contact"
    >
      {/* Inner wrapper — this is what slides up over the previous section */}
      <div
        ref={innerRef}
        className="relative bg-background overflow-hidden"
      >
        {/* Decorative elements */}
        <div
          ref={decorRef}
          className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.76 0.11 75 / 0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 top-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.76 0.11 75 / 0.3), transparent)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.76 0.11 75) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.76 0.11 75) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-section-padding">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
            {/* Left — Info */}
            <div ref={leftRef} className="md:col-span-5 pt-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[1px] bg-primary" />
                <span className="font-label-caps text-label-caps text-primary tracking-[0.4em] uppercase">
                  Get in Touch
                </span>
              </div>

              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 leading-tight">
                Begin Your{" "}
                <span className="text-primary italic">Journey</span>
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-12 max-w-md">
                Whether you seek a bespoke commission, wish to visit our Geneva
                atelier, or simply desire to learn more about our collections —
                our concierge is at your service.
              </p>

              {/* Contact details */}
              <div className="space-y-8 mb-12">
                <div className="group">
                  <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-2">
                    Atelier
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">
                    12 Rue du Rhône, 1204 Geneva
                  </p>
                </div>
                <div className="group">
                  <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-2">
                    Private Appointments
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">
                    +41 22 310 1884
                  </p>
                </div>
                <div className="group">
                  <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-2">
                    Concierge
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">
                    concierge@horologue.ch
                  </p>
                </div>
              </div>

              {/* Decorative divider with watch icon */}
              <div className="flex items-center gap-4 opacity-30">
                <div className="w-8 h-[1px] bg-primary" />
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 6v6l4 2" />
                  <path d="M12 3v1" />
                  <path d="M12 20v1" />
                </svg>
                <div className="flex-1 h-[1px] bg-primary" />
              </div>
            </div>

            {/* Right — Form */}
            <div className="md:col-span-6 md:col-start-7">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="relative"
              >
                {/* Background card */}
                <div className="absolute -inset-8 border border-primary/10 -z-10" />
                <div className="absolute -inset-8 bg-surface-container/30 backdrop-blur-sm -z-10" />

                <div className="space-y-8">
                  {/* Name */}
                  <div className="form-field">
                    <label
                      htmlFor="contact-name"
                      className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-3"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-primary/20 pb-3 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label
                      htmlFor="contact-email"
                      className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-3"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-transparent border-b border-primary/20 pb-3 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Interest */}
                  <div className="form-field">
                    <label
                      htmlFor="contact-interest"
                      className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-3"
                    >
                      Area of Interest
                    </label>
                    <select
                      id="contact-interest"
                      name="interest"
                      value={formState.interest}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-primary/20 pb-3 font-body-lg text-body-lg text-on-surface focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c5a059' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0 center",
                      }}
                    >
                      <option value="" className="bg-background">
                        Select your interest
                      </option>
                      <option value="collection" className="bg-background">
                        Explore a Collection
                      </option>
                      <option value="bespoke" className="bg-background">
                        Bespoke Commission
                      </option>
                      <option value="visit" className="bg-background">
                        Atelier Visit
                      </option>
                      <option value="service" className="bg-background">
                        Service & Restoration
                      </option>
                      <option value="press" className="bg-background">
                        Press & Media
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="form-field">
                    <label
                      htmlFor="contact-message"
                      className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-on-surface-variant block mb-3"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us how we may assist you…"
                      className="w-full bg-transparent border-b border-primary/20 pb-3 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="form-field pt-4">
                    <button
                      type="submit"
                      className="group relative overflow-hidden w-full border border-primary/40 px-10 py-5 font-label-caps text-label-caps uppercase tracking-[0.3em] transition-all duration-700 hover:border-primary"
                    >
                      <span className="relative z-10 transition-colors duration-500 group-hover:text-on-primary">
                        {submitted
                          ? "✓  Message Received"
                          : "Send Inquiry"}
                      </span>
                      <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                    </button>
                  </div>

                  {/* Privacy note */}
                  <p className="form-field font-label-caps text-[9px] tracking-[0.2em] uppercase text-on-surface-variant/50 text-center leading-relaxed">
                    Your inquiry is handled with the utmost discretion.
                    <br />
                    We respond within 24 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.76 0.11 75 / 0.2), transparent)",
          }}
        />
      </div>
    </section>
  );
}
