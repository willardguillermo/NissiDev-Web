// Plantilla de dulcería con su negocio de ejemplo, "Dulcería La Golosa" (ficticio).
// Todo lo propio del negocio está aquí; para otro negocio del mismo rubro se cambia este archivo.
import { personalizar, type Personalizacion } from '../../demo/rubro';
import type { RubroConfig } from '../../demo/tipos';
import { PRODUCTOS } from './productos';

/** Con los 3 puestos que admite la plantilla. */
export const DULCERIA_COMPLETA: RubroConfig = {
  id: 'dulceria',
  rubro: 'Dulcería',
  negocio: 'Dulcería La Golosa',
  whatsappVisible: '+51 900 000 000',
  direccion: 'Av. de Ejemplo 123, Lima (dirección ficticia)',
  redes: ['Facebook', 'Instagram', 'TikTok'],
  textos: {
    anuncio: 'Precios por mayor · Pedidos por WhatsApp',
    buscador: '¿Qué dulce buscas?',
    heroGeneral: {
      titular: 'Dulces para cada fiesta',
      bajada: 'Chocolates, gomitas y todo para tu fiesta, por unidad o por mayor.',
      ilustracion: 'caramelo',
    },
    porQue: [
      { titulo: 'Variedad', texto: 'Más de 30 productos entre dulces, snacks y piñatería.' },
      { titulo: 'Precio de mayorista', texto: 'Mientras más llevas, menos pagas por unidad.' },
      { titulo: 'Pedidos para fiestas', texto: 'Arma tu pedido aquí y recógelo listo.' },
    ],
    tiendaUnica: 'Dulces, snacks y piñatería en un solo lugar',
    notaPedido: 'No se cobra nada aquí: pagas en efectivo, Yape o Plin al recoger.',
  },
  tema: {
    marca: '#ec48ae',
    sobreMarca: '#121212',
    marcaTexto: '#b3166f',
    texto: '#121212',
    textoSuave: '#5c5c5c',
    fondo: '#ffffff',
    fondoSuave: '#f3f3f3',
    etiquetaAmarilla: '#ffc72c',
    etiquetaTurquesa: '#00c2b9',
    fuenteTitulos: "'Shrikhand', Georgia, serif",
    fuenteTexto: "'Chivo', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  vendePorMayor: true,
  categorias: [
    { id: 'chocolates', nombre: 'Chocolates', ilustracion: 'chocolate' },
    { id: 'gomitas', nombre: 'Gomitas', ilustracion: 'gomita' },
    { id: 'galletas', nombre: 'Galletas', ilustracion: 'galleta' },
    { id: 'caramelos', nombre: 'Caramelos', ilustracion: 'caramelo' },
    { id: 'snacks', nombre: 'Snacks', ilustracion: 'snack' },
    { id: 'pinateria', nombre: 'Piñatería', ilustracion: 'globo' },
  ],
  ocasiones: [
    { id: 'cumpleanos', nombre: 'Cumpleaños', descripcion: 'Torta, velitas y dulces' },
    { id: 'bolsitas-sorpresa', nombre: 'Bolsitas sorpresa', descripcion: 'Para armar por docena' },
    { id: 'halloween', nombre: 'Halloween', descripcion: 'Dulce o truco', campana: 'halloween' },
    { id: 'navidad', nombre: 'Navidad', descripcion: 'Chocolatada y regalos', campana: 'navidad' },
    { id: 'dia-del-nino', nombre: 'Día del Niño', descripcion: 'Sorpresas para los chicos', campana: 'dia-del-nino' },
    { id: 'por-mayor', nombre: 'Por mayor', descripcion: 'Cajas y bolsas grandes', soloPorMayor: true },
  ],
  campanas: [
    { id: 'halloween', nombre: 'Halloween', titular: '¡Dulce o truco!', bajada: 'Todo para el 31: gomitas, chupetines y bolsas calabaza, también por mayor.', ilustracion: 'calabaza' },
    { id: 'navidad', nombre: 'Navidad', titular: 'Una Navidad bien dulce', bajada: 'Chocolate para taza, bastones y monedas para tu chocolatada.', ilustracion: 'arbol' },
    { id: 'dia-del-nino', nombre: 'Día del Niño', titular: 'Sorpresas para los chicos', bajada: 'Galletas, gomitas y globos para celebrar su día.', ilustracion: 'regalo' },
  ],
  campanaActiva: 'halloween',
  puestos: [
    { numero: 1, nombre: 'Puesto 1', queSeEncuentra: 'Chocolates, galletas y piñatería', horario: 'Lunes a sábado, 9 a. m. a 8 p. m.', referencia: 'Entrada principal de la galería' },
    { numero: 2, nombre: 'Puesto 2', queSeEncuentra: 'Gomitas, caramelos y snacks', horario: 'Lunes a sábado, 9 a. m. a 8 p. m.', referencia: 'Pasillo central, frente a la escalera' },
    { numero: 3, nombre: 'Puesto 3', queSeEncuentra: 'Por mayor: cajas y bolsas grandes', horario: 'Lunes a domingo, 8 a. m. a 6 p. m.', referencia: 'Al fondo, junto al estacionamiento' },
  ],
  productos: PRODUCTOS,
  masVendidos: ['bombones-mani', 'gomitas-ositos', 'caramelos-leche', 'galletas-vainilla', 'papitas-hilo', 'globos-colores'],
};

/** Lo que usa la demo: 2 puestos (y Halloween, que ya viene en la configuración). */
export const PERSONALIZACION_DULCERIA: Personalizacion = { puestos: 2 };
export const DULCERIA = personalizar(DULCERIA_COMPLETA, PERSONALIZACION_DULCERIA);

/** Fuentes del negocio en public/fonts (licencia OFL al lado); la demo las precarga. */
export const FUENTES_DULCERIA = ['/fonts/shrikhand-latin.woff2', '/fonts/chivo-latin-wght.woff2'];
