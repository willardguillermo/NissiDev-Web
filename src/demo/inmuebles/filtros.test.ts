import { describe, expect, it } from 'vitest';
import { cambiarOperacion, cuantosFiltros, filtrarInmuebles, RANGOS_PRECIO, rangoDe } from './filtros';
import type { Inmueble } from './tipos';

const base: Omit<Inmueble, 'codigo' | 'operacion' | 'distrito' | 'dormitorios' | 'precio'> = {
  titulo: 'x', tipo: 'departamento', referencia: '', area: 50, banos: 1, estacionamientos: 0,
  descripcion: '', caracteristicas: [], galeria: ['sala'], estado: 'disponible', color: '#fff',
  mapa: { x: 0.5, y: 0.5 }, publicado: '2026-11-01',
};
const de = (codigo: string, operacion: Inmueble['operacion'], distrito: string, dormitorios: number, precio: Inmueble['precio']): Inmueble =>
  ({ ...base, codigo, operacion, distrito, dormitorios, precio });

const TC = 3.75;
const LISTA = [
  de('A', 'alquiler', 'Norte', 1, { moneda: 'PEN', centimos: 120_000 }),
  de('B', 'alquiler', 'Sur', 2, { moneda: 'PEN', centimos: 150_000 }), // justo en el límite
  de('C', 'alquiler', 'Sur', 3, { moneda: 'PEN', centimos: 350_000 }),
  de('D', 'venta', 'Norte', 2, { moneda: 'USD', centimos: 9_500_000 }), // S/ 356,250
  de('E', 'venta', 'Sur', 4, { moneda: 'USD', centimos: 24_000_000 }), // S/ 900,000
  de('F', 'venta', 'Norte', 0, { moneda: 'USD', centimos: 12_800_000 }), // S/ 480,000
];
const codigos = (lista: Inmueble[]) => lista.map((i) => i.codigo);

describe('filtrarInmuebles', () => {
  it('sin filtros devuelve todos, en el mismo orden', () => {
    expect(codigos(filtrarInmuebles(LISTA, {}, TC))).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('por operación', () => {
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta' }, TC))).toEqual(['D', 'E', 'F']);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'alquiler' }, TC))).toEqual(['A', 'B', 'C']);
  });

  it('por distrito', () => {
    expect(codigos(filtrarInmuebles(LISTA, { distrito: 'Sur' }, TC))).toEqual(['B', 'C', 'E']);
  });

  it('dormitorios es un mínimo: 3 = 3 o más; los terrenos (0) salen al filtrar', () => {
    expect(codigos(filtrarInmuebles(LISTA, { dormitorios: 3 }, TC))).toEqual(['C', 'E']);
    expect(codigos(filtrarInmuebles(LISTA, { dormitorios: 1 }, TC))).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('precio en alquiler: los límites del rango se incluyen', () => {
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'alquiler', precio: 'hasta-1500' }, TC))).toEqual(['A', 'B']);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'alquiler', precio: 'mas-3000' }, TC))).toEqual(['C']);
  });

  it('precio en venta compara en soles con el tipo de cambio', () => {
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta', precio: 'hasta-400k' }, TC))).toEqual(['D']);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta', precio: '400k-800k' }, TC))).toEqual(['F']);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta', precio: 'mas-800k' }, TC))).toEqual(['E']);
    // Con otro tipo de cambio, D pasa de rango
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta', precio: 'hasta-400k' }, 4.3))).toEqual([]);
  });

  it('un rango de precio sin operación (o de la otra operación) no filtra', () => {
    expect(filtrarInmuebles(LISTA, { precio: 'hasta-1500' }, TC)).toHaveLength(6);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'venta', precio: 'hasta-1500' }, TC))).toEqual(['D', 'E', 'F']);
  });

  it('combina todos los filtros', () => {
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'alquiler', distrito: 'Sur', dormitorios: 2, precio: '1500-3000' }, TC))).toEqual([]);
    expect(codigos(filtrarInmuebles(LISTA, { operacion: 'alquiler', distrito: 'Sur', dormitorios: 2, precio: 'hasta-1500' }, TC))).toEqual(['B']);
  });
});

describe('cambiarOperacion', () => {
  it('quita el rango de precio al cambiar de operación y lo conserva si es la misma', () => {
    const filtros = { operacion: 'venta' as const, precio: 'hasta-400k', distrito: 'Sur' };
    expect(cambiarOperacion(filtros, 'alquiler')).toEqual({ operacion: 'alquiler', distrito: 'Sur' });
    expect(cambiarOperacion(filtros, 'venta')).toEqual(filtros);
    expect(cambiarOperacion(filtros, undefined)).toEqual({ distrito: 'Sur' });
  });
});

describe('rangos', () => {
  it('cada operación tiene rangos contiguos, sin huecos ni cruces', () => {
    for (const rangos of Object.values(RANGOS_PRECIO)) {
      expect(rangos[0].desde).toBe(0);
      for (let i = 1; i < rangos.length; i++) expect(rangos[i].desde).toBe(rangos[i - 1].hasta + 1);
    }
  });

  it('rangoDe y cuantosFiltros solo cuentan un rango válido', () => {
    expect(rangoDe({ operacion: 'venta', precio: 'hasta-1500' })).toBeUndefined();
    expect(cuantosFiltros({ operacion: 'venta', precio: 'hasta-1500', dormitorios: 2 })).toBe(2);
    expect(cuantosFiltros({})).toBe(0);
  });
});
