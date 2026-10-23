import { describe, expect, it } from 'vitest';
import { cobrosPorMedio, diasEntre, masVendidosDeLaSemana, porVencer, stockBajo, totalVenta, ventasDelDiaPorPuesto } from './panel';
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
  it('en unidad base, de hoy a 6 días atrás (la venta del 17 no cuenta)', () => {
    // choco: 2 + 1 + caja de 24 = 27; gomitas: bolsa de 6 = 6; galletón: 3
    expect(masVendidosDeLaSemana(RUBRO_DE_PRUEBA).map((x) => [x.producto.id, x.unidades])).toEqual([
      ['choco-luna', 27],
      ['gomitas-osito', 6],
      ['galleton-avena', 3],
    ]);
    expect(masVendidosDeLaSemana(RUBRO_DE_PRUEBA, 1)).toHaveLength(1);
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
