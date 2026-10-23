// Ventas ficticias de La Golosa para el panel del dueño. Salen de un generador con semilla fija:
// son siempre las mismas (no dependen del reloj ni de Math.random) y cubren los 7 días anteriores
// a HOY_DEMO. Se escriben para 3 puestos; con menos, personalizar() las reparte.
import { diasEntre } from '../../demo/panel';
import type { LineaVenta, MedioPago, Producto, Venta } from '../../demo/tipos';

/** El "hoy" de la demo: la semana de Halloween. */
export const HOY_DEMO = '2026-10-24';

const MEDIOS: MedioPago[] = ['efectivo', 'yape', 'plin'];

/** Números pseudoaleatorios repetibles (generador congruencial lineal). */
function crearAzar(semilla: number) {
  let estado = semilla;
  return (maximo: number) => {
    estado = (estado * 1_103_515_245 + 12_345) % 2 ** 31;
    return estado % maximo;
  };
}

const dos = (n: number) => String(n).padStart(2, '0');

function fechaMenos(hoy: string, dias: number): string {
  const fecha = new Date(`${hoy}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - dias);
  return fecha.toISOString().slice(0, 10);
}

function lineaAlAzar(producto: Producto, azar: (n: number) => number): LineaVenta {
  // 17 de cada 20 líneas son sueltas (1 a 6); el resto, 1 o 2 de la presentación más grande y,
  // de vez en cuando, la cantidad mínima para el precio por mayor
  const grande = producto.presentaciones.at(-1)!;
  const presentacion = azar(20) < 17 || grande.factor === 1 ? producto.presentaciones[0] : grande;
  const minimo = presentacion.precioMayorista?.cantidadMinima;
  const cantidad = presentacion.factor === 1 ? 1 + azar(6) : minimo && azar(4) === 0 ? minimo : 1 + azar(2);
  const mayor = presentacion.precioMayorista;
  const precio = mayor && cantidad >= mayor.cantidadMinima ? mayor.precio : presentacion.precio;
  return { productoId: producto.id, presentacionId: presentacion.id, factor: presentacion.factor, cantidad, precio };
}

/** La semilla 352 da días parejos entre puestos (con 1, 2 o 3). */
export function generarVentas(productos: Producto[], hoy: string, semilla = 352): Venta[] {
  const azar = crearAzar(semilla);
  const ventas: Venta[] = [];
  for (let atras = 7; atras >= 0; atras--) {
    const dia = fechaMenos(hoy, atras);
    for (const puesto of [1, 2, 3]) {
      const enPuesto = productos.filter((p) => p.puestos.includes(puesto) && p.etiqueta !== 'agotado');
      // Hoy el día va por la mitad: menos ventas, hasta las 3 p. m.
      const cantidad = atras === 0 ? 4 + azar(2) : 6 + azar(5);
      for (let i = 0; i < cantidad; i++) {
        const hora = 9 + Math.floor((i * (atras === 0 ? 6 : 10)) / cantidad);
        const lineas = Array.from({ length: 1 + azar(3) }, () => lineaAlAzar(enPuesto[azar(enPuesto.length)], azar));
        ventas.push({
          id: `${dia}-p${puesto}-${i + 1}`,
          fecha: `${dia}T${dos(hora)}:${dos(azar(60))}`,
          puesto,
          // Rotan los tres medios: cada puesto cobra con los tres cada día
          medio: MEDIOS[(i + puesto) % 3],
          lineas,
        });
      }
    }
  }
  return ventas.filter((v) => diasEntre(v.fecha.slice(0, 10), hoy) >= 0);
}
