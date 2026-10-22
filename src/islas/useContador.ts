import { useLayoutEffect, useRef } from 'react';
import { animarContador, type Reloj } from './contador';

const relojDelNavegador: Reloj = {
  ahora: () => performance.now(),
  pedirCuadro: (paso) => requestAnimationFrame(paso),
  cancelarCuadro: (id) => cancelAnimationFrame(id),
};

/**
 * Hace que una cifra "cuente" desde el valor anterior hasta el nuevo cuando cambia (ver contador.ts).
 * El texto final lo pone React; la animación solo cambia el valor de ESE MISMO nodo de texto
 * (nodeValue), para no reemplazar el nodo que React tiene guardado.
 * El efecto depende solo de `centimos`: cada vez que se vuelve a ejecutar es porque React acaba de poner
 * un texto nuevo, y la limpieza solo cancela la animación anterior (nunca escribe un importe viejo).
 */
export function useContador<T extends HTMLElement>(centimos: number, formatear: (centimos: number) => string) {
  const elemento = useRef<T>(null);
  const anterior = useRef(centimos);
  const formato = useRef(formatear);

  useLayoutEffect(() => {
    formato.current = formatear;
  });

  useLayoutEffect(() => {
    const desde = anterior.current;
    anterior.current = centimos;
    const nodo = elemento.current?.firstChild;
    if (!(nodo instanceof Text)) return;
    return animarContador({
      nodo,
      desde,
      hasta: centimos,
      formatear: formato.current,
      menosMovimiento: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      reloj: relojDelNavegador,
    });
  }, [centimos]);

  return elemento;
}
