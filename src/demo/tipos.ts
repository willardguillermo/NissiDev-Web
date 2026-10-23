// Modelo de datos de las demos: el mismo que usaría el sistema real.
// Montos en céntimos enteros. Stock y cantidades del pedido se piensan en unidad base.

export interface PrecioMayorista {
  /** Desde cuántas presentaciones (bolsas, cajas…) en la misma línea aplica. */
  cantidadMinima: number;
  /** Precio por presentación, en céntimos. */
  precio: number;
}

export interface Presentacion {
  id: string;
  /** "Unidad", "Bolsa x6", "Caja x24" */
  nombre: string;
  /** Cuántas unidades base trae. La unidad base tiene factor 1. */
  factor: number;
  /** Precio por presentación, en céntimos. */
  precio: number;
  precioMayorista?: PrecioMayorista;
}

export type Etiqueta = 'nuevo' | 'oferta' | 'agotado';

export interface Producto {
  id: string;
  nombre: string;
  /** Siempre ficticia en la demo. */
  marca: string;
  categoria: string;
  ocasiones: string[];
  /** Números de puesto donde se encuentra. */
  puestos: number[];
  etiqueta?: Etiqueta;
  /** Existencias en unidad base. */
  stock: number;
  presentaciones: Presentacion[];
  /** Vencimiento más próximo (AAAA-MM-DD). Sin fecha si no vence (piñatería). */
  vence?: string;
}

export interface Puesto {
  numero: number;
  nombre: string;
  queSeEncuentra: string;
  horario: string;
  referencia: string;
}

export type CampanaId = 'halloween' | 'navidad' | 'dia-del-nino';

/** Ocasión de compra. Si es de una campaña, solo se ve con esa campaña activa. */
export interface Ocasion {
  id: string;
  nombre: string;
  descripcion: string;
  campana?: CampanaId;
  /** Solo tiene sentido si el negocio vende por mayor. */
  soloPorMayor?: boolean;
}

/** Hero de temporada. */
export interface Campana {
  id: CampanaId;
  nombre: string;
  titular: string;
  bajada: string;
  /** Ilustración del hero (ver islas/demo/Ilustracion.tsx). */
  ilustracion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  /** Nombre de la ilustración propia (ver islas/demo/Ilustracion.tsx). */
  ilustracion: string;
}

/** Colores y tipografías del negocio; la demo los vuelve variables CSS. */
export interface TemaDemo {
  marca: string;
  /** Texto sobre el color de marca (botones). */
  sobreMarca: string;
  /** Marca usada como texto sobre el fondo, con contraste suficiente. */
  marcaTexto: string;
  texto: string;
  textoSuave: string;
  fondo: string;
  fondoSuave: string;
  /** Solo para etiquetas pequeñas, con texto oscuro encima. */
  etiquetaAmarilla: string;
  etiquetaTurquesa: string;
  fuenteTitulos: string;
  fuenteTexto: string;
}

export type MedioPago = 'efectivo' | 'yape' | 'plin';

/** Línea de una venta: guarda la presentación, su factor y el precio cobrado (por presentación). */
export interface LineaVenta {
  productoId: string;
  presentacionId: string;
  factor: number;
  cantidad: number;
  precio: number;
}

/** Venta ficticia para el panel del dueño. */
export interface Venta {
  id: string;
  /** Fecha y hora local: "2026-10-24T10:35". */
  fecha: string;
  puesto: number;
  medio: MedioPago;
  lineas: LineaVenta[];
}

/** Todo lo propio del negocio. Ningún componente de la demo tiene estos datos fijos. */
export interface RubroConfig {
  id: string;
  /** Nombre del rubro: "Dulcería". */
  rubro: string;
  negocio: string;
  /** Número ficticio que se muestra; la demo nunca abre WhatsApp. */
  whatsappVisible: string;
  direccion: string;
  redes: string[];
  textos: {
    anuncio: string;
    buscador: string;
    heroGeneral: { titular: string; bajada: string; ilustracion: string };
    porQue: { titulo: string; texto: string }[];
    /** Qué se encuentra cuando el negocio tiene un solo puesto ("Nuestra tienda"). */
    tiendaUnica: string;
    /** Debajo de "Enviar pedido": cómo se paga (la demo nunca cobra). */
    notaPedido: string;
  };
  tema: TemaDemo;
  vendePorMayor: boolean;
  categorias: Categoria[];
  ocasiones: Ocasion[];
  campanas: Campana[];
  campanaActiva: CampanaId | null;
  /** De 1 a 3. */
  puestos: Puesto[];
  productos: Producto[];
  /** Ids de productos para "Más vendidos". */
  masVendidos: string[];
  /** Datos del panel del dueño. */
  panel: {
    /** Fecha fija del "hoy" de la demo (AAAA-MM-DD): el panel no depende del reloj. */
    hoy: string;
    /** Stock bajo: esta cantidad o menos, en unidad base. */
    stockBajo: number;
    ventas: Venta[];
  };
}

/** Línea del pedido: guarda una copia de la presentación usada (factor y precios de ese momento). */
export interface LineaPedido {
  /** `${productoId}:${presentacion.id}` */
  id: string;
  productoId: string;
  presentacion: Presentacion;
  /** Cantidad de presentaciones (no de unidades base). */
  cantidad: number;
}

export interface Pedido {
  lineas: LineaPedido[];
  puestoRecojo?: number;
  cliente?: string;
}
