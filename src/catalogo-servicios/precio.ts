import { formatearSoles } from '../ui/formato';
import { LANZAMIENTO, lanzamientoActivo, type Lanzamiento } from './lanzamiento';
import { obtenerModulo, type ModuloId, type ModuloServicio, type PrecioInicial } from './modulos';

export interface PrecioAplicado {
  precioInicial: PrecioInicial;
  mensualidad?: number;
  /** Precio normal (para tacharlo) cuando rige el de lanzamiento. */
  precioNormal?: number;
}

export interface ContextoPrecio {
  /** Módulos elegidos. Sin ellos (lista general), se muestran las dos mensualidades posibles. */
  items?: readonly ModuloId[];
  lanzamiento?: Lanzamiento;
}

/** El precio que se cobra de verdad: lanzamiento si quedan cupos y la mensualidad según la selección. */
export function precioAplicado(
  modulo: ModuloServicio,
  { items = [], lanzamiento = LANZAMIENTO }: ContextoPrecio = {},
): PrecioAplicado {
  const { precioInicial, mensualidad, mensualidadCon } = modulo;
  const conMensualidad = mensualidadCon && items.includes(mensualidadCon.modulo) ? mensualidadCon.centimos : mensualidad;
  if (modulo.id === lanzamiento.modulo && precioInicial.tipo === 'desde' && lanzamientoActivo(lanzamiento)) {
    return {
      precioInicial: { tipo: 'desde', centimos: lanzamiento.precioCentimos },
      mensualidad: conMensualidad,
      precioNormal: precioInicial.centimos,
    };
  }
  return { precioInicial, mensualidad: conMensualidad };
}

const porMes = (centimos: number) => `${formatearSoles(centimos)}/mes`;

export function textoPrecio(modulo: ModuloServicio, contexto: ContextoPrecio = {}): string {
  const { precioInicial, mensualidad, precioNormal } = precioAplicado(modulo, contexto);
  const { mensualidadCon } = modulo;
  let mensual = mensualidad === undefined ? undefined : porMes(mensualidad);
  if (mensual && mensualidadCon && contexto.items === undefined) {
    mensual += ` (${porMes(mensualidadCon.centimos)} con ${obtenerModulo(mensualidadCon.modulo).nombre})`;
  }

  switch (precioInicial.tipo) {
    case 'incluido':
      return `Incluido en ${obtenerModulo(precioInicial.en).nombre}`;
    case 'cotizar':
      return mensual ? `${mensual} + instalación (Cotizar)` : 'Cotizar';
    case 'ninguno':
      return mensual ?? 'Cotizar';
    case 'desde': {
      const lanzamiento = precioNormal === undefined ? '' : ` · precio de lanzamiento (normal ${formatearSoles(precioNormal)})`;
      const inicial = `Desde ${formatearSoles(precioInicial.centimos)}${lanzamiento}`;
      return mensual ? `${inicial} + ${mensual}` : inicial;
    }
  }
}
