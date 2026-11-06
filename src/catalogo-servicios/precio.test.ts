import { describe, expect, it } from 'vitest';
import { cuposDisponibles, LANZAMIENTO, lanzamientoActivo, lanzamientoValido } from './lanzamiento';
import {
  LANZAMIENTO_ACTIVO,
  LANZAMIENTO_AGOTADO,
  LANZAMIENTO_ULTIMO_CUPO,
  LANZAMIENTO_UNO_USADO,
} from './lanzamiento.prueba';
import { obtenerModulo } from './modulos';
import { precioAplicado, textoPrecio } from './precio';

describe('LANZAMIENTO', () => {
  // El ÚNICO test que lee la configuración real: no fija su valor, solo que sea válida.
  it('la configuración real es válida (subir usados al cerrar un proyecto no rompe los tests)', () => {
    expect(lanzamientoValido(LANZAMIENTO)).toBe(true);
  });

  it('rechaza cupos y usados fuera de rango o no enteros', () => {
    expect(lanzamientoValido(LANZAMIENTO_ACTIVO)).toBe(true);
    expect(lanzamientoValido(LANZAMIENTO_AGOTADO)).toBe(true);
    expect(lanzamientoValido({ ...LANZAMIENTO_ACTIVO, usados: -1 })).toBe(false);
    expect(lanzamientoValido({ ...LANZAMIENTO_ACTIVO, usados: 6 })).toBe(false);
    expect(lanzamientoValido({ ...LANZAMIENTO_ACTIVO, usados: 1.5 })).toBe(false);
    expect(lanzamientoValido({ ...LANZAMIENTO_ACTIVO, cupos: 0, usados: 0 })).toBe(false);
    expect(lanzamientoValido({ ...LANZAMIENTO_ACTIVO, cupos: 2.5 })).toBe(false);
  });

  it('rige mientras usados < cupos', () => {
    expect(lanzamientoActivo(LANZAMIENTO_ACTIVO)).toBe(true);
    expect(lanzamientoActivo(LANZAMIENTO_UNO_USADO)).toBe(true);
    expect(lanzamientoActivo(LANZAMIENTO_ULTIMO_CUPO)).toBe(true);
    expect(lanzamientoActivo(LANZAMIENTO_AGOTADO)).toBe(false);
    expect(cuposDisponibles(LANZAMIENTO_ACTIVO)).toBe(5);
    expect(cuposDisponibles(LANZAMIENTO_UNO_USADO)).toBe(4);
    expect(cuposDisponibles(LANZAMIENTO_AGOTADO)).toBe(0);
  });
});

describe('precioAplicado', () => {
  const catalogo = obtenerModulo('catalogo-web');
  const mantenimiento = obtenerModulo('mantenimiento');

  it.each([
    ['0 usados', LANZAMIENTO_ACTIVO],
    ['1 usado', LANZAMIENTO_UNO_USADO],
    ['4 usados', LANZAMIENTO_ULTIMO_CUPO],
  ])('Catálogo web con %s: S/ 700, con el normal para tacharlo', (_, lanzamiento) => {
    expect(precioAplicado(catalogo, { lanzamiento })).toEqual({
      precioInicial: { tipo: 'desde', centimos: 70000 },
      mensualidad: undefined,
      precioNormal: 90000,
    });
  });

  it('Catálogo web: pasa solo a S/ 900 cuando se llenan los cupos', () => {
    expect(precioAplicado(catalogo, { lanzamiento: LANZAMIENTO_AGOTADO })).toEqual({
      precioInicial: { tipo: 'desde', centimos: 90000 },
      mensualidad: undefined,
    });
  });

  it('el lanzamiento no toca otros módulos', () => {
    for (const lanzamiento of [LANZAMIENTO_ACTIVO, LANZAMIENTO_AGOTADO]) {
      expect(precioAplicado(obtenerModulo('panel-dueno'), { lanzamiento }).precioInicial).toEqual({
        tipo: 'desde',
        centimos: 150000,
      });
    }
  });

  it('Mantenimiento: S/ 120/mes sin Panel y S/ 180/mes con Panel del dueño', () => {
    const lanzamiento = LANZAMIENTO_ACTIVO;
    expect(precioAplicado(mantenimiento, { items: ['catalogo-web', 'mantenimiento'], lanzamiento }).mensualidad).toBe(
      12000,
    );
    expect(
      precioAplicado(mantenimiento, { items: ['catalogo-web', 'panel-dueno', 'mantenimiento'], lanzamiento }).mensualidad,
    ).toBe(18000);
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
  ] as const)('lista general con cupos: %s → %s', (id, esperado) => {
    expect(textoPrecio(obtenerModulo(id), { lanzamiento: LANZAMIENTO_ACTIVO })).toBe(esperado);
  });

  it('con 1 cupo usado sigue el precio de lanzamiento', () => {
    expect(textoPrecio(obtenerModulo('catalogo-web'), { lanzamiento: LANZAMIENTO_UNO_USADO })).toBe(
      'Desde S/ 700 · precio de lanzamiento (normal S/ 900)',
    );
  });

  it('con los cupos llenos, el Catálogo dice solo «Desde S/ 900»', () => {
    expect(textoPrecio(obtenerModulo('catalogo-web'), { lanzamiento: LANZAMIENTO_AGOTADO })).toBe('Desde S/ 900');
  });

  it('con una selección, Mantenimiento dice solo la mensualidad que aplica', () => {
    const mantenimiento = obtenerModulo('mantenimiento');
    expect(textoPrecio(mantenimiento, { items: ['catalogo-web'], lanzamiento: LANZAMIENTO_ACTIVO })).toBe('S/ 120/mes');
    expect(textoPrecio(mantenimiento, { items: ['catalogo-web', 'panel-dueno'], lanzamiento: LANZAMIENTO_ACTIVO })).toBe(
      'S/ 180/mes',
    );
  });

  it('combina precio "desde" y mensualidad', () => {
    const modulo = { ...obtenerModulo('panel-dueno'), mensualidad: 2000 };
    expect(textoPrecio(modulo, { lanzamiento: LANZAMIENTO_ACTIVO })).toBe('Desde S/ 1,500 + S/ 20/mes');
  });
});
