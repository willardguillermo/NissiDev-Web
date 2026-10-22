// Modelo de datos de las demos: el mismo que usaría el sistema real.
// Montos en céntimos enteros. Stock y cantidades del pedido se piensan en unidad base.

export interface PrecioMayorista {
  /** Desde cuántas presentaciones (bolsas, cajas…) en la misma línea aplica. */
  cantidadMinima: number;
  /** Precio por presentación, en céntimos. */
  precio: number;
}

export interface Presentacion {
  id: string;
  /** "Unidad", "Bolsa x6", "Caja x24" */
  nombre: string;
  /** Cuántas unidades base trae. La unidad base tiene factor 1. */
  factor: number;
  /** Precio por presentación, en céntimos. */
  precio: number;
  precioMayorista?: PrecioMayorista;
}

export type Etiqueta = 'nuevo' | 'oferta' | 'agotado';

export interface Producto {
  id: string;
  nombre: string;
  /** Siempre ficticia en la demo. */
  marca: string;
  categoria: string;
  ocasiones: string[];
  /** Números de puesto donde se encuentra. */
  puestos: number[];
  etiqueta?: Etiqueta;
  /** Existencias en unidad base. */
  stock: number;
  presentaciones: Presentacion[];
}

export interface Puesto {
  numero: number;
  queSeEncuentra: string;
  horario: string;
  referencia: string;
}

export interface Ocasion {
  id: string;
  nombre: string;
  activaEnHero: boolean;
}

/** Configuración de un rubro para el motor de demos (se completa en T14–T15). */
export interface RubroConfig {
  id: string;
  nombre: string;
  categorias: string[];
  ocasiones: Ocasion[];
  puestos: Puesto[];
  productos: Producto[];
}

/** Línea del pedido: guarda una copia de la presentación usada (factor y precios de ese momento). */
export interface LineaPedido {
  /** `${productoId}:${presentacion.id}` */
  id: string;
  productoId: string;
  presentacion: Presentacion;
  /** Cantidad de presentaciones (no de unidades base). */
  cantidad: number;
}

export interface Pedido {
  lineas: LineaPedido[];
  puestoRecojo?: number;
  cliente?: string;
}
