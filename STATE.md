# STATE

Phase: feature freeze; authorized fixes, rehearsal and submission only
Updated: 1792958493
AVAILABLE: PB-027 PB-030 
CLAIMED: PB-024 
BLOCKED: -
REVIEW: PB-016 PB-021 PB-022 PB-025 PB-026 PB-028 
INTEGRATED: (21; last 12) ... PB-010 PB-011 PB-012 PB-013 PB-014 PB-015 PB-017 PB-018 PB-019 PB-020 PB-023 PB-029 
CANCELLED: -

Claims (first 24; status --task ID shows detail):
PB-016 | REVIEW | saus-1 | until 1792971891
PB-021 | REVIEW | yojan-2 | until 1792972659
PB-022 | REVIEW | yojan-1 | until 1792972812
PB-024 | CLAIMED | alexis-1 | until 1792959782
PB-025 | REVIEW | alexis-2 | until 1792972155
PB-026 | REVIEW | yojan-1 | until 1792972354
PB-028 | REVIEW | yojan-2 | until 1792971766

Blockers: BLOCKED tasks; use status --task ID --summary.
Current decisions (last 5):
- 1792956874 | PB-030 | follow-up of PB-001 by yojan-2: Mapa invisible: mapbox-gl.css en capa components para que no anule absolute inset-0 | Why: same Paths, no scope change
- 1792957122 | deadline lease/PB-017/1792957101 | REQUIRES_RECOVERY | Claim kept; read the summary and use release --expired --read-summary. No work is deleted.
- 1792958055 | PB-030 | se integra dentro de PB-021 (mismos Paths, Freeze-Allowed yes) | Why: PB-030 no es Freeze-Allowed y bloquea PB-021
- 1792958269 | deadline freeze/event/1792958220 | FREEZE_DEMO_FIXES_ONLY | New claims only with Freeze-Allowed: yes; respect authorization.
- 1792958368 | allow | JoahanMorales | freeze exception: PB-017 | Why: La ruta de la demo pasa por zonas que necesitan clientes (5/5 paradas)

Global next step: available P0; else review PRs, tests, demo, rehearsal.
Why: bounded snapshot to resume without rereading history.
