import type { Ref } from 'react';
import './Interruptor.css';

interface Props {
  encendido: boolean;
  /** Nombre que leen los lectores de pantalla (el del módulo). */
  etiqueta: string;
  onCambiar: () => void;
  ref?: Ref<HTMLButtonElement>;
}

/** Interruptor accesible: role="switch" + aria-checked. Área táctil de 52 × 44 px. */
export function Interruptor({ encendido, etiqueta, onCambiar, ref }: Props) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={encendido}
      aria-label={etiqueta}
      className="interruptor"
      onClick={onCambiar}
    >
      <span className="interruptor__pista" aria-hidden="true">
        <span className="interruptor__perilla" />
      </span>
    </button>
  );
}
