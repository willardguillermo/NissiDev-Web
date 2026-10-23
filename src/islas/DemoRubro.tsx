import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { intentarAgregar } from '../demo/disponibilidad';
import type { Filtros } from '../demo/filtros';
import { NAVEGACION_INICIAL, navegar, type Accion, type Navegacion } from '../demo/navegacion';
import { PEDIDO_VACIO, presentacionesEnPedido, totalPedido } from '../demo/pedido';
import { personalizacionDeUrl, personalizar, type Personalizacion } from '../demo/rubro';
import { contarPresentacion } from '../demo/presentaciones';
import { variablesDeTema } from '../demo/tema';
import type { Pedido, Producto, RubroConfig } from '../demo/tipos';
import { formatearSoles } from '../ui/formato';
import { Catalogo } from './demo/Catalogo';
import { Detalle } from './demo/Detalle';
import { AVISO_WHATSAPP, IconoWhatsApp, Inicio } from './demo/Inicio';
import { Marco } from './demo/Marco';
import { MiPedido } from './demo/MiPedido';
import { Panel } from './demo/Panel';
import { Pendiente } from './demo/Pendiente';
import './demo/demo.css';

interface Props {
  /** La plantilla del rubro con todos sus puestos. */
  plantilla: RubroConfig;
  personalizacion: Personalizacion;
  /** Solo en desarrollo: datos extremos para probar la vista con ?datos=peor. */
  peorCaso?: RubroConfig;
}

/** Motor de las demos: recibe la configuración del rubro y no tiene datos del negocio fijos. */
export default function DemoRubro({ plantilla, personalizacion, peorCaso }: Props) {
  const [config, setConfig] = useState(() => personalizar(plantilla, personalizacion));
  const [nav, setNav] = useState<Navegacion>(NAVEGACION_INICIAL);
  const navActual = useRef(nav);
  navActual.current = nav;
  const [pedido, setPedido] = useState<Pedido>(PEDIDO_VACIO);
  const [aviso, setAviso] = useState<{ id: number; texto: string } | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

  // Vista previa por URL (?puestos=1&campana=ninguna). Se lee después de hidratar para que
  // el primer dibujo coincida con el HTML del servidor.
  useEffect(() => {
    const cambios = personalizacionDeUrl(window.location.search);
    const usarPeorCaso = peorCaso !== undefined && new URLSearchParams(window.location.search).get('datos') === 'peor';
    if (usarPeorCaso || Object.keys(cambios).length > 0) {
      setConfig(personalizar(usarPeorCaso ? peorCaso : plantilla, { ...personalizacion, ...cambios }));
    }
  }, [plantilla, personalizacion, peorCaso]);

  // Cada pantalla entra al historial: el botón Atrás del celular vuelve a la anterior en vez de salir.
  useEffect(() => {
    history.replaceState({ ...history.state, demo: NAVEGACION_INICIAL }, '');
    const alVolver = (evento: PopStateEvent) => {
      const anterior = (evento.state as { demo?: Navegacion } | null)?.demo;
      if (!anterior) return;
      moverFoco.current = true;
      setNav(anterior);
    };
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  // Al cambiar de pantalla: arriba del todo y el foco en su título (el lector de pantalla lo anuncia).
  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    window.scrollTo({ top: 0 });
    raiz.current?.querySelector<HTMLElement>('[data-titulo-pantalla]')?.focus({ preventScroll: true });
  }, [nav]);

  const ir = (accion: Accion) => {
    const siguiente = navegar(nav, accion);
    history.pushState({ demo: siguiente }, '');
    moverFoco.current = true;
    setNav(siguiente);
    // El aviso era de la pantalla anterior: en la nueva podría tapar un botón
    setAviso(null);
  };
  // Un aviso a la vez; se va solo a los 5 s o con su botón. El id hace que se anuncie aunque se repita.
  const avisar = (texto: string) => setAviso({ id: Date.now(), texto });
  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(null), 5000);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  /** Agrega al pedido si alcanza; devuelve el motivo si no. */
  const agregarCantidad = (producto: Producto, presentacionId: string, cantidad: number): string | null => {
    const resultado = intentarAgregar(pedido, producto, presentacionId, cantidad);
    if (!resultado.ok) return resultado.mensaje;
    setPedido(resultado.pedido);
    const presentacion = producto.presentaciones.find((p) => p.id === presentacionId);
    avisar(`Agregaste ${presentacion ? contarPresentacion(cantidad, presentacion) : cantidad} de ${producto.nombre} a tu pedido.`);
    return null;
  };
  /** Desde una tarjeta: 1 presentación; si no alcanza, el motivo va en el aviso. */
  const agregar = (producto: Producto, presentacionId: string) => {
    const motivo = agregarCantidad(producto, presentacionId, 1);
    if (motivo) avisar(motivo);
  };

  // El catálogo guarda sus filtros en el historial: al volver del detalle, se ve como se dejó.
  const recordarFiltros = useCallback((filtros: Filtros) => {
    history.replaceState({ ...history.state, demo: { ...navActual.current, filtros } }, '');
  }, []);

  const ilustraciones = new Map(config.categorias.map((c) => [c.id, c.ilustracion]));
  const ilustracionDe = (producto: Producto) => ilustraciones.get(producto.categoria) ?? '';
  const cantidad = presentacionesEnPedido(pedido);
  const producto = config.productos.find((p) => p.id === nav.productoId);

  const alInicio = { texto: 'Volver al inicio', alHacer: () => ir({ tipo: 'inicio' }) };

  return (
    <div ref={raiz} className="demo" style={variablesDeTema(config.tema) as CSSProperties}>
      <Marco vista={nav.vista} cambiarVista={(vista) => ir({ tipo: 'vista', vista })} />

      <div className="demo-pantalla" key={`${nav.vista}-${nav.pantalla}`}>
        {nav.vista === 'dueno' ? (
          <Panel config={config} />
        ) : nav.pantalla === 'inicio' ? (
          <Inicio config={config} ir={ir} agregar={agregar} avisar={avisar} ilustracionDe={ilustracionDe} />
        ) : nav.pantalla === 'catalogo' ? (
          <Catalogo
            config={config}
            filtrosIniciales={nav.filtros}
            recordarFiltros={recordarFiltros}
            ir={ir}
            agregar={agregar}
            ilustracionDe={ilustracionDe}
          />
        ) : nav.pantalla === 'detalle' ? (
          producto ? (
            <Detalle
              key={producto.id}
              config={config}
              producto={producto}
              pedido={pedido}
              ir={ir}
              volver={() => history.back()}
              agregar={agregarCantidad}
              agregarRapido={agregar}
              ilustracionDe={ilustracionDe}
            />
          ) : (
            <Pendiente titulo="No encontramos ese producto" texto="Puede que ya no esté en el catálogo." accion={alInicio} />
          )
        ) : (
          <MiPedido
            config={config}
            pedido={pedido}
            cambiarPedido={setPedido}
            ir={ir}
            volver={() => history.back()}
            ilustracionDe={ilustracionDe}
          />
        )}
      </div>

      {nav.vista === 'cliente' && (
        <div className="demo-abajo">
          <button type="button" className="demo-flotante" aria-label="WhatsApp del negocio" onClick={() => avisar(AVISO_WHATSAPP)}>
            <IconoWhatsApp />
          </button>
          {nav.pantalla !== 'pedido' && (
            <button type="button" className="demo-barra-pedido" onClick={() => ir({ tipo: 'pedido' })}>
              <span>Mi pedido ({cantidad})</span>
              {cantidad > 0 && <strong>{formatearSoles(totalPedido(pedido))}</strong>}
            </button>
          )}
        </div>
      )}

      <div className="demo-aviso-zona" role="status" aria-live="polite">
        {aviso && (
          <p className="demo-aviso" key={aviso.id}>
            <span>{aviso.texto}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setAviso(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
