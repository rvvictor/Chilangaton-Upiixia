<div align="center">

# colonIA

### The living network of the neighborhood economy · *La red viva de la economía de barrio*

**Chilangatón 2026 · Reto 1: Comercio popular y barrial · Mexico City**

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![Mapbox](https://img.shields.io/badge/Mapbox_GL-3D-000000?logo=mapbox&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-bot-26A5E4?logo=telegram&logoColor=white)
![Tests](https://img.shields.io/badge/tests-121_passing-00a86b)
![Built in](https://img.shields.io/badge/built_in-~3_hours-e6007e)

</div>

---

> **In the digital era, what can't be seen online doesn't exist.**
> Mexico City has **1,812 neighborhoods (colonias)**, and only **7 in 100 businesses sell online**.
> Neighborhood commerce is alive on the street, but invisible: neighbors don't know where to find it,
> and the government doesn't have the data to know where people lack nearby commerce.
> **colonIA makes the neighborhood business network visible, measurable and connected.**

## What it does

colonIA connects three people around Mexico City's street commerce, in one platform:

| Who | What they get |
|---|---|
| 🏛️ **SEDECO (city government)** | A 3D H3 hexagon map of Coyoacán and Iztapalapa: where card payments move, where people live and where neighborhood commerce is missing, **by day and hour** (tianguis open and close, the population within 800 m of an open market changes live). Aggregated only, never a named business. |
| 🛒 **Neighbors** | Type a shopping list in plain Spanish (*"2 kilos de jitomate, tortillas, chiles secos, tenis para niño, pilas"*) and get a **walking route that only stops at neighborhood businesses — never chains** — favoring areas that need customers, with the reason for every stop. |
| 🧺 **Street vendors** | Sign up with a **Telegram voice note**, no app, no forms. In seconds they appear on the government map, in their neighbors' routes, and get a free **web page with QR** and a printable poster. |

**The wow moment:** a street vendor's voice note puts her on the government's map and on her neighbor's shopping route in under a minute.

## How it works

**Golden rule: AI never produces a number on screen.** It only interprets (voice → text → business card) and picks from
closed lists. Every figure comes from a calculation with a source and carries a **real / estimated / simulated** label.

| Piece | Method |
|---|---|
| **Hex grid** | Uber H3, resolution 9 (~0.1 km² cells) |
| **Card-payment activity** | Real CNBV totals per borough split across hexagons by business size (estimate, labeled) |
| **Impulse index** | `percentile(population) × (1 − percentile(activity))` — where commerce most needs customers |
| **Coverage** | 800 m around every open tianguis/market for the selected day and hour |
| **Anti-chain rule** | 4 deterministic filters (business class, size, fuzzy brand blacklist, repetition ≥ 5) + an API invariant that refuses to return a chain |
| **List → business class** | 300+ items with Mexico City synonyms + fuzzy search; the LLM only resolves unknown items from a closed enum |
| **Route** | Proximity + impulse scoring, greedy item coverage, max 5-minute detour, Mapbox walking directions |
| **Voice sign-up** | OpenAI transcription + structured extraction validated with Pydantic; the vendor confirms before anything is published |

## Built in ~3 hours

From the first line of product code (12:04) to the last merge (14:49) on October 25, 2026 — five people:

| | |
|---|---|
| **5 views** | Landing · SEDECO 3D map · Neighbor route · Vendor dashboard · Growth panel |
| **31 tasks** | planned, built, independently reviewed and merged (33 pull requests) |
| **121 automated tests** | including a 0-chains guarantee and an offline end-to-end demo test |
| **~9,500 lines** | ~5,000 Python + ~4,500 TypeScript |
| **42 code reviews** | 35 approved, 7 rejected until fixed — nothing merged unverified |
| **Production-ready** | one-service Render blueprint (`render.yaml`) and an offline `DEMO_MODE` |

## Run it

Requirements: [uv](https://docs.astral.sh/uv/) and Node.js 20+.

```bash
cp .env.example .env          # optional keys: OPENAI_API_KEY, MAPBOX_TOKEN, TELEGRAM_BOT_TOKEN (+ VITE_MAPBOX_TOKEN in web/.env)
bash scripts/demo.sh          # builds the web app and serves everything at http://127.0.0.1:8000 (+ the bot if a token is set)
DEMO_MODE=1 bash scripts/demo.sh   # no internet, no keys: recorded responses (plan B)
```

Views: `#/inicio` (landing) · `#/sedeco` · `#/usuario` (neighbor) · `#/negocio/<id>` (vendor) · `#/crecimiento` (growth panel).
Without a network the vendor sign-up can be injected with
`uv run python scripts/simular_alta.py --caso dona-lupe --url http://127.0.0.1:8000`.
The 3D map needs `VITE_MAPBOX_TOKEN` at build time; without it the views show a notice instead of the map.

**Deploy:** Render → New → Blueprint → this repo (`render.yaml`). Set the secrets it asks for and `PUBLIC_BASE_URL`
(the service URL, used in the links the bot sends).

**Tests:** `uv run pytest -q` · end-to-end demo without network: `DEMO_MODE=1 uv run pytest -q app/tests/test_demo.py`.

**Stack:** FastAPI (Python 3.12) · React + Vite + Tailwind v4 + Motion · Mapbox GL + h3 · OpenAI · python-telegram-bot.

## What is real and what is simulated

Every figure on screen carries a **real**, **estimated** or **simulated** label. Heavy public datasets (DENUE, CNBV,
Banxico, Census) were not downloaded during the hackathon: scripts in `pipeline/` generate plausible data for Coyoacán
(09003) and Iztapalapa (09007) with the same shape.

| Piece | Today | How it becomes real |
|---|---|---|
| Base map, walking routes | Real (Mapbox, with a token) | Already real |
| Telegram voice sign-up | Real (OpenAI); recorded responses with `DEMO_MODE=1` | Already real |
| Anti-chain rule | Real code, run on simulated businesses | Run it on the DENUE download |
| Businesses (520), tianguis and markets (60) | Simulated (field-verified tianguis, if added to `data/campo/tianguis_verificados.csv`, load as real) | DENUE, SEDECO open data, field checks |
| Hexagons: population, card activity, impulse index | Simulated / estimated from simulated data | Census 2020 + CNBV financial inclusion data |
| Platform history (searches, routes, "bought here") | Simulated, `demo_data: true` | Pilot usage |
| Programs (Mercomuna, DiMo, CoDi) | Real programs; "Puntos de barrio" is a proposal | — |

Full list: [`data/demo/README.md`](data/demo/README.md). Demo script: [`docs/demo/guion.md`](docs/demo/guion.md).

**Cited figures:** 1,812 colonias (Mexico City government portal) · 6.7 % of businesses sold online in 2023 (STyFE CDMX,
Censos Económicos 2024) · 1,367 tianguis (Chilango) · neighborhood stores' revenue −42.8 % 2017–2023 (ANPEC via El CEO).

## Built with the UPIIXIA Agentic Kit

colonIA was built by **5 people working with 10 AI coding agents in parallel**, coordinated by the
**[UPIIXIA Agentic Kit](https://github.com/JoahanMorales/upiixia-agentic-kit)** — our own open-source kit for running
many agents (Claude Code, Codex, Cursor, Gemini CLI) on one repo without stepping on each other.

What the kit gave us during the hackathon:

- 🗂️ **A task board on a git branch** (`claims`): every task has testable criteria, file paths, an exact verify command, leases and heartbeats — one task, one branch, one worktree, one port.
- 🔍 **Independent review + a gated merge:** the author never reviews their own work; merges re-run the product smoke in a clean clone and check scope and secrets. *(42 reviews today, 7 rejects that caught real demo bugs.)*
- 💬 **Agent-to-agent messages** with contracts and impact notices (*174 messages today*), so a change in an API reached every view that used it.
- 🛡️ **Guardrails:** hooks block destructive git commands and secrets in commits or chat; a freeze with human-only exceptions protects the demo.
- 💸 **Cost-aware orchestration:** fast models scout and run tests, a balanced model builds, a strong model advises only at checkpoints — paced by the team's real plan usage.
- 📊 **A live team dashboard** (`uak dash`) and a code map, so humans watch progress instead of asking agents for status.

Want to build like this? **The kit is free to use: [github.com/JoahanMorales/upiixia-agentic-kit](https://github.com/JoahanMorales/upiixia-agentic-kit).**

## Team

**Cris · Alexis · Yojan · Saus · Victor** — UPIIXIA (IPN), with AI coding agents coordinated by the UPIIXIA Agentic Kit.

<div align="center">

*"Others give the street vendor an app. We give the city the living network of its neighborhood economy."*

</div>
