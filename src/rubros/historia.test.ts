import { describe, expect, it } from 'vitest';
import { contraste } from '../ui/contraste';
import { HISTORIA_DULCERIA } from './dulceria/historia';
import { armarHistoria, PASOS_HISTORIA, type DatosHistoria } from './historia';
import { HISTORIAS } from './historias';
import { HISTORIA_CLINICA } from './clinica/historia';
import { RUBROS } from './rubros';
import { DULCERIA } from './dulceria/config';
import { historiaDeLaDemo } from '../demo/historia';

const TEMA = DULCERIA.tema;
const datos: DatosHistoria = {
  negocio: 'Negocio de prueba',
  tema: TEMA,
  leyendas: [
    { titulo: 'a', texto: 'a' },
    { titulo: 'b', texto: 'b' },
    { titulo: 'c', texto: 'c' },
    { titulo: 'd', texto: 'd' },
  ],
  vitrina: { anuncio: '', buscador: '', titular: '', bajada: '', categorias: [] },
  pedido: {
    titulo: 'Carta',
    accion: 'Agregar',
    items: [
      { id: 'x', nombre: 'X', detalle: '', precio: 1250, ilustracion: '' },
      { id: 'y', nombre: 'Y', detalle: '', precio: 750, ilustracion: '' },
    ],
    elegidos: ['x', 'y'],
    resumen: 'Mi pedido (2)',
  },
  whatsapp: { lineas: ['Hola'], respuesta: 'Listo' },
  panel: {
    principal: { etiqueta: 'Ventas', valor: 'S/ 20', barras: [{ nombre: 'A', valor: 10 }, { nombre: 'B', valor: 40 }] },
    secundario: { etiqueta: 'Cobros', barras: [{ nombre: 'C', valor: 0 }] },
    aviso: null,
  },
};

describe('armarHistoria', () => {
  const h = armarHistoria(datos);

  it('suma los elegidos y cierra el mensaje con el total', () => {
    expect(h.pedido.total).toBe('S/ 20');
    expect(h.whatsapp.mensaje).toEqual(['Hola', 'Total: S/ 20']);
    expect(h.pedido.items.map((i) => i.precio)).toEqual(['S/ 12.50', 'S/ 7.50']);
  });

  it('las barras van de 0 a 1 respecto a la más larga', () => {
    expect(h.panel.principal.barras.map((b) => b.proporcion)).toEqual([0.25, 1]);
    expect(h.panel.secundario.barras[0].proporcion).toBe(0);
  });

  it('falla si un elegido no está en los items', () => {
    expect(() => armarHistoria({ ...datos, pedido: { ...datos.pedido, elegidos: ['z'] } })).toThrow('"z"');
  });
});

describe('historias de los 5 rubros', () => {
  it('los 4 pasos son generales, no de un rubro', () => {
    expect(PASOS_HISTORIA.map((p) => p.nombre)).toEqual([
      'Tu vitrina',
      'Tu cliente pide o reserva',
      'Te llega por WhatsApp',
      'Tu panel',
    ]);
  });

  it('hay una historia por cada rubro de RUBROS', () => {
    expect(Object.keys(HISTORIAS).sort()).toEqual(RUBROS.map((r) => r.id).sort());
  });

  for (const [id, h] of Object.entries(HISTORIAS)) {
    describe(id, () => {
      it('llena las 4 pantallas', () => {
        expect(h.leyendas).toHaveLength(4);
        expect(h.vitrina.categorias).toHaveLength(3);
        expect(h.pedido.items).toHaveLength(4);
        expect(h.panel.principal.barras.length).toBeGreaterThan(0);
        expect(h.panel.secundario.barras.length).toBeGreaterThan(0);
      });

      it('el mensaje saluda al negocio y repite el total', () => {
        expect(h.whatsapp.mensaje[0]).toContain(h.negocio);
        expect(h.whatsapp.mensaje).toContain(`Total: ${h.pedido.total}`);
        expect(h.whatsapp.mensaje).not.toContain('');
      });

      it('su tema se lee: texto, marca y etiquetas con contraste suficiente', () => {
        const t = h.tema;
        for (const fondo of [t.fondo, t.fondoSuave]) {
          expect(contraste(t.texto, fondo)).toBeGreaterThanOrEqual(4.5);
          expect(contraste(t.textoSuave, fondo)).toBeGreaterThanOrEqual(4.5);
          expect(contraste(t.marcaTexto, fondo)).toBeGreaterThanOrEqual(4.5);
        }
        expect(contraste(t.sobreMarca, t.marca)).toBeGreaterThanOrEqual(4.5);
        // El titular de la vitrina va con la etiqueta amarilla sobre negro (#1a1a1a)
        expect(contraste(t.etiquetaAmarilla, '#1a1a1a')).toBeGreaterThanOrEqual(4.5);
      });
    });
  }

  it('la dulcería sale de su demo completa', () => {
    const demo = historiaDeLaDemo(DULCERIA);
    expect(HISTORIA_DULCERIA.pedido.total).toBe(demo.pedido.total);
    expect(HISTORIA_DULCERIA.whatsapp).toEqual(demo.whatsapp);
    expect(HISTORIA_DULCERIA.pedido.items.map((i) => i.id)).toEqual(DULCERIA.masVendidos.slice(0, 4));
  });

  it('la clínica solo habla de citas y horarios, sin diagnósticos ni datos de salud', () => {
    const texto = JSON.stringify(HISTORIA_CLINICA).toLowerCase();
    for (const palabra of ['diagnóstico', 'síntoma', 'dolor', 'enfermedad', 'tratamiento', 'receta', 'alergia', 'historia clínica']) {
      expect(texto).not.toContain(palabra);
    }
  });
});
