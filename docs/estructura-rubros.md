# Estructura por rubros — spec

> Rama `feature/estructura-rubros`, desde `main` en `de7743d`. Decisiones de Guillermo del 2026-10-25 (no reabrir).
> Implementa Claude Code; revisa Codex con `--base de7743d`. ADR: `docs/decisions/ADR-004-ningun-rubro-protagonista.md`.

## Objetivo
La web muestra los sistemas que NissiDev ofrece a **distintos rubros**. La dulcería es solo la primera demo: lo
particular de un rubro vive en su demo o en sus datos, nunca en los textos generales. La web **no menciona ninguna
zona** (la zona es estrategia interna de prospección y solo puede quedar como nota interna en BRIEF/SPEC).
Cada página tiene un solo trabajo, sin repetir contenido.

## Mapa y rutas
Menú: **Soluciones · Servicios · Sobre mí · Contacto** + botón destacado **Cotizar (n)** con la cantidad de
funciones elegidas. El botón reemplaza la píldora «Mi sistema» y la pestaña «Arma tu sistema». El logo lleva al Inicio.

| Ruta | Trabajo único | Contenido |
|---|---|---|
| `/` | Mostrar qué hace NissiDev y dejar probar | Hero general → celular con selector de rubro → tarjetas de rubros → cómo trabajamos (corto) → CTA final |
| `/soluciones` | Galería de rubros | Cada rubro con su demo o «Próximamente · pídela por WhatsApp» |
| `/soluciones/dulceria/` | Demo completa de la dulcería | La demo de siempre (sin cambios) |
| `/servicios` | Todo sobre crear el sistema | 4 tipos · qué hace cada función (datos de `MODULOS`) · proceso · precios «desde» · preguntas frecuentes · botón Cotizar. Sin stack |
| `/cotizar` | Elegir funciones | El carrito (antes `/arma-tu-sistema`), que lleva a `/cotizacion` |
| `/cotizacion` | Cotización con impresora | Sin cambios |
| `/sobre-mi` | Quién está detrás | Texto de Guillermo (pendiente) + «Con qué construyo» con íconos |
| `/contacto` | Contactar | Igual que hoy, sin zona |

Salen del Inicio: el carrito (`ArmaInicio`), el bento de servicios, «Con qué construyo» y la tarjeta de contacto.

### Redirecciones 301 (`public/_redirects`)
Ya hay enlaces compartidos por WhatsApp. Cloudflare Pages conserva la query (`?puestos=3`, `?campana=…`).

| Desde | Hacia |
|---|---|
| `/demos`, `/demos/` | `/soluciones` |
| `/demos/dulceria`, `/demos/dulceria/` | `/soluciones/dulceria/` |
| `/arma-tu-sistema`, `/arma-tu-sistema/` | `/cotizar` |

El carrito guardado sigue funcionando: la clave de `localStorage` no cambia y es del mismo origen.

## Rubros
Dulcería · Restaurante · Salón de belleza (barbería o estética) · Clínica · Negocio por mayor. Los mismos, en el
mismo orden, en el celular, en las tarjetas del Inicio y en Soluciones (`src/rubros/rubros.ts`). Hospedaje y
Restaurante campestre salen de la lista. Solo la dulcería tiene demo completa.

## Historia del celular por rubro
- Selector encima del celular: 5 botones de opción única (radios nativos, flechas del teclado); en el celular,
  una fila con scroll horizontal. Al elegir, cambian el tema (`variablesDeTema`) y las pantallas con la transición
  existente; con movimiento reducido, cambio directo (fundido corto como hoy).
- Pasos generales: 01 Tu vitrina · 02 Tu cliente pide o reserva · 03 Te llega por WhatsApp · 04 Tu panel.
  La leyenda de cada paso sale del rubro (clínica: «Reservan su cita»).
- Título: «Así se vería tu sistema.» + «Elige tu rubro y baja despacio.» No nombra a la dulcería.
- Datos: la dulcería sale de su `RubroConfig` con `historiaDeLaDemo`. Los otros 4 definen solo lo que piden las
  4 pantallas en `src/rubros/<id>/historia.ts`, con un tipo común y tests. Negocios y personas inventados, sin
  marcas reales. Clínica: solo citas y horarios, sin diagnósticos ni datos de salud.
- Botón bajo el celular: «Abrir la demo completa» si el rubro tiene demo; si no, «Pide la demo de tu rubro» por
  WhatsApp con un mensaje que nombra el rubro.
- Sin React (HTML + `<script>`). CLS 0 y JS del Inicio sin subir de forma notable (hoy 14.7 KB). Se conservan
  `rootMargin` en px según la altura y el sello dentro del sticky.
- Empieza en Dulcería (única con demo completa).

## Footer
Grilla en columnas: marca + una frase · enlaces de la web · contacto (solo WhatsApp). Abajo, una línea fina con
el ©. En el celular, todo apilado y alineado a la izquierda.

## Sobre mí
- «Con qué construyo» agrupado por uso (como `STACK`): Astro, React, Kotlin, Android, Spring Boot, MySQL, Cloudflare.
- Íconos: solo los `<path>` de Simple Icons (CC0) copiados a un componente propio; fuente y licencia en
  `docs/diseño.md`. Sin el paquete npm.
- Entrada escalonada al aparecer y realce con su color en hover/focus. Sin bucles. Movimiento reducido: estáticos.
  Nombres con contraste ≥ 4.5:1.
- Textos personales: bloque marcado «Texto de Guillermo pendiente».

## Criterios de aceptación
1. Ningún archivo de `src/` contiene «Este de Lima» (test) ni otra zona en textos públicos.
2. El menú muestra Soluciones, Servicios, Sobre mí, Contacto y el botón Cotizar con el contador; funciona con
   teclado y en el celular.
3. `/demos`, `/demos/dulceria/` (con su query) y `/arma-tu-sistema` responden 301 a la ruta nueva en la vista previa.
4. Un carrito armado antes sigue en `/cotizar` y `/cotizacion`; la impresora se ve y funciona igual.
5. El Inicio tiene solo: hero, celular, tarjetas de rubros, proceso corto y CTA final.
6. El celular cambia de rubro con mouse, toque y teclado; cada rubro muestra sus 4 pantallas al bajar; sello
   visible en los 4 pasos; CLS 0.
7. Soluciones lista los 5 rubros; solo Dulcería con «Probar la demo».
8. Servicios tiene los 6 bloques pedidos y ningún texto de módulo copiado (sale de `MODULOS`).
9. Sobre mí tiene el bloque pendiente y los 7 íconos con licencia anotada.
10. Footer en columnas en escritorio y apilado a la izquierda en el celular.

## Verificación
- `npm test`, `npm run check`, `npm run lint`, `npm run build` en verde.
- Playwright (desde la caché de npx) a 390×844, 375×667, 1366×768 y 1280×800: menú y footer; historia cambiando
  de rubro y al bajar (sello en los 4 pasos); redirecciones con `curl -I` en la vista previa; carrito conservado de
  `/arma-tu-sistema` a `/cotizar`; impresora intacta; sin desborde horizontal.
- Tamaño del JS del Inicio comparado con los 14.7 KB de la TD2.
