import { armarHistoria } from '../historia';

// Restaurante sin demo completa: solo lo que piden las 4 pantallas del celular. Negocio y personas inventados.
export const HISTORIA_RESTAURANTE = armarHistoria({
  negocio: 'La Cuchara Feliz',
  tema: {
    marca: '#f06b3f',
    sobreMarca: '#121212',
    marcaTexto: '#a8361a',
    texto: '#1d1a17',
    textoSuave: '#5e5650',
    fondo: '#fffaf5',
    fondoSuave: '#f6ede4',
    etiquetaAmarilla: '#ffcf5c',
    etiquetaTurquesa: '#7cc9a5',
    fuenteTitulos: 'inherit',
    fuenteTexto: 'inherit',
  },
  leyendas: [
    { titulo: 'Tu carta, siempre a mano', texto: 'Tus clientes ven tus platos, precios y el menú del día.' },
    { titulo: 'Piden para llevar', texto: 'Eligen sus platos y la hora de recojo, sin llamar.' },
    { titulo: 'Te llega por WhatsApp', texto: 'El pedido completo, con el total y la hora de recojo.' },
    { titulo: 'Tú ves tu negocio', texto: 'Ventas del día, cobros por Yape y Plin, y las reservas de hoy.' },
  ],
  vitrina: {
    anuncio: 'Menú del día desde S/ 15',
    buscador: 'Busca un plato…',
    titular: 'Almuerzo listo en 20 minutos',
    bajada: 'Pide para llevar o reserva tu mesa.',
    categorias: [
      { nombre: 'Platos', ilustracion: 'plato' },
      { nombre: 'Bebidas', ilustracion: 'bebida' },
      { nombre: 'Postres', ilustracion: 'postre' },
    ],
    destacados: 'Lo más pedido',
  },
  pedido: {
    titulo: 'Carta',
    accion: 'Agregar',
    items: [
      { id: 'lomo-saltado', nombre: 'Lomo saltado', detalle: 'Plato de fondo', precio: 2800, ilustracion: 'plato' },
      { id: 'aji-de-gallina', nombre: 'Ají de gallina', detalle: 'Plato de fondo', precio: 2200, ilustracion: 'plato' },
      { id: 'chicha', nombre: 'Chicha morada', detalle: 'Jarra de 1 litro', precio: 1000, ilustracion: 'bebida' },
      { id: 'mazamorra', nombre: 'Mazamorra morada', detalle: 'Porción', precio: 600, ilustracion: 'postre' },
    ],
    elegidos: ['lomo-saltado', 'aji-de-gallina', 'chicha'],
    resumen: 'Mi pedido (3)',
  },
  whatsapp: {
    lineas: [
      'Hola, La Cuchara Feliz. Quiero pedir para llevar:',
      '1 Lomo saltado',
      '1 Ají de gallina',
      '1 Chicha morada (1 litro)',
      'A nombre de: Luis',
      'Recojo: 1:30 p. m.',
    ],
    respuesta: '¡Recibido! Te esperamos a la 1:30.',
  },
  panel: {
    principal: {
      etiqueta: 'Ventas de hoy',
      valor: 'S/ 1,240',
      barras: [
        { nombre: 'Salón', valor: 820 },
        { nombre: 'Llevar', valor: 420 },
      ],
    },
    secundario: {
      etiqueta: 'Cobros de hoy',
      barras: [
        { nombre: 'Efectivo', valor: 520 },
        { nombre: 'Yape', valor: 610 },
        { nombre: 'Plin', valor: 110 },
      ],
    },
    aviso: { etiqueta: 'Reservas de hoy', texto: '6 mesas desde la 1:00 p. m.' },
  },
});
