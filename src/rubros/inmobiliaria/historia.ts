import { mensajeInteres } from '../../demo/inmuebles/mensaje';
import { consultasDeLaSemana, consultasPorInmueble, masVistos } from '../../demo/inmuebles/panel';
import { textoPrecio } from '../../demo/inmuebles/precio';
import type { Inmueble } from '../../demo/inmuebles/tipos';
import { barrasMini, type PantallasRubro } from '../historia';
import { INMOBILIARIA } from './config';

// La inmobiliaria tiene demo completa: sus pantallas salen de su config con las mismas funciones de la demo.
// No hay «total»: el cliente pregunta por UN inmueble y el mensaje es el de la ficha, con su código.
const { inmuebles, tipoCambio, panel } = INMOBILIARIA;
const porCodigo = (codigo: string) => inmuebles.find((i) => i.codigo === codigo)!;
const precio = (i: Inmueble) => {
  const t = textoPrecio(i, tipoCambio);
  return `${t.principal}${t.sufijo}`;
};
const DIBUJO: Record<Inmueble['tipo'], string> = {
  departamento: 'edificio',
  casa: 'casa',
  terreno: 'terreno',
  local: 'edificio',
  oficina: 'edificio',
};

/** Los 4 de la pantalla «Pide»; el segundo es el que el cliente toca (el de la consulta). */
const MOSTRADOS = ['DEP-101', 'DEP-104', 'DEP-103', 'CAS-201'].map(porCodigo);
const ELEGIDO = MOSTRADOS[1];
const ultima = [...panel.consultas].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
const hora = (fecha: string) => {
  const [h, m] = fecha.slice(11, 16).split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
};

export const HISTORIA_INMOBILIARIA: PantallasRubro = {
  negocio: INMOBILIARIA.negocio,
  tema: INMOBILIARIA.tema,
  leyendas: [
    { titulo: 'Tus inmuebles, siempre a mano', texto: 'Tus clientes ven precios, distritos y metrajes desde su celular.' },
    { titulo: 'Encuentran el suyo', texto: 'Filtran por venta o alquiler, precio, distrito y dormitorios.' },
    { titulo: 'Te llega por WhatsApp', texto: 'Con el código del inmueble: sabes de cuál te hablan.' },
    { titulo: 'Tú ves qué se mueve', texto: 'Consultas por inmueble y los más vistos de la semana.' },
  ],
  vitrina: {
    anuncio: INMOBILIARIA.textos.anuncio,
    buscador: 'Distrito, precio, dormitorios…',
    titular: 'Tu próximo hogar',
    bajada: 'Venta y alquiler con precio claro.',
    categorias: [
      { nombre: 'Depas', ilustracion: 'edificio' },
      { nombre: 'Casas', ilustracion: 'casa' },
      { nombre: 'Terrenos', ilustracion: 'terreno' },
    ],
    destacados: 'Lo más visto',
  },
  pedido: {
    titulo: 'Inmuebles',
    accion: 'Ver',
    items: MOSTRADOS.map((i) => ({
      id: i.codigo,
      nombre: i.codigo,
      detalle: i.distrito,
      precio: precio(i),
      ilustracion: DIBUJO[i.tipo],
    })),
    resumen: `Me interesa: ${ELEGIDO.codigo}`,
    total: precio(ELEGIDO),
  },
  whatsapp: {
    mensaje: [mensajeInteres(ELEGIDO.codigo)],
    respuesta: '¡Hola! Sí está disponible. ¿Te parece una visita el sábado a las 11?',
  },
  panel: {
    principal: {
      etiqueta: 'Consultas de la semana',
      valor: String(consultasDeLaSemana(INMOBILIARIA).length),
      barras: barrasMini(consultasPorInmueble(INMOBILIARIA, 3).map((x) => ({ nombre: x.inmueble.codigo, valor: x.valor }))),
    },
    secundario: {
      etiqueta: 'Los más vistos',
      barras: barrasMini(masVistos(INMOBILIARIA, 3).map((x) => ({ nombre: x.inmueble.codigo, valor: x.valor }))),
    },
    aviso: { etiqueta: 'Nueva consulta', texto: `${ultima.codigo} · ${hora(ultima.fecha)}` },
  },
};
