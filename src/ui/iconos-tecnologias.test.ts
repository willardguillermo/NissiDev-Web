import { describe, expect, it } from 'vitest';
import { STACK } from '../catalogo-servicios/proceso';
import { ICONOS_TECNOLOGIAS } from './iconos-tecnologias';

describe('íconos de Sobre mí', () => {
  it('el stack son las 7 tecnologías agrupadas por uso', () => {
    expect(STACK.flatMap((g) => g.tecnologias)).toEqual([
      'Astro',
      'React',
      'Kotlin',
      'Android',
      'Spring Boot',
      'MySQL',
      'Cloudflare',
    ]);
  });

  it('cada tecnología del stack tiene su ícono y su color', () => {
    for (const tecnologia of STACK.flatMap((g) => g.tecnologias)) {
      const icono = ICONOS_TECNOLOGIAS[tecnologia];
      expect(icono, tecnologia).toBeDefined();
      expect(icono.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(icono.d).toMatch(/^[Mm]/);
    }
  });
});
