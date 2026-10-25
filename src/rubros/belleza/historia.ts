import { armarHistoria } from '../historia';

// Salón de belleza (barbería o estética) sin demo completa: solo las 4 pantallas. Negocio y personas inventados.
export const HISTORIA_BELLEZA = armarHistoria({
  negocio: 'Estudio Mil Estilos',
  tema: {
    marca: '#c49bf2',
    sobreMarca: '#121212',
    marcaTexto: '#7a3fb8',
    texto: '#1b1720',
    textoSuave: '#5d5766',
    fondo: '#fcfaff',
    fondoSuave: '#f2edf8',
    etiquetaAmarilla: '#f7c8d8',
    etiquetaTurquesa: '#a9e3dc',
    fuenteTitulos: 'inherit',
    fuenteTexto: 'inherit',
  },
  leyendas: [
    { titulo: 'Tus servicios, siempre a mano', texto: 'Tus clientes ven servicios, precios y horarios desde su celular.' },
    { titulo: 'Reservan su cita', texto: 'Eligen el servicio, el día y la hora libre.' },
    { titulo: 'Te llega por WhatsApp', texto: 'La cita completa, con el servicio y la hora.' },
    { titulo: 'Tú ves tu agenda', texto: 'Citas del día, cobros por Yape y Plin, y quién sigue.' },
  ],
  vitrina: {
    anuncio: 'Atendemos de martes a domingo',
    buscador: 'Busca un servicio…',
    titular: 'Tu cita en dos toques',
    bajada: 'Elige servicio, día y hora.',
    categorias: [
      { nombre: 'Cortes', ilustracion: 'tijera' },
      { nombre: 'Barba', ilustracion: 'peine' },
      { nombre: 'Uñas', ilustracion: 'esmalte' },
    ],
  },
  pedido: {
    titulo: 'Servicios',
    accion: 'Reservar',
    items: [
      { id: 'corte', nombre: 'Corte clásico', detalle: '30 min', precio: 2500, ilustracion: 'tijera' },
      { id: 'corte-barba', nombre: 'Corte y barba', detalle: '45 min', precio: 3500, ilustracion: 'peine' },
      { id: 'manicure', nombre: 'Manicure', detalle: '40 min', precio: 3000, ilustracion: 'esmalte' },
      { id: 'pedicure', nombre: 'Pedicure', detalle: '50 min', precio: 3500, ilustracion: 'esmalte' },
    ],
    elegidos: ['corte-barba'],
    resumen: 'Mi cita: sáb 10:00 a. m.',
  },
  whatsapp: {
    lineas: [
      'Hola, Estudio Mil Estilos. Quiero reservar:',
      'Corte y barba (45 min)',
      'Día: sábado',
      'Hora: 10:00 a. m.',
      'A nombre de: Jorge',
    ],
    respuesta: '¡Listo, Jorge! Te esperamos el sábado.',
  },
  panel: {
    principal: {
      etiqueta: 'Citas de hoy',
      valor: '12',
      barras: [
        { nombre: 'Mañana', valor: 5 },
        { nombre: 'Tarde', valor: 7 },
      ],
    },
    secundario: {
      etiqueta: 'Cobros de hoy',
      barras: [
        { nombre: 'Efectivo', valor: 180 },
        { nombre: 'Yape', valor: 260 },
        { nombre: 'Plin', valor: 60 },
      ],
    },
    aviso: { etiqueta: 'Próxima cita', texto: 'Corte clásico · 4:30 p. m.' },
  },
});
