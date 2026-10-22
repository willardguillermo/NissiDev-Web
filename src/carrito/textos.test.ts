import { describe, expect, it } from 'vitest';
import { agregarModulo, CARRITO_VACIO, quitarModulo } from './carrito';
import { avisoAgregar, avisoQuitar, preguntaQuitar, textoTotales, unirNombres } from './textos';

describe('unirNombres', () => {
  it('une en español', () => {
    expect(unirNombres([])).toBe('');
    expect(unirNombres(['chatbot'])).toBe('Chatbot');
    expect(unirNombres(['chatbot', 'reservas'])).toBe('Chatbot y Reservas');
    expect(unirNombres(['chatbot', 'reservas', 'caja'])).toBe('Chatbot, Reservas y Caja con Yape/Plin');
  });
});

describe('avisoAgregar', () => {
  it('módulo solo', () => {
    expect(avisoAgregar('chatbot', agregarModulo(CARRITO_VACIO, 'chatbot'))).toBe('Agregaste Chatbot.');
  });

  it('con una dependencia (singular)', () => {
    expect(avisoAgregar('panel-dueno', agregarModulo(CARRITO_VACIO, 'panel-dueno'))).toBe(
      'Agregaste Panel del dueño. También se agregó Catálogo web, porque Panel del dueño lo necesita.',
    );
  });

  it('con varias dependencias (plural)', () => {
    expect(avisoAgregar('caja', agregarModulo(CARRITO_VACIO, 'caja'))).toBe(
      'Agregaste Caja con Yape/Plin. También se agregaron Catálogo web, Panel del dueño y Inventario con vencimientos, porque Caja con Yape/Plin los necesita.',
    );
  });

  it('ya estaba y rechazado', () => {
    const conChatbot = agregarModulo(CARRITO_VACIO, 'chatbot').carrito;
    expect(avisoAgregar('chatbot', agregarModulo(conChatbot, 'chatbot'))).toBe('Chatbot ya está en tu sistema.');
    expect(avisoAgregar('mantenimiento', agregarModulo(CARRITO_VACIO, 'mantenimiento'))).toBe(
      'Mantenimiento se agrega junto a otro módulo. Elige primero otro módulo.',
    );
  });
});

describe('quitar', () => {
  it('pregunta en singular y plural', () => {
    expect(preguntaQuitar('catalogo-web', ['panel-dueno'])).toBe(
      'Si quitas Catálogo web, también se quitará Panel del dueño.',
    );
    expect(preguntaQuitar('catalogo-web', ['panel-dueno', 'pedidos-whatsapp'])).toBe(
      'Si quitas Catálogo web, también se quitarán Panel del dueño y Pedidos por WhatsApp.',
    );
  });

  it('aviso después de quitar', () => {
    const solo = quitarModulo({ items: ['chatbot'] }, 'chatbot');
    const cascada = quitarModulo({ items: ['catalogo-web', 'panel-dueno'] }, 'catalogo-web', { confirmado: true });
    if (solo.estado !== 'quitado' || cascada.estado !== 'quitado') throw new Error('se esperaba "quitado"');
    expect(avisoQuitar('chatbot', solo)).toBe('Quitaste Chatbot.');
    expect(avisoQuitar('catalogo-web', cascada)).toBe('Quitaste Catálogo web. También se quitó Panel del dueño.');
  });
});

describe('textoTotales', () => {
  it('carrito vacío', () => {
    expect(textoTotales({ inicial: 0, mensual: 0, incluyeCotizar: false })).toEqual({
      inicial: 'S/ 0',
      notaCotizar: undefined,
      mensual: 'Sin mensualidad',
    });
  });

  it('solo módulos por cotizar', () => {
    expect(textoTotales({ inicial: 0, mensual: 0, incluyeCotizar: true }).inicial).toBe('Por cotizar');
  });

  it('precio "desde" más módulos por cotizar y mensualidad', () => {
    expect(textoTotales({ inicial: 120000, mensual: 14000, incluyeCotizar: true })).toEqual({
      inicial: 'Desde S/ 1,200',
      notaCotizar: '+ módulos por cotizar',
      mensual: 'S/ 140/mes',
    });
  });
});
