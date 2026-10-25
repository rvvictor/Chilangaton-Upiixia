"""Entidades de datos (IDEA.md §6). Espejo en web/src/lib/types.ts con los mismos nombres de campo.

Convenciones del contrato:
- `dias`: 0 = domingo, 1 = lunes … 6 = sábado (NO es `date.weekday()`, que empieza en lunes).
- Horas `abre` / `cierra` / `hora`: texto "HH:MM" de 24 h, hora de la CDMX.
- Toda cifra visible viaja con `tipo_dato` (o `tipo_campos` en el hexágono) y la UI la muestra.
"""

from typing import Literal

from pydantic import BaseModel, Field

TipoDato = Literal["real", "estimado", "simulado"]
FormaPago = Literal["efectivo", "transferencia", "dimo", "codi", "tarjeta"]
TipoPunto = Literal["tianguis", "mercado", "puesto", "concentracion"]
TipoEvento = Literal["busqueda", "aparicion_ruta", "compre_aqui", "vista_pagina", "alta"]
OrigenAlta = Literal["telegram", "campo", "demo"]
EstadoPrograma = Literal["existe", "por_verificar", "propuesta"]

HORA = r"^([01]\d|2[0-3]):[0-5]\d$"


def dia_desde_weekday(weekday: int) -> int:
    """Convierte `date.weekday()` (0 = lunes) a la convención del contrato (0 = domingo)."""
    return (weekday + 1) % 7


class Cifra(BaseModel):
    """Un número que se muestra en pantalla, con su etiqueta y su fuente."""

    valor: float | int | None
    tipo_dato: TipoDato
    fuente: str | None = None
    periodo: str | None = None


class LatLng(BaseModel):
    lat: float
    lng: float


class PuntoBarrial(BaseModel):
    """Tianguis Abierto v0.1: tianguis, mercado o puesto (`tianguis_abierto.json`)."""

    id: str
    tipo: TipoPunto
    nombre: str
    alcaldia_cvegeo: str
    colonia: str | None = None
    lat: float
    lng: float
    h3: str
    dias: list[int] = Field(description="0 = domingo … 6 = sábado")
    abre: str = Field(pattern=HORA)
    cierra: str = Field(pattern=HORA)
    horario_supuesto: bool = False
    giros: list[str] = []
    productos: list[str] = []
    formas_pago: list[FormaPago] = []
    acepta_mercomuna: bool | None = None
    fuente: str
    fecha_verificacion: str | None = None
    verificado_por: str | None = None
    tipo_dato: TipoDato

    def abierto_en(self, dia: int, hora: str) -> bool:
        """A.4: abierto si `dia ∈ dias` y `abre ≤ hora < cierra`."""
        return dia in self.dias and self.abre <= hora < self.cierra


class Negocio(BaseModel):
    """Establecimiento tipo DENUE (`negocios.json`). Sin datos personales."""

    id: str
    clee: str | None = None
    nombre: str
    razon_social: str | None = None
    clase_scian: str
    clase_nombre: str
    estrato: str
    tipo_establecimiento: str | None = None
    lat: float
    lng: float
    h3: str
    alcaldia_cvegeo: str
    colonia: str | None = None
    fecha_alta_denue: str | None = None
    es_barrial: bool
    motivo_exclusion: Literal["giro", "tamano", "nombre", "repeticion"] | None = None
    formas_pago: list[FormaPago] = []
    acepta_mercomuna: bool | None = None
    tipo_dato: TipoDato


class HexagonoProps(BaseModel):
    """Propiedades de un hexágono H3 res 9. Si `oculto`, las cifras de dinero van en null."""

    h3: str
    alcaldia_cvegeo: str
    poblacion: int
    negocios_barriales: int
    negocios_total: int
    actividad_tpv_est: float | None
    monto_est: float | None = None
    impulso: float = Field(ge=0, le=1)
    cluster_id: str | None = None
    oculto: bool
    tipo_campos: dict[str, TipoDato]
    periodo_cnbv: str


class PoligonoGeo(BaseModel):
    type: Literal["Polygon"]
    coordinates: list[list[list[float]]] = Field(description="[[[lng, lat], …]] anillo cerrado")


class Hexagono(BaseModel):
    """Feature GeoJSON de `hex.geojson`."""

    type: Literal["Feature"]
    geometry: PoligonoGeo
    properties: HexagonoProps


class HexagonoColeccion(BaseModel):
    type: Literal["FeatureCollection"]
    features: list[Hexagono]


class DineroAlcaldia(BaseModel):
    """CNBV, Bases de Datos de Inclusión Financiera (`cnbv_tpv_municipios.json`)."""

    cvegeo: str
    municipio: str
    trimestre: str
    transacciones_tpv: float
    monto_tpv: float | None = None
    adultos: int
    tpv_por_adulto: float
    fuente_url: str
    fecha_descarga: str
    tipo_dato: TipoDato


class Articulo(BaseModel):
    """Entrada del diccionario artículo → giro (`articulo_giro.json`)."""

    articulo: str
    sinonimos: list[str] = []
    clases_scian: list[str]
    categoria_ui: str


class Programa(BaseModel):
    """Programa público o propuesta (`programas.json`)."""

    id: str
    nombre: str
    que_es: str
    para_quien: str
    como_entrar: str
    url_oficial: str | None = None
    estado: EstadoPrograma
    fecha_verificacion: str | None = None


class Producto(BaseModel):
    nombre: str
    precio: float | None = None
    unidad: str | None = None


class Ficha(BaseModel):
    """Ficha del comerciante (salida estructurada del bot, A.8). El comerciante la confirma antes de publicar."""

    nombre: str
    tipo: TipoPunto = "puesto"
    clase_scian: str
    clase_nombre: str | None = None
    descripcion: str | None = Field(default=None, max_length=280)
    productos: list[Producto] = []
    dias: list[int] = Field(default=[], description="0 = domingo … 6 = sábado")
    abre: str | None = Field(default=None, pattern=HORA)
    cierra: str | None = Field(default=None, pattern=HORA)
    formas_pago: list[FormaPago] = []
    acepta_mercomuna: bool | None = None
    whatsapp: str | None = Field(default=None, description="Solo si el comerciante lo dio para su ficha")
    colonia: str | None = None
    tianguis_id: str | None = None


class Alta(BaseModel):
    """Alta en vivo (`data/live/altas.jsonl`)."""

    id: str
    slug: str
    ts: float
    ficha: Ficha
    lat: float
    lng: float
    h3: str
    alcaldia_cvegeo: str | None = None
    origen: OrigenAlta
    verificado_por: str | None = None
    consentimiento_publicar: bool
    demo_data: bool


class Evento(BaseModel):
    """Evento de plataforma (`data/live/eventos.jsonl`)."""

    ts: float
    tipo: TipoEvento
    negocio_id: str | None = None
    h3: str | None = None
    demo_data: bool
