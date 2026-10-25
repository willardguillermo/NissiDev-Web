import { DIAS_VALIDEZ } from '../cotizacion/cotizacion';
import { obtenerModulo } from './modulos';
import { textoPrecio } from './precio';
import { PASOS } from './proceso';

// Preguntas frecuentes de /servicios. Las respuestas solo usan lo ya decidido (SPEC y ESTADO) y lo arman con
// los mismos datos del catálogo, el proceso y la cotización: si cambia un precio, cambia aquí también.

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

/** Solo la primera letra en minúscula: «Desde S/ 700» → «desde S/ 700». */
const enFrase = (texto: string) => texto.charAt(0).toLowerCase() + texto.slice(1);
const desde = (id: Parameters<typeof obtenerModulo>[0]) => enFrase(textoPrecio(obtenerModulo(id)));
const paso = (titulo: string) => enFrase(PASOS.find((p) => p.titulo === titulo)!.texto).replace(/\.$/, '');

export const PREGUNTAS: readonly Pregunta[] = [
  {
    pregunta: '¿Puedo ver cómo quedaría antes de pagar?',
    respuesta: `Sí. Primero te muestro una maqueta: ${paso('Maqueta')}. También puedes probar la demo de tu rubro en Soluciones.`,
  },
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta: `Depende de las funciones que elijas. Por ejemplo, el ${obtenerModulo('catalogo-web').nombre} va ${desde('catalogo-web')} y el ${obtenerModulo('panel-dueno').nombre} ${desde('panel-dueno')}. Son precios referenciales: en la propuesta recibes el precio cerrado y qué incluye.`,
  },
  {
    pregunta: '¿Cuánto demora?',
    respuesta: `${PASOS.find((p) => p.titulo === 'Desarrollo')!.texto} Al terminar, te acompaño con el soporte.`,
  },
  {
    pregunta: '¿Hay pagos mensuales?',
    respuesta: `Solo si eliges funciones que los tienen: el ${obtenerModulo('mantenimiento').nombre} cuesta ${textoPrecio(obtenerModulo('mantenimiento'))} y la ${obtenerModulo('caja').nombre}, ${textoPrecio(obtenerModulo('caja'))}. En la cotización la inversión inicial y la mensualidad van separadas.`,
  },
  {
    pregunta: '¿Tengo que pedir todo desde el inicio?',
    respuesta: 'No. Puedes empezar con poco y sumar funciones después.',
  },
  {
    pregunta: '¿Cómo recibo la cotización?',
    respuesta: `Eliges tus funciones en Cotizar y la cotización sale con un código, válida por ${DIAS_VALIDEZ} días. La envías por WhatsApp o la guardas en PDF. No se cobra nada en la web.`,
  },
];
