// Estado del rotador de servicios del Inicio (sin DOM). El temporizador y el HTML viven en
// src/components/RotadorServicios.astro; aquí solo se decide qué se muestra y si avanza solo.

export interface EstadoRotador {
  actual: number;
  total: number;
  /** Pausado por la persona (botón, un punto, el foco con teclado) o por "movimiento reducido". */
  pausado: boolean;
}

export type EventoRotador =
  | { tipo: 'tic' } // pasaron los 3 s
  | { tipo: 'ir'; indice: number } // tocó un punto
  | { tipo: 'alternar' } // botón de pausa/reproducir
  | { tipo: 'pausar' }; // entró el foco con teclado

export const INTERVALO_ROTADOR = 3000;

export function crearRotador(total: number, menosMovimiento: boolean): EstadoRotador {
  if (!Number.isInteger(total) || total < 1) throw new RangeError(`El rotador necesita al menos 1 elemento: ${total}`);
  return { actual: 0, total, pausado: menosMovimiento };
}

export function rotar(estado: EstadoRotador, evento: EventoRotador): EstadoRotador {
  switch (evento.tipo) {
    case 'tic':
      return estado.pausado ? estado : { ...estado, actual: (estado.actual + 1) % estado.total };
    case 'ir':
      if (!Number.isInteger(evento.indice) || evento.indice < 0 || evento.indice >= estado.total) return estado;
      return { ...estado, actual: evento.indice, pausado: true };
    case 'alternar':
      return { ...estado, pausado: !estado.pausado };
    case 'pausar':
      return estado.pausado ? estado : { ...estado, pausado: true };
  }
}
