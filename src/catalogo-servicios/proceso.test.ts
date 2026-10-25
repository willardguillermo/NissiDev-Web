import { describe, expect, it } from 'vitest';
import { PASOS } from './proceso';

describe('proceso y stack', () => {
  it('el proceso va de la maqueta al soporte, con unas 4 semanas de desarrollo', () => {
    expect(PASOS.map((p) => p.titulo)).toEqual(['Maqueta', 'Propuesta', 'Desarrollo', 'Soporte']);
    expect(PASOS[2].texto).toContain('4 semanas');
  });
});
