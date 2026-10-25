// Único lugar con el WhatsApp de NissiDev (cotizaciones y contacto).
export const WHATSAPP_VISIBLE = '+51 913 351 627';
export const WHATSAPP_NUMERO = '51913351627';
export const WHATSAPP_ENLACE = `https://wa.me/${WHATSAPP_NUMERO}`;

/** WhatsApp con un primer mensaje ya escrito (el dueño puede cambiarlo antes de enviar). */
export function whatsappConMensaje(texto: string): string {
  return `${WHATSAPP_ENLACE}?text=${encodeURIComponent(texto)}`;
}
