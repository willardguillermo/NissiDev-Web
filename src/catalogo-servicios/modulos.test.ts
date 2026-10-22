import { describe, expect, it } from 'vitest';
import { MODULOS, obtenerModulo, type ModuloId } from './modulos';

const ids = MODULOS.map((m) => m.id);

describe('catálogo de módulos', () => {
  it('tiene los 9 módulos del BRIEF', () => {
    expect(ids).toHaveLength(9);
  });

  it('no repite ids', () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda dependencia existe en el catálogo y no es el propio módulo', () => {
    for (const modulo of MODULOS) {
      for (const dep of modulo.dependencias) {
        expect(ids).toContain(dep);
        expect(dep).not.toBe(modulo.id);
      }
    }
  });

  it('no hay ciclos de dependencias', () => {
    const visitando = new Set<ModuloId>();
    const terminados = new Set<ModuloId>();
    const visitar = (id: ModuloId, camino: ModuloId[]) => {
      if (terminados.has(id)) return;
      if (visitando.has(id)) throw new Error(`Ciclo: ${[...camino, id].join(' → ')}`);
      visitando.add(id);
      for (const dep of obtenerModulo(id).dependencias) visitar(dep, [...camino, id]);
      visitando.delete(id);
      terminados.add(id);
    };
    for (const id of ids) expect(() => visitar(id, [])).not.toThrow();
  });

  it('un módulo "incluido en" depende del módulo que lo incluye', () => {
    for (const modulo of MODULOS) {
      if (modulo.precioInicial.tipo === 'incluido') {
        expect(modulo.dependencias).toContain(modulo.precioInicial.en);
      }
    }
  });

  it('Pedidos por WhatsApp está incluido en Catálogo web', () => {
    expect(obtenerModulo('pedidos-whatsapp').precioInicial).toEqual({ tipo: 'incluido', en: 'catalogo-web' });
  });

  it('los montos son céntimos enteros positivos', () => {
    for (const modulo of MODULOS) {
      const montos = [
        modulo.precioInicial.tipo === 'desde' ? modulo.precioInicial.centimos : undefined,
        modulo.mensualidad,
      ].filter((m) => m !== undefined);
      for (const monto of montos) {
        expect(Number.isSafeInteger(monto) && monto > 0).toBe(true);
      }
    }
  });

  it('respeta los precios y dependencias aprobados', () => {
    const resumen = Object.fromEntries(
      MODULOS.map((m) => [m.id, { inicial: m.precioInicial, mensual: m.mensualidad, deps: m.dependencias }]),
    );
    expect(resumen).toEqual({
      'catalogo-web': { inicial: { tipo: 'desde', centimos: 70000 }, mensual: undefined, deps: [] },
      'pedidos-whatsapp': { inicial: { tipo: 'incluido', en: 'catalogo-web' }, mensual: undefined, deps: ['catalogo-web'] },
      'panel-dueno': { inicial: { tipo: 'desde', centimos: 50000 }, mensual: undefined, deps: ['catalogo-web'] },
      reservas: { inicial: { tipo: 'cotizar' }, mensual: undefined, deps: [] },
      inventario: { inicial: { tipo: 'cotizar' }, mensual: undefined, deps: ['panel-dueno'] },
      caja: { inicial: { tipo: 'cotizar' }, mensual: 6000, deps: ['inventario'] },
      'boletas-sunat': { inicial: { tipo: 'cotizar' }, mensual: undefined, deps: ['caja'] },
      chatbot: { inicial: { tipo: 'cotizar' }, mensual: undefined, deps: [] },
      mantenimiento: { inicial: { tipo: 'ninguno' }, mensual: 8000, deps: [] },
    });
  });

  it('solo Mantenimiento exige otro módulo', () => {
    expect(MODULOS.filter((m) => m.requiereOtroModulo).map((m) => m.id)).toEqual(['mantenimiento']);
  });

  it('obtenerModulo falla con un id desconocido', () => {
    expect(() => obtenerModulo('inexistente' as ModuloId)).toThrow();
  });
});
