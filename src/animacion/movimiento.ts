import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    /** Temporizador del <head> que muestra todo quieto si la animación no arranca a tiempo. */
    __nissidevRespaldo?: number;
  }
}

// Movimiento del sitio (docs/diseño.md): Lenis para el scroll suave y GSAP para las entradas.
// Reglas: solo transform y opacity; con "movimiento reducido" no se hace nada y todo queda quieto.

gsap.registerPlugin(ScrollTrigger, SplitText);

/** --ease-expo de los tokens: cubic-bezier(0.19, 1, 0.22, 1) ≈ expo.out de GSAP. */
export const EASE_EXPO = 'expo.out';
export const DURACION_ENTRADA = 0.75;

export const pidioMenosMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** El titular del hero espera a su animación (clase "animar", puesta en el <head>); esto lo libera. */
function liberarContenido() {
  const raiz = document.documentElement;
  window.clearTimeout(window.__nissidevRespaldo);
  raiz.classList.remove('animar');
}

let lenis: Lenis | null = null;

function iniciarLenis() {
  if (lenis) return;
  lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tiempo) => lenis?.raf(tiempo * 1000));
  gsap.ticker.lagSmoothing(0);
}

function animarTitular() {
  const titular = document.querySelector<HTMLElement>('[data-titular]');
  if (!titular) return;
  SplitText.create(titular, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'titular-linea', // la máscara recibe "titular-linea-mask" (ver global.css)
    autoSplit: true, // vuelve a partir si cambia el ancho o termina de cargar la fuente
    onSplit: (partido) => {
      const entrada = gsap.from(partido.lines, {
        yPercent: 110,
        duration: DURACION_ENTRADA,
        ease: EASE_EXPO,
        stagger: 0.08,
      });
      // Recién ahora las líneas están escondidas bajo su máscara: se puede quitar la espera sin parpadeo.
      liberarContenido();
      return entrada;
    },
  });
}

function animarSecciones() {
  gsap.utils.toArray<HTMLElement>('[data-aparecer]').forEach((seccion) => {
    gsap.from(seccion, {
      opacity: 0,
      y: 40,
      duration: DURACION_ENTRADA,
      ease: EASE_EXPO,
      scrollTrigger: { trigger: seccion, start: 'top 88%', once: true },
    });
  });
}

/** Patrón "producto dentro del dispositivo": el celular sube y se agranda mientras se baja. */
function animarTelefono() {
  const telefono = document.querySelector<HTMLElement>('[data-telefono]');
  if (!telefono) return;
  gsap.fromTo(
    telefono,
    { y: 80, scale: 0.86 },
    {
      y: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: telefono, start: 'top bottom', end: 'center 60%', scrub: true },
    },
  );
}

type Iniciador = () => void | (() => void);
const iniciadoresExtra: Iniciador[] = [];

/** Para que otras piezas (la N en 3D) se sumen al mismo ciclo de vida. Pueden devolver su limpieza. */
export function alIniciarPagina(iniciar: Iniciador) {
  iniciadoresExtra.push(iniciar);
}

let contexto: gsap.Context | null = null;

function iniciarPagina() {
  if (pidioMenosMovimiento()) {
    liberarContenido();
    return;
  }
  iniciarLenis();
  lenis?.resize();
  contexto = gsap.context(() => {
    animarTitular();
    animarSecciones();
    animarTelefono();
    const limpiezas = iniciadoresExtra.map((iniciar) => iniciar());
    // Se ejecuta en contexto.revert(), antes de cambiar de página.
    return () => limpiezas.forEach((limpiar) => limpiar?.());
  });
  if (!document.querySelector('[data-titular]')) liberarContenido();
  ScrollTrigger.refresh();
}

// Con View Transitions los scripts corren una sola vez: se reinicia en cada página y se limpia antes de cambiar.
document.addEventListener('astro:page-load', iniciarPagina);
document.addEventListener('astro:before-swap', () => {
  contexto?.revert();
  contexto = null;
});
