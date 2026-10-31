import type { CSSProperties } from 'react';
import {
  cobrosPorMedio,
  largoDelNombre,
  masVendidosDeLaSemana,
  porVencer,
  proporciones,
  stockBajo,
  textoFecha,
  textoVence,
  ventasDelDiaPorPuesto,
} from '../../demo/panel';
import type { RubroConfig } from '../../demo/tipos';
import { formatearSoles } from '../../ui/formato';

interface Props {
  config: RubroConfig;
}

interface Fila {
  clave: string | number;
  nombre: string;
  valor: string;
  /** Dato secundario bajo el nombre (p. ej. las unidades). */
  detalle?: string;
  proporcion: number;
}

/** Barras con CSS: el largo es scaleX(proporción). El valor siempre va en texto; la barra es adorno. */
function Barras({ filas }: { filas: Fila[] }) {
  return (
    <ul className="demo-barras">
      {filas.map((fila) => (
        <li key={fila.clave}>
          <span className="demo-barras__nombre">
            {fila.nombre}
            {fila.detalle && <span className="demo-barras__detalle">{fila.detalle}</span>}
          </span>
          <strong className="demo-barras__valor">{fila.valor}</strong>
          <span className="demo-barras__pista" aria-hidden="true">
            <span className="demo-barras__barra" style={{ '--proporcion': fila.proporcion } as CSSProperties} />
          </span>
        </li>
      ))}
    </ul>
  );
}

const unidades = (n: number) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`;

/** Panel del dueño: todo lo que muestra sale de demo/panel.ts; aquí no hay números escritos a mano. */
export function Panel({ config }: Props) {
  const porPuesto = ventasDelDiaPorPuesto(config);
  const totalDia = porPuesto.reduce((s, p) => s + p.total, 0);
  const ventasDia = porPuesto.reduce((s, p) => s + p.ventas, 0);
  const cobros = cobrosPorMedio(config);
  const vendidos = masVendidosDeLaSemana(config);
  const vencen = porVencer(config);
  const bajos = stockBajo(config);
  const unaTienda = config.puestos.length === 1;

  const conProporcion = <T,>(lista: T[], valor: (x: T) => number) => {
    const p = proporciones(lista.map(valor));
    return (i: number) => p[i];
  };
  const pPuesto = conProporcion(porPuesto, (p) => p.total);
  const pCobro = conProporcion(cobros, (c) => c.total);
  const pVendido = conProporcion(vendidos, (v) => v.monto);

  return (
    <section className="demo-panel demo-contenedor" aria-labelledby="demo-panel-titulo">
      <header className="demo-panel__cabeza">
        <p className="demo-panel__fecha">{textoFecha(config.panel.hoy)}</p>
        <h1 id="demo-panel-titulo" className="demo-titulo demo-panel__nombre" data-largo={largoDelNombre(config.negocio)} tabIndex={-1} data-titulo-pantalla>
          Panel de {config.negocio}
        </h1>
        <p className="demo-panel__valor">Así verías tu negocio cada día.</p>
      </header>

      <div className="demo-panel__grilla">
        <article className="demo-panel__tarjeta demo-panel__tarjeta--ancha">
          <h2 className="demo-panel__titulo">{unaTienda ? 'Ventas de hoy en la tienda' : 'Ventas de hoy'}</h2>
          <p className="demo-panel__cifra">{formatearSoles(totalDia)}</p>
          <p className="demo-panel__nota">{ventasDia === 1 ? '1 venta' : `${ventasDia} ventas`} hasta ahora</p>
          {!unaTienda && (
            <Barras
              filas={porPuesto.map((p, i) => ({
                clave: p.numero,
                nombre: p.nombre,
                valor: formatearSoles(p.total),
                proporcion: pPuesto(i),
              }))}
            />
          )}
        </article>

        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Cobros de hoy</h2>
          <Barras filas={cobros.map((c, i) => ({ clave: c.medio, nombre: c.nombre, valor: formatearSoles(c.total), proporcion: pCobro(i) }))} />
        </article>

        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Más vendidos de la semana</h2>
          {vendidos.length > 0 ? (
            <Barras
              filas={vendidos.map((v, i) => ({
                clave: v.producto.id,
                nombre: v.producto.nombre,
                valor: formatearSoles(v.monto),
                detalle: unidades(v.unidades),
                proporcion: pVendido(i),
              }))}
            />
          ) : (
            <p className="demo-panel__nota">Sin ventas esta semana.</p>
          )}
        </article>

        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Por vencer en 7 días</h2>
          {vencen.length > 0 ? (
            <ul className="demo-panel__lista">
              {vencen.map((v) => (
                <li key={v.producto.id}>
                  <span>{v.producto.nombre}</span>
                  <span className="demo-panel__alerta" data-urgente={v.faltan <= 1 || undefined}>
                    {textoVence(v.faltan)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="demo-panel__nota">Nada vence esta semana.</p>
          )}
        </article>

        <article className="demo-panel__tarjeta">
          <h2 className="demo-panel__titulo">Stock bajo</h2>
          {bajos.length > 0 ? (
            <ul className="demo-panel__lista">
              {bajos.map((p) => (
                <li key={p.id}>
                  <span>{p.nombre}</span>
                  <span className="demo-panel__alerta" data-urgente={p.stock === 0 || undefined}>
                    {p.stock === 0 ? 'Agotado' : `Quedan ${unidades(p.stock)}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="demo-panel__nota">Todo con stock suficiente.</p>
          )}
        </article>
      </div>

      <div className="demo-panel__cierre">
        <p>¿Te sirve ver tu negocio así?</p>
        <a className="demo-boton" href="/cotizar">
          Quiero esto para mi negocio
        </a>
      </div>
    </section>
  );
}
