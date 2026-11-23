import { LANZAMIENTO, type Lanzamiento } from '../catalogo-servicios/lanzamiento';
import { normalizarVitrina, SIN_VITRINA, totalesVitrina, type SeleccionVitrina } from '../catalogo-servicios/vitrina';
import { formatearSoles } from '../ui/formato';
import { calcularTotales, type Carrito, type Totales } from './carrito';
import { textoTotales, type TextoTotales } from './textos';

// Totales de todo lo elegido: los módulos (precios «desde») más la Vitrina (precio cerrado), que va aparte.

export interface TotalesSistema extends Totales {
  vitrina: boolean;
  /** Solo la Vitrina, sin módulos: el total es un precio cerrado, sin «desde». */
  soloVitrina: boolean;
}

export function totalesSistema(
  carrito: Carrito,
  vitrina: SeleccionVitrina = SIN_VITRINA,
  lanzamiento: Lanzamiento = LANZAMIENTO,
): TotalesSistema {
  const modulos = calcularTotales(carrito, lanzamiento);
  const paquete = totalesVitrina(vitrina);
  const { elegida } = normalizarVitrina(vitrina);
  return {
    inicial: modulos.inicial + paquete.inicial,
    mensual: modulos.mensual + paquete.mensual,
    incluyeCotizar: modulos.incluyeCotizar,
    vitrina: elegida,
    soloVitrina: elegida && carrito.items.length === 0,
  };
}

export function textoTotalesSistema(totales: TotalesSistema): TextoTotales {
  if (!totales.soloVitrina) return textoTotales(totales);
  return {
    inicial: formatearSoles(totales.inicial),
    mensual: totales.mensual > 0 ? `${formatearSoles(totales.mensual)}/mes` : 'Sin mensualidad',
  };
}

/** Cuántas cosas eligió: módulos + la Vitrina (cuenta 1, con o sin su mantenimiento). Para «Cotizar (n)». */
export const cantidadElegida = (carrito: Carrito, vitrina: SeleccionVitrina) =>
  carrito.items.length + (normalizarVitrina(vitrina).elegida ? 1 : 0);
