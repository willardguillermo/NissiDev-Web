import { formatearSoles } from '../../ui/formato';
import type { Inmueble, Moneda } from './tipos';

// Precio en su moneda y su equivalente aproximado en la otra. Montos en céntimos.

const dolares = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });

export function formatearDolares(centimos: number): string {
  if (!Number.isSafeInteger(centimos) || centimos < 0) throw new RangeError(`Monto inválido: ${centimos}`);
  return `US$ ${dolares.format(Math.round(centimos / 100))}`;
}

export const formatearMonto = (moneda: Moneda, centimos: number) =>
  moneda === 'USD' ? formatearDolares(centimos) : formatearSoles(centimos);

/** Redondea a soles o dólares enteros: un equivalente aproximado no lleva céntimos. */
const entero = (centimos: number) => Math.round(centimos / 100) * 100;

/** El precio en soles (en céntimos), convertido si está en dólares. Sirve para filtrar y ordenar. */
export function precioEnSoles({ precio }: Pick<Inmueble, 'precio'>, tipoCambio: number): number {
  return precio.moneda === 'PEN' ? precio.centimos : entero(precio.centimos * tipoCambio);
}

export interface TextoPrecio {
  principal: string;
  /** «≈ S/ 450,000» o «≈ US$ 480»; aproximado según el tipo de cambio de ejemplo. */
  equivalente: string;
  /** «/mes» en alquiler. */
  sufijo: string;
}

export function textoPrecio(inmueble: Pick<Inmueble, 'precio' | 'operacion'>, tipoCambio: number): TextoPrecio {
  const { moneda, centimos } = inmueble.precio;
  const otra: Moneda = moneda === 'USD' ? 'PEN' : 'USD';
  const convertido = moneda === 'USD' ? entero(centimos * tipoCambio) : entero(centimos / tipoCambio);
  return {
    principal: formatearMonto(moneda, centimos),
    equivalente: `≈ ${formatearMonto(otra, convertido)}`,
    sufijo: inmueble.operacion === 'alquiler' ? '/mes' : '',
  };
}
