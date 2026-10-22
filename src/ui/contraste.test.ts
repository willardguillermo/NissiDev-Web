import { describe, expect, it } from 'vitest';
import { contraste } from './contraste';

describe('contraste', () => {
  it('da 21:1 entre negro y blanco', () => {
    expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  it('da 1:1 con el mismo color y no depende del orden', () => {
    expect(contraste('#b28a4c', '#b28a4c')).toBe(1);
    expect(contraste('#1e1f22', '#f3efe7')).toBe(contraste('#f3efe7', '#1e1f22'));
  });

  it('rechaza colores que no son #rrggbb', () => {
    expect(() => contraste('#fff', '#000000')).toThrow(RangeError);
    expect(() => contraste('dorado', '#000000')).toThrow(RangeError);
  });
});
