import { describe, expect, it } from 'vitest';
import { cargarSugerido } from '../carrito/sugeridos';
import { ALFABETO_CODIGO, crearCotizacion, DIAS_VALIDEZ, generarCodigo, type FuenteAleatoria } from './cotizacion';
import { fechaLocalDeHoy, sumarDias } from './fecha';

/** Fuente de azar de prueba que entrega estos bytes en orden. */
function bytesFijos(...bytes: number[]): FuenteAleatoria {
  let i = 0;
  return (destino) => {
    for (let j = 0; j < destino.length; j++) destino[j] = bytes[i++ % bytes.length];
    return destino;
  };
}

describe('generarCodigo', () => {
  it('formato NSD-AAAA-XXXX con el año de emisión', () => {
    expect(generarCodigo(2026, bytesFijos(0, 1, 2, 3))).toBe('NSD-2026-2345');
    expect(generarCodigo(2031, bytesFijos(30))).toBe('NSD-2031-ZZZZ');
  });

  it('el alfabeto no tiene 0, O, 1, I ni L', () => {
    expect(ALFABETO_CODIGO).toHaveLength(31);
    expect(ALFABETO_CODIGO).not.toMatch(/[0O1IL]/);
    expect(new Set(ALFABETO_CODIGO).size).toBe(ALFABETO_CODIGO.length);
  });

  it('descarta los bytes que sesgarían el azar (≥ 248) y pide más', () => {
    expect(generarCodigo(2026, bytesFijos(255, 248, 0, 247, 31, 62))).toBe('NSD-2026-2Z22');
  });

  it('con el azar real nunca salen caracteres prohibidos', () => {
    const formato = /^NSD-2026-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/;
    for (let i = 0; i < 2000; i++) {
      expect(generarCodigo(2026)).toMatch(formato);
    }
  });
});

describe('sumarDias', () => {
  it.each([
    ['dentro del mes', { anio: 2026, mes: 10, dia: 1 }, { anio: 2026, mes: 10, dia: 16 }],
    ['cruzando fin de mes', { anio: 2026, mes: 10, dia: 21 }, { anio: 2026, mes: 11, dia: 5 }],
    ['cruzando fin de año', { anio: 2026, mes: 12, dia: 25 }, { anio: 2027, mes: 1, dia: 9 }],
    ['febrero de año bisiesto (29 días)', { anio: 2028, mes: 2, dia: 20 }, { anio: 2028, mes: 3, dia: 6 }],
    ['febrero de año no bisiesto (28 días)', { anio: 2026, mes: 2, dia: 20 }, { anio: 2026, mes: 3, dia: 7 }],
    ['desde el 29 de febrero', { anio: 2028, mes: 2, dia: 29 }, { anio: 2028, mes: 3, dia: 15 }],
  ])('%s', (_caso, desde, esperado) => {
    expect(sumarDias(desde, 15)).toEqual(esperado);
  });
});

describe('fechaLocalDeHoy', () => {
  it('usa la fecha local, sin horas', () => {
    expect(fechaLocalDeHoy(new Date(2026, 9, 21, 23, 59, 59))).toEqual({ anio: 2026, mes: 10, dia: 21 });
    expect(fechaLocalDeHoy(new Date(2027, 0, 1, 0, 0, 0))).toEqual({ anio: 2027, mes: 1, dia: 1 });
  });
});

describe('crearCotizacion', () => {
  it('arma código, fechas y carrito; válida 15 días', () => {
    const carrito = cargarSugerido('dulceria');
    const cotizacion = crearCotizacion({
      carrito,
      emitida: { anio: 2026, mes: 10, dia: 21 },
      negocio: 'La Golosa',
      aleatorio: bytesFijos(0, 1, 2, 3),
    });
    expect(DIAS_VALIDEZ).toBe(15);
    expect(cotizacion).toEqual({
      codigo: 'NSD-2026-2345',
      emitida: { anio: 2026, mes: 10, dia: 21 },
      validaHasta: { anio: 2026, mes: 11, dia: 5 },
      carrito,
      negocio: 'La Golosa',
    });
  });

  it('el año del código es el de la fecha de emisión', () => {
    const cotizacion = crearCotizacion({ carrito: cargarSugerido('dulceria'), emitida: { anio: 2027, mes: 1, dia: 2 } });
    expect(cotizacion.codigo).toMatch(/^NSD-2027-/);
  });
});
