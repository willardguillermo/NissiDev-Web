import { describe, expect, it } from 'vitest';
import { INMOBILIARIA } from '../../rubros/inmobiliaria/config';
import { consultasDeLaSemana, consultasPorInmueble, inmueblesActivos, masVistos, validarInmobiliaria } from './panel';
import type { InmobiliariaConfig } from './tipos';

// Config pequeña de prueba a partir de la real, con 3 inmuebles y consultas controladas.
const [a, b, c] = INMOBILIARIA.inmuebles;
const PRUEBA: InmobiliariaConfig = {
  ...INMOBILIARIA,
  inmuebles: [a, b, { ...c, estado: 'separado' }],
  panel: {
    hoy: '2026-11-20',
    consultas: [
      { codigo: b.codigo, fecha: '2026-11-20T09:00', canal: 'whatsapp' },
      { codigo: b.codigo, fecha: '2026-11-14T09:00', canal: 'whatsapp' }, // 6 días antes: entra
      { codigo: a.codigo, fecha: '2026-11-19T09:00', canal: 'llamada' },
      { codigo: a.codigo, fecha: '2026-11-13T23:59', canal: 'whatsapp' }, // 7 días antes: no entra
    ],
    vistas: { [a.codigo]: 10, [c.codigo]: 30 },
  },
};

describe('panel de la inmobiliaria', () => {
  it('consultas de la semana: hoy y los 6 días anteriores', () => {
    expect(consultasDeLaSemana(PRUEBA)).toHaveLength(3);
  });

  it('consultas por inmueble, de más a menos, sin los que no tienen', () => {
    expect(consultasPorInmueble(PRUEBA).map((x) => [x.inmueble.codigo, x.valor])).toEqual([
      [b.codigo, 2],
      [a.codigo, 1],
    ]);
  });

  it('más vistos, de más a menos, con máximo', () => {
    expect(masVistos(PRUEBA).map((x) => x.inmueble.codigo)).toEqual([c.codigo, a.codigo]);
    expect(masVistos(PRUEBA, 1)).toHaveLength(1);
  });

  it('activos por operación y separados', () => {
    expect(inmueblesActivos(PRUEBA)).toEqual({
      total: 3,
      venta: [a, b, c].filter((i) => i.operacion === 'venta').length,
      alquiler: [a, b, c].filter((i) => i.operacion === 'alquiler').length,
      separados: 1,
    });
  });

  it('la validación encuentra códigos repetidos, distritos y consultas que no existen', () => {
    const rota: InmobiliariaConfig = {
      ...PRUEBA,
      inmuebles: [a, { ...a, distrito: 'Ninguno' }],
      panel: { ...PRUEBA.panel, consultas: [{ codigo: 'XXX-000', fecha: '2026-11-21T10:00', canal: 'whatsapp' }] },
    };
    const errores = validarInmobiliaria(rota);
    expect(errores).toContain(`código repetido: ${a.codigo}`);
    expect(errores).toContain(`${a.codigo}: distrito "Ninguno" no existe`);
    expect(errores).toContain('consulta de un inmueble que no existe: XXX-000');
    expect(errores).toContain('consulta posterior a hoy: 2026-11-21T10:00');
  });
});
