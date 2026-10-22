import { obtenerModulo } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { calcularTotales } from '../carrito/carrito';
import { unirTextos } from '../carrito/textos';
import { WHATSAPP_ENLACE } from '../config/contacto';
import { formatearSoles } from '../ui/formato';
import { formatearFecha } from './fecha';
import type { Cotizacion } from './tipos';

const LARGO_MAXIMO_NEGOCIO = 80;

/** Una sola línea y de largo razonable: el nombre no puede imitar otras líneas del mensaje. */
function limpiarNegocio(negocio: string | undefined): string {
  return (negocio ?? '').replace(/\s+/g, ' ').trim().slice(0, LARGO_MAXIMO_NEGOCIO);
}

/** Texto plano para WhatsApp: líneas cortas, sin tablas ni emojis, fácil de leer en el celular. */
export function mensajeWhatsApp({ codigo, emitida, validaHasta, carrito, negocio }: Cotizacion): string {
  const modulos = carrito.items.map(obtenerModulo);
  const { inicial, mensual } = calcularTotales(carrito);
  const porCotizar = modulos.filter((m) => m.precioInicial.tipo === 'cotizar');
  const nombreNegocio = limpiarNegocio(negocio);

  const lineaInicial =
    inicial === 0 && porCotizar.length > 0
      ? 'Inversión inicial: por cotizar'
      : `Inversión inicial: desde ${formatearSoles(inicial)}${porCotizar.length > 0 ? ' (sin contar lo que falta cotizar)' : ''}`;

  const faltaCotizar = porCotizar.map((m) => (m.mensualidad ? `${m.nombre} (instalación)` : m.nombre));

  return [
    'Hola, NissiDev. Quiero una cotización para este sistema:',
    '',
    `Cotización: ${codigo}`,
    `Fecha: ${formatearFecha(emitida)}`,
    `Válida hasta: ${formatearFecha(validaHasta)}`,
    ...(nombreNegocio ? [`Negocio: ${nombreNegocio}`] : []),
    '',
    'Módulos:',
    ...modulos.map((m) => `- ${m.nombre}: ${textoPrecio(m)}`),
    '',
    lineaInicial,
    ...(faltaCotizar.length > 0 ? [`Falta cotizar: ${unirTextos(faltaCotizar)}`] : []),
    `Mensualidad: ${mensual > 0 ? `${formatearSoles(mensual)}/mes` : 'sin mensualidad'}`,
    '',
    'Precios referenciales; la cotización final se confirma por WhatsApp.',
  ].join('\n');
}

export function enlaceWhatsApp(texto: string): string {
  return `${WHATSAPP_ENLACE}?text=${encodeURIComponent(texto)}`;
}
