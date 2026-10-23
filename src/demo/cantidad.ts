// Lo que el cliente escribe en un campo de cantidad puede venir vacío, con texto o con números
// absurdos. Antes de sumar, restar o agregar, se lleva a un entero válido.

/**
 * Vacío, texto, NaN, 0 o negativos → 1 (el mínimo); con decimales, se redondea hacia abajo;
 * números enormes (o Infinity) → el máximo. Sin máximo, el tope es el mayor entero seguro.
 */
export function normalizarCantidad(valor: number | string, maximo = Number.MAX_SAFE_INTEGER): number {
  const numero = typeof valor === 'string' ? (valor.trim() === '' ? NaN : Number(valor)) : valor;
  if (Number.isNaN(numero) || numero < 1) return 1;
  return Math.max(1, Math.min(Math.floor(numero), maximo));
}
