# ADR-002: Movimiento con CSS, sin GSAP ni Lenis

## Estado
Aceptado por Guillermo para la TD1 (2026-10-22). Reemplaza la parte de animación del ADR-001.

## Contexto
- La dirección Ensamble (docs/diseño.md) pide pocas animaciones y bien hechas: el logo que se arma, entradas
  suaves, el rotador de servicios y el contador del total.
- Con GSAP (+ ScrollTrigger y SplitText) y Lenis, el Inicio cargaba ~136 KB de JavaScript (comprimido) solo
  para moverse. La regla de Emil Kowalski es "la herramienta más barata que funcione", y las animaciones CSS
  corren fuera del hilo principal: siguen suaves mientras la página carga.

## Decisión
- **Armado del logo y entradas del hero:** `@keyframes` en CSS (`--ease-out`, `--ease-in-out`).
- **Aparecer al hacer scroll y el celular de la demo:** CSS con `animation-timeline: view()`. Donde el navegador
  no lo soporta, el contenido se ve quieto (no se esconde nada).
- **Rotador de servicios:** transiciones CSS + un script pequeño sin librerías (`src/ui/rotador.ts`).
- **Contador del total:** `requestAnimationFrame` dentro de `useContador`.
- **Scroll:** el nativo del navegador; `scroll-behavior: smooth` para los anclas.
- **Transiciones entre páginas:** se quedan las View Transitions de Astro (el carrito no se pierde).
- Se quitan `gsap` y `lenis` del proyecto.

## Consecuencias
- JavaScript medido con Lighthouse móvil: Inicio de 135.6 KB a 9.8 KB; Arma tu sistema de 133.8 KB a 81.6 KB
  (lo que queda es React para el carrito).
- Para algo que de verdad necesite física o gestos (arrastrar, resortes), se evalúa primero WAAPI y después una
  librería, con permiso de Guillermo (es una dependencia nueva).
- `animation-timeline` dentro del atajo `animation` no es válido: se escribe con propiedades sueltas.
