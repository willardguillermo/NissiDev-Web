# ADR-003: Vidrio ("Liquid Glass") y tipografía Geist

## Estado
Aceptado por Guillermo (2026-10-24) con el prototipo `docs/referencias/td2/prototipo-liquid.html` (versión 1,
Geist). Reemplaza la dirección visual Ensamble de la TD1 (`docs/diseño.md`). No cambia el ADR-002: el movimiento
sigue siendo con CSS y JavaScript propio, sin librerías.

## Contexto
- Ensamble se veía plano y aburrido: tarjetas blancas iguales sobre crema, grises claros que costaban leerse,
  un celular de la demo que no hacía nada y un rotador de servicios con un botón de pausa que nadie necesita.
- El público entra desde el celular, por un enlace de WhatsApp. La primera pantalla tiene que verse cuidada y
  moderna sin cargar de más un teléfono de gama media.

## Decisión
- **Material:** superficies de vidrio translúcido (`backdrop-filter: blur() saturate()` + degradado blanco
  semitransparente + borde superior brillante + sombra suave) sobre **luces de la marca** fijas detrás de todo.
  Clase `.vidrio` (y `.vidrio--chico` para chips y botones) en `src/styles/global.css`; valores en `tokens.css`.
- **Reglas del material** (apple-design §12): pocas capas de vidrio por pantalla; nunca vidrio claro sobre vidrio
  claro; las cifras y los totales van sobre una capa sólida (negra o blanca); el header, que pasa por encima de
  otros vidrios al hacer scroll, es más opaco (`--vidrio-fuerte`).
- **Accesibilidad:** con `prefers-reduced-transparency: reduce` el vidrio es blanco sólido y no hay luces; con
  `prefers-contrast: more`, sólido con borde de tinta. Todo texto sobre claro usa tinta, tinta-2, tinta-3 u
  oro-texto, medidos en `tokens.test.ts` sobre la crema, cada luz y el vidrio en su parte más transparente.
- **Tipografía:** Geist variable (OFL), subconjunto latino de 29 KB en `public/fonts/`, precargada. Reemplaza a
  Manrope en el sitio; la demo de la dulcería mantiene Shrikhand y Chivo. Titulares en peso 650, con espaciado
  negativo que crece con el tamaño.
- **Movimiento:** las luces y el celular de la demo se mueven solo con el scroll (y con el puntero en
  escritorio), con `transform` dentro de `requestAnimationFrame`. Nada se mueve en bucle.

## Costo en el celular
- `backdrop-filter` obliga al navegador a leer y desenfocar lo que hay detrás en cada cuadro en que ese fondo
  cambia (scroll). Es lo más caro de esta dirección. Por eso: pocas capas, desenfoque menor en los chips
  (`--vidrio-filtro-chico`), luces con un `filter: blur()` **estático** (se pinta una vez y después solo se
  desplaza con `transform`, que va en la GPU) y ninguna animación del desenfoque del vidrio.
- Fuente: 29 KB (Manrope pesaba 25 KB). JavaScript nuevo: scripts de Astro sin React, unos pocos KB.
- Se mide con Lighthouse móvil del Inicio antes y después (LCP, CLS, JavaScript); si el LCP pasa de 2.5 s se
  revisa antes de seguir.

## Alternativas consideradas
- **Quedarse con Ensamble y retocarlo:** barato, pero no resolvía que la web se sintiera estática.
- **Vidrio simulado sin `backdrop-filter`** (fondos blancos semitransparentes): más barato, pero sin el
  desenfoque se pierde el efecto de material y las luces ensucian el texto. Queda como respaldo automático
  cuando el usuario pide transparencia reducida.
- **Bricolage Grotesque o Instrument Serif** (las otras opciones del prototipo): más personalidad en los
  titulares, pero Geist se lee mejor en tamaños chicos y una sola familia pesa menos.
- **Una librería de animación (GSAP, Motion):** descartada por el ADR-002; todo lo de la TD2 se hace con CSS,
  `IntersectionObserver` y `requestAnimationFrame`.

## Consecuencias
- `docs/diseño.md` describe Ensamble y queda desactualizado hasta reescribirlo para la TD2.
- Cada componente nuevo de vidrio debe respetar las reglas de arriba; las combinaciones de texto nuevas se
  agregan al test de contraste.
