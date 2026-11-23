// Mapa aproximado dibujado: calles y un círculo, nunca la ubicación exacta ni mapas de terceros.
export function Mapa({ x, y, distrito }: { x: number; y: number; distrito: string }) {
  const cx = 20 + x * 280;
  const cy = 16 + y * 128;
  return (
    <svg className="inmo-mapa" viewBox="0 0 320 160" role="img" aria-label={`Mapa aproximado: zona de ${distrito}`}>
      <rect width="320" height="160" fill="#e7ece6" />
      <rect x="196" y="98" width="70" height="44" rx="6" fill="#c9dfbf" />
      <rect x="30" y="20" width="54" height="34" rx="6" fill="#c9dfbf" />
      <path d="M0 62h320M0 118h320M110 0v160M230 0v160" stroke="#fbfaf7" strokeWidth="10" />
      <path d="M0 18L320 140" stroke="#fbfaf7" strokeWidth="6" />
      <path d="M0 62h320M110 0v160" stroke="#f2d48a" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="30" fill="var(--d-marca)" fillOpacity="0.22" stroke="var(--d-marca)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="5" fill="var(--d-marca)" />
    </svg>
  );
}
