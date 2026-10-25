"""Genera los datos simulados de la zona de demo (IDEA.md §6 y Apéndice A.1-A.4).

Todo es simulado (semilla fija) salvo las filas leídas de
data/campo/tianguis_verificados.csv, que salen con tipo_dato "real".
"""

from __future__ import annotations

import csv
import json
import math
import random
from bisect import bisect_right
from collections import deque
from pathlib import Path

import h3

from .zonas import ALCALDIAS, POLIGONOS

SEMILLA = 20261025
RES = 9
PERIODO_CNBV = "2023-T2"  # Placeholder del trimestre; sustituir por el último real de la CNBV.
TIANGUIS_TOTAL = 60
TIANGUIS_POR_ALCALDIA = {"09003": 24, "09007": 36}
TICKET_SIMULADO = 300  # Pesos por transacción, simulado.
UMBRAL_CLUSTER = 8  # negocios_barriales mínimo para entrar a un cluster (A.10).
UMBRAL_OCULTO = 3  # negocios_total por debajo de esto, el hexágono se oculta.
FUENTE_SIMULADA = "Simulado (pipeline.geo, semilla fija); no es levantamiento de campo"

RAIZ = Path(__file__).resolve().parents[2]
SALIDA_DEFAULT = RAIZ / "data" / "processed"
CAMPO_DEFAULT = RAIZ / "data" / "campo" / "tianguis_verificados.csv"

COLONIAS = {
    "09003": [
        "Del Carmen", "Santa Úrsula", "Pedregal de Santo Domingo", "Ajusco",
        "Xotepingo", "Los Reyes", "Copilco", "Viveros", "Culhuacán CTM",
        "Santa Catarina", "Carrasco", "Covadonga", "Villa Coapa", "Huipulco",
        "Campestre Churubusco", "Pueblo de Los Reyes", "Acuilotla", "Ex Hacienda Coapa",
    ],
    "09007": [
        "Santa Martha", "Ejército de Oriente", "Paraje San Juan", "Reforma Política",
        "Desarrollo Quetzalcóatl", "Vicente Guerrero", "Consejo Agrarista", "San Lorenzo Tezonco",
        "Renovación", "Citlalli", "Santa Cruz Meyehualco", "Ermita Zaragoza", "Lomas Estrella",
        "Juventino Rosas", "Puente Blanco", "Minas de Cristo", "Tepalcates", "El Manto",
        "Cerro de la Estrella", "Sinatel", "San Juanico", "Desarrollo Urbano Quetzalcóatl",
    ],
}
GIROS = [
    "abarrotes", "tortillería", "fonda", "frutas y verduras", "carnicería", "pollería",
    "papelería", "recaudería", "zapatería", "ferretería", "farmacia", "nevería",
    "estética", "panadería", "mercería", "florería",
]
PRODUCTOS = [
    "jitomate", "bolillo", "chiles secos", "tortilla", "huevo", "aceite", "pilas",
    "recarga", "jabón", "refresco", "pan dulce", "nopales", "limón", "cuadernos",
    "tenis", "clavos", "café", "frijol", "queso", "arroz", "elote", "aguacate",
]


# ---------------------------------------------------------------- geometría

def _en_poligono(lat: float, lng: float, poli: list[tuple[float, float]]) -> bool:
    """Punto dentro de polígono por regla de cruces (x = lng, y = lat)."""
    dentro = False
    j = len(poli) - 1
    for i in range(len(poli)):
        yi, xi = poli[i]
        yj, xj = poli[j]
        if (yi > lat) != (yj > lat):
            x_cruce = xi + (lat - yi) * (xj - xi) / (yj - yi)
            if lng < x_cruce:
                dentro = not dentro
        j = i
    return dentro


def _muestra_en_poligono(rng: random.Random, poli: list[tuple[float, float]]) -> tuple[float, float]:
    lats = [p[0] for p in poli]
    lngs = [p[1] for p in poli]
    while True:
        lat = rng.uniform(min(lats), max(lats))
        lng = rng.uniform(min(lngs), max(lngs))
        if _en_poligono(lat, lng, poli):
            return lat, lng


def _centroide(poli: list[tuple[float, float]]) -> tuple[float, float]:
    return sum(p[0] for p in poli) / len(poli), sum(p[1] for p in poli) / len(poli)


def _km_entre(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    dy = (lat2 - lat1) * 111.0
    dx = (lng2 - lng1) * 111.0 * math.cos(math.radians((lat1 + lat2) / 2))
    return math.hypot(dx, dy)


def _celdas_por_alcaldia() -> dict[str, str]:
    """Hexágono res 9 -> cvegeo. Un hexágono va a la primera alcaldía que lo contiene."""
    asignacion: dict[str, str] = {}
    for cvegeo in ALCALDIAS:  # orden de inserción: determinista
        celdas = h3.geo_to_cells(h3.LatLngPoly(POLIGONOS[cvegeo]), RES)
        for celda in sorted(celdas):
            asignacion.setdefault(celda, cvegeo)
    return asignacion


def _clusters(barriales: dict[str, int]) -> dict[str, int]:
    """Componentes conexas por vecinos H3 entre hexágonos con >= UMBRAL_CLUSTER negocios barriales."""
    candidatos = {h for h, n in barriales.items() if n >= UMBRAL_CLUSTER}
    asignados: dict[str, int] = {}
    siguiente = 1
    for inicio in sorted(candidatos):
        if inicio in asignados:
            continue
        asignados[inicio] = siguiente
        cola = deque([inicio])
        while cola:
            actual = cola.popleft()
            for vecino in h3.grid_disk(actual, 1):
                if vecino != actual and vecino in candidatos and vecino not in asignados:
                    asignados[vecino] = siguiente
                    cola.append(vecino)
        siguiente += 1
    return asignados


# ---------------------------------------------------------------- hexágonos

def _hexagonos() -> list[dict]:
    rng = random.Random(SEMILLA)
    asignacion = _celdas_por_alcaldia()
    hexes: list[dict] = []
    for cvegeo in ALCALDIAS:
        cfg = ALCALDIAS[cvegeo]
        celdas = sorted(c for c, a in asignacion.items() if a == cvegeo)
        cx, cy = _centroide(POLIGONOS[cvegeo])

        # Población: pesos lognormales con más densidad hacia el centro.
        pesos = []
        for celda in celdas:
            lat, lng = h3.cell_to_latlng(celda)
            d = _km_entre(lat, lng, cx, cy)
            pesos.append(rng.lognormvariate(0.0, 0.5) * (0.4 + math.exp(-d / 3.0)))
        suma_pesos = sum(pesos)
        pobs = [round(cfg["poblacion_total"] * p / suma_pesos) for p in pesos]
        pobs[pobs.index(max(pobs))] += cfg["poblacion_total"] - sum(pobs)

        for celda, pob in zip(celdas, pobs):
            total = round(pob / cfg["personas_por_negocio"] * rng.uniform(0.6, 1.4))
            barriales = min(total, round(total * rng.uniform(0.80, 0.97)))
            hexes.append({
                "h3": celda,
                "alcaldia_cvegeo": cvegeo,
                "poblacion": int(pob),
                "negocios_total": int(total),
                "negocios_barriales": int(barriales),
                "_peso_act": total * rng.uniform(0.6, 1.4),
            })

    # Actividad TPV: reparto del total de la alcaldía proporcional al peso (A.2 simplificado).
    for cvegeo in ALCALDIAS:
        grupo = [h for h in hexes if h["alcaldia_cvegeo"] == cvegeo]
        suma = sum(h["_peso_act"] for h in grupo)
        total_t = ALCALDIAS[cvegeo]["transacciones_tpv"]
        for h in grupo:
            h["actividad_tpv_est"] = round(total_t * h["_peso_act"] / suma, 1) if suma else 0.0
        if suma:
            diferencia = round(total_t - sum(h["actividad_tpv_est"] for h in grupo), 1)
            max(grupo, key=lambda h: h["actividad_tpv_est"])["actividad_tpv_est"] += diferencia

    # Índice de impulso (A.3): percentiles sobre toda la zona de demo.
    pobs_ord = sorted(h["poblacion"] for h in hexes)
    acts_ord = sorted(h["actividad_tpv_est"] for h in hexes)
    n = len(hexes)
    for h in hexes:
        rank_pob = bisect_right(pobs_ord, h["poblacion"]) / n
        rank_act = bisect_right(acts_ord, h["actividad_tpv_est"]) / n
        h["impulso"] = round(rank_pob * (1 - rank_act), 4) if h["negocios_barriales"] >= 1 else 0.0
        h["oculto"] = h["negocios_total"] < UMBRAL_OCULTO

    mapa_cluster = _clusters({h["h3"]: h["negocios_barriales"] for h in hexes})
    for h in hexes:
        h["cluster_id"] = mapa_cluster.get(h["h3"])
        h.pop("_peso_act")
        h["monto_est"] = None
    return sorted(hexes, key=lambda h: h["h3"])


def _feature(h: dict) -> dict:
    limites = h3.cell_to_boundary(h["h3"])  # (lat, lng)
    anillo = [[round(lng, 6), round(lat, 6)] for lat, lng in limites]
    anillo.append(anillo[0])
    propiedades = {
        "h3": h["h3"],
        "alcaldia_cvegeo": h["alcaldia_cvegeo"],
        "poblacion": h["poblacion"],
        "negocios_barriales": h["negocios_barriales"],
        "negocios_total": h["negocios_total"],
        "actividad_tpv_est": h["actividad_tpv_est"],
        "monto_est": h["monto_est"],
        "impulso": h["impulso"],
        "cluster_id": h["cluster_id"],
        "oculto": h["oculto"],
        "tipo_campos": {
            "poblacion": "simulado",
            "negocios_barriales": "simulado",
            "negocios_total": "simulado",
            "actividad_tpv_est": "simulado",
            "monto_est": "estimado",
            "impulso": "estimado",
            "cluster_id": "estimado",
            "oculto": "estimado",
        },
        "periodo_cnbv": PERIODO_CNBV,
    }
    return {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [anillo]},
            "properties": propiedades}


def hex_geojson(hexes: list[dict]) -> dict:
    return {
        "type": "FeatureCollection",
        "name": "hex",
        "meta": {
            "resolucion_h3": RES,
            "alcaldias": list(ALCALDIAS),
            "tipo_dato": "simulado",
            "nota": "Poligonos de alcaldias aproximados, escritos a mano; no son el Marco Geoestadistico.",
        },
        "features": [_feature(h) for h in hexes],
    }


# ---------------------------------------------------------------- tianguis y mercados

def _horas(tipo: str, rng: random.Random) -> tuple[str, str]:
    if tipo == "tianguis":
        return f"{rng.choice([6, 7]):02d}:00", f"{rng.choice([13, 14, 15]):02d}:00"
    return "07:00", rng.choice(["18:00", "19:00"])


def _punto_simulado(rng: random.Random, cvegeo: str, indice: int, colonias: list[str]) -> dict:
    lat, lng = _muestra_en_poligono(rng, POLIGONOS[cvegeo])
    tipo = "mercado" if rng.random() < 0.4 else "tianguis"
    dias = list(range(6)) if tipo == "mercado" else sorted(rng.sample(range(7), rng.choice([1, 2])))
    abre, cierra = _horas(tipo, rng)
    colonia = colonias[indice % len(colonias)]
    nombre = f"{'Mercado' if tipo == 'mercado' else 'Tianguis'} {colonia}"
    return {
        "id": f"sim-{cvegeo}-{indice + 1:02d}",
        "tipo": tipo,
        "nombre": nombre,
        "alcaldia_cvegeo": cvegeo,
        "colonia": colonia,
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "h3": h3.latlng_to_cell(lat, lng, RES),
        "dias": dias,
        "abre": abre,
        "cierra": cierra,
        "giros": rng.sample(GIROS, 3),
        "productos": rng.sample(PRODUCTOS, 4),
        "formas_pago": ["efectivo"] + (["CoDi"] if rng.random() < 0.5 else [])
        + (["tarjeta"] if rng.random() < 0.3 else []),
        "acepta_mercomuna": rng.random() < 0.35,
        "fuente": FUENTE_SIMULADA,
        "fecha_verificacion": None,
        "verificado_por": None,
        "tipo_dato": "simulado",
    }


def _separar(valor: str) -> list[str]:
    return [p.strip() for p in valor.replace("|", ";").replace(",", ";").split(";") if p.strip()]


def _leer_campo(ruta: Path | None) -> list[dict]:
    """Filas verificadas en campo (tipo_dato "real"). Sin archivo, no agrega nada."""
    if ruta is None or not ruta.exists():
        return []
    filas = []
    with ruta.open(encoding="utf-8", newline="") as f:
        for n, fila in enumerate(csv.DictReader(f), start=1):
            cvegeo = (fila.get("alcaldia_cvegeo") or "").strip()
            if cvegeo not in ALCALDIAS:
                raise ValueError(f"{ruta} fila {n}: alcaldia_cvegeo desconocida '{cvegeo}'")
            lat, lng = float(fila["lat"]), float(fila["lng"])
            dias = [int(d) for d in _separar(fila["dias"])]
            if not dias or any(d < 0 or d > 6 for d in dias):
                raise ValueError(f"{ruta} fila {n}: dias debe ser 0-6 (0 = lunes)")
            filas.append({
                "id": (fila.get("id") or f"real-{cvegeo}-{n:03d}").strip(),
                "tipo": (fila.get("tipo") or "tianguis").strip(),
                "nombre": fila["nombre"].strip(),
                "alcaldia_cvegeo": cvegeo,
                "colonia": (fila.get("colonia") or "").strip(),
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "h3": h3.latlng_to_cell(lat, lng, RES),
                "dias": sorted(set(dias)),
                "abre": fila["abre"].strip(),
                "cierra": fila["cierra"].strip(),
                "giros": _separar(fila.get("giros") or ""),
                "productos": _separar(fila.get("productos") or ""),
                "formas_pago": _separar(fila.get("formas_pago") or ""),
                "acepta_mercomuna": (fila.get("acepta_mercomuna") or "").strip().lower()
                in {"1", "si", "sí", "true", "x"},
                "fuente": (fila.get("fuente") or "Levantamiento de campo").strip(),
                "fecha_verificacion": (fila.get("fecha_verificacion") or None),
                "verificado_por": (fila.get("verificado_por") or None),
                "tipo_dato": "real",
            })
    return filas


def _tianguis(campo_csv: Path | None) -> list[dict]:
    reales = _leer_campo(campo_csv)
    rng = random.Random(SEMILLA + 1)
    puntos = list(reales)
    for cvegeo in ALCALDIAS:
        reales_zona = sum(1 for r in reales if r["alcaldia_cvegeo"] == cvegeo)
        faltan = max(0, TIANGUIS_POR_ALCALDIA[cvegeo] - reales_zona)
        colonias = list(COLONIAS[cvegeo])
        rng.shuffle(colonias)
        for i in range(faltan):
            puntos.append(_punto_simulado(rng, cvegeo, i, colonias))
    return sorted(puntos, key=lambda p: (p["alcaldia_cvegeo"], p["id"]))


# ---------------------------------------------------------------- CNBV simulado

def _cnbv() -> list[dict]:
    filas = []
    for cvegeo, cfg in ALCALDIAS.items():
        transacciones = cfg["transacciones_tpv"]
        filas.append({
            "cvegeo": cvegeo,
            "municipio": cfg["nombre"],
            "trimestre": PERIODO_CNBV,
            "transacciones_tpv": transacciones,
            "monto_tpv": transacciones * TICKET_SIMULADO,
            "adultos": cfg["adultos"],
            "tpv_por_adulto": round(transacciones / cfg["adultos"], 3),
            "fuente_url": None,
            "fecha_descarga": None,
            "tipo_dato": "simulado",
        })
    return filas


# ---------------------------------------------------------------- salida

def _escribir(ruta: Path, obj: object) -> None:
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
                    encoding="utf-8")


def build(salida: Path = SALIDA_DEFAULT, campo_csv: Path | None = CAMPO_DEFAULT) -> dict[str, Path]:
    """Escribe los 3 archivos de data/processed y devuelve sus rutas."""
    hexes = _hexagonos()
    rutas = {
        "hex": salida / "hex.geojson",
        "tianguis": salida / "tianguis_abierto.json",
        "cnbv": salida / "cnbv_tpv_municipios.json",
    }
    _escribir(rutas["hex"], hex_geojson(hexes))
    _escribir(rutas["tianguis"], _tianguis(campo_csv))
    _escribir(rutas["cnbv"], _cnbv())
    return rutas
