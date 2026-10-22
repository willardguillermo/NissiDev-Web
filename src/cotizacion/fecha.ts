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

/** Fecha local del navegador (lo que el dueño ve en su calendario), sin horas. */
export function fechaLocalDeHoy(ahora: Date = new Date()): FechaLocal {
  return { anio: ahora.getFullYear(), mes: ahora.getMonth() + 1, dia: ahora.getDate() };
}

/** Suma días de calendario. Se calcula en UTC para que los cambios de horario no muevan el día. */
export function sumarDias({ anio, mes, dia }: FechaLocal, dias: number): FechaLocal {
  const resultado = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return { anio: resultado.getUTCFullYear(), mes: resultado.getUTCMonth() + 1, dia: resultado.getUTCDate() };
}
