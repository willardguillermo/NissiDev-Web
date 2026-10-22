import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';

/**
 * Hace que una cifra "cuente" desde el valor anterior hasta el nuevo cuando cambia.
 * El texto final lo pone React; aquí solo se cambia el valor de ESE MISMO nodo de texto
 * (nodeValue), para no reemplazar el nodo que React tiene guardado.
 * Sin animación si se pidió "movimiento reducido", al montar o si alguno de los dos valores es 0.
 */
export function useContador<T extends HTMLElement>(centimos: number, formatear: (centimos: number) => string) {
  const elemento = useRef<T>(null);
  const anterior = useRef(centimos);

  useLayoutEffect(() => {
    const desde = anterior.current;
    anterior.current = centimos;
    const nodo = elemento.current?.firstChild;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!(nodo instanceof Text) || reducir || desde === centimos || desde === 0 || centimos === 0) return;

    const valor = { centimos: desde };
    nodo.nodeValue = formatear(desde);
    const animacion = gsap.to(valor, {
      centimos,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        nodo.nodeValue = formatear(Math.round(valor.centimos / 100) * 100);
      },
    });
    return () => {
      animacion.kill();
      nodo.nodeValue = formatear(centimos);
    };
  }, [centimos, formatear]);

  return elemento;
}
