import type { Escena as NombreEscena } from '../../demo/inmuebles/tipos';

// Escenas dibujadas a mano (SVG propio) en lugar de fotos: nunca fotos de portales ni de agentes reales.
// Decorativas: el nombre de la escena va en texto (figcaption) al lado.

export const NOMBRE_ESCENA: Record<NombreEscena, string> = {
  fachada: 'Fachada',
  edificio: 'Edificio',
  sala: 'Sala',
  dormitorio: 'Dormitorio',
  cocina: 'Cocina',
  bano: 'Baño',
  terreno: 'Terreno',
  local: 'Ambiente',
};

const LINEA = 'rgb(22 32 29 / 0.55)';

export function Escena({ escena, color, className }: { escena: NombreEscena; color: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="160" height="100" fill={color} />
      {escena === 'fachada' && (
        <>
          <rect y="78" width="160" height="22" fill="#7fae6e" />
          <rect x="42" y="30" width="76" height="52" fill="#fbfaf7" />
          <path d="M34 34L80 8l46 26z" fill="#8a5a44" />
          <rect x="72" y="56" width="16" height="26" fill="#6b4a3a" />
          <rect x="50" y="42" width="14" height="12" fill="#bfe0ef" stroke={LINEA} />
          <rect x="96" y="42" width="14" height="12" fill="#bfe0ef" stroke={LINEA} />
          <circle cx="22" cy="68" r="12" fill="#5e9150" />
          <rect x="20" y="70" width="4" height="12" fill="#6b4a3a" />
        </>
      )}
      {escena === 'edificio' && (
        <>
          <rect y="84" width="160" height="16" fill="#7fae6e" />
          <rect x="50" y="10" width="60" height="76" fill="#fbfaf7" />
          <rect x="50" y="10" width="60" height="6" fill="#8a5a44" />
          {[22, 38, 54].map((y) => (
            <g key={y}>
              <rect x="58" y={y} width="12" height="10" fill="#bfe0ef" stroke={LINEA} />
              <rect x="90" y={y} width="12" height="10" fill="#bfe0ef" stroke={LINEA} />
            </g>
          ))}
          <rect x="74" y="70" width="12" height="16" fill="#6b4a3a" />
          <circle cx="28" cy="72" r="12" fill="#5e9150" />
          <rect x="26" y="74" width="4" height="12" fill="#6b4a3a" />
        </>
      )}
      {escena === 'sala' && (
        <>
          <rect y="72" width="160" height="28" fill="#d8c3a5" />
          <rect x="96" y="16" width="44" height="34" fill="#bfe0ef" stroke="#fbfaf7" strokeWidth="3" />
          <rect x="18" y="50" width="70" height="26" rx="6" fill="#fbfaf7" />
          <rect x="18" y="42" width="70" height="14" rx="6" fill="#e9e3d8" />
          <rect x="104" y="64" width="30" height="5" rx="2" fill="#8a5a44" />
          <circle cx="38" cy="30" r="9" fill="#f2d48a" />
          <path d="M38 39v6" stroke={LINEA} strokeWidth="2" />
        </>
      )}
      {escena === 'dormitorio' && (
        <>
          <rect y="74" width="160" height="26" fill="#d8c3a5" />
          <rect x="30" y="46" width="100" height="30" rx="4" fill="#fbfaf7" />
          <rect x="30" y="34" width="100" height="16" rx="4" fill="#8a5a44" />
          <rect x="38" y="44" width="30" height="10" rx="4" fill="#e9e3d8" />
          <rect x="92" y="44" width="30" height="10" rx="4" fill="#e9e3d8" />
          <rect x="30" y="58" width="100" height="18" rx="2" fill="#a8dccd" />
          <rect x="66" y="10" width="28" height="18" fill="#bfe0ef" stroke="#fbfaf7" strokeWidth="3" />
        </>
      )}
      {escena === 'cocina' && (
        <>
          <rect y="80" width="160" height="20" fill="#d8c3a5" />
          <rect x="12" y="52" width="136" height="30" fill="#fbfaf7" />
          <rect x="12" y="48" width="136" height="6" fill="#8a5a44" />
          <rect x="22" y="12" width="50" height="24" fill="#fbfaf7" />
          <rect x="88" y="12" width="50" height="24" fill="#fbfaf7" />
          <circle cx="100" cy="44" r="4" fill={LINEA} />
          <circle cx="114" cy="44" r="4" fill={LINEA} />
          <path d="M40 60v14M60 60v14M80 60v14M120 60v14" stroke={LINEA} />
        </>
      )}
      {escena === 'bano' && (
        <>
          <rect y="80" width="160" height="20" fill="#e9e3d8" />
          <rect x="24" y="56" width="62" height="26" rx="10" fill="#fbfaf7" />
          <rect x="104" y="52" width="30" height="10" rx="4" fill="#fbfaf7" />
          <rect x="114" y="62" width="10" height="20" fill="#fbfaf7" />
          <rect x="104" y="18" width="30" height="26" rx="4" fill="#bfe0ef" stroke="#fbfaf7" strokeWidth="3" />
          <path d="M40 56V30h10" stroke={LINEA} strokeWidth="3" fill="none" />
        </>
      )}
      {escena === 'terreno' && (
        <>
          <rect y="0" width="160" height="40" fill="#bfe0ef" />
          <path d="M0 44l40-14 40 10 40-16 40 12v64H0z" fill="#9fbf6e" />
          <path d="M28 58h104v32H28z" fill="none" stroke="#fbfaf7" strokeWidth="2" strokeDasharray="5 4" />
          <rect x="30" y="52" width="3" height="10" fill="#8a5a44" />
          <rect x="127" y="52" width="3" height="10" fill="#8a5a44" />
        </>
      )}
      {escena === 'local' && (
        <>
          <rect y="82" width="160" height="18" fill="#d8c3a5" />
          <rect x="14" y="14" width="132" height="70" fill="#fbfaf7" />
          <rect x="14" y="14" width="132" height="12" fill="#8a5a44" />
          <rect x="24" y="34" width="72" height="44" fill="#bfe0ef" stroke={LINEA} />
          <rect x="108" y="34" width="28" height="48" fill="#6b4a3a" />
          <circle cx="130" cy="58" r="2" fill="#f2d48a" />
        </>
      )}
    </svg>
  );
}
