import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  icono?: ReactNode;
  /** With onClick the chip is a toggle (aria-pressed, 48 px tall); without it, a static label. */
  activo?: boolean;
  onClick?: () => void;
  className?: string;
};

const base = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 font-medium";

export function Chip({ children, icono, activo = false, onClick, className = "" }: ChipProps) {
  const contenido = (
    <>
      {icono && <span aria-hidden="true" className="inline-flex">{icono}</span>}
      {children}
    </>
  );

  if (!onClick) {
    return (
      <span
        className={`${base} min-h-9 border-(--pb-borde) bg-(--pb-superficie-2) text-[0.889rem] text-(--pb-texto) ${className}`}
      >
        {contenido}
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`${base} min-h-(--pb-alto-control) text-base motion-safe:transition-colors motion-safe:duration-150 ${
        activo
          ? "border-(--pb-acento) bg-(--pb-acento-suave) text-(--pb-acento-fuerte)"
          : "border-(--pb-borde-fuerte) bg-(--pb-superficie) text-(--pb-texto) hover:bg-(--pb-superficie-2)"
      } ${className}`}
    >
      {contenido}
    </button>
  );
}
