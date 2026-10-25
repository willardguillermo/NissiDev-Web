# ADR-004: Ningún rubro protagonista y sin ubicación

## Estado
Aceptado por Guillermo (2026-10-25). Spec en `docs/estructura-rubros.md`.

## Contexto
- La web nació alrededor de la demo de la dulcería: el Inicio decía «es una dulcería de ejemplo», los textos del
  celular hablaban de bolsas y cajas, y Demos solo tenía una demo activa. Un dueño de otro rubro sentía que la web
  no era para él.
- El hero, el footer, las descripciones de Base y Servicios, la tarjeta de contacto y la proforma decían «Este de
  Lima». La zona sirve para decidir a quién escribirle, pero en la web achica el público sin aportar nada al dueño.
- Varias páginas repetían lo mismo (servicios, carrito, stack y contacto también vivían en el Inicio).

## Decisión
1. **Ningún rubro es protagonista.** La web muestra los sistemas para distintos rubros (Dulcería, Restaurante,
   Salón de belleza, Clínica, Negocio por mayor). Lo particular de un rubro vive en su demo o en sus datos
   (`src/rubros/<id>/`), nunca en los textos generales.
2. **Sin ubicación.** Ningún texto público menciona una zona. Puede quedar como nota interna en BRIEF/SPEC.
   Un test falla si «Este de Lima» vuelve a `src/`.
3. **Una página, un trabajo:** Inicio (mostrar y probar), Soluciones (rubros), Servicios (cómo se crea el sistema),
   Cotizar (carrito), Sobre mí, Contacto. Redirecciones 301 para las rutas viejas ya compartidas.

## Alternativas consideradas
- **Mantener la dulcería al frente y agregar rubros después:** menos trabajo hoy, pero cada rubro nuevo tendría que
  pelear contra textos escritos para dulcerías.
- **Una demo completa por rubro antes de mostrarlos:** semanas de trabajo. Se eligió una historia ligera por rubro
  (solo las 4 pantallas del celular) y «Pide la demo de tu rubro» por WhatsApp.
- **Decir la zona solo en Contacto:** sigue achicando el público; la conversación por WhatsApp ya la resuelve.

## Consecuencias
- Cada rubro sin demo necesita un `historia.ts` con datos inventados y tests; el tipo común obliga a que los 5
  muestren lo mismo.
- El HTML del Inicio crece (5 juegos de pantallas) pero el JavaScript casi no: el cambio de rubro es mostrar u
  ocultar con clases.
- Las rutas viejas dependen de `public/_redirects`; no se pueden borrar mientras haya enlaces compartidos.
