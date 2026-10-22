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
