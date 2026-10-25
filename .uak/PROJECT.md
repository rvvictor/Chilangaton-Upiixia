# PROJECT · Chilangatón (sprint mode)

> Filled in by `/uak-setup` with the human at minute 0. uak reads the flat fields of the last block from
> the remote `main`, so a stale worktree can never change permissions.

## Event
| Field | Value |
|---|---|
| Event / challenge | Chilangatón: tecnología e innovación social para futuros de la Ciudad · https://luma.com/j55anly0 · challenge: one CDMX challenge chosen on the day; people-centered, viable, accessible resources, shown as a prototype |
| Start | 2026-10-25 08:00 America/Mexico_City |
| Official deadline | 2026-10-25 15:00 America/Mexico_City: solution cut, organizers judge the solution only (to be confirmed) · semifinalists then get 30 min to build the pitch · event ends 18:00 · platforms: TBD |
| Freeze | 2026-10-25 13:57 (Freeze-Epoch 1792958220) · plan-B video 11:30 |
| Clean rehearsal / plan B | 14:26 |
| Internal submission | 14:43 |
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
Freeze-Epoch: 1792958220
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
