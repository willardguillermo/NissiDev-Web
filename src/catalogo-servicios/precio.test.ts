import { describe, expect, it } from 'vitest';
import { cuposDisponibles, LANZAMIENTO, lanzamientoActivo, type Lanzamiento } from './lanzamiento';
import { obtenerModulo } from './modulos';
import { precioAplicado, textoPrecio } from './precio';

const conUsados = (usados: number): Lanzamiento => ({ ...LANZAMIENTO, usados });
const LLENO = conUsados(LANZAMIENTO.cupos);

describe('LANZAMIENTO', () => {
  it('son 5 cupos a S/ 700 para el Catálogo web y ninguno usado todavía', () => {
    expect(LANZAMIENTO).toEqual({ modulo: 'catalogo-web', cupos: 5, usados: 0, precioCentimos: 70000 });
  });

  it('rige mientras usados < cupos', () => {
    expect(lanzamientoActivo(conUsados(0))).toBe(true);
    expect(lanzamientoActivo(conUsados(4))).toBe(true);
    expect(lanzamientoActivo(LLENO)).toBe(false);
    expect(cuposDisponibles(conUsados(3))).toBe(2);
    expect(cuposDisponibles(conUsados(9))).toBe(0);
  });
});

describe('precioAplicado', () => {
  const catalogo = obtenerModulo('catalogo-web');
  const mantenimiento = obtenerModulo('mantenimiento');

  it('Catálogo web: S/ 700 con cupos libres, con el normal para tacharlo', () => {
    expect(precioAplicado(catalogo, { lanzamiento: conUsados(4) })).toEqual({
      precioInicial: { tipo: 'desde', centimos: 70000 },
      mensualidad: undefined,
      precioNormal: 90000,
    });
  });

  it('Catálogo web: pasa solo a S/ 900 cuando se llenan los cupos', () => {
    expect(precioAplicado(catalogo, { lanzamiento: LLENO })).toEqual({
      precioInicial: { tipo: 'desde', centimos: 90000 },
      mensualidad: undefined,
    });
  });

  it('el lanzamiento no toca otros módulos', () => {
    expect(precioAplicado(obtenerModulo('panel-dueno')).precioInicial).toEqual({ tipo: 'desde', centimos: 150000 });
  });

  it('Mantenimiento: S/ 120/mes sin Panel y S/ 180/mes con Panel del dueño', () => {
    expect(precioAplicado(mantenimiento, { items: ['catalogo-web', 'mantenimiento'] }).mensualidad).toBe(12000);
    expect(precioAplicado(mantenimiento, { items: ['catalogo-web', 'panel-dueno', 'mantenimiento'] }).mensualidad).toBe(
      18000,
    );
  });
});

describe('textoPrecio', () => {
  it.each([
    ['catalogo-web', 'Desde S/ 700 · precio de lanzamiento (normal S/ 900)'],
    ['pedidos-whatsapp', 'Incluido en Catálogo web'],
    ['panel-dueno', 'Desde S/ 1,500'],
    ['reservas', 'Cotizar'],
    ['inventario', 'Cotizar'],
    ['caja', 'S/ 60/mes + instalación (Cotizar)'],
    ['boletas-sunat', 'Cotizar'],
    ['chatbot', 'Cotizar'],
    ['mantenimiento', 'S/ 120/mes (S/ 180/mes con Panel del dueño)'],
  ] as const)('lista general: %s → %s', (id, esperado) => {
    expect(textoPrecio(obtenerModulo(id))).toBe(esperado);
  });

  it('con los cupos llenos, el Catálogo dice solo su precio normal', () => {
    expect(textoPrecio(obtenerModulo('catalogo-web'), { lanzamiento: LLENO })).toBe('Desde S/ 900');
  });

  it('con una selección, Mantenimiento dice solo la mensualidad que aplica', () => {
    const mantenimiento = obtenerModulo('mantenimiento');
    expect(textoPrecio(mantenimiento, { items: ['catalogo-web'] })).toBe('S/ 120/mes');
    expect(textoPrecio(mantenimiento, { items: ['catalogo-web', 'panel-dueno'] })).toBe('S/ 180/mes');
  });

  it('combina precio "desde" y mensualidad', () => {
    const modulo = { ...obtenerModulo('panel-dueno'), mensualidad: 2000 };
    expect(textoPrecio(modulo)).toBe('Desde S/ 1,500 + S/ 20/mes');
  });
});
