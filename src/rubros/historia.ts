import { proporciones } from '../demo/panel';
import type { TemaDemo } from '../demo/tipos';
import { formatearSoles } from '../ui/formato';

// La historia del celular del Inicio, igual para todos los rubros (ADR-004): 4 pasos generales y las 4 mini
// pantallas de cada rubro. La dulcería las saca de su demo completa; los demás rubros solo definen lo que
// piden estas pantallas (src/rubros/<id>/historia.ts) y armarHistoria calcula totales y barras.

/** Los pasos son de NissiDev, no de un rubro. `corto` es para el celular, donde no cabe el nombre entero. */
export const PASOS_HISTORIA = [
  { corto: 'Vitrina', nombre: 'Tu vitrina' },
  { corto: 'Pide', nombre: 'Tu cliente pide o reserva' },
  { corto: 'WhatsApp', nombre: 'Te llega por WhatsApp' },
  { corto: 'Panel', nombre: 'Tu panel' },
] as const;

/** Lo que cuenta la leyenda en cada paso, con las palabras del rubro (clínica: «Reservan su cita»). */
export interface Leyenda {
  titulo: string;
  texto: string;
}

export interface ItemMini {
  id: string;
  nombre: string;
  /** Presentación, duración o especialidad. */
  detalle: string;
  precio: string;
  ilustracion: string;
}

export interface BarraMini {
  nombre: string;
  /** 0 a 1, respecto a la barra más larga. */
  proporcion: number;
}

export interface PantallasRubro {
  negocio: string;
  tema: TemaDemo;
  leyendas: readonly [Leyenda, Leyenda, Leyenda, Leyenda];
  vitrina: {
    anuncio: string;
    buscador: string;
    titular: string;
    bajada: string;
    categorias: { nombre: string; ilustracion: string }[];
    /** Título de la lista corta de la vitrina («Lo más pedido»); muestra los 2 primeros items del pedido. */
    destacados: string;
  };
  pedido: { titulo: string; accion: string; items: ItemMini[]; resumen: string; total: string };
  whatsapp: { mensaje: string[]; respuesta: string };
  panel: {
    principal: { etiqueta: string; valor: string; barras: BarraMini[] };
    secundario: { etiqueta: string; barras: BarraMini[] };
    aviso: { etiqueta: string; texto: string } | null;
  };
}

/** Datos de un rubro sin demo completa. Montos en céntimos; las barras, en cualquier unidad. */
export interface DatosHistoria {
  negocio: string;
  tema: TemaDemo;
  leyendas: PantallasRubro['leyendas'];
  vitrina: PantallasRubro['vitrina'];
  pedido: {
    titulo: string;
    accion: string;
    items: (Omit<ItemMini, 'precio'> & { precio: number })[];
    /** Ids de los items que el cliente de ejemplo elige: el total sale de sus precios. */
    elegidos: string[];
    resumen: string;
  };
  /** Líneas del mensaje sin el total: armarHistoria agrega «Total: S/ …». */
  whatsapp: { lineas: string[]; respuesta: string };
  panel: {
    principal: { etiqueta: string; valor: string; barras: { nombre: string; valor: number }[] };
    secundario: { etiqueta: string; barras: { nombre: string; valor: number }[] };
    aviso: { etiqueta: string; texto: string } | null;
  };
}

export function barrasMini(items: { nombre: string; valor: number }[]): BarraMini[] {
  const largos = proporciones(items.map((i) => i.valor));
  return items.map((item, i) => ({ nombre: item.nombre, proporcion: largos[i] }));
}

export function armarHistoria(datos: DatosHistoria): PantallasRubro {
  const { pedido, whatsapp, panel } = datos;
  const total = pedido.elegidos.reduce((suma, id) => {
    const item = pedido.items.find((i) => i.id === id);
    if (!item) throw new Error(`"${id}" está en elegidos pero no en los items`);
    return suma + item.precio;
  }, 0);

  return {
    negocio: datos.negocio,
    tema: datos.tema,
    leyendas: datos.leyendas,
    vitrina: datos.vitrina,
    pedido: {
      titulo: pedido.titulo,
      accion: pedido.accion,
      items: pedido.items.map((i) => ({ ...i, precio: formatearSoles(i.precio) })),
      resumen: pedido.resumen,
      total: formatearSoles(total),
    },
    whatsapp: { mensaje: [...whatsapp.lineas, `Total: ${formatearSoles(total)}`], respuesta: whatsapp.respuesta },
    panel: {
      principal: { ...panel.principal, barras: barrasMini(panel.principal.barras) },
      secundario: { ...panel.secundario, barras: barrasMini(panel.secundario.barras) },
      aviso: panel.aviso,
    },
  };
}
