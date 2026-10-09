# Diferencias respecto del Excel

Diferencias intencionales y de presentación entre la aplicación web y `P001_FLUJOS_IMIV_IT_V4.0.xlsx`. **No hay diferencias en la lógica matemática**: tasas, fórmulas, dummies, redondeos, categorías y consolidación reproducen el libro (ver `VALIDACION.md`).

| ID | Tema | Excel | Web | Tipo | Excepción |
|---|---|---|---|---|---|
| DIF-01 | Texto en campos numéricos | #VALUE! en todos los resultados. | Error en el campo y el cálculo no se ejecuta. No se convierte en 0. | Intencional (D6) | EX-13 |
| DIF-02 | Valores negativos | Aceptados; flujos negativos y categorías N.A. | Modo usuario: bloqueados con mensaje. Modo auditoría: permitidos con aviso. | Intencional (D6) | EX-14 |
| DIF-03 | Campo vacío | Se lee como 0. | Se lee como 0; el campo muestra «vacío = 0». | Equivalente | EX-15 |
| DIF-04 | Superficie de Casas | B5 es fórmula, pero el usuario de Excel podría sobrescribirla. | No existe campo de superficie para Casas. Parámetro interno 61 m²/vivienda. | Intencional (D1) | EX-01 |
| DIF-05 | Etiqueta de escala sin escala (comercios) | #N/A en M10/M17. | «Sin escala aplicable según la lógica actual del Excel.» | Intencional (D4) | EX-30 |
| DIF-06 | Terminal TPUB sin Pasajeros US3–US6 | #N/A en todos los resultados si frecuencia ≠ 0. | US3–US6 y filas de flota duplicadas deshabilitadas con advertencia; US1–US2 se calculan como el Excel. | Intencional (D2) | EX-24 |
| DIF-07 | Período «PMd» | Dos ortografías en el libro. | Clave única PMD-L / PMD-F. | Presentación | EX-16 |
| DIF-08 | Rótulos erróneos | Casas dice «Departamentos»; Hoteles rotula m²; bloques con «COMERCIO BAR DISCOTECA». | Rótulos correctos. | Presentación | EX-18…EX-20 |
| DIF-09 | Separador decimal | Según configuración regional de Excel. | Se acepta «.» o «,» como decimal; no se acepta separador de miles. Se muestra el valor interpretado. | Entrada de datos | — |
| DIF-11 | Resultado «Art 3.2.2.» | Texto en E12:E16. | Igual, con nota explicativa. | Equivalente + nota (D5) | EX-10 |
| DIF-12 | Celdas sin efecto | K22, B7, P8, P9, C6/C13 (#REF!). | No se muestran ni se calculan. | Presentación | EX-21, EX-22, EX-25 |
| DIF-13 | Modo de operación | Un único modo. | Modo usuario (bloquea texto y negativos) y modo auditoría/pruebas (permite negativos para comparar). El texto se bloquea en ambos modos. | Intencional (D6) | EX-13, EX-14 |
| DIF-14 | Códigos de tipo (educacionales, puertos) | Celda libre sin validación. | Lista cerrada en la interfaz; el motor reproduce cualquier código. | Entrada de datos | EX-36 |
| DIF-15 | Terminal de buses sin pasajeros: US3–US6 en pruebas | #N/A en todos los resultados si hay frecuencia en US3–US6. | Se excluyen del cálculo y se informa. El caso se registra como diferencia intencional (D2). | Intencional (D2) | EX-24 |

## Modo usuario y modo auditoría

| | Modo usuario | Modo auditoría / pruebas |
|---|---|---|
| Texto en campos numéricos | Error; no se calcula | Error; no se calcula |
| Negativos | Error; no se calcula | Permitidos con aviso (el Excel los acepta) |
| Vacío | = 0 | = 0 |
| Códigos de tipo fuera de lista (educacionales, puertos) | Error; lista cerrada | Permitidos (el Excel no aplica tasas) |
| Campos U7:W10 y US3–US6 del terminal sin pasajeros | Deshabilitados | Deshabilitados (se excluyen siempre, D2) |

Los resultados se muestran como enteros sin decimales (sólo presentación; el motor conserva su precisión y el CSV exportado incluye los valores sin redondear). El modo auditoría existe para cargar los casos de comparación (por ejemplo `E-neg`, `E-051`, `E-11P3`). No debe usarse para resultados de proyecto.
