// Rubros que muestra la web, en el mismo orden en el celular del Inicio, sus tarjetas y Soluciones (ADR-004:
// ninguno es protagonista). Una demo activa enlaza a su página; los demás se piden por WhatsApp.
// Para activar un rubro: crear su config y su página, y cambiar aquí el estado.
import { whatsappConMensaje } from '../config/contacto';
import { DULCERIA } from './dulceria/config';

interface RubroBase {
  id: string;
  nombre: string;
  /** Una línea para la tarjeta del Inicio (borrador para revisar). */
  resumen: string;
  /** Qué traería su sistema, en palabras del dueño (borrador para revisar). */
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
    resumen: 'Catálogo con precios por mayor y vencimientos.',
    descripcion: 'Catálogo con precios por mayor, pedidos por WhatsApp y el panel del dueño con ventas y vencimientos.',
    estado: 'activa',
    ruta: `/soluciones/${DULCERIA.id}/`,
  },
  {
    id: 'restaurante',
    nombre: 'Restaurante',
    resumen: 'Carta, pedidos para llevar y reservas.',
    descripcion: 'Tu carta con precios, pedidos para llevar por WhatsApp, reservas de mesa y las ventas del día.',
    estado: 'proximamente',
  },
  {
    id: 'belleza',
    nombre: 'Salón de belleza',
    resumen: 'Citas por servicio y la agenda del día.',
    descripcion: 'Para barberías y estéticas: tus servicios con precios, citas sin llamadas y la agenda del día.',
    estado: 'proximamente',
  },
  {
    id: 'clinica',
    nombre: 'Clínica',
    resumen: 'Citas y horarios sin llamadas.',
    descripcion: 'Tus pacientes eligen especialidad y horario, la cita te llega por WhatsApp y ves los horarios del día.',
    estado: 'proximamente',
  },
  {
    id: 'mayorista',
    nombre: 'Negocio por mayor',
    resumen: 'Precios por volumen y stock al día.',
    descripcion: 'Precios por unidad, paquete o saco, pedidos de tus clientes por WhatsApp y el stock que se acaba.',
    estado: 'proximamente',
  },
];

/** WhatsApp para pedir la demo de un rubro que aún no la tiene; el mensaje nombra el rubro. */
export function enlacePedirDemo(rubro: Pick<RubroDemo, 'nombre'>): string {
  return whatsappConMensaje(`Hola, me interesa un sistema para mi rubro: ${rubro.nombre}. ¿Me muestras cómo sería la demo?`);
}
