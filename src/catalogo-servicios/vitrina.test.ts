import { describe, expect, it } from 'vitest';
import { LANZAMIENTO } from './lanzamiento';
import { MODULOS } from './modulos';
import {
  normalizarVitrina,
  restaurarVitrina,
  SIN_VITRINA,
  textoMantenimientoVitrina,
  textoPrecioVitrina,
  totalesVitrina,
  VITRINA,
} from './vitrina';

describe('paquete Vitrina', () => {
  it('precios decididos por Guillermo (2026-11-22): S/ 350 cerrado y S/ 60/mes', () => {
    expect(VITRINA.precioCentimos).toBe(35000);
    expect(VITRINA.mantenimiento.centimos).toBe(6000);
    expect(VITRINA.plazo).toBe('5 a 7 días');
    expect(textoPrecioVitrina()).toBe('S/ 350 · precio cerrado');
    expect(textoMantenimientoVitrina()).toBe('S/ 60/mes');
  });

  it('el perfil de Google Maps es con la cuenta del dueño y el dominio va aparte', () => {
    expect(VITRINA.incluye.join(' ')).toContain('Google Maps');
    expect(VITRINA.incluye.join(' ')).toContain('con tu propia cuenta');
    expect(VITRINA.dominio).toContain('aparte');
  });

  it('no es un módulo del carrito ni el módulo de lanzamiento', () => {
    expect(MODULOS.map((m) => m.nombre)).not.toContain(VITRINA.nombre);
    expect(LANZAMIENTO.modulo).toBe('catalogo-web');
  });

  it.each([
    [SIN_VITRINA, { inicial: 0, mensual: 0 }],
    [{ elegida: true, mantenimiento: false }, { inicial: 35000, mensual: 0 }],
    [{ elegida: true, mantenimiento: true }, { inicial: 35000, mensual: 6000 }],
    [{ elegida: false, mantenimiento: true }, { inicial: 0, mensual: 0 }],
  ])('totales de %o', (seleccion, esperado) => {
    expect(totalesVitrina(seleccion)).toEqual(esperado);
  });

  it('sin Vitrina no queda su mantenimiento', () => {
    expect(normalizarVitrina({ elegida: false, mantenimiento: true })).toEqual(SIN_VITRINA);
  });

  it.each([
    [null, SIN_VITRINA],
    ['', SIN_VITRINA],
    ['{roto', SIN_VITRINA],
    ['null', SIN_VITRINA],
    ['{"elegida":"si","mantenimiento":1}', SIN_VITRINA],
    ['{"elegida":true}', { elegida: true, mantenimiento: false }],
    ['{"elegida":true,"mantenimiento":true}', { elegida: true, mantenimiento: true }],
    ['{"elegida":false,"mantenimiento":true}', SIN_VITRINA],
  ])('restaurar %s', (guardado, esperado) => {
    expect(restaurarVitrina(guardado)).toEqual(esperado);
  });
});
