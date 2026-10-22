import { describe, expect, it } from 'vitest';
import { CHOCOLATE, GOMITAS, PINATA } from './catalogo-de-prueba';
import {
  disponibleParaAgregar,
  intentarAgregar,
  intentarCambiarCantidad,
  intentarCambiarPresentacion,
  type ResultadoPedido,
} from './disponibilidad';
import { eliminarLinea, PEDIDO_VACIO } from './pedido';
import type { Pedido } from './tipos';

// GOMITAS tiene 8 unidades: unidad (factor 1) y bolsa x6 (factor 6).

function exigirOk(resultado: ResultadoPedido): Pedido {
  if (!resultado.ok) throw new Error(`se esperaba ok, llegó: ${resultado.mensaje}`);
  return resultado.pedido;
}

describe('cantidades inválidas', () => {
  it.each([0, -1, 1.5, Number.NaN])('%s se rechaza sin cambiar el pedido', (cantidad) => {
    const r = intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', cantidad);
    expect(r).toMatchObject({ ok: false, motivo: 'cantidad-invalida', pedido: PEDIDO_VACIO });
    if (!r.ok) expect(r.mensaje).toBe('Elige una cantidad de 1 o más.');
  });
});

describe('exceso acumulado entre presentaciones', () => {
  it('8 disponibles: bolsa de 6 + 3 sueltas falla', () => {
    const conBolsa = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'bolsa', 1));
    const r = intentarAgregar(conBolsa, GOMITAS, 'unidad', 3);
    expect(r).toMatchObject({ ok: false, motivo: 'excede-disponible', pedido: conBolsa });
    if (!r.ok) {
      expect(r.mensaje).toBe('Solo hay 8 unidades de Gomitas Osito y tu pedido llegaría a 9. Puedes agregar hasta 2 unidades más.');
    }
  });

  it('8 disponibles: bolsa de 6 + 2 sueltas pasa', () => {
    const conBolsa = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'bolsa', 1));
    const pedido = exigirOk(intentarAgregar(conBolsa, GOMITAS, 'unidad', 2));
    expect(pedido.lineas.map((l) => [l.id, l.cantidad])).toEqual([
      ['gomitas-osito:bolsa', 1],
      ['gomitas-osito:unidad', 2],
    ]);
  });

  it('agregar de nuevo a la misma línea también cuenta lo que ya había', () => {
    const cinco = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 5));
    expect(intentarAgregar(cinco, GOMITAS, 'unidad', 4).ok).toBe(false);
    expect(intentarAgregar(cinco, GOMITAS, 'unidad', 3).ok).toBe(true);
  });

  it('una sola presentación que ya excede el stock falla (2 bolsas de 6 = 12 > 8)', () => {
    expect(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'bolsa', 2)).toMatchObject({ ok: false, motivo: 'excede-disponible' });
  });
});

describe('agotado', () => {
  it('un producto sin stock no se puede agregar', () => {
    const r = intentarAgregar(PEDIDO_VACIO, PINATA, 'unidad', 1);
    expect(r).toMatchObject({ ok: false, motivo: 'agotado' });
    if (!r.ok) expect(r.mensaje).toBe('Piñata Estrella está agotado.');
  });

  it('la etiqueta "agotado" manda aunque quede stock', () => {
    const r = intentarAgregar(PEDIDO_VACIO, { ...GOMITAS, etiqueta: 'agotado' }, 'unidad', 1);
    expect(r).toMatchObject({ ok: false, motivo: 'agotado' });
  });
});

describe('editar líneas', () => {
  it('subir la cantidad por encima de lo disponible falla', () => {
    const pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 2));
    const r = intentarCambiarCantidad(pedido, GOMITAS, 'gomitas-osito:unidad', 9);
    expect(r).toMatchObject({ ok: false, motivo: 'excede-disponible', pedido });
    if (!r.ok) {
      expect(r.mensaje).toBe('Solo hay 8 unidades de Gomitas Osito y tu pedido llegaría a 9. En esta línea caben hasta 8 unidades.');
    }
    expect(exigirOk(intentarCambiarCantidad(pedido, GOMITAS, 'gomitas-osito:unidad', 8)).lineas[0].cantidad).toBe(8);
  });

  it('al editar una línea, su cantidad anterior no se cuenta dos veces', () => {
    const pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 7));
    expect(intentarCambiarCantidad(pedido, GOMITAS, 'gomitas-osito:unidad', 8).ok).toBe(true);
  });

  it('cambiar a una presentación más grande que no alcanza falla', () => {
    const pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 2));
    expect(intentarCambiarPresentacion(pedido, GOMITAS, 'gomitas-osito:unidad', 'bolsa')).toMatchObject({
      ok: false,
      motivo: 'excede-disponible',
    });
    const una = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 1));
    expect(intentarCambiarPresentacion(una, GOMITAS, 'gomitas-osito:unidad', 'bolsa').ok).toBe(true);
  });

  it('cambiar cantidad a un valor inválido falla', () => {
    const pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 2));
    expect(intentarCambiarCantidad(pedido, GOMITAS, 'gomitas-osito:unidad', 0)).toMatchObject({
      ok: false,
      motivo: 'cantidad-invalida',
    });
  });

  it('reducir una línea libera disponibilidad para otra', () => {
    let pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'unidad', 8));
    expect(intentarAgregar(pedido, GOMITAS, 'bolsa', 1).ok).toBe(false);
    pedido = exigirOk(intentarCambiarCantidad(pedido, GOMITAS, 'gomitas-osito:unidad', 2));
    expect(intentarAgregar(pedido, GOMITAS, 'bolsa', 1).ok).toBe(true);
  });

  it('eliminar una línea libera disponibilidad', () => {
    let pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'bolsa', 1));
    expect(intentarAgregar(pedido, GOMITAS, 'unidad', 3).ok).toBe(false);
    pedido = eliminarLinea(pedido, 'gomitas-osito:bolsa');
    expect(intentarAgregar(pedido, GOMITAS, 'unidad', 3).ok).toBe(true);
  });
});

describe('disponibleParaAgregar', () => {
  it('stock menos lo que ya está en el pedido, en unidad base', () => {
    const pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, GOMITAS, 'bolsa', 1));
    expect(disponibleParaAgregar(GOMITAS, PEDIDO_VACIO)).toBe(8);
    expect(disponibleParaAgregar(GOMITAS, pedido)).toBe(2);
    expect(disponibleParaAgregar(PINATA, PEDIDO_VACIO)).toBe(0);
  });
});

describe('el pedido no descuenta stock', () => {
  it('el producto queda igual después de cualquier operación', () => {
    const antes = structuredClone(CHOCOLATE);
    let pedido = exigirOk(intentarAgregar(PEDIDO_VACIO, CHOCOLATE, 'caja', 2));
    pedido = exigirOk(intentarCambiarCantidad(pedido, CHOCOLATE, 'choco-luna:caja', 3));
    pedido = exigirOk(intentarCambiarPresentacion(pedido, CHOCOLATE, 'choco-luna:caja', 'bolsa'));
    intentarAgregar(pedido, CHOCOLATE, 'caja', 99);
    expect(CHOCOLATE).toEqual(antes);
    expect(CHOCOLATE.stock).toBe(72);
  });
});
