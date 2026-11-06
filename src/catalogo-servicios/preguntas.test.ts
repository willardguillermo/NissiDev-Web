import { describe, expect, it } from 'vitest';
import { PREGUNTAS } from './preguntas';

const respuesta = (inicio: string) => PREGUNTAS.find((p) => p.pregunta.startsWith(inicio))!.respuesta;

describe('preguntas frecuentes de Servicios', () => {
  it('los precios salen del catálogo, siempre como referenciales', () => {
    expect(respuesta('¿Cuánto cuesta')).toContain('desde S/ 900 (S/ 700 de lanzamiento para los primeros 5 proyectos)');
    expect(respuesta('¿Cuánto cuesta')).toContain('desde S/ 1,500');
    expect(respuesta('¿Cuánto cuesta')).toContain('referenciales');
  });

  it('las mensualidades son las decididas', () => {
    expect(respuesta('¿Hay pagos')).toContain('S/ 120/mes (S/ 180/mes con Panel del dueño)');
    expect(respuesta('¿Hay pagos')).toContain('S/ 60/mes');
  });

  it('la forma de pago: 50% y 50%, con la maqueta gratis', () => {
    expect(respuesta('¿Cómo se paga')).toContain('Pagas 50% al empezar y 50% al entregar.');
    expect(respuesta('¿Cómo se paga')).toContain('La maqueta es gratis: la ves antes de pagar nada.');
  });

  it('el plazo y la validez salen del proceso y de la cotización', () => {
    expect(respuesta('¿Cuánto demora')).toContain('4 semanas');
    expect(respuesta('¿Cómo recibo')).toContain('15 días');
  });

  it('ninguna respuesta queda vacía ni repite pregunta', () => {
    expect(new Set(PREGUNTAS.map((p) => p.pregunta)).size).toBe(PREGUNTAS.length);
    for (const p of PREGUNTAS) expect(p.respuesta.length).toBeGreaterThan(20);
  });
});
