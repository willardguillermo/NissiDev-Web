import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { NAVEGACION_INICIAL, navegar, type Accion, type Navegacion } from '../demo/navegacion';
import { variablesDeTema } from '../demo/tema';
import type { RubroConfig } from '../demo/tipos';
import { Marco } from './demo/Marco';
import { Pendiente } from './demo/Pendiente';
import './demo/demo.css';

interface Props {
  config: RubroConfig;
}

/** Motor de las demos: recibe la configuración del rubro y no tiene datos del negocio fijos. */
export default function DemoRubro({ config }: Props) {
  const [nav, setNav] = useState<Navegacion>(NAVEGACION_INICIAL);
  const raiz = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

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
          <Pendiente
            titulo={config.negocio}
            texto="El Inicio de la demo llega en la T16."
            accion={{ texto: 'Ver catálogo', alHacer: () => ir({ tipo: 'catalogo' }) }}
          />
        ) : nav.pantalla === 'catalogo' ? (
          <Pendiente titulo="Catálogo" texto="El catálogo llega en la T17." accion={alInicio} />
        ) : nav.pantalla === 'detalle' ? (
          <Pendiente titulo="Detalle del producto" texto="Esta pantalla llega pronto." accion={alInicio} />
        ) : (
          <Pendiente titulo="Mi pedido" texto="Esta pantalla llega pronto." accion={alInicio} />
        )}
      </div>
    </div>
  );
}
