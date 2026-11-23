import { MODULOS, obtenerModulo } from '../catalogo-servicios/modulos';
import { TEXTO_PAGO } from '../catalogo-servicios/pago';
import { textoPrecio } from '../catalogo-servicios/precio';
import { lanzamientoActivo, LANZAMIENTO } from '../catalogo-servicios/lanzamiento';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { SIN_VITRINA } from '../catalogo-servicios/vitrina';
import { $carrito, $vitrina, cargarSugeridoEnStore } from '../carrito/store';
import { textoTotalesSistema, totalesSistema } from '../carrito/totales';
import type { Carrito as DatosCarrito } from '../carrito/carrito';
import {
  cargarSugerido,
  CARRITOS_SUGERIDOS,
  mismoContenido,
  sinSugerido,
  sugeridoDeUrl,
  type RubroSugerido,
} from '../carrito/sugeridos';
import { avisoSugerido, preguntaQuitar, preguntaReemplazar, unirNombres } from '../carrito/textos';
import CuposLanzamiento from './CuposLanzamiento';
import { Interruptor } from './Interruptor';
import { formatearSoles } from '../ui/formato';
import { useCarritoInteractivo } from './useCarritoInteractivo';
import { useContador } from './useContador';
import VitrinaCarrito from './VitrinaCarrito';
import './Carrito.css';

const RUBROS_SUGERIDOS = Object.keys(CARRITOS_SUGERIDOS) as RubroSugerido[];
const desde = (centimos: number) => `Desde ${formatearSoles(centimos)}`;

export default function Carrito() {
  const {
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
  } = useCarritoInteractivo();

  /** Carga el sistema del rubro; si ya había otros módulos, primero pregunta (nunca reemplaza sin avisar). */
  const pedirSugerido = (rubro: RubroSugerido, actual: DatosCarrito = carrito, { enfocar = true } = {}) => {
    const lugar = `sugerido:${rubro}` as const;
    const { nombre } = CARRITOS_SUGERIDOS[rubro];
    if (mismoContenido(actual, cargarSugerido(rubro))) {
      setAviso({ id: lugar, texto: `Ya tienes cargado el sistema para ${nombre}.` });
    } else if (actual.items.length > 0) {
      setConfirmacion({ tipo: 'sugerido', rubro, carrito: actual });
    } else {
      aplicarSugerido(rubro, { enfocar });
    }
  };

  const aplicarSugerido = (rubro: RubroSugerido, { enfocar = true } = {}) => {
    const nuevo = cargarSugeridoEnStore(rubro);
    setAviso({ id: `sugerido:${rubro}`, texto: avisoSugerido(CARRITOS_SUGERIDOS[rubro].nombre, nuevo) });
    setConfirmacion(null);
    if (enfocar) setEnfocar(`sugerido:${rubro}`);
  };

  // Igual que el carrito: el HTML del servidor no conoce lo guardado, hasta montar no hay Vitrina.
  const vitrinaGuardada = useStore($vitrina);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const vitrina = montado ? vitrinaGuardada : SIN_VITRINA;

  // Enlace directo (/cotizar/?sugerido=inmobiliaria, para mandarlo por WhatsApp): carga ese sistema al abrir.
  // Se lee después de montar, con lo guardado; el parámetro se quita para que recargar no lo repita.
  useEffect(() => {
    if (!montado) return;
    const rubro = sugeridoDeUrl(window.location.search);
    if (!rubro) return;
    history.replaceState(history.state, '', sinSugerido(window.location.href));
    pedirSugerido(rubro, $carrito.get(), { enfocar: false });
    // Solo una vez, al montar (montado pasa de false a true una sola vez).
  }, [montado]);

  const calculados = totalesSistema(carrito, vitrina);
  const totales = textoTotalesSistema(calculados);
  const cantidad = carrito.items.length;
  const hayAlgo = cantidad > 0 || calculados.vitrina;
  const cifra = useContador<HTMLElement>(calculados.inicial, calculados.soloVitrina ? formatearSoles : desde);

  return (
    <div className="carrito">
      <section className="carrito-sugerido" aria-label="Sistemas sugeridos por rubro">
        <div className="carrito-sugerido__fila">
          {RUBROS_SUGERIDOS.map((rubro) =>
            confirmacion?.tipo === 'sugerido' && confirmacion.rubro === rubro ? null : (
              <button
                key={rubro}
                ref={registrarBoton(`sugerido:${rubro}`)}
                type="button"
                className="carrito-boton"
                aria-describedby={`sugerido-${rubro}`}
                onClick={() => pedirSugerido(rubro)}
              >
                Sugerido: {CARRITOS_SUGERIDOS[rubro].nombre}
              </button>
            ),
          )}
        </div>
        <ul className="carrito-sugerido__detalle" role="list">
          {RUBROS_SUGERIDOS.map((rubro) => (
            <li key={rubro} id={`sugerido-${rubro}`}>
              {CARRITOS_SUGERIDOS[rubro].nombre}: {unirNombres([...CARRITOS_SUGERIDOS[rubro].modulos])}.
            </li>
          ))}
        </ul>
        {confirmacion?.tipo === 'sugerido' && (
          <div ref={zonaConfirmacion} className="carrito-confirmar" role="group" aria-labelledby="pregunta-sugerido">
            <p id="pregunta-sugerido">
              Sistema para {CARRITOS_SUGERIDOS[confirmacion.rubro].nombre}. {preguntaReemplazar(cantidad)}
            </p>
            <div className="carrito-confirmar__botones">
              <button type="button" className="carrito-boton" onClick={() => aplicarSugerido(confirmacion.rubro)}>
                Sí, reemplazar
              </button>
              <button
                ref={cancelar}
                type="button"
                className="carrito-boton carrito-boton--secundario"
                onClick={() => cerrarConfirmacion(`sugerido:${confirmacion.rubro}`)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {aviso?.id.startsWith('sugerido:') && (
          <p className="carrito-aviso" aria-hidden="true">
            {aviso.texto}
          </p>
        )}
      </section>

      <ul className="carrito-modulos" role="list" aria-label="Módulos">
        {MODULOS.map((modulo) => {
          const elegido = carrito.items.includes(modulo.id);
          const necesita = modulo.dependencias.map((dep) => obtenerModulo(dep).nombre);
          const pendiente = confirmacion?.tipo === 'quitar' && confirmacion.id === modulo.id ? confirmacion : null;
          return (
            <li key={modulo.id} className="carrito-modulo">
              <div className="carrito-modulo__info">
                <h2 className="carrito-modulo__nombre">{modulo.nombre}</h2>
                {modulo.id === LANZAMIENTO.modulo && lanzamientoActivo() ? (
                  <CuposLanzamiento />
                ) : (
                  <p className="carrito-modulo__precio">{textoPrecio(modulo, { items: carrito.items })}</p>
                )}
                <p className="carrito-modulo__descripcion">{modulo.descripcion}</p>
                {necesita.length > 0 && <p className="carrito-modulo__nota">Necesita: {necesita.join(', ')}</p>}
                {modulo.requiereOtroModulo && <p className="carrito-modulo__nota">Se agrega junto a otro módulo.</p>}
              </div>

              {pendiente ? null : (
                <Interruptor
                  ref={registrarBoton(modulo.id)}
                  encendido={elegido}
                  etiqueta={modulo.nombre}
                  onCambiar={() => alternar(modulo.id)}
                />
              )}

              {pendiente && (
                <div
                  ref={zonaConfirmacion}
                  className="carrito-confirmar"
                  role="group"
                  aria-labelledby={`pregunta-${modulo.id}`}
                >
                  <p id={`pregunta-${modulo.id}`}>{preguntaQuitar(modulo.id, pendiente.afectados)}</p>
                  <div className="carrito-confirmar__botones">
                    <button
                      type="button"
                      className="carrito-boton"
                      onClick={() => confirmarQuitar(modulo.id, pendiente.afectados)}
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
              )}
              {aviso?.id === modulo.id && (
                <p className="carrito-aviso" aria-hidden="true">
                  {aviso.texto}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <VitrinaCarrito vitrina={vitrina} />

      <p className="solo-lector" role="status">
        {aviso?.texto}
      </p>

      <section className="carrito-resumen zona-oscura" aria-label="Resumen de tu sistema">
        {!hayAlgo ? (
          <p className="carrito-resumen__vacio">Aún no elegiste módulos.</p>
        ) : (
          <dl className="carrito-resumen__totales">
            <div className="carrito-resumen__fila">
              <dt>Inversión inicial</dt>
              <dd ref={cifra} className="carrito-resumen__inicial">
                {totales.inicial}
              </dd>
            </div>
            <div className="carrito-resumen__fila">
              <dt>Mensualidad</dt>
              <dd className="carrito-resumen__mensual">{totales.mensual}</dd>
            </div>
          </dl>
        )}
        {cantidad > 0 && totales.notaCotizar && <p className="carrito-resumen__cotizar">Incluye módulos a cotizar.</p>}
        {calculados.vitrina && <p className="carrito-resumen__cotizar">Incluye la Vitrina (precio cerrado).</p>}
        {hayAlgo && <p className="carrito-resumen__pago">{TEXTO_PAGO}</p>}
        <p className="carrito-resumen__referencial">
          {[cantidad > 0 || !calculados.vitrina ? (cantidad === 1 ? '1 módulo' : `${cantidad} módulos`) : '', calculados.vitrina ? 'Vitrina' : '']
            .filter(Boolean)
            .join(' + ')}{' '}
          · Precios referenciales; la cotización final se confirma por WhatsApp.
        </p>
        {hayAlgo && (
          <a className="carrito-resumen__cotizacion" href="/cotizacion">
            Ver mi cotización
          </a>
        )}
      </section>
    </div>
  );
}
