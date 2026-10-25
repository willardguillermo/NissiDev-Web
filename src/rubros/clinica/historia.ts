import { armarHistoria } from '../historia';

// Clínica sin demo completa: solo citas y horarios. Sin diagnósticos ni datos de salud (ADR-004).
// Negocio y personas inventados.
export const HISTORIA_CLINICA = armarHistoria({
  negocio: 'Clínica Buen Día',
  tema: {
    marca: '#4fb3d9',
    sobreMarca: '#0f1a20',
    marcaTexto: '#14688a',
    texto: '#14202a',
    textoSuave: '#52606b',
    fondo: '#f8fcff',
    fondoSuave: '#eaf3f8',
    etiquetaAmarilla: '#bfe8d4',
    etiquetaTurquesa: '#9fd8ec',
    fuenteTitulos: 'inherit',
    fuenteTexto: 'inherit',
  },
  leyendas: [
    { titulo: 'Tu clínica, siempre a mano', texto: 'Tus pacientes ven especialidades, horarios y el precio de la consulta.' },
    { titulo: 'Reservan su cita', texto: 'Eligen especialidad, día y hora libre, sin hacer cola.' },
    { titulo: 'Te llega por WhatsApp', texto: 'La cita con la especialidad, el día y la hora.' },
    { titulo: 'Tú ves tus horarios', texto: 'Citas del día, cobros y los horarios que quedan libres.' },
  ],
  vitrina: {
    anuncio: 'Citas de lunes a sábado',
    buscador: 'Busca una especialidad…',
    titular: 'Reserva tu cita sin hacer cola',
    bajada: 'Elige especialidad, día y hora.',
    categorias: [
      { nombre: 'Medicina general', ilustracion: 'maletin' },
      { nombre: 'Odontología', ilustracion: 'diente' },
      { nombre: 'Pediatría', ilustracion: 'globo' },
    ],
  },
  pedido: {
    titulo: 'Horarios',
    accion: 'Reservar',
    items: [
      { id: 'lun-0900', nombre: 'Lun 9:00 a. m.', detalle: 'Medicina general', precio: 6000, ilustracion: 'reloj' },
      { id: 'lun-1030', nombre: 'Lun 10:30 a. m.', detalle: 'Medicina general', precio: 6000, ilustracion: 'reloj' },
      { id: 'lun-1500', nombre: 'Lun 3:00 p. m.', detalle: 'Odontología', precio: 8000, ilustracion: 'reloj' },
      { id: 'lun-1630', nombre: 'Lun 4:30 p. m.', detalle: 'Pediatría', precio: 7000, ilustracion: 'reloj' },
    ],
    elegidos: ['lun-1030'],
    resumen: 'Mi cita: lun 10:30 a. m.',
  },
  whatsapp: {
    lineas: [
      'Hola, Clínica Buen Día. Quiero reservar una cita:',
      'Especialidad: Medicina general',
      'Día: lunes',
      'Hora: 10:30 a. m.',
      'A nombre de: Rosa',
    ],
    respuesta: '¡Cita separada! Te esperamos el lunes.',
  },
  panel: {
    principal: {
      etiqueta: 'Citas de hoy',
      valor: '18',
      barras: [
        { nombre: 'General', valor: 9 },
        { nombre: 'Dental', valor: 5 },
        { nombre: 'Pediatría', valor: 4 },
      ],
    },
    secundario: {
      etiqueta: 'Cobros de hoy',
      barras: [
        { nombre: 'Efectivo', valor: 420 },
        { nombre: 'Yape', valor: 580 },
        { nombre: 'Plin', valor: 140 },
      ],
    },
    aviso: { etiqueta: 'Horarios libres', texto: 'Quedan 3 para mañana' },
  },
});
