import { useEffect, useRef, useState } from "react";
import { formato, movimientoReducido } from "./estilo";

/** Cifra grande que cuenta del valor anterior al nuevo (600 ms). Con movimiento reducido salta directo. */
export function Cifra({ valor, decimales = 0, sufijo = "", className = "" }: { valor: number | null; decimales?: number; sufijo?: string; className?: string }) {
  const [visto, setVisto] = useState(valor);
  const previo = useRef(valor);

  useEffect(() => {
    const desde = previo.current;
    previo.current = valor;
    if (valor == null || desde == null || desde === valor || movimientoReducido()) {
      const id = requestAnimationFrame(() => setVisto(valor));
      return () => cancelAnimationFrame(id);
    }
    const inicio = performance.now();
    let id = 0;
    const paso = (t: number) => {
      const k = Math.min(1, (t - inicio) / 600);
      const suave = 1 - Math.pow(1 - k, 3);
      setVisto(desde + (valor - desde) * suave);
      if (k < 1) id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [valor]);

  return (
    <span className={`pb-cifra font-bold tracking-tight tabular-nums ${className}`}>
      {/* El lector de pantalla oye solo el valor final, no la cuenta. */}
      <span aria-hidden="true">
        {formato(visto, decimales)}
        {visto != null && sufijo}
      </span>
      <span className="sr-only">
        {formato(valor, decimales)}
        {valor != null && sufijo}
      </span>
    </span>
  );
}
