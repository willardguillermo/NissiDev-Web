import { describe, expect, it } from 'vitest';
import { CHOCOLATE } from './catalogo-de-prueba';
import { contarPresentacion, tipoDePresentacion } from './presentaciones';

const [unidad, bolsa, caja] = CHOCOLATE.presentaciones;

describe('contarPresentacion', () => {
  it('usa el tipo de la presentación, en singular o plural', () => {
    expect(tipoDePresentacion(bolsa)).toBe('bolsa');
    expect(contarPresentacion(1, bolsa)).toBe('1 bolsa');
    expect(contarPresentacion(3, caja)).toBe('3 cajas');
    expect(contarPresentacion(2, unidad)).toBe('2 unidades');
    expect(contarPresentacion(0, caja)).toBe('0 cajas');
  });
});
