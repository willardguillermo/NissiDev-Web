# Estado del proyecto

> Última actualización: 2026-10-25 (estructura por rubros en `feature/estructura-rubros`, lista para revisión).

## En curso — Estructura por rubros (rama `feature/estructura-rubros`, desde `de7743d`)
- Spec `docs/estructura-rubros.md`, ADR-004 y plan ER-a…ER-h en `tasks/plan.md`. Implementó Claude Code; **falta la revisión de Codex** (`--base de7743d`) y la aprobación de Guillermo en su celular. Nada unido a main.
- Vista previa: https://feature-estructura-rubros.nissidev-web.pages.dev
- Hecho: sin ubicación (test en `src/sin-ubicacion.test.ts`); rutas `/soluciones`, `/cotizar`, `/sobre-mi` con 301 desde `/demos`, `/demos/dulceria/` (conserva la query) y `/arma-tu-sistema`; menú Soluciones · Servicios · Sobre mí · Contacto + botón «Cotizar (n)»; footer en columnas; Inicio reordenado; celular con selector de 5 rubros (`src/rubros/<id>/historia.ts`); Soluciones; Servicios con funciones, precios y preguntas frecuentes; Sobre mí con el texto de Guillermo, GitHub/LinkedIn y el stack con íconos de Simple Icons (CC0).
- Verificado: 413 tests, tipos, lint y build en verde; Playwright a 390×844, 375×667, 1366×768 y 1280×800 sin desborde ni errores; sello visible en los 4 pasos; CLS 0; JS externo del Inicio igual (6.0 KB gzip) y +0.5 KB de script en línea; HTML del Inicio 13.2 KB gzip. En la vista previa: 301 correctas y carrito conservado de `/arma-tu-sistema` a `/cotizar/` con la impresora intacta.
- Pendiente de Guillermo: revisar en el celular y corregir los textos nuevos (lista en el reporte de la sesión).


## Entrega aprobada — Liquid Glass y cotización con impresora
- Guillermo autorizó integrar todo en main el 2026-10-24. La entrega se integra mediante PR y merge commit, sin squash.
- PR [#4](https://github.com/willardguillermo/NissiDev-Web/pull/4) unido a TD2 en `b575d9e`; PR [#5](https://github.com/willardguillermo/NissiDev-Web/pull/5) reúne el rediseño y la impresora para main.
- Sitio: https://nissidev-web.pages.dev . Para probar la impresora, abrir `/arma-tu-sistema`, cargar «Sugerido: Dulcería» y entrar en «Ver mi cotización».
- **Revisiones independientes cerradas:** impresora en cinco ejes contra `9d164c2`, sin bloqueantes; arreglos de TD2 (observador, sello y Contacto) cerrados. El P2 de Contacto a 320 px se confirmó (documento de 343 px), se corrigió en `421848f` y se volvió a revisar.
- **Compilación actual comprobada con Playwright:** Contacto sin desborde y dentro del padding a 320, 375, 390 y 1366 px; historia con 4 pasos y sello visible a 1366×768, 1280×800, 390×844 y 375×667; sin errores de página.
- **Comandos:** 384 tests / 35 archivos, tipos sin diagnósticos, lint y build correctos. Persiste la advertencia previa de Node sobre localStorage. Audit de la entrega sin vulnerabilidades.
- **Impresora:** teclado/foco, desmontaje real en ambas fases sin timers ni escrituras posteriores, cambios del carrito entre pestañas, vacío/restauración, movimiento reducido y PDF de 9 módulos en una página A4 verificados. Evidencia en `docs/referencias/cotizacion-impresora/VERIFICACION.md`.
- Playwright se usó desde la caché de npx con autorización, sin nuevas dependencias. No se añadieron más capturas: se conservan solo móvil lista, escritorio lista y proforma A4. Descargas de Videos y temporales propios de QA limpiados.
- **Qué sigue:** T26 (Guillermo activa Web Analytics en Cloudflare), T27 (verificación global del MVP, incluido celular físico, INP/Lighthouse y README) y punto de control 7. La autorización de integración no se registra como una prueba física del celular.

## En una línea
Web de NissiDev: un *showroom* donde el dueño de un negocio de cualquier rubro prueba la **demo de su rubro**, arma su sistema en un **carrito de funcionalidades** y envía la **cotización por WhatsApp**. Las demos son **plantillas generales por rubro**, no maquetas de un cliente concreto.

## Publicado (rama `main` → https://nissidev-web.pages.dev)
- Inicio, Servicios, Demos, Arma tu sistema, Cotización y Contacto con **Liquid Glass + Geist (TD2)**.
- Cotización con ticketera animada, acciones accesibles y PDF A4, sin cobros.
- Demo de dulcería: `/demos/dulceria/` (vista Cliente y Dueño; variantes por URL: `?puestos=1|3`, `?campana=navidad|dia-del-nino|ninguna`).
- Historial: #1 (Ensamble), #2 (plantilla de demo), #3 (páginas MVP), #4 (impresora hacia TD2) y #5 (entrega TD2 + impresora hacia main).

## Liquid Glass + Geist — TD2
- Aprobado por Guillermo el 2026-10-24. Referencia: `docs/referencias/td2/`; ADR-003.
- Geist, vidrio, luces, header flotante, hero, historia por scroll, servicios en bento, funciones del Inicio sin React, proceso y páginas internas renovados. Guía actualizada en `docs/diseño.md`.
- Hallazgos del observador y del sello corregidos en `472fc37` y `7f13f49`; revisión independiente cerrada. Ajuste final de Contacto para 320 px en `421848f`.
- Lighthouse móvil del Inicio durante TD2, mediana de tres: LCP 1.7 s, CLS 0 y 14.7 KB de JS. No son mediciones nuevas de la cotización; la evaluación global de producción queda en T27.
- Entrega reunida en [PR #5](https://github.com/willardguillermo/NissiDev-Web/pull/5) hacia main, con integración autorizada por Guillermo.

## Cotización con impresora — integrada con TD2
- Rama `feature/cotizacion-impresora`, creada desde TD2 en `c79f5f6` y actualizada a `9d164c2` mediante `a08e449`.
- Spec y supuestos aprobados en `docs/cotizacion-impresora.md`; CI1–CI6 y commits en `tasks/plan.md`.
- Preparación 900 ms → impresión de 1200–2600 ms según el alto → lista con acciones. Sin espera con movimiento reducido, sin pago ni dependencias nuevas. Repetir conserva código y fechas.
- PDF A4 explícito con márgenes de 18mm/16mm; impresión completa aunque se abra durante la animación. Resumen, precios y WhatsApp reutilizan la lógica existente.
- Verificaciones y limpieza completadas arriba. Revisión independiente sin bloqueantes; integración autorizada.
- PR [#4](https://github.com/willardguillermo/NissiDev-Web/pull/4) unido a TD2 en `b575d9e` tras cerrar la revisión y recibir la autorización. Publicación conjunta hacia main en #5.

## Después (según `tasks/plan.md`)
1. **T26**: Cloudflare Web Analytics. Guillermo debe activarla primero en su panel de Cloudflare.
2. **T27**: verificación final del MVP (celular real, Lighthouse publicado, teclado, contraste, README).
3. **Punto de control 7**: revisión de diseño del sitio completo antes de darlo por terminado.
- Ideas de mejora de diseño: nota "Mejoras de diseño" del vault.
- Etapa 2: enlace personalizado de la demo (nombre y color del negocio) y demos completas de los rubros que hoy son «Próximamente» (Restaurante, Salón de belleza, Clínica, Negocio por mayor). Etapa 3: chatbot con n8n.

## Decisiones vigentes (no reabrir sin preguntar a Guillermo)
- **Ningún rubro es protagonista** (ADR-004, 2026-10-25): la web muestra sistemas para distintos rubros; la dulcería es solo la primera demo. Lo particular de un rubro vive en su demo o en sus datos, nunca en los textos generales.
- **Sin ubicación** (ADR-004, 2026-10-25): ningún texto público menciona «Este de Lima» ni otra zona. La zona es estrategia interna y solo puede quedar como nota interna en BRIEF/SPEC.
- Stack: Astro + islas de React (ADR-001), movimiento solo con CSS (ADR-002), vidrio + Geist (ADR-003). Cloudflare Pages desde GitHub.
- Precios: Catálogo web desde S/ 700 · Panel desde S/ 500 · Pedidos por WhatsApp incluido · Caja con Yape/Plin S/ 60/mes + instalación (Cotizar) · Mantenimiento S/ 80/mes · Reservas, Inventario, Boletas SUNAT y Chatbot: "Cotizar". Siempre "desde" y "referenciales".
- Cotización: código `NSD-AAAA-XXXX` al azar (sin correlativo, no hay servidor), válida 15 días, enviada a WhatsApp **+51 913 351 627**; PDF con `window.print()`.
- Demo: negocio ficticio "Dulcería La Golosa", marcas ficticias, sello "Demo · datos de ejemplo" siempre visible, nada cobra ni abre WhatsApp de verdad (muestra el mensaje y "Quiero esto para mi negocio").
- Selector de rubro del celular: empieza en Dulcería, la única con demo completa (decisión pequeña, 2026-10-25).
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
