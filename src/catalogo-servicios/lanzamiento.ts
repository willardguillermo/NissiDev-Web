import type { ModuloId } from './modulos';

// Precio de lanzamiento (2026-11-05): el único lugar que se toca al cerrar un proyecto.
// Regla: `usados` cuenta SOLO proyectos reales cerrados a este precio. No se inventa escasez.

export interface Lanzamiento {
  /** Módulo con precio de lanzamiento. */
  modulo: ModuloId;
  cupos: number;
  usados: number;
  precioCentimos: number;
}

export const LANZAMIENTO: Lanzamiento = { modulo: 'catalogo-web', cupos: 5, usados: 0, precioCentimos: 70000 };

/** Rige mientras queden cupos; al llenarse, el Catálogo vuelve solo a su precio normal. */
export const lanzamientoActivo = (lanzamiento: Lanzamiento = LANZAMIENTO) => lanzamiento.usados < lanzamiento.cupos;

export const cuposDisponibles = (lanzamiento: Lanzamiento = LANZAMIENTO) =>
  Math.max(0, lanzamiento.cupos - lanzamiento.usados);

/** cupos es un entero > 0 y usados un entero entre 0 y cupos. Un test lo exige a la configuración real. */
export const lanzamientoValido = ({ cupos, usados, precioCentimos }: Lanzamiento) =>
  Number.isSafeInteger(cupos) &&
  cupos > 0 &&
  Number.isSafeInteger(usados) &&
  usados >= 0 &&
  usados <= cupos &&
  Number.isSafeInteger(precioCentimos) &&
  precioCentimos > 0;
