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

**Punto de control 2:** catálogo de servicios con precios correctos (revisar antes de construir el carrito encima). ✅ Revisado junto con el punto de control 3.

## Fase 3 — `carrito`

### T06 · feat: lógica del carrito — ✅ `c158bc3`
- **Qué:** `carrito.ts` puro: `agregarModulo` (agrega dependencias faltantes, también las indirectas, y devuelve cuáles agregó para avisar), `quitarModulo` (si otros dependen de él, devuelve los dependientes y no lo quita hasta confirmar), `calcularTotales` (inicial, mensual, `incluyeCotizar`). Mantenimiento exige al menos otro módulo.
- **Terminado cuando:** tests de la SPEC: agregar Caja agrega Inventario, Panel y Catálogo; quitar Catálogo con Panel avisa; totales inicial y mensual separados; sin duplicados; quitar el último módulo con Mantenimiento avisa.
- **Verificación:** `npm test`.

### T07a · feat: restauración validada del carrito — ✅ `c02692d`
- **Qué:** `restaurarCarrito(valorGuardado)` en `carrito/carrito.ts`, lógica pura y sin `localStorage`: comprueba la estructura (si no es válida, carrito vacío), descarta ids desconocidos, quita duplicados, resuelve dependencias faltantes con `agregarModulo` y aplica la regla de Mantenimiento (si queda solo, se quita). Los totales se calculan siempre sobre el carrito ya restaurado.
- **Terminado cuando:** tests: JSON inválido, tipo incorrecto (objeto, número, `null`), ids desconocidos, duplicados, solo Caja → se completan Inventario, Panel y Catálogo, solo Mantenimiento → vacío, carrito válido → igual.
- **Verificación:** `npm test`.

### T07b · feat: carrito interactivo con persistencia — ✅ `d55bf62` + `10905e4`
- **Antes:** permiso para `nanostores`, `@nanostores/persistent` y `@nanostores/react`.
- **Qué:** `carrito/store.ts` (persistente; toda lectura pasa por `restaurarCarrito` y el acceso a `localStorage` va en `try/catch`) e isla `Carrito.tsx` en Arma tu sistema: agregar/quitar, avisos de dependencias con `aria-live`, confirmación al quitar con dependientes, totales separados. Contador del carrito en el header.
- **Terminado cuando:** el carrito sobrevive a recargar la página; un valor manipulado en `localStorage` (p. ej. solo Caja) se muestra completo y con totales correctos; con `localStorage` bloqueado la página sigue funcionando (sin persistir); todo se usa con teclado.
- **Verificación:** prueba manual: recargar, editar el valor en DevTools → Application, ventana privada, almacenamiento bloqueado.

### T08 · feat: carrito sugerido "Dulcería" — ✅ `dec8781`
- **Qué:** carritos sugeridos por rubro en `carrito/` y botón "Cargar sistema para Dulcería". Si el carrito no está vacío, pregunta antes de reemplazarlo.
- **Terminado cuando:** un clic deja el carrito sugerido con sus dependencias resueltas y totales correctos.
- **Verificación:** test de `cargarSugerido`; prueba manual en 375 px.

**Punto de control 3:** se puede armar un sistema completo y los totales cuadran. ✅ Revisión de Codex conjunta de los puntos de control 2 y 3 (base `58afc2f`): 1 hallazgo (una confirmación abierta podía quitar módulos no advertidos), arreglado en `56c971b` con revalidación en la lógica pura y cancelación en la isla.

## Fase 4 — `cotizacion`

### T09 · feat: mensaje y enlace de WhatsApp — ✅ `c713f66`
- **Qué:** `cotizacion/mensajeWhatsApp.ts`: texto con número, fecha, validez, módulos, inversión inicial, mensualidad, la palabra "referencial" y el nombre del negocio si lo hay; `enlaceWhatsApp(texto)` → `https://wa.me/51913351627?text=…` codificado.
- **Terminado cuando:** tests de la SPEC: el mensaje lleva módulos, totales y "referencial"; el enlace codifica tildes, saltos de línea, `&` y `#`.
- **Verificación:** `npm test`; abrir un enlace generado en el celular y ver el texto bien escrito.

### T10 · feat: datos de la cotización — ✅ `063445e`
- **Qué:** `crearCotizacion(carrito, fecha, codigo)` con código `NSD-AAAA-XXXX` (P1) y válida hasta fecha + 15 días. `generarCodigo(fecha, aleatorio)` recibe la fuente de azar como parámetro para poder probarla; en el navegador usa `crypto.getRandomValues`.
- **Terminado cuando:** tests: formato `NSD-2026-K7Q3` (año de la fecha, 4 caracteres del alfabeto sin 0/O/1/I/L), validez cruzando fin de mes y de año.
- **Verificación:** `npm test`.

### TD1 · Dirección visual de NissiDev — ✅ unida a `main` en `808f12d` (PR #1)
- **Primera versión (2026-10-21), descartada:** dirección B "Papel y oro" + momento A (la N en 3D), commits `f1346da`…`0f0bb60`. Parecía una plantilla y no se parecía a la marca.
- **Elegida (2026-10-22): Ensamble**, sacada del video oficial de la marca. Referencia en `docs/referencias/td1/prototipo-ensamble.html` y el logo en `docs/referencias/marca/`; detalle en `docs/diseño.md`.
- **Partes y commits:** E1 referencias, `diseño.md` y tokens `cfbae25` · E2 logo en el header y favicon `3154f5c` + `8d096e8` · E3 hero con el logo que se arma `cde9b18` + `cd1c3f3` · E4 rotador de servicios `9712ffd` · E5 resto del Inicio y footer `2d91517` · E6 Arma tu sistema `8b7a06b` · E7 movimiento con CSS, sin GSAP ni Lenis `864ce73`.
- **Revisión de Codex (base `466536f`):** 1 hallazgo P2 (el contador restauraba un importe viejo), arreglado en `c0801db` con tests en `src/islas/contador.test.ts`. Limpieza: mini carrito borrado `fbffd69`; «Abrir la demo · Muy pronto» pasa a aviso sin foco `22fb561`.
- **Se resolvieron aquí:** parte de la **T21** (Inicio de NissiDev) y toda la **T24** y la **T25**, con CSS en vez de librerías (ADR-002).
- **Qué:** Guillermo define con Claude la dirección visual de la web de NissiDev a partir de un boceto de **Inicio** y de **Arma tu sistema** (tipografía, color, ritmo, tono de las imágenes, componentes). Los tokens y componentes de las T03–T04 son provisionales.
- **Al terminar:** se actualizan `src/styles/tokens.css` y los componentes (`Boton`, `Tarjeta`, `Base.astro`, isla `Carrito`) a la dirección elegida, con sus tests de contraste.
- **Bloqueaba:** la T11 y todas las tareas con pantallas (T14, T16–T19, T20b, T21–T23). Desbloqueadas al unirse a `main`.
- **Terminado cuando:** Guillermo aprueba los bocetos y los tokens/componentes quedan actualizados.

### TD2 · Rediseño "Liquid Glass" con Geist — entrega aprobada hacia main, PR #5
- **Aprobado (2026-10-24):** prototipo `docs/referencias/td2/prototipo-liquid.html` (versión 1, Geist). Decisión en `docs/decisions/ADR-003-vidrio-y-geist.md`.
- **Partes y commits:** referencias `0d7c714` · L1 base (Geist, tokens, luces, vidrio) `5c17881` · ADR-003 `af24fe1` · L2 header `27ce1db` · L3 hero `7cfbf73` · L4 historia de la demo `03291a7` · L5 servicios en bento `beaa69e` · L6 Arma tu sistema en el Inicio `3ffca5e` · L7 proceso y contacto `aeaa147` · L8 páginas internas `373d443`.
- **Lighthouse móvil del Inicio (mediana de 3, publicado):** LCP 1.5 s → 1.7 s · CLS 0 → 0 · JS 10.2 KB → 14.7 KB.
- **Revisión de Codex (base `7c9eb67`):** 2 hallazgos corregidos y cerrados por revisión independiente con **base `c79f5f6`**. El P2 adicional de Contacto a 320 px se corrigió en `421848f` y se volvió a revisar.
  - `472fc37`: conserva el cambio local del observador, con márgenes en píxeles según la altura, reconstrucción en `resize` y limpieza al salir.
  - `7f13f49`: sello «Demo · datos de ejemplo» dentro del bloque sticky; el teléfono reserva altura para que quepan sello y leyenda en 375×667.
- **Otros ajustes autorizados:** `8659341` une «¿Lo conversamos?» con espacio inseparable; `a13a3c8` reescribe `docs/diseño.md` para Liquid Glass + Geist según ADR-003.
- **Verificación (2026-10-24, Brave local):** Catálogo → Pedido → WhatsApp → Panel y sello visible a 1366×768, 1280×800, 390×844 y 375×667, también tras redimensionar. Barrido adicional de 21 posiciones del bloque sticky a 1366×768 y 375×667: sin ocultamientos del sello. Contacto en Inicio y `/contacto`, a 375 px: una línea y sin desborde horizontal.
- **Comandos finales:** `npm test` (366 tests, 34 archivos), `npm run lint`, `npm run check` (0 errores/advertencias/hints) y `npm run build`: correctos. Persiste la advertencia de Node sobre `localStorage` durante el build; no se añadieron dependencias.
- **Integración:** autorizada por Guillermo el 2026-10-24; PR #4 unido a TD2 y [PR #5](https://github.com/willardguillermo/NissiDev-Web/pull/5) hacia main con merge commit. Contacto corregido sin desborde a 320/375/390/1366 px; historia y sello comprobados en los cuatro tamaños. Lighthouse de arriba es la medición previa a estos arreglos; celular físico y evaluación global siguen en T27.

### T11 · feat: página de cotización imprimible — ✅ `3b1e992` (PR #3)
- **Qué:** página `cotizacion.astro` + isla `Cotizacion.tsx`: resumen del carrito, campo opcional "Nombre de tu negocio" (con label; no se guarda), botón "Enviar por WhatsApp" y botón "Guardar como PDF" (`window.print()`), hoja de estilos de impresión. Si el carrito está vacío, lleva a Arma tu sistema.
- **Terminado cuando:** la vista de impresión sale en una hoja limpia (sin header, menú ni botones) con "precios referenciales" y la validez; no hay nada que parezca un cobro.
- **Verificación:** vista previa de impresión en Chrome (guardar PDF); botón de WhatsApp probado en el celular.

**Punto de control 4:** flujo carrito → cotización → WhatsApp completo. ✅ Revisión de Codex junto con la T22 y la T23 (base `83b8b0e`): sin hallazgos. Publicado con el PR #3 (merge `5ff3eb9`). PDF de ejemplo en `docs/referencias/cotizacion-ejemplo.pdf`.

## Cotización con impresora

Spec y supuestos aprobados el 2026-10-24: [docs/cotizacion-impresora.md](../docs/cotizacion-impresora.md).
Rama `feature/cotizacion-impresora` desde TD2 (`c79f5f6`), actualizada mediante `a08e449`; base de revisión actual `9d164c2`. PR hacia `feature/td2-liquid`.
**Condición cerrada:** revisión independiente de HistoriaDemo, sello y Contacto terminada, e integración autorizada por Guillermo.
Cada rebanada: unas 100 líneas, máximo 300; verificación → commit con cuerpo que explique el porqué.

| Parte | Tamaño | Estado / alcance | Verificación específica | Commit previsto |
|---|---|---|---|---|
| CI1 | S | ✅ Spec y plan registrados; implementación pendiente | Aprobación contrastada; 366 tests, check y lint en verde; build correcto (advertencia de Node 26 sobre localStorage) | `docs: definir la cotización con impresora` |
| CI2 | M | ✅ Duración y secuencia cancelable fuera de React, sin conectar la interfaz | 18 tests nuevos (384 totales); check, lint y build correctos. Omitir `clearTimeout` hizo fallar la cancelación a 450 ms: 1 timer pendiente en vez de 0; restaurado y verde | `feat: controlar las fases de impresión` |
| CI3 | S | ✅ Papel y acciones separados; formulario fuera del papel | 384 tests, tipos, lint y build; reutiliza precios y mensaje | `18925e1` |
| CI4 | M | ✅ Ticketera, ranura, papel, aviso sin pago y token `--ease-papel` | Capturas en 390×844 y 1366×900; sin desborde; CLS 0 de carga/secuencia | `5743e30` |
| CI5 | M | ✅ Fases, acciones, repetición y movimiento reducido conectados | Reloj falso, repetición, modo reducido y teclado verificados; desmontaje real en ambas fases sin timers ni escrituras posteriores | `e3bf56f` |
| CI6 | S | ✅ A4 `f2645e9`; evidencia, checklist y cierre de navegador registrados | PDF de 9 módulos: 1 página A4; revisión independiente sin bloqueantes; Playwright cierra teclado, desmontaje y cambios entre pestañas | `fix: conservar la proforma A4 al imprimir` + documentación |

En cada parte: `npm test`, `npm run check`, `npm run lint` y `npm run build`; celular en las visibles.
**Punto de control:** revisión independiente en cinco ejes contra `9d164c2`, sin bloqueantes. [PR #4](https://github.com/willardguillermo/NissiDev-Web/pull/4) abierto hacia TD2. PR #4 unido a TD2 en `b575d9e` tras cerrar también la revisión de sus arreglos y recibir autorización. Entrega conjunta en PR #5 hacia main.
PR #4 conserva el resumen, tres capturas, pasos para probar y constancia del bloqueo ya resuelto; autorización recibida el 2026-10-24.
Evidencia y resultados: [VERIFICACION.md](../docs/referencias/cotizacion-impresora/VERIFICACION.md).

## Fase 5 — `demo` (motor)

### T12a · feat: modelo, conversiones y precios del pedido — ✅ `8969a4a`
- **Qué:** tipos en `demo/` (`RubroConfig`, `Producto`, `Presentacion`, `PrecioMayorista`, `Puesto`, `Ocasion`, `LineaPedido`, `Pedido`) y `demo/pedido.ts`: agregar línea (guarda la presentación y su factor), cambiar presentación, editar cantidad, eliminar línea, `aUnidadBase(cantidad, factor)`, subtotal, total y precio por mayor según cantidad mínima.
- **Terminado cuando:** test de la SPEC (cambiar unidad/bolsa/caja recalcula el subtotal); caso de conversión de la referencia (3 cajas × 24 = 72 unidades base; 1 bolsa de 6 + 2 unidades = 8 → 72 − 8 = 64); el precio por mayor se aplica desde la cantidad mínima; una línea guarda su factor aunque la presentación cambie después.
- **Verificación:** `npm test`.

### T12b · feat: disponibilidad del pedido — ✅ `95eeaf6`
- **Qué:** `demo/disponibilidad.ts`. El pedido de la demo **no descuenta stock**: solo valida que la suma de todas sus líneas del mismo producto, en unidad base y entre todas las presentaciones, no supere lo disponible. Agregar, editar o cambiar presentación que exceda el disponible se rechaza con un motivo para mostrar.
- **Terminado cuando:** tests: cantidades inválidas (0, negativas, decimales) rechazadas; exceso acumulado (8 disponibles: bolsa de 6 + 3 sueltas → falla; bolsa de 6 + 2 sueltas → pasa); editar una línea a más de lo disponible falla; reducir o eliminar una línea libera disponibilidad para otra; el stock del producto no cambia tras ninguna operación.
- **Verificación:** `npm test`.

### T13 · feat: búsqueda y filtros — ✅ `70cea57`
- **Qué:** `demo/filtros.ts`: buscar por texto (sin importar tildes ni mayúsculas) y filtrar por categoría, ocasión, puesto y marca, combinables.
- **Terminado cuando:** tests con un catálogo de prueba pequeño (tildes, filtros combinados, sin resultados).
- **Verificación:** `npm test`.

### T14 · feat: cascarón de la demo — ✅ `c6bb659` (en `feature/demo-plantilla`)
- **Qué:** página `demos/dulceria.astro` + isla `DemoDulceria.tsx` que recibe un `RubroConfig`: cambio entre vista cliente y vista dueño, navegación interna entre pantallas (estado en memoria), tema por variables CSS de la config, sello fijo **"Demo · datos de ejemplo"**. Con una config mínima de prueba.
- **Terminado cuando:** se cambia de vista y de pantalla con teclado; el sello se ve en todas las pantallas.
- **Verificación:** build; prueba manual en 375 px.

**Punto de control 5:** motor de la demo (modelo de datos y lógica del pedido) antes de cargar los datos de la dulcería.

## Fase 6 — `rubros/dulceria`

### T15 · feat: datos de Dulcería La Golosa — ✅ `ece9d2d` (en `feature/demo-plantilla`)
- **Qué:** `rubros/dulceria/config.ts` (textos, paleta `#EC48AE`, Shrikhand + Chivo, 2 puestos por defecto (la plantilla admite de 1 a 3), ocasiones, campaña activa configurable: Halloween por defecto, Navidad, Día del Niño o ninguna) y `productos.ts` (~30 productos genéricos con marcas ficticias, presentaciones, precios por mayor, etiquetas, stock, vencimientos). Ilustraciones propias simples (SVG o CSS).
- **Fuentes:** Shrikhand y Chivo en `public/fonts/` con su licencia (P5).
- **Terminado cuando:** test de integridad: toda presentación base tiene factor 1, cada producto está en al menos un puesto, referencias a categoría/ocasión/puesto válidas.
- **Verificación:** `npm test`; revisión de que ninguna marca sea real.

### T16 · feat: Inicio de la demo — ✅ `0fd8f9d` (en `feature/demo-plantilla`)
- **Qué:** barra de anuncio, header con buscador y WhatsApp, hero de temporada, compra por ocasión (2×2), categorías en carrusel, más vendidos, "Nuestros puestos" (los que tenga la configuración; con 1, "Nuestra tienda"), por qué elegirnos, footer; botón flotante y barra "Mi pedido (n)".
- **Terminado cuando:** 5-10-15 de la referencia en 375 px; el carrusel se usa con teclado.
- **Verificación:** prueba manual en 375 px y con Tab.

### T17 · feat: Catálogo de la demo — ✅ `da65ac1` (en `feature/demo-plantilla`)
- **Qué:** buscador fijo, chips de filtro, interruptor precio unidad / por mayor, grilla de 2 columnas con etiquetas Nuevo, Oferta y Agotado. Usa `filtros.ts`.
- **Terminado cuando:** buscar y filtrar actualiza la grilla; hay mensaje si no hay resultados; Agotado no se puede agregar.
- **Verificación:** prueba manual en 375 px.

### T18 · feat: Detalle de producto — ✅ `e4a1814` (en `feature/demo-plantilla`)
- **Qué:** imagen, nombre, marca, selector de presentación con precio, cantidad, "Agregar al pedido", "También te puede gustar".
- **Terminado cuando:** cambiar presentación cambia precio; agregar actualiza "Mi pedido (n)"; si supera lo disponible (T12b), no se agrega y se muestra el motivo.
- **Verificación:** prueba manual en 375 px.

### T19 · feat: Mi pedido — ✅ `0534297` (en `feature/demo-plantilla`)
- **Qué:** líneas con cantidad y subtotal, total, lugar de recojo según la configuración (con 1 puesto, "Recoger en tienda"; con 2 o 3, elegir el puesto), nombre (con label) y "Enviar pedido por WhatsApp" según P3: no abre WhatsApp, muestra el mensaje, el aviso de demostración y "Quiero esto para mi negocio". Sin pago.
- **Terminado cuando:** cambiar cantidades recalcula; el envío no abre ningún enlace externo y deja claro que es una demostración; el aviso se cierra con teclado (Esc) y devuelve el foco al botón.
- **Verificación:** test del mensaje del pedido; prueba manual en 375 px.

### T20a · feat: ventas ficticias del panel — ✅ `ee7c8ce` (en `feature/demo-plantilla`)
- **Qué:** `rubros/dulceria/ventas.ts`: ventas fechadas (fecha y hora, puesto, líneas con producto, presentación, factor y cantidad, medio de pago: efectivo, Yape o Plin) que cubren al menos los 7 días anteriores, y una **fecha de referencia fija** (`HOY_DEMO`) para que el panel no dependa del reloj. Tipo `Venta` en `demo/`.
- **Terminado cuando:** test de integridad: toda venta referencia productos, presentaciones y puestos existentes; hay ventas en `HOY_DEMO` en todos los puestos de la configuración y con los 3 medios de pago; ninguna fecha es posterior a `HOY_DEMO`.
- **Verificación:** `npm test`.

### T20b · feat: Panel del dueño — ✅ `b227e7c` (en `feature/demo-plantilla`)
- **Qué:** cálculos puros en `demo/panel.ts` a partir de las ventas, productos y `HOY_DEMO` (ventas del día por puesto, por vencer en 7 días, stock bajo, más vendidos de la semana, cobros por medio de pago) y la vista con barras CSS, sin librería de gráficos. La vista solo muestra lo que devuelven los cálculos.
- **Terminado cuando:** tests de cada cálculo con datos pequeños de prueba y fecha fija; ningún número está escrito a mano en la vista; se lee bien en 375 px.
- **Verificación:** `npm test`; prueba manual en 375 px.

**Punto de control 6:** demo completa navegable (criterio de éxito 2). ✅ Revisión de Codex (base `3422cc1`): 3 hallazgos, los 3 arreglados: filtros del catálogo perdidos al ir a Dueño y volver (`ba1d7e3`, `nav` como única fuente de verdad), cantidad vacía que guardaba `NaN` y bloqueaba + y − (`76807ba`, `normalizarCantidad()` en Detalle y Mi pedido) y flecha de «Más filtros» y hover que se movían con movimiento reducido (`69eb0f0`, con test que lista los giros y desplazamientos de `demo.css`). Ajustes del panel: más vendidos por monto en soles (`36cf015`) y título que se achica con nombres largos (`e848a45`). Antes: «Más filtros» en el catálogo `a1e7ebd` y prueba de peor caso `32dd32a`. Publicado con el PR #2 (merge `a2fd7cf`).

## Fase 7 — `sitio`

### T21 · feat: Inicio de NissiDev — en parte adelantada en la TD1
- **Arreglo en `main` (2026-10-24, `710b195`):** «Ver la demo de mi rubro» y «Abrir la demo» llevan a `/demos/dulceria/` (antes: ancla `#demo` y aviso «Muy pronto»). En `feature/paginas-mvp`, «Ver la demo de mi rubro» pasa a `/demos`.
- **Qué:** hero 5-10-15, botón "Ver la demo de mi rubro", WhatsApp secundario, resumen de servicios, llamado al carrito y sección "Casos: próximamente" (P4). Textos en borrador para que Guillermo los corrija.
- **Terminado cuando:** criterio de éxito 1: qué hago, por qué elegirme y WhatsApp visibles sin bajar más de una pantalla en 375 px.
- **Verificación:** captura en 375 px.

### T22 · feat: Servicios y stack — ✅ `daa20ad` (PR #3)
- **Qué:** proceso (maqueta → propuesta → ≈4 semanas → soporte) y tecnologías.
- **Terminado cuando:** página enlazada desde el menú; textos en borrador marcados para revisión.
- **Verificación:** prueba manual en 375 px.

### T23 · feat: Demos y Contacto — ✅ `2d44b4a` (PR #3)
- **Qué:** tarjetas por rubro (Dulcería activa; Hospedaje y Restaurante campestre "Próximamente") y página de Contacto con WhatsApp.
- **Terminado cuando:** todas las páginas del BRIEF existen y están enlazadas.
- **Verificación:** recorrer el menú en 375 px.

### T24 · feat: transiciones y scroll suave — ✅ resuelta en la TD1 con CSS (ADR-002)
- **Qué:** View Transitions de Astro; el carrito sigue intacto al cambiar de página. Scroll nativo del navegador y `scroll-behavior: smooth` para los anclas (sin Lenis).
- **Terminado cuando:** con "movimiento reducido" no hay scroll suave ni transición animada.
- **Verificación:** prueba manual con y sin "movimiento reducido" (emulación en DevTools).

### T25 · feat: animaciones de entrada y scroll — ✅ resuelta en la TD1 con CSS (ADR-002)
- **Qué:** entrada del hero (el logo que se arma) con `@keyframes` y aparición al hacer scroll con `animation-timeline: view()`; solo `transform`, `opacity` y un desenfoque ≤ 4 px. Sin GSAP.
- **Terminado cuando:** con "movimiento reducido", menos y más suave, no cero (sin desplazamientos ni giros, con fundidos cortos); sin saltos de diseño (CLS).
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

## Estructura por rubros (2026-10-25)
Spec: `docs/estructura-rubros.md` · ADR-004 · rama `feature/estructura-rubros` desde `de7743d`. Implementa Claude Code; revisa Codex.

### ER-a · feat: quitar la ubicación
- **Qué:** sin «Este de Lima» en hero, footer, descripciones de Base y Servicios, Contacto y la proforma; se borra `ZONA`.
- **Terminado cuando:** un test recorre `src/` y falla si vuelve «Este de Lima».

### ER-b · feat: rutas, redirecciones y menú con Cotizar
- **Qué:** `/demos` → `/soluciones`, `/arma-tu-sistema` → `/cotizar`, `/sobre-mi` nuevo; 301 en `public/_redirects`; menú Soluciones · Servicios · Sobre mí · Contacto + botón Cotizar (n).
- **Terminado cuando:** ningún enlace interno apunta a una ruta vieja; el carrito sigue en `/cotizar`.

### ER-c · feat: footer en columnas
- **Terminado cuando:** grilla de 3 columnas + línea del © en escritorio; apilado a la izquierda en el celular.

### ER-d · feat: Inicio reordenado
- **Qué:** hero → celular → tarjetas de rubros → proceso corto → CTA final. Salen el carrito, el bento, el stack y la tarjeta de contacto.

**Punto de control ER-1:** push y comprobar `https://feature-estructura-rubros.nissidev-web.pages.dev`.

### ER-e · feat: historia por rubro
- **Qué:** selector de 5 rubros sobre el celular, pasos generales, leyendas por rubro, `src/rubros/<id>/historia.ts` con tipo común y tests; botón «Abrir la demo completa» o «Pide la demo de tu rubro».
- **Terminado cuando:** cambia con mouse, toque y teclado; sello en los 4 pasos; CLS 0; JS del Inicio cerca de 14.7 KB.

### ER-f · feat: Soluciones
- **Qué:** galería de los 5 rubros; demo o «Próximamente · pídela por WhatsApp».

### ER-g · feat: Servicios
- **Qué:** 4 tipos, qué hace cada función (`MODULOS`), proceso, precios «desde», preguntas frecuentes y Cotizar. Sin stack.

### ER-h · feat: Sobre mí
- **Qué:** NissiDev con su logo, «Desarrollador full stack», texto de Guillermo, GitHub y LinkedIn (también en el footer) + «Con qué construyo» con íconos de Simple Icons (CC0) copiados a mano.

**Punto de control ER-2:** «Listo para revisión» con base `de7743d`.

## Supuestos de este plan
1. `formatearSoles` vive en `src/ui/formato.ts` (la SPEC no tiene carpeta para utilidades compartidas, y lo usan tanto el carrito como la demo).
2. Las dependencias se instalan en la tarea que las usa, no todas en la T01, y cada una se pide antes.
3. El motor `demo` no importa nada de `rubros/`; la página de la demo le pasa la config de la dulcería.
