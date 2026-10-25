"""PB-002: every fixture validates against its model, and the fixtures agree with each other."""

import json

import h3
import pytest

from app import schemas as S
from app.config import FIXTURES_DIR

FIXTURES = {
    "health.json": S.Health,
    "hex.json": S.HexagonoColeccion,
    "dinero_alcaldias.json": list[S.DineroAlcaldia],
    "tianguis_abierto.json": list[S.PuntoBarrial],
    "tianguis.json": S.TianguisResponse,
    "negocios.json": S.NegociosResponse,
    "articulos_interpretar.json": S.ArticulosResponse,
    "ruta_request.json": S.RutaRequest,
    "ruta.json": S.RutaResponse,
    "evento_request.json": S.EventoRequest,
    "ficha_dona_lupe.json": S.Ficha,
    "alta_request.json": S.AltaRequest,
    "altas_live.json": S.AltasLive,
    "negocio_detalle.json": S.NegocioDetalle,
    "pagina.json": S.Pagina,
    "sedeco_resumen.json": S.SedecoResumen,
    "sedeco_crecimiento.json": S.SedecoCrecimiento,
}


def load(name):
    return json.loads((FIXTURES_DIR / name).read_text(encoding="utf-8"))


def parse(name):
    from pydantic import TypeAdapter

    return TypeAdapter(FIXTURES[name]).validate_python(load(name))


@pytest.mark.parametrize("name", sorted(FIXTURES))
def test_fixture_validates(name):
    assert (FIXTURES_DIR / name).is_file(), f"missing fixture {name}"
    parse(name)


def test_hex_fixture_is_real_h3_geojson():
    hexes = parse("hex.json").features
    assert len(hexes) >= 30
    for f in hexes:
        p = f.properties
        assert h3.is_valid_cell(p.h3) and h3.get_resolution(p.h3) == 9
        anillo = f.geometry.coordinates[0]
        assert anillo[0] == anillo[-1], "ring must be closed"
        lng, lat = anillo[0]
        assert -100 < lng < -98 and 19 < lat < 20, "GeoJSON order is [lng, lat]"
        if p.oculto:
            assert p.actividad_tpv_est is None and p.monto_est is None
        assert p.tipo_campos["actividad_tpv_est"] == "estimado"
    assert any(f.properties.oculto for f in hexes)


def test_more_tianguis_open_on_sunday_than_tuesday():
    puntos = parse("tianguis_abierto.json")
    assert len(puntos) >= 8
    domingo = sum(p.abierto_en(0, "10:00") for p in puntos)
    martes = sum(p.abierto_en(2, "10:00") for p in puntos)
    assert domingo > martes
    resp = parse("tianguis.json")
    assert len(resp.abiertos) == domingo and len(resp.abiertos) + len(resp.cerrados_ids) == resp.total


def test_ruta_fixture_is_barrial_and_consistent():
    ruta = parse("ruta.json")
    negocios = {n.id: n for n in parse("negocios.json").negocios}
    assert len(negocios) >= 20
    assert 4 <= len(ruta.paradas) <= 6
    assert all(p.negocio.es_barrial for p in ruta.paradas)
    assert ruta.resumen.cadenas == 0 and ruta.sin_resultado
    for p in ruta.paradas:
        if p.negocio.tipo == "negocio":
            assert negocios[p.negocio.id].es_barrial
    chains = [n for n in negocios.values() if not n.es_barrial]
    assert chains and all(n.motivo_exclusion for n in chains)


def test_dona_lupe_is_the_same_everywhere():
    alta = parse("altas_live.json").altas[0]
    detalle = parse("negocio_detalle.json")
    ruta_ids = {p.negocio.id for p in parse("ruta.json").paradas}
    assert alta.id == detalle.id == "alta-dona-lupe"
    assert alta.id in ruta_ids
    assert alta.ficha == detalle.ficha == parse("ficha_dona_lupe.json")
    assert [e.numero for e in detalle.escalera] == [1, 2, 3, 4]


def test_contract_day_convention():
    assert S.dia_desde_weekday(6) == 0  # date.weekday() Sunday → 0
    assert S.dia_desde_weekday(0) == 1  # Monday → 1
