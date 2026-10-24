# Estado del proyecto

> Última actualización: 2026-10-24 (sesión retomada; evidencia reducida a tres capturas antes del PR). Quien termine una sesión de trabajo actualiza este archivo.

## Retomado — limpieza y evidencia antes del PR
- Rama activa: `feature/cotizacion-impresora`. A4 local conservado y guardado en `f2645e9`; PDF inspeccionado con Poppler: 1 página A4 con los 9 módulos completos.
- Tests finales repetidos: 384 tests, tipos, lint y build correctos; persiste la advertencia conocida de Node sobre localStorage.
- Limpieza solicitada: eliminadas de Videos las 8 capturas descargadas y el PDF de QA, verificando su identidad con las copias de evidencia. Los archivos ajenos no se tocaron. Temporales de /tmp pendientes de limpieza al cerrar QA.
- Guillermo pidió rehacer `ccc144d`: conservar solo `movil-lista.png`, `escritorio-lista.png` e `impresion-a4.png`; eliminar las otras 6 y corregir sus enlaces. Se publica la sustitución con force-with-lease exclusivamente a esta rama.
- PR todavía sin abrir. Pendientes de navegador y cierre del vault detallados en `docs/referencias/cotizacion-impresora/VERIFICACION.md`. El control nativo falla con `Sky Computer Use native pipe startup failed`; se preguntó si autoriza Playwright ya disponible, sin dependencias nuevas. No se ha usado ese reemplazo sin respuesta.
- Las notas de pausa siguientes son históricas; el pedido de continuar ya revocó la pausa.

## Pausa solicitada por Guillermo — cotización con impresora (2026-10-24)
- **Pausado por pedido explícito. No continuar hasta que Guillermo retome.**
- **RECORDATORIO PARA RETOMAR:** Guillermo pidió eliminar después todas las descargas/capturas creadas para estas pruebas. Hay **8 PNG** en `~/Movies/` (carpeta «Videos»), llamados `127.0.0.1_4323_cotizacion.png` y `127.0.0.1_4323_cotizacion (1).png`…`(7).png`. Solo son esos archivos de QA, no otros archivos del usuario. No se borraron durante la pausa. Fuera de las raíces editables: su eliminación requerirá la autorización del sandbox correspondiente.
- También se copiaron 8 capturas a `docs/referencias/cotizacion-impresora/capturas/` (sin seguimiento todavía); decidir con su pedido de limpieza cuáles conservar como evidencia del PR. Hay temporales de QA en `/tmp/nissidev-*`; revisar solo los creados en esta sesión. No se encontró un PDF descargado con los nombres previstos en Movies; no darlo por guardado.
- **Rama activa:** `feature/cotizacion-impresora`. Base TD2 actualizada mediante merge `a08e449`; base de revisión/PR: `9d164c2` en `feature/td2-liquid`. Nada unido a main.
- **Implementado:** CI3 `18925e1` (papel y acciones separados), CI4 `5743e30` (ticketera, ranura, papel, aviso sin pago y reserva de altura), CI5 `e3bf56f` (fases, acciones, repetición, cancelación y movimiento reducido). Código y fechas siguen creándose en useEffect; no hay dependencias nuevas.
- **CAMBIO LOCAL A CONSERVAR:** `src/islas/Cotizacion.css`, A4 explícito fuera de @media y evitar partir módulos/totales/fechas. Sin commit todavía; no sobrescribir.
- Últimos comandos: 384 tests / 35 archivos, check sin errores/advertencias/hints, lint y build correctos; advertencia conocida de Node sobre localStorage. `npm audit`: 0 vulnerabilidades.
- Fallo deliberado repetido: quitar clearTimeout hizo fallar la cancelación a 450 ms en `impresion.test.ts:67`, con 1 timer pendiente en vez de 0. Restaurado; 18 tests de impresión pasan.
- QA en Brave local `http://127.0.0.1:4323/cotizacion`: 390×844 y 1366×900; capturas por fase y con movimiento reducido en ambos tamaños. Secuencia corta medida: 0 → 904 → 2104 ms; acciones inert hasta lista; repetir conserva el código; CLS de carga/secuencia 0. Cotización de 9 módulos sin desborde; papel de 1139 px en móvil. Nombre largo con etiquetas como texto, enlace WhatsApp codificado y sin reinicio. Una edición sintética de nombre produjo layout shift (sin entrada real de usuario); no confundirlo con la medición de carga.
- Revisión independiente por sesión nueva sin contexto de implementación: cinco ejes, sin errores concretos/bloqueantes; 384 tests y lint comprobados por el revisor. Observación menor aceptada: la reserva conservadora de 104rem deja vacío al final, especialmente con carrito vacío. No sustituye el cierre de revisión de TD2.
- Impresión abierta a los 1300 ms de la secuencia: vista previa de **1 página** con los nueve módulos y totales completos, sin ticketera ni controles/recorte. Se quitó el encabezado/pie del navegador para la evidencia. **Pendiente exportar/inspeccionar el PDF**, no afirmar que ya se guardó. Poppler está disponible.
- **Falta antes de entregar:** cerrar QA (PDF A4, teclado, desmontaje real durante la animación, carrito actualizado desde otra pestaña/vacío), evidencia y checklist completa; actualizar CI3–CI6 en tasks/plan.md y spec según base nueva; bitácora del vault y casilla de mejora cuando esté completo; commit final de estado; push de esta rama, comprobar Cloudflare, abrir PR a feature/td2-liquid con capturas y pasos. No se hizo push ni PR de la impresora todavía.
- Servidor de pruebas 4323 puede seguir activo; en esta sesión hubo que reiniciarlo tras editar para evitar versiones viejas. La emulación de movimiento reducido quedó desactivada al abrir la prueba de impresión. Confirmar estado de Brave antes de operar.

## Retomar después del reinicio — completado
- **Rama activa: `feature/td2-liquid`**. Se conservó el cambio local de `HistoriaDemo.astro` y quedó en `472fc37`; no se incorporó código de `feature/cotizacion-impresora`.
- Continuación autorizada completada en commits separados:
  1. `472fc37` — observador con márgenes en píxeles según la altura, reconstrucción al redimensionar y limpieza al salir.
  2. `7f13f49` — sello «Demo · datos de ejemplo» dentro del bloque sticky. Se reservó altura para la leyenda y el sello en el teléfono pequeño.
  3. `8659341` — espacio inseparable en «¿Lo conversamos?».
  4. `a13a3c8` — guía `docs/diseño.md` reescrita para Liquid Glass + Geist según ADR-003.
  5. Plan y estado actualizados en el commit de cierre de esta sesión.
- **Verificación visual local en Brave:** los cuatro pasos y el sello a **1366×768, 1280×800, 390×844 y 375×667**, también tras redimensionar. Barrido de 21 posiciones durante el bloque sticky a 1366×768 y 375×667: sin ocultamientos del sello. Contacto en Inicio y `/contacto` a 375 px: título en una línea, sin desborde horizontal.
- Control nativo de Brave recuperado. El servidor de 4321 conservaba una versión anterior; se comprobó el resultado actual en `http://127.0.0.1:4322`. En esta sesión hubo que reiniciar el servidor después de editar para que sirviera la versión nueva. La prueba temporal de `/tmp` no es parte del proyecto.
- **Comandos finales:** `npm test` → 366 tests / 34 archivos; `npm run lint` → correcto; `npm run check` → 0 errores, advertencias e hints; `npm run build` → 7 páginas, correcto. Persiste `ExperimentalWarning: localStorage is not available because --localstorage-file was not provided` de Node. No se repitió Lighthouse tras estos arreglos.
- Se publica **solo esta rama**, por la autorización de reanudación; no se une nada a `main`. La aprobación visual en un celular real de Guillermo sigue pendiente.
- **Siguiente acción:** revisión independiente con **`--base c79f5f6`** (Claude Code o una sesión nueva sin el contexto de implementación). Después: evaluar sus hallazgos, aprobación de Guillermo en celular y PR con merge commit.
- Contexto para ChatGPT en GitHub: [rama](https://github.com/willardguillermo/NissiDev-Web/tree/feature/td2-liquid) · [AGENTS.md](https://github.com/willardguillermo/NissiDev-Web/blob/feature/td2-liquid/AGENTS.md) · [estado](https://github.com/willardguillermo/NissiDev-Web/blob/feature/td2-liquid/docs/ESTADO.md).

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

## En curso: cotización con impresora
- Rama `feature/cotizacion-impresora`, creada desde `feature/td2-liquid` en `c79f5f6`; PR hacia TD2.
- Spec, plan y tres supuestos aprobados por Guillermo en **esa rama**: `docs/cotizacion-impresora.md`
  y sección «Cotización con impresora» de `tasks/plan.md`; esos archivos/cambios todavía no están en TD2.
- CI1: registrados alcance y verificaciones; no se cambió código. A4 explícito con márgenes de 18mm/16mm;
  papel con token `--ease-papel: cubic-bezier(.3, .15, .2, 1)`; máximo total de 3500 ms.
- CI2 completada en `a564ccc` (rama de impresora): `src/cotizacion/impresion.ts` calcula la duración y comunica las fases con temporizadores
  cancelables; sin React ni DOM. Preparación de 900 ms, impresión de 1200–2600 ms, movimiento reducido
  directo a lista. La limpieza no escribe ni comunica fases y no deja temporizadores pendientes.
- Verificados los tres ajustes en `8833fff`: PR hacia TD2 con bloqueo indicado para su descripción,
  A4 explícito con márgenes y curva del papel como token; no hizo falta corregir la spec.
- Vitest CI2: 18 tests nuevos (384 totales). Fallo deliberado: omitir `clearTimeout(temporizador)` hizo
  fallar «cancelar a los 450 ms no escribe ni deja callbacks o timers» con
  `AssertionError: expected 1 to be +0` en `expect(vi.getTimerCount()).toBe(0)`.
  Restaurada la limpieza, todos pasan. `npm run check`: 0 errores/advertencias/hints;
  `npm run lint` y `npm run build`: correctos; persiste la advertencia de Node sobre localStorage.
- Sigue CI3: separar papel, formulario y acciones reutilizando el resumen actual.
  La lógica de CI2 aún no está conectada a la interfaz; la prueba en celular y el desmontaje real
  corresponden a las rebanadas visuales. Su commit no incluyó `AGENTS.md`; ese contexto se publicó
  después en TD2 mediante `23018c9`, por pedido explícito de Guillermo.
- **No unir el PR hasta cerrar la revisión de los dos arreglos de TD2** descritos arriba; indicarlo también en el PR.
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
