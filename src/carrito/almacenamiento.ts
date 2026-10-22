// Motor de almacenamiento para @nanostores/persistent que nunca lanza errores.
// localStorage puede fallar al leer o escribir (modo privado, cuota llena, bloqueado por el usuario);
// en ese caso los datos viven en memoria y la página sigue funcionando, solo que sin persistir.

type Intento<T> = { ok: true; valor: T } | { ok: false };

function intentar<T>(accion: () => T): Intento<T> {
  try {
    return { ok: true, valor: accion() };
  } catch {
    return { ok: false };
  }
}

export function crearAlmacenamientoSeguro(obtenerStorage: () => Storage): Record<string, string> {
  const memoria = new Map<string, string>();
  // Claves cuya última escritura falló: el valor válido es el de memoria, no el del storage real.
  const soloEnMemoria = new Set<string>();

  const leer = (clave: string): string | undefined => {
    if (soloEnMemoria.has(clave)) return memoria.get(clave);
    const lectura = intentar(() => obtenerStorage().getItem(clave));
    if (lectura.ok) return lectura.valor ?? undefined;
    return memoria.get(clave);
  };

  return new Proxy<Record<string, string>>(
    {},
    {
      get: (_objetivo, clave) => (typeof clave === 'string' ? leer(clave) : undefined),
      has: (_objetivo, clave) => typeof clave === 'string' && leer(clave) !== undefined,
      set: (_objetivo, clave, valor) => {
        if (typeof clave !== 'string') return false;
        memoria.set(clave, String(valor));
        const escritura = intentar(() => obtenerStorage().setItem(clave, String(valor)));
        if (escritura.ok) soloEnMemoria.delete(clave);
        else soloEnMemoria.add(clave);
        return true;
      },
      deleteProperty: (_objetivo, clave) => {
        if (typeof clave !== 'string') return false;
        memoria.delete(clave);
        soloEnMemoria.delete(clave);
        intentar(() => obtenerStorage().removeItem(clave));
        return true;
      },
    },
  );
}
