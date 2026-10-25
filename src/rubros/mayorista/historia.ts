import { armarHistoria } from '../historia';

// Negocio por mayor sin demo completa: solo lo que piden las 4 pantallas. Negocio y personas inventados.
export const HISTORIA_MAYORISTA = armarHistoria({
  negocio: 'Distribuidora El Granero',
  tema: {
    marca: '#f2b632',
    sobreMarca: '#121212',
    marcaTexto: '#8a5a00',
    texto: '#1c1a14',
    textoSuave: '#5c574b',
    fondo: '#fffdf7',
    fondoSuave: '#f4efe2',
    etiquetaAmarilla: '#ffd76a',
    etiquetaTurquesa: '#8fd0c4',
    fuenteTitulos: 'inherit',
    fuenteTexto: 'inherit',
  },
  leyendas: [
    { titulo: 'Tu lista de precios, siempre a mano', texto: 'Tus clientes ven productos y precios por unidad, paquete o saco.' },
    { titulo: 'Arman su pedido', texto: 'Eligen la presentación y ven el total al instante.' },
    { titulo: 'Te llega por WhatsApp', texto: 'El pedido completo, con el total, listo para despachar.' },
    { titulo: 'Tú ves tu negocio', texto: 'Ventas del día, cobros y lo que se está acabando.' },
  ],
  vitrina: {
    anuncio: 'Precio especial desde 5 sacos',
    buscador: 'Busca un producto…',
    titular: 'Abarrotes por mayor',
    bajada: 'Por unidad, paquete o saco.',
    categorias: [
      { nombre: 'Granos', ilustracion: 'saco' },
      { nombre: 'Aceites', ilustracion: 'aceite' },
      { nombre: 'Paquetes', ilustracion: 'caja' },
    ],
    destacados: 'Lo más pedido',
  },
  pedido: {
    titulo: 'Catálogo',
    accion: 'Agregar',
    items: [
      { id: 'arroz', nombre: 'Arroz extra', detalle: 'Saco 50 kg', precio: 19500, ilustracion: 'saco' },
      { id: 'aceite', nombre: 'Aceite vegetal', detalle: 'Caja x12', precio: 9600, ilustracion: 'aceite' },
      { id: 'fideos', nombre: 'Fideos', detalle: 'Paquete x20', precio: 4200, ilustracion: 'caja' },
      { id: 'azucar', nombre: 'Azúcar rubia', detalle: 'Saco 50 kg', precio: 17000, ilustracion: 'saco' },
    ],
    elegidos: ['arroz', 'aceite', 'fideos'],
    resumen: 'Mi pedido (3)',
  },
  whatsapp: {
    lineas: [
      'Hola, Distribuidora El Granero. Quiero hacer este pedido:',
      '1 Saco 50 kg · Arroz extra',
      '1 Caja x12 · Aceite vegetal',
      '1 Paquete x20 · Fideos',
      'A nombre de: Carla',
    ],
    respuesta: '¡Listo! Sale en el reparto de mañana.',
  },
  panel: {
    principal: {
      etiqueta: 'Ventas de hoy',
      valor: 'S/ 4,860',
      barras: [
        { nombre: 'Tienda', valor: 1900 },
        { nombre: 'WhatsApp', valor: 2960 },
      ],
    },
    secundario: {
      etiqueta: 'Cobros de hoy',
      barras: [
        { nombre: 'Efectivo', valor: 1500 },
        { nombre: 'Yape', valor: 2100 },
        { nombre: 'Plin', valor: 1260 },
      ],
    },
    aviso: { etiqueta: 'Stock bajo', texto: 'Arroz extra · quedan 4 sacos' },
  },
});
