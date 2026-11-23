import { describe, expect, it } from 'vitest';
import { LANZAMIENTO_ACTIVO, LANZAMIENTO_AGOTADO } from '../catalogo-servicios/lanzamiento.prueba';
import { CARRITO_VACIO } from './carrito';
import { cargarSugerido } from './sugeridos';
import { cantidadElegida, etiquetaCotizar, textoTotalesSistema, totalesSistema } from './totales';

const VITRINA = { elegida: true, mantenimiento: false };
const VITRINA_MANT = { elegida: true, mantenimiento: true };

describe('totales con la Vitrina', () => {
  it('solo la Vitrina: precio cerrado, sin «desde»', () => {
    const t = totalesSistema(CARRITO_VACIO, VITRINA, LANZAMIENTO_ACTIVO);
    expect(t).toMatchObject({ inicial: 35000, mensual: 0, soloVitrina: true });
    expect(textoTotalesSistema(t)).toEqual({ inicial: 'S/ 350', mensual: 'Sin mensualidad' });
    expect(textoTotalesSistema(totalesSistema(CARRITO_VACIO, VITRINA_MANT, LANZAMIENTO_ACTIVO))).toEqual({
      inicial: 'S/ 350',
      mensual: 'S/ 60/mes',
    });
  });

  it('con módulos se suma y queda «desde»; la Vitrina no cambia el precio de lanzamiento', () => {
    const dulceria = cargarSugerido('dulceria'); // 700 + 1,500 con cupos
    const t = totalesSistema(dulceria, VITRINA_MANT, LANZAMIENTO_ACTIVO);
    expect(t).toMatchObject({ inicial: 255000, mensual: 6000, soloVitrina: false, vitrina: true });
    expect(textoTotalesSistema(t).inicial).toBe('Desde S/ 2,550');
    expect(totalesSistema(dulceria, VITRINA, LANZAMIENTO_AGOTADO).inicial).toBe(275000);
  });

  it('sin Vitrina es igual que los módulos solos', () => {
    const dulceria = cargarSugerido('dulceria');
    expect(totalesSistema(dulceria, undefined, LANZAMIENTO_ACTIVO)).toMatchObject({ inicial: 220000, vitrina: false });
  });

  it('el mantenimiento de la Vitrina se suma al de los módulos', () => {
    const conMant = { items: [...cargarSugerido('dulceria').items, 'mantenimiento' as const] };
    expect(totalesSistema(conMant, VITRINA_MANT, LANZAMIENTO_ACTIVO).mensual).toBe(18000 + 6000);
  });

  it('la Vitrina cuenta 1 en «Cotizar (n)»', () => {
    expect(cantidadElegida(CARRITO_VACIO, VITRINA_MANT)).toBe(1);
    expect(cantidadElegida(cargarSugerido('dulceria'), VITRINA)).toBe(4);
    expect(cantidadElegida(CARRITO_VACIO, { elegida: false, mantenimiento: true })).toBe(0);
  });

  it('el botón Cotizar dice «elegido(s)», sin llamar «función» a la Vitrina', () => {
    expect(etiquetaCotizar(1)).toBe('Cotizar: 1 elegido');
    expect(etiquetaCotizar(2)).toBe('Cotizar: 2 elegidos');
    expect(etiquetaCotizar(cantidadElegida(CARRITO_VACIO, VITRINA))).not.toMatch(/funci/);
  });
});
