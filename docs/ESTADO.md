# Estado del proyecto

> Última actualización: 2026-10-24 (primera rebanada de cotización con impresora). Quien termine una sesión de trabajo actualiza este archivo.

## En una línea
Web de NissiDev (marca de Guillermo Willard): un *showroom* donde el dueño de un negocio del Este de Lima prueba la **demo de su rubro**, arma su sistema en un **carrito de funcionalidades** y envía la **cotización por WhatsApp**. Las demos son **plantillas generales por rubro**, no maquetas de un cliente concreto.

## Publicado (rama `main` → https://nissidev-web.pages.dev)
- Inicio, Servicios, Demos, Arma tu sistema, Cotización y Contacto (diseño TD1 "Ensamble").
- Demo de dulcería: `/demos/dulceria/` (vista Cliente y Dueño; variantes por URL: `?puestos=1|3`, `?campana=navidad|dia-del-nino|ninguna`).
- Pull Requests unidos: #1 (diseño Ensamble), #2 (plantilla de demo), #3 (Demos, Contacto, Cotización y Servicios).

## En curso: rama `feature/td2-liquid` (rediseño "Liquid Glass" con Geist)
- Vista previa: https://feature-td2-liquid.nissidev-web.pages.dev
- Aprobado por Guillermo el 2026-10-24. Referencia: `docs/referencias/td2/` · Decisión: `docs/decisions/ADR-003-vidrio-y-geist.md`.
- Hecho (commits `0d7c714` → `c79f5f6`): Geist, tokens y contraste nuevos, luces de fondo, vidrio, header flotante, hero, **historia de la demo con scroll**, servicios en bento (sin rotador ni botón de pausa), carrito del Inicio sin React, Cómo trabajamos, Contacto con "Copiar número" y el estilo nuevo en Arma tu sistema, Demos y Cotización. Lighthouse móvil del Inicio: LCP 1.7 s, CLS 0, 14.7 KB de JS. 366 tests.
- Revisión de Codex (base `7c9eb67`): **2 hallazgos, PENDIENTES**:
  1. `src/components/HistoriaDemo.astro:156-159`: los porcentajes de `rootMargin` del IntersectionObserver se resuelven con el ancho; en ventanas apaisadas (1366×768) la zona de intersección queda vacía y la historia nunca avanza del paso Catálogo. Calcular los márgenes en píxeles con la altura del viewport y recalcularlos al redimensionar. Probar a 1366×768, 1280×800, 390×844 y 375×667.
  2. `src/pages/index.astro:46-47`: el sello "Demo · datos de ejemplo" quedó después de los espacios de scroll, fuera de pantalla durante el recorrido. Debe ir **dentro del bloque sticky**, visible mientras se muestran precios, pedidos y ventas ficticias.
- Otros pendientes de la rama:
  - En Contacto, "¿Lo" queda solo en una línea a 375 px: unir "¿Lo conversamos?" con un espacio que no se corta.
  - `docs/diseño.md` todavía describe Ensamble: reescribirlo para la TD2.
  - Actualizar la TD2 en `tasks/plan.md` con la revisión y sus arreglos.
- Para cerrar la rama: arreglos → revisión de los arreglos (quien implementó no se revisa a sí mismo) → aprobación de Guillermo en su celular → PR "feat: rediseño Liquid Glass con Geist (TD2)" con **merge commit** → borrar la rama → comprobar producción.

## En curso: cotización con impresora
- Rama `feature/cotizacion-impresora`, creada desde `feature/td2-liquid` en `c79f5f6`; PR hacia TD2.
- Spec, plan y tres supuestos aprobados por Guillermo: `docs/cotizacion-impresora.md` y sección «Cotización con impresora» de `tasks/plan.md`.
- CI1: registrados alcance y verificaciones; no se cambió código. A4 explícito con márgenes de 18mm/16mm;
  papel con token `--ease-papel: cubic-bezier(.3, .15, .2, 1)`; máximo total de 3500 ms.
- Sigue CI2: duración y secuencia cancelable fuera de React, con Vitest y prueba de error deliberado.
- **No unir el PR hasta resolver los dos hallazgos de TD2** descritos arriba; indicarlo también en el PR.
- Revisión al cerrar la rama por Claude Code o una sesión independiente; no unir sin aprobación de Guillermo.
- Bitácora del vault y casilla de mejora se actualizan al terminar la implementación completa.
- Verificación CI1: `npm test` (366 tests), `npm run check` (0 errores/advertencias), `npm run lint`
  y `npm run build` completados correctamente. Con Node 26.11.1 el build emite `ExperimentalWarning:
  localStorage is not available because --localstorage-file was not provided`; queda registrado, sin cambiar código.
- Esta parte solo cambia documentación: capturas y prueba visual corresponden a las partes con interfaz.

## Después (según `tasks/plan.md`)
1. **T26**: Cloudflare Web Analytics. Guillermo debe activarla primero en su panel de Cloudflare.
2. **T27**: verificación final del MVP (celular real, Lighthouse publicado, teclado, contraste, README).
3. **Punto de control 7**: revisión de diseño del sitio completo antes de darlo por terminado.
- Ideas de mejora de diseño: nota "Mejoras de diseño" del vault.
- Etapa 2: enlace personalizado de la demo (nombre y color del negocio) y demos de hospedaje y restaurante campestre. Etapa 3: chatbot con n8n.

## Decisiones vigentes (no reabrir sin preguntar a Guillermo)
- Stack: Astro + islas de React (ADR-001), movimiento solo con CSS (ADR-002), vidrio + Geist (ADR-003). Cloudflare Pages desde GitHub.
- Precios: Catálogo web desde S/ 700 · Panel desde S/ 500 · Pedidos por WhatsApp incluido · Caja con Yape/Plin S/ 60/mes + instalación (Cotizar) · Mantenimiento S/ 80/mes · Reservas, Inventario, Boletas SUNAT y Chatbot: "Cotizar". Siempre "desde" y "referenciales".
- Cotización: código `NSD-AAAA-XXXX` al azar (sin correlativo, no hay servidor), válida 15 días, enviada a WhatsApp **+51 913 351 627**; PDF con `window.print()`.
- Demo: negocio ficticio "Dulcería La Golosa", marcas ficticias, sello "Demo · datos de ejemplo" siempre visible, nada cobra ni abre WhatsApp de verdad (muestra el mensaje y "Quiero esto para mi negocio").
- Movimiento: ease-out en entradas, `scale(0.97)` al tocar, hover solo con mouse, nada se mueve solo (sin carruseles automáticos), movimiento reducido = menos y más suave, transparencia reducida = superficies sólidas.
- Texto: contraste ≥ 4.5:1 (lo vigila `tokens.test.ts`); nunca texto gris claro sobre vidrio.
- Continental Hydraulic no se muestra como caso hasta tener permiso del cliente. Dominio nissidev.com por comprar.

## Cómo trabaja Guillermo
- Es estudiante (Tecsup, Diseño y Desarrollo de Software) y está construyendo su portafolio: cada tarea cierra con "Qué aprender".
- Da prompts largos (~1 hora) y no mira mientras tanto: decide lo pequeño y anótalo; detente solo en los casos de `AGENTS.md`.
- Revisa cada cambio visual en su celular con la vista previa de la rama. **Antes de pedirle que pruebe algo, verifícalo tú y dale el enlace exacto.**
- Reporte final: commits por parte, enlaces exactos, qué mirar en el celular, textos nuevos para corregir, decisiones pequeñas, VI PERO NO TOQUÉ y "Qué aprender".
- Git: `<tipo>: <descripción>`; **nunca** `chore`; **nunca** `Co-Authored-By` de IA ni "Generated with".
- Documentación del proyecto en su vault de Obsidian: `/Users/nissidev/Documents/Vault obsidian/Nissidev Tools/01 Proyectos/Web NissiDev/` (solo lectura para los agentes, salvo que él lo pida).

## Historial de diseño (para no repetir errores)
1. B + "momento A" (oscuro y pesado): parecía una plantilla genérica de SaaS → descartado.
2. TD1 "Ensamble" (crema, centrado, el logo se arma como en el video oficial): publicado, pero "aburrido", letras poco legibles y un celular estático.
3. TD2 "Liquid Glass" con Geist: vidrio tipo Apple, la demo contada con scroll y servicios en bento. Es el diseño vigente.
