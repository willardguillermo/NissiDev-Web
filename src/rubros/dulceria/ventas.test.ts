import { describe, expect, it } from 'vitest';
import { diasEntre, porVencer, stockBajo, totalVenta } from '../../demo/panel';
import { personalizar } from '../../demo/rubro';
import { DULCERIA_COMPLETA } from './config';
import { PRODUCTOS } from './productos';
import { generarVentas, HOY_DEMO } from './ventas';

const ventas = DULCERIA_COMPLETA.panel.ventas;

describe('ventas ficticias de la dulcería', () => {
  it('siempre son las mismas (no dependen del reloj ni del azar)', () => {
    expect(generarVentas(PRODUCTOS, HOY_DEMO)).toEqual(ventas);
  });

  it('cubren hoy y los 7 días anteriores, ninguna después de hoy', () => {
    const dias = new Set(ventas.map((v) => diasEntre(v.fecha.slice(0, 10), HOY_DEMO)));
    expect([...dias].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it.each([1, 2, 3])('con %i puesto(s): hoy hay ventas en cada puesto y con los 3 medios de pago', (puestos) => {
    const config = personalizar(DULCERIA_COMPLETA, { puestos });
    const deHoy = config.panel.ventas.filter((v) => v.fecha.startsWith(HOY_DEMO));
    for (const puesto of config.puestos) {
      const delPuesto = deHoy.filter((v) => v.puesto === puesto.numero);
      expect(new Set(delPuesto.map((v) => v.medio)), `puesto ${puesto.numero}`).toEqual(new Set(['efectivo', 'yape', 'plin']));
    }
  });

  it('montos creíbles: cada venta entre S/ 0.20 (un caramelo) y S/ 300', () => {
    expect(ventas.every((v) => totalVenta(v) >= 20 && totalVenta(v) <= 30_000)).toBe(true);
  });

  it('el panel tiene qué mostrar: productos por vencer en 7 días y stock bajo', () => {
    expect(porVencer(DULCERIA_COMPLETA).length).toBeGreaterThanOrEqual(3);
    expect(stockBajo(DULCERIA_COMPLETA).length).toBeGreaterThanOrEqual(2);
  });
});
