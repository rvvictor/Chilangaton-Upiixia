import { useState } from "react";

import type { FeatureProps } from "../../App";
import { api } from "../../lib/api";
import { Boton, Chip } from "../../lib/ui";
import { LISTA_EJEMPLO, RUTA_EJEMPLO, SEDE } from "./ejemplo";
import { MapaRuta } from "./MapaRuta";
import { Esqueleto, km, Resumen, Timeline } from "./Resultado";
import type { Parada, Punto, Ruta } from "./tipos";

export const route = "usuario";
export const label = "Vecina";
export const order = 2;

const EJEMPLOS = ["Jitomate", "Tortillas", "Pan dulce", "Huevo", "Pilas", "Tenis para niño"];

type Estado = "vacio" | "cargando" | "listo" | "error";

function textoWhatsApp(ruta: Ruta): string {
  const lineas = ruta.paradas.map((p) => `${p.orden}. ${p.negocio.nombre}: ${p.articulos.join(", ")}`);
  return `Mi ruta de compras de barrio (${km(ruta.distancia_m)} a pie, 0 cadenas):\n${lineas.join("\n")}\nHecha con colonIA`;
}

export default function Usuario(_props: FeatureProps) {
  const [lista, setLista] = useState(LISTA_EJEMPLO);
  const [origen, setOrigen] = useState<Punto>(SEDE);
  const [usaUbicacion, setUsaUbicacion] = useState(false);
  const [estado, setEstado] = useState<Estado>("vacio");
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [esEjemplo, setEsEjemplo] = useState(false);
  const [compras, setCompras] = useState<Set<string>>(new Set());

  async function armar() {
    if (!lista.trim()) return;
    setEstado("cargando");
    setCompras(new Set());
    try {
      const r = await api<Ruta>("/ruta", { method: "POST", body: JSON.stringify({ origen, texto_lista: lista }) });
      setRuta(r);
      setEsEjemplo(false);
      setEstado("listo");
    } catch {
      // Sin API: mostrar la ruta de ejemplo, marcada como tal, para que la demo no se caiga.
      setRuta(RUTA_EJEMPLO);
      setEsEjemplo(true);
      setEstado("error");
    }
  }

  function usarUbicacion() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigen({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUsaUbicacion(true);
      },
      () => setUsaUbicacion(false),
      { timeout: 6000 },
    );
  }

  async function compreAqui(p: Parada) {
    setCompras((prev) => new Set(prev).add(p.negocio.id));
    try {
      await api("/eventos", {
        method: "POST",
        body: JSON.stringify({ tipo: "compre_aqui", negocio_id: p.negocio.id, h3: p.negocio.h3 }),
      });
    } catch {
      // El registro es best effort; el botón ya confirmó al usuario.
    }
  }

  const enLista = (art: string) => lista.toLowerCase().includes(art.toLowerCase());

  function alternarEjemplo(art: string) {
    setLista((prev) => {
      const items = prev.split(",").map((s) => s.trim()).filter(Boolean);
      const sin = items.filter((s) => !s.toLowerCase().includes(art.toLowerCase()));
      return (sin.length < items.length ? sin : [...items, art.toLowerCase()]).join(", ");
    });
  }

  return (
    <div className="grid h-full grid-cols-1 content-start gap-4 overflow-y-auto bg-(--pb-fondo) p-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:grid-rows-1 lg:content-stretch lg:overflow-hidden">
      <aside className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:min-h-0 lg:flex-col lg:gap-4 lg:overflow-y-auto lg:pr-1">
        <form
          className="rounded-(--pb-radio-tarjeta) border border-(--pb-borde) bg-(--pb-superficie) p-4 shadow-(--pb-sombra) order-1 lg:order-none"
          onSubmit={(e) => {
            e.preventDefault();
            void armar();
          }}
        >
          <label htmlFor="lista" className="block text-xl font-bold text-(--pb-texto)">
            ¿Qué necesitas comprar?
          </label>
          <p className="text-base text-(--pb-texto-2)">Escribe tu lista del mandado, separada por comas.</p>
          <textarea
            id="lista"
            value={lista}
            onChange={(e) => setLista(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void armar();
              }
            }}
            rows={3}
            placeholder="2 kilos de jitomate, tortillas, tenis para niño…"
            className="mt-2 w-full resize-none rounded-(--pb-radio-control) border-2 border-(--pb-borde-fuerte) bg-(--pb-superficie) px-4 py-3 text-lg leading-snug text-(--pb-texto) focus:border-(--pb-acento) focus:outline-2 focus:outline-offset-2 focus:outline-(--pb-foco)"
          />
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Ejemplos para tu lista">
            {EJEMPLOS.map((art) => (
              <Chip key={art} activo={enLista(art)} onClick={() => alternarEjemplo(art)}>
                {art}
              </Chip>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <Boton type="submit" disabled={estado === "cargando" || !lista.trim()} anchoCompleto>
              {estado === "cargando" ? "Armando…" : "Armar mi ruta"}
            </Boton>
            <Boton variante="secundario" onClick={usarUbicacion}>
              Usar mi ubicación
            </Boton>
          </div>
          <p className="mt-2 text-sm text-(--pb-texto-2)">
            {usaUbicacion
              ? "Salimos desde tu ubicación."
              : "Salimos desde la Utopía Elena Poniatowska, San Lucas, Coyoacán."}
          </p>
        </form>

        <section
          aria-label="Tu ruta"
          className="order-3 flex flex-col gap-4 lg:order-none"
        >
          {estado === "vacio" && (
            <p className="rounded-(--pb-radio-tarjeta) bg-(--pb-superficie-2) p-4 text-base text-(--pb-texto-2)">
              Te armamos una ruta a pie que pasa solo por negocios de tu barrio: tianguis, mercados y tienditas. Nunca
              por cadenas.
            </p>
          )}

          {estado === "cargando" && <Esqueleto />}

          {ruta && estado !== "cargando" && (
            <>
              {esEjemplo && (
                <p role="alert" className="rounded-(--pb-radio-control) bg-(--pb-acento-suave) px-3 py-2 text-base text-(--pb-texto)">
                  No pudimos conectar con el servidor. Te mostramos una ruta de ejemplo (datos de ejemplo).
                </p>
              )}
              <Resumen ruta={ruta} />
              {ruta.aviso && <p className="text-sm text-(--pb-texto-2)">{ruta.aviso}</p>}

              {ruta.paradas.length > 0 ? (
                <Timeline paradas={ruta.paradas} compras={compras} onCompre={compreAqui} />
              ) : (
                <p className="text-lg text-(--pb-texto)">No encontramos paradas para tu lista. Prueba con otros artículos.</p>
              )}

              {ruta.sin_resultado.length > 0 && (
                <div className="rounded-(--pb-radio-tarjeta) border border-dashed border-(--pb-borde-fuerte) bg-(--pb-superficie) p-4">
                  <p className="text-base font-semibold text-(--pb-texto)">No encontramos comercio de barrio para:</p>
                  <p className="mt-1 text-lg text-(--pb-texto)">{ruta.sin_resultado.join(", ")}</p>
                </div>
              )}

              <a
                href={`https://wa.me/?text=${encodeURIComponent(textoWhatsApp(ruta))}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-(--pb-alto-control) shrink-0 items-center justify-center rounded-(--pb-radio-control) bg-(--pb-real-texto) px-5 text-lg font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--pb-foco)"
              >
                Compartir por WhatsApp
              </a>
            </>
          )}
        </section>
      </aside>

      <section
        className="relative order-2 h-72 sm:h-96 lg:order-none lg:col-start-1 lg:row-start-1 lg:h-auto"
        aria-label="Mapa de tu ruta"
      >
        <MapaRuta ruta={ruta} origen={origen} />
      </section>

    </div>
  );
}
