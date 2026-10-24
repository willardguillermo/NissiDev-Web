import type { Cotizacion } from '../../cotizacion/tipos';
import { enlaceWhatsApp, mensajeWhatsApp } from '../../cotizacion/mensajeWhatsApp';

export default function AccionesCotizacion({ cotizacion }: { cotizacion: Cotizacion }) {
  return (
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
  );
}
