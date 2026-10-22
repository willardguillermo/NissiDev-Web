import { obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { formatearSoles } from '../ui/formato';
import { calcularTotales } from '../carrito/carrito';
import { preguntaQuitar, textoTotales } from '../carrito/textos';
import { Interruptor } from './Interruptor';
import { useCarritoInteractivo } from './useCarritoInteractivo';
import { useContador } from './useContador';
import './MiniCarrito.css';

// Prueba rápida del carrito en el Inicio: el MISMO store y las mismas reglas que Arma tu sistema.
const MODULOS_DEL_INICIO: ModuloId[] = ['catalogo-web', 'pedidos-whatsapp', 'panel-dueno'];
const desde = (centimos: number) => `Desde ${formatearSoles(centimos)}`;

export default function MiniCarrito() {
  const { carrito, aviso, confirmacion, cancelar, zonaConfirmacion, alternar, confirmarQuitar, cerrarConfirmacion, registrarBoton } =
    useCarritoInteractivo();

  const calculados = calcularTotales(carrito);
  const totales = textoTotales(calculados);
  const cantidad = carrito.items.length;
  const cifra = useContador<HTMLSpanElement>(calculados.inicial, desde);

  return (
    <section className="mini" aria-labelledby="mini-titulo">
      <div className="mini__cabeza">
        <h2 id="mini-titulo" className="mini__titulo">
          Arma tu sistema
        </h2>
        <span className="mini__etiqueta">en 30 segundos</span>
      </div>

      <ul className="mini__lista" role="list">
        {MODULOS_DEL_INICIO.map((id) => {
          const modulo = obtenerModulo(id);
          const elegido = carrito.items.includes(id);
          const pendiente = confirmacion?.tipo === 'quitar' && confirmacion.id === id ? confirmacion : null;
          return (
            <li key={id} className="mini__fila">
              <div className="mini__modulo">
                <p className="mini__nombre">{modulo.nombre}</p>
                <p className="mini__precio">{textoPrecio(modulo)}</p>
              </div>
              {pendiente ? (
                <div ref={zonaConfirmacion} className="mini__confirmar" role="group" aria-labelledby={`mini-pregunta-${id}`}>
                  <p id={`mini-pregunta-${id}`}>{preguntaQuitar(id, pendiente.afectados)}</p>
                  <div className="mini__botones">
                    <button type="button" className="mini__boton" onClick={() => confirmarQuitar(id, pendiente.afectados)}>
                      Sí, quitar
                    </button>
                    <button
                      ref={cancelar}
                      type="button"
                      className="mini__boton mini__boton--secundario"
                      onClick={() => cerrarConfirmacion(id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <Interruptor
                  ref={registrarBoton(id)}
                  encendido={elegido}
                  etiqueta={modulo.nombre}
                  onCambiar={() => alternar(id)}
                />
              )}
              {aviso?.id === id && (
                <p className="mini__aviso" aria-hidden="true">
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

      <div className="mini__total zona-oscura">
        <span className="mini__total-etiqueta">Inversión inicial</span>
        <span className="mini__total-valor">
          <span ref={cifra}>{cantidad === 0 ? 'Elige un módulo' : totales.inicial}</span>
          {cantidad > 0 && totales.notaCotizar && <span className="mini__total-nota">{totales.notaCotizar}</span>}
        </span>
      </div>

      <a className="mini__enlace" href="/arma-tu-sistema">
        Ver todos los módulos
      </a>
    </section>
  );
}
