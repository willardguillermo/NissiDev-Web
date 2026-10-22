import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import type { ModuloId } from '../catalogo-servicios/modulos';
import { CARRITO_VACIO, type Carrito } from '../carrito/carrito';
import { $carrito, agregar, quitar } from '../carrito/store';
import { avisoAgregar, avisoQuitar } from '../carrito/textos';

// Comportamiento compartido por las islas que editan el carrito (Arma tu sistema y el mini carrito del
// Inicio): mismas reglas, confirmaciones, avisos y manejo del foco.

/** Dónde ocurrió la última acción: la tarjeta de un módulo o el bloque del carrito sugerido. */
export type Lugar = ModuloId | 'sugerido';

/** Confirmación abierta, con el carrito tal como estaba al pedirla. */
export type Confirmacion =
  | { tipo: 'quitar'; id: ModuloId; afectados: ModuloId[]; carrito: Carrito }
  | { tipo: 'sugerido'; carrito: Carrito };

const lugarDe = (confirmacion: Confirmacion): Lugar =>
  confirmacion.tipo === 'quitar' ? confirmacion.id : 'sugerido';

export function useCarritoInteractivo() {
  const guardado = useStore($carrito);
  // El HTML del servidor no conoce lo guardado: hasta montar se muestra vacío para que coincidan.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const carrito = montado ? guardado : CARRITO_VACIO;

  // El aviso se ve donde se actuó y se anuncia en una región solo para lectores.
  const [aviso, setAviso] = useState<{ id: Lugar; texto: string } | null>(null);
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);
  const botones = useRef(new Map<Lugar, HTMLButtonElement>());
  const cancelar = useRef<HTMLButtonElement>(null);
  const zonaConfirmacion = useRef<HTMLDivElement>(null);
  // Al cerrar una confirmación, el botón se vuelve a dibujar: el foco se mueve después de dibujar.
  const [enfocar, setEnfocar] = useState<Lugar | null>(null);

  useEffect(() => {
    if (confirmacion) cancelar.current?.focus();
  }, [confirmacion]);

  // Si el carrito cambia con una confirmación abierta (otro botón, otra pestaña), esa pregunta ya
  // no describe lo que pasaría: se cancela. Si el foco estaba en ella, vuelve al botón de su lugar;
  // si el cambio vino de otro botón, el foco ya está ahí y no se mueve.
  useEffect(() => {
    if (!confirmacion || confirmacion.carrito === carrito) return;
    const focoDentro = zonaConfirmacion.current?.contains(document.activeElement) ?? false;
    setConfirmacion(null);
    if (focoDentro) setEnfocar(lugarDe(confirmacion));
  }, [carrito, confirmacion]);

  useEffect(() => {
    if (!enfocar) return;
    botones.current.get(enfocar)?.focus();
    setEnfocar(null);
  }, [enfocar]);

  const alternar = (id: ModuloId) => {
    if (!carrito.items.includes(id)) {
      setAviso({ id, texto: avisoAgregar(id, agregar(id)) });
      return;
    }
    const resultado = quitar(id);
    if (resultado.estado === 'requiere-confirmacion') {
      setConfirmacion({ tipo: 'quitar', id, afectados: resultado.afectados, carrito });
      return;
    }
    setAviso({ id, texto: avisoQuitar(id, resultado) });
  };

  const confirmarQuitar = (id: ModuloId, afectadosConfirmados: ModuloId[]) => {
    const resultado = quitar(id, { afectadosConfirmados });
    if (resultado.estado === 'requiere-confirmacion') {
      // Los afectados cambiaron: se vuelve a preguntar con la lista nueva, sin quitar nada.
      setConfirmacion({ tipo: 'quitar', id, afectados: resultado.afectados, carrito });
      return;
    }
    setAviso({ id, texto: avisoQuitar(id, resultado) });
    setConfirmacion(null);
    setEnfocar(id);
  };

  const cerrarConfirmacion = (lugar: Lugar) => {
    setConfirmacion(null);
    setEnfocar(lugar);
  };

  const registrarBoton = (lugar: Lugar) => (boton: HTMLButtonElement | null) => {
    if (boton) botones.current.set(lugar, boton);
    else botones.current.delete(lugar);
  };

  return {
    carrito,
    aviso,
    setAviso,
    confirmacion,
    setConfirmacion,
    setEnfocar,
    cancelar,
    zonaConfirmacion,
    alternar,
    confirmarQuitar,
    cerrarConfirmacion,
    registrarBoton,
  };
}
