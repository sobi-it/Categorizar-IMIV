# Reestructuración visual y de experiencia de usuario (interfaz 1.1)

**El motor de cálculo no se modificó.** Verificación: los 18 archivos del motor tienen el mismo SHA-256 antes y después, y los resultados de los 44 casos coinciden con diferencia 0 (ver `NO_REGRESION.md`).

## Separación entre interfaz y motor
| Parte | Archivos | Cambios |
|---|---|---|
| **Motor** (no se tocó) | `js/calculations/*` (10 archivos), `js/validation.js`, `js/state.js`, `js/trace.js`, `js/tests.js`, `js/data/*` (inputsSchema, mappings, rates, testCases) | Ninguno |
| **Interfaz** (modificada) | `index.html`, `styles.css`, `js/app.js` | Reescritos |
| **Presentación** (nuevos, sin lógica de cálculo) | `js/format.js` (`formatResult`), `js/report.js` (resumen, tablas e informe) | Nuevos |

Los archivos nuevos sólo **leen** `IMIV.state.out` y formatean; ninguno es llamado por el motor. `js/state.js` no se modificó: el campo «Nombre del proyecto» ya existía (`IMIV.state.meta.nombre`) y el campo opcional «Archivo o modelo utilizado» se guarda en el mismo objeto `meta` desde la interfaz; ninguno interviene en el cálculo.

## Descripción de los cambios visuales
1. **Navegación en tres bloques**, con separador visual: *A · Entradas del proyecto* (1 Datos generales del proyecto, 2 Residencial, 3 Equipamiento, 4 Actividades productivas, 5 Infraestructura y terminales), *B · Resultados del cálculo* (6 Flujos por tipología, 7 Resultados consolidados) y *C · Informe* (8 Informe final). Las pantallas de resultados llevan una banda «Resultados del cálculo» y no contienen campos de entrada.
2. **Residencial**: orden visual de tarjetas Departamentos → Casas → Residencial Sistema de Atención a la Niñez y Adolescencia → Residencial Estudiantes → Residencial Adultos Mayores → Hospedaje / Hoteles. Se cambió sólo el arreglo de presentación `RESID_ORDER` (en `js/report.js`); los identificadores, variables, mapeos y el orden de cálculo no cambian. Cada tarjeta muestra «Hoja Excel: …» como información secundaria.
3. **Resultados consolidados (7)**, en el orden pedido: 1 Resumen final IMIV (tarjetas), 2 Categoría IMIV, 3 Número de intersecciones y área de influencia, 4 Flujos inducidos totales (entrada, salida y total), 5 Flujos por tipología, 6 Notas, advertencias y detalle técnico. Los 5 períodos, los 4 modos y entrada/salida/total siguen separados.
4. **Modo Usuario**: acciones principales *Calcular*, *Restablecer valores*, *Exportar resultados (CSV)* e *Imprimir / Guardar Informe*. Ya no hay lista de casos de prueba, «Ejecutar validación», «Mostrar trazabilidad», matriz técnica ni fórmulas. Los valores de resultado no son clicables.
5. **Modo Auditoría**: aparece una barra «Herramientas técnicas» (cargar caso de prueba, ejecutar validación, mostrar trazabilidad) y, en Resultados consolidados, la sección colapsable y cerrada por defecto «Herramientas técnicas de validación y auditoría» con Trazabilidad y tasas, Validación y pruebas, y Advertencias/excepciones/decisiones. Un interruptor permite ver los decimales internos en las tablas. Los casos de prueba y su código siguen en el proyecto.
6. **Resultados como enteros**: todas las tablas de flujos (por tipología, entrada, salida, total) y el número de intersecciones se muestran sin decimales mediante `IMIV.format.formatResult(valor)`. Conserva «N.A.» y «Art 3.2.2.» como texto, muestra «—» sólo cuando no hay valor y muestra «Error» (nunca 0) ante un valor no finito. Se usa únicamente en la presentación (`js/report.js`, `js/app.js`); el motor no lo llama. El CSV exportado conserva los valores internos sin redondear.
7. **Informe**: «Imprimir / Guardar Informe» abre una vista de informe propia (no imprime la interfaz), con *Volver a la aplicación* e *Imprimir / Guardar como PDF*. La misma vista se imprime si el usuario usa Ctrl+P desde la aplicación.

## Agregaciones de presentación (lectura, no cálculo)
Para el resumen ejecutivo se muestra la **mayor categoría entre los 5 períodos** (privado, otros modos y final) y el **máximo número de intersecciones** (con «Art 3.2.2.» como el mayor valor posible). Son lecturas de `RESULTADOS IMIV!G4:G8`, `E4:F8` y `E12:F16`; la tabla por período, que reproduce esas celdas, se muestra siempre junto al resumen. Los totales por tipología del informe son la suma (entrada + salida, sin redondear) de los flujos del motor, mostrados como enteros; la fila de total usa el total consolidado redondeado del motor.

## Funciones que no fueron modificadas
`excelRound`, `calcTemplate`, `calcViviendas` / `calcCasas` / `calcDptos`, `calcEducation`, `calcCommerce` / `commerceLabel`, `calcPorts`, `calcTerminal`, `consolidate`, `classify` / `catBand` / `aiPriv` / `aiOtros`, `runProject`, `parseField` / `parseInputs`, `explain` (trazabilidad), `runAll` / `runCase` (pruebas), y los datos de tasas, esquema, mapeos y casos de prueba.

## Archivos modificados o agregados
Modificados: `index.html`, `styles.css`, `js/app.js`, `README.md`, `docs/VALIDACION.md`, `docs/DECISIONES_V1.md`, `docs/DIFERENCIAS_EXCEL_WEB.md`, `docs/EXCEPCIONES_CONOCIDAS.md`, `docs/TRAZABILIDAD.md` (referencias a secciones). Agregados: `js/format.js`, `js/report.js`, `tests/regress_snapshot.js`, `tools/ui_test.js`, `docs/CAMBIOS_INTERFAZ.md`, `docs/NO_REGRESION.md`.

## Cómo generar el informe en PDF
1. Complete «1 · Datos generales del proyecto» (nombre del proyecto, analista) y las entradas.
2. Pulse **Calcular** y revise los resultados.
3. Pulse **Imprimir / Guardar Informe**: se abre la vista de informe.
4. Pulse **Imprimir / Guardar como PDF** y, en el diálogo del navegador, elija el destino **«Guardar como PDF»** (Chrome/Edge) o «Guardar como PDF» en el menú PDF (Safari/Firefox). Tamaño A4 o Carta; márgenes predeterminados; deje «Gráficos de fondo» activado para conservar los colores de las categorías.
5. **Volver a la aplicación** conserva todos los datos ingresados.
