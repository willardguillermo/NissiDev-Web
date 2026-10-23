// Peor caso realista para probar la demo (break-ui). Solo se usa en desarrollo con ?datos=peor.
// Mismos datos que la plantilla, con los valores largos o extremos que un negocio real podría tener.
import type { RubroConfig } from '../../demo/tipos';
import { DULCERIA_COMPLETA } from './config';

const [p1, p2, p3, p4, ...resto] = DULCERIA_COMPLETA.productos;

export const DULCERIA_PEOR_CASO: RubroConfig = {
  ...DULCERIA_COMPLETA,
  negocio: 'Distribuidora de Dulces y Artículos para Fiestas Santa Rosa de Lima E.I.R.L.',
  puestos: DULCERIA_COMPLETA.puestos.map((p, i) =>
    i === 1 ? { ...p, nombre: 'Puesto 2 – Galería Comercial Santa Anita, segundo piso', referencia: 'Frente a la escalera mecánica, al costado de la tienda de celulares' } : p,
  ),
  productos: [
    { ...p1, nombre: 'Chocolate de leche con maní, pasas y galleta crocante (edición Halloween)', marca: 'Confitería Artesanal Hermanos Quispe Mamani' },
    { ...p2, nombre: 'Té', marca: 'Sol' },
    { ...p3, stock: 120_000 },
    { ...p4, nombre: 'Monedas de chocolate bañadas en dorado para piñata x50', stock: 1 },
    ...resto,
  ],
};
