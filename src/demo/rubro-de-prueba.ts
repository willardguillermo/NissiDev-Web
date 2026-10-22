// Configuración mínima SOLO para los tests del motor de demos (la app no la importa).
import { CATALOGO_DE_PRUEBA } from './catalogo-de-prueba';
import type { RubroConfig } from './tipos';

export const RUBRO_DE_PRUEBA: RubroConfig = {
  id: 'prueba',
  rubro: 'Dulcería',
  negocio: 'Dulces de Prueba',
  whatsappVisible: '+51 900 000 000',
  direccion: 'Av. Ejemplo 123',
  redes: ['Facebook'],
  textos: {
    anuncio: 'Precios por mayor · Pedidos por WhatsApp',
    buscador: '¿Qué dulce buscas?',
    heroGeneral: { titular: 'Dulces para todo', bajada: 'Por unidad y por mayor.', ilustracion: 'caramelo' },
    porQue: [{ titulo: 'Variedad', texto: 'De todo un poco.' }],
    tiendaUnica: 'De todo en un solo lugar',
  },
  tema: {
    marca: '#ec48ae',
    sobreMarca: '#121212',
    marcaTexto: '#b0176f',
    texto: '#121212',
    textoSuave: '#555555',
    fondo: '#ffffff',
    fondoSuave: '#f3f3f3',
    etiquetaAmarilla: '#ffc72c',
    etiquetaTurquesa: '#00c2b9',
    fuenteTitulos: 'serif',
    fuenteTexto: 'sans-serif',
  },
  vendePorMayor: true,
  categorias: [
    { id: 'chocolates', nombre: 'Chocolates', ilustracion: 'chocolate' },
    { id: 'gomitas', nombre: 'Gomitas', ilustracion: 'gomita' },
    { id: 'galletas', nombre: 'Galletas', ilustracion: 'galleta' },
    { id: 'piñatería', nombre: 'Piñatería', ilustracion: 'pinata' },
  ],
  ocasiones: [
    { id: 'cumpleanos', nombre: 'Cumpleaños', descripcion: 'Para la fiesta' },
    { id: 'bolsitas-sorpresa', nombre: 'Bolsitas sorpresa', descripcion: 'Para armar' },
    { id: 'halloween', nombre: 'Halloween', descripcion: 'Dulce o truco', campana: 'halloween' },
    { id: 'por-mayor', nombre: 'Por mayor', descripcion: 'Cajas y bolsas', soloPorMayor: true },
  ],
  campanas: [{ id: 'halloween', nombre: 'Halloween', titular: 'Dulce o truco', bajada: 'Todo para el 31.', ilustracion: 'calabaza' }],
  campanaActiva: 'halloween',
  puestos: [
    { numero: 1, nombre: 'Puesto 1', queSeEncuentra: 'Chocolates', horario: '9 a 7', referencia: 'Entrada' },
    { numero: 2, nombre: 'Puesto 2', queSeEncuentra: 'Gomitas', horario: '9 a 7', referencia: 'Pasillo' },
    { numero: 3, nombre: 'Puesto 3', queSeEncuentra: 'Fiesta', horario: '9 a 7', referencia: 'Fondo' },
  ],
  productos: CATALOGO_DE_PRUEBA,
  masVendidos: ['choco-luna', 'gomitas-osito'],
};
