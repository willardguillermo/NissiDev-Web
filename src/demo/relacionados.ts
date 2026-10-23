import { ocasionesVisibles } from './rubro';
import type { Producto, RubroConfig } from './tipos';

/**
 * "También te puede gustar": primero los de la misma categoría, después los que comparten una
 * ocasión visible. Sin el mismo producto ni agotados; en el orden del catálogo.
 */
export function tambienTePuedeGustar(config: RubroConfig, producto: Producto, maximo = 4): Producto[] {
  const visibles = new Set(ocasionesVisibles(config).map((o) => o.id));
  const comparteOcasion = (p: Producto) => p.ocasiones.some((o) => visibles.has(o) && producto.ocasiones.includes(o));
  const candidatos = config.productos.filter((p) => p.id !== producto.id && p.etiqueta !== 'agotado');
  const mismaCategoria = candidatos.filter((p) => p.categoria === producto.categoria);
  const porOcasion = candidatos.filter((p) => p.categoria !== producto.categoria && comparteOcasion(p));
  return [...mismaCategoria, ...porOcasion].slice(0, maximo);
}
