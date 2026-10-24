import { useStore } from '@nanostores/react';
import { useEffect, useId, useState } from 'react';
import { obtenerModulo } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { calcularTotales } from '../carrito/carrito';
import { $carrito } from '../carrito/store';
import { textoTotales } from '../carrito/textos';
import { crearCotizacion } from '../cotizacion/cotizacion';
import { fechaLocalDeHoy, formatearFecha } from '../cotizacion/fecha';
import { WHATSAPP_VISIBLE, ZONA } from '../config/contacto';
import { enlaceWhatsApp, mensajeWhatsApp } from '../cotizacion/mensajeWhatsApp';
import type { Cotizacion as DatosCotizacion } from '../cotizacion/tipos';
import './Cotizacion.css';

const REFERENCIAL = 'Precios referenciales; la cotización final se confirma por WhatsApp.';

export default function Cotizacion() {
  const carrito = useStore($carrito);
  // Código y fecha se crean una vez, en el navegador (usan crypto y la fecha local): no cambian al
  // escribir el nombre del negocio. En el HTML del servidor no hay cotización todavía.
  const [emision, setEmision] = useState<Pick<DatosCotizacion, 'codigo' | 'emitida' | 'validaHasta'> | null>(null);
  const [negocio, setNegocio] = useState('');
  const idNegocio = useId();

  useEffect(() => {
    const { codigo, emitida, validaHasta } = crearCotizacion({ carrito: $carrito.get(), emitida: fechaLocalDeHoy() });
    setEmision({ codigo, emitida, validaHasta });
  }, []);

  if (!emision) {
    return <p className="cotizacion-cargando">Preparando tu cotización…</p>;
  }

  if (carrito.items.length === 0) {
    return (
      <div className="cotizacion-vacia">
        <p className="cotizacion-vacia__titulo">Aún no elegiste módulos.</p>
        <p>Arma tu sistema y aquí verás tu cotización.</p>
        <a className="cotizacion-boton" href="/arma-tu-sistema">
          Ir a Arma tu sistema
        </a>
      </div>
    );
  }

  // El carrito puede cambiar en otra pestaña: los módulos y totales siempre son los actuales.
  const cotizacion: DatosCotizacion = { ...emision, carrito, negocio };
  const totales = textoTotales(calcularTotales(carrito));
  const nombreNegocio = negocio.trim();

  return (
    <article className="cotizacion" aria-labelledby="cotizacion-codigo">
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

      <div className="cotizacion__negocio">
        <label htmlFor={idNegocio}>
          Nombre de tu negocio <span className="cotizacion__opcional">(opcional)</span>
        </label>
        <input
          id={idNegocio}
          type="text"
          value={negocio}
          maxLength={80}
          autoComplete="organization"
          onChange={(evento) => setNegocio(evento.target.value)}
        />
        {/* En el PDF el campo no se imprime: va el nombre como texto */}
        {nombreNegocio && <p className="cotizacion__negocio-impreso">Negocio: {nombreNegocio}</p>}
      </div>

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

      <p className="cotizacion__referencial">{REFERENCIAL}</p>
      <p className="cotizacion__contacto">
        NissiDev · WhatsApp {WHATSAPP_VISIBLE} · {ZONA}
      </p>

      <div className="cotizacion__acciones">
        <a
          className="cotizacion-boton"
          href={enlaceWhatsApp(mensajeWhatsApp(cotizacion))}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enviar por WhatsApp<span className="solo-lector"> (se abre en otra pestaña)</span>
        </a>
        <button type="button" className="cotizacion-boton cotizacion-boton--secundario" onClick={() => window.print()}>
          Guardar como PDF
        </button>
        <a className="cotizacion__cambiar" href="/arma-tu-sistema">
          Cambiar módulos
        </a>
      </div>
    </article>
  );
}
