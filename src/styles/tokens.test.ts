import { describe, expect, it } from 'vitest';
import { contraste } from '../ui/contraste';
import tokensCss from './tokens.css?raw';

// Lee los colores reales de tokens.css: si alguien cambia un color, estos tests lo notan.
function color(nombre: string): string {
  const valor = tokensCss.match(new RegExp(`--color-${nombre}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  if (!valor) throw new Error(`No se encontró --color-${nombre} en tokens.css`);
  return valor;
}

const TEXTO = 4.5; // WCAG AA, texto normal
const GRAFICO = 3; // WCAG AA, contornos de foco y elementos gráficos

describe('contraste de los tokens', () => {
  it.each([
    ['negro', 'claro'],
    ['negro', 'blanco'],
    ['dorado-texto', 'claro'],
    ['dorado-texto', 'blanco'],
    ['gris', 'claro'],
    ['gris', 'blanco'],
    ['claro', 'negro'],
    ['piedra', 'negro'],
    ['arena', 'negro'],
    ['oro-claro', 'negro'],
    ['dorado', 'negro'],
    ['negro', 'dorado'],
  ])('texto %s sobre %s ≥ 4.5:1', (texto, fondo) => {
    expect(contraste(color(texto), color(fondo))).toBeGreaterThanOrEqual(TEXTO);
  });

  it.each([
    ['contorno', 'blanco'],
    ['contorno', 'claro'],
  ])('el contorno de los controles (%s) se distingue sobre %s ≥ 3:1', (borde, fondo) => {
    expect(contraste(color(borde), color(fondo))).toBeGreaterThanOrEqual(GRAFICO);
  });

  it('el foco en fondos claros (dorado-texto) se ve sobre claro y blanco', () => {
    expect(tokensCss).toMatch(/--foco:\s*var\(--color-dorado-texto\)/);
    expect(contraste(color('dorado-texto'), color('claro'))).toBeGreaterThanOrEqual(GRAFICO);
    expect(contraste(color('dorado-texto'), color('blanco'))).toBeGreaterThanOrEqual(GRAFICO);
  });

  it('el foco en fondos oscuros (dorado original) se ve sobre negro', () => {
    expect(tokensCss).toMatch(/--foco-sobre-oscuro:\s*var\(--color-dorado\)/);
    expect(contraste(color('dorado'), color('negro'))).toBeGreaterThanOrEqual(GRAFICO);
  });

  it('el dorado oscuro NO sirve como foco sobre negro (por eso existe .zona-oscura)', () => {
    expect(contraste(color('dorado-texto'), color('negro'))).toBeLessThan(GRAFICO);
  });

  it('el dorado original NO sirve como texto sobre claro', () => {
    expect(contraste(color('dorado'), color('claro'))).toBeLessThan(TEXTO);
  });
});

// Toda var(--…) usada en el código debe existir en tokens.css (o declararse en el mismo archivo).
const fuentes = import.meta.glob('../**/*.{astro,tsx,css}', { query: '?raw', import: 'default', eager: true });

describe('variables de diseño', () => {
  it('no hay var(--…) sin definir', () => {
    const definidas = new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
    const sinDefinir: string[] = [];
    for (const [archivo, contenido] of Object.entries(fuentes)) {
      const texto = String(contenido);
      const locales = new Set([...texto.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
      for (const [, nombre] of texto.matchAll(/var\((--[a-z0-9-]+)/g)) {
        if (!definidas.has(nombre) && !locales.has(nombre)) sinDefinir.push(`${archivo}: ${nombre}`);
      }
    }
    expect(Object.keys(fuentes).length).toBeGreaterThan(5);
    expect(sinDefinir).toEqual([]);
  });
});
