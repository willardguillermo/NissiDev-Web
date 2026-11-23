import { formatearSoles } from '../ui/formato';

// Paquete Vitrina (2026-11-22): aparte del carrito de módulos, con PRECIO CERRADO (no «desde»).
// No cuenta para los cupos de lanzamiento. Montos en céntimos.

export const VITRINA = {
  nombre: 'Vitrina',
  descripcion: 'Para que tu negocio aparezca en Google y te escriban por WhatsApp, sin un sistema completo.',
  precioCentimos: 35000,
  plazo: '5 a 7 días',
  incluye: [
    'Página de una sección con tus fotos, horario y ubicación',
    'Botón de WhatsApp',
    'Perfil de Google Maps creado u optimizado con tu propia cuenta',
  ],
  mantenimiento: {
    nombre: 'Mantenimiento de la Vitrina',
    centimos: 6000,
  },
  dominio: 'El dominio va aparte y lo paga el cliente.',
} as const;

export interface SeleccionVitrina {
  elegida: boolean;
  /** Solo tiene sentido con la Vitrina elegida. */
  mantenimiento: boolean;
}

export const SIN_VITRINA: SeleccionVitrina = { elegida: false, mantenimiento: false };

/** Sin Vitrina no hay su mantenimiento. */
export const normalizarVitrina = ({ elegida, mantenimiento }: SeleccionVitrina): SeleccionVitrina => ({
  elegida,
  mantenimiento: elegida && mantenimiento,
});

export function totalesVitrina(seleccion: SeleccionVitrina): { inicial: number; mensual: number } {
  const { elegida, mantenimiento } = normalizarVitrina(seleccion);
  return {
    inicial: elegida ? VITRINA.precioCentimos : 0,
    mensual: mantenimiento ? VITRINA.mantenimiento.centimos : 0,
  };
}

export const textoPrecioVitrina = () => `${formatearSoles(VITRINA.precioCentimos)} · precio cerrado`;
export const textoMantenimientoVitrina = () => `${formatearSoles(VITRINA.mantenimiento.centimos)}/mes`;

/** Lo guardado puede estar roto o editado a mano: solo se aceptan booleanos; lo demás es «sin Vitrina». */
export function restaurarVitrina(valorGuardado: string | null | undefined): SeleccionVitrina {
  if (!valorGuardado) return SIN_VITRINA;
  try {
    const datos: unknown = JSON.parse(valorGuardado);
    if (typeof datos !== 'object' || datos === null) return SIN_VITRINA;
    const { elegida, mantenimiento } = datos as Record<string, unknown>;
    return normalizarVitrina({ elegida: elegida === true, mantenimiento: mantenimiento === true });
  } catch {
    return SIN_VITRINA;
  }
}
