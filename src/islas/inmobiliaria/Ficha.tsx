import { formatearMonto, textoPrecio } from '../../demo/inmuebles/precio';
import type { InmobiliariaConfig, Inmueble } from '../../demo/inmuebles/tipos';
import { Iniciales } from './Agente';
import { Datos } from './Datos';
import { Escena, NOMBRE_ESCENA } from './Escena';
import { Mapa } from './Mapa';
import { OPERACION } from './TarjetaInmueble';

interface Props {
  config: InmobiliariaConfig;
  inmueble: Inmueble;
  volver: () => void;
  verAgente: () => void;
}

export function Ficha({ config, inmueble, volver, verAgente }: Props) {
  const precio = textoPrecio(inmueble, config.tipoCambio);

  return (
    <article className="inmo-ficha" aria-labelledby="inmo-ficha-titulo">
      <div className="demo-contenedor">
        <button type="button" className="demo-enlace inmo-volver" onClick={volver}>
          ← Volver
        </button>
      </div>

      {/* Galería: se desliza con el dedo o con las flechas del teclado (tiene foco) */}
      <ul className="inmo-galeria" role="list" aria-label={`Galería de ${inmueble.codigo}: ilustraciones`} tabIndex={0}>
        {inmueble.galeria.map((escena, i) => (
          <li key={`${escena}-${i}`}>
            <figure>
              <Escena escena={escena} color={inmueble.color} />
              <figcaption>
                {NOMBRE_ESCENA[escena]} · ilustración {i + 1} de {inmueble.galeria.length}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="demo-contenedor inmo-ficha__cuerpo">
        <div className="inmo-ficha__principal">
          <p className="inmo-ficha__etiquetas">
            <span className="inmo-etiqueta">{OPERACION[inmueble.operacion]}</span>
            {inmueble.estado === 'separado' && <span className="inmo-etiqueta inmo-etiqueta--separado">Separado</span>}
            <span className="inmo-codigo">Código {inmueble.codigo}</span>
          </p>
          <h1 id="inmo-ficha-titulo" className="demo-titulo inmo-titulo" tabIndex={-1} data-titulo-pantalla>
            {inmueble.titulo}
          </h1>
          <p className="inmo-ficha__lugar">
            {inmueble.distrito} · {inmueble.referencia}
          </p>

          <div className="inmo-ficha__precio">
            <p>
              <strong>
                {precio.principal}
                {precio.sufijo}
              </strong>{' '}
              <span>{precio.equivalente}</span>
            </p>
            {inmueble.mantenimiento && <p className="inmo-ficha__nota">+ {formatearMonto('PEN', inmueble.mantenimiento)}/mes de mantenimiento del edificio</p>}
            <p className="inmo-ficha__nota">Equivalente aproximado con un tipo de cambio de ejemplo (S/ {config.tipoCambio.toFixed(2)}).</p>
          </div>

          <Datos inmueble={inmueble} />

          <h2 className="inmo-subtitulo">Descripción</h2>
          <p>{inmueble.descripcion}</p>
          <ul className="inmo-caracteristicas" role="list">
            {inmueble.caracteristicas.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="inmo-ficha__lado">
          <h2 className="inmo-subtitulo">Ubicación aproximada</h2>
          <Mapa x={inmueble.mapa.x} y={inmueble.mapa.y} distrito={inmueble.distrito} />
          <p className="inmo-ficha__nota">Zona de {inmueble.distrito}. La dirección exacta se da al coordinar la visita.</p>

          <div className="inmo-agente-mini">
            <Iniciales nombre={config.agente.nombre} />
            <div>
              <p className="inmo-agente-mini__nombre">{config.agente.nombre}</p>
              <p className="inmo-agente-mini__cargo">Registro MVCS {config.agente.registroMvcs} (ejemplo)</p>
            </div>
            <button type="button" className="demo-boton demo-boton--claro demo-boton--chico" onClick={verAgente}>
              Ver perfil
            </button>
          </div>
        </div>
      </div>

    </article>
  );
}
