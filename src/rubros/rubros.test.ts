import { describe, expect, it } from 'vitest';
import { RUBROS } from './rubros';

// Solo los nombres de archivo (sin cargarlos): las páginas de demo que existen.
const paginasDeDemo = Object.keys(import.meta.glob('../pages/soluciones/*.astro'));

describe('rubros de la página Soluciones', () => {
  it('tienen ids únicos', () => {
    const ids = RUBROS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('la dulcería es la única demo activa en el MVP', () => {
    expect(RUBROS.filter((r) => r.estado === 'activa').map((r) => r.id)).toEqual(['dulceria']);
  });

  it('cada demo activa enlaza a una página que existe', () => {
    for (const rubro of RUBROS) {
      if (rubro.estado !== 'activa') continue;
      expect(rubro.ruta).toBe(`/soluciones/${rubro.id}/`);
      expect(paginasDeDemo).toContain(`../pages/soluciones/${rubro.id}.astro`);
    }
  });

  it('son los 5 rubros de ADR-004, en orden', () => {
    expect(RUBROS.map((r) => r.nombre)).toEqual(['Dulcería', 'Restaurante', 'Salón de belleza', 'Clínica', 'Negocio por mayor']);
  });
});
