import { contarPresentacion } from './presentaciones';
import type { Presentacion, Producto } from './tipos';

// Qué precio muestra una tarjeta de producto: el de la unidad o el de comprar por mayor.

export interface PrecioVisible {
  presentacion: Presentacion;
  /** Céntimos por presentación. */
  precio: number;
  /** Desde cuántas presentaciones aplica (solo precio por mayor). */
  desde?: number;
}

/** La presentación más pequeña (la unidad base). */
export function precioUnidad(producto: Producto): PrecioVisible {
  const presentacion = [...producto.presentaciones].sort((a, b) => a.factor - b.factor)[0];
  return { presentacion, precio: presentacion.precio };
}

/**
 * Precio por mayor: la presentación más grande con precio mayorista. Si ninguna lo tiene,
 * la presentación más grande a su precio normal; si solo hay unidad, null.
 */
export function precioPorMayor(producto: Producto): PrecioVisible | null {
  const grandes = [...producto.presentaciones].filter((p) => p.factor > 1).sort((a, b) => b.factor - a.factor);
  const conMayor = grandes.find((p) => p.precioMayorista);
  if (conMayor?.precioMayorista) {
    return { presentacion: conMayor, precio: conMayor.precioMayorista.precio, desde: conMayor.precioMayorista.cantidadMinima };
  }
  return grandes[0] ? { presentacion: grandes[0], precio: grandes[0].precio } : null;
}

/** "desde 3 cajas", "desde 4 bolsas". */
export function textoDesde({ presentacion, desde }: PrecioVisible): string | null {
  return desde === undefined ? null : `desde ${contarPresentacion(desde, presentacion)}`;
}
