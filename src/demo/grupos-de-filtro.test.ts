import { describe, expect, it } from 'vitest';
import { alternarFiltro, gruposDeFiltro, hayFiltros } from './grupos-de-filtro';
import { personalizar } from './rubro';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';

const claves = (config = RUBRO_DE_PRUEBA) => gruposDeFiltro(config).map((g) => g.clave);
const opciones = (clave: string, config = RUBRO_DE_PRUEBA) =>
  gruposDeFiltro(config).find((g) => g.clave === clave)?.opciones.map((o) => o.valor);

describe('gruposDeFiltro', () => {
  it('categorías en el orden de la configuración, con su nombre', () => {
    expect(gruposDeFiltro(RUBRO_DE_PRUEBA)[0].opciones[0]).toEqual({ valor: 'chocolates', texto: 'Chocolates' });
  });

  it('con un solo puesto no hay chips de puesto', () => {
    expect(claves()).toContain('puesto');
    expect(claves(personalizar(RUBRO_DE_PRUEBA, { puestos: 1 }))).not.toContain('puesto');
  });

  it('solo ocasiones visibles: sin campaña no está Halloween; sin por mayor no está "Por mayor"', () => {
    expect(opciones('ocasion')).toEqual(['cumpleanos', 'bolsitas-sorpresa', 'halloween', 'por-mayor']);
    const sinNada = personalizar(RUBRO_DE_PRUEBA, { campana: null, porMayor: false });
    expect(opciones('ocasion', sinNada)).toEqual(['cumpleanos', 'bolsitas-sorpresa']);
  });

  it('no muestra valores sin productos', () => {
    const config = { ...RUBRO_DE_PRUEBA, categorias: [...RUBRO_DE_PRUEBA.categorias, { id: 'helados', nombre: 'Helados', ilustracion: '' }] };
    expect(opciones('categoria', config)).not.toContain('helados');
  });
});

describe('alternarFiltro y hayFiltros', () => {
  it('activa, cambia y quita un chip', () => {
    const uno = alternarFiltro({}, 'categoria', 'gomitas');
    expect(uno).toEqual({ categoria: 'gomitas' });
    expect(alternarFiltro(uno, 'categoria', 'galletas')).toEqual({ categoria: 'galletas' });
    expect(alternarFiltro(uno, 'categoria', 'gomitas')).toEqual({});
  });

  it('hay filtros si hay un chip o texto (los espacios no cuentan)', () => {
    expect(hayFiltros({})).toBe(false);
    expect(hayFiltros({ texto: '   ' })).toBe(false);
    expect(hayFiltros({ texto: 'choco' })).toBe(true);
    expect(hayFiltros({ puesto: 2 })).toBe(true);
  });
});
