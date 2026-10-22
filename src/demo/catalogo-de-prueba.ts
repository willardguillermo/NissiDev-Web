// Catálogo pequeño SOLO para los tests del motor de demos (la app no lo importa).
// Los ~30 productos de Dulcería La Golosa son de la T15.
import type { Producto } from './tipos';

export const CHOCOLATE: Producto = {
  id: 'choco-luna',
  nombre: 'Chocolate Luna',
  marca: 'Lunar Dulces',
  categoria: 'chocolates',
  ocasiones: ['cumpleanos', 'por-mayor'],
  puestos: [1, 2],
  etiqueta: 'nuevo',
  stock: 72,
  presentaciones: [
    { id: 'unidad', nombre: 'Unidad', factor: 1, precio: 150 },
    { id: 'bolsa', nombre: 'Bolsa x6', factor: 6, precio: 800, precioMayorista: { cantidadMinima: 5, precio: 700 } },
    { id: 'caja', nombre: 'Caja x24', factor: 24, precio: 3000, precioMayorista: { cantidadMinima: 3, precio: 2700 } },
  ],
};

export const GOMITAS: Producto = {
  id: 'gomitas-osito',
  nombre: 'Gomitas Osito',
  marca: 'Gomilandia',
  categoria: 'gomitas',
  ocasiones: ['halloween', 'bolsitas-sorpresa'],
  puestos: [2],
  stock: 8,
  presentaciones: [
    { id: 'unidad', nombre: 'Unidad', factor: 1, precio: 50 },
    { id: 'bolsa', nombre: 'Bolsa x6', factor: 6, precio: 270 },
  ],
};

export const GALLETON: Producto = {
  id: 'galleton-avena',
  nombre: 'Galletón de avena',
  marca: 'Doña Ñata',
  categoria: 'galletas',
  ocasiones: ['bolsitas-sorpresa'],
  puestos: [3],
  etiqueta: 'oferta',
  stock: 40,
  presentaciones: [{ id: 'unidad', nombre: 'Unidad', factor: 1, precio: 120 }],
};

export const PINATA: Producto = {
  id: 'pinata-estrella',
  nombre: 'Piñata Estrella',
  marca: 'Fiesta Feliz',
  categoria: 'piñatería',
  ocasiones: ['cumpleanos'],
  puestos: [3],
  etiqueta: 'agotado',
  stock: 0,
  presentaciones: [{ id: 'unidad', nombre: 'Unidad', factor: 1, precio: 2500 }],
};

export const CATALOGO_DE_PRUEBA: Producto[] = [CHOCOLATE, GOMITAS, GALLETON, PINATA];
