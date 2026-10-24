export type FaseImpresion = 'preparando' | 'imprimiendo' | 'lista';

export const DURACION_PREPARACION = 900;

/** Alto del papel en píxeles; resultado en milisegundos, entre 1200 y 2600. */
export function duracionImpresion(alto: number): number {
  return Math.min(2600, Math.max(1200, Math.round(alto * 1.4)));
}

/** Solo comunica fases: React y CSS se encargan del texto y del movimiento del papel. */
export function iniciarSecuenciaImpresion({
  alto,
  menosMovimiento,
  cambiarFase,
}: {
  alto: number;
  menosMovimiento: boolean;
  cambiarFase: (fase: FaseImpresion) => void;
}): () => void {
  if (menosMovimiento) {
    cambiarFase('lista');
    return () => {};
  }

  let cancelado = false;
  cambiarFase('preparando');
  let temporizador = setTimeout(() => {
    if (cancelado) return;
    // Programar antes de avisar permite cancelar incluso desde cambiarFase.
    temporizador = setTimeout(() => {
      if (!cancelado) cambiarFase('lista');
    }, duracionImpresion(alto));
    cambiarFase('imprimiendo');
  }, DURACION_PREPARACION);

  // Limpieza para desmontaje o repetición: no escribe ni notifica otra fase.
  return () => {
    cancelado = true;
    clearTimeout(temporizador);
  };
}
