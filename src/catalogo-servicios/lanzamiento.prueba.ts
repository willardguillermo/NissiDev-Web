import type { Lanzamiento } from './lanzamiento';

// Configuraciones FIJAS para los tests. Ningún test lee el LANZAMIENTO real (salvo el que lo valida):
// así, subir `usados` al cerrar un proyecto real no rompe `npm test`.
const BASE = { modulo: 'catalogo-web', cupos: 5, precioCentimos: 70000 } as const;

export const LANZAMIENTO_ACTIVO: Lanzamiento = { ...BASE, usados: 0 };
export const LANZAMIENTO_UNO_USADO: Lanzamiento = { ...BASE, usados: 1 };
export const LANZAMIENTO_ULTIMO_CUPO: Lanzamiento = { ...BASE, usados: 4 };
export const LANZAMIENTO_AGOTADO: Lanzamiento = { ...BASE, usados: 5 };
