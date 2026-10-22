// Montos en céntimos enteros: 70000 = S/ 700.
const conDecimales = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sinDecimales = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 });

export function formatearSoles(centimos: number): string {
  if (!Number.isSafeInteger(centimos) || centimos < 0) {
    throw new RangeError(`Monto inválido: ${centimos}. Se espera un entero de céntimos ≥ 0.`);
  }
  const soles = centimos / 100;
  const formato = centimos % 100 === 0 ? sinDecimales : conDecimales;
  return `S/ ${formato.format(soles)}`;
}
