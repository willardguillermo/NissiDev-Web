import { useEffect, useId, useRef, useState } from 'react';
import { normalizarCantidad } from '../../demo/cantidad';
import { disponibleParaAgregar } from '../../demo/disponibilidad';
import type { Accion } from '../../demo/navegacion';
import { precioUnitario } from '../../demo/pedido';
import { textoDesde } from '../../demo/precios';
import { contarPresentacion } from '../../demo/presentaciones';
import { tambienTePuedeGustar } from '../../demo/relacionados';
import type { Pedido, Producto, RubroConfig } from '../../demo/tipos';
import { formatearSoles } from '../../ui/formato';
import { Ilustracion } from './Ilustracion';
import { TarjetaProducto } from './TarjetaProducto';

interface Props {
  config: RubroConfig;
  producto: Producto;
  pedido: Pedido;
  ir: (accion: Accion) => void;
  volver: () => void;
  /** Devuelve el motivo si no se pudo agregar. */
  agregar: (producto: Producto, presentacionId: string, cantidad: number) => string | null;
  agregarRapido: (producto: Producto, presentacionId: string) => void;
  ilustracionDe: (producto: Producto) => string;
}

const ETIQUETAS = { nuevo: 'Nuevo', oferta: 'Oferta', agotado: 'Agotado' } as const;

export function Detalle({ config, producto, pedido, ir, volver, agregar, agregarRapido, ilustracionDe }: Props) {
  const ids = { presentacion: useId(), cantidad: useId(), error: useId() };
  const [presentacionId, setPresentacionId] = useState(producto.presentaciones[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const zonaError = useRef<HTMLParagraphElement>(null);
  // El motivo aparece arriba del botón; si quedó fuera de la vista, se trae (sin mover el foco).
  useEffect(() => {
    if (error) zonaError.current?.scrollIntoView({ block: 'nearest' });
  }, [error]);

  const presentacion = producto.presentaciones.find((p) => p.id === presentacionId) ?? producto.presentaciones[0];
  const agotado = producto.etiqueta === 'agotado';
  // Cuántas de esta presentación caben todavía, contando lo que ya está en el pedido
  const caben = Math.floor(disponibleParaAgregar(producto, pedido) / presentacion.factor);
  // El campo puede quedar vacío mientras se escribe (NaN); los botones y el total usan esta.
  const valida = normalizarCantidad(cantidad);
  const tope = Math.max(1, caben);
  const unitario = precioUnitario({ id: '', productoId: producto.id, presentacion, cantidad: valida });
  const conPrecioMayor = config.vendePorMayor && unitario < presentacion.precio;
  const relacionados = tambienTePuedeGustar(config, producto);

  const elegir = (id: string) => {
    setPresentacionId(id);
    setCantidad(1);
    setError(null);
  };
  const cambiarCantidad = (valor: number) => {
    setCantidad(valor);
    setError(null);
  };
  const enviar = () => {
    const motivo = agregar(producto, presentacion.id, valida);
    setError(motivo);
    if (!motivo) setCantidad(1);
  };

  return (
    <article className="demo-detalle">
      <div className="demo-contenedor demo-detalle__barra">
        <button type="button" className="demo-icono" aria-label="Volver" onClick={volver}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      <div className="demo-contenedor demo-detalle__cuerpo">
        <div className="demo-detalle__imagen">
          <Ilustracion nombre={ilustracionDe(producto)} />
          {producto.etiqueta && (
            <span className={`demo-etiqueta demo-etiqueta--${producto.etiqueta}`}>{ETIQUETAS[producto.etiqueta]}</span>
          )}
        </div>

        <div className="demo-detalle__datos">
          <p className="demo-detalle__marca">{producto.marca}</p>
          <h1 className="demo-titulo demo-detalle__nombre" tabIndex={-1} data-titulo-pantalla>
            {producto.nombre}
          </h1>

          <fieldset className="demo-presentaciones" disabled={agotado}>
            <legend id={ids.presentacion}>Presentación</legend>
            {producto.presentaciones.map((p) => {
              const desde = config.vendePorMayor && p.precioMayorista ? textoDesde({ presentacion: p, precio: p.precioMayorista.precio, desde: p.precioMayorista.cantidadMinima }) : null;
              return (
                <label key={p.id} className="demo-presentacion">
                  <input type="radio" name={ids.presentacion} value={p.id} checked={p.id === presentacion.id} onChange={() => elegir(p.id)} />
                  <span className="demo-presentacion__nombre">{p.nombre}</span>
                  <strong className="demo-presentacion__precio">{formatearSoles(p.precio)}</strong>
                  {desde && p.precioMayorista && (
                    <span className="demo-presentacion__mayor">
                      Por mayor {formatearSoles(p.precioMayorista.precio)} {desde}
                    </span>
                  )}
                </label>
              );
            })}
          </fieldset>

          {agotado ? (
            <p className="demo-detalle__agotado">Agotado por ahora.</p>
          ) : (
            <>
              <div className="demo-cantidad">
                <label htmlFor={ids.cantidad}>Cantidad</label>
                <div className="demo-cantidad__control">
                  <button type="button" aria-label="Quitar uno" disabled={valida <= 1} onClick={() => cambiarCantidad(normalizarCantidad(Math.min(valida, tope) - 1))}>
                    −
                  </button>
                  <input
                    id={ids.cantidad}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={Math.max(1, caben)}
                    value={Number.isNaN(cantidad) ? '' : cantidad}
                    aria-describedby={error ? ids.error : undefined}
                    onChange={(e) => cambiarCantidad(e.target.valueAsNumber)}
                    onBlur={() => setCantidad(valida)}
                  />
                  <button type="button" aria-label="Agregar uno" disabled={valida >= caben} onClick={() => cambiarCantidad(normalizarCantidad(valida + 1, tope))}>
                    +
                  </button>
                </div>
                <p className="demo-cantidad__nota">
                  {caben > 0 ? `Puedes llevar hasta ${contarPresentacion(caben, presentacion)}.` : 'Ya tienes en tu pedido todo lo que hay.'}
                </p>
              </div>

              <p className="demo-detalle__total">
                <span>{conPrecioMayor ? 'Total con precio por mayor' : 'Total'}</span>
                <strong>{valida <= tope ? formatearSoles(unitario * valida) : '—'}</strong>
              </p>

              <p id={ids.error} ref={zonaError} className="demo-detalle__error" role="alert">
                {error}
              </p>
              <button type="button" className="demo-boton demo-detalle__agregar" onClick={enviar}>
                Agregar al pedido
              </button>
            </>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="demo-seccion demo-contenedor" aria-labelledby="demo-relacionados">
          <h2 id="demo-relacionados" className="demo-subtitulo">También te puede gustar</h2>
          <ul className="demo-grilla demo-grilla--ancha">
            {relacionados.map((p) => (
              <li key={p.id}>
                <TarjetaProducto
                  producto={p}
                  ilustracion={ilustracionDe(p)}
                  mostrar="unidad"
                  vendePorMayor={config.vendePorMayor}
                  abrir={() => ir({ tipo: 'detalle', productoId: p.id })}
                  agregar={(id) => agregarRapido(p, id)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
