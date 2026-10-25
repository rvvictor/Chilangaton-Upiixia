// Presentational pieces of the Vecina view (PB-025): skeleton, hero summary and the numbered stop timeline.
import { Boton, Chip, Etiqueta } from "../../lib/ui";
import type { Parada, Ruta } from "./tipos";

const PAGO: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  dimo: "DiMo",
  codi: "CoDi",
  tarjeta: "Tarjeta",
};

export function km(metros: number): string {
  return metros >= 1000 ? `${(metros / 1000).toFixed(1)} km` : `${metros} m`;
}

/** Animated placeholders while the route is being built; static under prefers-reduced-motion. */
export function Esqueleto() {
  const barra = "rounded-full bg-(--pb-superficie-2) motion-safe:animate-pulse";
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="text-lg font-semibold text-(--pb-texto)">Buscando en los negocios de tu barrio…</span>
      <div aria-hidden="true" className="rounded-(--pb-radio-tarjeta) border border-(--pb-borde) bg-(--pb-superficie) p-5">
        <div className={`${barra} h-8 w-3/4`} />
        <div className={`${barra} mt-3 h-4 w-1/2`} />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} aria-hidden="true" className="flex gap-4">
          <div className="size-10 shrink-0 rounded-full bg-(--pb-superficie-2) motion-safe:animate-pulse" />
          <div className="flex-1 rounded-(--pb-radio-tarjeta) border border-(--pb-borde) bg-(--pb-superficie) p-4">
            <div className={`${barra} h-5 w-2/3`} />
            <div className={`${barra} mt-3 h-4 w-full`} />
            <div className={`${barra} mt-2 h-4 w-5/6`} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Hero summary: the three numbers a neighbour cares about, in one big line. */
export function Resumen({ ruta }: { ruta: Ruta }) {
  return (
    <section
      aria-label="Resumen de la ruta"
      className="rounded-(--pb-radio-tarjeta) bg-(--pb-acento) p-5 text-white shadow-(--pb-sombra)"
    >
      <p className="text-base font-medium opacity-90">Tu ruta a pie por el barrio</p>
      <p className="pb-cifra mt-1 text-[1.75rem] font-bold leading-tight lg:text-[1.5rem]">
        {ruta.resumen.cadenas} cadenas · {km(ruta.distancia_m)} · {ruta.minutos} min
      </p>
      <p className="mt-2 text-base opacity-95">
        {ruta.paradas.length} {ruta.paradas.length === 1 ? "parada" : "paradas"}
        {ruta.resumen.paradas_impulso > 0 &&
          ` · ${ruta.resumen.paradas_impulso} en zonas que necesitan clientes`}
      </p>
      {ruta.demo_data && (
        <div className="mt-3">
          <Etiqueta tipo="simulado" fuente="Negocios simulados con forma del DENUE" />
        </div>
      )}
    </section>
  );
}

type TimelineProps = {
  paradas: Parada[];
  compras: Set<string>;
  onCompre: (p: Parada) => void;
};

/** Stops as a numbered timeline; the vertical line stands for the walk between them. */
export function Timeline({ paradas, compras, onCompre }: TimelineProps) {
  return (
    <ol aria-label="Paradas de tu ruta" className="flex flex-col">
      {paradas.map((p, i) => {
        const alta = p.negocio.tipo === "alta";
        const comprado = compras.has(p.negocio.id);
        const ultima = i === paradas.length - 1;
        return (
          <li key={p.negocio.id} className="relative flex gap-4 pb-5 last:pb-0">
            {!ultima && (
              <span
                aria-hidden="true"
                className="absolute top-11 bottom-0 left-5 w-1 -translate-x-1/2 rounded-full bg-(--pb-acento-suave)"
              />
            )}
            <span
              aria-hidden="true"
              className={`pb-cifra relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ring-4 ring-(--pb-fondo) ${
                alta ? "bg-(--pb-real-texto)" : "bg-(--pb-acento)"
              }`}
            >
              {p.orden}
            </span>
            <article
              className={`min-w-0 flex-1 rounded-(--pb-radio-tarjeta) border bg-(--pb-superficie) p-4 shadow-(--pb-sombra) ${
                alta ? "border-2 border-(--pb-real-texto)" : "border-(--pb-borde)"
              }`}
            >
              <h3 className="text-lg font-semibold leading-snug text-(--pb-texto)">
                <span className="sr-only">Parada {p.orden}: </span>
                {p.negocio.nombre}
              </h3>
              <p className="text-base text-(--pb-texto-2)">{p.negocio.giro}</p>
              {alta && (
                <p className="mt-2 inline-flex rounded-full bg-(--pb-real-fondo) px-3 py-0.5 text-base font-semibold text-(--pb-real-texto)">
                  Negocio nuevo en el mapa
                </p>
              )}
              <p className="mt-2 text-lg text-(--pb-texto)">
                <span className="font-semibold">Compras aquí:</span> {p.articulos.join(", ")}
              </p>
              <div className="mt-2 rounded-(--pb-radio-control) bg-(--pb-superficie-2) p-3">
                <p className="text-base font-semibold text-(--pb-texto)">Por qué esta parada</p>
                <ul className="mt-1 flex flex-col gap-0.5 text-base text-(--pb-texto-2)">
                  {p.por_que.map((razon) => (
                    <li key={razon}>· {razon}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Formas de pago">
                {p.negocio.formas_pago.map((f) => (
                  <Chip key={f}>{PAGO[f.toLowerCase()] ?? f}</Chip>
                ))}
                {p.negocio.acepta_mercomuna && <Chip>Acepta Mercomuna</Chip>}
                <Etiqueta tipo={p.negocio.tipo_dato} />
              </div>
              <div className="mt-3">
                <Boton
                  variante={comprado ? "fantasma" : "secundario"}
                  onClick={() => onCompre(p)}
                  disabled={comprado}
                  anchoCompleto
                >
                  {comprado ? "¡Gracias por comprar en tu barrio!" : "Compré aquí"}
                </Boton>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
