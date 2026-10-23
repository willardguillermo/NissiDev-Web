# BRIEF — Web NissiDev

> Documento para Claude Code. Léelo junto a `SPEC.md` y `docs/decisions/ADR-001-astro-con-islas-de-react.md`. Lo marcado **por decidir** no se inventa: se pregunta a Guillermo. Las notas marcadas *(vault)* están en el vault de Obsidian (ver `AGENTS.md`).

## 1. Nombre y objetivo
**Web NissiDev**, la web de la marca de desarrollo de Guillermo Willard Castillo. Funciona como un *showroom* de sistemas: el dueño de un negocio prueba una **demo del sistema de su rubro**, arma lo que necesita en un **carrito de funcionalidades** y recibe una **cotización por WhatsApp**. También presenta los servicios, el proceso y el stack de NissiDev.

## 2. Problema que resuelve y para quién
- **Para quién:**
  - Dueños de negocios pequeños y medianos del Este de Lima (corredor Lurigancho-Chosica → Santa Anita), por ejemplo dulcerías con puestos, hospedajes y restaurantes campestres. La mayoría llega desde un mensaje de WhatsApp y abre la web en el celular.
  - En segundo lugar, reclutadores de prácticas pre-profesionales (portafolio).
- **Problema:** al dueño le cuesta imaginar qué es "un sistema" y cuánto le costaría. Una conversación abstracta o una cotización sin nada que ver no lo convence.
- **Solución:** que vea y use **cómo quedaría el sistema de su negocio** antes de hablar de precio, y que elija las funcionalidades él mismo.

## 3. Funcionalidades

### MVP (primera versión)
1. **Sitio de NissiDev:** Inicio con la regla 5-10-15 (qué hago, por qué elegirme, cómo contactarme), Servicios y proceso, Stack, Casos y Contacto.
2. **Demo funcional de una dulcería con puestos:** **"Dulcería La Golosa"**, un negocio ficticio marcado siempre como **"Demo · datos de ejemplo"**, con dos vistas:
   - **Vista cliente:** Inicio, Catálogo, Detalle de producto y Mi pedido.
   - **Vista dueño:** Panel.
   - El visitante puede usarla: buscar, filtrar, cambiar de presentación, agregar al pedido y ver el total.
3. **Carrito de funcionalidades:**
   - Las funcionalidades son los productos.
   - Cada una muestra su precio **"desde"** o **"Cotizar"**, y su mensualidad si tiene.
   - Las dependencias se resuelven solas: al agregar un módulo se agregan o se avisan los que necesita, y al quitar uno del que dependen otros, se avisa.
   - El total separa la **inversión inicial** de la **mensualidad**.
   - Hay un carrito sugerido de **"Dulcería"** que se carga con un clic.
4. **Cotización:**
   - Lleva un **código único** generado en el navegador, sin correlativo (formato `NSD-AAAA-XXXX`, ej. `NSD-2026-K7Q3`), y **validez de 15 días**.
   - Muestra un resumen del carrito que se puede guardar como PDF con la opción de imprimir del navegador.
   - Tiene un botón que abre WhatsApp al **+51 913 351 627** con el resumen ya escrito.
   - Los precios se indican como **referenciales**.
   - **No cobra ni simula un pago.**
5. **Textos:** Claude Code escribe un primer borrador de todos los textos del sitio y Guillermo los corrige.
6. **Animaciones:** entrada del hero, aparición al hacer scroll, scroll suave y transición entre páginas. Con "movimiento reducido" activado, todo se ve sin animar.

### Después
- **Etapa 2:**
  - **Enlace personalizado**, que muestra la demo con el nombre y el color del negocio (ej. `…/demo/dulceria?negocio=…&color=…`).
  - Demos de **hospedaje** y **restaurante campestre**.
- **Etapa 3:**
  - **Chatbot real** en la web: n8n + una API de IA gratuita (preferida: Groq). Responde dudas, sugiere módulos para el carrito y guarda el lead.
  - Más rubros: veterinaria, gimnasio, ferretería.
- **Más adelante (servicios para clientes):** chatbot de WhatsApp para negocios y el sistema real (POS con inventario, lotes y vencimientos, Yape/Plin, boletas SUNAT). Este sistema real no es parte de esta web.

## 4. Stack tecnológico
| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Astro + TypeScript** | Las páginas de contenido llegan como HTML sin JavaScript: cargan rápido en celular y posicionan mejor en Google |
| Interactividad | **Islas de React** (demo, carrito, cotización) | Solo lo interactivo usa React; Guillermo ya sabe React |
| Estado compartido | **nanostores** (+ persistencia en `localStorage`) | Compartir el carrito entre islas y páginas de Astro |
| Animación | CSS (@keyframes, transiciones, animation-timeline: view()) + View Transitions de Astro; sin GSAP ni Lenis (ADR-002) | Las animaciones decididas de antemano no esperan al JavaScript: el Inicio pesa ~10 KB de JS |
| Estilos | CSS propio con variables (tokens) | Control total del diseño; sin librería de componentes |
| Calidad | Vitest, ESLint, `astro check` | Probar la lógica del carrito, la cotización y la demo |
| Hosting | **Cloudflare Pages** conectado al repo de GitHub | Gratis; cada push publica; cada rama tiene un enlace de vista previa |
| Repo | GitHub `willardguillermo/NissiDev-Web` (público) | Versiones, respaldo y portafolio |
| Carpeta local | `~/Proyectos Personales/nissidev-web` (Mac) | Separada de las carpetas de cursos |
| PDF | Hoja de estilos de impresión + "Guardar como PDF" | Sin dependencias extra |
| Analítica | **Cloudflare Web Analytics** | Gratis y sin cookies |
| Chatbot (etapa 3) | n8n + Groq | Ver nota *Chatbot con n8n y LLM gratis* (vault) |
| Hosting de n8n (etapa 3) | **Por decidir** | Vercel no sirve (no mantiene un servidor encendido); opciones: VPS, n8n Cloud, Railway o Render con sus límites |
| Versiones exactas | **Por decidir** al crear el repo | Usar las estables de ese momento |

## 5. Pantallas y módulos principales

### Páginas del sitio
| Página | Contenido |
|---|---|
| Inicio | Hero 5-10-15 · botón principal "Ver la demo de mi rubro" · WhatsApp como secundario · resumen de servicios · llamado al carrito |
| Demos | Tarjetas por rubro (en el MVP solo Dulcería; las demás como "Próximamente") |
| Demo Dulcería | Cambio entre vista cliente y vista dueño |
| Arma tu sistema | Carrito de funcionalidades, carrito sugerido y totales |
| Cotización | Resumen imprimible y botón de WhatsApp |
| Servicios y stack | Proceso (maqueta → propuesta → ≈4 semanas de desarrollo → soporte) y tecnologías |
| Contacto | WhatsApp y datos de NissiDev |

### Pantallas de la demo de dulcería
Basadas en los prompts de Google Stitch de `docs/referencias/demo-dulceria.md`.

| Pantalla | Qué tiene |
|---|---|
| Inicio | Barra de anuncio, buscador, hero de temporada, compra por ocasión, categorías, más vendidos, "Nuestros puestos" (de 1 a 3 según la configuración; con 1, "Nuestra tienda"), footer con WhatsApp |
| Catálogo | Buscador fijo, filtros (categoría, ocasión, puesto, marca), interruptor precio unidad / por mayor, grilla con etiquetas Nuevo, Oferta y Agotado |
| Detalle de producto | Selector de presentación (unidad, bolsa, caja) con su precio, cantidad y "Agregar al pedido" |
| Mi pedido | Líneas con cantidad editable y subtotal, total, lugar de recojo según la configuración (con 1 puesto, "Recoger en tienda"; con 2 o 3, elegir el puesto), nombre y "Enviar pedido por WhatsApp" (P3: muestra el mensaje, no abre WhatsApp) |
| Panel del dueño | Ventas del día por puesto, productos por vencer, stock bajo, más vendidos de la semana y cobros por efectivo, Yape y Plin |

### Módulos de código
`catalogo-servicios` → `carrito` → `cotizacion` · `demo` (motor) → `rubros/dulceria` · `sitio`. Las dependencias van en un solo sentido; el detalle está en la SPEC.

## 6. Datos principales
Todo vive en archivos del repo, sin base de datos. Los montos se guardan en céntimos enteros.

### Catálogo de servicios y carrito
| Entidad | Campos clave |
|---|---|
| **Módulo de servicio** | id, nombre, descripción para dueños, precio inicial "desde" (vacío = "Cotizar"), mensualidad (opcional), dependencias (otros módulos), etapa en que está disponible |
| **Carrito sugerido** | rubro, lista de módulos |
| **Carrito** | módulos elegidos, total inicial, total mensual, ¿incluye módulos "Cotizar"? |
| **Cotización** | código (`NSD-AAAA-XXXX`), fecha, válida hasta (fecha + 15 días), módulos, totales, rubro, nombre del negocio (opcional), aviso de precios referenciales, texto para WhatsApp |

**Módulos del carrito y su referencia de precio** (de la proforma NSD-2026-001):

| Módulo | Depende de | Precio |
|---|---|---|
| Catálogo web | — | **Desde S/ 700** (la cotización final la ajusta Guillermo) |
| Pedidos por WhatsApp | Catálogo web | Incluido en el catálogo |
| Panel del dueño | Catálogo web | Referencia S/ 500 |
| Reservas | — | Cotizar |
| Inventario con vencimientos | Panel del dueño | Cotizar |
| Caja con Yape/Plin | Inventario | Desde S/ 60/mes + instalación |
| Boletas SUNAT | Caja | Cotizar |
| Chatbot | — | Cotizar |
| Mantenimiento | Cualquier módulo | S/ 80/mes |

### Configuración de un rubro
| Entidad | Campos clave |
|---|---|
| **Rubro** | id (slug), nombre, textos, paleta y tipografías, pantallas activas, carrito sugerido, datos de ejemplo |
| **Personalización de la demo** (etapa 2) | nombre del negocio, color de marca |

### Demo de dulcería (datos ficticios)
| Entidad | Campos clave |
|---|---|
| **Producto** | nombre, marca **ficticia** (sin marcas reales), categoría, ocasiones, puestos donde está, etiqueta (nuevo / oferta / agotado), imagen (ilustración simple o marcador; luego fotos de Guillermo) |
| **Presentación** | producto, nombre (unidad / bolsa / caja), **factor** respecto a la unidad base, precio |
| **Precio mayorista** | presentación, cantidad mínima, precio |
| **Puesto** | número, qué se encuentra, horario, referencia de ubicación |
| **Ocasión / campaña** | nombre (Cumpleaños, Halloween, Bolsitas sorpresa, Por mayor), si está activa en el hero |
| **Pedido** | líneas (producto, presentación, factor, cantidad, subtotal), puesto de recojo, nombre del cliente, total |
| **Indicadores del panel** | ventas del día por puesto, productos por vencer, stock bajo, más vendidos, cobros por medio de pago |

Alcance: **unos 30 productos genéricos** de chocolates, gomitas, galletas, caramelos, snacks y artículos de fiesta, repartidos en los puestos de la configuración. La demo es una **plantilla del rubro** (La Golosa es solo el negocio de ejemplo): admite de 1 a 3 puestos (2 por defecto) y una campaña configurable (Halloween, Navidad, Día del Niño o ninguna).

Regla: el stock y las cantidades se piensan en unidad base, y el pedido guarda el factor usado. Ver *Unidades de medida y presentaciones* (vault).

## 7. Restricciones
- **Plazo:** sin fecha fija; se avanza al ritmo de Guillermo, entre clases.
- **Tipo de proyecto:** propio de NissiDev (no es para un curso ni para un cliente). Sirve para conseguir clientes y como portafolio.
- **Despliegue:** Cloudflare Pages desde GitHub; dominio **nissidev.com** (disponibilidad por verificar). Mientras tanto, la dirección `*.pages.dev`.
- **Presupuesto:** hosting S/ 0; el único gasto del MVP es el dominio .com (precio por confirmar al comprarlo). El servidor de n8n (etapa 3) queda por decidir.
- **Forma de trabajo:** spec y plan aprobados antes del código; tareas pequeñas con un commit cada una; verificar con tests, build y prueba en celular.
- **Git:** formato `<tipo>: <descripción>`; **nunca** `chore` (ni en commits ni en ramas); **nunca** `Co-Authored-By` de IA ni "Generated with…".
- **Límites:**
  - No cobrar ni simular pagos.
  - No usar fotos, logos, fuentes sin licencia ni código de terceros; inspirarse en la *Biblioteca Web* (vault) y escribir código propio.
  - Ninguna clave ni `.env` en el repo.
  - Marcar siempre los datos ficticios.
- **Calidad mínima:**
  - LCP ≤ 2.5 s, CLS ≤ 0.1 e INP ≤ 200 ms en celular.
  - Se puede usar con teclado y el contraste es ≥ 4.5:1.
  - Respeta "movimiento reducido".
- **Identidad:** NissiDev usa negro `#1E1F22`, dorado `#B28A4C` y claro `#F3EFE7`; el logo es una N geométrica con la diagonal dorada. La demo de dulcería tiene su propio estilo: rosa `#EC48AE`, Shrikhand + Chivo.

## 8. Decisiones cerradas y pendientes
**Cerradas (2026-10-21):**
- Negocio de ejemplo: **Dulcería La Golosa**, con ~30 productos genéricos y sin marcas reales.
- Imágenes: ilustraciones simples o marcadores; se reemplazan después por fotos de Guillermo.
- Catálogo web: **desde S/ 700**.
- Textos: primer borrador de Claude Code, corregido por Guillermo.
- Cotización: código único `NSD-AAAA-XXXX` generado en el navegador (sin servidor ni correlativo) y validez de 15 días.
- Analítica: Cloudflare Web Analytics.

**Pendientes (no bloquean el inicio):**
1. **Continental Hydraulic como caso:** Guillermo pide permiso al cliente. Mientras no lo tenga, no se publica.
2. **Dominio nissidev.com:** Guillermo verifica que esté libre y lo compra. Mientras tanto se usa `*.pages.dev`.
3. **Hosting de n8n:** se decide en la etapa 3.
