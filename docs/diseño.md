# Diseño de la web de NissiDev

> Dirección **provisional** (TD1, 2026-10-21), en revisión en la rama `feature/td1-diseno`.
> Bocetos de referencia en `docs/referencias/td1/`. Los valores viven en `src/styles/tokens.css`;
> este documento explica **cuándo** usar cada uno.

## Dirección: B "Papel y oro" + momento A
- **Base B · Papel y oro:** fondo claro cálido, tarjetas blancas, bloques y footer negros, dorado como acento. Se siente ordenado, cercano y "de confianza" para el dueño de un negocio que llega desde WhatsApp.
- **Momento A:** la **N de NissiDev en 3D**, en una sección oscura cerca del final ("Hecho a medida"). **Nunca en la primera pantalla**: el hero tiene que cargar rápido y decir qué hago.
- **La N** se hace con CSS 3D + GSAP (tres piezas: dos laterales oscuras y la diagonal dorada).
  - 📌 **Lugar reservado para una escena de Spline futura**: `src/components/NTresD.astro`. Si algún día se usa Spline, reemplaza solo esa pieza, se carga con `client:visible` y debe tener la versión CSS como respaldo (y para "movimiento reducido").
- **No se usan** (decidido): Spline por ahora, Skiper UI, Tailwind ni Motion. Sus ideas (pestañas con indicador que se desliza, contador del total) se hacen con GSAP y código propio.

## Paleta y en qué fondo va cada color
| Token | Color | Sobre claro `#F3EFE7` / blanco | Sobre negro `#1E1F22` | Uso |
|---|---|---|---|---|
| `--color-negro` | `#1E1F22` | ✅ texto (14.4 / 16.5) | — | texto principal, bloques y footer, botón principal |
| `--color-claro` | `#F3EFE7` | — | ✅ texto (14.4) | fondo de página, texto sobre negro |
| `--color-blanco` | `#FFFFFF` | — | ✅ | tarjetas, píldoras |
| `--color-dorado` | `#B28A4C` | ❌ texto (2.8) · solo adornos o texto ≥ 24 px en negrita | ✅ texto (5.2) | acento, botón dorado (texto negro 5.2), foco sobre negro |
| `--color-dorado-texto` | `#80612C` | ✅ texto (5.0 / 5.7) | ❌ (2.9) | precios, "Dev" del logo, números, foco sobre claro |
| `--color-gris` | `#5E5F63` | ✅ texto (5.6 / 6.4) | ❌ | texto secundario |
| `--color-piedra` | `#C9C4BA` | ❌ | ✅ texto (9.5) | texto secundario sobre negro |
| `--color-arena` | `#9C978E` | ❌ | ✅ texto (5.7) | notas pequeñas sobre negro |
| `--color-oro-claro` | `#D9B77E` | ❌ | ✅ texto (8.7) | avisos dorados sobre negro |
| `--color-contorno` | `#8A857C` | ✅ borde de control (3.7 / 3.2) | — | límite de interruptores apagados |
| `--color-linea`, `--color-interruptor`, `--color-punteado` | | decorativos | | separadores, fondo del interruptor, borde punteado |

**Reglas**
- El dorado `#B28A4C` **nunca** es texto normal sobre fondo claro: para eso está `#80612C`.
- Toda zona con fondo negro lleva la clase **`.zona-oscura`** (cambia el color del foco al dorado original).
- Un control (interruptor, campo) necesita un borde con ≥ 3:1 respecto a su fondo; si el diseño lo quiere claro, se agrega un contorno.
- Cualquier combinación nueva se agrega a `src/styles/tokens.test.ts`, que mide el contraste real y falla si baja del mínimo.

## Tipografía
Manrope (OFL), variable, servida desde `public/fonts/`.

| Token | Celular → escritorio | Uso |
|---|---|---|
| `--titulo-1` | 44 px → 76 px · peso 800 · interlineado 0.98 · espaciado −0.04em | titular del hero y de cada página |
| `--titulo-2` | 30 px → 44 px · peso 800 · espaciado −0.027em | títulos de sección |
| `--texto-xl` | 20 → 24 px | cifras destacadas |
| `--texto-lg` | 17 px · 800 | títulos de tarjeta |
| `--texto-md` | 16 px · interlineado 1.55 | texto |
| `--texto-sm` / `--texto-xs` | 14 / 12 px | notas, etiquetas |

Titulares **grandes y apretados**; el texto, cómodo de leer en celular.

## Formas
- **Radios:** tarjetas 20 px (`--radio-tarjeta`), tarjeta destacada 28 px (`--radio-tarjeta-grande`), bloques internos 16 px, botones y chips en píldora.
- **Sombras:** `--sombra-tarjeta` (suave y amplia) para tarjetas que flotan; `--sombra-flotante` para el resumen negro.
- **Bordes:** simulados con `box-shadow: var(--borde-sutil)` (1 px): no ocupan espacio ni mueven el diseño.
- **Botones:** principal negro, secundario blanco con borde sutil, destacado dorado con texto negro; altura mínima 44 px.

## Movimiento
| Curva | Valor | Duración | Uso |
|---|---|---|---|
| `--ease-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | 0.75 s | entradas: titular por líneas, secciones al hacer scroll |
| `--ease-ui` | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.2 s | interfaz: interruptores, menú, estados |
| `--ease-rebote` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 0.3 s | botones al pasar el mouse o tocar |

**Reglas de movimiento**
1. Solo se animan `transform` y `opacity`. Nada que cambie el tamaño o la posición en el flujo (CLS = 0).
2. El contenido **nunca depende** de la animación para verse: el titular del hero se ve aunque el JavaScript falle o tarde. Si la animación no arranca a tiempo, el contenido se muestra quieto.
3. Con **"movimiento reducido"** no hay Lenis, ni entradas, ni giros, ni contadores: todo se ve quieto y completo.
4. La animación acompaña, no bloquea: nada impide hacer clic, leer o hacer scroll mientras se mueve.
5. Efectos con GSAP (+ ScrollTrigger y SplitText) y Lenis; transiciones entre páginas con View Transitions de Astro.

## Accesibilidad
- Contraste: texto ≥ 4.5:1, controles y foco ≥ 3:1 (medido en los tests).
- Foco visible siempre (`:focus-visible`), y nada fijo lo tapa (`scroll-padding`).
- Interruptores con `role="switch"` y `aria-checked`; avisos con `role="status"`.
- Lo decorativo (la N en 3D, el celular de muestra) lleva `aria-hidden="true"` o un texto alternativo breve.
- Áreas táctiles de 44 × 44 px como mínimo.
