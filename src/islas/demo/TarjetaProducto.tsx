import { precioPorMayor, precioUnidad, textoDesde, type PrecioVisible } from '../../demo/precios';
import type { Etiqueta, Producto } from '../../demo/tipos';
import { formatearSoles } from '../../ui/formato';
import { Ilustracion } from './Ilustracion';

export type PrecioAMostrar = 'ambos' | 'unidad' | 'mayor';

interface Props {
  producto: Producto;
  ilustracion: string;
  mostrar: PrecioAMostrar;
  vendePorMayor: boolean;
  abrir: () => void;
  agregar: (presentacionId: string) => void;
  /** Nivel del título: h3 en el Inicio (dentro de una sección), h2 en el catálogo. */
  nivel?: 'h2' | 'h3';
}

const ETIQUETAS: Record<Etiqueta, string> = { nuevo: 'Nuevo', oferta: 'Oferta', agotado: 'Agotado' };

function Precio({ precio, nota }: { precio: PrecioVisible; nota?: string }) {
  const desde = textoDesde(precio);
  return (
    <p className="tarjeta-producto__precio">
      <span className="tarjeta-producto__presentacion">{nota ?? precio.presentacion.nombre}</span>
      <strong>{formatearSoles(precio.precio)}</strong>
      {desde && <span className="tarjeta-producto__desde">{desde}</span>}
    </p>
  );
}

/** Tarjeta de producto: tocarla abre el detalle; el botón agrega una presentación al pedido. */
export function TarjetaProducto({ producto, ilustracion, mostrar, vendePorMayor, abrir, agregar, nivel = 'h3' }: Props) {
  const unidad = precioUnidad(producto);
  const mayor = vendePorMayor ? precioPorMayor(producto) : null;
  const principal = mostrar === 'mayor' && mayor ? mayor : unidad;
  const agotado = producto.etiqueta === 'agotado';
  const Titulo = nivel;

  return (
    <article className="tarjeta-producto" data-agotado={agotado || undefined}>
      <div className="tarjeta-producto__imagen">
        <Ilustracion nombre={ilustracion} />
        {producto.etiqueta && (
          <span className={`demo-etiqueta demo-etiqueta--${producto.etiqueta}`}>{ETIQUETAS[producto.etiqueta]}</span>
        )}
      </div>
      <Titulo className="tarjeta-producto__nombre">
        <button type="button" className="tarjeta-producto__abrir" title={producto.nombre} onClick={abrir}>
          {producto.nombre}
        </button>
      </Titulo>
      <p className="tarjeta-producto__marca">{producto.marca}</p>

      {mostrar === 'ambos' ? (
        <>
          <Precio precio={unidad} />
          {mayor && <Precio precio={mayor} nota={`Por mayor · ${mayor.presentacion.nombre}`} />}
        </>
      ) : (
        <Precio precio={principal} nota={mostrar === 'mayor' && !mayor ? 'Solo por unidad' : undefined} />
      )}

      <button
        type="button"
        className="demo-boton demo-boton--chico tarjeta-producto__agregar"
        disabled={agotado}
        onClick={() => agregar(principal.presentacion.id)}
        aria-label={agotado ? `${producto.nombre}: agotado` : `Agregar 1 ${principal.presentacion.nombre} de ${producto.nombre} al pedido`}
      >
        {agotado ? 'Agotado' : 'Agregar'}
      </button>
    </article>
  );
}
