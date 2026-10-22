interface Props {
  titulo: string;
  texto: string;
  /** Botón para seguir navegando. */
  accion?: { texto: string; alHacer: () => void };
}

/** Pantalla que todavía no está hecha en la plantilla. */
export function Pendiente({ titulo, texto, accion }: Props) {
  return (
    <section className="demo-pendiente demo-contenedor">
      <h1 className="demo-titulo" tabIndex={-1} data-titulo-pantalla>
        {titulo}
      </h1>
      <p>{texto}</p>
      {accion && (
        <button type="button" className="demo-boton" onClick={accion.alHacer}>
          {accion.texto}
        </button>
      )}
    </section>
  );
}
