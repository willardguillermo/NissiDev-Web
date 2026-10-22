// Módulos vendibles de NissiDev. Montos en céntimos; precios referenciales (proforma NSD-2026-001).

export type ModuloId =
  | 'catalogo-web'
  | 'pedidos-whatsapp'
  | 'panel-dueno'
  | 'reservas'
  | 'inventario'
  | 'caja'
  | 'boletas-sunat'
  | 'chatbot'
  | 'mantenimiento';

export type PrecioInicial =
  | { tipo: 'desde'; centimos: number }
  | { tipo: 'cotizar' }
  | { tipo: 'incluido'; en: ModuloId }
  | { tipo: 'ninguno' };

export interface ModuloServicio {
  id: ModuloId;
  nombre: string;
  descripcion: string;
  precioInicial: PrecioInicial;
  mensualidad?: number;
  dependencias: ModuloId[];
  /** Solo tiene sentido junto a otro módulo (Mantenimiento). */
  requiereOtroModulo?: boolean;
}

export const MODULOS: readonly ModuloServicio[] = [
  {
    id: 'catalogo-web',
    nombre: 'Catálogo web',
    descripcion: 'Tu página con todos tus productos y precios, lista para compartir por WhatsApp y redes.',
    precioInicial: { tipo: 'desde', centimos: 70000 },
    dependencias: [],
  },
  {
    id: 'pedidos-whatsapp',
    nombre: 'Pedidos por WhatsApp',
    descripcion: 'Tus clientes arman su pedido en el catálogo y te llega completo a tu WhatsApp.',
    precioInicial: { tipo: 'incluido', en: 'catalogo-web' },
    dependencias: ['catalogo-web'],
  },
  {
    id: 'panel-dueno',
    nombre: 'Panel del dueño',
    descripcion: 'Ves en un solo lugar cuánto vendiste hoy, lo que más sale y cómo va cada local o puesto.',
    precioInicial: { tipo: 'desde', centimos: 50000 },
    dependencias: ['catalogo-web'],
  },
  {
    id: 'reservas',
    nombre: 'Reservas',
    descripcion: 'Tus clientes separan día y hora (mesa, habitación o servicio) sin tener que llamarte.',
    precioInicial: { tipo: 'cotizar' },
    dependencias: [],
  },
  {
    id: 'inventario',
    nombre: 'Inventario con vencimientos',
    descripcion: 'Sabes cuánto te queda de cada producto y qué se vence pronto, para no perder mercadería.',
    precioInicial: { tipo: 'cotizar' },
    dependencias: ['panel-dueno'],
  },
  {
    id: 'caja',
    nombre: 'Caja con Yape/Plin',
    descripcion: 'Registras cada venta en efectivo, Yape o Plin, y al cerrar el día sabes cuánto entró por cada uno.',
    precioInicial: { tipo: 'cotizar' },
    mensualidad: 6000,
    dependencias: ['inventario'],
  },
  {
    id: 'boletas-sunat',
    nombre: 'Boletas SUNAT',
    descripcion: 'Emites boletas electrónicas válidas para SUNAT al momento de vender, desde la caja.',
    precioInicial: { tipo: 'cotizar' },
    dependencias: ['caja'],
  },
  {
    id: 'chatbot',
    nombre: 'Chatbot',
    descripcion: 'Responde por ti las preguntas de siempre de tus clientes, a cualquier hora.',
    precioInicial: { tipo: 'cotizar' },
    dependencias: [],
  },
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento',
    descripcion:
      'Nos encargamos de que tu sistema siga funcionando: copias de seguridad, ajustes pequeños y soporte cuando lo necesites.',
    precioInicial: { tipo: 'ninguno' },
    mensualidad: 8000,
    dependencias: [],
    requiereOtroModulo: true,
  },
];

const porId = new Map(MODULOS.map((m) => [m.id, m]));

export function obtenerModulo(id: ModuloId): ModuloServicio {
  const modulo = porId.get(id);
  if (!modulo) throw new Error(`Módulo desconocido: ${id}`);
  return modulo;
}

export function esModuloId(valor: unknown): valor is ModuloId {
  return typeof valor === 'string' && porId.has(valor as ModuloId);
}
