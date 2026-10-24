# Diseño de la web de NissiDev

> Dirección **Liquid Glass** (TD2), aprobada por Guillermo el 2026-10-24.
> Referencia: `docs/referencias/td2/prototipo-liquid.html`, versión 1 con **Geist**, y su `LEEME.md`.
> Decisiones: [ADR-003](decisions/ADR-003-vidrio-y-geist.md) y [ADR-002](decisions/ADR-002-movimiento-con-css.md).
> Los valores viven en `src/styles/tokens.css`; este documento explica cuándo usarlos.

## Dirección visual
- Un mundo claro: crema, tinta y oro, con luces suaves de la marca detrás de las superficies de vidrio.
- El Inicio explica el servicio con una demo que cambia al bajar, servicios en bento y funciones seleccionables con su precio referencial.
- En celular, una columna centrada con margen lateral mínimo de 20 px. En escritorio, contenedor de hasta 72 rem y composiciones con varias columnas.
- El logo geométrico conserva tinta `#1E1F22` y oro `#B28A4C`. El armado por piezas abre el hero; los textos y acciones aparecen sin esperar a que termine.
- Frase de marca: «Software que impulsa tu negocio.» La dulcería mantiene su identidad propia: Shrikhand + Chivo y su tema configurable.

## Material: vidrio sobre luces
La clase `.vidrio` de `src/styles/global.css` reúne el degradado blanco translúcido, desenfoque del fondo, saturación, borde brillante y sombras. Usar la clase compartida en vez de recrear el material en cada componente.

| Variante / token | Uso |
|---|---|
| `.vidrio` | Tarjetas grandes; filtro de 24 px y radio de 28 px |
| `.vidrio--chico` | Chips y botones; filtro de 14 px y sombra menor |
| `.vidrio--fuerte` / `--vidrio-fuerte` | Header flotante, más opaco porque pasa encima del contenido |
| `--vidrio` → `--vidrio-2` | Degradado blanco con opacidad de 0.58 → 0.36 |
| `--vidrio-borde`, `--vidrio-sombra` | Brillo del borde y separación respecto al fondo |
| `--luz-1`…`--luz-4` | Manchas doradas y una fría, fijas detrás de la página |

Reglas del material (apple-design §12):
- Pocas capas por pantalla. Evitar apilar superficies claras translúcidas; el header usa el material fuerte.
- Cifras y totales sobre superficies sólidas, claras u oscuras. El vidrio no debe dificultar comparar importes.
- No animar el desenfoque del vidrio. Las luces tienen desenfoque estático y se desplazan con `transform` al hacer scroll, sin bucles automáticos.
- Con `prefers-reduced-transparency: reduce`, superficies blancas sólidas y sin luces ni reflejos. Con `prefers-contrast: more`, vidrio sólido con borde de tinta.

## Paleta y contraste
| Token | Valor | Uso |
|---|---|---|
| `--color-claro` / `--fondo` | `#F7F4EC` | Fondo crema |
| `--color-negro` / `--texto` | `#1E1F22` | Texto principal, logo y superficies oscuras |
| `--tinta-2` / `--texto-suave` | `#3E3F44` | Texto secundario |
| `--tinta-3` / `--texto-nota` | `#55565B` | Notas y etiquetas pequeñas |
| `--color-dorado` / `--acento` | `#B28A4C` | Logo y adornos; no texto sobre claro |
| `--oro-texto` / `--acento-texto` | `#6E5122` | Acentos de texto y foco sobre claro |
| `--oro-claro` / `--acento-sobre-oscuro` | `#E7CF9F` | Acentos sobre oscuro |
| `--color-contorno` | `#8A857C` | Límites de controles sobre claro |

Texto con contraste ≥ 4.5:1; controles y foco ≥ 3:1. `src/styles/tokens.test.ts` mide el texto sobre crema, luces y el vidrio en su parte más transparente. Añadir allí cualquier combinación nueva. Las zonas oscuras llevan `.zona-oscura`, que cambia el color del foco.

## Tipografía y formas
Geist variable (OFL), subconjunto latino servido y precargado desde `public/fonts/`. Una sola familia para el sitio; la demo conserva sus fuentes. Titulares en peso **650** (`--peso-titulo`), con espaciado negativo según su tamaño.

| Uso | Tamaño / tratamiento |
|---|---|
| Hero | 42 → 96 px, `clamp(2.625rem, 11vw, 6rem)`, máximo 13ch |
| `--titulo-1` | 44 → 76 px para títulos de página |
| `--titulo-2` | 30 → 44 px para secciones |
| Texto | 16 px, interlineado 1.55; bajada del hero 17 → 20 px |
| Notas / etiquetas | 12 → 14 px, con tinta legible; etiquetas en mayúsculas |
| Espaciado | −0.045em en títulos grandes y −0.035em en secciones |

Tarjetas de vidrio de 28 px de radio; bloques internos de 16 px. Botones principales en píldora de al menos 52 px de alto, tinta con texto blanco; secundarios de vidrio. Controles pequeños con área táctil mínima de 44 × 44 px. Los bordes y sombras separan superficies sin endurecer el conjunto.

## Composición del Inicio
- **Header flotante:** marca, navegación y acceso al sistema elegido; menú en celular. Fondo más opaco y espacio suficiente para no tapar el contenido al navegar.
- **Hero:** logo, frase principal, explicación y acciones «Ver la demo de mi rubro» / «Escríbeme», con los cuatro servicios en chips.
- **Historia de la demo:** teléfono sticky con Catálogo → Pedido → WhatsApp → Panel. Las mini pantallas salen de `src/demo/historia.ts` y de la configuración del rubro, sin React en el Inicio.
- **Servicios:** bento de cuatro tarjetas. Los servicios se pueden leer sin esperar un cambio automático.
- **Arma tu sistema:** chips seleccionables y resumen de inversión sobre una capa sólida. Mantiene la lógica compartida de dependencias y precios referenciales.
- **Proceso, stack y contacto:** cuatro pasos, tecnologías y tarjeta de WhatsApp con número seleccionable y «Copiar número».

### Historia con scroll
Los botones también permiten cambiar de paso con teclado; `aria-current="step"` identifica el activo y una leyenda `aria-live="polite"` explica la mini pantalla. Sin JavaScript quedan la portada, la leyenda y el sello, sin controles ni espacios vacíos de scroll.

El sello **«Demo · datos de ejemplo» vive dentro del bloque sticky**, debajo de la leyenda, y acompaña todos los pasos. El tamaño del teléfono reserva altura para los controles, la leyenda y el sello, incluido el viewport de 375×667.

El `IntersectionObserver` usa márgenes en píxeles calculados con `innerHeight * 0.45`; los porcentajes de `rootMargin` se resuelven respecto al ancho y pueden vaciar la zona en apaisado. Se reconstruye al redimensionar y se desconecta, junto con sus listeners, al salir mediante View Transitions. Verificar a 1366×768, 1280×800, 390×844 y 375×667, también al redimensionar.

## Servicios (textos de Guillermo, no cambiarlos)
| # | Servicio | Frase |
|---|---|---|
| 01 | Páginas web | Que te encuentren. Que te elijan. |
| 02 | Sistemas a medida | Tu negocio, bajo control. |
| 03 | Aplicaciones móviles | Tu negocio en el bolsillo de tus clientes. |
| 04 | Paneles de administración | Decide con datos, no con suposiciones. |

## Movimiento y accesibilidad
- CSS para entradas, transiciones y apariciones con `animation-timeline: view()`; scripts pequeños con `IntersectionObserver` y `requestAnimationFrame` cuando hacen falta. Sin GSAP ni Lenis (ADR-002).
- Movimiento nuevo solo con `transform` y `opacity`. Evitar `transition: all`, entradas desde `scale(0)` y `ease-in` para responder a una acción.
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para entradas y respuesta; `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` para desplazamientos en escena.
- Al presionar, `scale(0.97)` durante 160 ms; hover solo con `(hover: hover) and (pointer: fine)`. Nada avanza automáticamente.
- Con movimiento reducido, logo armado y fundidos cortos de 200 ms; sin inclinación del teléfono, parallax de luces ni apariciones ligadas al scroll. Los pasos siguen siendo utilizables.
- Foco visible y teclado en todos los controles. Resúmenes y avisos comunican sus cambios; los datos ilustrativos del teléfono se explican con la leyenda accesible.
- En móvil: `touch-action: manipulation`, sin destello gris al tocar, unidades `svh`/`dvh` donde corresponde y zoom disponible. La comprobación por tamaños no sustituye la aprobación en el celular real de Guillermo.

## Verificación y costo
Pocas superficies con `backdrop-filter`, sin animar su filtro. Revisar que el texto siga legible con luces, transparencia reducida y contraste aumentado. Comprobar el recorrido y el sello en móvil, el título de Contacto sin «¿Lo» aislado y la navegación con teclado.

Lighthouse móvil del Inicio publicado (mediana de tres, medición de la TD2): LCP **1.7 s**, CLS **0**, JavaScript **14.7 KB**. Son referencias de esa medición; repetir si un cambio aumenta el costo visual o el JavaScript. Objetivo del MVP: LCP ≤ 2.5 s, CLS ≤ 0.1 e INP ≤ 200 ms.
