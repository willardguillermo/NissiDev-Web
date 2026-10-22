import { describe, expect, it } from 'vitest';
import { crearRotador, rotar } from './rotador';

describe('rotador de servicios', () => {
  it('empieza en el primero y avanza solo, volviendo al inicio después del último', () => {
    let estado = crearRotador(4, false);
    expect(estado).toEqual({ actual: 0, total: 4, pausado: false });
    for (const esperado of [1, 2, 3, 0]) {
      estado = rotar(estado, { tipo: 'tic' });
      expect(estado.actual).toBe(esperado);
    }
  });

  it('con movimiento reducido empieza pausado y no avanza solo', () => {
    const estado = crearRotador(4, true);
    expect(estado.pausado).toBe(true);
    expect(rotar(estado, { tipo: 'tic' })).toBe(estado);
  });

  it('tocar un punto muestra ese servicio y pausa', () => {
    const estado = rotar(crearRotador(4, false), { tipo: 'ir', indice: 2 });
    expect(estado).toEqual({ actual: 2, total: 4, pausado: true });
    expect(rotar(estado, { tipo: 'tic' }).actual).toBe(2);
  });

  it('ignora un punto fuera de rango', () => {
    const estado = crearRotador(4, false);
    expect(rotar(estado, { tipo: 'ir', indice: 4 })).toBe(estado);
    expect(rotar(estado, { tipo: 'ir', indice: -1 })).toBe(estado);
  });

  it('el botón alterna entre pausa y reproducir (también con movimiento reducido, si la persona lo pide)', () => {
    const pausado = rotar(crearRotador(4, false), { tipo: 'alternar' });
    expect(pausado.pausado).toBe(true);
    const reproduciendo = rotar(crearRotador(4, true), { tipo: 'alternar' });
    expect(reproduciendo.pausado).toBe(false);
    expect(rotar(reproduciendo, { tipo: 'tic' }).actual).toBe(1);
  });

  it('el foco con teclado pausa y no lo reanuda solo', () => {
    const estado = rotar(crearRotador(4, false), { tipo: 'pausar' });
    expect(estado.pausado).toBe(true);
    expect(rotar(estado, { tipo: 'pausar' })).toBe(estado);
  });

  it('rechaza un rotador vacío', () => {
    expect(() => crearRotador(0, false)).toThrow(RangeError);
  });
});
