import { useId, useState } from 'react';
import { filtrarProductos, type Filtros } from '../../demo/filtros';
import { alternarFiltro, gruposDeFiltro, hayFiltros, type GrupoFiltro } from '../../demo/grupos-de-filtro';
import type { Accion } from '../../demo/navegacion';
import type { Producto, RubroConfig } from '../../demo/tipos';
import { TarjetaProducto } from './TarjetaProducto';

interface Props {
  config: RubroConfig;
  /** Los guarda la isla en su navegación (y en el historial). */
  filtros?: Filtros;
  cambiarFiltros: (filtros: Filtros) => void;
  ir: (accion: Accion) => void;
  agregar: (producto: Producto, presentacionId: string) => void;
  ilustracionDe: (producto: Producto) => string;
}

type Modo = 'unidad' | 'mayor';

const plural = (n: number) => `${n} ${n === 1 ? 'producto' : 'productos'}`;

export function Catalogo({ config, filtros = {}, cambiarFiltros, ir, agregar, ilustracionDe }: Props) {
  const idBuscador = useId();
  const [modo, setModo] = useState<Modo>('unidad');
  const idMas = useId();
  const [masAbierto, setMasAbierto] = useState(false);
  // Categoría y ocasión siempre a la vista; marca y puesto, en "Más filtros" (en celular).
  const grupos = gruposDeFiltro(config);
  const principales = grupos.filter((g) => g.clave === 'categoria' || g.clave === 'ocasion');
  const extra = grupos.filter((g) => !principales.includes(g));
  const activosEnExtra = extra.filter((g) => filtros[g.clave] !== undefined).length;
  const productos = filtrarProductos(config.productos, filtros);

  const grupoDeChips = (grupo: GrupoFiltro) => (
    <div key={grupo.clave} className="demo-filtros__grupo" role="group" aria-label={`Filtrar por ${grupo.nombre.toLowerCase()}`}>
      <span className="demo-filtros__nombre" aria-hidden="true">
        {grupo.nombre}
      </span>
      <ul className="demo-chips">
        {grupo.opciones.map((opcion) => (
          <li key={opcion.valor}>
            <button
              type="button"
              className="demo-chip"
              aria-pressed={filtros[grupo.clave] === opcion.valor}
              onClick={() => cambiarFiltros(alternarFiltro(filtros, grupo.clave, opcion.valor))}
            >
              {opcion.texto}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="demo-catalogo" aria-labelledby="demo-catalogo-titulo">
      <div className="demo-catalogo__fijo">
        <div className="demo-contenedor demo-catalogo__buscar">
          <button type="button" className="demo-icono" aria-label="Volver al inicio" onClick={() => ir({ tipo: 'inicio' })}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="demo-buscador">
            <label htmlFor={idBuscador} className="solo-lector">
              Buscar productos
            </label>
            <input
              id={idBuscador}
              type="search"
              value={filtros.texto ?? ''}
              placeholder={config.textos.buscador}
              enterKeyHint="search"
              onChange={(e) => cambiarFiltros({ ...filtros, texto: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="demo-contenedor demo-catalogo__cabeza">
        <h1 id="demo-catalogo-titulo" className="demo-titulo" tabIndex={-1} data-titulo-pantalla>
          Catálogo
        </h1>
        {config.vendePorMayor && (
          <div className="demo-modo" role="group" aria-label="Precio que se muestra">
            <button type="button" aria-pressed={modo === 'unidad'} onClick={() => setModo('unidad')}>
              Precio unidad
            </button>
            <button type="button" aria-pressed={modo === 'mayor'} onClick={() => setModo('mayor')}>
              Precio por mayor
            </button>
          </div>
        )}
      </div>

      <div className="demo-filtros">
        {principales.map(grupoDeChips)}
        {extra.length > 0 && (
          <>
            <button
              type="button"
              className="demo-filtros__mas"
              aria-expanded={masAbierto}
              aria-controls={idMas}
              onClick={() => setMasAbierto(!masAbierto)}
            >
              {activosEnExtra > 0 ? `Más filtros (${activosEnExtra})` : 'Más filtros'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div id={idMas} className="demo-filtros__extra" data-abierto={masAbierto || undefined}>
              {extra.map(grupoDeChips)}
            </div>
          </>
        )}
      </div>

      <div className="demo-contenedor">
        <div className="demo-catalogo__resumen">
          <p role="status">{plural(productos.length)}</p>
          {hayFiltros(filtros) && (
            <button type="button" className="demo-enlace" onClick={() => cambiarFiltros({})}>
              Limpiar filtros
            </button>
          )}
        </div>

        {productos.length === 0 ? (
          <div className="demo-vacio">
            <p>No encontramos productos con esa búsqueda y esos filtros.</p>
            <button type="button" className="demo-boton" onClick={() => cambiarFiltros({})}>
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <ul className="demo-grilla demo-grilla--ancha">
            {productos.map((p) => (
              <li key={p.id}>
                <TarjetaProducto
                  producto={p}
                  ilustracion={ilustracionDe(p)}
                  mostrar={modo}
                  vendePorMayor={config.vendePorMayor}
                  nivel="h2"
                  abrir={() => ir({ tipo: 'detalle', productoId: p.id })}
                  agregar={(presentacionId) => agregar(p, presentacionId)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
