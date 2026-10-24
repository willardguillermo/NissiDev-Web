import { describe, expect, it } from 'vitest';
import { DULCERIA } from '../rubros/dulceria/config';
import { formatearSoles } from '../ui/formato';
import { historiaDeLaDemo, PASOS_HISTORIA } from './historia';
import { cobrosPorMedio, porVencer, ventasDelDiaPorPuesto } from './panel';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';

const historia = historiaDeLaDemo(DULCERIA);

describe('historia de la demo en el Inicio', () => {
  it('tiene los 4 pasos: Catálogo → Pedido → WhatsApp → Panel', () => {
    expect(PASOS_HISTORIA.map((p) => p.corto)).toEqual(['Catálogo', 'Pedido', 'WhatsApp', 'Panel']);
  });

  it('el catálogo usa los textos y la campaña activa del negocio', () => {
    const campana = DULCERIA.campanas.find((c) => c.id === DULCERIA.campanaActiva);
    expect(historia.negocio).toBe(DULCERIA.negocio);
    expect(historia.catalogo.anuncio).toBe(DULCERIA.textos.anuncio);
    expect(historia.catalogo.titular).toBe(campana?.titular);
    expect(historia.catalogo.categorias.map((c) => c.nombre)).toEqual(DULCERIA.categorias.slice(0, 3).map((c) => c.nombre));
  });

  it('los productos son los más vendidos, con su presentación y su precio reales', () => {
    expect(historia.pedido.productos.map((p) => p.id)).toEqual(DULCERIA.masVendidos.slice(0, 4));
    const ositos = historia.pedido.productos.find((p) => p.id === 'gomitas-ositos');
    expect(ositos).toMatchObject({ presentacion: 'Caja x24', precio: 'S/ 13', ilustracion: 'gomita' });
  });

  it('el pedido de ejemplo suma bien y el mensaje de WhatsApp lo repite', () => {
    // Bombones (bolsa x50, S/ 22) + gomitas (caja x24, S/ 13) + caramelos (bolsa x50, S/ 8)
    expect(historia.pedido.cantidad).toBe(3);
    expect(historia.pedido.total).toBe('S/ 43');
    expect(historia.whatsapp.mensaje[0]).toBe(`Hola, ${DULCERIA.negocio}. Quiero hacer este pedido:`);
    expect(historia.whatsapp.mensaje).toContain(`Total: ${historia.pedido.total}`);
    expect(historia.whatsapp.mensaje.some((l) => l.includes('Gomitas ositos'))).toBe(true);
    expect(historia.whatsapp.mensaje).not.toContain('');
  });

  it('el panel sale de las ventas de hoy: total, puestos, cobros y lo que vence primero', () => {
    const puestos = ventasDelDiaPorPuesto(DULCERIA);
    const total = puestos.reduce((s, p) => s + p.total, 0);
    expect(historia.panel.ventasHoy).toBe(formatearSoles(total));
    expect(historia.panel.puestos.map((p) => p.nombre)).toEqual(puestos.map((p) => p.nombre));
    expect(historia.panel.cobros.map((c) => c.total)).toEqual(cobrosPorMedio(DULCERIA).map((c) => formatearSoles(c.total)));
    expect(Math.max(...historia.panel.cobros.map((c) => c.proporcion))).toBe(1);
    expect(historia.panel.porVencer?.nombre).toBe(porVencer(DULCERIA)[0].producto.nombre);
  });

  it('funciona con otra configuración del motor (la de prueba)', () => {
    const otra = historiaDeLaDemo(RUBRO_DE_PRUEBA);
    expect(otra.negocio).toBe(RUBRO_DE_PRUEBA.negocio);
    expect(otra.pedido.productos.length).toBeLessThanOrEqual(4);
  });
});
