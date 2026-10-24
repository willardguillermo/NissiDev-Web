# Verificación de la cotización con impresora

Fecha: 2026-10-24. Rama: `feature/cotizacion-impresora`; base TD2: `9d164c2`.

## Alcance y rollback

La proforma existente sale de una ticketera de pantalla. Se conservan los cálculos, código NSD,
fechas, carrito, enlace de WhatsApp y PDF A4. No hay pago, servidor nuevo ni dependencias nuevas.

Volver atrás si el papel queda recortado al imprimir, las acciones no aparecen o se pierde el
resumen. Antes de integrar, se puede cerrar el PR y seguir usando TD2. Tras una integración
aprobada, revertir su merge commit mediante un PR y comprobar Cotización con y sin módulos;
el carrito persistente conserva su formato y no requiere migración. No se cambia main aquí.

## Comandos y prueba deliberada

| Comprobación | Resultado |
|---|---|
| `npm test` | 384 tests en 35 archivos, correctos |
| `npm run check` | 0 errores, advertencias e hints |
| `npm run lint` | Correcto |
| `npm run build` | 7 páginas; correcto |
| `npm audit --audit-level=high` | 0 vulnerabilidades |
| `git diff --check` | Correcto |

Persiste la advertencia de Node: `localStorage is not available because --localstorage-file was
not provided`. Es anterior a esta mejora; no se presenta como un build sin advertencias.

La prueba deliberada quitó `clearTimeout(temporizador)` de la limpieza. Falló el test de
cancelación a 450 ms en `src/cotizacion/impresion.test.ts:67`, con 1 temporizador pendiente
cuando se esperaba 0. Restaurado el código, los 18 tests de impresión vuelven a pasar.

## Navegador y capturas

Brave local, 390×844 y 1366×900. Las fases se congelaron con DevTools únicamente para fotografiarlas;
los tiempos se midieron aparte, sin esa pausa. No se cambió el código del producto para capturar.
Por pedido de Guillermo, se conservan únicamente las capturas de lista en móvil/escritorio y la proforma A4; las otras seis se eliminaron.

| Caso | Evidencia / resultado |
|---|---|
| Preparando | Verificado en ambos tamaños; captura descartada por pedido de Guillermo |
| Imprimiendo | Verificado en ambos tamaños; captura descartada por pedido de Guillermo |
| Lista | [Móvil](capturas/movil-lista.png) · [Escritorio](capturas/escritorio-lista.png) |
| Movimiento reducido | Verificado en ambos tamaños: lista directa, `transform: none`; capturas descartadas por pedido de Guillermo |
| Secuencia corta | Fases a 0, 904 y 2104 ms; duración de papel 1200 ms para 758 px |
| Acciones | `inert` hasta lista; repetir conserva el código NSD |
| Carga y secuencia | CLS 0 medido con PerformanceObserver; sin desborde horizontal |
| Cotización larga | 9 módulos, mensualidad y módulos por cotizar; papel de 1139 px en móvil, sin desborde |
| Nombre largo | Texto con etiquetas mostrado literalmente y codificado en WhatsApp; código conservado, sin reinicio |

Una edición sintética del nombre desplaza texto del papel y no cuenta como entrada real del usuario
para el navegador; produjo una medida de layout shift aparte. El CLS 0 indicado corresponde a carga
 y secuencia, sin ese cambio programático de contenido. No se ha medido INP ni se ha repetido Lighthouse
para Cotización; las cifras anteriores del Inicio de TD2 no son mediciones de esta página.

### Impresión

Se abrió `window.print()` a los 1300 ms, mientras se imprimía el papel. La vista previa y el PDF
exportado contienen los 9 módulos, inversión inicial, mensualidad, código, fecha, validez y aviso
referencial completos. Sin ticketera, acciones, máscara ni recorte. `pdfinfo`: una página A4,
594.96×841.92 puntos. Renderizado con Poppler e inspeccionado visualmente:
[proforma A4](capturas/impresion-a4.png). Se desactivaron encabezado y pie propios del navegador para
esa muestra; esta opción corresponde al diálogo de impresión del visitante.

### Pendientes de cierre en navegador

- Teclado y foco visible en las acciones, incluida la repetición.
- Desmontaje real durante la secuencia y ausencia de temporizadores propios pendientes.
- Cambio del carrito desde otra pestaña y estado vacío.

El control nativo falló al retomar con `Sky Computer Use native pipe startup failed`. No se dan por
pasadas esas tres pruebas. La prueba en el celular físico de Guillermo sigue siendo su aprobación.

## Revisión independiente en cinco ejes

Sesión nueva sin contexto de implementación, contra `9d164c2`, incluido el ajuste A4 local;
sin errores concretos ni bloqueantes. El revisor ejecutó tests y lint, sin editar ni usar el navegador.

| Eje | Balance |
|---|---|
| Correcto | Fases conectadas a la isla; limpieza cancela timers; repetir conserva código y fechas; resumen reactivo |
| Legible | Componentes pequeños, responsabilidades separadas y nombres en español |
| Arquitectura | Lógica temporal pura; precios, totales y WhatsApp reutilizados; render inicial compatible con SSR |
| Seguridad | React escapa el nombre; enlace codificado con `noopener noreferrer`; sin persistencia nueva |
| Rendimiento | Solo `transform`; altura medida una vez por secuencia; movimiento reducido sin esperas |

Observación menor aceptada: la reserva conservadora de 104rem evita mover el pie al hidratar, pero
 deja espacio inferior, especialmente en el carrito vacío. No se cambió durante la revisión.
La revisión de esta mejora no sustituye el cierre pendiente de la revisión de TD2 ni autoriza merge.

## Checklist del vault

Se aplicó «03 Técnicas/Checklist antes de entregar a un cliente.md». Esta es una mejora de un
frontend estático, sin panel real, login, API ni base de datos.

| Grupo | Resultado / aplicabilidad |
|---|---|
| Tests, tipos, lint y build | Correctos; advertencia conocida de Node registrada arriba |
| Revisión en cinco ejes | Independiente, sin hallazgos bloqueantes |
| Depuración / pendientes | Sin console.log ni TODO nuevos en el producto; pruebas de navegador pendientes señaladas arriba |
| Errores esperados | Persistencia segura existente con try/catch; conserva el estado vacío y restauración validada del carrito |
| Validación en servidor, SQL, contraseñas, cookies, login/CORS y RLS | No aplican: sin servidor, cuentas, sesiones ni base de datos; el nombre es opcional y no se guarda |
| Secretos / contenido externo | Sin nuevas claves, variables de entorno, eval ni innerHTML; React escapa el nombre y WhatsApp lo codifica |
| Dependencias | Sin nuevas dependencias; audit sin vulnerabilidades |
| HTTPS y cabeceras | Cloudflare usa HTTPS y nosniff. Sin CSP/HSTS/X-Frame-Options propios observados; no se cambia la política global de hosting en esta mejora. CORS * corresponde a archivos estáticos, sin API autenticada |
| Rendimiento / imágenes / consultas | Sin imágenes nuevas en el producto ni consultas; sin trabajo JS por cuadro; CLS medido arriba. Lighthouse/INP globales siguen en T27 |
| Accesibilidad | Estado polite, barras aria-hidden y acciones inert; contraste existente cubierto por tokens.test.ts. Prueba final de teclado pendiente; no se afirma un audit axe/Lighthouse nuevo |
| Diseño | Tokens y Geist de TD2, monoespaciada solo en el papel; sin colores ni cobros de la demo |
| Infraestructura | Sin nuevas variables, migraciones, dominios ni accesos; despliegue de rama por Cloudflare, sin tocar main |
| Logs | Se conservan los logs de build/hosting; sin nueva telemetría ni datos personales persistidos |
| Documentación / entrega | Spec, plan, evidencia y pasos de prueba en el PR. Falta README global del proyecto: pendiente previo de T27, fuera de esta mejora |
| Guía del panel y entrega de accesos | No aplican: no se entrega un panel real ni se crean credenciales |
| Rollback | Procedimiento definido al principio de este documento |
