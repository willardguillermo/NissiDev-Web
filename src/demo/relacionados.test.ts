import { describe, expect, it } from 'vitest';
import { CHOCOLATE, GALLETON, GOMITAS, PINATA } from './catalogo-de-prueba';
import { tambienTePuedeGustar } from './relacionados';
import { personalizar } from './rubro';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';
import type { Producto } from './tipos';

const ids = (lista: Producto[]) => lista.map((p) => p.id);
const OTRO_CHOCOLATE: Producto = { ...CHOCOLATE, id: 'choco-sol', nombre: 'Chocolate Sol', ocasiones: [] };
const config = { ...RUBRO_DE_PRUEBA, productos: [...RUBRO_DE_PRUEBA.productos, OTRO_CHOCOLATE] };

describe('tambienTePuedeGustar', () => {
  it('primero la misma categoría, luego los que comparten ocasión; nunca el mismo', () => {
    // CHOCOLATE: cumpleaños y por mayor. PINATA comparte cumpleaños pero está agotada.
    expect(ids(tambienTePuedeGustar(config, CHOCOLATE))).toEqual(['choco-sol']);
    // GOMITAS: halloween y bolsitas sorpresa → el galletón comparte bolsitas sorpresa
    expect(ids(tambienTePuedeGustar(config, GOMITAS))).toEqual([GALLETON.id]);
  });

  it('no cuenta ocasiones de una campaña que no está activa', () => {
    const halloweenSolo: Producto = { ...GALLETON, id: 'galleta-bruja', ocasiones: ['halloween'] };
    const conBruja = { ...config, productos: [...config.productos, halloweenSolo] };
    expect(ids(tambienTePuedeGustar(conBruja, GOMITAS))).toContain('galleta-bruja');
    expect(ids(tambienTePuedeGustar(personalizar(conBruja, { campana: null }), GOMITAS))).not.toContain('galleta-bruja');
  });

  it('respeta el máximo y no incluye agotados', () => {
    expect(tambienTePuedeGustar(config, CHOCOLATE, 0)).toEqual([]);
    expect(ids(tambienTePuedeGustar(config, GALLETON))).not.toContain(PINATA.id);
  });
});
