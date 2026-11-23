import type { Vista } from '../navegacion';

// Navegación de la demo inmobiliaria: en memoria y en el historial (Atrás vuelve a la pantalla anterior).
// Los filtros no van aquí: viven aparte en la isla y siguen iguales al volver de una ficha o del panel.

export type PantallaInmo = 'catalogo' | 'ficha' | 'agente';

export interface NavegacionInmo {
  vista: Vista;
  pantalla: PantallaInmo;
  /** Inmueble abierto en la ficha. */
  codigo?: string;
}

export type AccionInmo =
  | { tipo: 'vista'; vista: Vista }
  | { tipo: 'catalogo' }
  | { tipo: 'agente' }
  | { tipo: 'ficha'; codigo: string };

export const NAVEGACION_INMO_INICIAL: NavegacionInmo = { vista: 'cliente', pantalla: 'catalogo' };

/** Cambiar de vista conserva la pantalla del cliente: al volver, sigue donde estaba. */
export function navegarInmo(estado: NavegacionInmo, accion: AccionInmo): NavegacionInmo {
  switch (accion.tipo) {
    case 'vista':
      return { ...estado, vista: accion.vista };
    case 'catalogo':
    case 'agente':
      return { vista: 'cliente', pantalla: accion.tipo };
    case 'ficha':
      return { vista: 'cliente', pantalla: 'ficha', codigo: accion.codigo };
  }
}
