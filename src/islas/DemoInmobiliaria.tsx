import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { FiltrosInmueble } from '../demo/inmuebles/filtros';
import { NAVEGACION_INMO_INICIAL, navegarInmo, type AccionInmo, type NavegacionInmo } from '../demo/inmuebles/navegacion';
import type { InmobiliariaConfig } from '../demo/inmuebles/tipos';
import { variablesDeTema } from '../demo/tema';
import { AVISO_WHATSAPP, IconoWhatsApp } from './demo/Inicio';
import { Marco } from './demo/Marco';
import { Pendiente } from './demo/Pendiente';
import { Agente } from './inmobiliaria/Agente';
import { Catalogo } from './inmobiliaria/Catalogo';
import { Ficha } from './inmobiliaria/Ficha';
import { Interes } from './inmobiliaria/Interes';
import { PanelInmobiliaria } from './inmobiliaria/PanelInmobiliaria';
import './demo/demo.css';
import './inmobiliaria/inmobiliaria.css';

/** Demo inmobiliaria (ADR-005): la plantilla de demos con su propia configuración. */
export default function DemoInmobiliaria({ config }: { config: InmobiliariaConfig }) {
  const [nav, setNav] = useState<NavegacionInmo>(NAVEGACION_INMO_INICIAL);
  const [filtros, setFiltros] = useState<FiltrosInmueble>({});
  const [aviso, setAviso] = useState<{ id: number; texto: string } | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

  // Cada pantalla entra al historial: el botón Atrás del celular vuelve a la anterior en vez de salir.
  useEffect(() => {
    history.replaceState({ ...history.state, inmo: NAVEGACION_INMO_INICIAL }, '');
    const alVolver = (evento: PopStateEvent) => {
      const anterior = (evento.state as { inmo?: NavegacionInmo } | null)?.inmo;
      if (!anterior) return;
      moverFoco.current = true;
      setNav(anterior);
    };
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  // Al cambiar de pantalla: arriba del todo y el foco en su título.
  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    window.scrollTo({ top: 0 });
    raiz.current?.querySelector<HTMLElement>('[data-titulo-pantalla]')?.focus({ preventScroll: true });
  }, [nav]);

  const ir = (accion: AccionInmo) => {
    const siguiente = navegarInmo(nav, accion);
    history.pushState({ inmo: siguiente }, '');
    moverFoco.current = true;
    setNav(siguiente);
    setAviso(null);
  };

  const avisar = (texto: string) => setAviso({ id: Date.now(), texto });
  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(null), 5000);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  const inmueble = config.inmuebles.find((i) => i.codigo === nav.codigo);
  const verAgente = () => ir({ tipo: 'agente' });
  const alCatalogo = () => ir({ tipo: 'catalogo' });

  return (
    <div ref={raiz} className="demo inmo" style={variablesDeTema(config.tema) as CSSProperties}>
      <Marco vista={nav.vista} cambiarVista={(vista) => ir({ tipo: 'vista', vista })} />

      <div className="demo-pantalla" key={`${nav.vista}-${nav.pantalla}-${nav.codigo ?? ''}`}>
        {nav.vista === 'dueno' ? (
          <PanelInmobiliaria config={config} />
        ) : nav.pantalla === 'catalogo' ? (
          <Catalogo
            config={config}
            filtros={filtros}
            cambiarFiltros={setFiltros}
            abrir={(codigo) => ir({ tipo: 'ficha', codigo })}
            verAgente={verAgente}
            avisar={avisar}
          />
        ) : nav.pantalla === 'agente' ? (
          <Agente config={config} volver={() => history.back()} verInmuebles={alCatalogo} avisar={avisar} />
        ) : inmueble ? (
          <Ficha config={config} inmueble={inmueble} volver={() => history.back()} verAgente={verAgente} />
        ) : (
          <Pendiente
            titulo="No encontramos ese inmueble"
            texto="Puede que ya se haya vendido o alquilado."
            accion={{ texto: 'Ver los inmuebles', alHacer: alCatalogo }}
          />
        )}
      </div>

      {nav.vista === 'cliente' && nav.pantalla === 'ficha' && inmueble && <Interes key={inmueble.codigo} config={config} inmueble={inmueble} />}
      {nav.vista === 'cliente' && nav.pantalla !== 'ficha' && (
        <div className="demo-abajo">
          <button type="button" className="demo-flotante" aria-label="WhatsApp del agente" onClick={() => avisar(AVISO_WHATSAPP)}>
            <IconoWhatsApp />
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
