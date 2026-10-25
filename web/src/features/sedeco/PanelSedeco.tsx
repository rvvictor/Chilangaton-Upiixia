import { Etiqueta } from "../../lib/ui";
import { Cifra } from "./Cifra";
import { formato as cifra, VIDRIO } from "./estilo";
import { DIAS, NOMBRE_ALCALDIA, type Alcaldia, type PropsHex, type TipoDato } from "./datos";


type Dato = { valor: number | null; tipo: TipoDato; fuente: string };

type PanelProps = {
  dia: number;
  onDia: (d: number) => void;
  hora: number;
  onHora: (h: number) => void;
  datoReal: boolean;
  onDatoReal: (v: boolean) => void;
  alcaldias: Alcaldia[];
  origenAlcaldias: "api" | "ejemplo";
  cobertura: { pct: number; tipo: TipoDato; fuente: string; periodo: string } | null;
  abiertos: Dato;
  altasHoy: Dato;
  altaReciente: boolean;
  origenHex: "api" | "ejemplo";
};

const DIAS_LARGOS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

function Kpi({ titulo, dato, decimales = 0, sufijo = "", grande = false, pulso = false }: { titulo: string; dato: Dato; decimales?: number; sufijo?: string; grande?: boolean; pulso?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 rounded-(--pb-radio-tarjeta) bg-(--pb-superficie)/90 px-3.5 py-2.5 ${grande ? "col-span-2" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.889rem] font-medium leading-tight text-(--pb-texto-2)">{titulo}</p>
        {pulso && (
          <span className="relative flex size-3" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--pb-rosa,#db2777)] opacity-70 motion-reduce:animate-none" />
            <span className="relative size-3 rounded-full bg-[var(--pb-rosa,#db2777)]" />
          </span>
        )}
      </div>
      <div className={`flex min-w-0 gap-x-3 gap-y-1 ${grande ? "flex-wrap items-end" : "flex-col"}`}>
        <Cifra valor={dato.valor} decimales={decimales} sufijo={sufijo} className={`leading-none text-(--pb-texto) ${grande ? "text-[2.75rem]" : "text-[1.875rem]"}`} />
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <Etiqueta tipo={dato.tipo} fuente={dato.fuente} />
          {grande && <span className="truncate text-[0.778rem] text-(--pb-texto-2)">Fuente: {dato.fuente}</span>}
        </div>
      </div>
    </div>
  );
}

/** Panel flotante de vidrio a la derecha: KPIs, día y hora, dato real, leyenda. Sin scroll de página a 1280×720. */
export function Panel(p: PanelProps) {
  const cobertura: Dato = p.cobertura
    ? { valor: p.cobertura.pct, tipo: p.cobertura.tipo, fuente: p.cobertura.fuente }
    : { valor: null, tipo: "estimado", fuente: "Calculando…" };
  return (
    <div className={`flex h-full flex-col gap-2.5 overflow-y-auto rounded-[22px] p-3.5 ${VIDRIO}`}>
      <header className="flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-[0.778rem] font-semibold uppercase tracking-[0.14em] text-(--pb-acento-fuerte)">Tablero SEDECO</p>
          <h2 className="text-[1.125rem] font-semibold leading-tight tracking-tight text-(--pb-texto)">
            <span className="capitalize">{DIAS_LARGOS[p.dia]}</span>, {String(p.hora).padStart(2, "0")}:00
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span id="sedeco-dato-real" className="text-right text-base font-semibold leading-tight text-(--pb-texto)">
            Ver dato real
            <span className="block text-[0.778rem] font-normal text-(--pb-texto-2)">CNBV por alcaldía</span>
          </span>
        <button
          type="button"
          role="switch"
          aria-checked={p.datoReal}
          aria-labelledby="sedeco-dato-real"
          onClick={() => p.onDatoReal(!p.datoReal)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${p.datoReal ? "bg-(--pb-texto)" : "bg-(--pb-borde-fuerte)"}`}
        >
          <span className={`absolute top-1 size-6 rounded-full bg-(--pb-superficie) shadow transition-all ${p.datoReal ? "left-7" : "left-1"}`} />
        </button>
        </div>
      </header>

      <section aria-label="Cifras clave" aria-live="polite" className="grid grid-cols-2 gap-2">
        <Kpi titulo="Población con tianguis a 800 m" dato={cobertura} decimales={1} sufijo=" %" grande />
        <Kpi titulo="Tianguis abiertos" dato={p.abiertos} />
        <Kpi titulo="Altas hoy" dato={p.altasHoy} pulso={p.altaReciente} />
      </section>

      <section aria-label="Día y hora" className="flex flex-col gap-2">
        <div role="group" aria-label="Día de la semana" className="grid grid-cols-7 gap-0.5 rounded-(--pb-radio-control) bg-(--pb-superficie-2) p-1">
          {DIAS.map((nombre, i) => (
            <button
              key={nombre}
              type="button"
              aria-pressed={p.dia === i}
              aria-label={DIAS_LARGOS[i]}
              onClick={() => p.onDia(i)}
              className={`h-11 rounded-[9px] text-base font-semibold capitalize transition-colors ${
                p.dia === i
                  ? "bg-(--pb-texto) text-(--pb-superficie) shadow-sm"
                  : "text-(--pb-texto) hover:bg-(--pb-superficie)"
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 px-1 text-base font-medium text-(--pb-texto)">
          <span className="w-14 shrink-0 tabular-nums">{String(p.hora).padStart(2, "0")}:00</span>
          <input
            type="range"
            min={0}
            max={23}
            step={1}
            value={p.hora}
            aria-label="Hora del día"
            onChange={(e) => p.onHora(Number(e.target.value))}
            className="h-6 w-full accent-(--pb-acento)"
          />
        </label>
      </section>

      {p.datoReal ? (
        <section aria-label="Dato CNBV por alcaldía" className="grid grid-cols-2 gap-2">
          {p.alcaldias.map((a) => (
            <div key={a.cvegeo} className="flex min-w-0 flex-col gap-1 rounded-(--pb-radio-tarjeta) bg-(--pb-superficie)/90 px-3.5 py-2.5">
              <span className="text-base font-semibold text-(--pb-texto)">{a.municipio}</span>
              <Cifra valor={a.tpv_por_adulto} decimales={2} className="text-[1.75rem] leading-none text-(--pb-texto)" />
              <span className="text-[0.833rem] leading-tight text-(--pb-texto-2)">pagos con tarjeta por adulto · {a.trimestre}</span>
              <Etiqueta tipo={a.tipo_dato} fuente={`CNBV ${a.trimestre}`} className="self-start" />
            </div>
          ))}
          {p.origenAlcaldias === "ejemplo" && <p className="col-span-2 text-base font-medium text-(--pb-texto-2)">Datos de ejemplo.</p>}
        </section>
      ) : (
        <section aria-label="Leyenda" className="rounded-(--pb-radio-control) bg-(--pb-superficie)/90 px-3.5 py-2.5 text-base text-(--pb-texto)">
          <p className="font-semibold">Color: índice de impulso · altura: capa</p>
          <div
            aria-hidden="true"
            className="mt-2 h-2.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--pb-impulso-1), var(--pb-impulso-2), var(--pb-impulso-3), var(--pb-impulso-4), var(--pb-impulso-5))",
            }}
          />
          <div className="mt-1 flex items-center justify-between gap-2 text-[0.833rem] text-(--pb-texto-2)">
            <span>bajo</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-3 rounded-sm bg-(--pb-oculto)" aria-hidden="true" />
              gris: menos de 3 negocios, sin cifras
            </span>
            <span>alto</span>
          </div>
        </section>
      )}

      {!p.datoReal && (
        <p className="mt-auto px-1 text-[0.833rem] leading-snug text-(--pb-texto-2)">
          {p.origenHex === "ejemplo" ? "Hexágonos: datos de ejemplo. " : ""}
          Toca un hexágono para ver sus cifras y su fuente.
        </p>
      )}
    </div>
  );
}

/** Tarjeta del hexágono tocado (sobre el mapa). Oculto: sin cifras por privacidad. */
export function TarjetaHex({ p, onCerrar }: { p: PropsHex; onCerrar: () => void }) {
  const tc = p.tipo_campos;
  const fuentePoblacion = "hexágonos del pipeline (data/processed/hex.geojson)";
  const alcaldia = NOMBRE_ALCALDIA[p.alcaldia_cvegeo] ?? "CDMX";
  return (
    <section
      aria-label="Detalle del hexágono"
      className={`w-full max-w-md rounded-[22px] p-4 ${VIDRIO}`}
    >
      <header className="mb-2 flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-(--pb-texto)">Hexágono en {alcaldia}</h2>
        <button
          type="button"
          onClick={onCerrar}
          className="shrink-0 h-10 rounded-(--pb-radio-control) bg-(--pb-superficie-2) px-3 text-base font-semibold text-(--pb-texto) hover:bg-(--pb-borde)"
        >
          Cerrar
        </button>
      </header>

      {p.oculto ? (
        <p className="text-lg leading-relaxed text-(--pb-texto)">Menos de 3 negocios: sin cifras por privacidad</p>
      ) : (
        <dl className="grid gap-2 text-base text-(--pb-texto)">
          <Fila etiqueta="Población" valor={cifra(p.poblacion)} tipo={tc.poblacion ?? "simulado"} fuente={fuentePoblacion} />
          <Fila
            etiqueta="Negocios de barrio"
            valor={`${cifra(p.negocios_barriales)} de ${cifra(p.negocios_total)}`}
            tipo={tc.negocios_barriales ?? "simulado"}
            fuente="DENUE y Tianguis Abierto (pipeline)"
          />
          <Fila
            etiqueta="Actividad con tarjeta (estimada)"
            valor={cifra(p.actividad_tpv_est, 2)}
            tipo={tc.actividad_tpv_est ?? "estimado"}
            fuente="CNBV por alcaldía, repartido por negocios"
          />
          <Fila
            etiqueta="Impulso"
            valor={p.impulso == null ? "Sin dato" : `${Math.round(p.impulso * 100)} de 100`}
            tipo={tc.impulso ?? "estimado"}
            fuente="Índice propio del pipeline"
          />
          <Fila etiqueta="Periodo" valor={p.periodo_cnbv ?? "Sin periodo"} tipo="real" fuente="CNBV" />
        </dl>
      )}
    </section>
  );
}

function Fila({ etiqueta, valor, tipo, fuente }: { etiqueta: string; valor: string; tipo: TipoDato; fuente: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-(--pb-borde) pb-2 last:border-0">
      <dt className="font-medium">{etiqueta}</dt>
      <dd className="flex items-center gap-2">
        <span className="text-lg font-bold tabular-nums">{valor}</span>
        <Etiqueta tipo={tipo} fuente={fuente} />
      </dd>
      <p className="w-full text-[0.833rem] text-(--pb-texto-2)">Fuente: {fuente}</p>
    </div>
  );
}
