import { describe, expect, it } from 'vitest';
import { NAVEGACION_INMO_INICIAL, navegarInmo } from './navegacion';

describe('navegación de la demo inmobiliaria', () => {
  it('empieza en el catálogo de la vista cliente', () => {
    expect(NAVEGACION_INMO_INICIAL).toEqual({ vista: 'cliente', pantalla: 'catalogo' });
  });

  it('ir al dueño y volver conserva la ficha abierta', () => {
    const ficha = navegarInmo(NAVEGACION_INMO_INICIAL, { tipo: 'ficha', codigo: 'DEP-101' });
    const dueno = navegarInmo(ficha, { tipo: 'vista', vista: 'dueno' });
    expect(navegarInmo(dueno, { tipo: 'vista', vista: 'cliente' })).toEqual(ficha);
  });

  it('desde el dueño, abrir el agente pasa a la vista cliente', () => {
    const dueno = navegarInmo(NAVEGACION_INMO_INICIAL, { tipo: 'vista', vista: 'dueno' });
    expect(navegarInmo(dueno, { tipo: 'agente' })).toEqual({ vista: 'cliente', pantalla: 'agente' });
  });
});
