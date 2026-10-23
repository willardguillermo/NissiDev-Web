import { describe, expect, it } from 'vitest';
import {
  cobrosPorMedio,
  diasEntre,
  largoDelNombre,
  masVendidosDeLaSemana,
  porVencer,
  proporciones,
  stockBajo,
  textoFecha,
  textoVence,
  totalVenta,
  ventasDelDiaPorPuesto,
} from './panel';
import { personalizar, validarRubro } from './rubro';
import { RUBRO_DE_PRUEBA } from './rubro-de-prueba';

// Hoy: 2026-10-24. Ventas de hoy: v1 (P1, efectivo, S/ 3), v2 (P2, Yape, S/ 4.20), v3 (P3, Plin, S/ 3.60).

describe('diasEntre y totalVenta', () => {
  it('cuenta días de calendario, también cruzando mes', () => {
    expect(diasEntre('2026-10-24', '2026-10-31')).toBe(7);
    expect(diasEntre('2026-10-30', '2026-11-02')).toBe(3);
    expect(diasEntre('2026-10-24', '2026-10-20')).toBe(-4);
  });

  it('suma precio × cantidad de cada línea', () => {
    expect(totalVenta(RUBRO_DE_PRUEBA.panel.ventas[1])).toBe(420);
  });
});

describe('ventasDelDiaPorPuesto', () => {
  it('solo las de hoy, por puesto', () => {
    expect(ventasDelDiaPorPuesto(RUBRO_DE_PRUEBA)).toEqual([
      { numero: 1, nombre: 'Puesto 1', total: 300, ventas: 1 },
      { numero: 2, nombre: 'Puesto 2', total: 420, ventas: 1 },
      { numero: 3, nombre: 'Puesto 3', total: 360, ventas: 1 },
    ]);
  });

  it('con 1 puesto, todo es la tienda; con 2, el puesto 3 pasa al 1', () => {
    expect(ventasDelDiaPorPuesto(personalizar(RUBRO_DE_PRUEBA, { puestos: 1 }))).toEqual([
      { numero: 1, nombre: 'Puesto 1', total: 1080, ventas: 3 },
    ]);
    expect(ventasDelDiaPorPuesto(personalizar(RUBRO_DE_PRUEBA, { puestos: 2 })).map((p) => p.total)).toEqual([660, 420]);
  });

  it('un puesto sin ventas aparece con 0', () => {
    const sinP3 = { ...RUBRO_DE_PRUEBA, panel: { ...RUBRO_DE_PRUEBA.panel, ventas: RUBRO_DE_PRUEBA.panel.ventas.filter((v) => v.id !== 'v3') } };
    expect(ventasDelDiaPorPuesto(sinP3)[2]).toMatchObject({ total: 0, ventas: 0 });
  });
});

describe('cobrosPorMedio', () => {
  it('efectivo, Yape y Plin de hoy, en ese orden', () => {
    expect(cobrosPorMedio(RUBRO_DE_PRUEBA).map((c) => [c.nombre, c.total])).toEqual([
      ['Efectivo', 300],
      ['Yape', 420],
      ['Plin', 360],
    ]);
  });
});

describe('masVendidosDeLaSemana', () => {
  it('por monto en soles, de hoy a 6 días atrás (la venta del 17 no cuenta)', () => {
    // choco: S/ 3 + S/ 1.50 + caja S/ 30 = S/ 34.50 (27 u.); galletón: S/ 3.60 (3 u.); gomitas: bolsa S/ 2.70 (6 u.)
    expect(masVendidosDeLaSemana(RUBRO_DE_PRUEBA).map((x) => [x.producto.id, x.monto, x.unidades])).toEqual([
      ['choco-luna', 3450, 27],
      ['galleton-avena', 360, 3],
      ['gomitas-osito', 270, 6],
    ]);
    expect(masVendidosDeLaSemana(RUBRO_DE_PRUEBA, 1)).toHaveLength(1);
  });

  it('una caja de muchas unidades baratas no gana a lo que deja más plata', () => {
    const linea = (productoId: string, factor: number, cantidad: number, precio: number) => ({ productoId, presentacionId: 'x', factor, cantidad, precio });
    const config = {
      ...RUBRO_DE_PRUEBA,
      panel: {
        ...RUBRO_DE_PRUEBA.panel,
        ventas: [
          // Gomitas: 1 caja de 100 por S/ 10. Galletón: 5 unidades por S/ 25 en total.
          { id: 'a', fecha: '2026-10-24T10:00', puesto: 1, medio: 'efectivo' as const, lineas: [linea('gomitas-osito', 100, 1, 1000)] },
          { id: 'b', fecha: '2026-10-23T10:00', puesto: 1, medio: 'yape' as const, lineas: [linea('galleton-avena', 1, 5, 500)] },
        ],
      },
    };
    expect(masVendidosDeLaSemana(config).map((x) => [x.producto.id, x.monto, x.unidades])).toEqual([
      ['galleton-avena', 2500, 5],
      ['gomitas-osito', 1000, 100],
    ]);
  });

  it('con el mismo monto, primero el de más unidades', () => {
    const config = {
      ...RUBRO_DE_PRUEBA,
      panel: {
        ...RUBRO_DE_PRUEBA.panel,
        ventas: [
          { id: 'a', fecha: '2026-10-24T10:00', puesto: 1, medio: 'efectivo' as const, lineas: [{ productoId: 'choco-luna', presentacionId: 'unidad', factor: 1, cantidad: 2, precio: 150 }] },
          { id: 'b', fecha: '2026-10-24T11:00', puesto: 1, medio: 'efectivo' as const, lineas: [{ productoId: 'galleton-avena', presentacionId: 'unidad', factor: 1, cantidad: 3, precio: 100 }] },
        ],
      },
    };
    expect(masVendidosDeLaSemana(config).map((x) => x.producto.id)).toEqual(['galleton-avena', 'choco-luna']);
  });
});

describe('porVencer', () => {
  it('de hoy a 7 días, el más próximo primero; sin vencidos ni lejanos', () => {
    const [choco, gomitas, galleton, pinata] = RUBRO_DE_PRUEBA.productos;
    const config = {
      ...RUBRO_DE_PRUEBA,
      productos: [
        { ...choco, vence: '2026-10-31' }, // 7 días
        { ...gomitas, vence: '2026-10-24' }, // hoy
        { ...galleton, vence: '2026-10-23' }, // ya venció
        { ...pinata, vence: '2026-11-01' }, // 8 días
      ],
    };
    expect(porVencer(config).map((x) => [x.producto.id, x.faltan])).toEqual([
      ['gomitas-osito', 0],
      ['choco-luna', 7],
    ]);
  });
});

describe('stockBajo', () => {
  it('en el umbral o por debajo, incluidos los agotados, el más bajo primero', () => {
    // stocks: choco 72, gomitas 8, galletón 40, piñata 0; umbral 10
    expect(stockBajo(RUBRO_DE_PRUEBA).map((p) => p.id)).toEqual(['pinata-estrella', 'gomitas-osito']);
  });
});

describe('integridad de las ventas', () => {
  it('la configuración de prueba es válida', () => {
    expect(validarRubro(RUBRO_DE_PRUEBA)).toEqual([]);
  });

  it('detecta factor distinto, puesto inexistente y fecha posterior a hoy', () => {
    const [v1] = RUBRO_DE_PRUEBA.panel.ventas;
    const rota = { ...v1, id: 'rota', puesto: 9, fecha: '2026-10-25T09:00', lineas: [{ ...v1.lineas[0], factor: 6 }] };
    const errores = validarRubro({ ...RUBRO_DE_PRUEBA, panel: { ...RUBRO_DE_PRUEBA.panel, ventas: [rota] } }).join('\n');
    expect(errores).toMatch('venta rota: puesto 9 no existe');
    expect(errores).toMatch('venta rota: fecha posterior a hoy');
    expect(errores).toMatch('venta rota: choco-luna: factor 6 no coincide');
  });
});

describe('textos y barras del panel', () => {
  it('fecha larga en español, sin depender de la zona horaria', () => {
    expect(textoFecha('2026-10-24')).toMatch(/s[áa]bado,? 24 de octubre/);
  });

  it('vence hoy, mañana o en N días', () => {
    expect([0, 1, 5].map(textoVence)).toEqual(['Vence hoy', 'Vence mañana', 'Vence en 5 días']);
  });

  it('proporciones respecto al mayor; todo en 0 no divide entre 0', () => {
    expect(proporciones([50, 100, 0])).toEqual([0.5, 1, 0]);
    expect(proporciones([0, 0])).toEqual([0, 0]);
    expect(proporciones([])).toEqual([]);
  });
});

describe('largoDelNombre', () => {
  it('corto hasta 24 letras, largo hasta 48, muy largo después', () => {
    expect(largoDelNombre('Dulcería La Golosa')).toBe('corto');
    expect(largoDelNombre('x'.repeat(24))).toBe('corto');
    expect(largoDelNombre('x'.repeat(25))).toBe('largo');
    expect(largoDelNombre('x'.repeat(48))).toBe('largo');
    expect(largoDelNombre('Distribuidora de Dulces y Artículos para Fiestas Santa Rosa de Lima E.I.R.L.')).toBe('muy-largo');
  });

  it('no cuenta los espacios de los bordes', () => {
    expect(largoDelNombre(`  ${'x'.repeat(24)}  `)).toBe('corto');
  });
});
