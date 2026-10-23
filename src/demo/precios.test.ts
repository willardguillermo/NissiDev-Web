import { describe, expect, it } from 'vitest';
import { CHOCOLATE, GALLETON, GOMITAS } from './catalogo-de-prueba';
import { precioPorMayor, precioUnidad, textoDesde } from './precios';

describe('precioUnidad', () => {
  it('es la presentación con factor 1', () => {
    expect(precioUnidad(CHOCOLATE)).toMatchObject({ precio: 150, presentacion: { id: 'unidad' } });
  });
});

describe('precioPorMayor', () => {
  it('toma la presentación más grande con precio mayorista y su cantidad mínima', () => {
    expect(precioPorMayor(CHOCOLATE)).toMatchObject({ precio: 2700, desde: 3, presentacion: { id: 'caja' } });
  });

  it('sin precio mayorista, la presentación más grande a su precio normal', () => {
    expect(precioPorMayor(GOMITAS)).toEqual({ presentacion: GOMITAS.presentaciones[1], precio: 270 });
  });

  it('si solo se vende por unidad, no hay precio por mayor', () => {
    expect(precioPorMayor(GALLETON)).toBeNull();
  });
});

describe('textoDesde', () => {
  it('dice desde cuántas cajas o bolsas', () => {
    expect(textoDesde(precioPorMayor(CHOCOLATE)!)).toBe('desde 3 cajas');
    expect(textoDesde({ ...precioPorMayor(CHOCOLATE)!, desde: 1 })).toBe('desde 1 caja');
    expect(textoDesde(precioPorMayor(GOMITAS)!)).toBeNull();
  });
});
