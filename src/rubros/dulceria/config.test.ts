import { describe, expect, it } from 'vitest';
import { normalizar } from '../../demo/filtros';
import { campanaActiva, ocasionesVisibles, personalizar, validarRubro } from '../../demo/rubro';
import type { CampanaId } from '../../demo/tipos';
import { contraste } from '../../ui/contraste';
import { DULCERIA, DULCERIA_COMPLETA } from './config';
import { PRODUCTOS } from './productos';

// Marcas y productos reales que se venden en Lima: ninguna marca ni nombre de la demo puede
// coincidir ni parecerse (a una letra de diferencia, en nombres de 5 letras o más).
const MARCAS_REALES = [
  'sublime', 'princesa', 'triangulo', 'dona pepa', 'field', 'costa', 'nestle', 'arcor', 'ambrosoli', 'winters',
  'hershey', 'mars', 'snickers', 'milka', 'toblerone', 'ferrero', 'kinder', 'kitkat', 'bon o bon', 'cua cua',
  'tuyo', 'vizzio', 'lentejas', 'chin chin', 'trululu', 'haribo', 'frugele', 'mogul', 'fini', 'oreo', 'casino',
  'morochas', 'margarita', 'soda v', 'ritz', 'club social', 'picaras', 'tentacion', 'chomp', 'glacitas',
  'halls', 'globo pop', 'bubbaloo', 'trident', 'mentitas', 'sayon', 'lays', 'cheetos', 'doritos', 'pringles',
  'piqueo snax', 'inka chips', 'karinto', 'chizitos', 'tor tees', 'lindt', 'm&m', 'skittles', 'chupa chups', 'del valle',
];

function distancia(a: string, b: string): number {
  const fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let anterior = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = fila[j];
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return fila[b.length];
}

const pareceReal = (texto: string) => {
  const palabras = normalizar(texto).split(' ');
  return MARCAS_REALES.some((real) => {
    const n = real.split(' ').length;
    for (let i = 0; i + n <= palabras.length; i++) {
      const tramo = palabras.slice(i, i + n).join(' ');
      if (tramo === real || (real.length >= 5 && distancia(tramo, real) <= 1)) return true;
    }
    return false;
  });
};

const precios = (id: string) => PRODUCTOS.flatMap((p) => p.presentaciones.filter((x) => x.id === id));
const preciosConMayor = (id: string) =>
  precios(id).flatMap((x) => [x.precio, ...(x.precioMayorista ? [x.precioMayorista.precio] : [])]);

describe('datos de ejemplo de la dulcería', () => {
  it('unos 30 productos, al menos 4 por categoría', () => {
    expect(PRODUCTOS.length).toBeGreaterThanOrEqual(28);
    expect(PRODUCTOS.length).toBeLessThanOrEqual(32);
    for (const categoria of DULCERIA_COMPLETA.categorias) {
      expect(PRODUCTOS.filter((p) => p.categoria === categoria.id).length, categoria.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('ninguna marca ni nombre se parece a una marca real', () => {
    const sospechosos = PRODUCTOS.filter((p) => pareceReal(p.marca) || pareceReal(p.nombre));
    expect(sospechosos.map((p) => `${p.nombre} / ${p.marca}`)).toEqual([]);
  });

  it('el detector sí reconoce una marca real o casi igual', () => {
    expect(pareceReal('Sublime')).toBe(true);
    expect(pareceReal('Chocolate Sublyme')).toBe(true);
    expect(pareceReal('Dulcemonte')).toBe(false);
  });

  it('precios de Lima: unidad S/ 0.20–3.50, bolsa S/ 4–25, caja S/ 12–60', () => {
    expect(preciosConMayor('unidad').every((c) => c >= 20 && c <= 350)).toBe(true);
    expect(preciosConMayor('bolsa').every((c) => c >= 400 && c <= 2500)).toBe(true);
    expect(preciosConMayor('caja').every((c) => c >= 1200 && c <= 6000)).toBe(true);
  });

  it('bolsas y cajas con factores realistas y algunas con precio por mayor', () => {
    const factores = PRODUCTOS.flatMap((p) => p.presentaciones.filter((x) => x.id !== 'unidad').map((x) => x.factor));
    expect(factores.every((f) => [12, 24, 50].includes(f))).toBe(true);
    const conMayor = PRODUCTOS.filter((p) => p.presentaciones.some((x) => x.precioMayorista));
    expect(conMayor.length).toBeGreaterThanOrEqual(5);
    expect(conMayor.length).toBeLessThan(PRODUCTOS.length);
  });

  it('hay de todo para las etiquetas y el panel: nuevo, oferta, agotado y stock bajo', () => {
    for (const etiqueta of ['nuevo', 'oferta', 'agotado']) {
      expect(PRODUCTOS.some((p) => p.etiqueta === etiqueta), etiqueta).toBe(true);
    }
    expect(PRODUCTOS.some((p) => p.stock > 0 && p.stock < 24)).toBe(true);
  });
});

describe('configuración de la dulcería', () => {
  it('por defecto: 2 puestos, Halloween y por mayor', () => {
    expect(DULCERIA.puestos).toHaveLength(2);
    expect(campanaActiva(DULCERIA)?.id).toBe('halloween');
    expect(DULCERIA.vendePorMayor).toBe(true);
    expect(validarRubro(DULCERIA)).toEqual([]);
  });

  const campanas: (CampanaId | null)[] = ['halloween', 'navidad', 'dia-del-nino', null];
  it.each([1, 2, 3])('con %i puesto(s), cada campaña y con o sin por mayor sigue siendo válida', (puestos) => {
    for (const campana of campanas) {
      for (const porMayor of [true, false]) {
        const config = personalizar(DULCERIA_COMPLETA, { puestos, campana, porMayor });
        expect(validarRubro(config), `${puestos} ${campana} ${porMayor}`).toEqual([]);
        for (const puesto of config.puestos) {
          expect(config.productos.some((p) => p.puestos.includes(puesto.numero))).toBe(true);
        }
      }
    }
  });

  it('la campaña "ninguna" deja solo las ocasiones de siempre', () => {
    const config = personalizar(DULCERIA_COMPLETA, { campana: null });
    expect(campanaActiva(config)).toBeNull();
    expect(ocasionesVisibles(config).map((o) => o.id)).toEqual(['cumpleanos', 'bolsitas-sorpresa', 'por-mayor']);
  });

  it('cada campaña tiene productos para su ocasión', () => {
    for (const campana of DULCERIA_COMPLETA.campanas) {
      expect(PRODUCTOS.filter((p) => p.ocasiones.includes(campana.id)).length, campana.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('los colores del tema cumplen contraste', () => {
    const t = DULCERIA.tema;
    for (const fondo of [t.fondo, t.fondoSuave]) {
      expect(contraste(t.texto, fondo)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t.textoSuave, fondo)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t.marcaTexto, fondo)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contraste(t.sobreMarca, t.marca)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(t.texto, t.etiquetaAmarilla)).toBeGreaterThanOrEqual(4.5);
    expect(contraste(t.texto, t.etiquetaTurquesa)).toBeGreaterThanOrEqual(4.5);
    // El rosa marca el borde de los controles sobre blanco (mínimo 3:1)
    expect(contraste(t.marca, t.fondo)).toBeGreaterThanOrEqual(3);
  });
});

describe('peor caso (break-ui)', () => {
  it('los datos extremos siguen siendo una configuración válida', async () => {
    const { DULCERIA_PEOR_CASO } = await import('./peor-caso');
    expect(validarRubro(DULCERIA_PEOR_CASO)).toEqual([]);
  });
});
