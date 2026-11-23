import type { Inmueble } from '../../demo/inmuebles/tipos';

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** m², dormitorios, baños (y en la ficha, estacionamientos). Lo que es 0 no se muestra. */
export function Datos({ inmueble, corto = false }: { inmueble: Inmueble; corto?: boolean }) {
  const datos = [
    { clave: 'area', nombre: 'Área', valor: `${inmueble.area} m²` },
    inmueble.dormitorios > 0 && {
      clave: 'dorm',
      nombre: 'Dormitorios',
      valor: corto ? `${inmueble.dormitorios} dorm.` : plural(inmueble.dormitorios, 'dormitorio', 'dormitorios'),
    },
    inmueble.banos > 0 && { clave: 'banos', nombre: 'Baños', valor: plural(inmueble.banos, 'baño', 'baños') },
    !corto &&
      inmueble.estacionamientos > 0 && {
        clave: 'estac',
        nombre: 'Estacionamientos',
        valor: plural(inmueble.estacionamientos, 'estacionamiento', 'estacionamientos'),
      },
  ].filter((d) => d !== false);

  return (
    <dl className={corto ? 'inmo-datos inmo-datos--corto' : 'inmo-datos'}>
      {datos.map((d) => (
        <div key={d.clave}>
          <dt className={corto ? 'solo-lector' : undefined}>{d.nombre}</dt>
          <dd>{d.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
