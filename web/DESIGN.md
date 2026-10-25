# DESIGN · Pulso Barrial

Única dirección visual del proyecto (PB-003, design lock). Cambiarla después del lock necesita `uak decision` de un humano.

**Lectura:** herramienta pública de decisión y servicio ciudadano para la SEDECO, el vecino y el comerciante de barrio,
con lenguaje de documento público confiable, sobre Tailwind v4 + Geist + movimiento mínimo. Se presenta en proyector a
1280×720 ante un jurado: legibilidad y honestidad del dato por encima de todo (rúbrica C6).

**Diales:** `DESIGN_VARIANCE 3 · MOTION_INTENSITY 2 · VISUAL_DENSITY 5` (preset de servicio público).

## 1. Principios

1. **El dato manda.** El mapa ocupa el espacio; la interfaz es un marco sobrio alrededor.
2. **Cada cifra dice qué es.** Junto a todo número va una `Etiqueta` (real · estimado · simulado) y su fuente en el
   `title`/nota. Nunca un número sin etiqueta.
3. **Un solo acento.** El naranja cempasúchil es el color del *impulso* (dónde hace falta comercio) y de la acción
   principal. Nada más usa color saturado, salvo las rampas de datos y las etiquetas.
4. **Se lee desde el fondo de la sala.** Texto base 18 px, controles de 48 px, contraste AA como mínimo.

## 2. Color (todo vive en `web/src/lib/ui/tokens.css`)

Base fría tipo papel oficial; nada de crema ni beige.

| Token | Valor | Uso |
|---|---|---|
| `--pb-fondo` | `#f6f7f9` | fondo de página |
| `--pb-superficie` | `#ffffff` | tarjetas, paneles |
| `--pb-superficie-2` | `#eef1f4` | zonas hundidas, hover de fantasma |
| `--pb-texto` | `#15191e` | texto principal (16.5:1 sobre fondo) |
| `--pb-texto-2` | `#48515c` | texto secundario (7.5:1) |
| `--pb-borde` | `#d3d9e0` | divisores |
| `--pb-borde-fuerte` | `#7d8793` | bordes de controles (3.6:1, no texto) |
| `--pb-acento` | `#c2410c` | botón primario, impulso alto (5.2:1 con blanco) |
| `--pb-acento-fuerte` | `#9a3412` | hover/activo del primario |
| `--pb-acento-suave` | `#fff1e6` | fondo de chip activo |
| `--pb-foco` | `#1d4ed8` | anillo de foco, 3 px, siempre visible |
| `--pb-error` | `#b42318` | errores |

**Etiquetas de dato** (texto sobre su fondo, todas ≥ 8:1):

| Tipo | Texto | Fondo | Rasgo extra (no depende del color) |
|---|---|---|---|
| real | `#14532d` | `#dcfce7` | punto sólido |
| estimado | `#1e3a8a` | `#dbeafe` | punto con anillo |
| simulado | `#3d4651` | `#eceff3` | borde punteado + rayado |

**Rampas del mapa** (5 pasos; `--pb-actividad-1…5`, `--pb-impulso-1…5`):

- *Actividad* (secuencial verde azulado, frío): `#e3f1f0 #a6d4cf #5cb1a8 #2a8880 #0e5c58`.
- *Impulso* (acento cálido de mercado): `#ffeedd #fcc58b #f5914a #d9581b #9a3412`.
- *Oculto por privacidad* (< 3 negocios): `--pb-oculto #c3c9d0`, sin altura y sin cifras.

Altura del hexágono = actividad; color = impulso o la capa elegida. Nunca dos rampas cálidas a la vez.

## 3. Tipografía

- Familia única: **Geist Variable** (`@fontsource-variable/geist`). Énfasis con peso, nunca con otra familia.
- `html { font-size: 18px }` (PB-001). Escala en `rem`: 0.889 (16 px, solo notas), 1 (18), 1.222 (22), 1.556 (28),
  2 (36). Nada por debajo de 16 px.
- Cifras con `font-variant-numeric: tabular-nums` (`.pb-cifra`).
- Títulos alineados a la izquierda, `tracking-tight`, `leading-tight`; párrafos ≤ 65 ch, `leading-relaxed`.

## 4. Forma y espacio

- Regla de radios: **controles 12 px · tarjetas 16 px · chips y etiquetas píldora**. Sin excepciones.
- Sombras casi nulas y teñidas del fondo (`--pb-sombra`); la jerarquía se hace con borde y espacio.
- Ritmo de 8 px. Paneles con padding de 24 px. Columna SEDECO: mapa 70 % · panel 30 %, sin scroll a 1280×720.

## 5. Componentes (`web/src/lib/ui/`)

| Componente | Reglas |
|---|---|
| `Etiqueta` | `tipo` real/estimado/simulado, `fuente` opcional (tooltip y texto accesible). Siempre junto a la cifra. |
| `Boton` | `primario` (acento, uno por pantalla) · `secundario` (borde) · `fantasma`. Alto ≥ 48 px, texto en una línea, máximo 3 palabras, `:active` baja 1 px. |
| `Tarjeta` | Superficie blanca, borde, radio 16 px; `titulo` opcional como `h2`. Solo cuando agrupa algo de verdad. |
| `Chip` | Píldora. Con `onClick` es interruptor (`aria-pressed`) y mide 48 px; sin él es informativo (pago, Mercomuna). |
| `MapaBase` | Mapbox GL v3, estilo claro, cámara a 50° sobre Coyoacán con Iztapalapa a la vista; sin token muestra aviso. |

Estados obligatorios en toda vista con datos: cargando (esqueleto con la forma final), vacío (qué hacer) y error
(qué pasó y cómo seguir). Textos en español de México, claros y en segunda persona: "Armar mi ruta", no "Submit".

## 6. Movimiento

- Solo transiciones de 150 ms en color y transformaciones de botones; el mapa anima la cámara una vez al cargar.
- `prefers-reduced-motion: reduce` → sin transiciones ni vuelos de cámara (`motion-safe:` en Tailwind).

## 7. Prohibido

Degradados morados, vidrio, neón, emoji como iconos (usar `@phosphor-icons/react`), tres tarjetas iguales como
decoración, texto gris claro sobre blanco, cifras sin etiqueta, colores escritos a mano fuera de `tokens.css`.
