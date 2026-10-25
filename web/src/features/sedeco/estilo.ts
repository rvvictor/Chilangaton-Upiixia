/** Superficie de vidrio sobre el mapa (solo tokens --pb-*). */
export const VIDRIO =
  "border border-(--pb-borde)/70 bg-(--pb-vidrio) shadow-(--pb-sombra-alta) backdrop-blur-xl backdrop-saturate-150";

/** true si la persona pidió menos movimiento: sin animaciones de cifras ni vuelo de cámara. */
export const movimientoReducido = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const formato = (n: number | null | undefined, decimales = 0) =>
  n == null ? "Sin dato" : n.toLocaleString("es-MX", { maximumFractionDigits: decimales, minimumFractionDigits: decimales });
