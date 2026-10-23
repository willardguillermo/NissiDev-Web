import { describe, expect, it } from 'vitest';
import { CHOCOLATE, GOMITAS } from './catalogo-de-prueba';
import { faltaParaEnviar, mensajePedido } from './mensaje-pedido';
import { agregarLinea, PEDIDO_VACIO } from './pedido';
import { personalizar } from './rubro';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';

// CHOCOLATE: bolsa x6 a S/ 8 (por mayor S/ 7 desde 5). GOMITAS: unidad a S/ 0.50.
let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'bolsa', 5);
pedido = agregarLinea(pedido, GOMITAS, 'unidad', 3);

describe('mensajePedido', () => {
  it('lleva negocio, líneas con presentación y subtotal, total, recojo y nombre', () => {
    expect(mensajePedido(RUBRO_DE_PRUEBA, pedido, { cliente: '  Ana Quispe ', puesto: 2 })).toBe(
      [
        'Hola, Dulces de Prueba. Quiero hacer este pedido:',
        '',
        '• 5 bolsas x6 de Chocolate Luna: S/ 35 (precio por mayor)',
        '• 3 unidades de Gomitas Osito: S/ 1.50',
        '',
        'Total: S/ 36.50',
        'Recojo: Puesto 2 (Pasillo)',
        'Nombre: Ana Quispe',
      ].join('\n'),
    );
  });

  it('con un solo puesto, se recoge en la tienda', () => {
    const unPuesto = personalizar(RUBRO_DE_PRUEBA, { puestos: 1 });
    expect(mensajePedido(unPuesto, pedido, { cliente: 'Ana' })).toContain('Recojo: en la tienda (Entrada)');
  });
});

describe('faltaParaEnviar', () => {
  it('pedido vacío, sin puesto y sin nombre', () => {
    expect(faltaParaEnviar(RUBRO_DE_PRUEBA, PEDIDO_VACIO, { cliente: ' ' })).toEqual(['vacio', 'puesto', 'cliente']);
  });

  it('el puesto debe existir en la configuración', () => {
    expect(faltaParaEnviar(RUBRO_DE_PRUEBA, pedido, { cliente: 'Ana', puesto: 3 })).toEqual([]);
    const dos = personalizar(RUBRO_DE_PRUEBA, { puestos: 2 });
    expect(faltaParaEnviar(dos, pedido, { cliente: 'Ana', puesto: 3 })).toEqual(['puesto']);
  });

  it('con un solo puesto no hace falta elegirlo', () => {
    const unPuesto = personalizar(RUBRO_DE_PRUEBA, { puestos: 1 });
    expect(faltaParaEnviar(unPuesto, pedido, { cliente: 'Ana' })).toEqual([]);
  });
});
