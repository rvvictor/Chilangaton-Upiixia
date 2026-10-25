# Guion de la demo · Pulso Barrial (≤ 3 min)

Antes de entrar: `bash scripts/demo.sh` (o `DEMO_MODE=1 bash scripts/demo.sh` sin red) en la laptop de la demo, navegador a
pantalla completa en `http://127.0.0.1:8000/#/sedeco`, a 1280×720. El web se construye con `VITE_MAPBOX_TOKEN` en el `.env`:
**sin esa llave no hay mapa 3D** (sale un aviso) y se pierde el primer wow → usar el video de plan B.
Un compañero con Telegram abierto en el chat del bot y la nota de voz de Doña Lupe lista para mandar.

| # | Tiempo | Clic | Qué decir |
|---|---|---|---|
| 1 | 0:00–0:15 | Ya está abierta **SEDECO**. Arrastrar el mapa para mostrar Coyoacán e Iztapalapa. | **Wow 1.** "Esto es Coyoacán e Iztapalapa en hexágonos. La altura es cuánto se paga con tarjeta, el color es dónde hace falta comercio de barrio." |
| 1b | 0:15–0:35 | Activar **Ver dato real**. | "Este es el dato real de la CNBV por alcaldía: dos realidades vecinas. Cada cifra dice si es real, estimada o simulada." |
| 2 | 0:35–1:00 | En **¿Qué día y a qué hora?** tocar **Mar**. Tocar un hexágono. | "El domingo hay tianguis; el martes se apagan y aparecen desiertos de comercio. Baja la población cubierta. La tarjeta dice la fuente de cada número." |
| 3 | 1:00–1:35 | Pestaña **Vecina**. Escribir "2 kilos de jitomate, tortillas, chiles secos, tenis para niño, pilas" → **Armar mi ruta**. | **Wow 2.** "Karla escribe su lista como la diría. La ruta va a pie, **0 cadenas**, y pasa por puestos en zonas que necesitan clientes. Cada parada dice por qué." |
| 4 | 1:35–2:05 | El compañero manda la **nota de voz** al bot de Telegram y confirma la ficha. Volver a **SEDECO**. | **Wow 3.** "Doña Lupe acaba de darse de alta con una nota de voz. En segundos está en el mapa del gobierno y en la ruta de su vecina." |
| 5 | 2:05–2:35 | Pestaña **Negocio**, elegir a Doña Lupe en **Elige un negocio**. Mostrar **Mi avance**, **Tu escalera de barrio** y su página web. | "Ella ve cuántas veces apareció en rutas, su escalera hacia el cobro digital y el crédito, y su página web con QR, sin descargar nada." |
| 6 | 2:35–3:00 | Pestaña **Crecimiento**. | "Para SEDECO: altas de hoy, series de la CNBV por alcaldía y rutas por hexágono. Escala a las 16 alcaldías cambiando una variable." |

**Frase de cierre:** "Una nota de voz de una tianguista la pone en el mapa del gobierno y en la ruta de compras de su vecina, en menos de un minuto."

## Si algo falla

- **Sin red o el bot no responde (paso 4):** en otra terminal,
  `uv run python scripts/simular_alta.py --caso dona-lupe --url http://127.0.0.1:8000`. Doña Lupe aparece igual en el mapa,
  en la ruta y en **Negocio**. Decir: "esta alta es de respaldo, marcada como simulada". El contador **Altas hoy** es una
  cifra real y **no sube** con el alta de respaldo (excluye `demo_data: true`); no prometer el +1 en ese caso.
- **Sin mapa (aviso "El mapa necesita una llave de Mapbox"):** el panel derecho funciona; pasar al video de plan B para los pasos 1–3.
- **Todo falla:** video de plan B (`docs/demo/entrega.md` dice dónde está).
