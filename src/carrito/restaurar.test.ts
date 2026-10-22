import { describe, expect, it } from 'vitest';
import { calcularTotales, CARRITO_VACIO } from './carrito';
import { restaurarCarrito, serializarCarrito } from './restaurar';

const guardado = (valor: unknown) => JSON.stringify(valor);

describe('restaurarCarrito', () => {
  it.each([
    ['sin valor guardado', undefined],
    ['null de localStorage', null],
    ['texto vacío', ''],
    ['JSON inválido', '{items: ['],
    ['JSON null', 'null'],
    ['un número', '42'],
    ['un texto', '"catalogo-web"'],
    ['un arreglo suelto', guardado(['catalogo-web'])],
    ['objeto sin items', guardado({ modulos: ['catalogo-web'] })],
    ['items que no es arreglo', guardado({ items: 'catalogo-web' })],
  ])('%s → carrito vacío', (_caso, valor) => {
    expect(restaurarCarrito(valor)).toEqual(CARRITO_VACIO);
  });

  it('descarta ids desconocidos y valores que no son texto', () => {
    const valor = guardado({ items: ['chatbot', 'modulo-falso', 7, null, { id: 'reservas' }] });
    expect(restaurarCarrito(valor).items).toEqual(['chatbot']);
  });

  it('quita duplicados', () => {
    const valor = guardado({ items: ['catalogo-web', 'catalogo-web', 'pedidos-whatsapp', 'catalogo-web'] });
    expect(restaurarCarrito(valor).items).toEqual(['catalogo-web', 'pedidos-whatsapp']);
  });

  it('solo Caja → se completan Inventario, Panel y Catálogo, y los totales cuadran', () => {
    const carrito = restaurarCarrito(guardado({ items: ['caja'] }));
    expect(carrito.items).toEqual(['catalogo-web', 'panel-dueno', 'inventario', 'caja']);
    expect(calcularTotales(carrito)).toEqual({ inicial: 120000, mensual: 6000, incluyeCotizar: true });
  });

  it('solo Mantenimiento → carrito vacío', () => {
    expect(restaurarCarrito(guardado({ items: ['mantenimiento'] }))).toEqual(CARRITO_VACIO);
  });

  it('Mantenimiento guardado antes que otro módulo se conserva', () => {
    const carrito = restaurarCarrito(guardado({ items: ['mantenimiento', 'reservas'] }));
    expect(carrito.items).toEqual(['reservas', 'mantenimiento']);
  });

  it('un carrito válido vuelve igual', () => {
    const items = ['catalogo-web', 'pedidos-whatsapp', 'panel-dueno', 'mantenimiento'];
    expect(restaurarCarrito(guardado({ items })).items).toEqual(items);
  });

  it('ida y vuelta con serializarCarrito', () => {
    const carrito = restaurarCarrito(guardado({ items: ['boletas-sunat', 'chatbot'] }));
    expect(restaurarCarrito(serializarCarrito(carrito))).toEqual(carrito);
  });
});
