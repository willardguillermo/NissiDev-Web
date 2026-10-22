import { obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';
import { formatearSoles } from '../ui/formato';
import type { Carrito, ResultadoAgregar, ResultadoQuitar, Totales } from './carrito';

const nombre = (id: ModuloId) => obtenerModulo(id).nombre;

/** "A", "A y B", "A, B y C". */
export function unirTextos(textos: readonly string[]): string {
  if (textos.length <= 1) return textos.join('');
  return `${textos.slice(0, -1).join(', ')} y ${textos.at(-1)}`;
}

export function unirNombres(ids: ModuloId[]): string {
  return unirTextos(ids.map(nombre));
}

export function avisoAgregar(id: ModuloId, resultado: ResultadoAgregar): string {
  switch (resultado.estado) {
    case 'ya-estaba':
      return `${nombre(id)} ya está en tu sistema.`;
    case 'rechazado':
      return `${nombre(id)} se agrega junto a otro módulo. Elige primero otro módulo.`;
    case 'agregado': {
      const extra = resultado.agregadosPorDependencia;
      if (extra.length === 0) return `Agregaste ${nombre(id)}.`;
      const [verbo, pronombre] = extra.length === 1 ? ['se agregó', 'lo'] : ['se agregaron', 'los'];
      return `Agregaste ${nombre(id)}. También ${verbo} ${unirNombres(extra)}, porque ${nombre(id)} ${pronombre} necesita.`;
    }
  }
}

export function preguntaQuitar(id: ModuloId, afectados: ModuloId[]): string {
  const verbo = afectados.length === 1 ? 'se quitará' : 'se quitarán';
  return `Si quitas ${nombre(id)}, también ${verbo} ${unirNombres(afectados)}.`;
}

export function avisoQuitar(id: ModuloId, resultado: Extract<ResultadoQuitar, { estado: 'quitado' }>): string {
  const extra = resultado.tambienQuitados;
  if (extra.length === 0) return `Quitaste ${nombre(id)}.`;
  const verbo = extra.length === 1 ? 'se quitó' : 'se quitaron';
  return `Quitaste ${nombre(id)}. También ${verbo} ${unirNombres(extra)}.`;
}

export interface TextoTotales {
  inicial: string;
  notaCotizar?: string;
  mensual: string;
}

export function textoTotales({ inicial, mensual, incluyeCotizar }: Totales): TextoTotales {
  return {
    inicial: inicial > 0 ? `Desde ${formatearSoles(inicial)}` : incluyeCotizar ? 'Por cotizar' : formatearSoles(0),
    notaCotizar: inicial > 0 && incluyeCotizar ? '+ módulos por cotizar' : undefined,
    mensual: mensual > 0 ? `${formatearSoles(mensual)}/mes` : 'Sin mensualidad',
  };
}

export function avisoSugerido(nombreRubro: string, carrito: Carrito): string {
  return `Cargaste el sistema para ${nombreRubro}: ${unirNombres(carrito.items)}.`;
}

export function preguntaReemplazar(cantidad: number): string {
  return cantidad === 1
    ? 'Esto reemplaza el módulo que ya elegiste. ¿Continuar?'
    : `Esto reemplaza los ${cantidad} módulos que ya elegiste. ¿Continuar?`;
}
