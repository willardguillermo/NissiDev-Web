// Contraste WCAG 2.x entre dos colores hexadecimales (#rrggbb).
function luminancia(hex: string): number {
  const limpio = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(limpio)) {
    throw new RangeError(`Color inválido: ${hex}. Se espera #rrggbb.`);
  }
  const [r, g, b] = [0, 2, 4].map((i) => {
    const canal = parseInt(limpio.slice(i, i + 2), 16) / 255;
    return canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(colorA: string, colorB: string): number {
  const [clara, oscura] = [luminancia(colorA), luminancia(colorB)].sort((a, b) => b - a);
  return (clara + 0.05) / (oscura + 0.05);
}
