# Ensayo · 25-oct-2026 13:20–13:31 (saus-1)

Desde un worktree limpio de `main` (9fad6ec, PB-013 integrado), en Windows 11, sin llaves en `.env`.

| Paso | Comando / acción | Resultado |
|---|---|---|
| Arranque | `DEMO_MODE=1 PORT=8260 bash scripts/demo.sh` | `uv sync`, `npm ci` y build del web OK. **Uvicorn no arranca en Windows:** `app/services/crecimiento.py:19` `ZoneInfo("America/Mexico_City")` → `ZoneInfoNotFoundError` (Windows no trae la base de zonas horarias; falta el paquete `tzdata`). En Mac/Linux no pasa. Reportado a PB-014 y a los humanos (msg #94). |
| Arranque (rodeo) | `DEMO_MODE=1 uv run --with tzdata uvicorn app.main:app --port 8260` | Arranca. |
| API | `GET /`, `/api/hex`, `/api/dinero/alcaldias`, `/api/tianguis?dia=2&hora=10:00`, `/api/altas/live`, `/api/sedeco/crecimiento` | Todos 200, < 0.25 s. |
| Prueba 6 pasos | `DEMO_MODE=1 uv run --with tzdata pytest -q app/tests/test_demo.py` | 5 passed. |
| 1 SEDECO | Navegador 1280×720, `#/sedeco` | Panel, "Ver dato real", barra de días y % cubierto OK. **Mapa: aviso "El mapa necesita una llave de Mapbox"** (esta máquina no tiene `VITE_MAPBOX_TOKEN`). |
| 3 Vecina | Lista de la demo → **Armar mi ruta** | Ruta con "0 cadenas · 2.0 km a pie". Sin token: ruta aproximada en línea recta. |
| 4 Alta | `uv run python scripts/simular_alta.py --caso dona-lupe --url http://127.0.0.1:8260` | `ALTA alta-puesto-de-dona-lupe`, aparece en `/api/altas/live`. |
| 5 Negocio | `#/negocio/alta-puesto-de-dona-lupe` | Mi avance, escalera de barrio y página web OK, cifras con etiqueta "Simulado". |
| 6 Crecimiento | `#/crecimiento` | OK. **"Altas hoy" sigue en 0** tras el alta de respaldo: es correcto, el contador es dato real y excluye `demo_data: true`. Solo sube con un alta real por Telegram. |
| Consola | errores del navegador | Ninguno. |

## Pendiente antes de presentar

1. La laptop de la demo debe tener `VITE_MAPBOX_TOKEN` en `.env` **antes** del build, o no hay mapa 3D (primer wow).
2. Si la laptop es Windows: arreglar `tzdata` o arrancar con `uv run --with tzdata`.
3. Ensayo con el bot de Telegram real (no se probó aquí: sin `TELEGRAM_BOT_TOKEN`).
4. Medir el tiempo completo con el guion en voz alta (objetivo ≤ 3 min, primer wow ≤ 15 s).
