// Plantilla de inmobiliaria con su agente de ejemplo (ficticio). Todo lo propio del negocio está aquí.
import type { Consulta, InmobiliariaConfig } from '../../demo/inmuebles/tipos';
import { INMUEBLES } from './inmuebles';

const HOY = '2026-11-20';

/** Consultas de ejemplo: [código, día de noviembre, hora, canal]. */
const CONSULTAS: [string, number, string, Consulta['canal']][] = [
  ['DEP-101', 20, '09:12', 'whatsapp'],
  ['DEP-101', 19, '18:40', 'whatsapp'],
  ['DEP-101', 18, '11:05', 'llamada'],
  ['DEP-101', 16, '20:15', 'whatsapp'],
  ['DEP-101', 15, '10:30', 'whatsapp'],
  ['DEP-104', 20, '08:45', 'whatsapp'],
  ['DEP-104', 19, '13:20', 'whatsapp'],
  ['DEP-104', 17, '19:02', 'formulario'],
  ['DEP-104', 14, '16:48', 'whatsapp'],
  ['DEP-103', 20, '07:58', 'whatsapp'],
  ['DEP-103', 19, '21:10', 'whatsapp'],
  ['DEP-103', 18, '12:34', 'whatsapp'],
  ['DEP-102', 18, '17:15', 'whatsapp'],
  ['DEP-102', 15, '09:40', 'llamada'],
  ['CAS-201', 17, '10:05', 'whatsapp'],
  ['CAS-201', 14, '15:30', 'whatsapp'],
  ['LOC-401', 19, '11:50', 'whatsapp'],
  ['CAS-202', 16, '18:22', 'whatsapp'],
  ['TER-301', 10, '09:00', 'llamada'],
  ['OFI-501', 9, '14:10', 'formulario'],
];

export const INMOBILIARIA: InmobiliariaConfig = {
  id: 'inmobiliaria',
  rubro: 'Inmobiliaria',
  negocio: 'Llave Propia Inmuebles',
  whatsappVisible: '+51 900 000 000',
  tema: {
    marca: '#1f6f5c',
    sobreMarca: '#ffffff',
    marcaTexto: '#1a5e4e',
    texto: '#16201d',
    textoSuave: '#4f5c57',
    fondo: '#fbfaf7',
    fondoSuave: '#edf1ee',
    etiquetaAmarilla: '#f2d48a',
    etiquetaTurquesa: '#a8dccd',
    fuenteTitulos: 'inherit',
    fuenteTexto: 'inherit',
  },
  textos: {
    anuncio: 'Venta y alquiler · Visitas por WhatsApp',
    titular: 'Encuentra tu próximo hogar',
    bajada: 'Departamentos, casas, terrenos y locales con precio claro y visita coordinada por WhatsApp.',
  },
  agente: {
    nombre: 'Carla Rivas',
    cargo: 'Agente inmobiliaria',
    registroMvcs: 'PN-00000',
    presentacion: 'Te acompaño desde la primera visita hasta la firma: precios reales, papeles revisados y respuestas el mismo día.',
    anios: 8,
    zonas: ['Valle Verde', 'Las Lomas', 'Los Álamos', 'San Gabriel'],
    horario: 'Lunes a sábado, de 9:00 a. m. a 7:00 p. m.',
  },
  distritos: ['Las Lomas', 'Los Álamos', 'San Gabriel', 'Valle Verde'],
  tipoCambio: 3.75,
  inmuebles: INMUEBLES,
  panel: {
    hoy: HOY,
    consultas: CONSULTAS.map(([codigo, dia, hora, canal]) => ({ codigo, fecha: `2026-11-${String(dia).padStart(2, '0')}T${hora}`, canal })),
    vistas: {
      'DEP-101': 142,
      'DEP-104': 118,
      'DEP-103': 97,
      'CAS-201': 84,
      'DEP-102': 63,
      'LOC-401': 41,
      'CAS-203': 38,
      'CAS-202': 35,
      'TER-301': 22,
      'OFI-501': 17,
    },
  },
};
