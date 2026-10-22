import { esModuloId, obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';
import { agregarModulo, CARRITO_VACIO, type Carrito } from './carrito';

// Lo guardado en localStorage puede estar roto, ser de una versión vieja o haber sido editado a mano:
// se valida todo y se reconstruye con las mismas reglas del carrito antes de calcular totales.

function leerIds(valorGuardado: string | null | undefined): ModuloId[] {
  if (!valorGuardado) return [];
  let datos: unknown;
  try {
    datos = JSON.parse(valorGuardado);
  } catch {
    return [];
  }
  if (typeof datos !== 'object' || datos === null || !('items' in datos) || !Array.isArray(datos.items)) {
    return [];
  }
  return [...new Set(datos.items.filter(esModuloId))];
}

export function restaurarCarrito(valorGuardado: string | null | undefined): Carrito {
  const ids = leerIds(valorGuardado);
  // Los que requieren otro módulo van al final, para que ya exista ese otro módulo al agregarlos.
  const ordenados = [
    ...ids.filter((id) => !obtenerModulo(id).requiereOtroModulo),
    ...ids.filter((id) => obtenerModulo(id).requiereOtroModulo),
  ];
  return ordenados.reduce((carrito, id) => agregarModulo(carrito, id).carrito, CARRITO_VACIO);
}

export function serializarCarrito(carrito: Carrito): string {
  return JSON.stringify({ items: carrito.items });
}
