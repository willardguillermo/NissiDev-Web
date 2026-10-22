import { describe, expect, it } from 'vitest';

// Comprueba que Vitest corre. Se borra cuando llegue el primer test real (T03).
describe('configuración de tests', () => {
  it('Vitest ejecuta archivos *.test.ts', () => {
    expect(1 + 1).toBe(2);
  });
});
