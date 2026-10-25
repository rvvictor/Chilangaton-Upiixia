# PROJECT · Chilangatón (sprint mode)

> Filled in by `/uak-setup` with the human at minute 0. uak reads the flat fields of the last block from
> the remote `main`, so a stale worktree can never change permissions.

## Event
| Field | Value |
|---|---|
| Event / challenge | Chilangatón · no official URL |
| Start | 2026-10-25 08:00 America/Mexico_City |
| Official deadline | 2026-10-25 18:00 America/Mexico_City · platforms: TBD (not announced yet) |
| Freeze | 2026-10-25 16:30 (Freeze-Epoch 1792967400) · design lock 08:30 · walking skeleton 09:00 · plan-B video 13:00 |
| Clean rehearsal / plan B | 17:12 |
| Internal submission | 17:36 |
| Humans | Cris, Alexis, Yojan, Saus, Victor · submission owner: Victor |
| Agents | cris-1, cris-2, alexis-1, alexis-2, yojan-1, yojan-2, saus-1, saus-2, victor-1, victor-2 |
| Machines | `<laptop, Jetson…>` · ports already taken: `<8000…>` |

## Official rubric (weights sum to 100)
| ID | Criterion | Weight | Evidence in the demo |
|---|---|---:|---|
| C1 | TBD (rubric not announced yet) | - | - |

## Event rules
| Topic | Confirmed rule | Source |
|---|---|---|
| AI use / prior code | AI allowed · prior code: TBD | organizers |
| Data and licenses | TBD | - |
| Format and video limits | TBD (not announced yet) | - |

## Plan B
- A video of the whole flow at `<path>` (v1 at T−50%, final at T−2 h). Use it if `<network, mic, external API>` fails.

## Executable config
A human sets `yes`. A missing field means `no`.

```text
Mode: sprint
Backlog-Proposed-Epoch: 0
Backlog-Approved: no
Autonomy: yes
Auto-Merge: yes
Review-Mode: claims
Plan-Channel: claims
Freeze-Epoch: 1792967400
Lease-Seconds: 2700
Review-Lease-Seconds: 14400
Events-Per-Session: 100
Checkpoint-Percent: 60
Merge-Lease-Seconds: 1800
Merge-Wait-Seconds: 180
Max-Parallel-Subagents: 4
Opus-Subagents-Per-Session: 2
Pace: auto
Subagent-Hard-Cap: 6
Strong-Hard-Cap: 3
Subagents-Per-Session: 40
Subagents-Per-Machine: 8
Subagent-Burst-Per-Minute: 6
Max-Worktree-Agents: 6
Blackbox: on
Additive-Paths: -
```
