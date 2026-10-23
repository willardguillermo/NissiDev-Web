import type { Vista } from '../../demo/navegacion';

interface Props {
  vista: Vista;
  cambiarVista: (vista: Vista) => void;
}

/** Franja de NissiDev, fija arriba en todas las pantallas: sello, vista cliente/dueño y salir. */
export function Marco({ vista, cambiarVista }: Props) {
  return (
    <div className="demo-marco">
      <p className="demo-marco__sello">Demo · datos de ejemplo</p>
      <div className="demo-marco__vistas" role="group" aria-label="Vista de la demo">
        <button type="button" aria-pressed={vista === 'cliente'} onClick={() => cambiarVista('cliente')}>
          Cliente
        </button>
        <button type="button" aria-pressed={vista === 'dueno'} onClick={() => cambiarVista('dueno')}>
          Dueño
        </button>
      </div>
      <a className="demo-marco__salir" href="/" aria-label="Salir de la demo y volver a NissiDev">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </a>
    </div>
  );
}
