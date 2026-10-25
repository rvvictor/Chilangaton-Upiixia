import { useEffect, useState } from "react";
import type { FeatureProps } from "../../App";
import { api } from "../../lib/api";
import { MOCK } from "./mock";
import type { Crecimiento, Punto, SerieAlcaldia, TipoDato } from "./tipos";

export const route = "crecimiento";
export const label = "Crecimiento";
export const order = 4;

const POLL_MS = 5000;
const COLORES = ["var(--pb-acento, #c2410c)", "var(--pb-tinta-2, #1d4ed8)"];

const ETIQUETA: Record<TipoDato, { texto: string; clase: string }> = {
  real: { texto: "Real", clase: "bg-emerald-100 text-emerald-900 border-emerald-700" },
  estimado: { texto: "Estimado", clase: "bg-amber-100 text-amber-900 border-amber-700" },
  simulado: { texto: "Simulado", clase: "bg-stone-200 text-stone-900 border-stone-600" },
};

function Etiqueta({ tipo }: { tipo: TipoDato }) {
  const e = ETIQUETA[tipo];
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-base font-semibold ${e.clase}`}>
      {e.texto}
    </span>
  );
}

function Fuente({ texto }: { texto: string }) {
  return <p className="mt-1 text-base leading-snug text-stone-700">Fuente: {texto}</p>;
}

function Tarjeta({
  titulo,
  tipo,
  fuente,
  children,
}: {
  titulo: string;
  tipo: TipoDato;
  fuente: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={titulo}
      className="flex flex-col rounded-xl border border-stone-300 bg-white p-3"
    >
      <header className="flex items-start justify-between gap-2">
        <h2 className="text-xl font-semibold text-stone-900">{titulo}</h2>
        <Etiqueta tipo={tipo} />
      </header>
      <div className="flex-1 pt-1">{children}</div>
      <Fuente texto={fuente} />
    </section>
  );
}

function Leyenda({ series }: { series: SerieAlcaldia[] }) {
  return (
    <ul className="flex flex-wrap gap-4 text-base text-stone-800">
      {series.map((s, i) => (
        <li key={s.alcaldia_cvegeo} className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-3 w-6 rounded" style={{ background: COLORES[i % 2] }} />
          {s.alcaldia}
        </li>
      ))}
    </ul>
  );
}

function Lineas({ series }: { series: SerieAlcaldia[] }) {
  const W = 360;
  const H = 150;
  const todos = series.flatMap((s) => s.puntos.map((p) => p.valor));
  const max = Math.max(1, ...todos);
  const min = Math.min(max - 1, ...todos) * 0.9;
  const n = Math.max(1, (series[0]?.puntos.length ?? 1) - 1);
  const xy = (p: Punto, i: number) =>
    `${(i / n) * W},${H - ((p.valor - min) / (max - min)) * (H - 10) - 5}`;
  const primero = series[0]?.puntos[0]?.periodo ?? "";
  const ultimo = series[0]?.puntos.at(-1)?.periodo ?? "";
  const resumen = series
    .map((s) => `${s.alcaldia}: de ${s.puntos[0]?.valor ?? 0} a ${s.puntos.at(-1)?.valor ?? 0}`)
    .join("; ");
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" role="img" aria-label={`Serie trimestral ${primero} a ${ultimo}. ${resumen}`}>
        <line x1="0" y1={H - 1} x2={W} y2={H - 1} stroke="#a8a29e" />
        {series.map((s, i) => (
          <polyline
            key={s.alcaldia_cvegeo}
            fill="none"
            stroke={COLORES[i % 2]}
            strokeWidth="3"
            points={s.puntos.map(xy).join(" ")}
          />
        ))}
      </svg>
      <figcaption className="flex justify-between text-base text-stone-700">
        <span>{primero}</span>
        <span>{ultimo}</span>
      </figcaption>
      <Leyenda series={series} />
    </figure>
  );
}

function BarrasAnio({ series }: { series: SerieAlcaldia[] }) {
  const max = Math.max(1, ...series.flatMap((s) => s.puntos.map((p) => p.valor)));
  const periodos = series[0]?.puntos.map((p) => p.periodo) ?? [];
  return (
    <figure>
      <div className="flex h-20 items-end gap-2" role="img" aria-label={series.map((s) => `${s.alcaldia}: ${s.puntos.map((p) => `${p.periodo} ${p.valor}`).join(", ")}`).join(". ")}>
        {periodos.map((periodo, j) => (
          <div key={periodo} className="flex h-full flex-1 flex-col justify-end">
            <div className="flex h-full items-end gap-0.5">
              {series.map((s, i) => (
                <div
                  key={s.alcaldia_cvegeo}
                  title={`${s.alcaldia} ${periodo}: ${s.puntos[j]?.valor ?? 0}`}
                  className="flex-1 rounded-t"
                  style={{ height: `${((s.puntos[j]?.valor ?? 0) / max) * 100}%`, background: COLORES[i % 2] }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 text-sm text-stone-700" aria-hidden>
        {periodos.map((p) => (
          <span key={p} className="flex-1 text-center">{`'${p.slice(2)}`}</span>
        ))}
      </div>
      <Leyenda series={series} />
    </figure>
  );
}

function Rutas({ data }: { data: Crecimiento["rutas_por_hexagono"] }) {
  if (data.hexagonos.length === 0) {
    return (
      <p className="text-lg text-stone-700">
        {data.archivo_disponible
          ? "Todavía no hay rutas registradas hoy."
          : "Sin registro de rutas todavía: aparecerán cuando alguien arme una ruta."}
      </p>
    );
  }
  const max = Math.max(1, ...data.hexagonos.map((h) => h.rutas));
  return (
    <ul className="flex flex-col gap-1.5" aria-label={`${data.total} rutas en total`}>
      {data.hexagonos.slice(0, 6).map((h) => (
        <li key={h.h3} className="flex items-center gap-2 text-base">
          <span className="w-24 shrink-0 truncate font-mono text-stone-800" title={h.h3}>{h.h3.slice(0, 9)}</span>
          <span className="h-4 rounded" style={{ width: `${(h.rutas / max) * 100}%`, background: COLORES[0] }} />
          <span className="font-semibold text-stone-900">{h.rutas}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CrecimientoView(_props: FeatureProps) {
  const [data, setData] = useState<Crecimiento | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    const cargar = () =>
      api<Crecimiento>("/sedeco/crecimiento")
        .then((d) => {
          if (!vivo) return;
          setData(d);
          setError(false);
        })
        .catch(() => {
          if (!vivo) return;
          setError(true);
          setData((prev) => prev ?? MOCK);
        });
    cargar();
    const id = window.setInterval(cargar, POLL_MS);
    return () => {
      vivo = false;
      window.clearInterval(id);
    };
  }, []);

  if (!data) {
    return (
      <p role="status" className="p-8 text-xl text-stone-700">
        Cargando el panel de crecimiento…
      </p>
    );
  }

  const altas = data.altas_plataforma;
  const muestra = data.demo_data;

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto px-3 pt-2 pb-0.5 text-lg text-stone-900">
      {(error || muestra) && (
        <p role="status" className="rounded-lg border border-amber-700 bg-amber-50 px-4 py-1 text-lg text-amber-950">
          {error && data.generado !== ""
            ? "Sin conexión con el servidor: mostramos los últimos datos recibidos."
            : error
            ? "No pudimos conectar con el servidor. Mostramos datos de muestra (demo_data: true), no son cifras reales."
            : "Modo demo: parte de estos datos son de muestra (demo_data: true)."}
        </p>
      )}

      <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3">
        <section
          aria-label="Altas en la plataforma hoy"
          className="rounded-xl border-2 border-stone-900 bg-white p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-semibold">Altas hoy</h2>
            <Etiqueta tipo={altas.tipo_dato} />
          </div>
          <p aria-live="polite" className="text-5xl font-bold tabular-nums" style={{ color: "var(--pb-acento, #c2410c)" }}>
            {altas.hoy}
          </p>
          <p className="text-base text-stone-800">
            {altas.total} en total · cada 5 s
          </p>
          <Fuente texto={altas.archivo_disponible || error ? altas.fuente : `${altas.fuente} (aún sin altas)`} />
        </section>

        <section
          aria-label="Cómo escala"
          className="rounded-xl border border-stone-300 bg-stone-50 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-semibold">Cómo escala a las {data.escala.alcaldias_totales} alcaldías</h2>
            <Etiqueta tipo={data.escala.tipo_dato} />
          </div>
          <p className="mt-1">
            Hoy funciona en <strong>{data.escala.alcaldias_activas.join(" e ")}</strong>. Para sumar otra
            alcaldía basta con agregar su clave en la variable{" "}
            <code className="rounded bg-white px-1.5 font-mono">{data.escala.parametro}</code>.
          </p>
          <p className="mt-1">
            <strong>Costo:</strong> {data.escala.costo}
          </p>
          <ul className="mt-1 grid list-disc grid-cols-2 gap-x-6 pl-6 text-base leading-snug">
            {data.escala.piezas.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Tarjeta
          titulo={data.serie_trimestral[0]?.indicador ?? "Inclusión financiera por trimestre"}
          tipo={data.serie_trimestral[0]?.tipo_dato ?? "simulado"}
          fuente={data.serie_trimestral[0]?.fuente ?? ""}
        >
          <Lineas series={data.serie_trimestral} />
        </Tarjeta>
        <Tarjeta
          titulo="Altas de negocios por año"
          tipo={data.altas_negocios_por_anio[0]?.tipo_dato ?? "simulado"}
          fuente={data.altas_negocios_por_anio[0]?.fuente ?? ""}
        >
          <BarrasAnio series={data.altas_negocios_por_anio} />
        </Tarjeta>
        <Tarjeta
          titulo="Rutas que pasaron por cada hexágono"
          tipo={data.rutas_por_hexagono.tipo_dato}
          fuente={data.rutas_por_hexagono.fuente}
        >
          <Rutas data={data.rutas_por_hexagono} />
        </Tarjeta>
      </div>
    </div>
  );
}
