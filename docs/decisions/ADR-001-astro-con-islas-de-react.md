# ADR-001: Astro con islas de React

## Estado
Propuesto (2026-10-21)

## Contexto
- La web tiene dos tipos de páginas:
  - **Contenido**: Inicio, Servicios, Stack, Casos. Deben cargar rápido en el celular de alguien que llega desde WhatsApp y posicionar en Google.
  - **App**: la demo de dulcería y el carrito, con estado que cambia y un carrito compartido entre páginas.
- Guillermo quiere una web **muy bien diseñada y con muchas animaciones**, y ya sabe React.
- Le dijeron que Astro es más rápido, pero dudaba de si se lleva bien con las animaciones.

## Decisión
**Astro** para las páginas y el diseño, con **islas de React** solo donde hay interacción (demo, carrito, cotización). Animaciones con **GSAP + ScrollTrigger**, **Lenis** y las **View Transitions** de Astro. El carrito se comparte entre islas con **nanostores**.

## Por qué Astro sí sirve para animaciones
- Las animaciones no dependen del framework (ver *Stack de webs premiadas* (vault)): GSAP, Lenis y la animación con CSS son JavaScript normal y funcionan igual en Astro, dentro de un `<script>`.
- Astro trae **transiciones entre páginas** incorporadas (View Transitions), lo mismo que otras webs logran con Barba.js.
- Dentro de una isla de React se puede usar Motion (Framer Motion) si hace falta.
- La ventaja de Astro: lo que no es interactivo llega como **HTML sin JavaScript**, así que la página carga rápido y el JavaScript queda libre para las animaciones.

## Alternativas consideradas
### React + Vite (SPA)
- A favor: un solo modelo mental; el estado global es simple.
- En contra: la página llega vacía hasta que carga todo el JavaScript (peor LCP en celular y peor SEO local).
- Descartada porque: las páginas de contenido son las primeras que ve el dueño y deben cargar rápido.

### Astro puro (sin React)
- A favor: lo más liviano.
- En contra: la demo y el carrito necesitan estado; hacerlo sin un framework de componentes es más trabajo y desaprovecha lo que ya sé de React.
- Descartada porque: complica justo la parte más interactiva.

### Next.js
- A favor: React con renderizado en el servidor.
- En contra: más complejo; para aprovecharlo necesita un servidor.
- Descartada porque: el sitio es estático y no necesita backend.

## Consecuencias
- **Gano:** carga rápida + todas las animaciones que quiera + reutilizo React.
- **Cuesta:** aprender la sintaxis `.astro` y las *directivas de cliente* (`client:load`, `client:visible`), y compartir el carrito entre islas con nanostores, en vez de un Context de React.
- **Regla:** cada isla se hidrata con `client:visible` salvo que deba estar lista al cargar; animar solo `transform` y `opacity`, y respetar `prefers-reduced-motion` (*Movimiento que no bloquea* (vault)).
