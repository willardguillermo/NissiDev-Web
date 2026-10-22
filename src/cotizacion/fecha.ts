/** Fecha del calendario local, sin horas ni zona horaria. `mes` va de 1 a 12. */
export interface FechaLocal {
  anio: number;
  mes: number;
  dia: number;
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** "05/11/2026" */
export function formatearFecha({ anio, mes, dia }: FechaLocal): string {
  return `${dosDigitos(dia)}/${dosDigitos(mes)}/${anio}`;
}
