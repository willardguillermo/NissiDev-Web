import { LANZAMIENTO_ACTIVO } from '../catalogo-servicios/lanzamiento.prueba';
import { describe, expect, it } from 'vitest';
import { obtenerModulo } from '../catalogo-servicios/modulos';
import { calcularTotales } from './carrito';
import {
  cargarSugerido,
  CARRITOS_SUGERIDOS,
  enlaceCotizarRubro,
  enlaceSugerido,
  mismoContenido,
  sinSugerido,
  sugeridoDeUrl,
  type RubroSugerido,
} from './sugeridos';

const rubros = Object.keys(CARRITOS_SUGERIDOS) as RubroSugerido[];

describe('cargarSugerido', () => {
  it('Dulcería: Catálogo web + Pedidos por WhatsApp + Panel del dueño', () => {
    expect(cargarSugerido('dulceria').items).toEqual(['catalogo-web', 'pedidos-whatsapp', 'panel-dueno']);
  });

  it('Dulcería: totales correctos', () => {
    expect(calcularTotales(cargarSugerido('dulceria'), LANZAMIENTO_ACTIVO)).toEqual({ inicial: 220000, mensual: 0, incluyeCotizar: false });
  });

  it('Inmobiliaria: Catálogo web + Mantenimiento (S/ 700 de lanzamiento + S/ 120/mes)', () => {
    const carrito = cargarSugerido('inmobiliaria');
    expect(carrito.items).toEqual(['catalogo-web', 'mantenimiento']);
    expect(calcularTotales(carrito, LANZAMIENTO_ACTIVO)).toEqual({ inicial: 70000, mensual: 12000, incluyeCotizar: false });
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

describe('enlace directo ?sugerido=', () => {
  it('reconoce los rubros sugeridos y nada más', () => {
    expect(sugeridoDeUrl('?sugerido=inmobiliaria')).toBe('inmobiliaria');
    expect(sugeridoDeUrl('?sugerido=dulceria&x=1')).toBe('dulceria');
    expect(sugeridoDeUrl('')).toBeNull();
    expect(sugeridoDeUrl('?sugerido=')).toBeNull();
    expect(sugeridoDeUrl('?sugerido=restaurante')).toBeNull();
    expect(sugeridoDeUrl('?sugerido=toString')).toBeNull();
    expect(sugeridoDeUrl('?sugerido=__proto__')).toBeNull();
  });

  it('el enlace de cada rubro se lee de vuelta', () => {
    for (const rubro of rubros) {
      const enlace = enlaceSugerido(rubro);
      expect(enlace).toBe(`/cotizar/?sugerido=${rubro}`);
      expect(sugeridoDeUrl(new URL(enlace, 'https://nissidev.dev').search)).toBe(rubro);
    }
  });

  it('sinSugerido quita solo ese parámetro', () => {
    expect(sinSugerido('https://nissidev.dev/cotizar/?sugerido=inmobiliaria')).toBe('/cotizar/');
    expect(sinSugerido('https://nissidev.dev/cotizar/?a=1&sugerido=dulceria#vitrina')).toBe('/cotizar/?a=1#vitrina');
  });
});

describe('enlaceCotizarRubro (botón «Quiero esto para mi negocio» de las demos)', () => {
  it('lleva el sistema sugerido del rubro de la demo', () => {
    expect(enlaceCotizarRubro('inmobiliaria')).toBe('/cotizar/?sugerido=inmobiliaria');
    expect(enlaceCotizarRubro('dulceria')).toBe('/cotizar/?sugerido=dulceria');
  });

  it('un rubro sin sugerido va a /cotizar/ a secas', () => {
    expect(enlaceCotizarRubro('restaurante')).toBe('/cotizar/');
  });
});
