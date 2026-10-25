import { motion } from "motion/react";
import { useEffect, useState, type ComponentType } from "react";

import { Logo } from "./lib/ui";

// Each view is web/src/features/<name>/index.tsx exporting `default`, `route`, `label` and `order`.
// Adding a view = creating its folder; App.tsx never becomes a conflict point.
// Hash routes, no login: #/inicio, #/sedeco, #/usuario, #/negocio/:id. The component receives the segments after its route.
export type FeatureProps = { params: string[] };

type FeatureModule = {
  default: ComponentType<FeatureProps>;
  route?: string;
  label?: string;
  order?: number;
};

const features = Object.entries(
  import.meta.glob<FeatureModule>("./features/*/index.tsx", { eager: true }),
)
  .map(([path, module]) => ({
    path,
    Component: module.default,
    route: module.route ?? path.split("/")[2],
    label: module.label ?? module.route ?? path.split("/")[2],
    order: module.order ?? 100,
  }))
  .sort((a, b) => a.order - b.order);

// The landing (PB-023) is the cover; until it exists the SEDECO map opens first.
const PORTADA = ["inicio", "sedeco"];

function readHash(): string[] {
  return window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

export default function App() {
  const [segments, setSegments] = useState(readHash);

  useEffect(() => {
    const onHash = () => setSegments(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const current =
    features.find((f) => f.route === segments[0]) ??
    PORTADA.map((r) => features.find((f) => f.route === r)).find(Boolean) ??
    features[0];
  const enPortada = current?.route === "inicio";

  return (
    <div className="flex h-[100dvh] flex-col font-sans">
      <header
        className={`sticky top-0 z-30 shrink-0 border-b backdrop-blur-md ${
          enPortada
            ? "border-white/10 bg-(--pb-hero-fondo)/80 text-(--pb-hero-texto)"
            : "border-(--pb-borde) bg-(--pb-superficie)/85 text-(--pb-texto)"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-2 sm:gap-6 sm:px-5">
          <a href="#/inicio" className="shrink-0 rounded-(--pb-radio-control) py-1" aria-label="colonIA, ir a la portada">
            <Logo className="text-[1.5rem]" oscuro={enPortada} />
          </a>
          <nav aria-label="Elegir vista" className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 [scrollbar-width:none]">
            <ul className="flex w-max gap-1">
              {features.map((f) => {
                const active = f === current;
                return (
                  <li key={f.path}>
                    <a
                      href={`#/${f.route}`}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex min-h-11 items-center rounded-full px-4 text-base font-medium whitespace-nowrap motion-safe:transition-colors ${
                        active
                          ? "text-white"
                          : enPortada
                            ? "text-(--pb-hero-texto-2) hover:text-(--pb-hero-texto)"
                            : "text-(--pb-texto-2) hover:bg-(--pb-superficie-2) hover:text-(--pb-texto)"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pb-nav-activa"
                          className="absolute inset-0 rounded-full bg-(--pb-acento) shadow-(--pb-sombra-marca)"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative">{f.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <span
            className={`hidden shrink-0 text-sm xl:block ${enPortada ? "text-(--pb-hero-texto-2)" : "text-(--pb-texto-2)"}`}
          >
            La red viva de la economía de barrio
          </span>
        </div>
      </header>
      <main className="min-h-0 flex-1">
        {current ? (
          <current.Component params={current.route === segments[0] ? segments.slice(1) : []} />
        ) : (
          <p className="p-8 text-lg text-(--pb-texto-2)">Cargando vistas…</p>
        )}
      </main>
    </div>
  );
}
