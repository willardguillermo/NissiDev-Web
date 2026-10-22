import { describe, expect, it } from 'vitest';
import { crearAlmacenamientoSeguro } from './almacenamiento';

function storageEnMemoria(): Storage {
  const datos = new Map<string, string>();
  return {
    get length() {
      return datos.size;
    },
    clear: () => datos.clear(),
    getItem: (clave) => datos.get(clave) ?? null,
    key: (i) => [...datos.keys()][i] ?? null,
    removeItem: (clave) => void datos.delete(clave),
    setItem: (clave, valor) => void datos.set(clave, valor),
  };
}

const bloqueado = (): Storage => {
  throw new DOMException('Acceso denegado', 'SecurityError');
};

describe('crearAlmacenamientoSeguro', () => {
  it('lee y escribe en el localStorage real cuando funciona', () => {
    const storage = storageEnMemoria();
    const motor = crearAlmacenamientoSeguro(() => storage);
    motor.carrito = '{"items":[]}';
    expect(storage.getItem('carrito')).toBe('{"items":[]}');
    expect(motor.carrito).toBe('{"items":[]}');
    expect('carrito' in motor).toBe(true);
    delete motor.carrito;
    expect(storage.getItem('carrito')).toBeNull();
    expect('carrito' in motor).toBe(false);
  });

  it('refleja cambios hechos en otra pestaña', () => {
    const storage = storageEnMemoria();
    const motor = crearAlmacenamientoSeguro(() => storage);
    motor.carrito = 'a';
    storage.removeItem('carrito');
    expect(motor.carrito).toBeUndefined();
  });

  it('si el acceso a localStorage está bloqueado, guarda en memoria sin lanzar', () => {
    const motor = crearAlmacenamientoSeguro(bloqueado);
    expect(motor.carrito).toBeUndefined();
    expect(() => {
      motor.carrito = 'a';
    }).not.toThrow();
    expect(motor.carrito).toBe('a');
    expect(() => delete motor.carrito).not.toThrow();
    expect(motor.carrito).toBeUndefined();
  });

  it('si la escritura falla (cuota llena), no lanza y conserva el valor en memoria para el resto de la visita', () => {
    const storage = storageEnMemoria();
    storage.setItem = () => {
      throw new DOMException('Cuota llena', 'QuotaExceededError');
    };
    const motor = crearAlmacenamientoSeguro(() => storage);
    expect(() => {
      motor.carrito = 'a';
    }).not.toThrow();
    // Si se leyera el storage real (vacío), al volver con "atrás" el carrito se vaciaría.
    expect(motor.carrito).toBe('a');
    expect('carrito' in motor).toBe(true);
  });

  it('cuando la escritura vuelve a funcionar, manda otra vez el storage real', () => {
    const storage = storageEnMemoria();
    const setItemReal = storage.setItem;
    storage.setItem = () => {
      throw new DOMException('Cuota llena', 'QuotaExceededError');
    };
    const motor = crearAlmacenamientoSeguro(() => storage);
    motor.carrito = 'a';
    storage.setItem = setItemReal;
    motor.carrito = 'b';
    expect(storage.getItem('carrito')).toBe('b');
    storage.removeItem('carrito');
    expect(motor.carrito).toBeUndefined();
  });
});
