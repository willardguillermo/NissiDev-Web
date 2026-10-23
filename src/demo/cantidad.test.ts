import { describe, expect, it } from 'vitest';
import { normalizarCantidad } from './cantidad';

describe('normalizarCantidad', () => {
  it('deja igual una cantidad válida', () => {
    expect(normalizarCantidad(3)).toBe(3);
    expect(normalizarCantidad('12')).toBe(12);
  });

  it.each([NaN, 0, -5, '', '   ', 'abc', '-2', '0'])('%s → 1, el mínimo válido', (valor) => {
    expect(normalizarCantidad(valor)).toBe(1);
  });

  it('redondea los decimales hacia abajo, sin bajar de 1', () => {
    expect(normalizarCantidad(2.9)).toBe(2);
    expect(normalizarCantidad('0.5')).toBe(1);
  });

  it('los números enormes quedan en el máximo', () => {
    expect(normalizarCantidad(1e30)).toBe(Number.MAX_SAFE_INTEGER);
    expect(normalizarCantidad(Infinity)).toBe(Number.MAX_SAFE_INTEGER);
    expect(normalizarCantidad('99999999999999999999')).toBe(Number.MAX_SAFE_INTEGER);
    expect(normalizarCantidad(1e30, 50)).toBe(50);
  });

  it('un máximo menor que 1 no deja la cantidad en 0', () => {
    expect(normalizarCantidad(4, 0)).toBe(1);
  });
});
