import type { Cotizacion } from '../../cotizacion/tipos';
import { enlaceWhatsApp, mensajeWhatsApp } from '../../cotizacion/mensajeWhatsApp';

export default function AccionesCotizacion({ cotizacion, lista, repetir }: {
  cotizacion: Cotizacion;
  lista: boolean;
  repetir: () => void;
}) {
  return (
    <div className="cotizacion__acciones" data-lista={lista} inert={!lista} aria-hidden={!lista || undefined}>
      <button type="button" className="cotizacion-boton" onClick={() => window.print()}>
        Guardar PDF
      </button>
      <a className="cotizacion-boton cotizacion-boton--secundario"
        href={enlaceWhatsApp(mensajeWhatsApp(cotizacion))} target="_blank" rel="noopener noreferrer">
        Enviar por WhatsApp<span className="solo-lector"> (se abre en otra pestaña)</span>
      </a>
      <button type="button" className="cotizacion__cambiar cotizacion__repetir" onClick={repetir}>
        Imprimir otra vez
      </button>
      <a className="cotizacion__cambiar" href="/arma-tu-sistema">Cambiar módulos</a>
    </div>
  );
}
