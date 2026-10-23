// Ilustraciones propias y simples para las demos (SVG hecho a mano, sin fotos ni logos de terceros).
// La configuración del rubro elige una por nombre; si no existe, se dibuja un círculo.
// Son decorativas: el nombre del producto o la categoría siempre va en texto al lado.
import type { ReactNode } from 'react';

const DIBUJOS: Record<string, ReactNode> = {
  chocolate: (
    <>
      <rect x="22" y="18" width="52" height="64" rx="6" fill="#6b3a24" />
      <path d="M22 54h52v22a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" fill="#ec48ae" />
      <path d="M48 18v36M22 30h52M22 42h52" stroke="#4d2818" strokeWidth="3" />
      <path d="M22 54l10 6 8-6 8 6 8-6 8 6 10-6" fill="none" stroke="#fff" strokeWidth="2.5" />
    </>
  ),
  gomita: (
    <>
      <circle cx="34" cy="28" r="9" fill="#ff8a3d" />
      <circle cx="62" cy="28" r="9" fill="#ff8a3d" />
      <rect x="26" y="26" width="44" height="54" rx="20" fill="#ffa25e" />
      <circle cx="40" cy="42" r="3" fill="#7a3510" />
      <circle cx="56" cy="42" r="3" fill="#7a3510" />
      <path d="M42 51q6 5 12 0" fill="none" stroke="#7a3510" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="48" cy="66" rx="11" ry="8" fill="#ffc48f" />
    </>
  ),
  galleta: (
    <>
      <circle cx="48" cy="50" r="32" fill="#d9a35f" />
      <circle cx="48" cy="50" r="26" fill="#e8b874" />
      {[
        [38, 38],
        [58, 42],
        [44, 58],
        [60, 62],
        [32, 54],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#5a3216" />
      ))}
    </>
  ),
  caramelo: (
    <>
      <path d="M26 50L8 36v28z" fill="#00c2b9" />
      <path d="M70 50l18-14v28z" fill="#00c2b9" />
      <circle cx="48" cy="50" r="22" fill="#ffc72c" />
      <path d="M34 40q14 10 28 0M34 60q14-10 28 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  snack: (
    <>
      <path d="M24 20h48l-4 62H28z" fill="#ffc72c" />
      <path d="M24 20h48v8H24z" fill="#e0a800" />
      <circle cx="48" cy="54" r="14" fill="#ec48ae" />
      <path d="M41 54q7-8 14 0q-7 8-14 0" fill="#fff" />
    </>
  ),
  globo: (
    <>
      <ellipse cx="40" cy="38" rx="18" ry="22" fill="#ec48ae" />
      <ellipse cx="60" cy="44" rx="16" ry="20" fill="#00c2b9" />
      <path d="M40 60q4 10-2 26M60 64q-2 10 4 22" fill="none" stroke="#555" strokeWidth="2" />
      <ellipse cx="34" cy="30" rx="4" ry="6" fill="#fff" opacity="0.5" />
    </>
  ),
  calabaza: (
    <>
      <path d="M48 22q2-10 10-12" fill="none" stroke="#3f7d3a" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="34" cy="54" rx="18" ry="26" fill="#f08a24" />
      <ellipse cx="62" cy="54" rx="18" ry="26" fill="#f08a24" />
      <ellipse cx="48" cy="54" rx="16" ry="28" fill="#ff9d3b" />
      <path d="M36 46l6 6h-10zM60 46l4 6H54z" fill="#2b1a0e" />
      <path d="M34 64q14 10 28 0l-4 4-4-3-4 4-4-4-4 4-4-3z" fill="#2b1a0e" />
    </>
  ),
  arbol: (
    <>
      <path d="M48 12L22 50h12L18 74h60L62 50h12z" fill="#2f8f4e" />
      <rect x="42" y="74" width="12" height="12" rx="2" fill="#7a4a2a" />
      <circle cx="40" cy="44" r="4" fill="#ffc72c" />
      <circle cx="58" cy="58" r="4" fill="#ec48ae" />
      <circle cx="36" cy="64" r="4" fill="#00c2b9" />
      <path d="M48 6l3 6h-6z" fill="#ffc72c" />
    </>
  ),
  regalo: (
    <>
      <rect x="18" y="40" width="60" height="44" rx="6" fill="#00c2b9" />
      <rect x="14" y="30" width="68" height="14" rx="4" fill="#00a89f" />
      <path d="M44 30h8v54h-8z" fill="#ec48ae" />
      <path d="M48 30q-18-18-20-6t20 6q18-18 20-6t-20 6" fill="none" stroke="#ec48ae" strokeWidth="5" />
    </>
  ),
};

interface Props {
  nombre: string;
  className?: string;
}

export function Ilustracion({ nombre, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      {DIBUJOS[nombre] ?? <circle cx="48" cy="48" r="30" fill="#ccc" />}
    </svg>
  );
}
