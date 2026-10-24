import { useStore } from '@nanostores/react';
import { useEffect, useId, useState } from 'react';
import { $carrito } from '../carrito/store';
import { crearCotizacion } from '../cotizacion/cotizacion';
import { fechaLocalDeHoy } from '../cotizacion/fecha';
import type { Cotizacion as DatosCotizacion } from '../cotizacion/tipos';
import CotizacionImpresa from './cotizacion/CotizacionImpresa';
import Ticketera from './cotizacion/Ticketera';
import './Cotizacion.css';

export default function Cotizacion() {
  const carrito = useStore($carrito);
  // Código y fecha se crean una vez, en el navegador (usan crypto y la fecha local): no cambian al
  // escribir el nombre del negocio. En el HTML del servidor no hay cotización todavía.
  const [emision, setEmision] = useState<Pick<DatosCotizacion, 'codigo' | 'emitida' | 'validaHasta'> | null>(null);
  const [negocio, setNegocio] = useState('');
  const idNegocio = useId();

  useEffect(() => {
    const { codigo, emitida, validaHasta } = crearCotizacion({ carrito: $carrito.get(), emitida: fechaLocalDeHoy() });
    setEmision({ codigo, emitida, validaHasta });
  }, []);

  if (emision && carrito.items.length === 0) {
    return (
      <div className="cotizacion"><div className="cotizacion-vacia">
        <p className="cotizacion-vacia__titulo">Aún no elegiste módulos.</p>
        <p>Arma tu sistema y aquí verás tu cotización.</p>
        <a className="cotizacion-boton" href="/arma-tu-sistema">
          Ir a Arma tu sistema
        </a>
      </div></div>
    );
  }

  // El carrito puede cambiar en otra pestaña: los módulos y totales siempre son los actuales.
  const cotizacion: DatosCotizacion | null = emision ? { ...emision, carrito, negocio } : null;

  return (
    <div className="cotizacion">
      <div className="cotizacion__negocio">
        <label htmlFor={idNegocio}>
          Nombre de tu negocio <span className="cotizacion__opcional">(opcional)</span>
        </label>
        <input
          id={idNegocio}
          type="text"
          value={negocio}
          maxLength={80}
          autoComplete="organization"
          onChange={(evento) => setNegocio(evento.target.value)}
        />
      </div>

      {cotizacion ? <CotizacionImpresa cotizacion={cotizacion} /> : <Ticketera fase="preparando" />}
    </div>
  );
}
