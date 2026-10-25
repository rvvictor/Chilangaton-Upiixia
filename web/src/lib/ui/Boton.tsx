import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma";

const variantes: Record<Variante, string> = {
  primario: "bg-(--pb-acento) text-white hover:bg-(--pb-acento-fuerte) border-transparent",
  secundario:
    "bg-(--pb-superficie) text-(--pb-texto) border-(--pb-borde-fuerte) hover:bg-(--pb-superficie-2)",
  fantasma: "bg-transparent text-(--pb-texto) border-transparent hover:bg-(--pb-superficie-2)",
};

type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  icono?: ReactNode;
  anchoCompleto?: boolean;
};

/** One `primario` per screen; labels of 3 words or fewer (DESIGN.md §5). */
export function Boton({
  variante = "primario",
  icono,
  anchoCompleto = false,
  className = "",
  type = "button",
  children,
  ...rest
}: BotonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-(--pb-alto-control) items-center justify-center gap-2 whitespace-nowrap rounded-(--pb-radio-control) border px-5 text-base font-semibold motion-safe:transition-[background-color,transform] motion-safe:duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variantes[variante]} ${anchoCompleto ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icono && <span aria-hidden="true" className="inline-flex text-[1.222rem]">{icono}</span>}
      {children}
    </button>
  );
}
