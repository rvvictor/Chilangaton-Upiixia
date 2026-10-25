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

## PB-022 · Vista Negocio usa el id real del alta de Doña Lupe y lista altas en vivo (follow-up of PB-012)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-012
- **Follow-up of:** PB-012
- **Paths:** web/src/features/negocio/
- **Freeze-Allowed:** no
- **Acceptance:**
  - Vista Negocio usa el id real del alta de Doña Lupe y lista altas en vivo
- **Verify:** `npm --prefix web run build`
## PB-029 · Sistema de diseño colonIA: tokens, componentes y mapa con la nueva dirección

- **Type:** contract
- **Priority:** P0
- **Estimate:** 30 min
- **Rubric / Spec:** C6 · dirección de arte de la ola 2
- **Depends on:** None
- **Uses contract:** None
- **Paths:** web/DESIGN.md, web/src/lib/ui/, web/src/lib/map/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - `tokens.css`: mismos nombres `--pb-*` con los valores de la dirección colonIA (así todas las vistas cambian solas), más `--pb-radio-*`, `--pb-sombra-*`, `--pb-hero-*` y las rampas del mapa recalculadas (impulso en cempasúchil→rosa, actividad en añil→jade), todas AA.
  - Componentes nuevos o mejorados en `web/src/lib/ui/`: `Boton` (primario rosa, secundario, fantasma, tamaños), `Tarjeta` (elevación, cabecera), `Chip`, `Etiqueta`, `Cifra` (número grande tabular + etiqueta + fuente, con contador animado), `Logo` (colonIA con "IA" en rosa), `PatronHex` (textura SVG de hexágonos para fondos), `Seccion`.
  - `MapaBase` con estilo de mapa más limpio (Mapbox `light-v11` con agua y parques atenuados, o `dark-v11` para el hero) y sin romper `onReady`.
  - `web/DESIGN.md` reescrito con la dirección colonIA.
  - Publica el contrato temprano: `uak msg all --kind contract` con los nombres de componentes y tokens en cuanto estén.
- **Verify:** `test -s web/DESIGN.md && npm --prefix web run build`
- **Next step:** reescribir `web/src/lib/ui/tokens.css` con la paleta colonIA

## PB-023 · Landing page de colonIA: la portada que gana el primer minuto del jurado

- **Type:** feature
- **Priority:** P0
- **Estimate:** 45 min
- **Rubric / Spec:** C3 · C5 · IDEA.md §1, §10, Apéndice G
- **Depends on:** None
- **Uses contract:** PB-029, PB-021
- **Paths:** web/src/features/inicio/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Vista `route = "inicio"`, `label = "Inicio"`, `order = 0`: una landing de nivel premio, en modo oscuro, con las skills `design-taste-frontend` y `frontend-design` si está disponible.
  - **Hero:** "colonIA" gigante + "La red viva de la economía de barrio", subtítulo de una línea (§1), dos CTA (Ver el mapa de SEDECO → `#/sedeco`, Armar mi ruta → `#/usuario`) y una visual viva: rejilla de hexágonos animada (SVG/canvas con h3-js o generada) que se "enciende" como el mapa.
  - **El problema en 3 cifras** con fuente visible (de IDEA.md §10: 1,367 tianguis sin mapa vivo · 6.7% de negocios vende en línea · −42.8% facturación de tienditas), contadores animados.
  - **Cómo funciona en 3 pasos** (SEDECO ve · la vecina compra · Doña Lupe aparece con una nota de voz), cada uno con mini-ilustración y link a su vista.
  - **Para quién:** SEDECO, vecinas, comerciantes, colectivos INJUVE. **Por qué ahora / triple hélice**, **Cómo escala** (16 alcaldías, costo casi cero) y cierre con CTA.
  - Sin cifras inventadas: lo simulado dice "simulado"; las cifras citadas llevan su fuente.
  - Responsiva (390 px impecable), `prefers-reduced-motion`, LCP rápido (sin imágenes pesadas; SVG y CSS).
  - `npm --prefix web run build` sale 0; capturas 1280×720 y 390×844 aprobadas por `design-critic`.
- **Verify:** `npm --prefix web run build`
- **Next step:** `web/src/features/inicio/index.tsx` con el hero y la rejilla de hexágonos

## PB-024 · Vista SEDECO rediseñada: tablero de gobierno con wow visual

- **Type:** feature
- **Priority:** P0
- **Estimate:** 40 min
- **Rubric / Spec:** C2 · C5 · IDEA.md §4 pasos 1, 2 y 6
- **Depends on:** None
- **Uses contract:** PB-029
- **Paths:** web/src/features/sedeco/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Rediseño con `redesign-existing-projects` + `design-taste-frontend` sin perder funciones (hexágonos 3D, capas, dato real, barra de días, tarjeta, altas en vivo).
  - Mapa a pantalla completa con panel flotante de vidrio (blur) a la derecha; KPIs grandes con `Cifra` (población cubierta, tianguis abiertos, altas hoy) que animan al cambiar el día; barra de días como segmented control grande; leyenda de rampa elegante.
  - Alta nueva: toast animado "Doña Lupe se sumó a la red" + punto que pulsa en rosa.
  - Cámara cinematográfica al entrar (flyTo con pitch 55°). 1280×720 sin scroll.
  - `npm --prefix web run build` sale 0; capturas aprobadas por `design-critic`.
- **Verify:** `npm --prefix web run build`
- **Next step:** capturar la vista actual con `webapp-testing` y auditarla

## PB-025 · Vista Vecina rediseñada: armar la ruta se siente como una app de consumo

- **Type:** feature
- **Priority:** P0
- **Estimate:** 40 min
- **Rubric / Spec:** C1 · C6 · IDEA.md §4 paso 3
- **Depends on:** None
- **Uses contract:** PB-029
- **Paths:** web/src/features/usuario/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Rediseño mobile-first (390 px impecable, 1280 en dos columnas) sin perder funciones (lista, ubicación, ruta, paradas, por qué, compré aquí, WhatsApp, sin resultado).
  - Entrada grande tipo buscador con chips de ejemplo tocables; mientras busca, esqueletos animados; resultado con resumen héroe ("0 cadenas · 1.8 km · 22 min") y paradas como timeline numerada con la línea de la ruta.
  - En el mapa: ruta con trazo rosa animado (line-dasharray progresivo), marcadores numerados y el alta de hoy destacada.
  - `npm --prefix web run build` sale 0; capturas aprobadas por `design-critic`.
- **Verify:** `npm --prefix web run build`
- **Next step:** capturar la vista actual con `webapp-testing` y auditarla

## PB-026 · Vista Crecimiento rediseñada: gráficas que cuentan la historia de escala

- **Type:** feature
- **Priority:** P1
- **Estimate:** 35 min
- **Rubric / Spec:** C8 · IDEA.md §4 paso 6
- **Depends on:** None
- **Uses contract:** PB-029
- **Paths:** web/src/features/crecimiento/
- **Freeze-Allowed:** yes
- **Acceptance:**
  - Rediseño con `design-taste-frontend` y la skill `dataviz` si está disponible: gráficas limpias (SVG propio, ejes mínimos, tooltips), KPIs con `Cifra`, cada serie con su `Etiqueta`.
  - Bloque "Cómo escala": mapa esquemático de las 16 alcaldías en hexágonos con las 2 activas encendidas y costo casi cero.
  - `npm --prefix web run build` sale 0; capturas aprobadas por `design-critic`.
- **Verify:** `npm --prefix web run build`
- **Next step:** capturar la vista actual con `webapp-testing` y auditarla

## PB-027 · Página web del negocio y cartel con la marca colonIA

- **Type:** feature
- **Priority:** P1
- **Estimate:** 30 min
- **Rubric / Spec:** C7 · IDEA.md A.9
- **Depends on:** None
- **Uses contract:** PB-029
- **Paths:** app/templates/, app/services/paginas.py
- **Freeze-Allowed:** yes
- **Acceptance:**
  - `/n/{slug}` rediseñada como mini-sitio móvil hermoso (CSS inline, sin dependencias): portada con el nombre del puesto, productos con precio en tarjetas, horario, formas de pago, botón WhatsApp, "Hecho con colonIA".
  - `/n/{slug}/cartel` imprimible en carta: QR enorme, "Aceptamos transferencia / DiMo", marca colonIA.
  - Ni una mención a "Pulso Barrial"; `uv run pytest -q app/tests/test_negocio.py` sigue en verde.
- **Verify:** `uv run pytest -q app/tests/test_negocio.py`
- **Next step:** `app/templates/pagina.html` con la dirección colonIA

## PB-028 · Bot de Telegram y textos del backend con el nombre colonIA

- **Type:** feature
- **Priority:** P1
- **Estimate:** 20 min
- **Rubric / Spec:** C5
- **Depends on:** PB-018
- **Uses contract:** None
- **Paths:** app/bot/, app/services/crecimiento.py, scripts/demo.sh
- **Freeze-Allowed:** yes
- **Acceptance:**
  - El bot se presenta como colonIA en `/start` y en sus respuestas (tono cálido y claro, emojis con mesura); ni una mención a "Pulso Barrial" en app/bot/, app/services/crecimiento.py ni scripts/demo.sh.
  - `uv run pytest -q app/tests/test_altas.py app/tests/test_crecimiento.py` en verde.
- **Verify:** `uv run pytest -q app/tests/test_altas.py app/tests/test_crecimiento.py`
- **Next step:** `grep -rn -i "pulso barrial" app/bot app/services/crecimiento.py scripts/demo.sh`

## PB-030 · Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0 (follow-up of PB-001)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-001
- **Follow-up of:** PB-001
- **Paths:** pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/.oxlintrc.json, web/.gitignore, web/public/, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance
- **Freeze-Allowed:** no
- **Acceptance:**
  - Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0
- **Verify:** `bash .uak/bin/smoke`

## PB-031 · Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada (follow-up of PB-002)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-002
- **Follow-up of:** PB-002
- **Paths:** app/schemas/, app/fixtures/, web/src/lib/types.ts, app/tests/test_schemas.py
- **Freeze-Allowed:** no
- **Acceptance:**
  - Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada
- **Verify:** `uv run pytest -q app/tests/test_schemas.py`

## PB-032 · Nombre del puesto cuando la persona no lo dice: nunca 'Puesto de la persona' (follow-up of PB-008)

- **Type:** follow-up
- **Priority:** P1
- **Depends on:** PB-008
- **Follow-up of:** PB-008
- **Paths:** app/bot/, app/routers/altas.py, app/services/altas.py, app/tests/test_altas.py, scripts/simular_alta.py
- **Freeze-Allowed:** no
- **Acceptance:**
  - Nombre del puesto cuando la persona no lo dice: nunca 'Puesto de la persona'
- **Verify:** `uv run pytest -q app/tests/test_altas.py`
