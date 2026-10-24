import type { Ref } from 'react';
import { obtenerModulo } from '../../catalogo-servicios/modulos';
import { textoPrecio } from '../../catalogo-servicios/precio';
import { calcularTotales } from '../../carrito/carrito';
import { textoTotales } from '../../carrito/textos';
import { formatearFecha } from '../../cotizacion/fecha';
import type { Cotizacion } from '../../cotizacion/tipos';
import { WHATSAPP_VISIBLE, ZONA } from '../../config/contacto';

export default function PapelCotizacion({ cotizacion, refPapel }: {
  cotizacion: Cotizacion;
  refPapel?: Ref<HTMLElement>;
}) {
  const { carrito, negocio, ...emision } = cotizacion;
  const totales = textoTotales(calcularTotales(carrito));
  return (
    <article ref={refPapel} className="cotizacion__papel" aria-labelledby="cotizacion-codigo">
      <header className="cotizacion__cabeza">
        <p className="cotizacion__marca">NissiDev · Cotización referencial</p>
        <h2 id="cotizacion-codigo" className="cotizacion__codigo">
          {emision.codigo}
        </h2>
        <dl className="cotizacion__fechas">
          <div>
            <dt>Fecha</dt>
            <dd>{formatearFecha(emision.emitida)}</dd>
          </div>
          <div>
            <dt>Válida hasta</dt>
            <dd>{formatearFecha(emision.validaHasta)}</dd>
          </div>
        </dl>
      </header>

      {negocio?.trim() && <p className="cotizacion__negocio-impreso">Negocio: {negocio.trim()}</p>}
      <h3 className="cotizacion__subtitulo">Módulos</h3>
      <ul className="cotizacion__modulos" role="list">
        {carrito.items.map((id) => {
          const modulo = obtenerModulo(id);
          return (
            <li key={id} className="cotizacion__modulo">
              <span>{modulo.nombre}</span>
              <span className="cotizacion__precio">{textoPrecio(modulo)}</span>
            </li>
          );
        })}
      </ul>

      <dl className="cotizacion__totales">
        <div>
          <dt>Inversión inicial</dt>
          <dd>
            {totales.inicial}
            {totales.notaCotizar && <span className="cotizacion__nota"> {totales.notaCotizar}</span>}
          </dd>
        </div>
        <div>
          <dt>Mensualidad</dt>
          <dd>{totales.mensual}</dd>
        </div>
      </dl>

      <p className="cotizacion__referencial">Precios referenciales; la cotización final se confirma por WhatsApp.</p>
      <p className="cotizacion__documento">Cotización referencial · No es un comprobante de pago</p>
      <div className="cotizacion__barras" aria-hidden="true" />
      <p className="cotizacion__contacto">
        NissiDev · WhatsApp {WHATSAPP_VISIBLE} · {ZONA}
      </p>

    </article>
  );
}
