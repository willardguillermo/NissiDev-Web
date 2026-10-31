import { describe, expect, it } from 'vitest';
import { PREGUNTAS } from './preguntas';

const respuesta = (inicio: string) => PREGUNTAS.find((p) => p.pregunta.startsWith(inicio))!.respuesta;

describe('preguntas frecuentes de Servicios', () => {
  it('los precios salen del catálogo, siempre como referenciales', () => {
    expect(respuesta('¿Cuánto cuesta')).toContain('desde S/ 700');
    expect(respuesta('¿Cuánto cuesta')).toContain('desde S/ 500');
    expect(respuesta('¿Cuánto cuesta')).toContain('referenciales');
  });

  it('las mensualidades son las decididas', () => {
    expect(respuesta('¿Hay pagos')).toContain('S/ 80/mes');
    expect(respuesta('¿Hay pagos')).toContain('S/ 60/mes');
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
