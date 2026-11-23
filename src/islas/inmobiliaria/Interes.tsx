import { enlaceCotizarRubro } from '../../carrito/sugeridos';
import { useRef } from 'react';
import { mensajeInteres } from '../../demo/inmuebles/mensaje';
import type { InmobiliariaConfig, Inmueble } from '../../demo/inmuebles/tipos';
import { IconoWhatsApp } from '../demo/Inicio';

export const AVISO_INTERES = 'Es una demostración: en tu sistema, este botón abre WhatsApp con este mensaje ya escrito.';

/** Barra fija de la ficha: «Me interesa» muestra el mensaje de WhatsApp (la demo no abre WhatsApp). */
export function Interes({ config, inmueble }: { config: InmobiliariaConfig; inmueble: Inmueble }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  return (
    <>
      <div className="demo-abajo">
        <button ref={boton} type="button" className="demo-barra-pedido inmo-interes" onClick={() => dialogo.current?.showModal()}>
          <span>Me interesa · {inmueble.codigo}</span>
          <IconoWhatsApp />
        </button>
      </div>

      <dialog ref={dialogo} className="demo-dialogo" aria-labelledby="inmo-dialogo-titulo" onClose={() => boton.current?.focus()}>
        <h2 id="inmo-dialogo-titulo" className="demo-subtitulo">
          Así le llega tu mensaje a {config.agente.nombre.split(' ')[0]}
        </h2>
        <pre className="demo-dialogo__mensaje">{mensajeInteres(inmueble.codigo)}</pre>
        <p className="demo-dialogo__aviso">{AVISO_INTERES}</p>
        <div className="demo-dialogo__acciones">
          <a className="demo-boton" href={enlaceCotizarRubro(config.id)}>
            Quiero esto para mi negocio
          </a>
          <button type="button" className="demo-boton demo-boton--claro" onClick={() => dialogo.current?.close()}>
            Seguir viendo
          </button>
        </div>
      </dialog>
    </>
  );
}
