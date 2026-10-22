import type { Producto } from './tipos';

export interface Filtros {
  texto?: string;
  categoria?: string;
  ocasion?: string;
  puesto?: number;
  marca?: string;
}

/** Minúsculas, sin tildes (la ñ queda como n) y con espacios simples: "Piñata" → "pinata". */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const textoBuscable = (p: Producto) => normalizar(`${p.nombre} ${p.marca} ${p.categoria}`);

/** Todos los filtros se combinan; en el texto, cada palabra tiene que aparecer. */
export function filtrarProductos(productos: readonly Producto[], filtros: Filtros): Producto[] {
  const palabras = normalizar(filtros.texto ?? '').split(' ').filter(Boolean);
  return productos.filter((p) => {
    if (filtros.categoria !== undefined && p.categoria !== filtros.categoria) return false;
    if (filtros.ocasion !== undefined && !p.ocasiones.includes(filtros.ocasion)) return false;
    if (filtros.puesto !== undefined && !p.puestos.includes(filtros.puesto)) return false;
    if (filtros.marca !== undefined && p.marca !== filtros.marca) return false;
    const buscable = textoBuscable(p);
    return palabras.every((palabra) => buscable.includes(palabra));
  });
}

const unicosOrdenados = <T extends string | number>(valores: T[]): T[] =>
  [...new Set(valores)].sort((a, b) =>
    typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'es'),
  );

/** Valores que de verdad existen en el catálogo, para armar los chips de filtro. */
export function valoresDisponibles(productos: readonly Producto[]) {
  return {
    categorias: unicosOrdenados(productos.map((p) => p.categoria)),
    ocasiones: unicosOrdenados(productos.flatMap((p) => p.ocasiones)),
    puestos: unicosOrdenados(productos.flatMap((p) => p.puestos)),
    marcas: unicosOrdenados(productos.map((p) => p.marca)),
  };
}
