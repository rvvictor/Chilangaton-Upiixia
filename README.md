# colonIA

**The living network of the neighborhood economy.** Built at Chilangatón 2026 (Reto 1 · Comercio popular y barrial), Mexico City.

colonIA connects three people around Mexico City's street commerce:

- **SEDECO (city government):** an H3 hexagon map of Coyoacán and Iztapalapa showing where card payments move, where
  people live and where neighborhood commerce is missing, by day and hour (tianguis open and close).
- **Neighbors:** type a shopping list in plain Spanish and get a walking route that only stops at neighborhood businesses
  (never chains), favoring areas that need customers.
- **Street vendors:** sign up with a Telegram voice note; they appear on the government map, in neighbors' routes and get
  a free web page with a QR code.

## Run it

Requirements: [uv](https://docs.astral.sh/uv/) and Node.js 20+.

```bash
cp .env.example .env          # optional keys: OPENAI_API_KEY, MAPBOX_TOKEN, VITE_MAPBOX_TOKEN, TELEGRAM_BOT_TOKEN
bash scripts/demo.sh          # builds the web app and serves everything at http://127.0.0.1:8000
DEMO_MODE=1 bash scripts/demo.sh   # no internet, no keys: recorded responses (plan B)
```

Views: `#/inicio` (landing) · `#/sedeco` · `#/usuario` (neighbor) · `#/negocio/<id>` (vendor) · `#/crecimiento` (growth panel).
Without a network the vendor sign-up can be injected with
`uv run python scripts/simular_alta.py --caso dona-lupe --url http://127.0.0.1:8000`.
The 3D map needs `VITE_MAPBOX_TOKEN` at build time; without it the views show a notice instead of the map.

Tests: `uv run pytest -q` · end-to-end demo steps without network: `DEMO_MODE=1 uv run pytest -q app/tests/test_demo.py`.

Stack: FastAPI (Python 3.12) + React/Vite/Tailwind, Mapbox GL, h3, OpenAI (voice transcription and structured extraction),
python-telegram-bot.

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

## Team

Cris, Alexis, Yojan, Saus and Victor, with AI coding agents coordinated by the UPIIXIA Agentic Kit.
