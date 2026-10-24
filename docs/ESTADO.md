# Estado del proyecto

> Última actualización: 2026-10-24 (cotización con impresora implementada y verificada; PR #4 abierto).

## Retomar — cotización con impresora lista para aprobación
- **Rama activa:** `feature/cotizacion-impresora`, publicada. PR [#4](https://github.com/willardguillermo/NissiDev-Web/pull/4) hacia `feature/td2-liquid`; base de revisión `9d164c2`. **No se unió nada a main.**
- Vista previa comprobada: https://feature-cotizacion-impresora.nissidev-web.pages.dev/arma-tu-sistema . Cargar «Sugerido: Dulcería» y abrir «Ver mi cotización»; el carrito es independiente del dominio de TD2.
- **Implementación completa:** CI2 `a564ccc` (lógica temporal), actualización de TD2 `a08e449`, CI3 `18925e1` (resumen y acciones separados), CI4 `5743e30` (ticketera y papel), CI5 `e3bf56f` (fases y accesibilidad), A4 `f2645e9` y cierre de pruebas `dfe3ee0`.
- `ccc144d` se sustituyó, por pedido de Guillermo, por `e2161c6` con force-with-lease solo a esta rama. Se conservaron únicamente `movil-lista.png`, `escritorio-lista.png` e `impresion-a4.png`. Los enlaces de evidencia quedaron corregidos.
- **Verificación:** 384 tests / 35 archivos, tipos sin diagnósticos, lint y build correctos; audit sin vulnerabilidades. Persiste la advertencia previa de Node sobre localStorage. Fallo deliberado de clearTimeout detectado y revertido.
- Brave local: 390×844 y 1366×900; fases y movimiento reducido correctos, CLS de carga/secuencia 0, nombre largo y 9 módulos sin desborde. PDF exportado a mitad de secuencia: 1 página A4 con los 9 módulos completos, inspeccionada con Poppler.
- Control nativo indisponible (`Sky Computer Use native pipe startup failed`). Guillermo autorizó Playwright Core de la caché de npx, sin instalarlo: teclado/foco en ambos tamaños; desmontaje real en preparando e imprimiendo con 0 timers activos, sin callbacks ni escrituras posteriores; cambios desde otra pestaña con resumen y WhatsApp actuales, vacío y restauración. Cinco recorridos sin errores de página. Sin cambios en package.json ni package-lock.json.
- Vista previa de Cloudflare verificada también con Playwright a 390 px: 3 módulos, lista, acciones disponibles, sin desborde ni errores. No se crearon más capturas.
- Revisión independiente en cinco ejes contra `9d164c2`, incluido A4: sin hallazgos bloqueantes. Observación menor aceptada: la reserva de 104rem deja espacio inferior adicional, especialmente en el estado vacío.
- Evidencia y checklist: `docs/referencias/cotizacion-impresora/VERIFICACION.md`. La bitácora del vault se actualizó y la mejora se marcó como implementada, pendiente de aprobación en celular e integración.
- **Limpieza completada:** 8 capturas descargadas y PDF de QA eliminados de Videos tras comprobar su identidad; 15 temporales propios de QA eliminados de /tmp. Se conservaron solo las 3 capturas versionadas del PR. No se tocó la caché de npx ni archivos ajenos.
- **Qué sigue:** Guillermo prueba la vista previa en su celular. No unir el PR #4 hasta cerrar la revisión de los arreglos de TD2 (HistoriaDemo y sello sticky) y obtener su aprobación. Después, integrar mediante PR y merge commit; no squash.

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
- Revisión de Codex (base `7c9eb67`): **2 hallazgos con arreglos implementados**, pendientes de revisión independiente:
  1. Observador de HistoriaDemo vacío en apaisado → `472fc37`, márgenes calculados con la altura y reconstruidos en `resize`.
  2. Sello fuera de pantalla durante el recorrido → `7f13f49`, dentro del bloque sticky, con reserva de altura en móvil.
- Otros pendientes implementados: título de Contacto unido en `8659341`; guía de diseño actualizada en `a13a3c8`; TD2 actualizada en `tasks/plan.md`.
- Verificaciones detalladas arriba. **Listo para revisión con base `c79f5f6`**; revisión y aprobación en celular real pendientes.
- Para cerrar la rama: arreglos → revisión de los arreglos (quien implementó no se revisa a sí mismo) → aprobación de Guillermo en su celular → PR "feat: rediseño Liquid Glass con Geist (TD2)" con **merge commit** → borrar la rama → comprobar producción.

## Cotización con impresora — implementada, PR #4 abierto
- Rama `feature/cotizacion-impresora`, creada desde TD2 en `c79f5f6` y actualizada a `9d164c2` mediante `a08e449`.
- Spec y supuestos aprobados en `docs/cotizacion-impresora.md`; CI1–CI6 y commits en `tasks/plan.md`.
- Preparación 900 ms → impresión de 1200–2600 ms según el alto → lista con acciones. Sin espera con movimiento reducido, sin pago ni dependencias nuevas. Repetir conserva código y fechas.
- PDF A4 explícito con márgenes de 18mm/16mm; impresión completa aunque se abra durante la animación. Resumen, precios y WhatsApp reutilizan la lógica existente.
- Verificaciones y limpieza completadas arriba. Revisión independiente sin bloqueantes; aprobación en celular físico pendiente.
- PR [#4](https://github.com/willardguillermo/NissiDev-Web/pull/4), hacia TD2, indica el bloqueo de integración. No se ha unido nada.

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
