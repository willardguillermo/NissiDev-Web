import { HISTORIA_BELLEZA } from './belleza/historia';
import { HISTORIA_CLINICA } from './clinica/historia';
import { HISTORIA_DULCERIA } from './dulceria/historia';
import type { PantallasRubro } from './historia';
import { HISTORIA_MAYORISTA } from './mayorista/historia';
import { HISTORIA_RESTAURANTE } from './restaurante/historia';

/** Las pantallas del celular de cada rubro, por id (los mismos de RUBROS). */
export const HISTORIAS: Readonly<Record<string, PantallasRubro>> = {
  dulceria: HISTORIA_DULCERIA,
  restaurante: HISTORIA_RESTAURANTE,
  belleza: HISTORIA_BELLEZA,
  clinica: HISTORIA_CLINICA,
  mayorista: HISTORIA_MAYORISTA,
};
