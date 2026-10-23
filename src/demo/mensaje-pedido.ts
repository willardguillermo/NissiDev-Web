import { precioUnitario, subtotal, totalPedido } from './pedido';
import { contarPresentacion } from './presentaciones';
import type { LineaPedido, Pedido, RubroConfig } from './tipos';
import { formatearSoles } from '../ui/formato';

// El mensaje que le llegaría al WhatsApp del negocio. La demo solo lo muestra (P3).

export interface DatosEnvio {
  cliente: string;
  /** Número de puesto; con un solo puesto se recoge en la tienda. */
  puesto?: number;
}

export type ErrorEnvio = 'vacio' | 'cliente' | 'puesto';

/** Qué falta para poder enviar, en el orden en que aparece en la pantalla. */
export function faltaParaEnviar(config: RubroConfig, pedido: Pedido, datos: DatosEnvio): ErrorEnvio[] {
  const errores: ErrorEnvio[] = [];
  if (pedido.lineas.length === 0) errores.push('vacio');
  if (config.puestos.length > 1 && !config.puestos.some((p) => p.numero === datos.puesto)) errores.push('puesto');
  if (!datos.cliente.trim()) errores.push('cliente');
  return errores;
}

const conFactor = ({ presentacion, cantidad }: LineaPedido) =>
  presentacion.factor > 1
    ? `${contarPresentacion(cantidad, presentacion)} x${presentacion.factor}`
    : contarPresentacion(cantidad, presentacion);

export function mensajePedido(config: RubroConfig, pedido: Pedido, datos: DatosEnvio): string {
  const nombreDe = (id: string) => config.productos.find((p) => p.id === id)?.nombre ?? id;
  const lineas = pedido.lineas.map((linea) => {
    const mayor = precioUnitario(linea) < linea.presentacion.precio ? ' (precio por mayor)' : '';
    return `• ${conFactor(linea)} de ${nombreDe(linea.productoId)}: ${formatearSoles(subtotal(linea))}${mayor}`;
  });
  const puesto = config.puestos.find((p) => p.numero === datos.puesto);
  const recojo =
    config.puestos.length === 1
      ? `Recojo: en la tienda (${config.puestos[0].referencia})`
      : `Recojo: ${puesto?.nombre ?? 'por elegir'}${puesto ? ` (${puesto.referencia})` : ''}`;

  return [
    `Hola, ${config.negocio}. Quiero hacer este pedido:`,
    '',
    ...lineas,
    '',
    `Total: ${formatearSoles(totalPedido(pedido))}`,
    recojo,
    `Nombre: ${datos.cliente.trim()}`,
  ].join('\n');
}
