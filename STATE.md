# STATE

Phase: execution
Updated: 1792954401
AVAILABLE: PB-013 PB-016 
CLAIMED: PB-002 PB-017 
BLOCKED: -
REVIEW: PB-003 PB-011 PB-012 PB-014 PB-015 
INTEGRATED: PB-001 PB-004 PB-005 PB-006 PB-007 PB-008 PB-009 PB-010 
CANCELLED: -

Claims (first 24; status --task ID shows detail):
PB-002 | CLAIMED | cris-1 | until 1792954253
PB-003 | REVIEW | saus-1 | until 1792968656
PB-011 | REVIEW | victor-1 | until 1792967277
PB-012 | REVIEW | alexis-1 | until 1792968211
PB-014 | REVIEW | alexis-2 | until 1792968114
PB-015 | REVIEW | cris-2 | until 1792966703
PB-017 | CLAIMED | yojan-1 | until 1792957101

Blockers: BLOCKED tasks; use status --task ID --summary.
Current decisions (last 5):
- 1792953436 | PB-012 | local ui/tipos until PB-002/003 land; normalizer accepts both API shapes | Why: PB-002/003 not on main
- 1792953484 | PB-014 | local types/components until PB-002/003 land | Why: not on main
- 1792954283 | deadline lease/PB-002/1792954253 | REQUIRES_RECOVERY | Claim kept; read the summary and use release --expired --read-summary. No work is deleted.
- 1792954256 | PB-003 | squash-merge by a human on GitHub, no uak merge | Why: branch commit 973d53e has an unwanted Co-Authored-By trailer; force-push blocked and not wanted
- 1792954383 | PB-017 | follow-up of PB-004 by yojan-1: Bolsa de poco movimiento junto a la sede: la ruta de la demo muestra paradas en zonas que necesitan clientes | Why: same Pat

Global next step: available P0; else review PRs, tests, demo, rehearsal.
Why: bounded snapshot to resume without rereading history.
