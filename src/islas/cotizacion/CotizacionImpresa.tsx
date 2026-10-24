import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { duracionImpresion, iniciarSecuenciaImpresion, type FaseImpresion } from '../../cotizacion/impresion';
import type { Cotizacion } from '../../cotizacion/tipos';
import AccionesCotizacion from './AccionesCotizacion';
import PapelCotizacion from './PapelCotizacion';
import Ticketera from './Ticketera';

export default function CotizacionImpresa({ cotizacion }: { cotizacion: Cotizacion }) {
  const papel = useRef<HTMLElement>(null);
  const estado = useRef<HTMLParagraphElement>(null);
  const [fase, setFase] = useState<FaseImpresion>('preparando');
  const [duracion, setDuracion] = useState(1200);
  const [repeticion, setRepeticion] = useState(0);

  useEffect(() => {
    const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const alto = papel.current?.offsetHeight ?? 0;
    setDuracion(duracionImpresion(alto));
    const cancelar = iniciarSecuenciaImpresion({
      alto, menosMovimiento: preferencia.matches, cambiarFase: setFase,
    });
    const alReducir = () => {
      if (!preferencia.matches) return;
      cancelar();
      setFase('lista');
    };
    preferencia.addEventListener('change', alReducir);
    return () => {
      cancelar();
      preferencia.removeEventListener('change', alReducir);
    };
  }, [repeticion]);

  const repetir = () => {
    estado.current?.focus();
    setRepeticion((veces) => veces + 1);
  };

  return (
    <div className="cotizacion__impresa" data-fase={fase}
      style={{ '--duracion-impresion': `${duracion}ms` } as CSSProperties}>
      <Ticketera fase={fase} refEstado={estado} />
      <div className="cotizacion__salida"><PapelCotizacion cotizacion={cotizacion} refPapel={papel} /></div>
      <AccionesCotizacion cotizacion={cotizacion} lista={fase === 'lista'} repetir={repetir} />
    </div>
  );
}
