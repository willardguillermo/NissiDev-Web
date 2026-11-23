import { useState } from 'react';
import { textoMantenimientoVitrina, textoPrecioVitrina, VITRINA, type SeleccionVitrina } from '../catalogo-servicios/vitrina';
import { cambiarVitrina } from '../carrito/store';
import { Interruptor } from './Interruptor';

/** Paquete Vitrina en /cotizar: aparte de los módulos, con precio cerrado, plazo y su mantenimiento. */
export default function VitrinaCarrito({ vitrina }: { vitrina: SeleccionVitrina }) {
  const [aviso, setAviso] = useState('');

  const alternarVitrina = () => {
    const elegida = !vitrina.elegida;
    cambiarVitrina({ elegida });
    setAviso(elegida ? `Agregaste la ${VITRINA.nombre}.` : `Quitaste la ${VITRINA.nombre}.`);
  };
  const alternarMantenimiento = () => {
    const mantenimiento = !vitrina.mantenimiento;
    cambiarVitrina({ mantenimiento });
    setAviso(mantenimiento ? `Agregaste el ${VITRINA.mantenimiento.nombre}.` : `Quitaste el ${VITRINA.mantenimiento.nombre}.`);
  };

  return (
    <section id="vitrina" className="carrito-vitrina" aria-labelledby="vitrina-titulo">
      <p className="carrito-vitrina__etiqueta">Paquete aparte · no es un módulo</p>
      <div className="carrito-modulo carrito-vitrina__tarjeta">
        <div className="carrito-modulo__info">
          <h2 id="vitrina-titulo" className="carrito-modulo__nombre">
            {VITRINA.nombre}
          </h2>
          <p className="carrito-modulo__precio">{textoPrecioVitrina()}</p>
          <p className="carrito-modulo__descripcion">{VITRINA.descripcion}</p>
          <ul className="carrito-vitrina__incluye">
            {VITRINA.incluye.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="carrito-modulo__nota">
            Entrega en {VITRINA.plazo}. {VITRINA.dominio}
          </p>
        </div>
        <Interruptor encendido={vitrina.elegida} etiqueta={VITRINA.nombre} onCambiar={alternarVitrina} />

        {vitrina.elegida && (
          <div className="carrito-vitrina__extra">
            <div className="carrito-modulo__info">
              <h3 className="carrito-vitrina__extra-nombre">{VITRINA.mantenimiento.nombre}</h3>
              <p className="carrito-modulo__precio">{textoMantenimientoVitrina()}</p>
              <p className="carrito-modulo__descripcion">Cambios de fotos, horario o datos y soporte cuando lo necesites.</p>
            </div>
            <Interruptor encendido={vitrina.mantenimiento} etiqueta={VITRINA.mantenimiento.nombre} onCambiar={alternarMantenimiento} />
          </div>
        )}
        {aviso && (
          <p className="carrito-aviso" role="status">
            {aviso}
          </p>
        )}
      </div>
    </section>
  );
}
