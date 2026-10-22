# Diseño de la web de NissiDev

> Dirección **Ensamble** (TD1, 2026-10-22), en revisión en la rama `feature/td1-diseno`.
> Sale del **video oficial de la marca**. Referencia: `docs/referencias/td1/prototipo-ensamble.html`
> (versión 1) y el logo `docs/referencias/marca/nissidev-logo.svg`.
> Los valores viven en `src/styles/tokens.css`; este documento explica **cuándo** usar cada uno.

## Dirección: Ensamble
- **Un solo mundo claro**, como el video: fondo crema, tarjetas blancas, tinta casi negra y el dorado del logo para líneas y detalles.
- **El logo es el protagonista.** Abre el Inicio y se **arma en 3D**: cuatro piezas negras llegan a su lugar, la cinta dorada gira y cae, y la escena, inclinada en vista isométrica, se endereza.
- **Todo centrado y con mucho aire** en el celular. En escritorio, el mismo eje central con un ancho máximo.
- **Frase de marca:** "Software que impulsa tu negocio."
- Reemplaza a la dirección B "Papel y oro" + momento A (la N en 3D), que parecía una plantilla. Ya no hay bandas negras ni la sección "Hecho a medida".

## El logo
- SVG de 5 piezas (`src/components/Logo.astro`): `p-tl`, `p-bl`, `p-tr`, `p-br` (negras) y `p-oro` (la cinta).
- Los colores del logo no cambian: tinta `#1E1F22` y dorado `#B28A4C`.
- El favicon (`public/favicon.svg`) es el mismo logo.

## Servicios (textos de Guillermo, no cambiarlos)
| # | Servicio | Frase |
|---|---|---|
| 01 | Páginas web | Que te encuentren. Que te elijan. |
| 02 | Sistemas a medida | Tu negocio, bajo control. |
| 03 | Aplicaciones móviles | Tu negocio en el bolsillo de tus clientes. |
| 04 | Paneles de administración | Decide con datos, no con suposiciones. |

## Paleta y en qué fondo va cada color
| Token | Color | Sobre crema `#F7F4EC` / blanco | Sobre negro `#1E1F22` | Uso |
|---|---|---|---|---|
| `--color-claro` (crema) | `#F7F4EC` | — | ✅ texto (15.0) | fondo de página, texto sobre negro |
| `--color-blanco` | `#FFFFFF` | — | ✅ | tarjetas |
| `--color-negro` (tinta) | `#1E1F22` | ✅ texto (15.0 / 16.5) | — | texto, botón principal, piezas del logo |
| `--color-dorado` | `#B28A4C` | ❌ texto (2.9) · solo logo, líneas y adornos | ✅ texto (5.2) | cinta del logo, líneas cortas, perilla del interruptor |
| `--color-dorado-texto` | `#80612C` | ✅ texto (5.2 / 5.7) | ❌ (2.9) | etiquetas, "01 / 04", precios, foco |
| `--color-gris` | `#5E5F63` | ✅ texto (5.8 / 6.4) | ❌ | texto secundario |
| `--color-contorno` | `#8A857C` | ✅ borde de control (3.3 / 3.7) | — | límite de interruptores apagados |
| `--color-piedra`, `--color-arena`, `--color-oro-claro` | | ❌ | ✅ | solo dentro del resumen negro de Arma tu sistema |

**Reglas**
- El dorado `#B28A4C` **nunca** es texto sobre claro: para eso está `#80612C`.
- La única zona oscura que queda es el **resumen fijo** de Arma tu sistema (lleva `.zona-oscura`, que cambia el color del foco).
- Un control necesita un borde con ≥ 3:1 respecto a su fondo.
- Toda combinación nueva se agrega a `src/styles/tokens.test.ts`, que mide el contraste real.

## Tipografía
Manrope (OFL), variable, servida desde `public/fonts/`. **Titulares en peso 700** (`--peso-titulo`), no 800.

| Uso | Tamaño | Notas |
|---|---|---|
| h1 del hero | 32 → 56 px | 700 · interlineado 1.04 · espaciado −0.035em · máx. 14ch |
| `--titulo-2` | 30 → 44 px | 700 · títulos de sección |
| Etiqueta (eyebrow) | 12 px | 700 · mayúsculas · espaciado 0.14em · `--acento-texto` |
| `--texto-md` | 16 px | texto, interlineado 1.55 |
| `--texto-sm` / `--texto-xs` | 14 / 12 px | notas |

## Formas
- **Tarjetas** blancas, radio 24 px, `--sombra-tarjeta` suave. Sin bordes duros.
- **Botones** en píldora, 48 px de alto: principal tinta con texto crema; secundario transparente con contorno suave.
- **Botón de icono** (menú, pausa): 44 × 44 px, círculo con contorno suave.
- **Línea dorada corta** (28 × 2 px) como separador dentro de tarjetas.

## Movimiento (reglas de Emil Kowalski)
| Curva | Valor | Uso |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | entradas, botones, cambios de la interfaz |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | lo que se mueve en pantalla: la escena del logo que se endereza |

1. **La herramienta más barata que funcione:** CSS (`@keyframes` y transiciones). Sin GSAP ni Lenis.
2. Solo `transform`, `opacity` y un `filter: blur()` de **4 px como máximo**. Nunca `transition: all`. Nunca desde `scale(0)`. Nunca `ease-in` en una entrada.
3. **El armado del logo es de "una vez":** completo en la primera visita de la sesión; en las siguientes páginas o visitas, el logo aparece con un fundido corto (`sessionStorage`, dentro de `try/catch`).
4. **El texto no espera al logo:** el hero empieza a aparecer a los ~300 ms y queda completo en ~1.2 s. Sin JavaScript se ve igual (es CSS).
5. **Botones:** `scale(0.97)` en `:active`, 160 ms. Los efectos de pasar el mouse, solo en `@media (hover: hover) and (pointer: fine)`.
6. **Movimiento reducido = menos y más suave, no cero:** sin desplazamientos ni giros, con fundidos cortos (200 ms). El logo aparece armado. El rotador de servicios no avanza solo.
7. **Celular:** sin el destello gris al tocar, `100svh`/`dvh` en vez de `100vh`, `touch-action: manipulation` en lo que se toca.
8. Transiciones entre páginas con View Transitions de Astro; el carrito no se pierde.

## Rotador de servicios
- Tarjeta blanca con "01 / 04", el nombre, la línea dorada y la frase. Cambia con fundido + desenfoque leve.
- Avanza cada 3 s, con botón visible de pausa/reproducir (44 px).
- Se pausa al recibir el foco, al tocar un punto o si la pestaña está oculta. Con movimiento reducido no avanza solo.
- Los puntos son botones con nombre ("Páginas web", …).

## Accesibilidad
- Contraste: texto ≥ 4.5:1, controles y foco ≥ 3:1 (medido en los tests).
- Foco visible siempre (`:focus-visible`), y nada fijo lo tapa (`scroll-padding`).
- Interruptores con `role="switch"` y `aria-checked`; avisos con `role="status"`.
- El logo grande lleva `role="img"` y nombre; el del header es parte del enlace "NissiDev, ir al inicio".
- Áreas táctiles de 44 × 44 px como mínimo.
