# Pruebas de no regresión (reestructuración visual)

Compara el motor de cálculo **antes** (carpeta original) y **después** (interfaz reestructurada) con la misma herramienta (`tests/regress_snapshot.js`). Los valores «antes» y «después» son los internos del motor, sin formato de presentación.

| Resultado o función | Valor antes | Valor después | Diferencia | Estado |
|---|---|---|---|---|
| 1 Caso base (E-01): total C35:F39 [PM-L, privado] | 0 | 0 | 0 | sin cambio |
| 1 Caso base: categoría final G4 (PM-L) | N.A. | N.A. | 0 | sin cambio |
| 1 Caso base: intersecciones E12 (PM-L) | N.A. | N.A. | 0 | sin cambio |
| 2 Residencial · Casas 100 viv. (E-02): total C35:F39 [PM-L, privado] | 65 | 65 | 0 | sin cambio |
| 2 Residencial · Casas (E-02): total C35:F39 [PT-L, público] | 39 | 39 | 0 | sin cambio |
| 2 Residencial · Casas: categoría privado E4 (PM-L) | Básico | Básico | 0 | sin cambio |
| 2 Residencial · Departamentos 200 viv. (E-03b): total C35:F39 [PM-L, privado] | 92 | 92 | 0 | sin cambio |
| 2 Residencial · Departamentos (E-03b): total C35:F39 [PT-L, público] | 92 | 92 | 0 | sin cambio |
| 2 Residencial · Departamentos: intersecciones E12 (PM-L) | 2 | 2 | 0 | sin cambio |
| 3 Equipamiento · Oficinas 5.000 m² (E-04a): total C35:F39 [PT-L, privado] | 54 | 54 | 0 | sin cambio |
| 3 Equipamiento · Oficinas (E-04a): total C35:F39 [PT-L, peatones] | 27 | 27 | 0 | sin cambio |
| 3 Equipamiento · Restaurant-Bar 500 m² (E-04b): total C35:F39 [PT-L, privado] | 8 | 8 | 0 | sin cambio |
| 3 Equipamiento · Hospitales 20.000 m² (E-04c): total C35:F39 [PM-L, privado] | 432 | 432 | 0 | sin cambio |
| 4 Mixto residencial + comercial (E-06): total C35:F39 [PM-L, privado] | 92 | 92 | 0 | sin cambio |
| 4 Mixto (E-06): total C35:F39 [PT-L, privado] | 253 | 253 | 0 | sin cambio |
| 4 Mixto: categoría final G4 (PM-L) | Intermedio | Intermedio | 0 | sin cambio |
| 5 Redondeo · Oficinas, caso ROUND .5: 55,5+10 → 66 (E-04a): total C35:F39 [PM-L, privado] | 66 | 66 | 0 | sin cambio |
| 5 Redondeo · E-04a entrada+salida sin redondear, PM-L privado | 65.5 | 65.5 | 0 | sin cambio |
| 5 Redondeo · Hospedaje E-04d (frontera .5), peatones PM-L | 107 | 107 | 0 | sin cambio |
| 5 Redondeo · función excelRound, 332 valores (suma de resultados) | 287479 | 287479 | 0 | sin cambio |
| 5 Redondeo · función excelRound, 332 valores (todos iguales) | true | true | 0 | sin cambio |
| 6 Clasificación IMIV · 20 puntos del barrido de umbrales (categoría privado, otros modos, final e intersecciones) | 20 resultados | 20 resultados, idénticos | 0 | sin cambio |
| 7 Todos los módulos activos (E-07): total C35:F39 [PM-L, privado] | 28011 | 28011 | 0 | sin cambio |
| 7 Todos los módulos (E-07): total C35:F39 [PT-L, público] | 70551 | 70551 | 0 | sin cambio |
| 7 Todos los módulos: intersecciones E12 (PT-L) | Art 3.2.2. | Art 3.2.2. | 0 | sin cambio |
| Todos los casos de prueba (44): 80.080 valores de entrada, salida, total y flujos por bloque | — | — | 0 (máx. diferencia absoluta) | sin cambio |
| Categorías, intersecciones y textos de los 44 casos | 283394 bytes | 283394 bytes | 0 | sin cambio |
| Trazabilidad (cadena del total C35 de los 44 casos) | idéntica | idéntica | 0 | sin cambio |
| Resultado de las 63 pruebas internas (estado, esperado, obtenido, dif.) | {"aprobado":60,"pendiente":2,"diferencia intencional":1} | {"aprobado":60,"pendiente":2,"diferencia intencional":1} | 0 | sin cambio |
| Archivos del motor (js/calculations/*, validation, state, trace, tests, data/*): suma de verificación SHA-256 | 18 archivos | 18 archivos | 0 archivos distintos | sin cambio |

**Resultado global: 0 diferencias en todas las filas.**

## Verificaciones en el navegador (Chromium, `tools/ui_test.js`)

- Motor antes vs después, ejecutado dentro de la página con `IMIV.state.loadCase`: 11 casos (E-01, E-02, E-03b, E-04a, E-04b, E-04d, E-06, E-08, E-10_250, E-12P2, E-07), 0 casos con diferencia.
- Total consolidado mostrado en pantalla (20 celdas C35:F39) vs valor del motor: 0 discrepancias; 0 celdas con decimales en las tablas de resultados del modo Usuario.
- Modo Usuario: no aparecen «E-01», «Cargar caso de prueba», «Ejecutar validación» ni «Mostrar trazabilidad»; las celdas de resultado no son clicables.
- Modo Auditoría: aparecen las herramientas técnicas; se cargó E-06, se abrió la trazabilidad (6 pasos) y se ejecutaron las pruebas (60 aprobadas, 2 pendientes, 1 diferencia intencional).
- Informe: vista previa y PDF de 3 páginas A4 con numeración; «Volver a la aplicación» conserva los datos (Oficinas = 5000).
- Consola del navegador: sin errores.
