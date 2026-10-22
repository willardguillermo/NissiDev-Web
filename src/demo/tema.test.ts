import { describe, expect, it } from 'vitest';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';
import { variablesDeTema } from './tema';

describe('variablesDeTema', () => {
  it('pasa cada color y fuente del negocio a una variable --d-', () => {
    const variables = variablesDeTema(RUBRO_DE_PRUEBA.tema);
    expect(variables['--d-marca']).toBe('#ec48ae');
    expect(variables['--d-fuente-titulos']).toBe('serif');
    expect(Object.keys(variables)).toHaveLength(Object.keys(RUBRO_DE_PRUEBA.tema).length);
    expect(Object.keys(variables).every((nombre) => nombre.startsWith('--d-'))).toBe(true);
  });
});
