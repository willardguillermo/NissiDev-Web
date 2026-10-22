import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { intentarAgregar } from '../demo/disponibilidad';
import { NAVEGACION_INICIAL, navegar, type Accion, type Navegacion } from '../demo/navegacion';
import { PEDIDO_VACIO, presentacionesEnPedido, totalPedido } from '../demo/pedido';
import { personalizacionDeUrl, personalizar, type Personalizacion } from '../demo/rubro';
import { variablesDeTema } from '../demo/tema';
import type { Pedido, Producto, RubroConfig } from '../demo/tipos';
import { formatearSoles } from '../ui/formato';
import { AVISO_WHATSAPP, IconoWhatsApp, Inicio } from './demo/Inicio';
import { Marco } from './demo/Marco';
import { Pendiente } from './demo/Pendiente';
import './demo/demo.css';

interface Props {
  /** La plantilla del rubro con todos sus puestos. */
  plantilla: RubroConfig;
  personalizacion: Personalizacion;
}

/** Motor de las demos: recibe la configuración del rubro y no tiene datos del negocio fijos. */
export default function DemoRubro({ plantilla, personalizacion }: Props) {
  const [config, setConfig] = useState(() => personalizar(plantilla, personalizacion));
  const [nav, setNav] = useState<Navegacion>(NAVEGACION_INICIAL);
  const [pedido, setPedido] = useState<Pedido>(PEDIDO_VACIO);
  const [aviso, setAviso] = useState<{ id: number; texto: string } | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

  // Vista previa por URL (?puestos=1&campana=ninguna). Se lee después de hidratar para que
  // el primer dibujo coincida con el HTML del servidor.
  useEffect(() => {
    const cambios = personalizacionDeUrl(window.location.search);
    if (Object.keys(cambios).length > 0) setConfig(personalizar(plantilla, { ...personalizacion, ...cambios }));
  }, [plantilla, personalizacion]);

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
  };
  // Un aviso a la vez; se va solo a los 5 s o con su botón. El id hace que se anuncie aunque se repita.
  const avisar = (texto: string) => setAviso({ id: Date.now(), texto });
  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(null), 5000);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  const agregar = (producto: Producto, presentacionId: string) => {
    const resultado = intentarAgregar(pedido, producto, presentacionId, 1);
    if (!resultado.ok) return avisar(resultado.mensaje);
    setPedido(resultado.pedido);
    const presentacion = producto.presentaciones.find((p) => p.id === presentacionId);
    avisar(`Agregaste 1 ${presentacion?.nombre ?? ''} de ${producto.nombre} a tu pedido.`);
  };

  const ilustraciones = new Map(config.categorias.map((c) => [c.id, c.ilustracion]));
  const ilustracionDe = (producto: Producto) => ilustraciones.get(producto.categoria) ?? '';
  const cantidad = presentacionesEnPedido(pedido);

  const alInicio = { texto: 'Volver al inicio', alHacer: () => ir({ tipo: 'inicio' }) };

  return (
    <div ref={raiz} className="demo" style={variablesDeTema(config.tema) as CSSProperties}>
      <Marco vista={nav.vista} cambiarVista={(vista) => ir({ tipo: 'vista', vista })} />

      <div className="demo-pantalla" key={`${nav.vista}-${nav.pantalla}`}>
        {nav.vista === 'dueno' ? (
          <Pendiente
            titulo="Panel del dueño"
            texto={`Ventas del día, stock y cobros de ${config.negocio}. Esta pantalla llega pronto.`}
          />
        ) : nav.pantalla === 'inicio' ? (
          <Inicio config={config} ir={ir} agregar={agregar} avisar={avisar} ilustracionDe={ilustracionDe} />
        ) : nav.pantalla === 'catalogo' ? (
          <Pendiente titulo="Catálogo" texto="El catálogo llega en la T17." accion={alInicio} />
        ) : nav.pantalla === 'detalle' ? (
          <Pendiente titulo="Detalle del producto" texto="Esta pantalla llega pronto." accion={alInicio} />
        ) : (
          <Pendiente titulo="Mi pedido" texto="Esta pantalla llega pronto." accion={alInicio} />
        )}
      </div>

      {nav.vista === 'cliente' && (
        <div className="demo-abajo">
          <button type="button" className="demo-flotante" aria-label="WhatsApp del negocio" onClick={() => avisar(AVISO_WHATSAPP)}>
            <IconoWhatsApp />
          </button>
          <button type="button" className="demo-barra-pedido" onClick={() => ir({ tipo: 'pedido' })}>
            <span>Mi pedido ({cantidad})</span>
            {cantidad > 0 && <strong>{formatearSoles(totalPedido(pedido))}</strong>}
          </button>
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
