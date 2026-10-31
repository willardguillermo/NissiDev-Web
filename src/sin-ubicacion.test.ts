import { describe, expect, it } from 'vitest';

// ADR-004: la web no menciona ninguna zona. La zona es estrategia interna (solo en BRIEF/SPEC).
// Todo src/ como texto (sin ejecutarlo), salvo este archivo.
const archivos = import.meta.glob<string>(['./**/*', '!./sin-ubicacion.test.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('textos sin ubicación', () => {
  it('lee los archivos de src/', () => {
    expect(Object.keys(archivos)).toContain('./layouts/Base.astro');
  });

  it('ningún archivo de src/ dice "Este de Lima"', () => {
    const conZona = Object.entries(archivos)
      .filter(([, texto]) => /este de lima/i.test(texto))
      .map(([ruta]) => ruta);
    expect(conZona).toEqual([]);
  });
});
