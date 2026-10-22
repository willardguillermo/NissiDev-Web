import { describe, expect, it } from 'vitest';
import { CATALOGO_DE_PRUEBA } from './catalogo-de-prueba';
import { filtrarProductos, normalizar, valoresDisponibles } from './filtros';

const ids = (filtros: Parameters<typeof filtrarProductos>[1]) =>
  filtrarProductos(CATALOGO_DE_PRUEBA, filtros).map((p) => p.id);

describe('normalizar', () => {
  it('minúsculas, sin tildes, ñ como n y espacios simples', () => {
    expect(normalizar('  GALLETÓN   de  Avena ')).toBe('galleton de avena');
    expect(normalizar('Piñata')).toBe('pinata');
  });
});

describe('búsqueda por texto', () => {
  it('sin importar tildes ni mayúsculas', () => {
    expect(ids({ texto: 'galleton' })).toEqual(['galleton-avena']);
    expect(ids({ texto: 'GALLETÓN' })).toEqual(['galleton-avena']);
  });

  it('la ñ se encuentra con o sin tilde', () => {
    expect(ids({ texto: 'pinata' })).toEqual(['pinata-estrella']);
    expect(ids({ texto: 'piñata' })).toEqual(['pinata-estrella']);
  });

  it('busca también en la marca y la categoría', () => {
    expect(ids({ texto: 'dona nata' })).toEqual(['galleton-avena']);
    expect(ids({ texto: 'gomitas' })).toEqual(['gomitas-osito']);
  });

  it('todas las palabras deben aparecer', () => {
    expect(ids({ texto: 'chocolate luna' })).toEqual(['choco-luna']);
    expect(ids({ texto: 'chocolate osito' })).toEqual([]);
  });

  it('texto vacío o solo espacios no filtra', () => {
    expect(ids({ texto: '' })).toHaveLength(4);
    expect(ids({ texto: '   ' })).toHaveLength(4);
  });
});

describe('filtros', () => {
  it('sin filtros devuelve todo, en el mismo orden', () => {
    expect(ids({})).toEqual(['choco-luna', 'gomitas-osito', 'galleton-avena', 'pinata-estrella']);
  });

  it('por categoría, ocasión, puesto y marca', () => {
    expect(ids({ categoria: 'galletas' })).toEqual(['galleton-avena']);
    expect(ids({ ocasion: 'cumpleanos' })).toEqual(['choco-luna', 'pinata-estrella']);
    expect(ids({ puesto: 3 })).toEqual(['galleton-avena', 'pinata-estrella']);
    expect(ids({ marca: 'Gomilandia' })).toEqual(['gomitas-osito']);
  });

  it('se combinan entre sí y con el texto', () => {
    expect(ids({ ocasion: 'bolsitas-sorpresa', puesto: 2 })).toEqual(['gomitas-osito']);
    expect(ids({ ocasion: 'cumpleanos', puesto: 3, texto: 'estrella' })).toEqual(['pinata-estrella']);
    expect(ids({ categoria: 'chocolates', puesto: 3 })).toEqual([]);
  });

  it('sin resultados devuelve una lista vacía', () => {
    expect(ids({ texto: 'helado' })).toEqual([]);
  });

  it('no modifica el catálogo', () => {
    const antes = structuredClone(CATALOGO_DE_PRUEBA);
    filtrarProductos(CATALOGO_DE_PRUEBA, { texto: 'a', puesto: 3 });
    expect(CATALOGO_DE_PRUEBA).toEqual(antes);
  });
});

describe('valoresDisponibles', () => {
  it('lista sin repetir las categorías, ocasiones, puestos y marcas que existen', () => {
    expect(valoresDisponibles(CATALOGO_DE_PRUEBA)).toEqual({
      categorias: ['chocolates', 'galletas', 'gomitas', 'piñatería'],
      ocasiones: ['bolsitas-sorpresa', 'cumpleanos', 'halloween', 'por-mayor'],
      puestos: [1, 2, 3],
      marcas: ['Doña Ñata', 'Fiesta Feliz', 'Gomilandia', 'Lunar Dulces'],
    });
  });
});
