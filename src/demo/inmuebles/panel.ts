import type { Consulta, InmobiliariaConfig, Inmueble } from './tipos';

// Cálculos de la vista del dueño. Todo sale de la config y de su "hoy" fijo; la vista no tiene números escritos.

const DIA = 86_400_000;
const aDias = (fecha: string) => Date.UTC(+fecha.slice(0, 4), +fecha.slice(5, 7) - 1, +fecha.slice(8, 10)) / DIA;
const haceDias = (fecha: string, hoy: string) => aDias(hoy) - aDias(fecha.slice(0, 10));

/** Consultas de los últimos 7 días (hoy incluido). */
export function consultasDeLaSemana(config: InmobiliariaConfig): Consulta[] {
  return config.panel.consultas.filter((c) => {
    const dias = haceDias(c.fecha, config.panel.hoy);
    return dias >= 0 && dias <= 6;
  });
}

export function inmueblesActivos(config: InmobiliariaConfig) {
  const { inmuebles } = config;
  return {
    total: inmuebles.length,
    venta: inmuebles.filter((i) => i.operacion === 'venta').length,
    alquiler: inmuebles.filter((i) => i.operacion === 'alquiler').length,
    separados: inmuebles.filter((i) => i.estado === 'separado').length,
  };
}

export interface ConDato {
  inmueble: Inmueble;
  valor: number;
}

const ordenar = (lista: ConDato[], maximo: number) =>
  lista
    .filter((x) => x.valor > 0)
    .sort((a, b) => b.valor - a.valor || a.inmueble.codigo.localeCompare(b.inmueble.codigo))
    .slice(0, maximo);

/** Consultas de la semana por inmueble, de más a menos (los que no tienen, no aparecen). */
export function consultasPorInmueble(config: InmobiliariaConfig, maximo = 5): ConDato[] {
  const semana = consultasDeLaSemana(config);
  return ordenar(
    config.inmuebles.map((inmueble) => ({ inmueble, valor: semana.filter((c) => c.codigo === inmueble.codigo).length })),
    maximo,
  );
}

/** Los más vistos de los últimos 7 días. */
export function masVistos(config: InmobiliariaConfig, maximo = 5): ConDato[] {
  return ordenar(
    config.inmuebles.map((inmueble) => ({ inmueble, valor: config.panel.vistas[inmueble.codigo] ?? 0 })),
    maximo,
  );
}

/** Revisa que los datos se puedan usar en la demo. Lista vacía = todo bien. */
export function validarInmobiliaria(config: InmobiliariaConfig): string[] {
  const errores: string[] = [];
  const codigos = config.inmuebles.map((i) => i.codigo);
  for (const c of codigos.filter((c, i) => codigos.indexOf(c) !== i)) errores.push(`código repetido: ${c}`);
  for (const i of config.inmuebles) {
    const de = (texto: string) => errores.push(`${i.codigo}: ${texto}`);
    if (!config.distritos.includes(i.distrito)) de(`distrito "${i.distrito}" no existe`);
    if (!Number.isSafeInteger(i.precio.centimos) || i.precio.centimos <= 0) de('precio inválido');
    if (!Number.isSafeInteger(i.area) || i.area <= 0) de('área inválida');
    if (i.galeria.length === 0) de('galería vacía');
    if (i.mapa.x < 0 || i.mapa.x > 1 || i.mapa.y < 0 || i.mapa.y > 1) de('posición del mapa fuera de 0 a 1');
    if (i.publicado > config.panel.hoy) de('publicado después de hoy');
  }
  for (const c of config.panel.consultas) {
    if (!codigos.includes(c.codigo)) errores.push(`consulta de un inmueble que no existe: ${c.codigo}`);
    if (c.fecha.slice(0, 10) > config.panel.hoy) errores.push(`consulta posterior a hoy: ${c.fecha}`);
  }
  for (const codigo of Object.keys(config.panel.vistas)) {
    if (!codigos.includes(codigo)) errores.push(`vistas de un inmueble que no existe: ${codigo}`);
  }
  if (!(config.tipoCambio > 0)) errores.push('tipo de cambio inválido');
  return errores;
}
