import { describe, expect, it } from 'vitest';
import { obtenerModulo } from './modulos';
import { textoPrecio } from './precio';

describe('textoPrecio', () => {
  it.each([
    ['catalogo-web', 'Desde S/ 700'],
    ['pedidos-whatsapp', 'Incluido en Catálogo web'],
    ['panel-dueno', 'Desde S/ 500'],
    ['reservas', 'Cotizar'],
    ['inventario', 'Cotizar'],
    ['caja', 'S/ 60/mes + instalación (Cotizar)'],
    ['boletas-sunat', 'Cotizar'],
    ['chatbot', 'Cotizar'],
    ['mantenimiento', 'S/ 80/mes'],
  ] as const)('%s → %s', (id, esperado) => {
    expect(textoPrecio(obtenerModulo(id))).toBe(esperado);
  });

  it('combina precio "desde" y mensualidad', () => {
    const modulo = { ...obtenerModulo('catalogo-web'), mensualidad: 2000 };
    expect(textoPrecio(modulo)).toBe('Desde S/ 700 + S/ 20/mes');
  });
});
