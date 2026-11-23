import { enlaceCotizarRubro } from '../../carrito/sugeridos';
import {
  cambiarOperacion,
  cuantosFiltros,
  filtrarInmuebles,
  OPCIONES_DORMITORIOS,
  RANGOS_PRECIO,
  type FiltrosInmueble,
} from '../../demo/inmuebles/filtros';
import type { InmobiliariaConfig, Operacion } from '../../demo/inmuebles/tipos';
import { AVISO_WHATSAPP, IconoWhatsApp } from '../demo/Inicio';
import { Iniciales } from './Agente';
import { OPERACION, TarjetaInmueble } from './TarjetaInmueble';

interface Props {
  config: InmobiliariaConfig;
  filtros: FiltrosInmueble;
  cambiarFiltros: (filtros: FiltrosInmueble) => void;
  abrir: (codigo: string) => void;
  verAgente: () => void;
  avisar: (texto: string) => void;
}

interface Opcion<T> {
  valor: T | undefined;
  nombre: string;
}

/** Una fila de chips: elegir uno marca solo ese; «Todos» (valor undefined) quita el filtro. */
function Grupo<T extends string | number>({ nombre, opciones, actual, elegir }: {
  nombre: string;
  opciones: Opcion<T>[];
  actual: T | undefined;
  elegir: (valor: T | undefined) => void;
}) {
  return (
    <div className="demo-filtros__grupo" role="group" aria-label={nombre}>
      <span className="demo-filtros__nombre" aria-hidden="true">
        {nombre}
      </span>
      <ul className="demo-chips">
        {opciones.map((o) => (
          <li key={String(o.valor ?? 'todos')}>
            <button type="button" className="demo-chip" aria-pressed={actual === o.valor} onClick={() => elegir(o.valor)}>
              {o.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Catalogo({ config, filtros, cambiarFiltros, abrir, verAgente, avisar }: Props) {
  const lista = filtrarInmuebles(config.inmuebles, filtros, config.tipoCambio);
  const activos = cuantosFiltros(filtros);
  const { operacion } = filtros;

  return (
    <>
      <p className="demo-anuncio">{config.textos.anuncio}</p>

      <header className="demo-cabecera demo-contenedor">
        <div className="demo-cabecera__fila">
          <p className="demo-logo inmo-logo" title={config.negocio}>
            {config.negocio}
          </p>
          <button type="button" className="inmo-agente-boton" onClick={verAgente}>
            <Iniciales nombre={config.agente.nombre} />
            <span>Tu agente</span>
          </button>
        </div>
      </header>

      <section className="demo-contenedor inmo-hero">
        <h1 className="demo-titulo inmo-titulo" tabIndex={-1} data-titulo-pantalla>
          {config.textos.titular}
        </h1>
        <p>{config.textos.bajada}</p>
      </section>

      <section className="inmo-catalogo" aria-labelledby="inmo-filtros-titulo">
        <h2 id="inmo-filtros-titulo" className="solo-lector">
          Filtros
        </h2>
        <div className="demo-filtros">
          <Grupo<Operacion>
            nombre="Operación"
            opciones={[{ valor: undefined, nombre: 'Todos' }, ...(['venta', 'alquiler'] as const).map((v) => ({ valor: v, nombre: OPERACION[v] }))]}
            actual={operacion}
            elegir={(v) => cambiarFiltros(cambiarOperacion(filtros, v))}
          />
          <Grupo<string>
            nombre="Distrito"
            opciones={[{ valor: undefined, nombre: 'Todos' }, ...config.distritos.map((d) => ({ valor: d, nombre: d }))]}
            actual={filtros.distrito}
            elegir={(distrito) => cambiarFiltros({ ...filtros, distrito })}
          />
          {operacion ? (
            <Grupo<string>
              nombre="Precio"
              opciones={[{ valor: undefined, nombre: 'Todos' }, ...RANGOS_PRECIO[operacion].map((r) => ({ valor: r.id, nombre: r.nombre }))]}
              actual={filtros.precio}
              elegir={(precio) => cambiarFiltros({ ...filtros, precio })}
            />
          ) : (
            <p className="demo-filtros__grupo inmo-filtros__nota">
              <span className="demo-filtros__nombre">Precio</span>
              Elige venta o alquiler para filtrar por precio.
            </p>
          )}
          <Grupo<number>
            nombre="Dormitorios"
            opciones={[{ valor: undefined, nombre: 'Todos' }, ...OPCIONES_DORMITORIOS.map((n) => ({ valor: n, nombre: n === 3 ? '3 o más' : `${n} o más` }))]}
            actual={filtros.dormitorios}
            elegir={(dormitorios) => cambiarFiltros({ ...filtros, dormitorios })}
          />
        </div>

        <div className="demo-contenedor">
          <div className="demo-catalogo__resumen">
            <p role="status">{lista.length === 1 ? '1 inmueble' : `${lista.length} inmuebles`}</p>
            {activos > 0 && (
              <button type="button" className="demo-enlace" onClick={() => cambiarFiltros({})}>
                Quitar filtros
              </button>
            )}
          </div>

          {lista.length > 0 ? (
            <ul className="inmo-grilla" role="list">
              {lista.map((i) => (
                <li key={i.codigo}>
                  <TarjetaInmueble inmueble={i} tipoCambio={config.tipoCambio} abrir={() => abrir(i.codigo)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="demo-vacio">
              <p>No hay inmuebles con esos filtros.</p>
              <button type="button" className="demo-boton" onClick={() => cambiarFiltros({})}>
                Ver todos
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="demo-contenedor inmo-seccion">
        <div className="inmo-agente-mini">
          <Iniciales nombre={config.agente.nombre} />
          <div>
            <p className="inmo-agente-mini__nombre">{config.agente.nombre}</p>
            <p className="inmo-agente-mini__cargo">{config.agente.cargo}</p>
          </div>
          <button type="button" className="demo-boton demo-boton--claro demo-boton--chico" onClick={verAgente}>
            Ver perfil
          </button>
        </div>
      </section>

      <footer className="demo-pie demo-contenedor inmo-pie">
        <p>
          <strong>{config.negocio}</strong> · {config.whatsappVisible}
        </p>
        <button type="button" className="demo-enlace" onClick={() => avisar(AVISO_WHATSAPP)}>
          <IconoWhatsApp /> Escríbenos
        </button>
        <p className="demo-pie__nissidev">
          Demo hecha por NissiDev con datos de ejemplo. <a href={enlaceCotizarRubro(config.id)}>Quiero esto para mi negocio</a>
        </p>
      </footer>
    </>
  );
}
