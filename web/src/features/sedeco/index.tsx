import { useEffect, useMemo, useState } from "react";
import type { FeatureProps } from "../../App";
import {
  cargarAltas,
  cargarAlcaldias,
  cargarHex,
  cargarResumen,
  cargarTianguis,
  calcularCobertura,
  DIAS,
  diaHoy,
  estaAbierto,
  type Alcaldia,
  type Alta,
  type CapaHex,
  type ColeccionHex,
  type Origen,
  type Resumen,
  type Tianguis,
} from "./datos";
import { MapaSedeco } from "./MapaSedeco";
import { Panel, TarjetaHex } from "./PanelSedeco";
import { VIDRIO } from "./estilo";

const CAPAS: { id: CapaHex; texto: string }[] = [
  { id: "actividad", texto: "Actividad" },
  { id: "oferta", texto: "Oferta barrial" },
  { id: "poblacion", texto: "Población" },
  { id: "impulso", texto: "Impulso" },
];
const MAX_ALTAS = 100;

export default function Sedeco(_props: FeatureProps) {
  const [dia, setDia] = useState(diaHoy);
  const [hora, setHora] = useState(() => Math.min(23, Math.max(0, new Date().getHours())));
  const [capa, setCapa] = useState<CapaHex>("actividad");
  const [datoReal, setDatoReal] = useState(false);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  const [hex, setHex] = useState<{ data: ColeccionHex; origen: Origen } | null>(null);
  const [tianguis, setTianguis] = useState<{ lista: Tianguis[]; origen: Origen }>({ lista: [], origen: "api" });
  const [alcaldias, setAlcaldias] = useState<{ lista: Alcaldia[]; origen: Origen }>({ lista: [], origen: "api" });
  const [resumen, setResumen] = useState<Resumen | null>(null);

  const [altas, setAltas] = useState<Alta[]>([]);
  const [altaReciente, setAltaReciente] = useState(false);
  const [toast, setToast] = useState<{ id: string; texto: string } | null>(null);

  useEffect(() => {
    let vivo = true;
    cargarHex().then((r) => vivo && setHex(r));
    cargarAlcaldias().then((r) => vivo && setAlcaldias(r));
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    let vivo = true;
    cargarTianguis(dia, hora).then((r) => vivo && setTianguis(r));
    cargarResumen(dia, hora).then((r) => vivo && setResumen(r));
    return () => {
      vivo = false;
    };
  }, [dia, hora]);

  // Altas en vivo: cada 3 s pregunta por lo nuevo. Si falla (404 incluido), no hace ruido.
  useEffect(() => {
    let desde = Math.floor(Date.now() / 1000);
    const vistas = new Set<string>();
    let ocupado = false;
    const sondear = async () => {
      if (ocupado) return;
      ocupado = true;
      const r = await cargarAltas(desde);
      ocupado = false;
      if (!r) return;
      desde = r.ts ?? desde;
      const nuevas = r.altas.filter((a) => !vistas.has(a.id));
      if (!nuevas.length) return;
      nuevas.forEach((a) => vistas.add(a.id));
      setAltas((prev) => [...nuevas, ...prev].slice(0, MAX_ALTAS));
      setAltaReciente(true);
      const nombre = nuevas[0].ficha?.nombre?.trim();
      setToast({ id: nuevas[0].id, texto: `${nombre || "Un negocio nuevo"} se sumó a la red` });
      window.setTimeout(() => setAltaReciente(false), 5000);
      window.setTimeout(() => setToast((t) => (t?.id === nuevas[0].id ? null : t)), 5000);
    };
    const id = window.setInterval(sondear, 3000);
    return () => window.clearInterval(id);
  }, []);

  const abiertos = useMemo(() => tianguis.lista.filter((t) => estaAbierto(t, dia, hora)), [tianguis, dia, hora]);

  const cobertura = useMemo(() => {
    if (!hex) return null;
    const periodo = `${DIAS[dia]} ${String(hora).padStart(2, "0")}:00`;
    if (resumen?.poblacion_cubierta_pct) {
      const d = resumen.poblacion_cubierta_pct;
      return { pct: d.valor, tipo: d.tipo_dato, fuente: d.fuente, periodo: d.periodo };
    }
    return {
      pct: calcularCobertura(hex.data, abiertos),
      tipo: "estimado" as const,
      fuente: "Buffer de 800 m sobre tianguis abiertos (cálculo en el navegador)",
      periodo,
    };
  }, [hex, abiertos, resumen, dia, hora]);

  const propsSeleccion = useMemo(
    () => (seleccion && hex ? hex.data.features.find((f) => f.properties.h3 === seleccion)?.properties ?? null : null),
    [seleccion, hex],
  );

  const altasHoy = (resumen?.altas_hoy?.valor ?? 0) + altas.length;
  const hayEjemplo = hex?.origen === "ejemplo" || alcaldias.origen === "ejemplo" || tianguis.origen === "ejemplo";

  const primerTianguis = tianguis.lista[0];
  const datoAbiertos = {
    valor: abiertos.length,
    tipo: primerTianguis?.tipo_dato ?? ("simulado" as const),
    fuente: primerTianguis?.fuente ?? "Tianguis Abierto (pipeline)",
  };
  const datoAltas = {
    valor: altasHoy,
    tipo: resumen?.altas_hoy?.tipo_dato ?? ("simulado" as const),
    fuente: resumen?.altas_hoy?.fuente ?? "Altas en colonIA (demostración)",
  };

  return (
    <div className="relative h-full min-h-[560px] overflow-hidden bg-(--pb-superficie-2)">
      <div className="absolute inset-0">
        <MapaSedeco
          hex={hex?.data ?? { type: "FeatureCollection", features: [] }}
          capa={capa}
          datoReal={datoReal}
          tianguis={abiertos}
          altas={altas}
          seleccionado={seleccion}
          onSeleccion={setSeleccion}
        />
      </div>

      <div className="pointer-events-none absolute left-4 right-4 top-4 flex flex-wrap items-start gap-2 lg:right-[436px]">
        <div role="group" aria-label="Capa del mapa" className={`pointer-events-auto flex flex-wrap gap-0.5 rounded-2xl p-1 ${VIDRIO}`}>
          {CAPAS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={capa === c.id}
              onClick={() => setCapa(c.id)}
              disabled={datoReal}
              className={`h-10 rounded-xl px-3.5 text-base font-semibold transition-colors disabled:opacity-50 ${
                capa === c.id ? "bg-(--pb-texto) text-(--pb-superficie)" : "text-(--pb-texto) hover:bg-(--pb-superficie-2)"
              }`}
            >
              {c.texto}
            </button>
          ))}
        </div>
        {hayEjemplo && (
          <span role="status" className="pointer-events-auto rounded-xl border border-(--pb-borde-fuerte) bg-(--pb-acento-suave) px-3 py-2 text-base font-semibold text-(--pb-acento-fuerte)">
            Datos de ejemplo
          </span>
        )}
      </div>

      <div aria-live="polite" className="pointer-events-none absolute left-4 top-20 lg:right-[436px]">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 motion-safe:animate-[sedeco-toast_420ms_cubic-bezier(0.2,0.9,0.3,1.2)] ${VIDRIO}`}
          >
            <span className="relative flex size-3" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--pb-rosa,#db2777)] opacity-70 motion-reduce:animate-none" />
              <span className="relative size-3 rounded-full bg-[var(--pb-rosa,#db2777)]" />
            </span>
            <span className="text-base font-semibold text-(--pb-texto)">{toast.texto}</span>
          </div>
        )}
      </div>

      {propsSeleccion && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-start lg:right-[436px]">
          <TarjetaHex p={propsSeleccion} onCerrar={() => setSeleccion(null)} />
        </div>
      )}

      <aside
        aria-label="Panel SEDECO"
        className="absolute bottom-4 right-4 top-4 w-[min(404px,calc(100%-2rem))] max-lg:top-auto max-lg:h-[55%]"
      >
        <Panel
          dia={dia}
          onDia={setDia}
          hora={hora}
          onHora={setHora}
          datoReal={datoReal}
          onDatoReal={setDatoReal}
          alcaldias={alcaldias.lista}
          origenAlcaldias={alcaldias.origen}
          cobertura={cobertura}
          abiertos={datoAbiertos}
          altasHoy={datoAltas}
          altaReciente={altaReciente}
          origenHex={hex?.origen ?? "api"}
        />
      </aside>
      <style>{`@keyframes sedeco-toast { from { opacity: 0; transform: translateY(-12px) scale(0.96); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

export const route = "sedeco";
export const label = "SEDECO";
export const order = 1;
