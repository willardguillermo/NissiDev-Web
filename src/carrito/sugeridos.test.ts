import { describe, expect, it } from 'vitest';
import { obtenerModulo } from '../catalogo-servicios/modulos';
import { calcularTotales } from './carrito';
import { cargarSugerido, CARRITOS_SUGERIDOS, mismoContenido, type RubroSugerido } from './sugeridos';

const rubros = Object.keys(CARRITOS_SUGERIDOS) as RubroSugerido[];

describe('cargarSugerido', () => {
  it('Dulcería: Catálogo web + Pedidos por WhatsApp + Panel del dueño', () => {
    expect(cargarSugerido('dulceria').items).toEqual(['catalogo-web', 'pedidos-whatsapp', 'panel-dueno']);
  });

  it('Dulcería: totales correctos', () => {
    expect(calcularTotales(cargarSugerido('dulceria'))).toEqual({ inicial: 120000, mensual: 0, incluyeCotizar: false });
  });

  it.each(rubros)('%s: todas las dependencias quedan resueltas y sin duplicados', (rubro) => {
    const { items } = cargarSugerido(rubro);
    expect(new Set(items).size).toBe(items.length);
    for (const id of items) {
      for (const dep of obtenerModulo(id).dependencias) expect(items).toContain(dep);
    }
  });

  it.each(rubros)('%s: incluye todos los módulos de su lista', (rubro) => {
    const { items } = cargarSugerido(rubro);
    for (const id of CARRITOS_SUGERIDOS[rubro].modulos) expect(items).toContain(id);
  });
});

describe('mismoContenido', () => {
  it('ignora el orden', () => {
    expect(mismoContenido({ items: ['chatbot', 'reservas'] }, { items: ['reservas', 'chatbot'] })).toBe(true);
  });

  it('distingue contenidos distintos', () => {
    expect(mismoContenido({ items: ['chatbot'] }, { items: ['chatbot', 'reservas'] })).toBe(false);
    expect(mismoContenido({ items: ['chatbot'] }, { items: ['reservas'] })).toBe(false);
  });
});
