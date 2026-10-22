import { useLayoutEffect, useRef } from 'react';

const DURACION = 600;
/** Desaceleración suave (cúbica): arranca rápido y frena al llegar, como --ease-out. */
const desacelerar = (t: number) => 1 - (1 - t) ** 3;

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

    nodo.nodeValue = formatear(desde);
    const inicio = performance.now();
    let cuadro = 0;
    const paso = (ahora: number) => {
      const avance = Math.min(1, (ahora - inicio) / DURACION);
      const valor = desde + (centimos - desde) * desacelerar(avance);
      // En el camino, soles enteros; al final, el monto exacto.
      nodo.nodeValue = formatear(avance < 1 ? Math.round(valor / 100) * 100 : centimos);
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };
    cuadro = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(cuadro);
      nodo.nodeValue = formatear(centimos);
    };
  }, [centimos, formatear]);

  return elemento;
}
