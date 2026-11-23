import { describe, expect, it } from 'vitest';
import { filtrarInmuebles, OPCIONES_DORMITORIOS, RANGOS_PRECIO } from '../../demo/inmuebles/filtros';
import { validarInmobiliaria } from '../../demo/inmuebles/panel';
import { INMOBILIARIA } from './config';

describe('datos de la inmobiliaria de ejemplo', () => {
  it('pasan la validación', () => {
    expect(validarInmobiliaria(INMOBILIARIA)).toEqual([]);
  });

  it('cada filtro tiene al menos un inmueble (ningún chip lleva a una lista vacía por sí solo)', () => {
    const { inmuebles, tipoCambio, distritos } = INMOBILIARIA;
    for (const distrito of distritos) expect(filtrarInmuebles(inmuebles, { distrito }, tipoCambio).length).toBeGreaterThan(0);
    for (const dormitorios of OPCIONES_DORMITORIOS) expect(filtrarInmuebles(inmuebles, { dormitorios }, tipoCambio).length).toBeGreaterThan(0);
    for (const [operacion, rangos] of Object.entries(RANGOS_PRECIO) as [keyof typeof RANGOS_PRECIO, (typeof RANGOS_PRECIO)['venta']][]) {
      for (const r of rangos) {
        expect(filtrarInmuebles(inmuebles, { operacion, precio: r.id }, tipoCambio).length, `${operacion} ${r.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('el registro MVCS es de ejemplo (ceros)', () => {
    expect(INMOBILIARIA.agente.registroMvcs).toMatch(/0000/);
  });
});
