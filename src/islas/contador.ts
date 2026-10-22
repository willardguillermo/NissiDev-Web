// Animación del contador del total, sin React ni DOM: recibe el nodo de texto y el reloj por parámetro
// para poder probarla con Vitest. El hook useContador es solo la capa que la conecta con React.

/** Lo único que se usa del nodo de texto: su valor. */
export interface NodoTexto {
  nodeValue: string | null;
}

/** El reloj del navegador (performance.now y requestAnimationFrame) o uno falso en los tests. */
export interface Reloj {
  ahora: () => number;
  pedirCuadro: (paso: (ahora: number) => void) => number;
  cancelarCuadro: (id: number) => void;
}

export interface OpcionesContador {
  nodo: NodoTexto;
  desde: number;
  hasta: number;
  formatear: (centimos: number) => string;
  menosMovimiento: boolean;
  reloj: Reloj;
  duracion?: number;
}

export const DURACION_CONTADOR = 600;

/** Desaceleración suave (cúbica): arranca rápido y frena al llegar, como --ease-out. */
const desacelerar = (t: number) => 1 - (1 - t) ** 3;

/**
 * Hace "contar" la cifra de `desde` a `hasta`, escribiendo en el nodo en cada cuadro.
 * No anima con "movimiento reducido", si no cambió o si alguno es 0 (ahí el texto lo pone React:
 * "Por cotizar", "Elige un módulo"…).
 * Devuelve una función que SOLO cancela: nunca escribe en el nodo, porque cuando se cancela es que React
 * ya puso el texto nuevo y no se debe pisar con un importe viejo.
 */
export function animarContador({
  nodo,
  desde,
  hasta,
  formatear,
  menosMovimiento,
  reloj,
  duracion = DURACION_CONTADOR,
}: OpcionesContador): () => void {
  if (menosMovimiento || desde === hasta || desde === 0 || hasta === 0) return () => {};

  let cancelado = false;
  let cuadro = 0;
  const inicio = reloj.ahora();
  nodo.nodeValue = formatear(desde);

  const paso = (ahora: number) => {
    if (cancelado) return;
    const avance = Math.min(1, Math.max(0, (ahora - inicio) / duracion));
    const valor = desde + (hasta - desde) * desacelerar(avance);
    // En el camino, soles enteros; al final, el monto exacto.
    nodo.nodeValue = formatear(avance < 1 ? Math.round(valor / 100) * 100 : hasta);
    if (avance < 1) cuadro = reloj.pedirCuadro(paso);
  };
  cuadro = reloj.pedirCuadro(paso);

  return () => {
    cancelado = true;
    reloj.cancelarCuadro(cuadro);
  };
}
