import type { SeleccionVitrina } from '../catalogo-servicios/vitrina';
import type { Carrito } from '../carrito/carrito';
import type { FechaLocal } from './fecha';

export interface Cotizacion {
  /** NSD-AAAA-XXXX */
  codigo: string;
  emitida: FechaLocal;
  /** emitida + 15 días */
  validaHasta: FechaLocal;
  carrito: Carrito;
  /** Paquete Vitrina, aparte de los módulos. Sin él, no hay Vitrina. */
  vitrina?: SeleccionVitrina;
  /** Nombre del negocio, opcional. No se guarda: solo viaja en el mensaje. */
  negocio?: string;
}
