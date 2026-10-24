import { describe, expect, it } from 'vitest';
import { RUBRO_DE_PRUEBA } from '../demo/rubro-de-prueba';
import { variablesDeTema } from '../demo/tema';
import { contraste } from '../ui/contraste';
import tokensCss from './tokens.css?raw';

// Lee los valores reales de tokens.css: si alguien cambia un color, estos tests lo notan.
// Acepta "--color-negro" o el nombre corto "negro", y sigue los alias (--a: var(--b)) por su nombre exacto.
function valorDe(variable: string): string | undefined {
  const valor = tokensCss.match(new RegExp(`${variable}:\\s*([^;]+);`))?.[1].trim();
  const alias = valor?.match(/^var\((--[a-z0-9-]+)\)$/)?.[1];
  return alias ? valorDe(alias) : valor;
}

function token(nombre: string): string {
  const valor = valorDe(`--color-${nombre}`) ?? valorDe(`--${nombre}`);
  if (!valor) throw new Error(`No se encontró ${nombre} en tokens.css`);
  return valor;
}

function color(nombre: string): string {
  const valor = token(nombre);
  if (!/^#[0-9a-f]{6}$/i.test(valor)) throw new Error(`${nombre} no es un color #rrggbb: ${valor}`);
  return valor;
}

/** Color que se ve al poner `arriba` con opacidad `alfa` sobre `abajo`. */
function mezclar(arriba: string, abajo: string, alfa: number): string {
  const canal = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) => Math.round(canal(arriba, i) * alfa + canal(abajo, i) * (1 - alfa)).toString(16).padStart(2, '0'))
    .join('')}`;
}

const TEXTO = 4.5; // WCAG AA, texto normal
const GRAFICO = 3; // WCAG AA, contornos de foco y elementos gráficos

// Todos los fondos claros donde puede caer texto: la crema, el blanco, la crema bajo cada luz
// (sin contar el desenfoque, que solo aclara los bordes) y el vidrio en su parte más transparente
// encima de cada uno de esos.
const crema = color('claro');
const luces = [1, 2, 3, 4].map((n) => mezclar(color(`luz-${n}`), crema, Number(token(`luz-${n}-opacidad`))));
const alfaVidrio = Number(token('vidrio-2-alfa'));
const FONDOS_CLAROS: [string, string][] = [
  ['crema', crema],
  ['blanco', color('blanco')],
  ...luces.map((fondo, i): [string, string] => [`luz ${i + 1}`, fondo]),
  ...[crema, ...luces].map((fondo, i): [string, string] => [
    `vidrio sobre ${i === 0 ? 'crema' : `luz ${i}`}`,
    mezclar('#ffffff', fondo, alfaVidrio),
  ]),
];

const TEXTOS_SOBRE_CLARO = ['negro', 'tinta-2', 'tinta-3', 'oro-texto'];

describe('contraste de los tokens', () => {
  it('la marca sigue igual: crema #F7F4EC, tinta #1E1F22 y dorado #B28A4C', () => {
    expect(color('claro').toLowerCase()).toBe('#f7f4ec');
    expect(color('negro').toLowerCase()).toBe('#1e1f22');
    expect(color('dorado').toLowerCase()).toBe('#b28a4c');
  });

  it('los textos de la TD2 tienen los valores aprobados', () => {
    expect([color('tinta-2'), color('tinta-3'), color('oro-texto'), color('oro-claro')]).toEqual([
      '#3e3f44',
      '#55565b',
      '#6e5122',
      '#e7cf9f',
    ]);
  });

  describe.each(TEXTOS_SOBRE_CLARO)('texto %s', (texto) => {
    it.each(FONDOS_CLAROS)('sobre %s ≥ 4.5:1', (_, fondo) => {
      expect(contraste(color(texto), fondo)).toBeGreaterThanOrEqual(TEXTO);
    });
  });

  it.each([
    ['claro', 'negro'],
    ['blanco', 'negro'],
    ['oro-claro', 'negro'],
    ['piedra', 'negro'],
    ['arena', 'negro'],
    ['dorado', 'negro'],
    ['negro', 'dorado'],
  ])('texto %s sobre %s ≥ 4.5:1', (texto, fondo) => {
    expect(contraste(color(texto), color(fondo))).toBeGreaterThanOrEqual(TEXTO);
  });

  it('el oro claro y el dorado NO sirven como texto sobre claro (solo sobre oscuro o como adorno)', () => {
    expect(contraste(color('oro-claro'), crema)).toBeLessThan(TEXTO);
    expect(contraste(color('dorado'), crema)).toBeLessThan(TEXTO);
  });

  it('no quedan los grises claros de la TD1 como texto', () => {
    expect(tokensCss).not.toMatch(/--color-gris:/);
    expect(tokensCss).not.toMatch(/--color-dorado-texto:/);
    expect(tokensCss).toMatch(/--texto-suave:\s*var\(--tinta-2\)/);
  });

  it.each([
    ['contorno', 'blanco'],
    ['contorno', 'claro'],
  ])('el contorno de los controles (%s) se distingue sobre %s ≥ 3:1', (borde, fondo) => {
    expect(contraste(color(borde), color(fondo))).toBeGreaterThanOrEqual(GRAFICO);
  });

  it.each(FONDOS_CLAROS)('el foco (oro-texto) se ve sobre %s ≥ 3:1', (_, fondo) => {
    expect(tokensCss).toMatch(/--foco:\s*var\(--oro-texto\)/);
    expect(contraste(color('oro-texto'), fondo)).toBeGreaterThanOrEqual(GRAFICO);
  });

  it('el foco en fondos oscuros (dorado original) se ve sobre negro', () => {
    expect(tokensCss).toMatch(/--foco-sobre-oscuro:\s*var\(--color-dorado\)/);
    expect(contraste(color('dorado'), color('negro'))).toBeGreaterThanOrEqual(GRAFICO);
  });

  it('el oro-texto NO sirve como foco sobre negro (por eso existe .zona-oscura)', () => {
    expect(contraste(color('oro-texto'), color('negro'))).toBeLessThan(GRAFICO);
  });
});

// Toda var(--…) usada en el código debe existir en tokens.css (o declararse en el mismo archivo).
// Las --d-* de las demos salen del tema del negocio (demo/tema.ts).
const fuentes = import.meta.glob('../**/*.{astro,tsx,css}', { query: '?raw', import: 'default', eager: true });

describe('variables de diseño', () => {
  it('no hay var(--…) sin definir', () => {
    const definidas = new Set([
      ...[...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
      ...Object.keys(variablesDeTema(RUBRO_DE_PRUEBA.tema)),
    ]);
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
