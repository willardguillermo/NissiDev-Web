import { consultasDeLaSemana, consultasPorInmueble, inmueblesActivos, masVistos, type ConDato } from '../../demo/inmuebles/panel';
import type { InmobiliariaConfig } from '../../demo/inmuebles/tipos';
import { largoDelNombre, proporciones, textoFecha } from '../../demo/panel';
import { Barras } from '../demo/Panel';

const veces = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

function filas(lista: ConDato[], unidad: [string, string]) {
  const largos = proporciones(lista.map((x) => x.valor));
  return lista.map((x, i) => ({
    clave: x.inmueble.codigo,
    nombre: x.inmueble.titulo,
    detalle: `${x.inmueble.codigo} · ${x.inmueble.distrito}`,
    valor: veces(x.valor, ...unidad),
    proporcion: largos[i],
  }));
}

/** Vista del dueño: todo sale de demo/inmuebles/panel.ts; aquí no hay números escritos a mano. */
export function PanelInmobiliaria({ config }: { config: InmobiliariaConfig }) {
  const activos = inmueblesActivos(config);
  const semana = consultasDeLaSemana(config).length;
  const porInmueble = consultasPorInmueble(config);
  const vistos = masVistos(config);

  return (
    <section className="demo-panel demo-contenedor" aria-labelledby="demo-panel-titulo">
      <header className="demo-panel__cabeza">
        <p className="demo-panel__fecha">{textoFecha(config.panel.hoy)}</p>
        <h1 id="demo-panel-titulo" className="demo-titulo demo-panel__nombre inmo-titulo" data-largo={largoDelNombre(config.negocio)} tabIndex={-1} data-titulo-pantalla>
          Panel de {config.negocio}
        </h1>
        <p className="demo-panel__valor">Así verías tus inmuebles y quién pregunta por ellos.</p>
      </header>

      <div className="demo-panel__grilla">
        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Inmuebles activos</h2>
          <p className="demo-panel__cifra">{activos.total}</p>
          <p className="demo-panel__nota">
            {activos.venta} en venta · {activos.alquiler} en alquiler
            {activos.separados > 0 && ` · ${veces(activos.separados, 'separado', 'separados')}`}
          </p>
        </article>

        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Consultas de la semana</h2>
          <p className="demo-panel__cifra">{semana}</p>
          <p className="demo-panel__nota">Por WhatsApp, llamada o formulario, en los últimos 7 días.</p>
        </article>

        <article className="demo-panel__tarjeta demo-panel__tarjeta--ancha">
          <h2 className="demo-panel__titulo">Consultas por inmueble</h2>
          {porInmueble.length > 0 ? (
            <Barras filas={filas(porInmueble, ['consulta', 'consultas'])} />
          ) : (
            <p className="demo-panel__nota">Sin consultas esta semana.</p>
          )}
        </article>

        <article className="demo-panel__tarjeta demo-panel__tarjeta--ancha">
          <h2 className="demo-panel__titulo">Los más vistos</h2>
          {vistos.length > 0 ? (
            <Barras filas={filas(vistos, ['vista', 'vistas'])} />
          ) : (
            <p className="demo-panel__nota">Nadie vio tus inmuebles esta semana.</p>
          )}
        </article>
      </div>

      <div className="demo-panel__cierre">
        <p>¿Te sirve ver tus inmuebles así?</p>
        <a className="demo-boton" href="/cotizar">
          Quiero esto para mi negocio
        </a>
      </div>
    </section>
  );
}
