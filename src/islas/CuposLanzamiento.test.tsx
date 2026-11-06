import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LANZAMIENTO } from '../catalogo-servicios/lanzamiento';
import CuposLanzamiento, { textoCupos } from './CuposLanzamiento';

const conUsados = (usados: number) => ({ ...LANZAMIENTO, usados });
const html = (usados: number) => renderToStaticMarkup(<CuposLanzamiento lanzamiento={conUsados(usados)} />);

describe('CuposLanzamiento', () => {
  it('dice cuántos cupos quedan, en singular y plural', () => {
    expect(textoCupos(conUsados(0))).toBe('quedan 5 de 5 cupos');
    expect(textoCupos(conUsados(4))).toBe('queda 1 de 5 cupos');
  });

  it('muestra S/ 700 destacado, S/ 900 tachado y el texto real de los cupos', () => {
    const marcado = html(2);
    expect(marcado).toContain('Desde S/ 700');
    expect(marcado).toMatch(/<s[^>]*>.*S\/ 900<\/s>/);
    const texto = marcado.replace(/<[^>]+>/g, '');
    expect(texto).toContain('Precio de lanzamiento · quedan 3 de 5 cupos');
  });

  it('la barra tiene un segmento por cupo, resalta los libres y es decorativa', () => {
    const marcado = html(2);
    expect(marcado).toContain('aria-hidden="true"');
    expect(marcado.match(/class="cupos__cupo/g)).toHaveLength(5);
    expect(marcado.match(/cupos__cupo--libre/g)).toHaveLength(3);
  });

  it('con los cupos llenos desaparece (queda el precio normal de textoPrecio)', () => {
    expect(html(5)).toBe('');
  });
});
