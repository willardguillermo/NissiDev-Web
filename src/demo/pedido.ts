import type { LineaPedido, Pedido, Presentacion, Producto } from './tipos';

export const PEDIDO_VACIO: Pedido = { lineas: [] };

const idLinea = (productoId: string, presentacionId: string) => `${productoId}:${presentacionId}`;

function exigirCantidad(cantidad: number) {
  if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
    throw new RangeError(`Cantidad inválida: ${cantidad}. Se espera un entero ≥ 1.`);
  }
}

/**
 * Copia profunda de la presentación (incluido el precio por mayor): la línea no debe cambiar
 * aunque después se modifique el catálogo. Nunca se guarda una referencia a sus objetos.
 */
function copiarPresentacion(producto: Producto, presentacionId: string): Presentacion {
  const presentacion = producto.presentaciones.find((p) => p.id === presentacionId);
  if (!presentacion) throw new Error(`"${producto.nombre}" no tiene la presentación "${presentacionId}"`);
  return structuredClone(presentacion);
}

export function aUnidadBase(cantidad: number, factor: number): number {
  return cantidad * factor;
}

/** Une la línea con otra del mismo producto y presentación, si existe. */
function ponerLinea(lineas: LineaPedido[], nueva: LineaPedido): LineaPedido[] {
  const existente = lineas.find((l) => l.id === nueva.id);
  if (!existente) return [...lineas, nueva];
  return lineas.map((l) => (l.id === nueva.id ? { ...l, cantidad: l.cantidad + nueva.cantidad } : l));
}

export function agregarLinea(pedido: Pedido, producto: Producto, presentacionId: string, cantidad: number): Pedido {
  exigirCantidad(cantidad);
  const presentacion = copiarPresentacion(producto, presentacionId);
  const linea: LineaPedido = {
    id: idLinea(producto.id, presentacion.id),
    productoId: producto.id,
    presentacion,
    cantidad,
  };
  return { ...pedido, lineas: ponerLinea(pedido.lineas, linea) };
}

export function cambiarPresentacion(
  pedido: Pedido,
  lineaId: string,
  producto: Producto,
  nuevaPresentacionId: string,
): Pedido {
  const linea = pedido.lineas.find((l) => l.id === lineaId);
  if (!linea) return pedido;
  const presentacion = copiarPresentacion(producto, nuevaPresentacionId);
  const nueva: LineaPedido = { ...linea, id: idLinea(producto.id, presentacion.id), presentacion };
  const resto = pedido.lineas.filter((l) => l.id !== lineaId);
  // Si ya había una línea con esa presentación, se juntan; si no, la línea queda en su lugar.
  if (resto.some((l) => l.id === nueva.id)) return { ...pedido, lineas: ponerLinea(resto, nueva) };
  return { ...pedido, lineas: pedido.lineas.map((l) => (l.id === lineaId ? nueva : l)) };
}

export function cambiarCantidad(pedido: Pedido, lineaId: string, cantidad: number): Pedido {
  exigirCantidad(cantidad);
  if (!pedido.lineas.some((l) => l.id === lineaId)) return pedido;
  return { ...pedido, lineas: pedido.lineas.map((l) => (l.id === lineaId ? { ...l, cantidad } : l)) };
}

export function eliminarLinea(pedido: Pedido, lineaId: string): Pedido {
  if (!pedido.lineas.some((l) => l.id === lineaId)) return pedido;
  return { ...pedido, lineas: pedido.lineas.filter((l) => l.id !== lineaId) };
}

/** Precio por presentación: el de mayorista si la línea llega a la cantidad mínima. */
export function precioUnitario({ presentacion, cantidad }: LineaPedido): number {
  const mayorista = presentacion.precioMayorista;
  return mayorista && cantidad >= mayorista.cantidadMinima ? mayorista.precio : presentacion.precio;
}

export function subtotal(linea: LineaPedido): number {
  return precioUnitario(linea) * linea.cantidad;
}

export function totalPedido(pedido: Pedido): number {
  return pedido.lineas.reduce((total, linea) => total + subtotal(linea), 0);
}

/** Unidades base que el pedido pide de un producto, sumando todas sus presentaciones. */
/** Cuántas presentaciones lleva el pedido (para "Mi pedido (n)"): 2 bolsas + 3 unidades = 5. */
export function presentacionesEnPedido(pedido: Pedido): number {
  return pedido.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}

export function unidadesBaseDelProducto(pedido: Pedido, productoId: string): number {
  return pedido.lineas
    .filter((l) => l.productoId === productoId)
    .reduce((total, l) => total + aUnidadBase(l.cantidad, l.presentacion.factor), 0);
}
