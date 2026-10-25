import { useCallback, useEffect, useState } from "react";
import type { FeatureProps } from "../../App";
import { api } from "../../lib/api";
import { Boton, Cifra, Etiqueta, Logo, Tarjeta } from "../../lib/ui";
import { DONA_LUPE_ID, mockDonaLupe } from "./mock";
import { normalizar, pagina as normalizarPagina } from "./normalizar";
import type { AvanceVista, EstadoPrograma, EstadoEscalon, EscalonVista, NegocioVista, PaginaVista, ProgramaVista } from "./tipos";

export const route = "negocio";
export const label = "Negocio";
export const order = 3;

// Demo selector: live altas from the bot first (newest on top), then Doña Lupe and businesses near the venue
// (ids and names from data/processed/negocios.json).
const NEGOCIOS = [
  { id: DONA_LUPE_ID, nombre: "Puesto de Doña Lupe" },
  { id: "neg-0015", nombre: "Abarrotes Lupita" },
  { id: "neg-0037", nombre: "Recaudería Los Ángeles" },
  { id: "neg-0205", nombre: "Carnicería Los Arcos" },
];

type Opcion = { id: string; nombre: string };
type AltasLive = { altas?: { id?: string; ts?: number; ficha?: { nombre?: string } }[] };

function useAltasEnVivo(): Opcion[] {
  const [altas, setAltas] = useState<Opcion[]>([]);
  useEffect(() => {
    let vivo = true;
    api<AltasLive>("/altas/live?desde=0")
      .then((r) => {
        if (!vivo) return;
        const lista = [...(r.altas ?? [])]
          .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
          .filter((a): a is { id: string; ficha?: { nombre?: string } } => typeof a.id === "string")
          .map((a) => ({ id: a.id, nombre: `${a.ficha?.nombre ?? a.id} · alta nueva` }));
        setAltas(lista);
      })
      .catch(() => undefined); // sin servidor: el selector se queda con la lista fija
    return () => {
      vivo = false;
    };
  }, []);
  return altas;
}

// Focus ring comes from the global :focus-visible rule in lib/ui/tokens.css; these are the big touch targets.
const CONTROL =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-(--pb-radio-control) border-2 border-(--pb-borde-fuerte) bg-(--pb-superficie) px-5 text-lg font-semibold text-(--pb-texto) hover:bg-(--pb-superficie-2)";
const CHIP = "inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-lg font-medium";
const TEXTO_2 = "text-(--pb-texto-2)";

// Each result carries the id it belongs to, so a stale answer never shows under another business.
type Estado =
  | { id: string; fase: "listo"; negocio: NegocioVista }
  | { id: string; fase: "error"; mensaje: string };

export default function VistaNegocio({ params }: FeatureProps) {
  const id = params[0] ? decodeURIComponent(params[0]) : DONA_LUPE_ID;
  const [estado, setEstado] = useState<Estado | null>(null);
  const vista = estado?.id === id ? estado : null; // mientras cambia de negocio, se muestra "Cargando"

  useEffect(() => {
    let vivo = true;
    api<unknown>(`/negocio/${encodeURIComponent(id)}`)
      .then((datos) => vivo && setEstado({ id, fase: "listo", negocio: normalizar(datos) }))
      .catch((error: unknown) => {
        if (!vivo) return;
        // Sample data only for Doña Lupe; never show her data under another business's name.
        if (id === DONA_LUPE_ID) setEstado({ id, fase: "listo", negocio: normalizar(mockDonaLupe, true) });
        else setEstado({ id, fase: "error", mensaje: error instanceof Error ? error.message : "sin respuesta" });
      });
    return () => {
      vivo = false;
    };
  }, [id]);

  return (
    <div className="h-full overflow-y-auto bg-(--pb-fondo) text-(--pb-texto) text-lg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Logo className="text-xl" />
          <Selector id={id} />
        </div>
        {vista === null && (
          <p role="status" className={`p-6 text-xl ${TEXTO_2}`}>
            Cargando la información de tu negocio…
          </p>
        )}
        {vista?.fase === "error" && (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-(--pb-radio-tarjeta) border border-(--pb-error) bg-(--pb-superficie) p-6">
            <p className="text-xl font-semibold">No pudimos cargar este negocio.</p>
            <p className={TEXTO_2}>Revisa tu conexión e inténtalo otra vez. (Detalle: {vista.mensaje})</p>
            <button type="button" className={CONTROL} onClick={() => window.location.reload()}>
              Intentar otra vez
            </button>
          </div>
        )}
        {vista?.fase === "listo" && <Panel negocio={vista.negocio} id={id} />}
      </div>
    </div>
  );
}

function Selector({ id }: { id: string }) {
  const altas = useAltasEnVivo();
  const opciones = [...altas, ...NEGOCIOS.filter((n) => !altas.some((a) => a.id === n.id))];
  const conocido = opciones.some((n) => n.id === id);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="negocio-selector" className="font-medium">
        Elige un negocio
      </label>
      <select
        id="negocio-selector"
        value={id}
        onChange={(e) => (window.location.hash = `#/negocio/${encodeURIComponent(e.target.value)}`)}
        className="min-h-12 max-w-full rounded-(--pb-radio-control) border-2 border-(--pb-borde-fuerte) bg-(--pb-superficie) px-3 text-lg text-(--pb-texto)"
      >
        {!conocido && <option value={id}>{id}</option>}
        {opciones.map((n) => (
          <option key={n.id} value={n.id}>
            {n.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

function Panel({ negocio, id }: { negocio: NegocioVista; id: string }) {
  return (
    <div className="flex flex-col gap-5">
      {negocio.demo_data && (
        <p role="note" className="flex flex-wrap items-center gap-3 rounded-(--pb-radio-control) border border-dashed border-(--pb-borde-fuerte) bg-(--pb-superficie-2) px-4 py-3">
          <Etiqueta tipo="simulado" fuente="mock local de la vista Negocio" />
          Datos de ejemplo: no hay conexión con el servidor, así que mostramos un ejemplo de Doña Lupe.
        </p>
      )}
      <PerfilTarjeta negocio={negocio} />
      <EscaleraTarjeta escalera={negocio.escalera} />
      <div className="grid gap-5 lg:grid-cols-2">
        <AvanceTarjeta avance={negocio.avance} />
        <PaginaTarjeta id={id} inicial={negocio.pagina} demo={negocio.demo_data} />
      </div>
      <ProgramasTarjeta programas={negocio.programas} />
    </div>
  );
}

const PAGO: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  dimo: "DiMo",
  codi: "CoDi",
  tarjeta: "Tarjeta",
};

function PerfilTarjeta({ negocio }: { negocio: NegocioVista }) {
  const f = negocio.ficha;
  const tipoPrecio = negocio.demo_data ? "simulado" : "real";
  const fuentePrecio = negocio.demo_data ? "Ejemplo" : "Ficha del negocio";
  const inicial = f.nombre.trim().charAt(0).toUpperCase() || "?";
  return (
    <Tarjeta variante="plana" className="p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span
          aria-hidden="true"
          className="pb-display flex size-24 shrink-0 items-center justify-center rounded-(--pb-radio-grande) bg-(--pb-acento) text-5xl font-extrabold text-white shadow-(--pb-sombra-marca)"
        >
          {inicial}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <h1 className="pb-display text-[2.25rem] font-bold sm:text-[2.75rem]">{f.nombre}</h1>
            <p className={TEXTO_2}>{[f.giro, f.colonia].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Formas de pago y programas">
            {f.acepta_mercomuna === true && (
              <span className={`${CHIP} border-transparent bg-(--pb-real-fondo) text-(--pb-real-texto)`}>Acepta Mercomuna</span>
            )}
            {f.acepta_mercomuna === false && (
              <span className={`${CHIP} border-(--pb-borde) bg-(--pb-superficie) text-(--pb-texto)`}>Todavía no aceptas Mercomuna</span>
            )}
            {f.formas_pago.map((p) => (
              <span key={p} className={`${CHIP} border-(--pb-borde) bg-(--pb-superficie-2) text-(--pb-texto)`}>
                {PAGO[p.toLowerCase()] ?? p}
              </span>
            ))}
          </div>
          {f.descripcion && <p className="text-lg leading-relaxed">{f.descripcion}</p>}
          {f.horario && (
            <p className="text-lg">
              <span className="font-semibold">Horario: </span>
              {f.horario}
            </p>
          )}
        </div>
      </div>
      {f.productos.length > 0 && (
        <div className="mt-5 border-t border-(--pb-borde) pt-5">
          <h2 className="mb-3 text-xl font-semibold">Lo que vendes</h2>
          <ul className="grid gap-3 sm:grid-cols-2" aria-label="Productos y precios">
            {f.productos.map((p) => (
              <li key={p.nombre} className="flex flex-wrap items-center justify-between gap-2 rounded-(--pb-radio-control) bg-(--pb-superficie-2) px-4 py-3">
                <span className="text-lg font-medium capitalize">{p.nombre}</span>
                {p.precio !== null && (
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="pb-cifra text-xl font-bold">
                      ${p.precio}
                      {p.unidad ? ` el ${p.unidad}` : ""}
                    </span>
                    <Etiqueta tipo={tipoPrecio} fuente={fuentePrecio} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Tarjeta>
  );
}

const ESCALON: Record<EstadoEscalon, string> = {
  logrado: "Logrado",
  siguiente: "Tu siguiente paso",
  pendiente: "Pendiente",
  proximamente: "Próximamente",
  horizonte: "En el horizonte",
};

function EscaleraTarjeta({ escalera }: { escalera: EscalonVista[] }) {
  const actual = escalera.findIndex((e) => e.estado === "siguiente");
  return (
    <Tarjeta antetitulo="Tu camino" titulo="Tu escalera de barrio">
      {escalera.length === 0 ? (
        <p className={TEXTO_2}>Todavía no hay escalones para este negocio.</p>
      ) : (
        <ol className="grid gap-4 md:grid-cols-4" aria-label="Escalera de barrio">
          {escalera.map((e, i) => {
            const logrado = e.estado === "logrado";
            const esActual = i === actual;
            return (
              <li
                key={e.numero}
                aria-current={esActual ? "step" : undefined}
                className={`flex flex-col gap-3 rounded-(--pb-radio-control) border-2 p-4 ${
                  esActual ? "border-(--pb-acento) bg-(--pb-acento-suave)" : "border-(--pb-borde) bg-(--pb-superficie)"
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`h-1.5 rounded-full ${logrado ? "bg-(--pb-jade)" : esActual ? "bg-(--pb-acento)" : "bg-(--pb-borde)"}`}
                />
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                      logrado
                        ? "bg-(--pb-real-texto) text-white"
                        : esActual
                          ? "bg-(--pb-acento) text-white"
                          : "border-2 border-(--pb-borde-fuerte) bg-(--pb-superficie) text-(--pb-texto)"
                    }`}
                  >
                    {logrado ? <IconoCheck /> : e.numero}
                  </span>
                  <h3 className="text-xl font-semibold leading-tight">
                    <span className="sr-only">Escalón {e.numero}: </span>
                    {e.nombre}
                  </h3>
                </div>
                <p className={`text-base font-semibold ${esActual ? "text-(--pb-acento-fuerte)" : TEXTO_2}`}>{ESCALON[e.estado]}</p>
                {e.beneficio && <p className="text-lg leading-snug">{e.beneficio}</p>}
                {e.siguiente_accion && (
                  <p className="text-lg leading-snug">
                    <span className="font-semibold">Qué sigue: </span>
                    {e.siguiente_accion}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <p className={`mt-4 text-lg ${TEXTO_2}`}>Nada aquí es obligatorio ni es un trámite. Tú decides cuándo subir.</p>
    </Tarjeta>
  );
}

function IconoCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17l9-10" />
    </svg>
  );
}

// Bar chart of the 7-day totals. The API gives totals per metric, not a daily series, so the chart
// compares the three totals (and the zone average when present). Every bar has its value written on it.
function GraficaAvance({ avance }: { avance: AvanceVista }) {
  const barras = [
    { texto: "En rutas", valor: avance.apariciones_ruta.valor },
    { texto: "“Compré aquí”", valor: avance.compre_aqui.valor },
    { texto: "Visitas", valor: avance.vistas_pagina.valor },
  ];
  const prom = avance.promedio_zona_apariciones?.valor ?? null;
  const max = Math.max(1, ...barras.map((b) => b.valor ?? 0), prom ?? 0);
  const W = 360;
  const H = 230;
  const base = 170;
  const alto = 130;
  const resumen = barras.map((b) => `${b.texto}: ${b.valor ?? "sin dato"}`).join("; ");
  return (
    <figure className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Gráfica de los últimos 7 días. ${resumen}.`} className="w-full">
        <line x1="8" x2={W - 8} y1={base} y2={base} className="stroke-(--pb-borde-fuerte)" strokeWidth="2" />
        {prom !== null && (
          <g>
            <line
              x1="8"
              x2={W - 8}
              y1={base - (prom / max) * alto}
              y2={base - (prom / max) * alto}
              className="stroke-(--pb-anil)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <text x={W - 8} y={base - (prom / max) * alto - 8} textAnchor="end" className="fill-(--pb-anil) text-[15px] font-semibold">
              Promedio de tu zona: {prom}
            </text>
          </g>
        )}
        {barras.map((b, i) => {
          const ancho = 72;
          const x = 24 + i * 114;
          const h = b.valor === null ? 0 : (b.valor / max) * alto;
          return (
            <g key={b.texto}>
              <rect x={x} y={base - h} width={ancho} height={Math.max(h, 0)} rx="8" className={b.valor === null ? "fill-(--pb-borde)" : "fill-(--pb-acento)"} />
              <text x={x + ancho / 2} y={base - h - 8} textAnchor="middle" className="fill-(--pb-texto) pb-cifra text-[20px] font-bold">
                {b.valor ?? "—"}
              </text>
              <text x={x + ancho / 2} y={base + 26} textAnchor="middle" className="fill-(--pb-texto-2) text-[15px]">
                {b.texto}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="flex flex-wrap items-center gap-2 text-base text-(--pb-texto-2)">
        <Etiqueta tipo={avance.tipo_dato} fuente={avance.compre_aqui.fuente ?? undefined} />
        Totales de la semana.
      </figcaption>
    </figure>
  );
}

function AvanceTarjeta({ avance }: { avance: AvanceVista }) {
  return (
    <Tarjeta antetitulo={`Solo tú lo ves · ${avance.periodo}`} titulo="Mi avance">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-(--pb-radio-control) bg-(--pb-superficie-2) p-4">
          <Cifra valor={avance.apariciones_ruta.valor} etiqueta="veces en rutas de compra" tipo={avance.apariciones_ruta.tipo_dato} fuente={avance.apariciones_ruta.fuente ?? undefined} />
        </div>
        <div className="rounded-(--pb-radio-control) bg-(--pb-superficie-2) p-4">
          <Cifra valor={avance.compre_aqui.valor} etiqueta="“Compré aquí”" tipo={avance.compre_aqui.tipo_dato} fuente={avance.compre_aqui.fuente ?? undefined} />
        </div>
        <div className="rounded-(--pb-radio-control) bg-(--pb-superficie-2) p-4">
          <Cifra valor={avance.vistas_pagina.valor} etiqueta="visitas a tu página" tipo={avance.vistas_pagina.tipo_dato} fuente={avance.vistas_pagina.fuente ?? undefined} />
        </div>
      </div>
      <div className="mt-5 rounded-(--pb-radio-control) border border-(--pb-borde) p-4">
        <GraficaAvance avance={avance} />
      </div>
      {(avance.nota || avance.tipo_dato === "simulado") && (
        <p className={`mt-4 text-lg ${TEXTO_2}`}>
          {avance.nota ?? "Cifras de ejemplo: aún no hay suficientes visitas reales de tu negocio."}
        </p>
      )}
    </Tarjeta>
  );
}

type EstadoPagina =
  | { fase: "inicial" }
  | { fase: "generando" }
  | { fase: "lista"; pagina: PaginaVista }
  | { fase: "error"; mensaje: string };

function PaginaTarjeta({ id, inicial, demo }: { id: string; inicial: PaginaVista | null; demo: boolean }) {
  const [estado, setEstado] = useState<EstadoPagina>(inicial ? { fase: "lista", pagina: inicial } : { fase: "inicial" });

  const generar = useCallback(() => {
    setEstado({ fase: "generando" });
    api<unknown>(`/negocio/${encodeURIComponent(id)}/pagina`, { method: "POST" })
      .then((datos) => {
        const p = normalizarPagina(datos);
        setEstado(p ? { fase: "lista", pagina: p } : { fase: "error", mensaje: "respuesta sin enlace" });
      })
      .catch((error: unknown) => setEstado({ fase: "error", mensaje: error instanceof Error ? error.message : "sin respuesta" }));
  }, [id]);

  return (
    <Tarjeta antetitulo="En internet" titulo="Mi página web">
      {estado.fase !== "lista" && (
        <p className={`mb-4 text-lg ${TEXTO_2}`}>
          Una página sencilla con tus productos, horario y formas de pago, y un cartel con código QR para tu puesto.
        </p>
      )}
      <Boton tamano="lg" anchoCompleto onClick={generar} disabled={estado.fase === "generando"} aria-busy={estado.fase === "generando"}>
        {estado.fase === "generando" ? "Generando tu página…" : estado.fase === "lista" ? "Volver a generar mi página" : "Generar mi página"}
      </Boton>
      {estado.fase === "error" && (
        <p role="alert" className="mt-3 text-lg text-(--pb-error)">
          No se pudo generar la página{demo ? " (sin conexión con el servidor)" : ""}. Inténtalo otra vez. ({estado.mensaje})
        </p>
      )}
      {estado.fase === "lista" && (
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="w-[min(260px,100%)] shrink-0">
            <div className="rounded-[2.25rem] border-[10px] border-(--pb-texto) bg-(--pb-texto) shadow-(--pb-sombra-alta)">
              <div className="aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-white">
                <iframe title="Vista previa de tu página" src={estado.pagina.url} className="size-full border-0" />
              </div>
            </div>
            <p className={`mt-2 text-center text-base ${TEXTO_2}`}>Así se ve en un celular.</p>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            {estado.pagina.qr ? (
              <img
                src={estado.pagina.qr}
                alt="Código QR que abre tu página"
                className="size-44 rounded-(--pb-radio-control) border border-(--pb-borde) bg-white p-2 [image-rendering:pixelated]"
              />
            ) : (
              <p className={`text-lg ${TEXTO_2}`}>El código QR aparece al generar tu página.</p>
            )}
            <div className="flex w-full flex-col gap-3">
              <a href={estado.pagina.url} target="_blank" rel="noreferrer" className={CONTROL}>
                Ver mi página
              </a>
              <a href={estado.pagina.cartel} target="_blank" rel="noreferrer" className={CONTROL}>
                Imprimir mi cartel
              </a>
            </div>
          </div>
        </div>
      )}
    </Tarjeta>
  );
}

const PROGRAMA: Record<EstadoPrograma, { texto: string; clase: string }> = {
  existe: { texto: "Existe", clase: "border-transparent bg-(--pb-real-fondo) text-(--pb-real-texto)" },
  por_verificar: { texto: "Por verificar", clase: "border-transparent bg-(--pb-estimado-fondo) text-(--pb-estimado-texto)" },
  propuesta: {
    texto: "Propuesta",
    clase: "border-dashed border-(--pb-simulado-texto) bg-(--pb-simulado-fondo) text-(--pb-simulado-texto)",
  },
};

function ProgramasTarjeta({ programas }: { programas: ProgramaVista[] }) {
  return (
    <Tarjeta antetitulo="Apoyos" titulo="Programas para ti">
      {programas.length === 0 ? (
        <p className={TEXTO_2}>Por ahora no encontramos programas para tu negocio.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {programas.map((p) => {
            const est = PROGRAMA[p.estado];
            return (
              <li key={p.id} className="flex flex-col gap-3 rounded-(--pb-radio-control) border border-(--pb-borde) bg-(--pb-superficie) p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold leading-tight">{p.nombre}</h3>
                  <span className={`${CHIP} ${est.clase}`}>{est.texto}</span>
                </div>
                {p.puede_entrar && <p className="font-semibold text-(--pb-real-texto)">Puedes entrar</p>}
                {p.que_es && <p className="text-lg leading-snug">{p.que_es}</p>}
                {p.motivo && <p className={`text-lg ${TEXTO_2}`}>Por qué: {p.motivo}</p>}
                {p.como_entrar && <p className={`text-lg ${TEXTO_2}`}>Cómo entrar: {p.como_entrar}</p>}
                {p.url_oficial && (
                  <a href={p.url_oficial} target="_blank" rel="noreferrer" className={`${CONTROL} mt-auto self-start`}>
                    Sitio oficial
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Tarjeta>
  );
}
