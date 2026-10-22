# Spec: Web NissiDev — MVP

## 0. Mapa de módulos
| Módulo | Responsabilidad | Depende de |
|---|---|---|
| `ui` | Tokens de diseño (colores, tipografías, espacios), botones, tarjetas, layout | — |
| `catalogo-servicios` | Lista de módulos vendibles: nombre, descripción para dueños, precio "desde", mensualidad, dependencias | — |
| `carrito` | Agregar o quitar módulos, resolver dependencias, calcular totales, carritos sugeridos por rubro | `catalogo-servicios` |
| `cotizacion` | Resumen imprimible/PDF y mensaje de WhatsApp a partir del carrito | `carrito` |
| `demo` | Motor de demos: lee la configuración de un rubro y muestra vista cliente y vista dueño con datos de ejemplo | `ui` |
| `rubros/dulceria` | Configuración y datos ficticios de la dulcería | `demo` |
| `sitio` | Páginas de NissiDev: Inicio, Servicios y stack, Demos, Arma tu sistema, Contacto | todos |

Orden de construcción: `ui` → `catalogo-servicios` → `carrito` → `cotizacion` → `demo` → `rubros/dulceria` → `sitio`.
**Fuera del MVP:** enlace personalizado (etapa 2), demos de hospedaje y campestre (etapa 2), chatbot con n8n (etapa 3).

## Objetivo
**Qué:** la web de NissiDev con (1) mi presentación como desarrollador, (2) una demo funcional de sistema para una **dulcería con puestos** y (3) un **carrito de funcionalidades** que termina en una cotización por WhatsApp.
**Para quién:** dueños de negocios del Este de Lima (llegan desde mi mensaje de WhatsApp) y, en segundo lugar, reclutadores de prácticas (sección de stack).
**Por qué:** mostrar cómo quedaría *su* sistema antes de hablar de precio, y que el dueño arme lo que necesita.
**Cómo sabré que funcionó:** un dueño entra desde el celular, prueba la demo y me envía una cotización por WhatsApp sin ayuda.

## Stack
Decisión en `docs/decisions/ADR-001-astro-con-islas-de-react.md`.
- **Astro + TypeScript** (versión estable al crear el repo) para páginas, layout y diseño
- **Islas de React** solo para lo interactivo: demo, carrito, cotización
- **nanostores** (+ `@nanostores/persistent`) para compartir el carrito entre islas y páginas
- Animación: **CSS** (`@keyframes`, transiciones, `animation-timeline: view()`) y **View Transitions** de Astro; sin GSAP ni Lenis (ADR-002)
- CSS propio con variables (tokens) en `src/styles/tokens.css`; sin librería de componentes
- Vitest para lógica; ESLint; `astro check` para tipos
- Hosting: Cloudflare Pages conectado al repo de GitHub (cada push publica; cada rama tiene su enlace de vista previa)
- Datos: archivos TypeScript en el repo; el estado de la demo vive en memoria y el carrito persiste en `localStorage` (con manejo de errores)

## Comandos
- Instalar: `npm install`
- Desarrollo: `npm run dev` (http://localhost:4321)
- Compilar: `npm run build` · Ver lo compilado: `npm run preview`
- Tipos: `npx astro check`
- Tests: `npm test`
- Lint: `npm run lint`

## Estructura
Carpeta en la Mac: `~/Proyectos Personales/nissidev-web` (aparte de las carpetas por curso) · repo `willardguillermo/NissiDev-Web`.
```
nissidev-web/
├── SPEC.md · AGENTS.md · CLAUDE.md · README.md
├── docs/decisions/              # ADR-001…
├── tasks/plan.md
├── public/                      # logo NissiDev, favicon
└── src/
    ├── pages/                   # index, servicios, demos/dulceria, arma-tu-sistema, cotizacion, contacto (.astro)
    ├── layouts/Base.astro       # header, footer, View Transitions
    ├── components/              # piezas .astro sin estado (Hero, Tarjeta, Boton)
    ├── islas/                   # React: Carrito.tsx, DemoDulceria.tsx, Cotizacion.tsx
    ├── styles/tokens.css
    ├── catalogo-servicios/      # modulos.ts
    ├── carrito/                 # carrito.ts (lógica pura) + carrito.test.ts + store.ts (nanostores)
    ├── cotizacion/              # mensajeWhatsApp.ts + test
    ├── demo/                    # motor y tipos de RubroConfig
    └── rubros/dulceria/         # config.ts, productos.ts (datos ficticios)
```

## Estilo
- Código y nombres en **español** (`agregarModulo`, `totalInicial`), componentes en PascalCase.
- Lógica pura separada de la UI, para poder probarla sin React:
```ts
// carrito/carrito.ts
export function agregarModulo(carrito: Carrito, id: ModuloId): Carrito {
  const faltantes = dependenciasFaltantes(carrito, id);
  return { ...carrito, items: [...carrito.items, ...faltantes, id] };
}
```
- Montos en **céntimos enteros** (`100000` = S/ 1,000) para no tener errores de decimales.
- Marca NissiDev: negro `#1E1F22` · dorado `#B28A4C` · claro `#F3EFE7`. La demo de dulcería usa su propio estilo (`docs/referencias/demo-dulceria.md`: rosa `#EC48AE`, Shrikhand + Chivo).
- Diseño: regla 5-10-15 y patrones de *Biblioteca Web* (vault); inspirarse, nunca copiar código, imágenes ni logos.

## Tests
- **Vitest (unitarios), en `*.test.ts` junto al archivo:**
  - `carrito`: dependencias (agregar Caja agrega Inventario y Panel), quitar con dependientes (avisa), totales inicial y mensual, sin duplicados.
  - `cotizacion`: el mensaje de WhatsApp lleva módulos, totales y la palabra "referencial"; el enlace `wa.me` está bien codificado.
  - `demo`: agregar un producto al pedido y cambiar la presentación (unidad / bolsa / caja) recalcula el subtotal.
- **Manual con captura:** recorrido en celular (Inicio → demo → carrito → WhatsApp).
- **Lighthouse (móvil)** sobre la versión publicada.

## Límites
- **Siempre:** marcar la demo con "Demo · datos de ejemplo"; mostrar los precios como "desde" y "referenciales"; probar en ancho de celular; commits pequeños en formato `<tipo>: <descripción>`.
- **Preguntar primero:** agregar una dependencia npm nueva; cambiar precios o textos comerciales; publicar en un dominio; cualquier cosa con datos personales.
- **Nunca:** cobrar o simular un pago; usar fotos, logos o código de terceros; subir claves o `.env`; usar `chore` en commits o ramas; agregar `Co-Authored-By` de IA o "Generated with…".

## Criterios de éxito
- [ ] **5-10-15 en móvil:** en Inicio se ve qué hago, por qué elegirme y el botón de WhatsApp sin hacer scroll más de una pantalla.
- [ ] **Demo de dulcería navegable:** Inicio, Catálogo (buscador + filtros + precio unidad/mayor), Detalle (presentaciones), Mi pedido (enviar por WhatsApp) y Panel del dueño con datos de ejemplo.
- [ ] **Carrito:** al agregar un módulo con dependencias se agregan o se avisan; al quitar uno del que dependen otros, avisa; muestra inversión inicial "desde" y mensualidad por separado.
- [ ] **Carrito sugerido "Dulcería"** con un clic.
- [ ] **Cotización:** abre WhatsApp al **+51 913 351 627** con el resumen correcto y se puede guardar en PDF.
- [ ] **Animaciones:** entrada del hero, aparición al hacer scroll y transición entre páginas; con "movimiento reducido" activado, menos y más suave, no cero: sin desplazamientos ni giros, con fundidos cortos.
- [ ] **Rendimiento (móvil, publicado):** LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms.
- [ ] **Accesibilidad:** todo se usa con teclado, contraste ≥ 4.5:1, campos con label, respeta "movimiento reducido".
- [ ] `npm run build`, `npm test` y `npm run lint` pasan sin errores.
- [ ] Publicado en Cloudflare Pages (`*.pages.dev`).

## Supuestos
1. Es un sitio **solo frontend**; no hay base de datos ni login en el MVP.
2. Un repo nuevo y **público** en GitHub (`willardguillermo/NissiDev-Web`), que también suma al portafolio.
3. Precios "desde" tomados de la proforma NSD-2026-001 (catálogo, panel, mantenimiento, caja). **Reservas, Inventario, Boletas SUNAT y Chatbot muestran "Cotizar"** (decidido).
4. El PDF se genera con la impresión del navegador ("Guardar como PDF") y una hoja de estilos de impresión, sin librería extra.
5. Las imágenes de productos de la demo son ilustraciones o marcadores propios, no fotos de marcas.
6. El código lo escribe Guillermo con Claude Code en la terminal, a partir de prompts por tarea que prepara Claude; cada tarea termina en un commit (implementar → test → verificar → commit). En cada punto de control del plan, Codex revisa (`/codex:review` para código, `/codex:adversarial-review` para diseño o antes de publicar) y se aplica lo que corresponda antes de seguir.

## Decisiones tomadas (2026-10-21)
- Código en una carpeta de la Mac + repo en GitHub + Cloudflare Pages conectado al repo.
- Astro con islas de React → `docs/decisions/ADR-001-astro-con-islas-de-react.md`.
- WhatsApp de cotizaciones: +51 913 351 627.
- Módulos sin precio de referencia: "Cotizar".

- Demo: **Dulcería La Golosa**, ~30 productos genéricos sin marcas reales; ilustraciones o marcadores como imágenes.
- Catálogo web desde S/ 700 · cotización con código único `NSD-AAAA-XXXX` (sin correlativo) y 15 días de validez · Cloudflare Web Analytics.
- Textos: borrador de Claude Code, corregido por Guillermo.

## Preguntas abiertas
- No bloquean: permiso para mostrar Continental Hydraulic, compra de nissidev.com y hosting de n8n (etapa 3). Ver `BRIEF.md`.
