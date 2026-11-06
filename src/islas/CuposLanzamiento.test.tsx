import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { Lanzamiento } from '../catalogo-servicios/lanzamiento';
import {
  LANZAMIENTO_ACTIVO,
  LANZAMIENTO_AGOTADO,
  LANZAMIENTO_ULTIMO_CUPO,
  LANZAMIENTO_UNO_USADO,
} from '../catalogo-servicios/lanzamiento.prueba';
import CuposLanzamiento, { textoCupos } from './CuposLanzamiento';

const html = (lanzamiento: Lanzamiento) => renderToStaticMarkup(<CuposLanzamiento lanzamiento={lanzamiento} />);
const texto = (lanzamiento: Lanzamiento) => html(lanzamiento).replace(/<[^>]+>/g, '');

describe('CuposLanzamiento', () => {
  it('dice cuántos cupos quedan, en plural y en singular', () => {
    expect(textoCupos(LANZAMIENTO_ACTIVO)).toBe('quedan 5 de 5 cupos');
    expect(textoCupos(LANZAMIENTO_UNO_USADO)).toBe('quedan 4 de 5 cupos');
    expect(textoCupos(LANZAMIENTO_ULTIMO_CUPO)).toBe('queda 1 de 5 cupos');
  });

  it.each([
    [LANZAMIENTO_ACTIVO, 'quedan 5 de 5 cupos', 5],
    [LANZAMIENTO_UNO_USADO, 'quedan 4 de 5 cupos', 4],
  ])('muestra S/ 700 destacado, S/ 900 tachado, el texto real y los cupos libres resaltados', (lanzamiento, frase, libres) => {
    const marcado = html(lanzamiento);
    expect(marcado).toContain('Desde S/ 700');
    expect(marcado).toMatch(/<s[^>]*>.*S\/ 900<\/s>/);
    expect(texto(lanzamiento)).toContain(`Precio de lanzamiento · ${frase}`);
    expect(marcado.match(/class="cupos__cupo/g)).toHaveLength(5);
    expect(marcado.match(/cupos__cupo--libre/g)).toHaveLength(libres);
  });

  it('la barra es decorativa: el lector de pantalla solo lee el texto', () => {
    expect(html(LANZAMIENTO_ACTIVO)).toMatch(/<span class="cupos__barra" aria-hidden="true">/);
  });

  it('con los cupos agotados desaparece (quien la usa muestra «Desde S/ 900» con textoPrecio)', () => {
    expect(html(LANZAMIENTO_AGOTADO)).toBe('');
  });
});
