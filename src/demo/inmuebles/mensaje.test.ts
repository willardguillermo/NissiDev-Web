import { describe, expect, it } from 'vitest';
import { enlaceInteres, mensajeInteres } from './mensaje';

describe('mensaje de WhatsApp de la ficha', () => {
  it('lleva el código del inmueble', () => {
    expect(mensajeInteres('DEP-104')).toBe('Hola, me interesa el inmueble DEP-104');
  });

  it('el enlace wa.me deja solo los dígitos del número y codifica el mensaje', () => {
    const enlace = enlaceInteres('+51 900 000 000', 'CAS-201');
    expect(enlace).toBe('https://wa.me/51900000000?text=Hola%2C%20me%20interesa%20el%20inmueble%20CAS-201');
    expect(new URL(enlace).searchParams.get('text')).toBe('Hola, me interesa el inmueble CAS-201');
  });
});
