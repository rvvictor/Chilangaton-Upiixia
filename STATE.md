# STATE

Phase: feature freeze; authorized fixes, rehearsal and submission only
Updated: 1792959407
AVAILABLE: PB-030 
CLAIMED: PB-027 PB-033 
BLOCKED: -
REVIEW: PB-016 PB-022 PB-024 PB-025 PB-032 
INTEGRATED: (25; last 12) ... PB-014 PB-015 PB-017 PB-018 PB-019 PB-020 PB-021 PB-023 PB-026 PB-028 PB-029 PB-031 
CANCELLED: -

Claims (first 24; status --task ID shows detail):
PB-016 | REVIEW | saus-1 | until 1792971891
PB-022 | REVIEW | yojan-1 | until 1792973550
PB-024 | REVIEW | alexis-1 | until 1792973056
PB-025 | REVIEW | alexis-2 | until 1792972155
PB-027 | CLAIMED | saus-1 | until 1792961144
PB-032 | REVIEW | yojan-2 | until 1792973807
PB-033 | CLAIMED | yojan-1 | until 1792962010

Blockers: BLOCKED tasks; use status --task ID --summary.
Current decisions (last 5):
- 1792958669 | allow | victor | freeze exception: PB-031 | Why: Victor autorizó regenerar el fixture de crecimiento con el nombre colonIA después del freeze
- 1792958845 | plan --amend | victor/victor | amended: PB-031 Paths: app/schemas/, app/fixtures/, web/src/lib/types.ts, app/tests/test_schemas.py → app/schemas/, app/fixtures/, w
- 1792959211 | PB-032 | follow-up of PB-008 by yojan-2: Nombre del puesto cuando la persona no lo dice: nunca 'Puesto de la persona' | Why: same Paths, no scope change
- 1792959246 | PB-033 | follow-up of PB-026 by yojan-1: Barras de Crecimiento: etiquetas del último año sin encimarse | Why: same Paths, no scope change
- 1792959283 | allow | JoahanMorales | freeze exception: PB-032 PB-033 | Why: PB-032: el bot nombraba 'Puesto de la persona' si no dicen nombre; PB-033: etiquetas encimadas en Crec

Global next step: available P0; else review PRs, tests, demo, rehearsal.
Why: bounded snapshot to resume without rereading history.
