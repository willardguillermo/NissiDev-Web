import { useEffect, useId, useRef, useState } from 'react';
import { normalizarCantidad } from '../../demo/cantidad';
import { intentarCambiarCantidad } from '../../demo/disponibilidad';
import { faltaParaEnviar, mensajePedido, type ErrorEnvio } from '../../demo/mensaje-pedido';
import type { Accion } from '../../demo/navegacion';
import { eliminarLinea, precioUnitario, subtotal, totalPedido } from '../../demo/pedido';
import type { LineaPedido, Pedido, Producto, RubroConfig } from '../../demo/tipos';
import { formatearSoles } from '../../ui/formato';
import { Ilustracion } from './Ilustracion';

interface Props {
  config: RubroConfig;
  pedido: Pedido;
  cambiarPedido: (pedido: Pedido) => void;
  ir: (accion: Accion) => void;
  volver: () => void;
  ilustracionDe: (producto: Producto) => string;
}

export const AVISO_PEDIDO = 'Esto es una demostración: en tu sistema, este mensaje llega al WhatsApp de tu negocio.';

const TEXTO_ERROR: Record<Exclude<ErrorEnvio, 'vacio'>, string> = {
  puesto: 'Elige dónde vas a recoger tu pedido.',
  cliente: 'Escribe tu nombre para que el negocio sepa de quién es el pedido.',
};

interface LineaProps {
  linea: LineaPedido;
  producto: Producto;
  ilustracion: string;
  pedido: Pedido;
  cambiarPedido: (pedido: Pedido) => void;
}

/** Una línea: la cantidad se edita con − / + o escribiendo; si no alcanza, se dice en su presentación. */
function Linea({ linea, producto, ilustracion, pedido, cambiarPedido }: LineaProps) {
  const id = useId();
  const [borrador, setBorrador] = useState(String(linea.cantidad));
  const [mensaje, setMensaje] = useState<string | null>(null);
  useEffect(() => setBorrador(String(linea.cantidad)), [linea.cantidad]);

  // Vacío, texto, 0 o negativos → 1; el campo muestra lo que quedó (aunque la línea no cambie).
  const cambiar = (valor: number | string) => {
    const cantidad = normalizarCantidad(valor);
    const resultado = intentarCambiarCantidad(pedido, producto, linea.id, cantidad);
    setMensaje(resultado.ok ? null : resultado.mensaje);
    if (resultado.ok) cambiarPedido(resultado.pedido);
    setBorrador(String(resultado.ok ? cantidad : linea.cantidad));
  };
  const conMayor = precioUnitario(linea) < linea.presentacion.precio;

  return (
    <li className="demo-linea">
      <div className="demo-linea__imagen">
        <Ilustracion nombre={ilustracion} />
      </div>
      <div className="demo-linea__datos">
        <p className="demo-linea__nombre">{producto.nombre}</p>
        <p className="demo-linea__presentacion">
          {linea.presentacion.nombre} · {formatearSoles(precioUnitario(linea))} c/u{conMayor && ' · precio por mayor'}
        </p>
        <div className="demo-linea__fila">
          <div className="demo-cantidad__control">
            <button
              type="button"
              aria-label={`Quitar uno de ${producto.nombre}`}
              disabled={linea.cantidad <= 1}
              onClick={() => cambiar(linea.cantidad - 1)}
            >
              −
            </button>
            <label htmlFor={id} className="solo-lector">
              Cantidad de {producto.nombre} ({linea.presentacion.nombre})
            </label>
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={1}
              value={borrador}
              aria-describedby={mensaje ? `${id}-mensaje` : undefined}
              onChange={(e) => setBorrador(e.target.value)}
              onBlur={() => borrador !== String(linea.cantidad) && cambiar(borrador)}
              onKeyDown={(e) => e.key === 'Enter' && cambiar(borrador)}
            />
            <button type="button" aria-label={`Agregar uno de ${producto.nombre}`} onClick={() => cambiar(linea.cantidad + 1)}>
              +
            </button>
          </div>
          <strong className="demo-linea__subtotal">{formatearSoles(subtotal(linea))}</strong>
        </div>
        <p id={`${id}-mensaje`} className="demo-linea__mensaje" role="alert">
          {mensaje}
        </p>
        <button type="button" className="demo-enlace demo-linea__quitar" onClick={() => cambiarPedido(eliminarLinea(pedido, linea.id))}>
          Quitar<span className="solo-lector"> {producto.nombre}</span>
        </button>
      </div>
    </li>
  );
}

export function MiPedido({ config, pedido, cambiarPedido, ir, volver, ilustracionDe }: Props) {
  const ids = { cliente: useId(), puesto: useId() };
  const [errores, setErrores] = useState<ErrorEnvio[]>([]);
  const dialogo = useRef<HTMLDialogElement>(null);
  const botonEnviar = useRef<HTMLButtonElement>(null);
  const campoCliente = useRef<HTMLInputElement>(null);
  const grupoPuesto = useRef<HTMLFieldSetElement>(null);
  const cliente = pedido.cliente ?? '';
  const unaTienda = config.puestos.length === 1;
  const datos = { cliente, puesto: unaTienda ? config.puestos[0].numero : pedido.puestoRecojo };

  const enviar = () => {
    const faltan = faltaParaEnviar(config, pedido, datos);
    setErrores(faltan);
    if (faltan[0] === 'puesto') grupoPuesto.current?.querySelector('input')?.focus();
    else if (faltan[0] === 'cliente') campoCliente.current?.focus();
    else if (faltan.length === 0) dialogo.current?.showModal();
  };
  // <dialog> cierra con Esc por sí mismo; al cerrarse, el foco vuelve al botón.
  const alCerrar = () => botonEnviar.current?.focus();

  const cabecera = (
    <div className="demo-contenedor demo-pedido__cabeza">
      <button type="button" className="demo-icono" aria-label="Volver" onClick={volver}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <h1 className="demo-titulo" tabIndex={-1} data-titulo-pantalla>
        Mi pedido
      </h1>
    </div>
  );

  if (pedido.lineas.length === 0) {
    return (
      <section className="demo-pedido">
        {cabecera}
        <div className="demo-contenedor demo-vacio demo-pedido__vacio">
          <p>
            <strong>Tu pedido está vacío.</strong>
          </p>
          <p>Agrega productos desde el catálogo y aquí verás el total.</p>
          <button type="button" className="demo-boton" onClick={() => ir({ tipo: 'catalogo' })}>
            Ver catálogo
          </button>
        </div>
      </section>
    );
  }

  const productoDe = (id: string) => config.productos.find((p) => p.id === id);

  return (
    <section className="demo-pedido">
      {cabecera}
      <div className="demo-contenedor demo-pedido__cuerpo">
        <ul className="demo-lineas">
          {pedido.lineas.map((linea) => {
            const producto = productoDe(linea.productoId);
            return producto ? (
              <Linea
                key={linea.id}
                linea={linea}
                producto={producto}
                ilustracion={ilustracionDe(producto)}
                pedido={pedido}
                cambiarPedido={cambiarPedido}
              />
            ) : null;
          })}
        </ul>

        <div className="demo-pedido__cierre">
          <p className="demo-detalle__total">
            <span>Total</span>
            <strong>{formatearSoles(totalPedido(pedido))}</strong>
          </p>

          {unaTienda ? (
            <div className="demo-recojo">
              <p className="demo-recojo__titulo">Recoger en tienda</p>
              <p>
                {config.puestos[0].referencia} · {config.puestos[0].horario}
              </p>
            </div>
          ) : (
            <fieldset
              ref={grupoPuesto}
              className="demo-presentaciones"
              aria-describedby={errores.includes('puesto') ? `${ids.puesto}-error` : undefined}
            >
              <legend>¿Dónde lo recoges?</legend>
              {config.puestos.map((puesto) => (
                <label key={puesto.numero} className="demo-presentacion">
                  <input
                    type="radio"
                    name={ids.puesto}
                    checked={pedido.puestoRecojo === puesto.numero}
                    onChange={() => {
                      cambiarPedido({ ...pedido, puestoRecojo: puesto.numero });
                      setErrores(errores.filter((e) => e !== 'puesto'));
                    }}
                  />
                  <span className="demo-presentacion__nombre">{puesto.nombre}</span>
                  <span className="demo-presentacion__mayor demo-recojo__referencia">
                    {puesto.referencia} · {puesto.horario}
                  </span>
                </label>
              ))}
              {errores.includes('puesto') && (
                <p id={`${ids.puesto}-error`} className="demo-campo__error">
                  {TEXTO_ERROR.puesto}
                </p>
              )}
            </fieldset>
          )}

          <div className="demo-campo">
            <label htmlFor={ids.cliente}>Tu nombre</label>
            <input
              ref={campoCliente}
              id={ids.cliente}
              type="text"
              autoComplete="name"
              value={cliente}
              aria-invalid={errores.includes('cliente') || undefined}
              aria-describedby={errores.includes('cliente') ? `${ids.cliente}-error` : undefined}
              onChange={(e) => {
                cambiarPedido({ ...pedido, cliente: e.target.value });
                if (e.target.value.trim()) setErrores(errores.filter((x) => x !== 'cliente'));
              }}
            />
            {errores.includes('cliente') && (
              <p id={`${ids.cliente}-error`} className="demo-campo__error">
                {TEXTO_ERROR.cliente}
              </p>
            )}
          </div>

          <button ref={botonEnviar} type="button" className="demo-boton demo-detalle__agregar" onClick={enviar}>
            Enviar pedido por WhatsApp
          </button>
          <p className="demo-pedido__nota">{config.textos.notaPedido}</p>
        </div>
      </div>

      <dialog ref={dialogo} className="demo-dialogo" aria-labelledby="demo-dialogo-titulo" onClose={alCerrar}>
        <h2 id="demo-dialogo-titulo" className="demo-subtitulo">
          Así le llegaría tu pedido a {config.negocio}
        </h2>
        {/* Espacio que no se parte entre "S/" y el número, solo para mostrarlo */}
        <pre className="demo-dialogo__mensaje">{mensajePedido(config, pedido, datos).replaceAll('S/ ', 'S/\u00a0')}</pre>
        <p className="demo-dialogo__aviso">{AVISO_PEDIDO}</p>
        <div className="demo-dialogo__acciones">
          <a className="demo-boton" href="/arma-tu-sistema">
            Quiero esto para mi negocio
          </a>
          <button type="button" className="demo-boton demo-boton--claro" onClick={() => dialogo.current?.close()}>
            Cerrar
          </button>
        </div>
      </dialog>
    </section>
  );
}
