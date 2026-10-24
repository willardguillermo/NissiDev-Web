import { describe, expect, it } from 'vitest';
import { PASOS, TECNOLOGIAS } from './proceso';

describe('proceso y stack', () => {
  it('el proceso va de la maqueta al soporte, con unas 4 semanas de desarrollo', () => {
    expect(PASOS.map((p) => p.titulo)).toEqual(['Maqueta', 'Propuesta', 'Desarrollo', 'Soporte']);
    expect(PASOS[2].texto).toContain('4 semanas');
  });

  it('la lista plana del Inicio conserva las 6 tecnologías, sin repetir', () => {
    expect(TECNOLOGIAS).toEqual(['Astro', 'React', 'Kotlin · Android', 'Spring Boot', 'MySQL', 'Cloudflare']);
    expect(new Set(TECNOLOGIAS).size).toBe(TECNOLOGIAS.length);
  });
});
