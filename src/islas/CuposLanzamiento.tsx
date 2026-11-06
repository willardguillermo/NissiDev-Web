import { cuposDisponibles, LANZAMIENTO, type Lanzamiento } from '../catalogo-servicios/lanzamiento';
import { obtenerModulo } from '../catalogo-servicios/modulos';
import { precioAplicado } from '../catalogo-servicios/precio';
import { formatearSoles } from '../ui/formato';
import './CuposLanzamiento.css';

/** «quedan 5 de 5 cupos» / «queda 1 de 5 cupos». */
export function textoCupos(lanzamiento: Lanzamiento = LANZAMIENTO): string {
  const quedan = cuposDisponibles(lanzamiento);
  return `${quedan === 1 ? 'queda' : 'quedan'} ${quedan} de ${lanzamiento.cupos} cupos`;
}

/**
 * Precio de lanzamiento con sus cupos. Sin JS: también se usa en /servicios sin hidratar.
 * La barra es decorativa (aria-hidden); el texto dice lo mismo. Con los cupos llenos no se muestra:
 * quien la usa pone el precio normal (textoPrecio).
 */
export default function CuposLanzamiento({ lanzamiento = LANZAMIENTO }: { lanzamiento?: Lanzamiento }) {
  const { precioInicial, precioNormal } = precioAplicado(obtenerModulo(lanzamiento.modulo), { lanzamiento });
  if (precioNormal === undefined || precioInicial.tipo !== 'desde') return null;
  const disponibles = cuposDisponibles(lanzamiento);

  return (
    <div className="cupos">
      <p className="cupos__precios">
        <strong className="cupos__actual">Desde {formatearSoles(precioInicial.centimos)}</strong>{' '}
        <s className="cupos__normal">
          <span className="solo-lector">antes </span>
          {formatearSoles(precioNormal)}
        </s>
      </p>
      <p className="cupos__texto">
        Precio de lanzamiento · <span className="cupos__quedan">{textoCupos(lanzamiento)}</span>
      </p>
      <span className="cupos__barra" aria-hidden="true">
        {Array.from({ length: lanzamiento.cupos }, (_, i) => (
          <span key={i} className={i < disponibles ? 'cupos__cupo cupos__cupo--libre' : 'cupos__cupo'} />
        ))}
      </span>
    </div>
  );
}
