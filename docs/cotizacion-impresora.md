# Spec — Cotización que sale de la impresora

Estado: aprobada por Guillermo el 2026-10-24, incluidos los tres supuestos y los ajustes siguientes.
Plan y avance: [tasks/plan.md](../tasks/plan.md#cotización-con-impresora).

## Objetivo y alcance
Al abrir Cotización con módulos elegidos, la proforma NSD sale de una ticketera en pantalla y,
al terminar, aparecen las acciones. Es una presentación de la cotización existente, sin cobros.
Se mantienen Astro + React, CSS propio y los ADR-002/003; no se agregan dependencias.

## Rama y condición de integración
- Rama: `feature/cotizacion-impresora`, desde `feature/td2-liquid` en `c79f5f6b80ab6565663946ca8a8fcbb741797f91`.
- Base actualizada con TD2 en `a08e449`; comparación y revisión de esta mejora contra **`9d164c2`**.
- PR hacia `feature/td2-liquid`, con resumen, capturas y pasos para probar; sin unirlo automáticamente.
- La descripción del PR debe indicar: **No unir hasta cerrar la revisión de los dos arreglos de TD2**:
  `rootMargin` de HistoriaDemo en ventanas apaisadas y sello «Demo · datos de ejemplo» fuera del sticky.
- Al cerrar la rama: «Listo para revisión» con el commit base; revisa Claude Code o una sesión independiente.
  Para aislar esta mejora se compara con la base TD2; el último `main` observado es `7c9eb67`.
  Toda integración necesita aprobación de Guillermo y merge commit, sin squash.

## Comportamiento
1. «Preparando tu cotización»: 900 ms.
2. «Imprimiendo tu cotización»: `duracionImpresion(alto)` en milisegundos,
   `Math.min(2600, Math.max(1200, Math.round(alto * 1.4)))`.
3. «Cotización lista» con check: aparecen Guardar PDF (principal, `window.print()`),
   Enviar por WhatsApp (secundaria, enlace existente) e Imprimir otra vez (control pequeño).
No hay pausa adicional: secuencia completa y acciones disponibles en un máximo de 3500 ms.
El campo opcional y Cambiar módulos se conservan. El carrito vacío conserva su salida actual.

## Presentación y accesibilidad
- Impresora con `z-index` mayor que el papel; salida con `overflow: hidden` desde la ranura.
- Papel de `translateY(-101%)` a `translateY(0)`; solo se anima `transform`.
- Curva aprobada: `--ease-papel: cubic-bezier(.3, .15, .2, 1)` en `src/styles/tokens.css`,
  junto a las otras curvas. Reemplaza el avance lineal de la propuesta inicial.
- Tokens y Geist de TD2 en impresora y controles; papel sólido y monoespaciada del sistema solo en el ticket.
- Barras decorativas con `aria-hidden`; sin recursos nuevos ni colores tomados de la demo.
- Estado con `role="status"` y `aria-live="polite"`; acciones con foco visible.
- Movimiento reducido: papel directo en «lista», sin temporizadores de espera ni desplazamiento.
- Reservar espacio desde la carga inicial para papel y acciones, incluida la hidratación: objetivo CLS 0.
  No bloquear la lectura asistida; acciones ocultas fuera del recorrido de teclado hasta estar disponibles.

## Datos e impresión
- Reutilizar el resumen y las funciones actuales: módulos, precios «desde»/«Cotizar», inversión inicial,
  mensualidad, código NSD, fecha, validez de 15 días y aviso de precios referenciales.
- Añadir el texto aprobado: «Cotización referencial · No es un comprobante de pago».
- No duplicar cálculos ni cambiar precios, formato de código, mensaje o destino de WhatsApp ni persistencia.
- Código y fechas siguen creándose en `useEffect`. Lógica sin React, probada por separado;
  la limpieza del efecto solo cancela temporizadores: nunca escribe texto ni actualiza el estado.
- El ticket estrecho es solo para pantalla. PDF con `@page { size: A4; margin: 18mm 16mm; }` explícito,
  conservando los márgenes actuales. En impresión: proforma completa, sin ticketera, controles,
  máscara, recorte ni transform, incluso al imprimir desde el menú del navegador a mitad de la secuencia.

## Supuestos aprobados y preguntas
1. Imprimir otra vez repite la animación con el mismo código y fechas; Guardar PDF abre la impresión real.
2. El nombre opcional queda fuera del papel que se desplaza, editable sin mover el formulario.
3. Una secuencia por apertura; editar el nombre no la reinicia.
Sin preguntas abiertas para comenzar; A4, rama base y curva quedaron confirmados.

## Criterios de verificación y entrega
- Vitest: límites de duración, fases con reloj falso, movimiento reducido directo a lista,
  cancelación sin escrituras ni callbacks posteriores ni temporizadores pendientes y tests actuales de cotización.
- Comprobar el desmontaje a mitad de la secuencia en navegador y su cancelación con reloj falso en Vitest.
- Introducir un error deliberado, comprobar que el test correspondiente falla, revertirlo y volver al verde.
- En cada rebanada: `npm test`, `npm run check`, `npm run lint` y `npm run build` sin errores.
- En las rebanadas visuales: celular de 390 px y escritorio; una captura por fase, con movimiento reducido
  y en vista previa de impresión A4. Sin scroll horizontal, foco visible, sin errores de hidratación; medir CLS.
- Casos: carrito vacío, cotización corta/larga, módulos por cotizar, mensualidad, nombre largo,
  repetición, salida a mitad de secuencia y carrito actualizado desde otra pestaña.
- Revisión independiente en cinco ejes: correcto, legible, arquitectura, seguridad y rendimiento;
  checklist completa «03 Técnicas/Checklist antes de entregar a un cliente.md» del vault, con evidencia
  y explicación de puntos no aplicables al frontend estático.
- Al terminar la mejora: bitácora fechada con commits, tests y lecciones en «Web NissiDev.md» del vault;
  marcar «Cotización que sale de la impresora» en «Mejoras de diseño.md». No marcar antes de implementarla.
- Actualizar `docs/ESTADO.md` al terminar cada sesión, en su último commit.

## Evidencia de implementación

CI3–CI6 implementadas; A4 en `f2645e9`; verificaciones de navegador cerradas con Playwright de la caché, autorizado por Guillermo. Resultados y capturas en
[VERIFICACION.md](referencias/cotizacion-impresora/VERIFICACION.md). No confundir implementación
con aprobación de merge: la revisión de los arreglos de TD2 y la aprobación de Guillermo deben cerrarse.
