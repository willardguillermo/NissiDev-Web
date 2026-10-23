import { useId, useState, type SubmitEvent } from 'react';
import type { Accion } from '../../demo/navegacion';
import { campanaActiva, ocasionesVisibles } from '../../demo/rubro';
import type { Producto, RubroConfig } from '../../demo/tipos';
import { Ilustracion } from './Ilustracion';
import { TarjetaProducto } from './TarjetaProducto';

interface Props {
  config: RubroConfig;
  ir: (accion: Accion) => void;
  agregar: (producto: Producto, presentacionId: string) => void;
  avisar: (texto: string) => void;
  ilustracionDe: (producto: Producto) => string;
}

export const AVISO_WHATSAPP = 'Es una demostración: en tu sistema, este botón abre el WhatsApp de tu negocio.';

/** Buscador grande del header; al buscar, abre el catálogo con ese texto. */
export function Buscador({ placeholder, buscar, inicial = '' }: { placeholder: string; buscar: (texto: string) => void; inicial?: string }) {
  const id = useId();
  const [texto, setTexto] = useState(inicial);
  const enviar = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    buscar(texto.trim());
  };
  return (
    <form className="demo-buscador" role="search" onSubmit={enviar}>
      <label htmlFor={id} className="solo-lector">
        Buscar productos
      </label>
      <input id={id} type="search" value={texto} placeholder={placeholder} onChange={(e) => setTexto(e.target.value)} enterKeyHint="search" />
      <button type="submit" aria-label="Buscar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
      </button>
    </form>
  );
}

export function Inicio({ config, ir, agregar, avisar, ilustracionDe }: Props) {
  const campana = campanaActiva(config);
  const hero = campana ?? config.textos.heroGeneral;
  const ocasiones = ocasionesVisibles(config);
  const masVendidos = config.masVendidos
    .map((id) => config.productos.find((p) => p.id === id))
    .filter((p): p is Producto => p !== undefined);
  const unaTienda = config.puestos.length === 1;

  return (
    <>
      <p className="demo-anuncio">{config.textos.anuncio}</p>

      <header className="demo-cabecera demo-contenedor">
        <div className="demo-cabecera__fila">
          <p className="demo-logo" title={config.negocio}>
            {config.negocio}
          </p>
          <button type="button" className="demo-icono" aria-label="WhatsApp del negocio" onClick={() => avisar(AVISO_WHATSAPP)}>
            <IconoWhatsApp />
          </button>
        </div>
        <Buscador placeholder={config.textos.buscador} buscar={(texto) => ir({ tipo: 'catalogo', filtros: { texto } })} />
      </header>

      <section className="demo-hero demo-contenedor" aria-labelledby="demo-hero-titulo">
        <div className="demo-hero__texto">
          {campana && <p className="demo-hero__temporada">Temporada de {campana.nombre}</p>}
          <h1 id="demo-hero-titulo" className="demo-titulo demo-hero__titular" tabIndex={-1} data-titulo-pantalla>
            {hero.titular}
          </h1>
          <p className="demo-hero__bajada">{hero.bajada}</p>
          <div className="demo-hero__acciones">
            <button type="button" className="demo-boton" onClick={() => ir({ tipo: 'catalogo' })}>
              Ver catálogo
            </button>
            <button type="button" className="demo-boton demo-boton--claro" onClick={() => avisar(AVISO_WHATSAPP)}>
              Pedir por WhatsApp
            </button>
          </div>
        </div>
        <Ilustracion nombre={hero.ilustracion} className="demo-hero__ilustracion" />
      </section>

      <section className="demo-seccion demo-contenedor" aria-labelledby="demo-ocasiones">
        <h2 id="demo-ocasiones" className="demo-subtitulo">Compra por ocasión</h2>
        <ul className="demo-ocasiones">
          {ocasiones.map((o) => (
            <li key={o.id}>
              <button type="button" className="demo-ocasion" data-campana={o.campana ? '' : undefined} onClick={() => ir({ tipo: 'catalogo', filtros: { ocasion: o.id } })}>
                <strong>{o.nombre}</strong>
                <span>{o.descripcion}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="demo-seccion" aria-labelledby="demo-categorias">
        <h2 id="demo-categorias" className="demo-subtitulo demo-contenedor">Categorías</h2>
        <ul className="demo-categorias">
          {config.categorias.map((c) => (
            <li key={c.id}>
              <button type="button" className="demo-categoria" onClick={() => ir({ tipo: 'catalogo', filtros: { categoria: c.id } })}>
                <Ilustracion nombre={c.ilustracion} />
                <span>{c.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="demo-seccion demo-contenedor" aria-labelledby="demo-mas-vendidos">
        <h2 id="demo-mas-vendidos" className="demo-subtitulo">Más vendidos</h2>
        <ul className="demo-grilla">
          {masVendidos.map((p) => (
            <li key={p.id}>
              <TarjetaProducto
                producto={p}
                ilustracion={ilustracionDe(p)}
                mostrar="ambos"
                vendePorMayor={config.vendePorMayor}
                abrir={() => ir({ tipo: 'detalle', productoId: p.id })}
                agregar={(presentacionId) => agregar(p, presentacionId)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="demo-seccion demo-contenedor" aria-labelledby="demo-puestos">
        <h2 id="demo-puestos" className="demo-subtitulo">{unaTienda ? 'Nuestra tienda' : `Nuestros ${config.puestos.length} puestos`}</h2>
        <ul className="demo-puestos" data-cantidad={config.puestos.length}>
          {config.puestos.map((puesto) => (
            <li key={puesto.numero} className="demo-puesto">
              {!unaTienda && <h3 className="demo-puesto__nombre">{puesto.nombre}</h3>}
              <p className="demo-puesto__que">{unaTienda ? config.textos.tiendaUnica : puesto.queSeEncuentra}</p>
              <p>{puesto.horario}</p>
              <p className="demo-puesto__referencia">{puesto.referencia}</p>
              <button
                type="button"
                className="demo-boton demo-boton--claro demo-boton--chico"
                aria-label={unaTienda ? 'Cómo llegar a la tienda' : `Cómo llegar al ${puesto.nombre}`}
                onClick={() => avisar('Es una demostración: en tu sistema, aquí se abre el mapa con la ubicación de tu puesto.')}
              >
                Cómo llegar
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="demo-seccion demo-contenedor" aria-labelledby="demo-por-que">
        <h2 id="demo-por-que" className="demo-subtitulo">Por qué elegirnos</h2>
        <ul className="demo-por-que">
          {config.textos.porQue.map((razon) => (
            <li key={razon.titulo}>
              <strong>{razon.titulo}</strong>
              <span>{razon.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="demo-pie">
        <div className="demo-contenedor demo-pie__fila">
          <p className="demo-logo">{config.negocio}</p>
          <p>WhatsApp {config.whatsappVisible}</p>
          <p>{config.direccion}</p>
          <p>{config.puestos[0].horario}</p>
          <p>{config.redes.join(' · ')}</p>
          <p className="demo-pie__nissidev">
            Demo hecha por NissiDev con datos de ejemplo. <a href="/arma-tu-sistema">Quiero esto para mi negocio</a>
          </p>
        </div>
      </footer>
    </>
  );
}

/** Globo de chat genérico (no el logo de WhatsApp, que es de terceros). */
export function IconoWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 9.5h8M8 12.5h5" strokeLinecap="round" />
    </svg>
  );
}
