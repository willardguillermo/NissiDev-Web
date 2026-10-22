import { persistentAtom, setPersistentEngine, windowPersistentEvents } from '@nanostores/persistent';
import type { ModuloId } from '../catalogo-servicios/modulos';
import { agregarModulo, CARRITO_VACIO, quitarModulo, type Carrito } from './carrito';
import { crearAlmacenamientoSeguro } from './almacenamiento';
import { restaurarCarrito, serializarCarrito } from './restaurar';
import { cargarSugerido, type RubroSugerido } from './sugeridos';

// En el navegador, todo acceso a localStorage pasa por try/catch (ver almacenamiento.ts).
// Debe configurarse antes de crear el store, porque el store lee lo guardado al crearse.
if (typeof window !== 'undefined') {
  setPersistentEngine(
    crearAlmacenamientoSeguro(() => window.localStorage),
    windowPersistentEvents,
  );
}

/** Carrito compartido entre islas y páginas. Lo leído siempre pasa por restaurarCarrito. */
export const $carrito = persistentAtom<Carrito>('nissidev:carrito', CARRITO_VACIO, {
  encode: serializarCarrito,
  decode: restaurarCarrito,
});

export function agregar(id: ModuloId) {
  const resultado = agregarModulo($carrito.get(), id);
  $carrito.set(resultado.carrito);
  return resultado;
}

export function quitar(id: ModuloId, opciones?: { confirmado?: boolean }) {
  const resultado = quitarModulo($carrito.get(), id, opciones);
  $carrito.set(resultado.carrito);
  return resultado;
}

export function cargarSugeridoEnStore(rubro: RubroSugerido) {
  const carrito = cargarSugerido(rubro);
  $carrito.set(carrito);
  return carrito;
}
