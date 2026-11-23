import { describe, expect, it } from 'vitest';
import { formatearDolares, precioEnSoles, textoPrecio } from './precio';

describe('precio de un inmueble', () => {
  it('venta en dólares con su equivalente en soles', () => {
    expect(textoPrecio({ operacion: 'venta', precio: { moneda: 'USD', centimos: 12_800_000 } }, 3.75)).toEqual({
      principal: 'US$ 128,000',
      equivalente: '≈ S/ 480,000',
      sufijo: '',
    });
  });

  it('alquiler en soles, por mes, con su equivalente en dólares redondeado', () => {
    expect(textoPrecio({ operacion: 'alquiler', precio: { moneda: 'PEN', centimos: 185_000 } }, 3.75)).toEqual({
      principal: 'S/ 1,850',
      equivalente: '≈ US$ 493',
      sufijo: '/mes',
    });
  });

  it('precioEnSoles convierte solo los dólares', () => {
    expect(precioEnSoles({ precio: { moneda: 'PEN', centimos: 120_000 } }, 3.75)).toBe(120_000);
    expect(precioEnSoles({ precio: { moneda: 'USD', centimos: 9_500_000 } }, 3.75)).toBe(35_625_000);
  });

  it('formatearDolares rechaza montos inválidos', () => {
    expect(formatearDolares(0)).toBe('US$ 0');
    expect(() => formatearDolares(-1)).toThrow(RangeError);
    expect(() => formatearDolares(1.5)).toThrow(RangeError);
  });
});
