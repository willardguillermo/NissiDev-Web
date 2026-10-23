import { describe, expect, it } from 'vitest';
import { NAVEGACION_INICIAL, navegar } from './navegacion';

describe('navegar', () => {
  it('empieza en el Inicio de la vista cliente', () => {
    expect(NAVEGACION_INICIAL).toEqual({ vista: 'cliente', pantalla: 'inicio' });
  });

  it('abre el catálogo con filtros y el detalle con su producto', () => {
    const catalogo = navegar(NAVEGACION_INICIAL, { tipo: 'catalogo', filtros: { categoria: 'gomitas' } });
    expect(catalogo).toEqual({ vista: 'cliente', pantalla: 'catalogo', filtros: { categoria: 'gomitas' } });
    const detalle = navegar(catalogo, { tipo: 'detalle', productoId: 'gomitas-osito' });
    expect(detalle).toEqual({ vista: 'cliente', pantalla: 'detalle', productoId: 'gomitas-osito' });
  });

  it('ir al Inicio o al pedido olvida los filtros y el producto', () => {
    const detalle = navegar(NAVEGACION_INICIAL, { tipo: 'detalle', productoId: 'x' });
    expect(navegar(detalle, { tipo: 'pedido' })).toEqual({ vista: 'cliente', pantalla: 'pedido' });
    expect(navegar(detalle, { tipo: 'inicio' })).toEqual(NAVEGACION_INICIAL);
  });

  it('cambiar a la vista dueño y volver conserva la pantalla del cliente', () => {
    const catalogo = navegar(NAVEGACION_INICIAL, { tipo: 'catalogo', filtros: { texto: 'chocolate' } });
    const dueno = navegar(catalogo, { tipo: 'vista', vista: 'dueno' });
    expect(dueno.vista).toBe('dueno');
    expect(navegar(dueno, { tipo: 'vista', vista: 'cliente' })).toEqual(catalogo);
  });

  it('navegar desde la vista dueño vuelve a la vista cliente', () => {
    const dueno = navegar(NAVEGACION_INICIAL, { tipo: 'vista', vista: 'dueno' });
    expect(navegar(dueno, { tipo: 'catalogo' }).vista).toBe('cliente');
  });

  it('los filtros cambiados en el catálogo siguen ahí al ir a Dueño y volver a Cliente', () => {
    const catalogo = navegar(NAVEGACION_INICIAL, { tipo: 'catalogo', filtros: { categoria: 'gomitas' } });
    const filtrado = navegar(catalogo, { tipo: 'filtros', filtros: { categoria: 'gomitas', marca: 'Ambrosoli', texto: 'osito' } });
    const dueno = navegar(filtrado, { tipo: 'vista', vista: 'dueno' });
    expect(navegar(dueno, { tipo: 'vista', vista: 'cliente' })).toEqual({
      vista: 'cliente',
      pantalla: 'catalogo',
      filtros: { categoria: 'gomitas', marca: 'Ambrosoli', texto: 'osito' },
    });
  });

  it('el detalle no arrastra los filtros; los guarda el catálogo del que salió', () => {
    const filtrado = navegar(navegar(NAVEGACION_INICIAL, { tipo: 'catalogo' }), { tipo: 'filtros', filtros: { texto: 'chocolate' } });
    expect(filtrado.filtros).toEqual({ texto: 'chocolate' });
    expect(navegar(filtrado, { tipo: 'detalle', productoId: 'x' }).filtros).toBeUndefined();
  });

  it('cambiar filtros fuera del catálogo no hace nada', () => {
    const detalle = navegar(NAVEGACION_INICIAL, { tipo: 'detalle', productoId: 'x' });
    expect(navegar(detalle, { tipo: 'filtros', filtros: { texto: 'a' } })).toBe(detalle);
  });
});
