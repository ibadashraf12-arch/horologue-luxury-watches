import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ConfiguratorApp } from "@/components/configurator/ConfiguratorApp";

export const Route = createFileRoute("/configurator")({
  head: () => ({
    meta: [
      { title: "Forma — 3D Sneaker Configurator" },
      { name: "description", content: "Design your own sneaker in real time with premium materials, colors and a luxury showroom presentation." },
      { property: "og:title", content: "Forma — 3D Sneaker Configurator" },
      { property: "og:description", content: "Real-time 3D sneaker customization with PBR materials, HDRI lighting and instant pricing." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: ConfiguratorRoute,
});

/**
 * The 3D experience requires browser-only APIs (WebGL, Canvas), so it is
 * mounted client-side only after hydration to avoid SSR/WebGL conflicts.
 */
function ConfiguratorRoute() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-dvh w-full bg-[#08070a]" />;
  }

  return <ConfiguratorApp />;
}
