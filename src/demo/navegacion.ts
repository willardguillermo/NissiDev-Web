import type { Filtros } from './filtros';

// Navegación interna de la demo: en memoria, sin rutas. La isla la guarda en el historial
// para que el botón Atrás del celular vuelva a la pantalla anterior en vez de salir.

export type Vista = 'cliente' | 'dueno';
export type Pantalla = 'inicio' | 'catalogo' | 'detalle' | 'pedido';

export interface Navegacion {
  vista: Vista;
  pantalla: Pantalla;
  /** Producto abierto en el detalle. */
  productoId?: string;
  /** Filtros con los que se abre el catálogo (desde una categoría, una ocasión o el buscador). */
  filtros?: Filtros;
}

export type Accion =
  | { tipo: 'vista'; vista: Vista }
  | { tipo: 'inicio' }
  | { tipo: 'pedido' }
  | { tipo: 'catalogo'; filtros?: Filtros }
  | { tipo: 'detalle'; productoId: string };

export const NAVEGACION_INICIAL: Navegacion = { vista: 'cliente', pantalla: 'inicio' };

/** Cambiar de vista conserva la pantalla del cliente: al volver, sigue donde estaba. */
export function navegar(estado: Navegacion, accion: Accion): Navegacion {
  switch (accion.tipo) {
    case 'vista':
      return { ...estado, vista: accion.vista };
    case 'inicio':
    case 'pedido':
      return { vista: 'cliente', pantalla: accion.tipo };
    case 'catalogo':
      return { vista: 'cliente', pantalla: 'catalogo', filtros: accion.filtros };
    case 'detalle':
      return { vista: 'cliente', pantalla: 'detalle', productoId: accion.productoId };
  }
}
