# Plan — Web NissiDev (MVP)

> Sigue el orden de módulos de la SPEC: `ui` → `catalogo-servicios` → `carrito` → `cotizacion` → `demo` → `rubros/dulceria` → `sitio`, con una fase 0 para crear el proyecto.
> Cada tarea es una rebanada pequeña (~100 líneas, máximo ~300): implementar → test → verificar → commit.
> En cada **punto de control** se para y se escribe "Listo para revisión de Codex" (ver `AGENTS.md`).

## Terminado (aplica a todas las tareas)
Además de los criterios de cada tarea:
- `npm run build`, `npm test` y `npm run lint` en verde (desde la T01, también `npx astro check`).
- Revisado en ancho de celular (375 px) con las DevTools, si la tarea tiene algo visible.
- Se cierra con `CAMBIOS:` / `NO TOQUÉ (a propósito):` / `VERIFICACIÓN:` y "Qué aprender de esta tarea".

## Decisiones (aprobadas por Guillermo, 2026-10-21)
| # | Tema | Decisión | Afecta |
|---|---|---|---|
| P1 | Número de cotización sin backend | Código único generado en el navegador, sin correlativo: `NSD-AAAA-XXXX` (ej. `NSD-2026-K7Q3`), 4 caracteres al azar con `crypto.getRandomValues` y sin caracteres confusos (0/O, 1/I/L). | T10 |
| P2 | Instalación de Caja con Yape/Plin | Se muestra "S/ 60/mes + instalación (Cotizar)"; cuenta como módulo con parte "Cotizar". | T05 |
| P3 | "Enviar pedido por WhatsApp" en la demo | No abre WhatsApp: muestra el mensaje que le llegaría al negocio + "Esto es una demostración: en tu sistema, este mensaje llega al WhatsApp de tu negocio" + botón "Quiero esto para mi negocio" → Arma tu sistema. | T19 |
| P4 | Casos | Sin página de Casos en el MVP; en Inicio, una sección "Casos: próximamente" que se llena cuando haya permiso. | T21 |
| P5 | Tipografía de NissiDev | **Manrope** (licencia OFL, variable), en `woff2` servido desde `public/fonts/` con `font-display: swap` y la licencia al lado. Shrikhand y Chivo (OFL) igual para la demo. Sin dependencia npm. | T04, T15 |
| P6 | Logo | Logo de texto "NissiDev" hasta que Guillermo pase el SVG. | T04 |

---

## Fase 0 — Proyecto

### T01 · build: crear el proyecto Astro + TypeScript — ✅ `92c78d2`
- **Qué:** proyecto Astro (estable) con TypeScript estricto, integración de React, Vitest y ESLint (con plugin de Astro y typescript-eslint). Scripts `dev`, `build`, `preview`, `test`, `lint`, `check`. Página `index.astro` provisional. Sin pisar `BRIEF.md`, `SPEC.md`, `AGENTS.md`, `CLAUDE.md` ni `docs/`.
- **Antes:** pedir permiso para las dependencias (`astro`, `@astrojs/react`, `react`, `react-dom`, `typescript`, `@astrojs/check`, `vitest`, `eslint` + plugins).
- **Terminado cuando:** los cinco comandos corren; existe un test de ejemplo que pasa; los nombres reales de los scripts quedan anotados en `AGENTS.md`.
- **Verificación:** `npm run build && npm test && npm run lint && npx astro check`; `npm run dev` muestra la página en http://localhost:4321.

### T02 · ci: repo en GitHub y Cloudflare Pages — ✅ `6859fa8`
- **Antes:** permiso de Guillermo (publica el repo y la web). Guillermo conecta Cloudflare Pages en su panel; Claude le da los valores (comando `npm run build`, carpeta `dist`, versión de Node).
- **Qué:** repo público `willardguillermo/NissiDev-Web` (ya creado y con `main` subido al aprobar el plan); falta solo la conexión con Cloudflare Pages.
- **Hecho (2026-10-21):** producción en https://nissidev-web.pages.dev; la rama de prueba `build/prueba-vista-previa` publicó su vista previa en `https://build-prueba-vista-previa.nissidev-web.pages.dev` y luego se borró.
- **Terminado cuando:** la dirección `*.pages.dev` muestra la página provisional y una rama de prueba genera su enlace de vista previa.
- **Verificación:** abrir la URL en el celular; `git push` de una rama → aparece la vista previa en Cloudflare.

**Punto de control 0:** proyecto vacío publicado y comandos en verde. ✅ Cerrado en `6859fa8` (sin revisión de Codex).

## Fase 1 — `ui`

### T03 · feat: tokens y formato de soles — ✅ `3b761e8`
- **Qué:** `src/styles/tokens.css` (colores NissiDev, espacios, radios, sombras, tamaños de texto fluidos), reset mínimo, foco visible. `formatearSoles(centimos)` en `src/ui/formato.ts` → `S/ 700`, `S/ 1,000`, `S/ 60.50`.
- **Terminado cuando:** las combinaciones de texto/fondo usadas cumplen contraste ≥ 4.5:1 (el dorado `#B28A4C` sobre claro **no** llega: queda solo para texto grande, bordes y adornos); `formatearSoles` tiene tests.
- **Verificación:** `npm test` (formato con 0, enteros, miles y céntimos); contraste revisado con las DevTools y anotado en el cierre.

### T04 · feat: layout base y componentes — ✅ `717b87c`
- **Qué:** `layouts/Base.astro` (`lang="es"`, metadatos, enlace "Saltar al contenido", header con logo de texto y menú móvil accesible, footer con WhatsApp), Manrope en `public/fonts/` con su licencia, `components/Boton.astro` y `components/Tarjeta.astro`. La página provisional usa el layout.
- **Terminado cuando:** el menú se abre y cierra con teclado, el foco se ve, nada se desborda a 375 px.
- **Verificación:** `npm run build`; recorrido con Tab en el navegador; vista a 375 px; en DevTools → Red, la fuente sale de `/fonts/` y no de un dominio externo.

**Punto de control 1:** la base visual se ve bien en celular. ✅ Revisión de Codex (base `6859fa8`): 1 hallazgo (contraste del foco en fondos oscuros), arreglado en `58afc2f`; `tokens.test.ts` comprueba el contraste del foco en ambos fondos.

## Fase 2 — `catalogo-servicios`

### T05 · feat: catálogo de módulos y página de lista — ✅ `49291a0`
- **Qué:** tipos (`ModuloServicio`, `ModuloId`) y `modulos.ts` con los 9 módulos del BRIEF (céntimos; `precioDesde` vacío = "Cotizar"; mensualidad opcional; dependencias; etapa). Caja con Yape/Plin: "S/ 60/mes + instalación (Cotizar)" (P2). Página `arma-tu-sistema.astro` que los lista **sin interacción** con "desde", "Cotizar", "/mes" y "precios referenciales".
- **Terminado cuando:** test de integridad: ids únicos, toda dependencia existe, sin ciclos, "Pedidos por WhatsApp" figura como incluido en Catálogo web.
- **Verificación:** `npm test`; la página se ve en 375 px.

**Punto de control 2:** catálogo de servicios con precios correctos (revisar antes de construir el carrito encima). ⏩ Alcanzado en `49291a0`; su revisión de Codex se hace junto con la del punto de control 3 (base `58afc2f`).

## Fase 3 — `carrito`

### T06 · feat: lógica del carrito
- **Qué:** `carrito.ts` puro: `agregarModulo` (agrega dependencias faltantes, también las indirectas, y devuelve cuáles agregó para avisar), `quitarModulo` (si otros dependen de él, devuelve los dependientes y no lo quita hasta confirmar), `calcularTotales` (inicial, mensual, `incluyeCotizar`). Mantenimiento exige al menos otro módulo.
- **Terminado cuando:** tests de la SPEC: agregar Caja agrega Inventario, Panel y Catálogo; quitar Catálogo con Panel avisa; totales inicial y mensual separados; sin duplicados; quitar el último módulo con Mantenimiento avisa.
- **Verificación:** `npm test`.

### T07a · feat: restauración validada del carrito
- **Qué:** `restaurarCarrito(valorGuardado)` en `carrito/carrito.ts`, lógica pura y sin `localStorage`: comprueba la estructura (si no es válida, carrito vacío), descarta ids desconocidos, quita duplicados, resuelve dependencias faltantes con `agregarModulo` y aplica la regla de Mantenimiento (si queda solo, se quita). Los totales se calculan siempre sobre el carrito ya restaurado.
- **Terminado cuando:** tests: JSON inválido, tipo incorrecto (objeto, número, `null`), ids desconocidos, duplicados, solo Caja → se completan Inventario, Panel y Catálogo, solo Mantenimiento → vacío, carrito válido → igual.
- **Verificación:** `npm test`.

### T07b · feat: carrito interactivo con persistencia
- **Antes:** permiso para `nanostores`, `@nanostores/persistent` y `@nanostores/react`.
- **Qué:** `carrito/store.ts` (persistente; toda lectura pasa por `restaurarCarrito` y el acceso a `localStorage` va en `try/catch`) e isla `Carrito.tsx` en Arma tu sistema: agregar/quitar, avisos de dependencias con `aria-live`, confirmación al quitar con dependientes, totales separados. Contador del carrito en el header.
- **Terminado cuando:** el carrito sobrevive a recargar la página; un valor manipulado en `localStorage` (p. ej. solo Caja) se muestra completo y con totales correctos; con `localStorage` bloqueado la página sigue funcionando (sin persistir); todo se usa con teclado.
- **Verificación:** prueba manual: recargar, editar el valor en DevTools → Application, ventana privada, almacenamiento bloqueado.

### T08 · feat: carrito sugerido "Dulcería"
- **Qué:** carritos sugeridos por rubro en `carrito/` y botón "Cargar sistema para Dulcería". Si el carrito no está vacío, pregunta antes de reemplazarlo.
- **Terminado cuando:** un clic deja el carrito sugerido con sus dependencias resueltas y totales correctos.
- **Verificación:** test de `cargarSugerido`; prueba manual en 375 px.

**Punto de control 3:** se puede armar un sistema completo y los totales cuadran.

## Fase 4 — `cotizacion`

### T09 · feat: mensaje y enlace de WhatsApp
- **Qué:** `cotizacion/mensajeWhatsApp.ts`: texto con número, fecha, validez, módulos, inversión inicial, mensualidad, la palabra "referencial" y el nombre del negocio si lo hay; `enlaceWhatsApp(texto)` → `https://wa.me/51913351627?text=…` codificado.
- **Terminado cuando:** tests de la SPEC: el mensaje lleva módulos, totales y "referencial"; el enlace codifica tildes, saltos de línea, `&` y `#`.
- **Verificación:** `npm test`; abrir un enlace generado en el celular y ver el texto bien escrito.

### T10 · feat: datos de la cotización
- **Qué:** `crearCotizacion(carrito, fecha, codigo)` con código `NSD-AAAA-XXXX` (P1) y válida hasta fecha + 15 días. `generarCodigo(fecha, aleatorio)` recibe la fuente de azar como parámetro para poder probarla; en el navegador usa `crypto.getRandomValues`.
- **Terminado cuando:** tests: formato `NSD-2026-K7Q3` (año de la fecha, 4 caracteres del alfabeto sin 0/O/1/I/L), validez cruzando fin de mes y de año.
- **Verificación:** `npm test`.

### T11 · feat: página de cotización imprimible
- **Qué:** página `cotizacion.astro` + isla `Cotizacion.tsx`: resumen del carrito, campo opcional "Nombre de tu negocio" (con label; no se guarda), botón "Enviar por WhatsApp" y botón "Guardar como PDF" (`window.print()`), hoja de estilos de impresión. Si el carrito está vacío, lleva a Arma tu sistema.
- **Terminado cuando:** la vista de impresión sale en una hoja limpia (sin header, menú ni botones) con "precios referenciales" y la validez; no hay nada que parezca un cobro.
- **Verificación:** vista previa de impresión en Chrome (guardar PDF); botón de WhatsApp probado en el celular.

**Punto de control 4:** flujo carrito → cotización → WhatsApp completo.

## Fase 5 — `demo` (motor)

### T12a · feat: modelo, conversiones y precios del pedido
- **Qué:** tipos en `demo/` (`RubroConfig`, `Producto`, `Presentacion`, `PrecioMayorista`, `Puesto`, `Ocasion`, `LineaPedido`, `Pedido`) y `demo/pedido.ts`: agregar línea (guarda la presentación y su factor), cambiar presentación, editar cantidad, eliminar línea, `aUnidadBase(cantidad, factor)`, subtotal, total y precio por mayor según cantidad mínima.
- **Terminado cuando:** test de la SPEC (cambiar unidad/bolsa/caja recalcula el subtotal); caso de conversión de la referencia (3 cajas × 24 = 72 unidades base; 1 bolsa de 6 + 2 unidades = 8 → 72 − 8 = 64); el precio por mayor se aplica desde la cantidad mínima; una línea guarda su factor aunque la presentación cambie después.
- **Verificación:** `npm test`.

### T12b · feat: disponibilidad del pedido
- **Qué:** `demo/disponibilidad.ts`. El pedido de la demo **no descuenta stock**: solo valida que la suma de todas sus líneas del mismo producto, en unidad base y entre todas las presentaciones, no supere lo disponible. Agregar, editar o cambiar presentación que exceda el disponible se rechaza con un motivo para mostrar.
- **Terminado cuando:** tests: cantidades inválidas (0, negativas, decimales) rechazadas; exceso acumulado (8 disponibles: bolsa de 6 + 3 sueltas → falla; bolsa de 6 + 2 sueltas → pasa); editar una línea a más de lo disponible falla; reducir o eliminar una línea libera disponibilidad para otra; el stock del producto no cambia tras ninguna operación.
- **Verificación:** `npm test`.

### T13 · feat: búsqueda y filtros
- **Qué:** `demo/filtros.ts`: buscar por texto (sin importar tildes ni mayúsculas) y filtrar por categoría, ocasión, puesto y marca, combinables.
- **Terminado cuando:** tests con un catálogo de prueba pequeño (tildes, filtros combinados, sin resultados).
- **Verificación:** `npm test`.

### T14 · feat: cascarón de la demo
- **Qué:** página `demos/dulceria.astro` + isla `DemoDulceria.tsx` que recibe un `RubroConfig`: cambio entre vista cliente y vista dueño, navegación interna entre pantallas (estado en memoria), tema por variables CSS de la config, sello fijo **"Demo · datos de ejemplo"**. Con una config mínima de prueba.
- **Terminado cuando:** se cambia de vista y de pantalla con teclado; el sello se ve en todas las pantallas.
- **Verificación:** build; prueba manual en 375 px.

**Punto de control 5:** motor de la demo (modelo de datos y lógica del pedido) antes de cargar los datos de la dulcería.

## Fase 6 — `rubros/dulceria`

### T15 · feat: datos de Dulcería La Golosa
- **Qué:** `rubros/dulceria/config.ts` (textos, paleta `#EC48AE`, Shrikhand + Chivo, 3 puestos, ocasiones, campaña activa) y `productos.ts` (~30 productos genéricos con marcas ficticias, presentaciones, precios por mayor, etiquetas, stock, vencimientos). Ilustraciones propias simples (SVG o CSS).
- **Fuentes:** Shrikhand y Chivo en `public/fonts/` con su licencia (P5).
- **Terminado cuando:** test de integridad: toda presentación base tiene factor 1, cada producto está en al menos un puesto, referencias a categoría/ocasión/puesto válidas.
- **Verificación:** `npm test`; revisión de que ninguna marca sea real.

### T16 · feat: Inicio de la demo
- **Qué:** barra de anuncio, header con buscador y WhatsApp, hero de temporada, compra por ocasión (2×2), categorías en carrusel, más vendidos, "Nuestros 3 puestos", por qué elegirnos, footer; botón flotante y barra "Mi pedido (n)".
- **Terminado cuando:** 5-10-15 de la referencia en 375 px; el carrusel se usa con teclado.
- **Verificación:** prueba manual en 375 px y con Tab.

### T17 · feat: Catálogo de la demo
- **Qué:** buscador fijo, chips de filtro, interruptor precio unidad / por mayor, grilla de 2 columnas con etiquetas Nuevo, Oferta y Agotado. Usa `filtros.ts`.
- **Terminado cuando:** buscar y filtrar actualiza la grilla; hay mensaje si no hay resultados; Agotado no se puede agregar.
- **Verificación:** prueba manual en 375 px.

### T18 · feat: Detalle de producto
- **Qué:** imagen, nombre, marca, selector de presentación con precio, cantidad, "Agregar al pedido", "También te puede gustar".
- **Terminado cuando:** cambiar presentación cambia precio; agregar actualiza "Mi pedido (n)"; si supera lo disponible (T12b), no se agrega y se muestra el motivo.
- **Verificación:** prueba manual en 375 px.

### T19 · feat: Mi pedido
- **Qué:** líneas con cantidad y subtotal, total, puesto de recojo (1, 2 o 3), nombre (con label) y "Enviar pedido por WhatsApp" según P3: no abre WhatsApp, muestra el mensaje, el aviso de demostración y "Quiero esto para mi negocio". Sin pago.
- **Terminado cuando:** cambiar cantidades recalcula; el envío no abre ningún enlace externo y deja claro que es una demostración; el aviso se cierra con teclado (Esc) y devuelve el foco al botón.
- **Verificación:** test del mensaje del pedido; prueba manual en 375 px.

### T20a · feat: ventas ficticias del panel
- **Qué:** `rubros/dulceria/ventas.ts`: ventas fechadas (fecha y hora, puesto, líneas con producto, presentación, factor y cantidad, medio de pago: efectivo, Yape o Plin) que cubren al menos los 7 días anteriores, y una **fecha de referencia fija** (`HOY_DEMO`) para que el panel no dependa del reloj. Tipo `Venta` en `demo/`.
- **Terminado cuando:** test de integridad: toda venta referencia productos, presentaciones y puestos existentes; hay ventas en `HOY_DEMO` en los 3 puestos y con los 3 medios de pago; ninguna fecha es posterior a `HOY_DEMO`.
- **Verificación:** `npm test`.

### T20b · feat: Panel del dueño
- **Qué:** cálculos puros en `demo/panel.ts` a partir de las ventas, productos y `HOY_DEMO` (ventas del día por puesto, por vencer en 7 días, stock bajo, más vendidos de la semana, cobros por medio de pago) y la vista con barras CSS, sin librería de gráficos. La vista solo muestra lo que devuelven los cálculos.
- **Terminado cuando:** tests de cada cálculo con datos pequeños de prueba y fecha fija; ningún número está escrito a mano en la vista; se lee bien en 375 px.
- **Verificación:** `npm test`; prueba manual en 375 px.

**Punto de control 6:** demo completa navegable (criterio de éxito 2).

## Fase 7 — `sitio`

### T21 · feat: Inicio de NissiDev
- **Qué:** hero 5-10-15, botón "Ver la demo de mi rubro", WhatsApp secundario, resumen de servicios, llamado al carrito y sección "Casos: próximamente" (P4). Textos en borrador para que Guillermo los corrija.
- **Terminado cuando:** criterio de éxito 1: qué hago, por qué elegirme y WhatsApp visibles sin bajar más de una pantalla en 375 px.
- **Verificación:** captura en 375 px.

### T22 · feat: Servicios y stack
- **Qué:** proceso (maqueta → propuesta → ≈4 semanas → soporte) y tecnologías.
- **Terminado cuando:** página enlazada desde el menú; textos en borrador marcados para revisión.
- **Verificación:** prueba manual en 375 px.

### T23 · feat: Demos y Contacto
- **Qué:** tarjetas por rubro (Dulcería activa; Hospedaje y Restaurante campestre "Próximamente") y página de Contacto con WhatsApp.
- **Terminado cuando:** todas las páginas del BRIEF existen y están enlazadas.
- **Verificación:** recorrer el menú en 375 px.

### T24 · feat: transiciones y scroll suave
- **Antes:** permiso para `lenis`.
- **Qué:** View Transitions de Astro y Lenis en `src/animacion/lenis.ts`; el carrito sigue intacto al cambiar de página.
- **Terminado cuando:** con "movimiento reducido" no hay scroll suave ni transición animada.
- **Verificación:** prueba manual con y sin "movimiento reducido" (emulación en DevTools).

### T25 · feat: animaciones de entrada y scroll
- **Antes:** permiso para `gsap`.
- **Qué:** `src/animacion/gsap.ts`: entrada del hero y aparición al hacer scroll, solo `transform` y `opacity`.
- **Terminado cuando:** con "movimiento reducido" todo se ve sin animar; sin saltos de diseño (CLS).
- **Verificación:** prueba manual con ambas preferencias; Lighthouse local sin aumento de CLS.

### T26 · feat: Cloudflare Web Analytics
- **Antes:** permiso de Guillermo; él activa la analítica en su panel.
- **Qué:** script de analítica en `Base.astro`.
- **Verificación:** visitas visibles en el panel de Cloudflare.

**Punto de control 7:** sitio completo antes de darlo por publicado (buen momento para `/codex:adversarial-review`).

### T27 · test: verificación final del MVP
- **Qué:** recorrido en celular real (Inicio → demo → carrito → WhatsApp) con capturas, Lighthouse móvil sobre la versión publicada (LCP y CLS), medición de INP con el panel Performance de DevTools en interacciones definidas (buscar, filtrar, cambiar presentación, modificar carrito), revisión de teclado y contraste, `README.md`. Corregir lo que falle en tareas aparte.
- **Terminado cuando:** todos los criterios de éxito de la SPEC están marcados.
- **Verificación:** informe con capturas; Lighthouse: LCP ≤ 2.5 s y CLS ≤ 0.1; Performance: INP ≤ 200 ms en cada una de las 4 interacciones. Se registran dispositivo, navegador, condiciones (limitación de CPU y red) y resultados.

## Supuestos de este plan
1. `formatearSoles` vive en `src/ui/formato.ts` (la SPEC no tiene carpeta para utilidades compartidas, y lo usan tanto el carrito como la demo).
2. Las dependencias se instalan en la tarea que las usa, no todas en la T01, y cada una se pide antes.
3. El motor `demo` no importa nada de `rubros/`; la página de la demo le pasa la config de la dulcería.
