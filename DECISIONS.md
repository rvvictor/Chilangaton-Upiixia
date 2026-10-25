# DECISIONS

Coordination decisions on the claims branch.
Why: a reversible option after 15 min keeps work moving.
- 1792951459 | plan --amend | victor/victor-1 | amended: PB-001 Paths: pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/eslint.config.js, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance → pyproject.toml, uv.lock, .python-version, app/__init__.py, app/main.py, app/config.py, app/routers/__init__.py, app/services/__init__.py, app/tests/__init__.py, app/tests/test_health.py, web/package.json, web/package-lock.json, web/index.html, web/vite.config.ts, web/tsconfig.json, web/tsconfig.app.json, web/tsconfig.node.json, web/.oxlintrc.json, web/.gitignore, web/public/, web/src/App.tsx, web/src/main.tsx, web/src/index.css, web/src/vite-env.d.ts, web/src/lib/api.ts, .env.example, .gitignore, .uak/bin/smoke-project, .uak/bin/.smoke-project.provenance; | Why: scope or criteria fixed before review
- 1792952321 | PB-003 | single direction from Appendix D; TipoDato local until PB-002 types land | Why: no time for 3 directions per task criteria
- 1792952724 | PB-006 | prefijo /api; dias 0=lunes | Why: contrato Apendice C y pipeline.geo
- 1792952736 | PB-008 | respaldo Doña Lupe sin llave | Why: demo sin red
- 1792953436 | PB-012 | local ui/tipos until PB-002/003 land; normalizer accepts both API shapes | Why: PB-002/003 not on main
- 1792953484 | PB-014 | local types/components until PB-002/003 land | Why: not on main
- 1792954283 | deadline lease/PB-002/1792954253 | REQUIRES_RECOVERY | Claim kept; read the summary and use release --expired --read-summary. No work is deleted.
- 1792954256 | PB-003 | squash-merge by a human on GitHub, no uak merge | Why: branch commit 973d53e has an unwanted Co-Authored-By trailer; force-push blocked and not wanted
- 1792954383 | PB-017 | follow-up of PB-004 by yojan-1: Bolsa de poco movimiento junto a la sede: la ruta de la demo muestra paradas en zonas que necesitan clientes | Why: same Paths, no scope change
- 1792954667 | PB-018 | follow-up of PB-008 by yojan-2: Doña Lupe en la ruta de la vecina: alta junto a la sede de la vista Vecina y horario hasta las 20:00 | Why: same Paths, no scope change
- 1792955402 | PB-019 | follow-up of PB-007 by yojan-2: Altas sin h3 en la ruta: derivarlo de lat/lng para que su impulso cuente | Why: same Paths, no scope change
- 1792955726 | PB-020 | follow-up of PB-012 by yojan-2: Selector de Negocio: altas en vivo primero y id real de Doña Lupe | Why: same Paths, no scope change
- 1792956122 | PB-021 | follow-up of PB-001 by cris-1: tzdata: la app no arranca en Windows (ZoneInfo America/Mexico_City) | Why: same Paths, no scope change
- 1792956331 | PB-022 | follow-up of PB-012 by alexis-1: Vista Negocio usa el id real del alta de Doña Lupe y lista altas en vivo | Why: same Paths, no scope change
- 1792956839 | plan | victor/victor | tasks added: PB-029 PB-023 PB-024 PB-025 PB-026 PB-027 PB-028 | Why: backlog without PR (Plan-Channel: claims)
- 1792956842 | plan --amend | victor/victor | amended: PB-021 PB-022 | Why: scope or criteria fixed before review
- 1792956874 | PB-030 | follow-up of PB-001 by yojan-2: Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0 | Why: same Paths, no scope change
- 1792957122 | deadline lease/PB-017/1792957101 | REQUIRES_RECOVERY | Claim kept; read the summary and use release --expired --read-summary. No work is deleted.
- 1792958055 | PB-030 | se integra dentro de PB-021 (mismos Paths, Freeze-Allowed yes) | Why: PB-030 no es Freeze-Allowed y bloquea PB-021
- 1792958269 | deadline freeze/event/1792958220 | FREEZE_DEMO_FIXES_ONLY | New claims only with Freeze-Allowed: yes; respect authorization.
- 1792958368 | allow | JoahanMorales | freeze exception: PB-017 | Why: La ruta de la demo pasa por zonas que necesitan clientes (5/5 paradas)
- 1792958662 | PB-031 | follow-up of PB-002 by victor-2: Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada | Why: same Paths, no scope change
- 1792958669 | allow | victor | freeze exception: PB-031 | Why: Victor autorizó regenerar el fixture de crecimiento con el nombre colonIA después del freeze
- 1792958845 | plan --amend | victor/victor | amended: PB-031 Paths: app/schemas/, app/fixtures/, web/src/lib/types.ts, app/tests/test_schemas.py → app/schemas/, app/fixtures/, web/src/lib/types.ts, app/tests/test_schemas.py, pipeline/negocios/programas.py, data/processed/programas.json, data/fuentes/negocios.md; | Why: scope or criteria fixed before review
- 1792959211 | PB-032 | follow-up of PB-008 by yojan-2: Nombre del puesto cuando la persona no lo dice: nunca 'Puesto de la persona' | Why: same Paths, no scope change
- 1792959246 | PB-033 | follow-up of PB-026 by yojan-1: Barras de Crecimiento: etiquetas del último año sin encimarse | Why: same Paths, no scope change
- 1792959283 | allow | JoahanMorales | freeze exception: PB-032 PB-033 | Why: PB-032: el bot nombraba 'Puesto de la persona' si no dicen nombre; PB-033: etiquetas encimadas en Crecimiento
- 1792960746 | PB-034 | follow-up of PB-006 by alexis-2: Altas hoy de demo salen como simulado en /api/sedeco/resumen | Why: same Paths, no scope change
- 1792960806 | PB-027 | re-claim para registrar worktree local | Why: el claim apuntaba a /c/ (Windows de saus)
- 1792961253 | allow | Alexis | freeze exception: PB-034 | Why: dato simulado de altas hoy aparece como real en SEDECO
