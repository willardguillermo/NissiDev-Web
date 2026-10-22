import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { MODULOS, obtenerModulo, type ModuloId } from '../catalogo-servicios/modulos';
import { textoPrecio } from '../catalogo-servicios/precio';
import { calcularTotales, CARRITO_VACIO } from '../carrito/carrito';
import { $carrito, agregar, quitar } from '../carrito/store';
import { avisoAgregar, avisoQuitar, preguntaQuitar, textoTotales } from '../carrito/textos';
import './Carrito.css';

interface Pendiente {
  id: ModuloId;
  afectados: ModuloId[];
}

export default function Carrito() {
  const guardado = useStore($carrito);
  // El HTML del servidor no conoce lo guardado: hasta montar se muestra vacío para que coincidan.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const carrito = montado ? guardado : CARRITO_VACIO;

  // El aviso se ve en la tarjeta donde se actuó y se anuncia en una región solo para lectores.
  const [aviso, setAviso] = useState<{ id: ModuloId; texto: string } | null>(null);
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const botones = useRef(new Map<ModuloId, HTMLButtonElement>());
  const cancelar = useRef<HTMLButtonElement>(null);
  // Al cerrar la confirmación, el botón del módulo se vuelve a dibujar: el foco se mueve después de dibujar.
  const [enfocar, setEnfocar] = useState<ModuloId | null>(null);

  useEffect(() => {
    if (pendiente) cancelar.current?.focus();
  }, [pendiente]);

  useEffect(() => {
    if (!enfocar) return;
    botones.current.get(enfocar)?.focus();
    setEnfocar(null);
  }, [enfocar]);

  const alternar = (id: ModuloId) => {
    if (!carrito.items.includes(id)) {
      setAviso({ id, texto: avisoAgregar(id, agregar(id)) });
      return;
    }
    const resultado = quitar(id);
    if (resultado.estado === 'requiere-confirmacion') {
      setPendiente({ id, afectados: resultado.afectados });
      return;
    }
    setAviso({ id, texto: avisoQuitar(id, resultado) });
  };

  const confirmarQuitar = (id: ModuloId) => {
    const resultado = quitar(id, { confirmado: true });
    if (resultado.estado === 'quitado') setAviso({ id, texto: avisoQuitar(id, resultado) });
    setPendiente(null);
    setEnfocar(id);
  };

  const cancelarQuitar = (id: ModuloId) => {
    setPendiente(null);
    setEnfocar(id);
  };

  const totales = textoTotales(calcularTotales(carrito));
  const cantidad = carrito.items.length;

  return (
    <div className="carrito">
      <ul className="carrito-modulos" role="list">
        {MODULOS.map((modulo) => {
          const elegido = carrito.items.includes(modulo.id);
          const necesita = modulo.dependencias.map((dep) => obtenerModulo(dep).nombre);
          return (
            <li key={modulo.id} className={elegido ? 'carrito-modulo carrito-modulo--elegido' : 'carrito-modulo'}>
              <h2 className="carrito-modulo__nombre">{modulo.nombre}</h2>
              {elegido && <p className="carrito-modulo__marca">✓ En tu sistema</p>}
              <p>{modulo.descripcion}</p>
              <p className="carrito-modulo__precio">{textoPrecio(modulo)}</p>
              {necesita.length > 0 && <p className="carrito-modulo__nota">Necesita: {necesita.join(', ')}</p>}
              {modulo.requiereOtroModulo && <p className="carrito-modulo__nota">Se agrega junto a otro módulo.</p>}

              {pendiente?.id === modulo.id ? (
                <div className="carrito-confirmar" role="group" aria-labelledby={`pregunta-${modulo.id}`}>
                  <p id={`pregunta-${modulo.id}`}>{preguntaQuitar(modulo.id, pendiente.afectados)}</p>
                  <div className="carrito-confirmar__botones">
                    <button type="button" className="carrito-boton" onClick={() => confirmarQuitar(modulo.id)}>
                      Sí, quitar
                    </button>
                    <button
                      ref={cancelar}
                      type="button"
                      className="carrito-boton carrito-boton--secundario"
                      onClick={() => cancelarQuitar(modulo.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  ref={(boton) => {
                    if (boton) botones.current.set(modulo.id, boton);
                    else botones.current.delete(modulo.id);
                  }}
                  type="button"
                  className={elegido ? 'carrito-boton carrito-boton--secundario' : 'carrito-boton'}
                  onClick={() => alternar(modulo.id)}
                >
                  {elegido ? 'Quitar' : 'Agregar'}
                  <span className="solo-lector"> {modulo.nombre}</span>
                </button>
              )}
              {aviso?.id === modulo.id && (
                <p className="carrito-modulo__aviso" aria-hidden="true">
                  {aviso.texto}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="solo-lector" role="status">
        {aviso?.texto}
      </p>

      <section className="carrito-resumen zona-oscura" aria-label="Resumen de tu sistema">
        {cantidad === 0 ? (
          <p>Aún no elegiste módulos.</p>
        ) : (
          <dl className="carrito-resumen__totales">
            <div>
              <dt>Inversión inicial</dt>
              <dd>
                {totales.inicial}
                {totales.notaCotizar && <span className="carrito-resumen__nota"> {totales.notaCotizar}</span>}
              </dd>
            </div>
            <div>
              <dt>Mensualidad</dt>
              <dd>{totales.mensual}</dd>
            </div>
          </dl>
        )}
        <p className="carrito-resumen__referencial">
          {cantidad === 1 ? '1 módulo' : `${cantidad} módulos`} · Precios referenciales
        </p>
      </section>
    </div>
  );
}
