import { describe, expect, it } from 'vitest';
import { formatearSoles } from './formato';

describe('formatearSoles', () => {
  it('muestra cero', () => {
    expect(formatearSoles(0)).toBe('S/ 0');
  });

  it('muestra soles enteros sin decimales', () => {
    expect(formatearSoles(70000)).toBe('S/ 700');
    expect(formatearSoles(8000)).toBe('S/ 80');
  });

  it('separa los miles con coma', () => {
    expect(formatearSoles(100000)).toBe('S/ 1,000');
    expect(formatearSoles(123456700)).toBe('S/ 1,234,567');
  });

  it('muestra siempre dos decimales cuando hay céntimos', () => {
    expect(formatearSoles(6050)).toBe('S/ 60.50');
    expect(formatearSoles(5)).toBe('S/ 0.05');
    expect(formatearSoles(123450)).toBe('S/ 1,234.50');
  });

  it('rechaza montos que no son céntimos enteros', () => {
    expect(() => formatearSoles(70.5)).toThrow(RangeError);
    expect(() => formatearSoles(-100)).toThrow(RangeError);
    expect(() => formatearSoles(Number.NaN)).toThrow(RangeError);
  });
});
