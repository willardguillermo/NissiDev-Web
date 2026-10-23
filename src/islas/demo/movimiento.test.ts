import { describe, expect, it } from 'vitest';
import demoCss from './demo.css?raw';

// Giros y desplazamientos de demo.css: cada uno necesita su versión con movimiento reducido.
// Las entradas con @keyframes ya cambian a demo-fundido; aquí se revisan las reglas sueltas.

const sinKeyframes = demoCss.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
const bloquesReducidos = [...demoCss.matchAll(/@media[^{]*prefers-reduced-motion: reduce[^{]*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}/g)]
  .map((m) => m[1])
  .join('\n');

describe('movimiento reducido en demo.css', () => {
  it('solo hay los giros y desplazamientos conocidos (si agregas uno, cúbrelo abajo)', () => {
    const reglas = [...sinKeyframes.matchAll(/([^{}]+)\{[^{}]*transform:\s*(?:rotate|translate)[^;]*;[^{}]*\}/g)].map((m) => m[1].trim().replace(/\s+/g, ' '));
    expect(reglas).toEqual([
      ".demo-filtros__mas[aria-expanded='true'] svg",
      '.demo-ocasion:hover, .demo-categoria:hover, .tarjeta-producto:hover',
    ]);
  });

  it('la flecha de "Más filtros" no gira: cambia de golpe', () => {
    expect(bloquesReducidos).toMatch(/\.demo-filtros__mas svg\s*\{\s*transition:\s*none;/);
  });

  it('el hover no levanta las tarjetas', () => {
    expect(bloquesReducidos).toMatch(/\.tarjeta-producto:hover\s*\{\s*transform:\s*none;/);
  });
});
