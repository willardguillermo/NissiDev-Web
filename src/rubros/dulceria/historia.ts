import { historiaDeLaDemo } from '../../demo/historia';
import type { PantallasRubro } from '../historia';
import { DULCERIA } from './config';

// La dulcería tiene demo completa: sus pantallas salen de su RubroConfig con las mismas funciones de la demo.
const demo = historiaDeLaDemo(DULCERIA);

export const HISTORIA_DULCERIA: PantallasRubro = {
  negocio: demo.negocio,
  tema: DULCERIA.tema,
  leyendas: [
    { titulo: 'Tu catálogo, siempre a mano', texto: 'Tus clientes ven tus productos, precios y ofertas desde su celular.' },
    { titulo: 'Arman su pedido', texto: 'Eligen unidad, bolsa o caja; el precio por mayor se aplica solo.' },
    { titulo: 'Te llega por WhatsApp', texto: 'El pedido completo, con el total y dónde lo recogen.' },
    { titulo: 'Tú ves tu negocio', texto: 'Ventas del día, cobros por Yape y Plin, y lo que está por vencer.' },
  ],
  vitrina: { ...demo.catalogo, destacados: 'Lo más vendido' },
  pedido: {
    titulo: 'Catálogo',
    accion: 'Agregar',
    items: demo.pedido.productos.map(({ id, nombre, presentacion, precio, ilustracion }) => ({
      id,
      nombre,
      detalle: presentacion,
      precio,
      ilustracion,
    })),
    resumen: `Mi pedido (${demo.pedido.cantidad})`,
    total: demo.pedido.total,
  },
  whatsapp: demo.whatsapp,
  panel: {
    principal: { etiqueta: 'Ventas de hoy', valor: demo.panel.ventasHoy, barras: demo.panel.puestos },
    secundario: { etiqueta: 'Cobros de hoy', barras: demo.panel.cobros },
    aviso: demo.panel.porVencer
      ? { etiqueta: 'Por vencer', texto: `${demo.panel.porVencer.nombre} · ${demo.panel.porVencer.cuando.toLowerCase()}` }
      : null,
  },
};
