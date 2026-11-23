import { persistentAtom, setPersistentEngine, windowPersistentEvents } from '@nanostores/persistent';
import type { ModuloId } from '../catalogo-servicios/modulos';
import { normalizarVitrina, restaurarVitrina, SIN_VITRINA, type SeleccionVitrina } from '../catalogo-servicios/vitrina';
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

export function quitar(id: ModuloId, opciones?: { afectadosConfirmados?: readonly ModuloId[] }) {
  const resultado = quitarModulo($carrito.get(), id, opciones);
  if (resultado.estado === 'quitado') $carrito.set(resultado.carrito);
  return resultado;
}

export function cargarSugeridoEnStore(rubro: RubroSugerido) {
  const carrito = cargarSugerido(rubro);
  $carrito.set(carrito);
  return carrito;
}

/** Paquete Vitrina: aparte del carrito de módulos, con su propia clave guardada. */
export const $vitrina = persistentAtom<SeleccionVitrina>('nissidev:vitrina', SIN_VITRINA, {
  encode: (seleccion) => JSON.stringify(normalizarVitrina(seleccion)),
  decode: restaurarVitrina,
});

export function cambiarVitrina(cambios: Partial<SeleccionVitrina>) {
  $vitrina.set(normalizarVitrina({ ...$vitrina.get(), ...cambios }));
}
