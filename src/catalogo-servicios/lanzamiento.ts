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
