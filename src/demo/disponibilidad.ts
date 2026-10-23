import { agregarLinea, cambiarCantidad, cambiarPresentacion, unidadesBaseDelProducto } from './pedido';
import { contarPresentacion } from './presentaciones';
import type { Pedido, Presentacion, Producto } from './tipos';

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

/** Mensaje en la presentación de la línea: en una línea de bolsas se habla de bolsas. */
function mensajeExceso(producto: Producto, presentacion: Presentacion, disponible: number, editando: boolean): string {
  const caben = Math.floor(disponible / presentacion.factor);
  if (editando) {
    return caben >= 1
      ? `En esta línea caben hasta ${contarPresentacion(caben, presentacion)} de ${producto.nombre}.`
      : `No alcanza para ${contarPresentacion(1, presentacion)} de ${producto.nombre}.`;
  }
  if (caben >= 1) return `Solo alcanza para ${contarPresentacion(caben, presentacion)} más de ${producto.nombre}.`;
  if (disponible > 0) {
    return `No alcanza para ${contarPresentacion(1, presentacion)} más de ${producto.nombre}: quedan ${disponible} ${disponible === 1 ? 'unidad' : 'unidades'}.`;
  }
  return `Ya tienes en tu pedido todo lo que hay de ${producto.nombre}.`;
}

/** Aplica el cambio solo si la cantidad es válida y el total del producto cabe en el stock. */
function validar(
  pedido: Pedido,
  producto: Producto,
  presentacion: Presentacion,
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
  if (unidadesBaseDelProducto(tentativo, producto.id) <= producto.stock) return { ok: true, pedido: tentativo };

  const disponible = disponibleParaAgregar(producto, lineaEditada ? sinLinea(pedido, lineaEditada) : pedido);
  return {
    ok: false,
    pedido,
    motivo: 'excede-disponible',
    mensaje: mensajeExceso(producto, presentacion, disponible, lineaEditada !== undefined),
  };
}

const presentacionDe = (producto: Producto, id: string): Presentacion => {
  const presentacion = producto.presentaciones.find((p) => p.id === id);
  if (!presentacion) throw new Error(`"${producto.nombre}" no tiene la presentación "${id}"`);
  return presentacion;
};

export function intentarAgregar(
  pedido: Pedido,
  producto: Producto,
  presentacionId: string,
  cantidad: number,
): ResultadoPedido {
  const presentacion = presentacionDe(producto, presentacionId);
  return validar(pedido, producto, presentacion, cantidad, () => agregarLinea(pedido, producto, presentacionId, cantidad));
}

export function intentarCambiarCantidad(
  pedido: Pedido,
  producto: Producto,
  lineaId: string,
  cantidad: number,
): ResultadoPedido {
  // La línea guarda su propia presentación (con el factor de cuando se agregó).
  const linea = pedido.lineas.find((l) => l.id === lineaId);
  const presentacion = linea?.presentacion ?? presentacionDe(producto, lineaId.split(':')[1]);
  return validar(pedido, producto, presentacion, cantidad, () => cambiarCantidad(pedido, lineaId, cantidad), lineaId);
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
    presentacionDe(producto, presentacionId),
    cantidad,
    () => cambiarPresentacion(pedido, lineaId, producto, presentacionId),
    lineaId,
  );
}
