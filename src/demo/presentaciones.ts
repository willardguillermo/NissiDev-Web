import type { Presentacion } from './tipos';

// Cantidades dichas en la presentación de la línea: "1 bolsa", "3 cajas", "2 unidades".

/** "Bolsa x50" → "bolsa"; "Unidad" → "unidad". */
export function tipoDePresentacion(presentacion: Presentacion): string {
  return presentacion.nombre.split(' ')[0].toLowerCase();
}

const plural = (palabra: string) => (/[aeiou]$/.test(palabra) ? `${palabra}s` : `${palabra}es`);

export function contarPresentacion(cantidad: number, presentacion: Presentacion): string {
  const tipo = tipoDePresentacion(presentacion);
  return `${cantidad} ${cantidad === 1 ? tipo : plural(tipo)}`;
}
