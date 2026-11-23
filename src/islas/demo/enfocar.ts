import { ATRIBUTO_ABRIR, type DestinoFoco } from '../../demo/foco';

/**
 * Lleva el foco al destino. Si la tarjeta ya no está (p. ej., los filtros la ocultan), va al título.
 * La tarjeta se centra en la pantalla sin animación: el cliente debe verla al instante, no viajar hacia ella.
 */
export function enfocar(raiz: HTMLElement | null, destino: DestinoFoco) {
  if (!raiz) return;
  if (destino.tipo === 'tarjeta') {
    const tarjeta = raiz.querySelector<HTMLElement>(`[${ATRIBUTO_ABRIR}="${CSS.escape(destino.id)}"]`);
    if (tarjeta) {
      tarjeta.scrollIntoView({ block: 'center', behavior: 'instant' });
      tarjeta.focus({ preventScroll: true });
      return;
    }
  }
  window.scrollTo({ top: 0 });
  raiz.querySelector<HTMLElement>('[data-titulo-pantalla]')?.focus({ preventScroll: true });
}
