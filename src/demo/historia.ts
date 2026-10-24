import { formatearSoles } from '../ui/formato';
import { mensajePedido } from './mensaje-pedido';
import { cobrosPorMedio, porVencer, proporciones, textoVence, ventasDelDiaPorPuesto } from './panel';
import { agregarLinea, PEDIDO_VACIO, presentacionesEnPedido, totalPedido } from './pedido';
import { precioPorMayor, precioUnidad } from './precios';
import type { Pedido, Producto, RubroConfig } from './tipos';

// La historia de la demo en el Inicio: cuatro mini pantallas de un celular (Catálogo → Pedido →
// WhatsApp → Panel). Todo sale de la configuración del rubro con las mismas funciones que la demo
// completa; la vista solo dibuja lo que devuelve historiaDeLaDemo.

/** Los pasos que se recorren al bajar. Son textos de NissiDev (no datos del negocio). */
export const PASOS_HISTORIA = [
  { corto: 'Catálogo', titulo: 'Tu catálogo, siempre a mano', texto: 'Tus clientes ven tus productos, precios y ofertas desde su celular.' },
  { corto: 'Pedido', titulo: 'Arman su pedido', texto: 'Eligen unidad, bolsa o caja; el precio por mayor se aplica solo.' },
  { corto: 'WhatsApp', titulo: 'Te llega por WhatsApp', texto: 'El pedido completo, con el total y dónde lo recogen.' },
  { corto: 'Panel', titulo: 'Tú ves tu negocio', texto: 'Ventas del día, cobros por Yape y Plin, y lo que está por vencer.' },
] as const;

/** Nombre del cliente del mensaje de ejemplo y respuesta del negocio en el chat. */
const CLIENTE_DE_EJEMPLO = 'Ana';
export const RESPUESTA_DEL_NEGOCIO = '¡Listo! Lo separamos para la tarde.';

const PRODUCTOS_EN_PANTALLA = 4;
const PRODUCTOS_EN_PEDIDO = 3;

export interface ProductoMini {
  id: string;
  nombre: string;
  presentacion: string;
  precio: string;
  ilustracion: string;
}

export interface BarraMini {
  nombre: string;
  total: string;
  /** 0 a 1, respecto a la barra más larga. */
  proporcion: number;
}

export interface HistoriaDemo {
  negocio: string;
  catalogo: {
    anuncio: string;
    buscador: string;
    titular: string;
    bajada: string;
    categorias: { nombre: string; ilustracion: string }[];
  };
  pedido: { productos: ProductoMini[]; cantidad: number; total: string };
  whatsapp: { mensaje: string[]; respuesta: string };
  panel: {
    ventasHoy: string;
    puestos: BarraMini[];
    cobros: BarraMini[];
    porVencer: { nombre: string; cuando: string } | null;
  };
}

/** Lo que se ve en la tarjeta: la presentación grande (por mayor) si la hay; si no, la unidad. */
function presentacionVisible(producto: Producto) {
  return (precioPorMayor(producto) ?? precioUnidad(producto)).presentacion;
}

function barras(items: { nombre: string; total: number }[]): BarraMini[] {
  const largos = proporciones(items.map((i) => i.total));
  return items.map((item, i) => ({ nombre: item.nombre, total: formatearSoles(item.total), proporcion: largos[i] }));
}

export function historiaDeLaDemo(config: RubroConfig): HistoriaDemo {
  const producto = (id: string) => {
    const encontrado = config.productos.find((p) => p.id === id);
    if (!encontrado) throw new Error(`"${id}" está en masVendidos pero no en los productos`);
    return encontrado;
  };
  const ilustracionDe = (p: Producto) => config.categorias.find((c) => c.id === p.categoria)?.ilustracion ?? '';

  const destacados = config.masVendidos.slice(0, PRODUCTOS_EN_PANTALLA).map(producto);
  // El pedido de ejemplo: una presentación grande de cada uno de los primeros, como lo armaría un cliente.
  const pedido = destacados
    .slice(0, PRODUCTOS_EN_PEDIDO)
    .reduce<Pedido>((p, prod) => agregarLinea(p, prod, presentacionVisible(prod).id, 1), PEDIDO_VACIO);

  const campana = config.campanas.find((c) => c.id === config.campanaActiva);
  const hoyPorPuesto = ventasDelDiaPorPuesto(config);
  const vence = porVencer(config)[0];

  return {
    negocio: config.negocio,
    catalogo: {
      anuncio: config.textos.anuncio,
      buscador: config.textos.buscador,
      titular: campana?.titular ?? config.textos.heroGeneral.titular,
      bajada: campana?.bajada ?? config.textos.heroGeneral.bajada,
      categorias: config.categorias.slice(0, 3).map(({ nombre, ilustracion }) => ({ nombre, ilustracion })),
    },
    pedido: {
      productos: destacados.map((p) => {
        const presentacion = presentacionVisible(p);
        return {
          id: p.id,
          nombre: p.nombre,
          presentacion: presentacion.nombre,
          precio: formatearSoles(presentacion.precio),
          ilustracion: ilustracionDe(p),
        };
      }),
      cantidad: presentacionesEnPedido(pedido),
      total: formatearSoles(totalPedido(pedido)),
    },
    whatsapp: {
      mensaje: mensajePedido(config, pedido, { cliente: CLIENTE_DE_EJEMPLO, puesto: config.puestos[0].numero })
        .split('\n')
        .filter((linea) => linea !== ''),
      respuesta: RESPUESTA_DEL_NEGOCIO,
    },
    panel: {
      ventasHoy: formatearSoles(hoyPorPuesto.reduce((suma, p) => suma + p.total, 0)),
      puestos: barras(hoyPorPuesto),
      cobros: barras(cobrosPorMedio(config)),
      porVencer: vence ? { nombre: vence.producto.nombre, cuando: textoVence(vence.faltan) } : null,
    },
  };
}
