import { agregarLinea, cambiarCantidad, cambiarPresentacion, unidadesBaseDelProducto } from './pedido';
import type { Pedido, Producto } from './tipos';

// El pedido de la demo NO descuenta stock: solo valida que lo pedido de un producto, sumando todas
// sus presentaciones en unidad base, no supere lo disponible. El producto nunca se modifica.

export type MotivoRechazo = 'cantidad-invalida' | 'agotado' | 'excede-disponible';

export type ResultadoPedido =
  | { ok: true; pedido: Pedido }
  | { ok: false; pedido: Pedido; motivo: MotivoRechazo; mensaje: string };

const esCantidadValida = (cantidad: number) => Number.isSafeInteger(cantidad) && cantidad >= 1;

const estaAgotado = (producto: Producto) => producto.stock <= 0 || producto.etiqueta === 'agotado';

/** Unidades base que todavía se pueden pedir de este producto. */
export function disponibleParaAgregar(producto: Producto, pedido: Pedido): number {
  if (estaAgotado(producto)) return 0;
  return Math.max(0, producto.stock - unidadesBaseDelProducto(pedido, producto.id));
}

const sinLinea = (pedido: Pedido, lineaId: string): Pedido => ({
  ...pedido,
  lineas: pedido.lineas.filter((l) => l.id !== lineaId),
});

/** Aplica el cambio solo si la cantidad es válida y el total del producto cabe en el stock. */
function validar(
  pedido: Pedido,
  producto: Producto,
  cantidad: number,
  cambio: () => Pedido,
  lineaEditada?: string,
): ResultadoPedido {
  if (!esCantidadValida(cantidad)) {
    return { ok: false, pedido, motivo: 'cantidad-invalida', mensaje: 'Elige una cantidad de 1 o más.' };
  }
  if (estaAgotado(producto)) {
    return { ok: false, pedido, motivo: 'agotado', mensaje: `${producto.nombre} está agotado.` };
  }

  const tentativo = cambio();
  const pedidoTotal = unidadesBaseDelProducto(tentativo, producto.id);
  if (pedidoTotal <= producto.stock) return { ok: true, pedido: tentativo };

  const sugerencia = lineaEditada
    ? `En esta línea caben hasta ${disponibleParaAgregar(producto, sinLinea(pedido, lineaEditada))} unidades.`
    : `Puedes agregar hasta ${disponibleParaAgregar(producto, pedido)} unidades más.`;
  return {
    ok: false,
    pedido,
    motivo: 'excede-disponible',
    mensaje: `Solo hay ${producto.stock} unidades de ${producto.nombre} y tu pedido llegaría a ${pedidoTotal}. ${sugerencia}`,
  };
}

export function intentarAgregar(
  pedido: Pedido,
  producto: Producto,
  presentacionId: string,
  cantidad: number,
): ResultadoPedido {
  return validar(pedido, producto, cantidad, () => agregarLinea(pedido, producto, presentacionId, cantidad));
}

export function intentarCambiarCantidad(
  pedido: Pedido,
  producto: Producto,
  lineaId: string,
  cantidad: number,
): ResultadoPedido {
  return validar(pedido, producto, cantidad, () => cambiarCantidad(pedido, lineaId, cantidad), lineaId);
}

export function intentarCambiarPresentacion(
  pedido: Pedido,
  producto: Producto,
  lineaId: string,
  presentacionId: string,
): ResultadoPedido {
  const cantidad = pedido.lineas.find((l) => l.id === lineaId)?.cantidad ?? 1;
  return validar(
    pedido,
    producto,
    cantidad,
    () => cambiarPresentacion(pedido, lineaId, producto, presentacionId),
    lineaId,
  );
}
