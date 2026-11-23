# ADR-005: La demo inmobiliaria usa la plantilla de demos con su propia configuración

## Estado
Aceptado por Guillermo (2026-11-22), tras la revisión independiente de la rama `feature/inmobiliaria-vitrina`.
Propuesto por Claude Code ese mismo día.

## Contexto
- Guillermo pidió una demo completa para Inmobiliaria «con la plantilla de demos (RubroConfig)».
- `RubroConfig` describe un negocio que vende productos: presentaciones con factor (unidad, bolsa, caja), precio por
  mayor, stock en unidad base, vencimientos, puestos de recojo, campañas y ventas por medio de pago. Un inmueble no
  tiene nada de eso: tiene operación (venta o alquiler), distrito, m², dormitorios, baños, precio en S/ o US$ y
  consultas en vez de ventas.

## Decisión
- Se reutiliza todo lo que es de la plantilla y no del negocio: la franja de NissiDev con el sello y Cliente/Dueño
  (`Marco`), el tema como variables `--d-*` (`TemaDemo`, `variablesDeTema`), los estilos base de `demo.css`
  (botones, chips, panel, barras, avisos, diálogo), el layout `Demo.astro`, el historial del botón Atrás y el
  registro `RUBROS` con su historia del celular.
- Los datos van en una configuración propia, `InmobiliariaConfig` (`src/demo/inmuebles/`), con la misma regla que
  `RubroConfig`: ningún componente tiene datos del negocio fijos; todo sale de `src/rubros/inmobiliaria/`.

## Alternativas consideradas
- **Meter los inmuebles en `RubroConfig`:** habría que fingir presentaciones, stock y puestos; los cálculos del
  panel (ventas, vencimientos) no tendrían sentido y cada validación tendría excepciones.
- **Generalizar `RubroConfig` en una unión de tipos de catálogo:** más limpio a largo plazo, pero toca la dulcería
  ya aprobada para un solo rubro nuevo. Se puede hacer cuando haya un tercer tipo de catálogo (p. ej. reservas).

## Consecuencias
- Un rubro de «catálogo de productos» sigue usando `RubroConfig`; uno de «catálogo de inmuebles», `InmobiliariaConfig`.
- La isla `DemoInmobiliaria` repite unas 40 líneas de la isla de la dulcería (historial, foco, aviso). Si aparece
  una tercera demo, conviene sacarlas a un hook común.
