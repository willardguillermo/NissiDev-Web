import type { ModuloId } from '../catalogo-servicios/modulos';
import { agregarModulo, CARRITO_VACIO, type Carrito } from './carrito';

// Carritos sugeridos por rubro: lo que suele necesitar ese tipo de negocio para empezar.
export const CARRITOS_SUGERIDOS = {
  dulceria: {
    nombre: 'Dulcería',
    modulos: ['catalogo-web', 'pedidos-whatsapp', 'panel-dueno'],
  },
  // Decisión de Guillermo (2026-11-22): con Mantenimiento, él sube los cambios de inmuebles.
  inmobiliaria: {
    nombre: 'Inmobiliaria',
    modulos: ['catalogo-web', 'mantenimiento'],
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

const esRubroSugerido = (valor: string | null): valor is RubroSugerido =>
  valor !== null && Object.hasOwn(CARRITOS_SUGERIDOS, valor);

/** El rubro de ?sugerido=… (enlace que se manda por WhatsApp), o null si no hay o no existe. */
export function sugeridoDeUrl(busqueda: string): RubroSugerido | null {
  const valor = new URLSearchParams(busqueda).get('sugerido');
  return esRubroSugerido(valor) ? valor : null;
}

/** Enlace directo a /cotizar con el sistema del rubro ya cargado. */
export const enlaceSugerido = (rubro: RubroSugerido) => `/cotizar/?sugerido=${rubro}`;

/** La misma URL sin ?sugerido, para que recargar la página no lo vuelva a cargar. */
export function sinSugerido(url: string): string {
  const nueva = new URL(url);
  nueva.searchParams.delete('sugerido');
  return `${nueva.pathname}${nueva.search}${nueva.hash}`;
}
