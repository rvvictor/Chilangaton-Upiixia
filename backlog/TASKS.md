# Backlog published on claims (uak plan)

Append-only; added to .uak/TASKS.md from main. Why: adding tasks never waits for a PR.

## PB-017 · Bolsa de poco movimiento junto a la sede: la ruta de la demo muestra paradas en zonas que necesitan clientes (follow-up of PB-004)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-004
- **Follow-up of:** PB-004
- **Paths:** pipeline/__init__.py, pipeline/geo/, pipeline/tests/__init__.py, pipeline/tests/test_geo.py, data/processed/hex.geojson, data/processed/tianguis_abierto.json, data/processed/cnbv_tpv_municipios.json, data/fuentes/geo.md
- **Freeze-Allowed:** no
- **Acceptance:**
  - Bolsa de poco movimiento junto a la sede: la ruta de la demo muestra paradas en zonas que necesitan clientes
- **Verify:** `uv run pytest -q pipeline/tests/test_geo.py`
