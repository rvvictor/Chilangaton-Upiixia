import type { HTMLAttributes, ReactNode } from "react";

type TarjetaProps = HTMLAttributes<HTMLElement> & {
  titulo?: ReactNode;
  /** Right side of the header, e.g. an Etiqueta or a ghost button. */
  accion?: ReactNode;
};

/** White surface with border; use only when it groups something real (DESIGN.md §4). */
export function Tarjeta({ titulo, accion, className = "", children, ...rest }: TarjetaProps) {
  return (
    <section
      className={`rounded-(--pb-radio-tarjeta) border border-(--pb-borde) bg-(--pb-superficie) p-6 shadow-(--pb-sombra) ${className}`}
      {...rest}
    >
      {(titulo || accion) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          {titulo && <h2 className="text-[1.222rem] font-semibold leading-tight tracking-tight">{titulo}</h2>}
          {accion}
        </header>
      )}
      {children}
    </section>
  );
}
