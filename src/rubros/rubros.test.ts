import { describe, expect, it } from 'vitest';
import { enlacePedirDemo, RUBROS } from './rubros';

// Solo los nombres de archivo (sin cargarlos): las páginas de demo que existen.
const paginasDeDemo = Object.keys(import.meta.glob('../pages/soluciones/*.astro'));

describe('rubros de la página Soluciones', () => {
  it('tienen ids únicos', () => {
    const ids = RUBROS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('las demos activas son dulcería e inmobiliaria, y van primero', () => {
    expect(RUBROS.filter((r) => r.estado === 'activa').map((r) => r.id)).toEqual(['dulceria', 'inmobiliaria']);
    expect(RUBROS.slice(0, 2).every((r) => r.estado === 'activa')).toBe(true);
  });

  it('cada demo activa enlaza a una página que existe', () => {
    for (const rubro of RUBROS) {
      if (rubro.estado !== 'activa') continue;
      expect(rubro.ruta).toBe(`/soluciones/${rubro.id}/`);
      expect(paginasDeDemo).toContain(`../pages/soluciones/${rubro.id}.astro`);
    }
  });

  it('son los 5 rubros de ADR-004 más Inmobiliaria (2026-11-22), en orden', () => {
    expect(RUBROS.map((r) => r.nombre)).toEqual(['Dulcería', 'Inmobiliaria', 'Restaurante', 'Salón de belleza', 'Clínica', 'Negocio por mayor']);
  });

  it('pedir la demo por WhatsApp nombra el rubro', () => {
    const enlace = new URL(enlacePedirDemo({ nombre: 'Salón de belleza' }));
    expect(enlace.searchParams.get('text')).toContain('Salón de belleza');
  });
});
