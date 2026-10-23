import type { MedioPago, Producto, RubroConfig, Venta } from './tipos';

// Cálculos del panel del dueño. Todo sale de las ventas y productos de la configuración y de su
// fecha fija panel.hoy: la vista solo muestra lo que devuelven estas funciones.

const DIA = 86_400_000;
const diaDe = (fecha: string) => fecha.slice(0, 10);
const aDias = (fecha: string) => Date.UTC(+fecha.slice(0, 4), +fecha.slice(5, 7) - 1, +fecha.slice(8, 10)) / DIA;
/** Días de `desde` a `hasta` (AAAA-MM-DD); negativo si `hasta` es antes. */
export const diasEntre = (desde: string, hasta: string) => aDias(hasta) - aDias(desde);

export const totalVenta = (venta: Venta) => venta.lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

export interface VentasDePuesto {
  numero: number;
  nombre: string;
  total: number;
  ventas: number;
}

/** Ventas de hoy de cada puesto de la configuración (también los que no vendieron nada). */
export function ventasDelDiaPorPuesto(config: RubroConfig): VentasDePuesto[] {
  const deHoy = config.panel.ventas.filter((v) => diaDe(v.fecha) === config.panel.hoy);
  return config.puestos.map((p) => {
    const delPuesto = deHoy.filter((v) => v.puesto === p.numero);
    return { numero: p.numero, nombre: p.nombre, total: delPuesto.reduce((s, v) => s + totalVenta(v), 0), ventas: delPuesto.length };
  });
}

export const MEDIOS: { id: MedioPago; nombre: string }[] = [
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'yape', nombre: 'Yape' },
  { id: 'plin', nombre: 'Plin' },
];

/** Lo cobrado hoy con cada medio de pago, siempre en el mismo orden. */
export function cobrosPorMedio(config: RubroConfig): { medio: MedioPago; nombre: string; total: number }[] {
  const deHoy = config.panel.ventas.filter((v) => diaDe(v.fecha) === config.panel.hoy);
  return MEDIOS.map(({ id, nombre }) => ({
    medio: id,
    nombre,
    total: deHoy.filter((v) => v.medio === id).reduce((s, v) => s + totalVenta(v), 0),
  }));
}

/** Más vendidos en los últimos 7 días (hoy incluido), contados en unidad base. */
export function masVendidosDeLaSemana(config: RubroConfig, maximo = 5): { producto: Producto; unidades: number }[] {
  const unidades = new Map<string, number>();
  for (const v of config.panel.ventas) {
    const dias = diasEntre(diaDe(v.fecha), config.panel.hoy);
    if (dias < 0 || dias > 6) continue;
    for (const l of v.lineas) unidades.set(l.productoId, (unidades.get(l.productoId) ?? 0) + l.cantidad * l.factor);
  }
  return [...unidades]
    .map(([id, total]) => ({ producto: config.productos.find((p) => p.id === id), unidades: total }))
    .filter((x): x is { producto: Producto; unidades: number } => x.producto !== undefined)
    .sort((a, b) => b.unidades - a.unidades || a.producto.nombre.localeCompare(b.producto.nombre, 'es'))
    .slice(0, maximo);
}

/** Productos que vencen de hoy a `dias` días, el más próximo primero. */
export function porVencer(config: RubroConfig, dias = 7): { producto: Producto; vence: string; faltan: number }[] {
  return config.productos
    .filter((p): p is Producto & { vence: string } => p.vence !== undefined)
    .map((p) => ({ producto: p, vence: p.vence, faltan: diasEntre(config.panel.hoy, p.vence) }))
    .filter((x) => x.faltan >= 0 && x.faltan <= dias)
    .sort((a, b) => a.faltan - b.faltan);
}

/** Stock en el umbral o por debajo (incluye agotados), el más bajo primero. */
export function stockBajo(config: RubroConfig): Producto[] {
  return config.productos.filter((p) => p.stock <= config.panel.stockBajo).sort((a, b) => a.stock - b.stock);
}
