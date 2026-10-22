import { formatearSoles } from '../ui/formato';
import { obtenerModulo, type ModuloServicio } from './modulos';

export function textoPrecio(modulo: ModuloServicio): string {
  const { precioInicial, mensualidad } = modulo;
  const mensual = mensualidad === undefined ? undefined : `${formatearSoles(mensualidad)}/mes`;

  switch (precioInicial.tipo) {
    case 'incluido':
      return `Incluido en ${obtenerModulo(precioInicial.en).nombre}`;
    case 'cotizar':
      return mensual ? `${mensual} + instalación (Cotizar)` : 'Cotizar';
    case 'ninguno':
      return mensual ?? 'Cotizar';
    case 'desde': {
      const inicial = `Desde ${formatearSoles(precioInicial.centimos)}`;
      return mensual ? `${inicial} + ${mensual}` : inicial;
    }
  }
}
