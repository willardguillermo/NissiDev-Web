import { textoPrecio } from '../../demo/inmuebles/precio';
import type { Inmueble } from '../../demo/inmuebles/tipos';
import { Escena } from './Escena';
import { Datos } from './Datos';

export const OPERACION = { venta: 'Venta', alquiler: 'Alquiler' } as const;

/** Tarjeta del catálogo: todo el cuadro abre la ficha (un solo botón, el del título). */
export function TarjetaInmueble({ inmueble, tipoCambio, abrir }: { inmueble: Inmueble; tipoCambio: number; abrir: () => void }) {
  const precio = textoPrecio(inmueble, tipoCambio);
  return (
    <article className="inmo-tarjeta">
      <div className="inmo-tarjeta__imagen">
        <Escena escena={inmueble.galeria[0]} color={inmueble.color} />
        <span className="inmo-etiqueta">{OPERACION[inmueble.operacion]}</span>
        {inmueble.estado === 'separado' && <span className="inmo-etiqueta inmo-etiqueta--separado">Separado</span>}
      </div>
      <div className="inmo-tarjeta__cuerpo">
        <p className="inmo-tarjeta__precio">
          <strong>
            {precio.principal}
            {precio.sufijo}
          </strong>
          <span>{precio.equivalente}</span>
        </p>
        <h2 className="inmo-tarjeta__titulo">
          <button type="button" className="inmo-tarjeta__abrir" onClick={abrir} data-abrir={inmueble.codigo}>
            {inmueble.titulo}
          </button>
        </h2>
        <p className="inmo-tarjeta__lugar">
          {inmueble.distrito} · <span className="inmo-codigo">{inmueble.codigo}</span>
        </p>
        <Datos inmueble={inmueble} corto />
      </div>
    </article>
  );
}
