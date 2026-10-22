import { MODULOS, obtenerModulo } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { calcularTotales } from '../carrito/carrito';
import { cargarSugeridoEnStore } from '../carrito/store';
import { cargarSugerido, CARRITOS_SUGERIDOS, mismoContenido } from '../carrito/sugeridos';
import { avisoSugerido, preguntaQuitar, preguntaReemplazar, textoTotales, unirNombres } from '../carrito/textos';
import { Interruptor } from './Interruptor';
import { formatearSoles } from '../ui/formato';
import { useCarritoInteractivo } from './useCarritoInteractivo';
import { useContador } from './useContador';
import './Carrito.css';

const SUGERIDO = CARRITOS_SUGERIDOS.dulceria;
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

  const calculados = calcularTotales(carrito);
  const totales = textoTotales(calculados);
  const cantidad = carrito.items.length;
  const cifra = useContador<HTMLElement>(calculados.inicial, desde);

  return (
    <div className="carrito">
      <section className="carrito-sugerido" aria-label="Sistemas sugeridos por rubro">
        <div className="carrito-sugerido__fila">
          {confirmacion?.tipo === 'sugerido' ? null : (
            <button
              ref={registrarBoton('sugerido')}
              type="button"
              className="carrito-boton"
              aria-describedby="sugerido-detalle"
              onClick={pedirSugerido}
            >
              Sugerido: {SUGERIDO.nombre}
            </button>
          )}
          <span className="carrito-sugerido__pronto">Hospedaje · pronto</span>
        </div>
        <p id="sugerido-detalle" className="carrito-sugerido__detalle">
          Carga {unirNombres([...SUGERIDO.modulos])}.
        </p>
        {confirmacion?.tipo === 'sugerido' && (
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
        )}
        {aviso?.id === 'sugerido' && (
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
                <p className="carrito-modulo__precio">{textoPrecio(modulo)}</p>
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

      <p className="solo-lector" role="status">
        {aviso?.texto}
      </p>

      <section className="carrito-resumen zona-oscura" aria-label="Resumen de tu sistema">
        {cantidad === 0 ? (
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
        <p className="carrito-resumen__referencial">
          {cantidad === 1 ? '1 módulo' : `${cantidad} módulos`} · Precios referenciales; la cotización final se confirma
          por WhatsApp.
        </p>
      </section>
    </div>
  );
}
