import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { MODULOS, obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { calcularTotales, CARRITO_VACIO, type Carrito as CarritoDatos } from '../carrito/carrito';
import { $carrito, agregar, cargarSugeridoEnStore, quitar } from '../carrito/store';
import { cargarSugerido, CARRITOS_SUGERIDOS, mismoContenido } from '../carrito/sugeridos';
import {
  avisoAgregar,
  avisoQuitar,
  avisoSugerido,
  preguntaQuitar,
  preguntaReemplazar,
  textoTotales,
  unirNombres,
} from '../carrito/textos';
import './Carrito.css';

/** Dónde ocurrió la última acción: la tarjeta de un módulo o el bloque del carrito sugerido. */
type Lugar = ModuloId | 'sugerido';

/** Confirmación abierta, con el carrito tal como estaba al pedirla. */
type Confirmacion =
  | { tipo: 'quitar'; id: ModuloId; afectados: ModuloId[]; carrito: CarritoDatos }
  | { tipo: 'sugerido'; carrito: CarritoDatos };

const lugarDe = (confirmacion: Confirmacion): Lugar =>
  confirmacion.tipo === 'quitar' ? confirmacion.id : 'sugerido';

const SUGERIDO = CARRITOS_SUGERIDOS.dulceria;

export default function Carrito() {
  const guardado = useStore($carrito);
  // El HTML del servidor no conoce lo guardado: hasta montar se muestra vacío para que coincidan.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const carrito = montado ? guardado : CARRITO_VACIO;

  // El aviso se ve en la tarjeta donde se actuó y se anuncia en una región solo para lectores.
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

  const pedirSugerido = () => {
    if (mismoContenido(carrito, cargarSugerido('dulceria'))) {
      setAviso({ id: 'sugerido', texto: `Ya tienes cargado el sistema para ${SUGERIDO.nombre}.` });
    } else if (carrito.items.length > 0) {
      setConfirmacion({ tipo: 'sugerido', carrito });
    } else {
      aplicarSugerido();
    }
  };

  const aplicarSugerido = () => {
    const nuevo = cargarSugeridoEnStore('dulceria');
    setAviso({ id: 'sugerido', texto: avisoSugerido(SUGERIDO.nombre, nuevo) });
    setConfirmacion(null);
    setEnfocar('sugerido');
  };

  const registrarBoton = (lugar: Lugar) => (boton: HTMLButtonElement | null) => {
    if (boton) botones.current.set(lugar, boton);
    else botones.current.delete(lugar);
  };

  const totales = textoTotales(calcularTotales(carrito));
  const cantidad = carrito.items.length;

  return (
    <div className="carrito">
      <section className="carrito-sugerido" aria-labelledby="sugerido-titulo">
        <h2 id="sugerido-titulo">¿Tienes una dulcería?</h2>
        <p>Empieza con lo que suele necesitar una dulcería: {unirNombres([...SUGERIDO.modulos])}.</p>
        {confirmacion?.tipo === 'sugerido' ? (
          <div ref={zonaConfirmacion} className="carrito-confirmar" role="group" aria-labelledby="pregunta-sugerido">
            <p id="pregunta-sugerido">{preguntaReemplazar(cantidad)}</p>
            <div className="carrito-confirmar__botones">
              <button type="button" className="carrito-boton" onClick={aplicarSugerido}>
                Sí, reemplazar
              </button>
              <button
                ref={cancelar}
                type="button"
                className="carrito-boton carrito-boton--secundario"
                onClick={() => cerrarConfirmacion('sugerido')}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button ref={registrarBoton('sugerido')} type="button" className="carrito-boton" onClick={pedirSugerido}>
            Cargar sistema para {SUGERIDO.nombre}
          </button>
        )}
        {aviso?.id === 'sugerido' && (
          <p className="carrito-modulo__aviso" aria-hidden="true">
            {aviso.texto}
          </p>
        )}
      </section>

      <ul className="carrito-modulos" role="list">
        {MODULOS.map((modulo) => {
          const elegido = carrito.items.includes(modulo.id);
          const necesita = modulo.dependencias.map((dep) => obtenerModulo(dep).nombre);
          return (
            <li key={modulo.id} className={elegido ? 'carrito-modulo carrito-modulo--elegido' : 'carrito-modulo'}>
              <h2 className="carrito-modulo__nombre">{modulo.nombre}</h2>
              {elegido && <p className="carrito-modulo__marca">✓ En tu sistema</p>}
              <p>{modulo.descripcion}</p>
              <p className="carrito-modulo__precio">{textoPrecio(modulo)}</p>
              {necesita.length > 0 && <p className="carrito-modulo__nota">Necesita: {necesita.join(', ')}</p>}
              {modulo.requiereOtroModulo && <p className="carrito-modulo__nota">Se agrega junto a otro módulo.</p>}

              {confirmacion?.tipo === 'quitar' && confirmacion.id === modulo.id ? (
                <div
                  ref={zonaConfirmacion}
                  className="carrito-confirmar"
                  role="group"
                  aria-labelledby={`pregunta-${modulo.id}`}
                >
                  <p id={`pregunta-${modulo.id}`}>{preguntaQuitar(modulo.id, confirmacion.afectados)}</p>
                  <div className="carrito-confirmar__botones">
                    <button
                      type="button"
                      className="carrito-boton"
                      onClick={() => confirmarQuitar(modulo.id, confirmacion.afectados)}
                    >
                      Sí, quitar
                    </button>
                    <button
                      ref={cancelar}
                      type="button"
                      className="carrito-boton carrito-boton--secundario"
                      onClick={() => cerrarConfirmacion(modulo.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  ref={registrarBoton(modulo.id)}
                  type="button"
                  className={elegido ? 'carrito-boton carrito-boton--secundario' : 'carrito-boton'}
                  onClick={() => alternar(modulo.id)}
                >
                  {elegido ? 'Quitar' : 'Agregar'}
                  <span className="solo-lector"> {modulo.nombre}</span>
                </button>
              )}
              {aviso?.id === modulo.id && (
                <p className="carrito-modulo__aviso" aria-hidden="true">
                  {aviso.texto}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="solo-lector" role="status">
        {aviso?.texto}
      </p>

      <section className="carrito-resumen zona-oscura" aria-label="Resumen de tu sistema">
        {cantidad === 0 ? (
          <p>Aún no elegiste módulos.</p>
        ) : (
          <dl className="carrito-resumen__totales">
            <div>
              <dt>Inversión inicial</dt>
              <dd>
                {totales.inicial}
                {totales.notaCotizar && <span className="carrito-resumen__nota"> {totales.notaCotizar}</span>}
              </dd>
            </div>
            <div>
              <dt>Mensualidad</dt>
              <dd>{totales.mensual}</dd>
            </div>
          </dl>
        )}
        <p className="carrito-resumen__referencial">
          {cantidad === 1 ? '1 módulo' : `${cantidad} módulos`} · Precios referenciales
        </p>
      </section>
    </div>
  );
}
