import { describe, expect, it } from 'vitest';
import { animarContador, DURACION_CONTADOR, type NodoTexto, type Reloj } from './contador';

const formatear = (centimos: number) => `Desde S/ ${(centimos / 100).toLocaleString('en-US')}`;

/** Reloj falso: los cuadros solo corren cuando el test avanza el tiempo. */
function crearReloj() {
  let tiempo = 0;
  let siguienteId = 1;
  const pendientes = new Map<number, (ahora: number) => void>();
  const reloj: Reloj = {
    ahora: () => tiempo,
    pedirCuadro: (paso) => {
      pendientes.set(siguienteId, paso);
      return siguienteId++;
    },
    cancelarCuadro: (id) => {
      pendientes.delete(id);
    },
  };
  const avanzar = (ms: number) => {
    const fin = tiempo + ms;
    while (tiempo < fin) {
      tiempo = Math.min(fin, tiempo + 16);
      const ahora = [...pendientes.entries()];
      pendientes.clear();
      for (const [, paso] of ahora) paso(tiempo);
    }
  };
  return { reloj, avanzar, pendientes };
}

/** Imita el ciclo de React: pone el texto, cancela la animación anterior y arranca la nueva. */
function crearContador(inicial: number, textoReact: (centimos: number) => string = formatear, menosMovimiento = false) {
  const { reloj, avanzar, pendientes } = crearReloj();
  const nodo: NodoTexto = { nodeValue: textoReact(inicial) };
  let anterior = inicial;
  let cancelar = () => {};
  const cambiar = (centimos: number) => {
    nodo.nodeValue = textoReact(centimos);
    cancelar();
    cancelar = animarContador({ nodo, desde: anterior, hasta: centimos, formatear, menosMovimiento, reloj });
    anterior = centimos;
  };
  return { nodo, cambiar, avanzar, pendientes, cancelar: () => cancelar() };
}

describe('animarContador', () => {
  it('cuenta de A a B y termina en el monto exacto de B', () => {
    const c = crearContador(70000);
    c.cambiar(120050);
    expect(c.nodo.nodeValue).toBe(formatear(70000));
    c.avanzar(DURACION_CONTADOR / 2);
    const intermedio = c.nodo.nodeValue;
    expect(intermedio).not.toBe(formatear(70000));
    expect(intermedio).not.toBe(formatear(120050));
    c.avanzar(DURACION_CONTADOR);
    expect(c.nodo.nodeValue).toBe(formatear(120050));
    expect(c.pendientes.size).toBe(0);
  });

  it('de un total positivo a 0 deja el texto de React, no el importe viejo (hallazgo de Codex)', () => {
    // Catálogo + Panel + Reservas → quitar Catálogo: queda solo Reservas, que es "Por cotizar".
    const textoReact = (centimos: number) => (centimos === 0 ? 'Por cotizar' : formatear(centimos));
    const c = crearContador(70000, textoReact);
    c.cambiar(120000);
    c.avanzar(DURACION_CONTADOR / 2);
    c.cambiar(0);
    expect(c.nodo.nodeValue).toBe('Por cotizar');
    c.avanzar(DURACION_CONTADOR * 2);
    expect(c.nodo.nodeValue).toBe('Por cotizar');
  });

  it('si cambia a mitad de la animación, termina exacto en el último monto', () => {
    const c = crearContador(70000);
    c.cambiar(120000);
    c.avanzar(DURACION_CONTADOR / 3);
    c.cambiar(170000);
    c.avanzar(DURACION_CONTADOR * 2);
    expect(c.nodo.nodeValue).toBe(formatear(170000));
  });

  it('A → B → A rápido vuelve exacto a A', () => {
    const c = crearContador(70000);
    c.cambiar(120000);
    c.avanzar(32);
    c.cambiar(70000);
    c.avanzar(DURACION_CONTADOR * 2);
    expect(c.nodo.nodeValue).toBe(formatear(70000));
  });

  it('cancelar no escribe nada: queda el texto que puso React, nunca un número intermedio', () => {
    const c = crearContador(70000);
    c.cambiar(120000);
    c.avanzar(DURACION_CONTADOR / 2);
    c.nodo.nodeValue = 'texto de React';
    c.cancelar();
    expect(c.nodo.nodeValue).toBe('texto de React');
    c.avanzar(DURACION_CONTADOR * 2);
    expect(c.nodo.nodeValue).toBe('texto de React');
    expect(c.pendientes.size).toBe(0);
  });

  it('con movimiento reducido no anima: el texto de React se queda tal cual', () => {
    const c = crearContador(70000, formatear, true);
    c.cambiar(120000);
    expect(c.nodo.nodeValue).toBe(formatear(120000));
    expect(c.pendientes.size).toBe(0);
  });

  it('no anima desde 0 ni si el monto no cambió', () => {
    const c = crearContador(0, (centimos) => (centimos === 0 ? 'Elige un módulo' : formatear(centimos)));
    c.cambiar(70000);
    expect(c.pendientes.size).toBe(0);
    c.cambiar(70000);
    expect(c.pendientes.size).toBe(0);
    expect(c.nodo.nodeValue).toBe(formatear(70000));
  });
});
