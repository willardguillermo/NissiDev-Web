import { describe, expect, it } from 'vitest';
import type { ModuloId } from '../catalogo-servicios/modulos';
import { agregarModulo, calcularTotales, CARRITO_VACIO, quitarModulo, type Carrito } from './carrito';

const carritoCon = (...items: ModuloId[]): Carrito => ({ items });

describe('agregarModulo', () => {
  it('agrega un módulo sin dependencias', () => {
    const r = agregarModulo(CARRITO_VACIO, 'chatbot');
    expect(r).toEqual({ estado: 'agregado', carrito: carritoCon('chatbot'), agregadosPorDependencia: [] });
  });

  it('agregar Caja agrega Inventario, Panel y Catálogo (dependencias antes que el módulo)', () => {
    const r = agregarModulo(CARRITO_VACIO, 'caja');
    expect(r.estado).toBe('agregado');
    expect(r.carrito.items).toEqual(['catalogo-web', 'panel-dueno', 'inventario', 'caja']);
    if (r.estado === 'agregado') {
      expect(r.agregadosPorDependencia).toEqual(['catalogo-web', 'panel-dueno', 'inventario']);
    }
  });

  it('solo agrega las dependencias que faltan', () => {
    const r = agregarModulo(carritoCon('catalogo-web'), 'inventario');
    expect(r.carrito.items).toEqual(['catalogo-web', 'panel-dueno', 'inventario']);
    if (r.estado === 'agregado') expect(r.agregadosPorDependencia).toEqual(['panel-dueno']);
  });

  it('no duplica un módulo que ya está', () => {
    const inicial = carritoCon('catalogo-web', 'pedidos-whatsapp');
    const r = agregarModulo(inicial, 'catalogo-web');
    expect(r).toEqual({ estado: 'ya-estaba', carrito: inicial });
  });

  it('no duplica dependencias compartidas', () => {
    let carrito = agregarModulo(CARRITO_VACIO, 'pedidos-whatsapp').carrito;
    carrito = agregarModulo(carrito, 'boletas-sunat').carrito;
    expect(new Set(carrito.items).size).toBe(carrito.items.length);
    expect(carrito.items.filter((id) => id === 'catalogo-web')).toHaveLength(1);
  });

  it('rechaza Mantenimiento en un carrito vacío', () => {
    const r = agregarModulo(CARRITO_VACIO, 'mantenimiento');
    expect(r).toEqual({ estado: 'rechazado', carrito: CARRITO_VACIO, motivo: 'requiere-otro-modulo' });
  });

  it('acepta Mantenimiento si ya hay otro módulo', () => {
    const r = agregarModulo(carritoCon('reservas'), 'mantenimiento');
    expect(r.carrito.items).toEqual(['reservas', 'mantenimiento']);
  });

  it('no modifica el carrito recibido', () => {
    const inicial = carritoCon('catalogo-web');
    agregarModulo(inicial, 'caja');
    expect(inicial.items).toEqual(['catalogo-web']);
  });
});

describe('quitarModulo', () => {
  it('quita un módulo del que nadie depende', () => {
    const r = quitarModulo(carritoCon('catalogo-web', 'chatbot'), 'chatbot');
    expect(r).toEqual({ estado: 'quitado', carrito: carritoCon('catalogo-web'), tambienQuitados: [] });
  });

  it('quitar Catálogo con Panel avisa y no cambia el carrito', () => {
    const inicial = carritoCon('catalogo-web', 'panel-dueno');
    const r = quitarModulo(inicial, 'catalogo-web');
    expect(r).toEqual({ estado: 'requiere-confirmacion', carrito: inicial, afectados: ['panel-dueno'] });
  });

  it('avisa también a los dependientes indirectos', () => {
    const inicial = agregarModulo(CARRITO_VACIO, 'boletas-sunat').carrito;
    const r = quitarModulo(inicial, 'panel-dueno');
    expect(r.estado).toBe('requiere-confirmacion');
    if (r.estado === 'requiere-confirmacion') {
      expect(r.afectados).toEqual(['inventario', 'caja', 'boletas-sunat']);
    }
  });

  it('con confirmación quita el módulo y sus dependientes', () => {
    const inicial = carritoCon('catalogo-web', 'panel-dueno', 'pedidos-whatsapp', 'chatbot');
    const r = quitarModulo(inicial, 'catalogo-web', { confirmado: true });
    expect(r).toEqual({
      estado: 'quitado',
      carrito: carritoCon('chatbot'),
      tambienQuitados: ['panel-dueno', 'pedidos-whatsapp'],
    });
  });

  it('quitar el último módulo con Mantenimiento avisa', () => {
    const inicial = carritoCon('reservas', 'mantenimiento');
    const r = quitarModulo(inicial, 'reservas');
    expect(r).toEqual({ estado: 'requiere-confirmacion', carrito: inicial, afectados: ['mantenimiento'] });
  });

  it('con confirmación también se va Mantenimiento si queda solo', () => {
    const r = quitarModulo(carritoCon('reservas', 'mantenimiento'), 'reservas', { confirmado: true });
    expect(r).toEqual({ estado: 'quitado', carrito: CARRITO_VACIO, tambienQuitados: ['mantenimiento'] });
  });

  it('Mantenimiento se puede quitar sin aviso', () => {
    const r = quitarModulo(carritoCon('reservas', 'mantenimiento'), 'mantenimiento');
    expect(r).toEqual({ estado: 'quitado', carrito: carritoCon('reservas'), tambienQuitados: [] });
  });

  it('quitar un módulo que no está no cambia nada', () => {
    const inicial = carritoCon('chatbot');
    expect(quitarModulo(inicial, 'reservas')).toEqual({ estado: 'quitado', carrito: inicial, tambienQuitados: [] });
  });
});

describe('calcularTotales', () => {
  it('carrito vacío: todo en cero', () => {
    expect(calcularTotales(CARRITO_VACIO)).toEqual({ inicial: 0, mensual: 0, incluyeCotizar: false });
  });

  it('separa la inversión inicial de la mensualidad', () => {
    const carrito = carritoCon('catalogo-web', 'pedidos-whatsapp', 'panel-dueno', 'mantenimiento');
    expect(calcularTotales(carrito)).toEqual({ inicial: 120000, mensual: 8000, incluyeCotizar: false });
  });

  it('marca si hay módulos "Cotizar" y suma su mensualidad', () => {
    const carrito = agregarModulo(CARRITO_VACIO, 'caja').carrito;
    expect(calcularTotales(carrito)).toEqual({ inicial: 120000, mensual: 6000, incluyeCotizar: true });
  });
});
