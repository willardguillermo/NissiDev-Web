// Productos de ejemplo de la plantilla de dulcería (negocio ficticio "Dulcería La Golosa").
// Marcas ficticias y precios inventados, creíbles para Lima, en céntimos. El stock va en unidad base.
// Los puestos se escriben pensando en 3; con menos, personalizar() los reparte.
import type { Presentacion, Producto } from '../../demo/tipos';

type Mayor = [cantidadMinima: number, precio: number];

const conMayor = (presentacion: Presentacion, mayor?: Mayor): Presentacion =>
  mayor ? { ...presentacion, precioMayorista: { cantidadMinima: mayor[0], precio: mayor[1] } } : presentacion;

const unidad = (precio: number): Presentacion => ({ id: 'unidad', nombre: 'Unidad', factor: 1, precio });
const bolsa = (factor: number, precio: number, mayor?: Mayor) =>
  conMayor({ id: 'bolsa', nombre: `Bolsa x${factor}`, factor, precio }, mayor);
const caja = (factor: number, precio: number, mayor?: Mayor) =>
  conMayor({ id: 'caja', nombre: `Caja x${factor}`, factor, precio }, mayor);

export const PRODUCTOS: Producto[] = [
  // Chocolates
  { id: 'barra-leche', nombre: 'Barra de chocolate con leche', marca: 'Dulcemonte', categoria: 'chocolates', ocasiones: ['cumpleanos', 'por-mayor'], puestos: [1, 3], stock: 240, vence: '2027-03-15', presentaciones: [unidad(150), caja(24, 3000, [3, 2700])] },
  { id: 'bombones-mani', nombre: 'Bombones de maní', marca: 'Dulcemonte', categoria: 'chocolates', ocasiones: ['bolsitas-sorpresa', 'halloween'], puestos: [1], stock: 600, vence: '2027-01-20', presentaciones: [unidad(50), bolsa(50, 2200, [4, 2000])] },
  { id: 'chocolate-relleno', nombre: 'Chocolate relleno de galleta', marca: 'Lunar Dulces', categoria: 'chocolates', ocasiones: ['cumpleanos'], puestos: [1, 3], etiqueta: 'nuevo', stock: 144, vence: '2027-02-10', presentaciones: [unidad(120), caja(24, 2600, [3, 2400])] },
  { id: 'monedas-chocolate', nombre: 'Monedas de chocolate', marca: 'Lunar Dulces', categoria: 'chocolates', ocasiones: ['navidad', 'bolsitas-sorpresa'], puestos: [1], stock: 500, vence: '2027-04-01', presentaciones: [unidad(30), bolsa(50, 1300)] },
  { id: 'calabacitas-chocolate', nombre: 'Calabacitas de chocolate', marca: 'Dulcemonte', categoria: 'chocolates', ocasiones: ['halloween'], puestos: [1, 2], etiqueta: 'oferta', stock: 288, vence: '2026-10-27', presentaciones: [unidad(80), bolsa(24, 1700)] },
  { id: 'chocolate-taza', nombre: 'Chocolate para taza', marca: 'Dulcemonte', categoria: 'chocolates', ocasiones: ['navidad', 'por-mayor'], puestos: [1, 3], stock: 60, vence: '2027-06-30', presentaciones: [unidad(350), caja(12, 3900)] },

  // Gomitas
  { id: 'gomitas-ositos', nombre: 'Gomitas ositos', marca: 'Gomilandia', categoria: 'gomitas', ocasiones: ['bolsitas-sorpresa', 'dia-del-nino', 'cumpleanos'], puestos: [2], stock: 480, vence: '2027-01-05', presentaciones: [unidad(60), caja(24, 1300, [4, 1200])] },
  { id: 'gusanitos-acidos', nombre: 'Gusanitos ácidos', marca: 'Gomilandia', categoria: 'gomitas', ocasiones: ['halloween', 'bolsitas-sorpresa'], puestos: [2], etiqueta: 'nuevo', stock: 400, vence: '2026-12-12', presentaciones: [unidad(40), bolsa(50, 1800, [5, 1600])] },
  { id: 'dientes-vampiro', nombre: 'Dientes de vampiro', marca: 'Gomilandia', categoria: 'gomitas', ocasiones: ['halloween'], puestos: [2, 3], stock: 350, vence: '2026-10-25', presentaciones: [unidad(20), bolsa(50, 900)] },
  { id: 'gomitas-frutas', nombre: 'Gomitas de frutas surtidas', marca: 'Mielcita', categoria: 'gomitas', ocasiones: ['cumpleanos', 'bolsitas-sorpresa'], puestos: [2], stock: 18, vence: '2026-11-30', presentaciones: [unidad(30), bolsa(50, 1300)] },
  { id: 'malvaviscos', nombre: 'Malvaviscos de colores', marca: 'Mielcita', categoria: 'gomitas', ocasiones: ['cumpleanos', 'navidad'], puestos: [2], etiqueta: 'agotado', stock: 0, vence: '2027-02-28', presentaciones: [unidad(40), bolsa(50, 1500)] },

  // Galletas
  { id: 'galletas-vainilla', nombre: 'Galletas de vainilla', marca: 'Abuela Tula', categoria: 'galletas', ocasiones: ['bolsitas-sorpresa', 'por-mayor'], puestos: [1, 3], stock: 360, vence: '2026-12-20', presentaciones: [unidad(70), caja(24, 1500, [3, 1350])] },
  { id: 'galletas-fresa', nombre: 'Galletas rellenas de fresa', marca: 'Abuela Tula', categoria: 'galletas', ocasiones: ['cumpleanos', 'dia-del-nino'], puestos: [1], stock: 240, vence: '2027-01-15', presentaciones: [unidad(80), caja(24, 1700)] },
  { id: 'galletas-animalitos', nombre: 'Galletas de animalitos', marca: 'Lunar Dulces', categoria: 'galletas', ocasiones: ['dia-del-nino', 'bolsitas-sorpresa'], puestos: [1], etiqueta: 'nuevo', stock: 300, vence: '2027-02-01', presentaciones: [unidad(50), bolsa(50, 2200)] },
  { id: 'galletas-coco', nombre: 'Galletas de coco', marca: 'Abuela Tula', categoria: 'galletas', ocasiones: [], puestos: [1], stock: 96, vence: '2026-11-10', presentaciones: [unidad(60), caja(24, 1300)] },
  { id: 'galletas-jengibre', nombre: 'Galletas de jengibre', marca: 'Lunar Dulces', categoria: 'galletas', ocasiones: ['navidad'], puestos: [1], stock: 72, vence: '2026-10-28', presentaciones: [unidad(150), caja(12, 1600)] },

  // Caramelos
  { id: 'caramelos-leche', nombre: 'Caramelos de leche', marca: 'Mielcita', categoria: 'caramelos', ocasiones: ['bolsitas-sorpresa', 'por-mayor'], puestos: [2, 3], stock: 1500, vence: '2027-05-01', presentaciones: [unidad(20), bolsa(50, 800, [6, 700])] },
  { id: 'chupetines-corazon', nombre: 'Chupetines de corazón', marca: 'Mielcita', categoria: 'caramelos', ocasiones: ['cumpleanos', 'bolsitas-sorpresa'], puestos: [2], stock: 600, vence: '2027-04-15', presentaciones: [unidad(30), bolsa(50, 1200)] },
  { id: 'caramelos-menta', nombre: 'Caramelos de menta', marca: 'Mielcita', categoria: 'caramelos', ocasiones: [], puestos: [2], etiqueta: 'oferta', stock: 900, vence: '2027-07-01', presentaciones: [unidad(20), bolsa(50, 700)] },
  { id: 'chupetines-calavera', nombre: 'Chupetines de calavera', marca: 'Mielcita', categoria: 'caramelos', ocasiones: ['halloween'], puestos: [2], etiqueta: 'nuevo', stock: 240, vence: '2027-03-01', presentaciones: [unidad(50), bolsa(24, 1000)] },
  { id: 'bastones-caramelo', nombre: 'Bastones de caramelo', marca: 'Mielcita', categoria: 'caramelos', ocasiones: ['navidad'], puestos: [2], stock: 192, vence: '2027-06-01', presentaciones: [unidad(40), bolsa(24, 800)] },

  // Snacks
  { id: 'papitas-hilo', nombre: 'Papitas al hilo', marca: 'Crocantito', categoria: 'snacks', ocasiones: ['cumpleanos', 'por-mayor'], puestos: [2, 3], stock: 288, vence: '2026-12-05', presentaciones: [unidad(100), caja(24, 2200, [3, 2000])] },
  { id: 'chifles', nombre: 'Chifles salados', marca: 'Crocantito', categoria: 'snacks', ocasiones: ['cumpleanos'], puestos: [2], stock: 120, vence: '2026-11-20', presentaciones: [unidad(120), caja(24, 2600)] },
  { id: 'canchita-dulce', nombre: 'Canchita dulce', marca: 'Crocantito', categoria: 'snacks', ocasiones: ['dia-del-nino', 'cumpleanos'], puestos: [2], stock: 144, vence: '2026-11-25', presentaciones: [unidad(80), bolsa(12, 900)] },
  { id: 'mani-confitado', nombre: 'Maní confitado', marca: 'Crocantito', categoria: 'snacks', ocasiones: ['bolsitas-sorpresa'], puestos: [2], stock: 14, vence: '2026-10-30', presentaciones: [unidad(50), bolsa(50, 2300)] },
  { id: 'habas-tostadas', nombre: 'Habas tostadas', marca: 'Crocantito', categoria: 'snacks', ocasiones: [], puestos: [2, 3], etiqueta: 'oferta', stock: 96, vence: '2027-01-10', presentaciones: [unidad(100), caja(24, 2200)] },

  // Piñatería (no vence)
  { id: 'globos-colores', nombre: 'Globos de colores', marca: 'Fiestón', categoria: 'pinateria', ocasiones: ['cumpleanos', 'dia-del-nino'], puestos: [1, 3], stock: 1000, presentaciones: [unidad(30), bolsa(50, 1200, [5, 1050])] },
  { id: 'bolsitas-fiesta', nombre: 'Bolsitas para sorpresas', marca: 'Fiestón', categoria: 'pinateria', ocasiones: ['bolsitas-sorpresa', 'cumpleanos'], puestos: [1], stock: 800, presentaciones: [unidad(20), bolsa(50, 600)] },
  { id: 'velitas-numero', nombre: 'Velitas de número', marca: 'Fiestón', categoria: 'pinateria', ocasiones: ['cumpleanos'], puestos: [1], stock: 72, presentaciones: [unidad(250), caja(24, 5000)] },
  { id: 'sombreritos', nombre: 'Sombreritos de fiesta', marca: 'Fiestón', categoria: 'pinateria', ocasiones: ['cumpleanos', 'dia-del-nino'], puestos: [1], stock: 240, presentaciones: [unidad(60), bolsa(12, 650)] },
  { id: 'bolsa-calabaza', nombre: 'Bolsa calabaza para dulces', marca: 'Fiestón', categoria: 'pinateria', ocasiones: ['halloween'], puestos: [1], etiqueta: 'nuevo', stock: 48, presentaciones: [unidad(350), caja(12, 3600)] },
];
