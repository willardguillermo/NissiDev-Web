# Referencia: demo "Dulcería La Golosa"

Negocio **ficticio** para la demo. Sale del maquetado que Guillermo preparó en Google Stitch para un prospecto real (una dulcería con 3 puestos en una plaza comercial). Aquí no se usa ningún dato del negocio real.

## Objetivo de la demo
Regla 5-10-15: en **5 s** se entiende qué vende, en **10 s** por qué comprarle (variedad, precio por mayor, 3 puestos) y en **15 s** cómo pedir (WhatsApp y ubicación).
Con muchos productos, lo que más importa es el **buscador y los filtros**, no las animaciones.

## Estilo de la demo (distinto del de NissiDev)
- Alegre, juguetón y "dulce", pero ordenado y fácil de leer.
- Un solo color de marca: rosa `#EC48AE`. Texto `#121212`. Fondos blanco y gris claro `#F3F3F3`. Amarillo `#FFC72C` y turquesa `#00C2B9` solo para etiquetas pequeñas.
- Titulares en **Shrikhand** y texto en **Chivo** (Google Fonts).
- Botones tipo píldora, tarjetas con esquinas muy redondeadas y sombras suaves. Las tarjetas de categoría llevan un borde tipo *sticker* (borde de color grueso + línea oscura fina).
- Hero de temporada (Halloween, luego Navidad), con la campaña configurable.

## Vista cliente
1. **Inicio**
   1. Barra de anuncio: "Precios por mayor · Pedidos por WhatsApp".
   2. Header con el logo de texto, un buscador grande "¿Qué dulce buscas?" e ícono de WhatsApp.
   3. Hero de temporada con titular, imagen, botón principal "Ver catálogo" y secundario "Pedir por WhatsApp".
   4. "Compra por ocasión" (grid 2×2): Cumpleaños, Bolsitas sorpresa, Halloween, Por mayor.
   5. Categorías en carrusel: Chocolates, Gomitas, Galletas, Caramelos, Snacks, Piñatería.
   6. Más vendidos: tarjeta con imagen, nombre, presentación, precio unidad, precio por mayor y "Agregar al pedido".
   7. "Nuestros 3 puestos": qué se encuentra en cada uno, horario y "Cómo llegar".
   8. Por qué elegirnos: variedad, precio de mayorista y pedidos para fiestas.
   9. Footer con WhatsApp, redes, dirección y horario.

   Siempre visibles: botón flotante de WhatsApp y una barra inferior "Mi pedido (n)".
2. **Catálogo:** buscador fijo arriba; chips de filtro (categoría, ocasión, puesto, marca); interruptor "Precio unidad / Precio por mayor"; grilla de 2 columnas con etiquetas "Nuevo", "Oferta" y "Agotado".
3. **Detalle de producto:** imagen grande, nombre, marca, selector de presentación (unidad, bolsa x50, caja x24) con su precio, selector de cantidad, "Agregar al pedido" y "También te puede gustar".
4. **Mi pedido:** productos con cantidad y subtotal, total, recoger en el Puesto 1, 2 o 3, nombre del cliente y un botón grande "Enviar pedido por WhatsApp". **Sin pasarela de pago.**

## Vista dueño
**Panel:** mismo estilo de marca pero más sobrio. Muestra ventas del día por puesto, productos por vencer en 7 días, stock bajo, más vendidos de la semana y cobros por efectivo, Yape y Plin. Todo con datos de ejemplo.

## Datos de ejemplo
- **~30 productos genéricos**, con marcas **ficticias** y sin marcas reales. Repartidos en 3 puestos y en las categorías y ocasiones de arriba.
- Imágenes: ilustraciones simples o marcadores propios (luego se reemplazan por fotos de Guillermo).
- Sello visible: **"Demo · datos de ejemplo"**.

## Modelo de datos (el mismo que usaría el sistema real)
- **Producto** → tiene varias **Presentaciones** (unidad / bolsa / caja), cada una con un **factor** respecto a la unidad base y su precio.
- **Precio mayorista:** precio por **cantidad mínima**.
- **Puesto** funciona como almacén o sucursal.
- **Ocasión / campaña** agrupa productos por intención de compra.
- **Pedido:** cada línea guarda la presentación y el **factor usados** (si mañana la caja trae 20 en vez de 24, los pedidos pasados no cambian).
- El stock y las cantidades se guardan siempre en **unidad base**.
- Caso de prueba de la conversión: 3 cajas × 24 = 72 unidades; vender 1 bolsa de 6 + 2 unidades → quedan **64**.

## Pedido por WhatsApp
- Se arma un enlace `https://wa.me/51…?text=` con el resumen del pedido, bien codificado.
- No hay checkout ni pago simulado, y la demo no dice que abrir el chat confirma el pedido.
- En la demo, el número del negocio es ficticio. Al enviar, se aclara que es una demostración (definir el comportamiento exacto en el plan).
