import { describe, expect, it } from 'vitest';
import { STACK } from '../catalogo-servicios/proceso';
import { contraste } from './contraste';
import { ICONOS_TECNOLOGIAS, medidasIcono, PLACA_ICONOS } from './iconos-tecnologias';

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

  it('cada color de marca se distingue de su placa (3:1, mínimo para un ícono)', () => {
    for (const [nombre, icono] of Object.entries(ICONOS_TECNOLOGIAS)) {
      expect(contraste(icono.color, PLACA_ICONOS), nombre).toBeGreaterThanOrEqual(3);
    }
  });

  it('los íconos anchos ocupan más ancho, sin pasar de 3.25 rem', () => {
    expect(medidasIcono('0 0 24 24')).toEqual({ ancho: 1.75, alto: 1.75 });
    const mysql = medidasIcono(ICONOS_TECNOLOGIAS.MySQL.caja);
    expect(mysql.alto).toBeCloseTo(1.75);
    expect(mysql.ancho).toBeGreaterThan(2.4);
    const cloudflare = medidasIcono(ICONOS_TECNOLOGIAS.Cloudflare.caja);
    expect(cloudflare.ancho).toBe(3.25);
    expect(cloudflare.alto).toBeLessThan(1.75);
  });
});
