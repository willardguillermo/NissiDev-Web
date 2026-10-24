// Rubros que muestra la página Demos. Una demo activa enlaza a su página; las próximas solo se anuncian
// (llegan en la etapa 2, ver BRIEF). Para activar un rubro: crear su config y su página, y cambiar aquí el estado.
import { DULCERIA } from './dulceria/config';

interface RubroBase {
  id: string;
  nombre: string;
  /** Qué trae la demo, en palabras del dueño (borrador para revisar). */
  descripcion: string;
}

export type RubroDemo =
  | (RubroBase & { estado: 'activa'; ruta: string; negocio: string })
  | (RubroBase & { estado: 'proximamente' });

export const RUBROS: readonly RubroDemo[] = [
  {
    id: DULCERIA.id,
    nombre: DULCERIA.rubro,
    negocio: DULCERIA.negocio,
    descripcion: 'Catálogo con precios por mayor, pedidos por WhatsApp y el panel del dueño con ventas y vencimientos.',
    estado: 'activa',
    ruta: `/demos/${DULCERIA.id}/`,
  },
  {
    id: 'hospedaje',
    nombre: 'Hospedaje',
    descripcion: 'Habitaciones, disponibilidad del día y reservas por WhatsApp.',
    estado: 'proximamente',
  },
  {
    id: 'restaurante-campestre',
    nombre: 'Restaurante campestre',
    descripcion: 'Carta, reservas para el fin de semana y eventos.',
    estado: 'proximamente',
  },
];
