// Mensaje del botón de WhatsApp de la ficha. En la demo solo se muestra; en el sistema real abre WhatsApp.

export function mensajeInteres(codigo: string): string {
  return `Hola, me interesa el inmueble ${codigo}`;
}

/** Enlace wa.me con el mensaje (número solo con dígitos, con código de país). */
export function enlaceInteres(numero: string, codigo: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensajeInteres(codigo))}`;
}
