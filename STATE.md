# STATE

Phase: feature freeze; authorized fixes, rehearsal and submission only
Updated: 1792958444
AVAILABLE: PB-031 PB-030 
CLAIMED: PB-027 
BLOCKED: -
REVIEW: PB-016 PB-021 PB-022 PB-024 PB-025 PB-028 
INTEGRATED: (22; last 12) ... PB-011 PB-012 PB-013 PB-014 PB-015 PB-017 PB-018 PB-019 PB-020 PB-023 PB-026 PB-029 
CANCELLED: -

Claims (first 24; status --task ID shows detail):
PB-016 | REVIEW | saus-1 | until 1792971891
PB-021 | REVIEW | yojan-2 | until 1792972997
PB-022 | REVIEW | yojan-1 | until 1792972812
PB-024 | REVIEW | alexis-1 | until 1792973056
PB-025 | REVIEW | alexis-2 | until 1792972155
PB-027 | CLAIMED | saus-1 | until 1792961144
PB-028 | REVIEW | yojan-2 | until 1792973101

Blockers: BLOCKED tasks; use status --task ID --summary.
Current decisions (last 5):
- 1792958055 | PB-030 | se integra dentro de PB-021 (mismos Paths, Freeze-Allowed yes) | Why: PB-030 no es Freeze-Allowed y bloquea PB-021
- 1792958269 | deadline freeze/event/1792958220 | FREEZE_DEMO_FIXES_ONLY | New claims only with Freeze-Allowed: yes; respect authorization.
- 1792958368 | allow | JoahanMorales | freeze exception: PB-017 | Why: La ruta de la demo pasa por zonas que necesitan clientes (5/5 paradas)
- 1792958662 | PB-031 | follow-up of PB-002 by victor-2: Fixtures con el nombre colonIA: regenerar sedeco_crecimiento.json desde la API renombrada | Why: same Paths, no scope chang
- 1792958669 | allow | victor | freeze exception: PB-031 | Why: Victor autorizó regenerar el fixture de crecimiento con el nombre colonIA después del freeze

Global next step: available P0; else review PRs, tests, demo, rehearsal.
Why: bounded snapshot to resume without rereading history.
