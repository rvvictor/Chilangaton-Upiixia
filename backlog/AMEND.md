# Amended tasks (uak plan --amend)

Append-only; the last section of an ID replaces its section in the backlog. Why: Paths can grow before review.

## PB-021 · colonIA: marca, shell nuevo, landing como portada, fuentes y tzdata

- **Type:** feature
- **Priority:** P0
- **Estimate:** 30 min
- **Rubric / Spec:** C5 · C6 · dirección de arte "colonIA" (abajo, igual en todas las tareas de la ola 2)
- **Depends on:** None
- **Uses contract:** PB-029
- **Paths:** pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/.oxlintrc.json, web/.gitignore, web/public/, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance
- **Freeze-Allowed:** yes
- **Acceptance:**
  - El producto se llama **colonIA** (la "IA" en el color primario): `<title>`, favicon SVG nuevo (hexágono con "IA"), `FastAPI(title="colonIA")`, header del shell. Ni una mención a "Pulso Barrial" en web/ ni en app/main.py.
  - Agrega `@fontsource-variable/bricolage-grotesque` (display) y mantiene Geist (texto); `--font-display` y `--font-sans` en `@theme` de `index.css`.
  - Shell rediseñado con las skills `design-taste-frontend`, `redesign-existing-projects` y `stack-frontend`: barra superior fina y elegante (logo colonIA + navegación tipo píldoras: Inicio · SEDECO · Vecina · Negocio · Crecimiento), sticky, con blur; la vista activa con indicador animado (motion `layoutId`).
  - Ruta por defecto `#/inicio` (la landing, PB-023); las demás vistas siguen en sus hash.
  - Agrega `tzdata` a las dependencias de Python (la app no arranca en Windows sin él: `ZoneInfo("America/Mexico_City")`).
  - `bash .uak/bin/smoke` sale 0; capturas 1280×720 y 390×844 revisadas con el subagente `design-critic` (arregla sus P1).
- **Verify:** `bash .uak/bin/smoke`
- **Next step:** `npm --prefix web install @fontsource-variable/bricolage-grotesque` y `uv add tzdata`

## PB-022 · Vista Negocio rediseñada: el panel de Doña Lupe se ve como una app de verdad

- **Type:** feature
- **Priority:** P0
- **Estimate:** 40 min
- **Rubric / Spec:** C6 · C7 · dirección de arte "colonIA"
- **Depends on:** PB-020
- **Uses contract:** PB-029
- **Paths:** web/src/features/negocio/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Rediseño completo con `design-taste-frontend` + `redesign-existing-projects` + `stack-frontend` sobre lo que dejó PB-020 (sin perder funciones: selector con altas en vivo, ficha editable, avance, escalera, programas, generar página).
  - Encabezado tipo perfil (inicial grande, nombre, giro, chips de pago, "Acepta Mercomuna"); **escalera de barrio** como stepper visual de 4 escalones con el actual resaltado; avance de 7 días con mini-gráfica y su `Etiqueta` simulado/real; programas como tarjetas con su estado.
  - Botón "Generar mi página" con vista previa en marco de celular y QR.
  - Usable por una persona mayor: texto ≥ 18 px, botones ≥ 48 px, contraste AA; responsivo a 390 px.
  - `npm --prefix web run build` sale 0; capturas 1280×720 y 390×844 aprobadas por `design-critic`.
- **Verify:** `npm --prefix web run build`
- **Next step:** capturar la vista actual con la skill `webapp-testing` y auditarla con `redesign-existing-projects`
## PB-031 · Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada (follow-up of PB-002)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-002
- **Follow-up of:** PB-002
- **Paths:** app/schemas/, app/fixtures/, web/src/lib/types.ts, app/tests/test_schemas.py, pipeline/negocios/programas.py, data/processed/programas.json, data/fuentes/negocios.md
- **Freeze-Allowed:** no
- **Acceptance:**
  - Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada
- **Verify:** `uv run pytest -q app/tests/test_schemas.py`
## PB-030 · Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0 (follow-up of PB-001)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-001
- **Follow-up of:** PB-001
- **Paths:** docs/notas/pb-030.md
- **Freeze-Allowed:** no
- **Acceptance:**
  - Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0 (ya en main: web/src/index.css:6, entró con PB-021)
- **Verify:** `grep -q 'mapbox-gl.css" layer(components)' web/src/index.css`
