import { precioEnSoles } from './precio';
import type { Inmueble, Operacion } from './tipos';

// Filtros del catálogo de inmuebles. Vacío = todos. El precio depende de la operación: no se compara
// un alquiler mensual con un precio de venta, así que sus rangos solo existen al elegir venta o alquiler.

export interface FiltrosInmueble {
  operacion?: Operacion;
  distrito?: string;
  /** Id de un rango de RANGOS_PRECIO de la operación elegida. */
  precio?: string;
  /** Dormitorios como mínimo: 1, 2 o 3 (3 = «3 o más»). */
  dormitorios?: number;
}

export interface RangoPrecio {
  id: string;
  nombre: string;
  /** En céntimos de sol, incluidos. */
  desde: number;
  hasta: number;
}

const SIN_TOPE = Number.MAX_SAFE_INTEGER;

export const RANGOS_PRECIO: Record<Operacion, RangoPrecio[]> = {
  alquiler: [
    { id: 'hasta-1500', nombre: 'Hasta S/ 1,500', desde: 0, hasta: 150_000 },
    { id: '1500-3000', nombre: 'S/ 1,500 a 3,000', desde: 150_001, hasta: 300_000 },
    { id: 'mas-3000', nombre: 'Más de S/ 3,000', desde: 300_001, hasta: SIN_TOPE },
  ],
  venta: [
    { id: 'hasta-400k', nombre: 'Hasta S/ 400 mil', desde: 0, hasta: 40_000_000 },
    { id: '400k-800k', nombre: 'S/ 400 a 800 mil', desde: 40_000_001, hasta: 80_000_000 },
    { id: 'mas-800k', nombre: 'Más de S/ 800 mil', desde: 80_000_001, hasta: SIN_TOPE },
  ],
};

export const OPCIONES_DORMITORIOS = [1, 2, 3] as const;

export function rangoDe(filtros: FiltrosInmueble): RangoPrecio | undefined {
  if (!filtros.operacion || !filtros.precio) return undefined;
  return RANGOS_PRECIO[filtros.operacion].find((r) => r.id === filtros.precio);
}

/** Al cambiar la operación, el rango de precio de la otra deja de tener sentido y se quita. */
export function cambiarOperacion(filtros: FiltrosInmueble, operacion: Operacion | undefined): FiltrosInmueble {
  const siguiente: FiltrosInmueble = { ...filtros, operacion };
  if (operacion !== filtros.operacion) delete siguiente.precio;
  if (!operacion) delete siguiente.operacion;
  return siguiente;
}

export function filtrarInmuebles(inmuebles: Inmueble[], filtros: FiltrosInmueble, tipoCambio: number): Inmueble[] {
  const rango = rangoDe(filtros);
  return inmuebles.filter((i) => {
    if (filtros.operacion && i.operacion !== filtros.operacion) return false;
    if (filtros.distrito && i.distrito !== filtros.distrito) return false;
    if (filtros.dormitorios && i.dormitorios < filtros.dormitorios) return false;
    if (rango) {
      const soles = precioEnSoles(i, tipoCambio);
      if (soles < rango.desde || soles > rango.hasta) return false;
    }
    return true;
  });
}

export const cuantosFiltros = (f: FiltrosInmueble) =>
  [f.operacion, f.distrito, rangoDe(f), f.dormitorios].filter((x) => x !== undefined).length;
