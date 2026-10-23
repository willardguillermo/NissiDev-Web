import { valoresDisponibles, type Filtros } from './filtros';
import { ocasionesVisibles } from './rubro';
import type { RubroConfig } from './tipos';

// Chips del catálogo: solo valores que existen en el catálogo y que tienen sentido para este negocio.

export type ClaveFiltro = 'categoria' | 'ocasion' | 'puesto' | 'marca';

export interface OpcionFiltro {
  valor: string | number;
  texto: string;
}

export interface GrupoFiltro {
  clave: ClaveFiltro;
  nombre: string;
  opciones: OpcionFiltro[];
}

export function gruposDeFiltro(config: RubroConfig): GrupoFiltro[] {
  const disponibles = valoresDisponibles(config.productos);
  const grupos: GrupoFiltro[] = [
    {
      clave: 'categoria',
      nombre: 'Categoría',
      opciones: config.categorias.filter((c) => disponibles.categorias.includes(c.id)).map((c) => ({ valor: c.id, texto: c.nombre })),
    },
    {
      clave: 'ocasion',
      nombre: 'Ocasión',
      opciones: ocasionesVisibles(config)
        .filter((o) => disponibles.ocasiones.includes(o.id))
        .map((o) => ({ valor: o.id, texto: o.nombre })),
    },
    {
      clave: 'puesto',
      nombre: 'Puesto',
      opciones:
        config.puestos.length > 1
          ? config.puestos.filter((p) => disponibles.puestos.includes(p.numero)).map((p) => ({ valor: p.numero, texto: p.nombre }))
          : [],
    },
    { clave: 'marca', nombre: 'Marca', opciones: disponibles.marcas.map((m) => ({ valor: m, texto: m })) },
  ];
  return grupos.filter((g) => g.opciones.length > 0);
}

/** Tocar un chip lo activa; tocar el activo lo quita. Un valor por grupo. */
export function alternarFiltro(filtros: Filtros, clave: ClaveFiltro, valor: string | number): Filtros {
  const siguiente: Filtros = { ...filtros };
  if (siguiente[clave] === valor) delete siguiente[clave];
  else Object.assign(siguiente, { [clave]: valor });
  return siguiente;
}

export const hayFiltros = (filtros: Filtros) =>
  Object.entries(filtros).some(([clave, valor]) => (clave === 'texto' ? Boolean(String(valor ?? '').trim()) : valor !== undefined));
