import { describe, expect, it } from 'vitest';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';
import { campanaActiva, ocasionesVisibles, personalizar, validarRubro } from './rubro';
import type { RubroConfig } from './tipos';

const ids = (lista: { id: string }[]) => lista.map((x) => x.id);
const producto = (config: RubroConfig, id: string) => config.productos.find((p) => p.id === id)!;

describe('validarRubro', () => {
  it('la configuración de prueba es válida', () => {
    expect(validarRubro(RUBRO_DE_PRUEBA)).toEqual([]);
  });

  it('detecta referencias rotas, factores y precios inválidos', () => {
    const [choco, ...resto] = RUBRO_DE_PRUEBA.productos;
    const roto: RubroConfig = {
      ...RUBRO_DE_PRUEBA,
      masVendidos: ['no-existe'],
      productos: [
        {
          ...choco,
          categoria: 'helados',
          puestos: [4],
          presentaciones: [
            { id: 'unidad', nombre: 'Unidad', factor: 1, precio: 100 },
            { id: 'caja', nombre: 'Caja x10', factor: 10, precio: 1500, precioMayorista: { cantidadMinima: 1, precio: 1600 } },
          ],
        },
        ...resto,
      ],
    };
    const errores = validarRubro(roto).join('\n');
    expect(errores).toMatch('categoría "helados" no existe');
    expect(errores).toMatch('puesto 4 no existe');
    expect(errores).toMatch('caja: sale más caro por unidad');
    expect(errores).toMatch('caja: cantidad mínima inválida');
    expect(errores).toMatch('caja: el precio por mayor debe ser menor');
    expect(errores).toMatch('más vendido "no-existe" no existe');
  });

  it('agotado va siempre con stock 0', () => {
    const [choco, ...resto] = RUBRO_DE_PRUEBA.productos;
    const config = { ...RUBRO_DE_PRUEBA, productos: [{ ...choco, stock: 0, etiqueta: undefined }, ...resto] };
    expect(validarRubro(config).join()).toMatch('"agotado" y stock 0 deben ir juntos');
  });
});

describe('personalizar: puestos', () => {
  it.each([1, 2, 3])('con %i puesto(s) la configuración sigue siendo válida', (puestos) => {
    const config = personalizar(RUBRO_DE_PRUEBA, { puestos });
    expect(config.puestos.map((p) => p.numero)).toEqual([1, 2, 3].slice(0, puestos));
    expect(validarRubro(config)).toEqual([]);
  });

  it('los productos de los puestos que sobran pasan a los que quedan, sin repetirse', () => {
    expect(producto(personalizar(RUBRO_DE_PRUEBA, { puestos: 2 }), 'galleton-avena').puestos).toEqual([1]);
    expect(producto(personalizar(RUBRO_DE_PRUEBA, { puestos: 1 }), 'choco-luna').puestos).toEqual([1]);
  });

  it('rechaza 0 o más de 3 puestos', () => {
    expect(() => personalizar(RUBRO_DE_PRUEBA, { puestos: 0 })).toThrow(RangeError);
    expect(() => personalizar(RUBRO_DE_PRUEBA, { puestos: 4 })).toThrow(RangeError);
  });

  it('no modifica la configuración original', () => {
    personalizar(RUBRO_DE_PRUEBA, { puestos: 1, porMayor: false });
    expect(RUBRO_DE_PRUEBA.puestos).toHaveLength(3);
    expect(producto(RUBRO_DE_PRUEBA, 'galleton-avena').puestos).toEqual([3]);
    expect(producto(RUBRO_DE_PRUEBA, 'choco-luna').presentaciones[1].precioMayorista).toBeDefined();
  });
});

describe('personalizar: campaña y por mayor', () => {
  it('con la campaña "ninguna" no hay hero de temporada ni ocasión de campaña', () => {
    const config = personalizar(RUBRO_DE_PRUEBA, { campana: null });
    expect(campanaActiva(config)).toBeNull();
    expect(ids(ocasionesVisibles(config))).toEqual(['cumpleanos', 'bolsitas-sorpresa', 'por-mayor']);
    expect(validarRubro(config)).toEqual([]);
  });

  it('con una campaña activa se ve su ocasión', () => {
    expect(campanaActiva(RUBRO_DE_PRUEBA)?.id).toBe('halloween');
    expect(ids(ocasionesVisibles(RUBRO_DE_PRUEBA))).toContain('halloween');
  });

  it('sin venta por mayor: sin la ocasión "Por mayor" ni precios por mayor', () => {
    const config = personalizar(RUBRO_DE_PRUEBA, { porMayor: false });
    expect(ids(ocasionesVisibles(config))).not.toContain('por-mayor');
    expect(config.productos.flatMap((p) => p.presentaciones).some((x) => x.precioMayorista)).toBe(false);
    expect(validarRubro(config)).toEqual([]);
  });
});
