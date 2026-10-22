import { describe, expect, it } from 'vitest';
import { formatearFecha } from './fecha';

describe('formatearFecha', () => {
  it('día/mes/año con ceros', () => {
    expect(formatearFecha({ anio: 2026, mes: 1, dia: 5 })).toBe('05/01/2026');
    expect(formatearFecha({ anio: 2026, mes: 12, dia: 31 })).toBe('31/12/2026');
  });
});
