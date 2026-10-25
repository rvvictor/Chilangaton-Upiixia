// Mirror of app/schemas/ (PB-002). Same field names, snake_case. Mocks: app/fixtures/<endpoint>.json.
// `dias`: 0 = domingo … 6 = sábado, same as JS `Date.getDay()` (Python's weekday() differs).
// Hours are "HH:MM" strings, CDMX time. Every visible number carries `tipo_dato`.

export type TipoDato = "real" | "estimado" | "simulado";
export type FormaPago = "efectivo" | "transferencia" | "dimo" | "codi" | "tarjeta";
export type TipoPunto = "tianguis" | "mercado" | "puesto" | "concentracion";
export type TipoEvento = "busqueda" | "aparicion_ruta" | "compre_aqui" | "vista_pagina" | "alta";
export type OrigenAlta = "telegram" | "campo" | "demo";
export type EstadoPrograma = "existe" | "por_verificar" | "propuesta";

export interface Cifra {
  valor: number | null;
  tipo_dato: TipoDato;
  fuente: string | null;
  periodo: string | null;
}

export interface LatLng {
  lat: number;
  lng: number;
}

// ---------- entities (IDEA.md §6) ----------

export interface PuntoBarrial {
  id: string;
  tipo: TipoPunto;
  nombre: string;
  alcaldia_cvegeo: string;
  colonia: string | null;
  lat: number;
  lng: number;
  h3: string;
  dias: number[];
  abre: string;
  cierra: string;
  horario_supuesto: boolean;
  giros: string[];
  productos: string[];
  formas_pago: FormaPago[];
  acepta_mercomuna: boolean | null;
  fuente: string;
  fecha_verificacion: string | null;
  verificado_por: string | null;
  tipo_dato: TipoDato;
}

export interface Negocio {
  id: string;
  clee: string | null;
  nombre: string;
  razon_social: string | null;
  clase_scian: string;
  clase_nombre: string;
  estrato: string;
  tipo_establecimiento: string | null;
  lat: number;
  lng: number;
  h3: string;
  alcaldia_cvegeo: string;
  colonia: string | null;
  fecha_alta_denue: string | null;
  es_barrial: boolean;
  motivo_exclusion: "giro" | "tamano" | "nombre" | "repeticion" | null;
  formas_pago: FormaPago[];
  acepta_mercomuna: boolean | null;
  tipo_dato: TipoDato;
}

export interface HexagonoProps {
  h3: string;
  alcaldia_cvegeo: string;
  poblacion: number;
  negocios_barriales: number;
  negocios_total: number;
  actividad_tpv_est: number | null; // null when oculto
  monto_est: number | null;
  impulso: number; // 0..1
  cluster_id: string | null;
  oculto: boolean;
  tipo_campos: Record<string, TipoDato>;
  periodo_cnbv: string;
}

export interface Hexagono {
  type: "Feature";
  geometry: { type: "Polygon"; coordinates: number[][][] }; // [[[lng, lat], …]]
  properties: HexagonoProps;
}

export interface HexagonoColeccion {
  type: "FeatureCollection";
  features: Hexagono[];
}

export interface DineroAlcaldia {
  cvegeo: string;
  municipio: string;
  trimestre: string;
  transacciones_tpv: number;
  monto_tpv: number | null;
  adultos: number;
  tpv_por_adulto: number;
  fuente_url: string;
  fecha_descarga: string;
  tipo_dato: TipoDato;
}

export interface Articulo {
  articulo: string;
  sinonimos: string[];
  clases_scian: string[];
  categoria_ui: string;
}

export interface Programa {
  id: string;
  nombre: string;
  que_es: string;
  para_quien: string;
  como_entrar: string;
  url_oficial: string | null;
  estado: EstadoPrograma;
  fecha_verificacion: string | null;
}

export interface Producto {
  nombre: string;
  precio: number | null;
  unidad: string | null;
}

export interface Ficha {
  nombre: string;
  tipo: TipoPunto;
  clase_scian: string;
  clase_nombre: string | null;
  descripcion: string | null; // ≤ 280 chars
  productos: Producto[];
  dias: number[];
  abre: string | null;
  cierra: string | null;
  formas_pago: FormaPago[];
  acepta_mercomuna: boolean | null;
  whatsapp: string | null;
  colonia: string | null;
  tianguis_id: string | null;
}

export interface Alta {
  id: string;
  slug: string;
  ts: number;
  ficha: Ficha;
  lat: number;
  lng: number;
  h3: string;
  alcaldia_cvegeo: string | null;
  origen: OrigenAlta;
  verificado_por: string | null;
  consentimiento_publicar: boolean;
  demo_data: boolean;
}

export interface Evento {
  ts: number;
  tipo: TipoEvento;
  negocio_id: string | null;
  h3: string | null;
  demo_data: boolean;
}

// ---------- API (IDEA.md Apéndice C) ----------

export interface Health {
  status: string;
}

export interface TianguisResponse {
  dia: number;
  hora: string;
  total: number;
  abiertos: PuntoBarrial[];
  cerrados_ids: string[];
}

export interface ArticulosRequest {
  texto_lista: string;
}

export interface ItemInterpretado {
  texto: string;
  cantidad: number | null;
  unidad: string | null;
  clases: string[];
  fuente: "exacto" | "sinonimo" | "difuso" | "llm";
}

export interface ArticulosResponse {
  items: ItemInterpretado[];
  sin_resultado: string[];
}

export interface RutaRequest {
  origen: LatLng;
  texto_lista: string;
  dia?: number | null;
  hora?: string | null;
  radio_m?: number;
  alpha?: number;
  regresar?: boolean;
}

export interface LugarRuta {
  id: string;
  nombre: string;
  tipo: "negocio" | "tianguis" | "mercado" | "puesto";
  clase_nombre: string;
  lat: number;
  lng: number;
  h3: string;
  es_barrial: boolean;
  impulso: number;
  formas_pago: FormaPago[];
  acepta_mercomuna: boolean | null;
  horario_verificado: boolean;
  slug: string | null;
}

export interface Parada {
  orden: number;
  negocio: LugarRuta;
  articulos: string[];
  por_que: string[];
}

export interface RutaResponse {
  paradas: Parada[];
  geometria: { type: "LineString"; coordinates: number[][] }; // [[lng, lat], …]
  distancia_m: number;
  minutos: number;
  metodo: "mapbox" | "linea_recta";
  aviso: string | null;
  resumen: { barrial_pct: number; cadenas: number; paradas_impulso: number };
  sin_resultado: string[];
  demo_data: boolean;
}

export interface EventoRequest {
  tipo: TipoEvento;
  negocio_id?: string | null;
  h3?: string | null;
}

export interface AltaRequest {
  ficha: Ficha;
  lat: number;
  lng: number;
  origen: OrigenAlta;
  verificado_por?: string | null;
  consentimiento_publicar: boolean;
}

export interface AltasLive {
  ts: number; // send back as `desde`
  altas: Alta[];
  altas_hoy: number;
}

export interface AvanceDia {
  fecha: string;
  apariciones_ruta: number;
  busquedas: number;
  compre_aqui: number;
  vistas_pagina: number;
}

export interface Avance {
  dias: AvanceDia[];
  apariciones_ruta: Cifra;
  busquedas: Cifra;
  compre_aqui: Cifra;
  vistas_pagina: Cifra;
  promedio_zona_apariciones: Cifra;
  tipo_dato: TipoDato;
}

export interface Escalon {
  numero: 1 | 2 | 3 | 4;
  nombre: string;
  estado: "logrado" | "siguiente" | "proximamente" | "horizonte";
  beneficio: string;
  siguiente_accion: string | null;
}

export interface ProgramaNegocio extends Programa {
  puede_entrar: boolean | null;
  motivo: string | null;
}

export interface Pagina {
  slug: string;
  url: string;
  cartel_url: string;
  qr_data_uri: string | null;
}

export interface NegocioDetalle {
  id: string;
  origen: "denue" | "alta" | "tianguis";
  ficha: Ficha;
  lat: number;
  lng: number;
  h3: string;
  alcaldia_cvegeo: string | null;
  avance: Avance;
  escalera: Escalon[];
  programas: ProgramaNegocio[];
  pagina: Pagina | null;
}

export interface NegociosResponse {
  negocios: Negocio[];
}

export interface SedecoResumen {
  dia: number;
  hora: string;
  altas_hoy: Cifra;
  poblacion_cubierta_pct: Cifra;
  puntos_abiertos: Cifra;
  rutas_por_hex: Record<string, number>;
  rutas_tipo_dato: TipoDato;
}

export interface SedecoCrecimiento {
  serie_trimestral: { cvegeo: string; municipio: string; trimestre: string; transacciones_tpv: number; tipo_dato: TipoDato }[];
  altas_denue_por_anio: { cvegeo: string; anio: number; altas: number; tipo_dato: TipoDato }[];
  altas_plataforma_hoy: Cifra;
  rutas_por_hex: { h3: string; rutas: number; tipo_dato: TipoDato }[];
  alcaldias: string[];
}
