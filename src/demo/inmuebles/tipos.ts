import type { TemaDemo } from '../tipos';

// Modelo de la demo inmobiliaria (ADR-005): misma plantilla de demos, otra configuración.
// Montos en céntimos enteros de su moneda: 12000000 en USD = US$ 120,000.

export type Operacion = 'venta' | 'alquiler';
export type Moneda = 'PEN' | 'USD';
export type TipoInmueble = 'departamento' | 'casa' | 'terreno' | 'local' | 'oficina';
/** Escenas dibujadas de la galería (ver islas/inmobiliaria/Escena.tsx). Nunca fotos. */
export type Escena = 'fachada' | 'edificio' | 'sala' | 'dormitorio' | 'cocina' | 'bano' | 'terreno' | 'local';
/** Separado: hay una reserva, sigue visible pero ya no se puede pedir. */
export type EstadoInmueble = 'disponible' | 'separado';

export interface Inmueble {
  /** Código que el cliente usa para preguntar: «DEP-104». Único. */
  codigo: string;
  titulo: string;
  tipo: TipoInmueble;
  operacion: Operacion;
  distrito: string;
  /** Referencia aproximada; la dirección exacta se da al coordinar la visita. */
  referencia: string;
  /** Área en m², entera. */
  area: number;
  /** 0 en terrenos, locales y oficinas sin dormitorios. */
  dormitorios: number;
  banos: number;
  estacionamientos: number;
  precio: { moneda: Moneda; centimos: number };
  /** Alquiler: mantenimiento mensual aparte, en soles. */
  mantenimiento?: number;
  descripcion: string;
  caracteristicas: string[];
  galeria: Escena[];
  estado: EstadoInmueble;
  /** Color de la ilustración (bloques de color, sin fotos). */
  color: string;
  /** Posición del círculo en el mapa aproximado, de 0 a 1. */
  mapa: { x: number; y: number };
  /** Publicado el (AAAA-MM-DD). */
  publicado: string;
}

/** El agente que publica. El registro es SIEMPRE de ejemplo en la demo. */
export interface Agente {
  nombre: string;
  cargo: string;
  /** Código del Registro de Agentes Inmobiliarios del MVCS. En la demo, inventado. */
  registroMvcs: string;
  presentacion: string;
  anios: number;
  zonas: string[];
  horario: string;
}

export interface Consulta {
  codigo: string;
  /** "2026-11-20T10:35" */
  fecha: string;
  canal: 'whatsapp' | 'llamada' | 'formulario';
}

export interface InmobiliariaConfig {
  id: string;
  rubro: string;
  negocio: string;
  /** Número ficticio; la demo nunca abre WhatsApp. */
  whatsappVisible: string;
  tema: TemaDemo;
  textos: { anuncio: string; titular: string; bajada: string };
  agente: Agente;
  distritos: string[];
  /** Soles por dólar, de ejemplo: solo para mostrar el equivalente aproximado. */
  tipoCambio: number;
  inmuebles: Inmueble[];
  panel: {
    /** "Hoy" fijo de la demo (AAAA-MM-DD): el panel no depende del reloj. */
    hoy: string;
    consultas: Consulta[];
    /** Visitas a la ficha en los últimos 7 días, por código. */
    vistas: Record<string, number>;
  };
}
