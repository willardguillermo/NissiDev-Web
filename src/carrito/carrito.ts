import { obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';

export interface Carrito {
  items: ModuloId[];
}

export const CARRITO_VACIO: Carrito = { items: [] };

export type ResultadoAgregar =
  | { estado: 'agregado'; carrito: Carrito; agregadosPorDependencia: ModuloId[] }
  | { estado: 'ya-estaba'; carrito: Carrito }
  | { estado: 'rechazado'; carrito: Carrito; motivo: 'requiere-otro-modulo' };

export type ResultadoQuitar =
  | { estado: 'quitado'; carrito: Carrito; tambienQuitados: ModuloId[] }
  | { estado: 'requiere-confirmacion'; carrito: Carrito; afectados: ModuloId[] };

export interface Totales {
  /** Suma de los precios "desde", en céntimos. */
  inicial: number;
  /** Suma de las mensualidades, en céntimos. */
  mensual: number;
  /** Hay al menos un módulo cuyo precio inicial es "Cotizar". */
  incluyeCotizar: boolean;
}

/** Dependencias directas e indirectas, de la más básica a la más cercana. */
function dependenciasTransitivas(id: ModuloId): ModuloId[] {
  const resultado: ModuloId[] = [];
  const visitar = (actual: ModuloId) => {
    for (const dep of obtenerModulo(actual).dependencias) {
      visitar(dep);
      if (!resultado.includes(dep)) resultado.push(dep);
    }
  };
  visitar(id);
  return resultado;
}

const soloQuedanDependientesDeOtro = (items: ModuloId[]) =>
  items.length > 0 && items.every((id) => obtenerModulo(id).requiereOtroModulo);

export function agregarModulo(carrito: Carrito, id: ModuloId): ResultadoAgregar {
  if (carrito.items.includes(id)) return { estado: 'ya-estaba', carrito };

  const faltantes = dependenciasTransitivas(id).filter((dep) => !carrito.items.includes(dep));
  if (obtenerModulo(id).requiereOtroModulo && carrito.items.length + faltantes.length === 0) {
    return { estado: 'rechazado', carrito, motivo: 'requiere-otro-modulo' };
  }

  return {
    estado: 'agregado',
    carrito: { items: [...carrito.items, ...faltantes, id] },
    agregadosPorDependencia: faltantes,
  };
}

export function quitarModulo(
  carrito: Carrito,
  id: ModuloId,
  { confirmado = false }: { confirmado?: boolean } = {},
): ResultadoQuitar {
  if (!carrito.items.includes(id)) return { estado: 'quitado', carrito, tambienQuitados: [] };

  const dependientes = carrito.items.filter((otro) => dependenciasTransitivas(otro).includes(id));
  let restantes = carrito.items.filter((otro) => otro !== id && !dependientes.includes(otro));
  const afectados = [...dependientes];
  if (soloQuedanDependientesDeOtro(restantes)) {
    afectados.push(...restantes);
    restantes = [];
  }

  if (afectados.length > 0 && !confirmado) {
    return { estado: 'requiere-confirmacion', carrito, afectados };
  }
  return { estado: 'quitado', carrito: { items: restantes }, tambienQuitados: afectados };
}

export function calcularTotales(carrito: Carrito): Totales {
  return carrito.items.reduce<Totales>(
    (totales, id) => {
      const { precioInicial, mensualidad = 0 } = obtenerModulo(id);
      return {
        inicial: totales.inicial + (precioInicial.tipo === 'desde' ? precioInicial.centimos : 0),
        mensual: totales.mensual + mensualidad,
        incluyeCotizar: totales.incluyeCotizar || precioInicial.tipo === 'cotizar',
      };
    },
    { inicial: 0, mensual: 0, incluyeCotizar: false },
  );
}
