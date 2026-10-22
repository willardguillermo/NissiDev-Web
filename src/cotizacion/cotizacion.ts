import type { Carrito } from '../carrito/carrito';
import { sumarDias, type FechaLocal } from './fecha';
import type { Cotizacion } from './tipos';

export const DIAS_VALIDEZ = 15;

/** Sin 0/O ni 1/I/L, para que el código se pueda dictar y copiar sin confusiones. */
export const ALFABETO_CODIGO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const LARGO_CODIGO = 4;
// Un byte va de 0 a 255; solo se usan los menores a 248 (31 × 8) para que cada carácter
// tenga la misma probabilidad. Los demás se descartan y se piden bytes nuevos.
const LIMITE_SIN_SESGO = Math.floor(256 / ALFABETO_CODIGO.length) * ALFABETO_CODIGO.length;

/** Misma firma que crypto.getRandomValues: llena el arreglo con bytes al azar. */
export type FuenteAleatoria = (destino: Uint8Array<ArrayBuffer>) => unknown;

const azarDelNavegador: FuenteAleatoria = (destino) => crypto.getRandomValues(destino);

/** Código único sin servidor ni correlativo: NSD-AAAA-XXXX. */
export function generarCodigo(anio: number, aleatorio: FuenteAleatoria = azarDelNavegador): string {
  let sufijo = '';
  const bytes = new Uint8Array(LARGO_CODIGO);
  while (sufijo.length < LARGO_CODIGO) {
    aleatorio(bytes);
    for (const byte of bytes) {
      if (byte < LIMITE_SIN_SESGO && sufijo.length < LARGO_CODIGO) {
        sufijo += ALFABETO_CODIGO[byte % ALFABETO_CODIGO.length];
      }
    }
  }
  return `NSD-${anio}-${sufijo}`;
}

export function crearCotizacion({
  carrito,
  emitida,
  negocio,
  aleatorio,
}: {
  carrito: Carrito;
  emitida: FechaLocal;
  negocio?: string;
  aleatorio?: FuenteAleatoria;
}): Cotizacion {
  return {
    codigo: generarCodigo(emitida.anio, aleatorio),
    emitida,
    validaHasta: sumarDias(emitida, DIAS_VALIDEZ),
    carrito,
    negocio,
  };
}
