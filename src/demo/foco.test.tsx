import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TarjetaInmueble } from '../islas/inmobiliaria/TarjetaInmueble';
import { TarjetaProducto } from '../islas/demo/TarjetaProducto';
import { INMOBILIARIA } from '../rubros/inmobiliaria/config';
import { DULCERIA } from '../rubros/dulceria/config';
import { ATRIBUTO_ABRIR, destinoDelFoco } from './foco';

const INMO = { ficha: 'ficha', listas: ['catalogo'] } as const;
const DULCE = { ficha: 'detalle', listas: ['catalogo', 'inicio'] } as const;

describe('destinoDelFoco', () => {
  it('al volver de la ficha al catálogo, el foco va a la tarjeta que se abrió', () => {
    expect(
      destinoDelFoco({ vista: 'cliente', pantalla: 'ficha', id: 'DEP-104' }, { vista: 'cliente', pantalla: 'catalogo' }, INMO),
    ).toEqual({ tipo: 'tarjeta', id: 'DEP-104' });
  });

  it('en la dulcería también al volver del detalle al inicio (más vendidos)', () => {
    expect(
      destinoDelFoco({ vista: 'cliente', pantalla: 'detalle', id: 'p1' }, { vista: 'cliente', pantalla: 'inicio' }, DULCE),
    ).toEqual({ tipo: 'tarjeta', id: 'p1' });
  });

  it.each([
    ['abrir una ficha', { vista: 'cliente', pantalla: 'catalogo' }, { vista: 'cliente', pantalla: 'ficha', id: 'A' }],
    ['de la ficha al perfil del agente', { vista: 'cliente', pantalla: 'ficha', id: 'A' }, { vista: 'cliente', pantalla: 'agente' }],
    ['de la ficha a la vista dueño', { vista: 'cliente', pantalla: 'ficha', id: 'A' }, { vista: 'dueno', pantalla: 'ficha', id: 'A' }],
    ['del dueño al catálogo (no viene de la ficha)', { vista: 'dueno', pantalla: 'ficha', id: 'A' }, { vista: 'cliente', pantalla: 'catalogo' }],
    ['de una ficha sin id', { vista: 'cliente', pantalla: 'ficha' }, { vista: 'cliente', pantalla: 'catalogo' }],
  ])('%s: el foco va al título', (_caso, anterior, siguiente) => {
    expect(destinoDelFoco(anterior, siguiente, INMO)).toEqual({ tipo: 'titulo' });
  });
});

// La isla busca [data-abrir="{id}"]: cada tarjeta debe marcar con su id el botón que abre su ficha.
describe('las tarjetas marcan su botón para recibir el foco', () => {
  it('tarjeta de inmueble', () => {
    const inmueble = INMOBILIARIA.inmuebles[0];
    const html = renderToStaticMarkup(<TarjetaInmueble inmueble={inmueble} tipoCambio={3.75} abrir={() => {}} />);
    expect(html).toMatch(new RegExp(`<button[^>]*${ATRIBUTO_ABRIR}="${inmueble.codigo}"`));
  });

  it('tarjeta de producto', () => {
    const producto = DULCERIA.productos[0];
    const html = renderToStaticMarkup(
      <TarjetaProducto producto={producto} ilustracion="caramelo" mostrar="ambos" vendePorMayor abrir={() => {}} agregar={() => {}} />,
    );
    expect(html).toMatch(new RegExp(`<button[^>]*${ATRIBUTO_ABRIR}="${producto.id}"`));
  });
});
