import { describe, expect, it } from 'vitest';
import { agregarModulo, CARRITO_VACIO, type Carrito } from '../carrito/carrito';
import { cargarSugerido } from '../carrito/sugeridos';
import { enlaceWhatsApp, mensajeWhatsApp } from './mensajeWhatsApp';
import type { Cotizacion } from './tipos';

const cotizacion = (carrito: Carrito, negocio?: string): Cotizacion => ({
  codigo: 'NSD-2026-K7Q3',
  emitida: { anio: 2026, mes: 10, dia: 21 },
  validaHasta: { anio: 2026, mes: 11, dia: 5 },
  carrito,
  negocio,
});

const dulceriaConCaja = agregarModulo(cargarSugerido('dulceria'), 'caja').carrito;

describe('mensajeWhatsApp', () => {
  it('lleva el código, la fecha y la validez', () => {
    const texto = mensajeWhatsApp(cotizacion(dulceriaConCaja));
    expect(texto).toContain('Cotización: NSD-2026-K7Q3');
    expect(texto).toContain('Fecha: 21/10/2026');
    expect(texto).toContain('Válida hasta: 05/11/2026');
  });

  it('lista cada módulo con su texto de precio', () => {
    const texto = mensajeWhatsApp(cotizacion(dulceriaConCaja));
    expect(texto).toContain('- Catálogo web: Desde S/ 700');
    expect(texto).toContain('- Pedidos por WhatsApp: Incluido en Catálogo web');
    expect(texto).toContain('- Panel del dueño: Desde S/ 500');
    expect(texto).toContain('- Inventario con vencimientos: Cotizar');
    expect(texto).toContain('- Caja con Yape/Plin: S/ 60/mes + instalación (Cotizar)');
  });

  it('separa inversión inicial y mensualidad, y nombra lo que falta cotizar', () => {
    const texto = mensajeWhatsApp(cotizacion(dulceriaConCaja));
    expect(texto).toContain('Inversión inicial: desde S/ 1,200 (sin contar lo que falta cotizar)');
    expect(texto).toContain('Falta cotizar: Inventario con vencimientos y Caja con Yape/Plin (instalación)');
    expect(texto).toContain('Mensualidad: S/ 60/mes');
  });

  it('sin módulos por cotizar no menciona "falta cotizar"', () => {
    const texto = mensajeWhatsApp(cotizacion(cargarSugerido('dulceria')));
    expect(texto).toContain('Inversión inicial: desde S/ 1,200');
    expect(texto).not.toContain('cotizar');
    expect(texto).toContain('Mensualidad: sin mensualidad');
  });

  it('si todo es por cotizar, la inversión inicial lo dice', () => {
    const texto = mensajeWhatsApp(cotizacion(agregarModulo(CARRITO_VACIO, 'reservas').carrito));
    expect(texto).toContain('Inversión inicial: por cotizar');
    expect(texto).toContain('Falta cotizar: Reservas');
  });

  it('dice que los precios son referenciales', () => {
    const texto = mensajeWhatsApp(cotizacion(dulceriaConCaja));
    expect(texto).toContain('referencial');
    expect(texto).toContain('Precios referenciales; la cotización final se confirma por WhatsApp.');
  });

  it('incluye el nombre del negocio solo si hay uno', () => {
    expect(mensajeWhatsApp(cotizacion(dulceriaConCaja, 'La Golosa'))).toContain('Negocio: La Golosa');
    expect(mensajeWhatsApp(cotizacion(dulceriaConCaja))).not.toContain('Negocio:');
    expect(mensajeWhatsApp(cotizacion(dulceriaConCaja, '   '))).not.toContain('Negocio:');
  });

  it('el nombre del negocio no puede agregar líneas ni ser larguísimo', () => {
    const texto = mensajeWhatsApp(cotizacion(dulceriaConCaja, 'Mi tienda\nInversión inicial: S/ 1'));
    expect(texto).toContain('Negocio: Mi tienda Inversión inicial: S/ 1');
    const largo = mensajeWhatsApp(cotizacion(dulceriaConCaja, 'x'.repeat(200)));
    expect(largo).toContain(`Negocio: ${'x'.repeat(80)}\n`);
  });

  it('sin emojis', () => {
    expect(mensajeWhatsApp(cotizacion(dulceriaConCaja))).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe('enlaceWhatsApp', () => {
  it('apunta al número de NissiDev', () => {
    expect(enlaceWhatsApp('Hola')).toBe('https://wa.me/51913351627?text=Hola');
  });

  it('codifica tildes, ñ, saltos de línea, &, #, ? y espacios', () => {
    const enlace = enlaceWhatsApp('Cotización año\nA & B #1 ¿sí?');
    const texto = enlace.split('?text=')[1];
    expect(texto).toContain('Cotizaci%C3%B3n');
    expect(texto).toContain('a%C3%B1o');
    expect(texto).toContain('%0A');
    expect(texto).toContain('%26');
    expect(texto).toContain('%23');
    expect(texto).toContain('%3F');
    expect(texto).not.toMatch(/[ \n&#?]/);
  });

  it('el mensaje completo vuelve igual al decodificarlo', () => {
    const mensaje = mensajeWhatsApp(cotizacion(dulceriaConCaja, 'Dulces & Más #1'));
    const enlace = new URL(enlaceWhatsApp(mensaje));
    expect(enlace.searchParams.get('text')).toBe(mensaje);
  });
});
