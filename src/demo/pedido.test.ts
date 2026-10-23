import { describe, expect, it } from 'vitest';
import { CHOCOLATE, GOMITAS } from './catalogo-de-prueba';
import {
  agregarLinea,
  aUnidadBase,
  cambiarCantidad,
  cambiarPresentacion,
  eliminarLinea,
  PEDIDO_VACIO,
  precioUnitario,
  presentacionesEnPedido,
  subtotal,
  totalPedido,
  unidadesBaseDelProducto,
} from './pedido';
import type { Producto } from './tipos';

describe('aUnidadBase', () => {
  it('3 cajas × 24 = 72 unidades', () => {
    expect(aUnidadBase(3, 24)).toBe(72);
  });
});

describe('caso de conversión de la referencia', () => {
  it('72 unidades; vender 1 bolsa de 6 + 2 unidades → quedan 64', () => {
    const stock = aUnidadBase(3, 24);
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'bolsa', 1);
    pedido = agregarLinea(pedido, CHOCOLATE, 'unidad', 2);
    expect(unidadesBaseDelProducto(pedido, CHOCOLATE.id)).toBe(8);
    expect(stock - unidadesBaseDelProducto(pedido, CHOCOLATE.id)).toBe(64);
  });
});

describe('agregarLinea', () => {
  it('guarda la presentación y su factor', () => {
    const pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'caja', 2);
    expect(pedido.lineas).toEqual([
      { id: 'choco-luna:caja', productoId: 'choco-luna', presentacion: CHOCOLATE.presentaciones[2], cantidad: 2 },
    ]);
    expect(pedido.lineas[0].presentacion.factor).toBe(24);
  });

  it('suma a la línea existente si es el mismo producto y presentación', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    pedido = agregarLinea(pedido, CHOCOLATE, 'unidad', 3);
    expect(pedido.lineas).toHaveLength(1);
    expect(pedido.lineas[0].cantidad).toBe(5);
  });

  it('crea otra línea si cambia la presentación o el producto', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 1);
    pedido = agregarLinea(pedido, CHOCOLATE, 'bolsa', 1);
    pedido = agregarLinea(pedido, GOMITAS, 'unidad', 1);
    expect(pedido.lineas.map((l) => l.id)).toEqual(['choco-luna:unidad', 'choco-luna:bolsa', 'gomitas-osito:unidad']);
  });

  it('falla con una presentación que no existe o una cantidad inválida', () => {
    expect(() => agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'pallet', 1)).toThrow();
    expect(() => agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 0)).toThrow(RangeError);
    expect(() => agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 1.5)).toThrow(RangeError);
  });

  it('no modifica el pedido recibido', () => {
    const inicial = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 1);
    agregarLinea(inicial, CHOCOLATE, 'unidad', 1);
    expect(inicial.lineas[0].cantidad).toBe(1);
    expect(PEDIDO_VACIO.lineas).toEqual([]);
  });
});

describe('precios', () => {
  it('cambiar unidad / bolsa / caja recalcula el subtotal (SPEC)', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    expect(subtotal(pedido.lineas[0])).toBe(300);
    pedido = cambiarPresentacion(pedido, 'choco-luna:unidad', CHOCOLATE, 'bolsa');
    expect(subtotal(pedido.lineas[0])).toBe(1600);
    pedido = cambiarPresentacion(pedido, 'choco-luna:bolsa', CHOCOLATE, 'caja');
    expect(subtotal(pedido.lineas[0])).toBe(6000);
  });

  it('el precio por mayor se aplica desde la cantidad mínima', () => {
    const cuatro = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'bolsa', 4).lineas[0];
    const cinco = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'bolsa', 5).lineas[0];
    expect(precioUnitario(cuatro)).toBe(800);
    expect(subtotal(cuatro)).toBe(3200);
    expect(precioUnitario(cinco)).toBe(700);
    expect(subtotal(cinco)).toBe(3500);
  });

  it('sin precio por mayor, siempre el precio normal', () => {
    const linea = agregarLinea(PEDIDO_VACIO, GOMITAS, 'bolsa', 50).lineas[0];
    expect(precioUnitario(linea)).toBe(270);
  });

  it('el total suma los subtotales', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'caja', 3); // 3 × 2700 (mayor)
    pedido = agregarLinea(pedido, GOMITAS, 'unidad', 4); // 4 × 50
    expect(totalPedido(pedido)).toBe(8100 + 200);
    expect(totalPedido(PEDIDO_VACIO)).toBe(0);
  });
});

describe('la línea conserva lo pactado', () => {
  it('si después la caja trae 20 en vez de 24, la línea sigue con factor 24 y su precio', () => {
    const pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'caja', 1);
    const chocolateNuevo: Producto = {
      ...CHOCOLATE,
      presentaciones: CHOCOLATE.presentaciones.map((p) => (p.id === 'caja' ? { ...p, factor: 20, precio: 2600 } : p)),
    };
    expect(chocolateNuevo.presentaciones[2].factor).toBe(20);
    expect(pedido.lineas[0].presentacion.factor).toBe(24);
    expect(subtotal(pedido.lineas[0])).toBe(3000);
    expect(unidadesBaseDelProducto(pedido, CHOCOLATE.id)).toBe(24);
  });
});

describe('la línea guarda una copia, no una referencia al catálogo', () => {
  const chocolateEditable = (): Producto => structuredClone(CHOCOLATE);

  it('si se modifica el objeto original después de agregar, la línea no cambia', () => {
    const producto = chocolateEditable();
    const pedido = agregarLinea(PEDIDO_VACIO, producto, 'caja', 3);
    const caja = producto.presentaciones[2];
    caja.factor = 20;
    caja.precio = 2600;
    caja.precioMayorista!.precio = 1;
    caja.precioMayorista!.cantidadMinima = 1;

    const linea = pedido.lineas[0];
    expect(linea.presentacion).toEqual(CHOCOLATE.presentaciones[2]);
    expect(unidadesBaseDelProducto(pedido, producto.id)).toBe(72);
    expect(subtotal(linea)).toBe(3 * 2700);
  });

  it('lo mismo al cambiar de presentación', () => {
    const producto = chocolateEditable();
    let pedido = agregarLinea(PEDIDO_VACIO, producto, 'unidad', 2);
    pedido = cambiarPresentacion(pedido, 'choco-luna:unidad', producto, 'caja');
    producto.presentaciones[2].factor = 20;
    producto.presentaciones[2].precio = 2600;
    expect(pedido.lineas[0].presentacion.factor).toBe(24);
    expect(subtotal(pedido.lineas[0])).toBe(6000);
  });
});

describe('editar líneas', () => {
  it('cambiar presentación a una que ya está en el pedido junta las líneas', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    pedido = agregarLinea(pedido, CHOCOLATE, 'bolsa', 1);
    pedido = cambiarPresentacion(pedido, 'choco-luna:unidad', CHOCOLATE, 'bolsa');
    expect(pedido.lineas).toHaveLength(1);
    expect(pedido.lineas[0]).toMatchObject({ id: 'choco-luna:bolsa', cantidad: 3 });
  });

  it('cambiar presentación deja la línea en su lugar', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 1);
    pedido = agregarLinea(pedido, GOMITAS, 'unidad', 1);
    pedido = cambiarPresentacion(pedido, 'choco-luna:unidad', CHOCOLATE, 'caja');
    expect(pedido.lineas.map((l) => l.id)).toEqual(['choco-luna:caja', 'gomitas-osito:unidad']);
  });

  it('cambiar cantidad y eliminar', () => {
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    pedido = agregarLinea(pedido, GOMITAS, 'unidad', 1);
    pedido = cambiarCantidad(pedido, 'choco-luna:unidad', 7);
    expect(pedido.lineas[0].cantidad).toBe(7);
    pedido = eliminarLinea(pedido, 'choco-luna:unidad');
    expect(pedido.lineas.map((l) => l.id)).toEqual(['gomitas-osito:unidad']);
  });

  it('cambiar cantidad rechaza valores inválidos', () => {
    const pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    expect(() => cambiarCantidad(pedido, 'choco-luna:unidad', 0)).toThrow(RangeError);
    expect(() => cambiarCantidad(pedido, 'choco-luna:unidad', -1)).toThrow(RangeError);
  });

  it('editar una línea que no existe no cambia nada', () => {
    const pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'unidad', 2);
    expect(cambiarCantidad(pedido, 'no-existe', 3)).toBe(pedido);
    expect(eliminarLinea(pedido, 'no-existe')).toBe(pedido);
    expect(cambiarPresentacion(pedido, 'no-existe', CHOCOLATE, 'caja')).toBe(pedido);
  });
});

describe('presentacionesEnPedido', () => {
  it('suma las cantidades de todas las líneas: 2 bolsas + 3 unidades = 5', () => {
    expect(presentacionesEnPedido(PEDIDO_VACIO)).toBe(0);
    let pedido = agregarLinea(PEDIDO_VACIO, CHOCOLATE, 'bolsa', 2);
    pedido = agregarLinea(pedido, GOMITAS, 'unidad', 3);
    expect(presentacionesEnPedido(pedido)).toBe(5);
  });
});
