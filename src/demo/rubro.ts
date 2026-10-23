import type { Campana, CampanaId, Ocasion, Producto, RubroConfig, Venta } from './tipos';

// Lo que cambia de un negocio a otro dentro de la misma plantilla de rubro.
export interface Personalizacion {
  /** De 1 a 3. Los productos de los puestos que sobran pasan a los que quedan. */
  puestos?: number;
  campana?: CampanaId | null;
  porMayor?: boolean;
}

/** Puesto al que pasa un producto cuando el negocio tiene menos puestos: 3 → 1 con dos puestos. */
const puestoQueQueda = (numero: number, cantidad: number) => ((numero - 1) % cantidad) + 1;

function ajustarPuestos(producto: Producto, cantidad: number): Producto {
  return { ...producto, puestos: [...new Set(producto.puestos.map((p) => puestoQueQueda(p, cantidad)))].sort((a, b) => a - b) };
}

function sinPrecioMayorista(producto: Producto): Producto {
  return {
    ...producto,
    presentaciones: producto.presentaciones.map((presentacion) => {
      const copia = { ...presentacion };
      delete copia.precioMayorista;
      return copia;
    }),
  };
}

/** Devuelve la configuración ajustada; nunca modifica la original. */
export function personalizar(config: RubroConfig, cambios: Personalizacion): RubroConfig {
  const cantidad = cambios.puestos ?? config.puestos.length;
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > Math.min(3, config.puestos.length)) {
    throw new RangeError(`Puestos inválidos: ${cantidad}. La plantilla admite de 1 a ${Math.min(3, config.puestos.length)}.`);
  }
  const porMayor = cambios.porMayor ?? config.vendePorMayor;
  let productos = config.productos.map((p) => ajustarPuestos(p, cantidad));
  if (!porMayor) productos = productos.map(sinPrecioMayorista);
  const ventas = config.panel.ventas.map((v) => ({ ...v, puesto: puestoQueQueda(v.puesto, cantidad) }));
  return {
    ...config,
    panel: { ...config.panel, ventas },
    puestos: config.puestos.slice(0, cantidad),
    campanaActiva: cambios.campana === undefined ? config.campanaActiva : cambios.campana,
    vendePorMayor: porMayor,
    productos,
  };
}

const CAMPANAS: CampanaId[] = ['halloween', 'navidad', 'dia-del-nino'];

/**
 * Vista previa por URL para probar la plantilla: ?puestos=1&campana=ninguna.
 * Lo que no se entiende se ignora (queda lo de la configuración). La venta por mayor no se cambia
 * por URL: los textos del negocio la mencionan, así que se cambia en la configuración junto con ellos.
 */
export function personalizacionDeUrl(busqueda: string): Personalizacion {
  const parametros = new URLSearchParams(busqueda);
  const cambios: Personalizacion = {};
  const puestos = Number(parametros.get('puestos'));
  if ([1, 2, 3].includes(puestos)) cambios.puestos = puestos;
  const campana = parametros.get('campana');
  if (campana === 'ninguna') cambios.campana = null;
  else if (CAMPANAS.includes(campana as CampanaId)) cambios.campana = campana as CampanaId;
  return cambios;
}

export function campanaActiva(config: RubroConfig): Campana | null {
  return config.campanas.find((c) => c.id === config.campanaActiva) ?? null;
}

/** Las ocasiones que se muestran: sin las de otras campañas ni "Por mayor" si el negocio no vende así. */
export function ocasionesVisibles(config: RubroConfig): Ocasion[] {
  return config.ocasiones.filter(
    (o) => (o.campana === undefined || o.campana === config.campanaActiva) && (!o.soloPorMayor || config.vendePorMayor),
  );
}

const repetidos = (valores: string[]) => [...new Set(valores.filter((v, i) => valores.indexOf(v) !== i))];
const esEnteroPositivo = (n: number) => Number.isSafeInteger(n) && n > 0;
const esFecha = (texto: string) => /^\d{4}-\d{2}-\d{2}$/.test(texto) && !Number.isNaN(Date.parse(texto));

function erroresDeProducto(p: Producto, config: RubroConfig): string[] {
  const errores: string[] = [];
  const de = (texto: string) => errores.push(`${p.id}: ${texto}`);
  if (!config.categorias.some((c) => c.id === p.categoria)) de(`categoría "${p.categoria}" no existe`);
  for (const o of p.ocasiones) if (!config.ocasiones.some((x) => x.id === o)) de(`ocasión "${o}" no existe`);
  if (p.puestos.length === 0) de('no está en ningún puesto');
  for (const n of p.puestos) if (!config.puestos.some((x) => x.numero === n)) de(`puesto ${n} no existe`);
  if (!Number.isSafeInteger(p.stock) || p.stock < 0) de('stock inválido');
  if ((p.stock === 0) !== (p.etiqueta === 'agotado')) de('"agotado" y stock 0 deben ir juntos');
  if (p.vence !== undefined && !esFecha(p.vence)) de(`fecha de vencimiento inválida: ${p.vence}`);

  const base = p.presentaciones.filter((x) => x.factor === 1);
  if (base.length !== 1) de('necesita exactamente una presentación con factor 1 (unidad base)');
  if (repetidos(p.presentaciones.map((x) => x.id)).length) de('presentaciones repetidas');
  for (const x of p.presentaciones) {
    if (!esEnteroPositivo(x.factor) || !esEnteroPositivo(x.precio)) de(`${x.id}: factor o precio inválido`);
    if (base[0] && x.precio / x.factor > base[0].precio) de(`${x.id}: sale más caro por unidad que la unidad`);
    const mayor = x.precioMayorista;
    if (!mayor) continue;
    if (!config.vendePorMayor) de(`${x.id}: tiene precio por mayor pero el negocio no vende por mayor`);
    if (!Number.isSafeInteger(mayor.cantidadMinima) || mayor.cantidadMinima < 2) de(`${x.id}: cantidad mínima inválida`);
    if (!esEnteroPositivo(mayor.precio) || mayor.precio >= x.precio) de(`${x.id}: el precio por mayor debe ser menor`);
  }
  return errores;
}

function erroresDeVenta(v: Venta, config: RubroConfig): string[] {
  const errores: string[] = [];
  const de = (texto: string) => errores.push(`venta ${v.id}: ${texto}`);
  if (!config.puestos.some((p) => p.numero === v.puesto)) de(`puesto ${v.puesto} no existe`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v.fecha) || !esFecha(v.fecha.slice(0, 10))) de(`fecha inválida: ${v.fecha}`);
  if (v.fecha.slice(0, 10) > config.panel.hoy) de('fecha posterior a hoy');
  if (v.lineas.length === 0) de('sin líneas');
  for (const l of v.lineas) {
    const presentacion = config.productos.find((p) => p.id === l.productoId)?.presentaciones.find((x) => x.id === l.presentacionId);
    if (!presentacion) de(`${l.productoId}:${l.presentacionId} no existe`);
    else if (presentacion.factor !== l.factor) de(`${l.productoId}: factor ${l.factor} no coincide`);
    if (!esEnteroPositivo(l.cantidad) || !esEnteroPositivo(l.precio)) de(`${l.productoId}: cantidad o precio inválido`);
  }
  return errores;
}

/** Revisa que la configuración se pueda usar en la demo. Lista vacía = todo bien. */
export function validarRubro(config: RubroConfig): string[] {
  const errores: string[] = [];
  const numeros = config.puestos.map((p) => p.numero);
  if (numeros.length < 1 || numeros.length > 3) errores.push('debe tener de 1 a 3 puestos');
  if (numeros.some((n, i) => n !== i + 1)) errores.push('los puestos se numeran 1, 2, 3 en orden');
  for (const [nombre, ids] of [
    ['productos', config.productos.map((p) => p.id)],
    ['categorías', config.categorias.map((c) => c.id)],
    ['ocasiones', config.ocasiones.map((o) => o.id)],
  ] as const) {
    for (const id of repetidos([...ids])) errores.push(`${nombre}: id repetido "${id}"`);
  }
  for (const c of config.campanas) {
    if (!config.ocasiones.some((o) => o.campana === c.id)) errores.push(`la campaña ${c.id} no tiene su ocasión`);
  }
  if (config.campanaActiva !== null && !config.campanas.some((c) => c.id === config.campanaActiva)) {
    errores.push(`la campaña activa "${config.campanaActiva}" no existe`);
  }
  for (const id of config.masVendidos) {
    if (!config.productos.some((p) => p.id === id)) errores.push(`más vendido "${id}" no existe`);
  }
  for (const p of config.productos) errores.push(...erroresDeProducto(p, config));
  for (const v of config.panel.ventas) errores.push(...erroresDeVenta(v, config));
  if (!esFecha(config.panel.hoy)) errores.push(`fecha de hoy inválida: ${config.panel.hoy}`);
  return errores;
}
