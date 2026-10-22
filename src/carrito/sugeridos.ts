import type { ModuloId } from '../catalogo-servicios/modulos';
import { agregarModulo, CARRITO_VACIO, type Carrito } from './carrito';

// Carritos sugeridos por rubro: lo que suele necesitar ese tipo de negocio para empezar.
export const CARRITOS_SUGERIDOS = {
  dulceria: {
    nombre: 'Dulcería',
    modulos: ['catalogo-web', 'pedidos-whatsapp', 'panel-dueno'],
  },
} as const satisfies Record<string, { nombre: string; modulos: readonly ModuloId[] }>;

export type RubroSugerido = keyof typeof CARRITOS_SUGERIDOS;

/** Carrito del rubro, armado con las mismas reglas que si el dueño agregara cada módulo. */
export function cargarSugerido(rubro: RubroSugerido): Carrito {
  return CARRITOS_SUGERIDOS[rubro].modulos.reduce<Carrito>(
    (carrito, id) => agregarModulo(carrito, id).carrito,
    CARRITO_VACIO,
  );
}

/** Mismos módulos, sin importar el orden. */
export function mismoContenido(a: Carrito, b: Carrito): boolean {
  return a.items.length === b.items.length && a.items.every((id) => b.items.includes(id));
}
