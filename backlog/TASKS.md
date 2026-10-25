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

## PB-018 · Doña Lupe en la ruta de la vecina: alta junto a la sede de la vista Vecina y horario hasta las 20:00 (follow-up of PB-008)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-008
- **Follow-up of:** PB-008
- **Paths:** app/bot/, app/routers/altas.py, app/services/altas.py, app/tests/test_altas.py, scripts/simular_alta.py
- **Freeze-Allowed:** no
- **Acceptance:**
  - Doña Lupe en la ruta de la vecina: alta junto a la sede de la vista Vecina y horario hasta las 20:00
- **Verify:** `uv run pytest -q app/tests/test_altas.py`

## PB-019 · Altas sin h3 en la ruta: derivarlo de lat/lng para que su impulso cuente (follow-up of PB-007)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-007
- **Follow-up of:** PB-007
- **Paths:** app/routers/ruta.py, app/services/ruta.py, app/services/articulos.py, app/services/mapbox.py, app/routers/eventos.py, app/services/eventos.py, app/tests/test_ruta.py
- **Freeze-Allowed:** no
- **Acceptance:**
  - Altas sin h3 en la ruta: derivarlo de lat/lng para que su impulso cuente
- **Verify:** `uv run pytest -q app/tests/test_ruta.py`

## PB-020 · Selector de Negocio: altas en vivo primero y id real de Doña Lupe (follow-up of PB-012)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-012
- **Follow-up of:** PB-012
- **Paths:** web/src/features/negocio/
- **Freeze-Allowed:** no
- **Acceptance:**
  - Selector de Negocio: altas en vivo primero y id real de Doña Lupe
- **Verify:** `npm --prefix web run build`

## PB-021 · tzdata: la app no arranca en Windows (ZoneInfo America/Mexico_City) (follow-up of PB-001)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-001
- **Follow-up of:** PB-001
- **Paths:** pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/.oxlintrc.json, web/.gitignore, web/public/, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance
- **Freeze-Allowed:** no
- **Acceptance:**
  - tzdata: la app no arranca en Windows (ZoneInfo America/Mexico_City)
- **Verify:** `bash .uak/bin/smoke`
