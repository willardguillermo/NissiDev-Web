import type { InmobiliariaConfig } from '../../demo/inmuebles/tipos';
import { AVISO_WHATSAPP, IconoWhatsApp } from '../demo/Inicio';

/** Avatar con iniciales: sin fotos de personas reales. */
export function Iniciales({ nombre }: { nombre: string }) {
  const letras = nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  return (
    <span className="inmo-iniciales" aria-hidden="true">
      {letras}
    </span>
  );
}

interface Props {
  config: InmobiliariaConfig;
  volver: () => void;
  verInmuebles: () => void;
  avisar: (texto: string) => void;
}

/** Perfil del agente con su registro MVCS. En la demo, el código es de ejemplo y se dice. */
export function Agente({ config, volver, verInmuebles, avisar }: Props) {
  const { agente } = config;
  return (
    <section className="demo-contenedor inmo-perfil" aria-labelledby="inmo-agente-titulo">
      <button type="button" className="demo-enlace inmo-volver" onClick={volver}>
        ← Volver
      </button>
      <div className="inmo-perfil__cabeza">
        <Iniciales nombre={agente.nombre} />
        <div>
          <h1 id="inmo-agente-titulo" className="demo-titulo inmo-titulo" tabIndex={-1} data-titulo-pantalla>
            {agente.nombre}
          </h1>
          <p className="inmo-perfil__cargo">
            {agente.cargo} · {config.negocio}
          </p>
        </div>
      </div>

      <div className="inmo-registro">
        <p className="inmo-registro__titulo">Registro de Agentes Inmobiliarios (MVCS)</p>
        <p className="inmo-registro__codigo">
          Código <strong>{agente.registroMvcs}</strong> <span className="inmo-registro__ejemplo">Código de ejemplo</span>
        </p>
        <p className="inmo-registro__nota">No es un registro real. En tu sistema va tu código del registro del Ministerio de Vivienda.</p>
      </div>

      <p className="inmo-perfil__texto">{agente.presentacion}</p>

      <dl className="inmo-perfil__datos">
        <div>
          <dt>Experiencia</dt>
          <dd>{agente.anios} años</dd>
        </div>
        <div>
          <dt>Atiende</dt>
          <dd>{agente.horario}</dd>
        </div>
        <div>
          <dt>Zonas</dt>
          <dd>{agente.zonas.join(', ')}</dd>
        </div>
      </dl>

      <div className="inmo-perfil__acciones">
        <button type="button" className="demo-boton" onClick={() => avisar(AVISO_WHATSAPP)}>
          <IconoWhatsApp /> Escribir a {agente.nombre.split(' ')[0]}
        </button>
        <button type="button" className="demo-boton demo-boton--claro" onClick={verInmuebles}>
          Ver sus inmuebles
        </button>
      </div>
    </section>
  );
}
