// A dónde va el foco al cambiar de pantalla en una demo. Al volver de una ficha a la lista donde estaba su
// tarjeta (con Atrás o con «Volver»), el foco y el scroll vuelven a esa tarjeta: el cliente sigue donde iba.
// En cualquier otro cambio, el foco va al título de la pantalla nueva, arriba del todo.

export type DestinoFoco = { tipo: 'titulo' } | { tipo: 'tarjeta'; id: string };

export interface PantallaDemo {
  vista: string;
  pantalla: string;
  /** Lo abierto en la ficha (producto o inmueble). */
  id?: string;
}

export function destinoDelFoco(
  anterior: PantallaDemo,
  siguiente: PantallaDemo,
  { ficha, listas }: { ficha: string; listas: readonly string[] },
): DestinoFoco {
  const volviendoDeFicha =
    anterior.vista === 'cliente' && anterior.pantalla === ficha && anterior.id !== undefined;
  if (volviendoDeFicha && siguiente.vista === 'cliente' && listas.includes(siguiente.pantalla)) {
    return { tipo: 'tarjeta', id: anterior.id! };
  }
  return { tipo: 'titulo' };
}

/** Atributo que marca el botón que abre la ficha de cada tarjeta: data-abrir="{id}". */
export const ATRIBUTO_ABRIR = 'data-abrir';
