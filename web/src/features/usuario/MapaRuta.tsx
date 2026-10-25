import type { FeatureCollection, Feature } from "geojson";
import type { GeoJSONSource, Map as MapboxMap } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";

import { MapaBase } from "../../lib/map";
import type { Punto, Ruta } from "./tipos";

const VACIO: FeatureCollection = { type: "FeatureCollection", features: [] };

/** Mapbox paint cannot read CSS variables, so resolve the design tokens once at layer creation. */
function token(nombre: string, respaldo: string): string {
  if (typeof document === "undefined") return respaldo;
  return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim() || respaldo;
}

// Progressive dash sequence (Mapbox "animate a line" pattern): the dashes appear to walk along the route.
const PASOS_GUION: number[][] = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
  [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

function sinMovimiento(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function paradasGeoJSON(ruta: Ruta | null, origen: Punto): FeatureCollection {
  const origenF: Feature = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [origen.lng, origen.lat] },
    properties: { etiqueta: "Tú", origen: 1 },
  };
  if (!ruta) return { type: "FeatureCollection", features: [origenF] };
  return {
    type: "FeatureCollection",
    features: [
      origenF,
      ...ruta.paradas.map((p) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [p.negocio.lng, p.negocio.lat] },
        properties: { etiqueta: String(p.orden), origen: 0, alta: p.negocio.tipo === "alta" ? 1 : 0 },
      })),
    ],
  };
}

export function MapaRuta({ ruta, origen }: { ruta: Ruta | null; origen: Punto }) {
  const mapa = useRef<MapboxMap | null>(null);
  const animacion = useRef(0);
  useEffect(() => () => cancelAnimationFrame(animacion.current), []);

  const pintar = useCallback(() => {
    const map = mapa.current;
    if (!map) return;
    const linea: FeatureCollection = ruta?.geometria
      ? { type: "FeatureCollection", features: [{ type: "Feature", geometry: ruta.geometria, properties: {} }] }
      : VACIO;
    (map.getSource("ruta-linea") as GeoJSONSource | undefined)?.setData(linea);
    (map.getSource("ruta-paradas") as GeoJSONSource | undefined)?.setData(paradasGeoJSON(ruta, origen));
    const puntos = ruta ? [origen, ...ruta.paradas.map((p) => ({ lat: p.negocio.lat, lng: p.negocio.lng }))] : [origen];
    if (puntos.length > 1) {
      const lngs = puntos.map((p) => p.lng);
      const lats = puntos.map((p) => p.lat);
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 70, pitch: 0, bearing: 0, duration: 900 },
      );
    } else {
      map.easeTo({ center: [origen.lng, origen.lat], zoom: 15, pitch: 0, bearing: 0, duration: 600 });
    }
  }, [ruta, origen]);

  const alListo = useCallback(
    (map: MapboxMap) => {
      mapa.current = map;
      map.addSource("ruta-linea", { type: "geojson", data: VACIO });
      map.addSource("ruta-paradas", { type: "geojson", data: VACIO });
      const acento = token("--pb-marca", "#e6007e");
      const alta = token("--pb-real-texto", "#14532d");
      const origenColor = token("--pb-texto", "#1f2937");
      map.addLayer({
        id: "ruta-linea-base",
        type: "line",
        source: "ruta-linea",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": acento, "line-width": 7, "line-opacity": 0.3 },
      });
      map.addLayer({
        id: "ruta-linea",
        type: "line",
        source: "ruta-linea",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": acento, "line-width": 5, "line-dasharray": [0, 4, 3] },
      });
      map.addLayer({
        id: "ruta-paradas",
        type: "circle",
        source: "ruta-paradas",
        paint: {
          "circle-radius": ["case", ["==", ["get", "origen"], 1], 10, ["==", ["get", "alta"], 1], 19, 15],
          "circle-color": ["case", ["==", ["get", "origen"], 1], origenColor, ["==", ["get", "alta"], 1], alta, acento],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": ["case", ["==", ["get", "alta"], 1], 4, 3],
        },
      });
      map.addLayer({
        id: "ruta-alta-nombre",
        type: "symbol",
        source: "ruta-paradas",
        filter: ["==", ["get", "alta"], 1],
        layout: { "text-field": "Nuevo", "text-size": 13, "text-offset": [0, 2.1], "text-allow-overlap": true },
        paint: { "text-color": alta, "text-halo-color": "#ffffff", "text-halo-width": 2 },
      });
      if (!sinMovimiento()) {
        let paso = 0;
        let ultimo = 0;
        const animar = (t: number) => {
          if (!map.getLayer("ruta-linea")) return;
          if (t - ultimo > 60) {
            ultimo = t;
            paso = (paso + 1) % PASOS_GUION.length;
            map.setPaintProperty("ruta-linea", "line-dasharray", PASOS_GUION[paso]);
          }
          animacion.current = requestAnimationFrame(animar);
        };
        animacion.current = requestAnimationFrame(animar);
      }
      map.addLayer({
        id: "ruta-numeros",
        type: "symbol",
        source: "ruta-paradas",
        filter: ["==", ["get", "origen"], 0],
        layout: { "text-field": ["get", "etiqueta"], "text-size": 15, "text-allow-overlap": true },
        paint: { "text-color": "#ffffff" },
      });
      pintarRef.current();
    },
    // The layers are created once; later changes go through pintar() in the effect below.
    [],
  );

  // MapaBase calls onReady once; the ref lets it paint the latest route even if it changed while loading.
  const pintarRef = useRef(pintar);
  useEffect(() => {
    pintarRef.current = pintar;
    pintar();
  }, [pintar]);

  return <MapaBase onReady={alListo} className="rounded-(--pb-radio-tarjeta)" />;
}
