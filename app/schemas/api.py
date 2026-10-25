"""Peticiones y respuestas de la API (IDEA.md Apéndice C). Un fixture por respuesta en app/fixtures/."""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.entidades import (
    HORA,
    Alta,
    Cifra,
    Ficha,
    FormaPago,
    LatLng,
    Negocio,
    Programa,
    PuntoBarrial,
    TipoDato,
    TipoEvento,
    OrigenAlta,
)


class Health(BaseModel):
    status: str


# GET /api/tianguis?dia=0-6&hora=HH:MM
class TianguisResponse(BaseModel):
    dia: int = Field(ge=0, le=6, description="0 = domingo")
    hora: str = Field(pattern=HORA)
    total: int
    abiertos: list[PuntoBarrial]
    cerrados_ids: list[str] = Field(description="Puntos que existen pero están cerrados: la UI los apaga")


# POST /api/articulos/interpretar
class ArticulosRequest(BaseModel):
    texto_lista: str


class ItemInterpretado(BaseModel):
    texto: str
    cantidad: float | None = None
    unidad: str | None = None
    clases: list[str]
    fuente: Literal["exacto", "sinonimo", "difuso", "llm"]


class ArticulosResponse(BaseModel):
    items: list[ItemInterpretado]
    sin_resultado: list[str]


# POST /api/ruta
class RutaRequest(BaseModel):
    origen: LatLng
    texto_lista: str
    dia: int | None = Field(default=None, ge=0, le=6, description="0 = domingo; null = hoy")
    hora: str | None = Field(default=None, pattern=HORA, description="null = ahora")
    radio_m: int = 1500
    alpha: float = 0.6
    regresar: bool = True


class LugarRuta(BaseModel):
    """Negocio DENUE, punto barrial o alta: lo mínimo para dibujar y explicar una parada."""

    id: str
    nombre: str
    tipo: Literal["negocio", "tianguis", "mercado", "puesto"]
    clase_nombre: str
    lat: float
    lng: float
    h3: str
    es_barrial: bool
    impulso: float
    formas_pago: list[FormaPago] = []
    acepta_mercomuna: bool | None = None
    horario_verificado: bool = False
    slug: str | None = None


class Parada(BaseModel):
    orden: int
    negocio: LugarRuta
    articulos: list[str]
    por_que: list[str] = Field(description="Plantillas con datos calculados, nunca LLM")


class LineaGeo(BaseModel):
    type: Literal["LineString"]
    coordinates: list[list[float]] = Field(description="[[lng, lat], …]")


class ResumenRuta(BaseModel):
    barrial_pct: float
    cadenas: int
    paradas_impulso: int = Field(description="Paradas en hexágonos de impulso ≥ p70")


class RutaResponse(BaseModel):
    paradas: list[Parada]
    geometria: LineaGeo
    distancia_m: float
    minutos: float
    metodo: Literal["mapbox", "linea_recta"]
    aviso: str | None = Field(default=None, description="p. ej. 'Sin red: líneas rectas'")
    resumen: ResumenRuta
    sin_resultado: list[str]
    demo_data: bool


# POST /api/eventos
class EventoRequest(BaseModel):
    tipo: TipoEvento
    negocio_id: str | None = None
    h3: str | None = None


# POST /api/altas
class AltaRequest(BaseModel):
    ficha: Ficha
    lat: float
    lng: float
    origen: OrigenAlta
    verificado_por: str | None = None
    consentimiento_publicar: bool


# GET /api/altas/live?desde=ts
class AltasLive(BaseModel):
    ts: float = Field(description="Hora del servidor; la UI la manda como `desde` en la siguiente pregunta")
    altas: list[Alta]
    altas_hoy: int


# GET /api/negocio/{id}
class AvanceDia(BaseModel):
    fecha: str
    apariciones_ruta: int
    busquedas: int
    compre_aqui: int
    vistas_pagina: int


class Avance(BaseModel):
    """Mi avance (privado), últimos 7 días."""

    dias: list[AvanceDia]
    apariciones_ruta: Cifra
    busquedas: Cifra
    compre_aqui: Cifra
    vistas_pagina: Cifra
    promedio_zona_apariciones: Cifra
    tipo_dato: TipoDato


class Escalon(BaseModel):
    numero: Literal[1, 2, 3, 4]
    nombre: str = Field(description="Visible · Cobro digital · Historial · Crédito")
    estado: Literal["logrado", "siguiente", "proximamente", "horizonte"]
    beneficio: str
    siguiente_accion: str | None = None


class ProgramaNegocio(Programa):
    puede_entrar: bool | None = None
    motivo: str | None = None


class Pagina(BaseModel):
    slug: str
    url: str = Field(description="/n/{slug}")
    cartel_url: str = Field(description="/n/{slug}/cartel")
    qr_data_uri: str | None = Field(default=None, description="data:image/png;base64,…")


class NegocioDetalle(BaseModel):
    id: str
    origen: Literal["denue", "alta", "tianguis"]
    ficha: Ficha
    lat: float
    lng: float
    h3: str
    alcaldia_cvegeo: str | None = None
    avance: Avance
    escalera: list[Escalon] = Field(min_length=4, max_length=4)
    programas: list[ProgramaNegocio]
    pagina: Pagina | None = None


# GET /api/negocios?h3=&clase=
class NegociosResponse(BaseModel):
    negocios: list[Negocio]


# GET /api/sedeco/resumen
class SedecoResumen(BaseModel):
    dia: int = Field(ge=0, le=6)
    hora: str = Field(pattern=HORA)
    altas_hoy: Cifra
    poblacion_cubierta_pct: Cifra
    puntos_abiertos: Cifra
    rutas_por_hex: dict[str, int]
    rutas_tipo_dato: TipoDato


# GET /api/sedeco/crecimiento
class PuntoSerieTrimestral(BaseModel):
    cvegeo: str
    municipio: str
    trimestre: str
    transacciones_tpv: float
    tipo_dato: TipoDato


class AltasAnio(BaseModel):
    cvegeo: str
    anio: int
    altas: int
    tipo_dato: TipoDato


class RutasHex(BaseModel):
    h3: str
    rutas: int
    tipo_dato: TipoDato


class SedecoCrecimiento(BaseModel):
    serie_trimestral: list[PuntoSerieTrimestral]
    altas_denue_por_anio: list[AltasAnio]
    altas_plataforma_hoy: Cifra
    rutas_por_hex: list[RutasHex]
    alcaldias: list[str]
