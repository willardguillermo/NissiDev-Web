# Bocetos de la TD1 (dirección visual)

Bocetos hechos por Claude en un lienzo de diseño (2026-10-21). Son **referencia visual**, no código para copiar:
están en el formato del lienzo (estilos en línea y un `<script>` propio del editor), y no se abren bien sueltos.
Léelos para sacar colores, tamaños, espaciados, orden de secciones y textos.

| Archivo | Qué es |
|---|---|
| `boceto-B-inicio.html` | **Dirección elegida (B · Papel y oro)**: Inicio en celular |
| `boceto-B-arma-tu-sistema.html` | Dirección B: Arma tu sistema (interruptores y resumen negro) |
| `boceto-A-inicio-N-3d.html` | Dirección A: solo para tomar la **N en 3D** del hero (el "momento A") |

Decisión: base **B** + un **momento A** (la N en 3D, más abajo en la página, nunca en la primera pantalla).
Detalle en el prompt de la TD1 y en `docs/diseño.md` (cuando exista).

## Actualización 2026-10-22: dirección elegida = Ensamble
La primera vista previa (B + momento A) no convenció. Guillermo eligió **Ensamble** del prototipo nuevo.
| Archivo | Qué es |
|---|---|
| `prototipo-ensamble.html` | **Referencia principal.** Prototipo con 3 versiones y selector; la elegida es la **1 · Ensamble** (`variants[0]`). Tiene el CSS y la lógica de las animaciones (armado del logo, rotador de servicios). Es un HTML suelto: tómalo como referencia, adáptalo a Astro y a los tokens del proyecto. |
| `../marca/nissidev-logo.svg` | Logo oficial en SVG, con 5 piezas (cuatro negras y la cinta dorada). |
Los bocetos `boceto-*.html` quedan como historial; ya no son la dirección.
