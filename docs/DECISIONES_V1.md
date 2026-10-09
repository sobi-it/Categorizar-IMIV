# Decisiones aprobadas para la versión 1

Estado: **aprobadas por el propietario** (D1–D6). Las decisiones D7–D14 del plan siguen **pendientes de confirmación** y se implementaron con la propuesta indicada (ver al final).

Principio general: la versión 1 **reproduce el Excel**; no es una versión normativa corregida. No se corrigen errores del libro en silencio, no se alinean límites con la norma y no se inventan reglas.

## D1 — Casas
- Se reproduce `INPUTS PROYECTO!B5 = 61 × B6`. Los 61 m² por vivienda son un **parámetro interno fijo** (`js/data/mappings.js › constants.CASAS_SUP_UTIL_M2_POR_VIVIENDA`), usado en `js/calculations/residential.js › calcCasas` con las mismas operaciones que Excel (`C4 = IF(C5=0,0,B5/B6)`).
- No existe campo editable de `B5` ni de superficie promedio para Casas.
- Nota técnica visible en la sección Residencial y en el informe: «Para esta versión, la superficie útil de casas se calcula como 61 m² por vivienda, reproduciendo la fórmula original del Excel.»
- Consecuencia (EX-02): con viviendas > 0 sólo se activa el tramo 60 < SP ≤ 140 m². Las tablas de los 5 tramos están implementadas y probadas (prueba `M2B-01`; la referencia se obtuvo sobrescribiendo B5 en una copia del libro).

## D2 — Terminal TPUB sin pasajeros
- Se reproduce sólo lo verificable: `F27/F28` (factor medio de flota de US1 y US2), `H37/H38 = IF(f=0,0,f×factor)`, total `H43`, `E6 = H43`, salida = entrada, otros modos = 0 (EX-35).
- **Deshabilitados** y excluidos del cálculo: frecuencias US3–US6 (`INPUTS PROYECTO!U16:Y19`) y las filas de flota duplicadas `U7:W10`. Se muestran, no se ocultan, y llevan la advertencia: «US3–US6 no se encuentran correctamente definidos en el libro Excel original y quedan pendientes de confirmación. No se incluyen en el cálculo de esta versión.»
- No se inventó significado para las filas ni se corrigió el `VLOOKUP` (EX-24, EX-25, EX-26). Si un caso de prueba carga un valor en un campo deshabilitado, la web lo informa y el resultado difiere del Excel, que daría `#N/A` (caso `E-17e`, estado «diferencia intencional»).
- El módulo queda **pendiente de validación independiente**.

## D3 y D4 — Comercios
- `js/calculations/commerce.js` reproduce hoja por hoja las dummies de Centros Comerciales, Supermercados-LocalesComercials y Otro Comercio (Vega): límites propios, carga 0 (aplica la escala menor/básica, EX-28), Vega con carga exactamente 250 (ninguna escala activa, flujo 0, EX-29) y diferencias en 1.000 y 6.000 entre hojas (EX-27).
- La etiqueta de escala usa la lógica de `M10/M17` (`VLOOKUP(1,$N$26:$O$29,2,FALSE)`); cuando el Excel da `#N/A` la web muestra «Sin escala aplicable según la lógica actual del Excel.» (EX-30, EX-37). Las dummies y los flujos no cambian.
- Advertencia permanente en las tarjetas y en los flujos: «Los límites de escala de esta versión reproducen el Excel y aún no han sido armonizados con la normativa.»
- Verificado contra la referencia con 10 valores de carga (0, 249, 250, 251, 999, 1.000, 1.001, 5.999, 6.000, 6.001) en las tres hojas (casos `E-10_*`).

## D5 — Área de influencia
- Con flujo privado > 1.000 veh/h se muestra exactamente «Art 3.2.2.» (`classification.js › aiPriv`). No se calculan intersecciones 9 o más ni se agregan entradas de densificación o extensión.
- Nota visible: «El libro original no implementa el desglose de intersecciones posteriores. El resultado se conserva como referencia al Art. 3.2.2.»

## D6 — Validación web (dos niveles)
| | Modo usuario | Modo auditoría / pruebas |
|---|---|---|
| Texto | bloqueado; no se calcula; **no** se convierte en 0 | bloqueado; no se calcula |
| Negativos | bloqueados con mensaje | permitidos con aviso (el Excel los acepta) |
| Vacío | = 0 | = 0 |
| Códigos de tipo fuera de lista | bloqueados | permitidos |

- Mensajes por campo antes de calcular; con errores la aplicación **no calcula** y lo informa (no se propaga `#VALUE!`).
- El modo auditoría permite ejecutar casos controlados (negativos, códigos fuera de lista); se activa en el selector «Modo» (Usuario / Auditoría); muestra un banner permanente y habilita «Cargar caso de prueba», «Ejecutar validación», «Mostrar trazabilidad» y las herramientas técnicas, que están ocultas en modo Usuario.
- Diferencias documentadas en `DIFERENCIAS_EXCEL_WEB.md` (DIF-01, DIF-02, DIF-13, DIF-14) y en las herramientas técnicas de la aplicación (modo Auditoría).
- No se alteró la lógica matemática de tasas, fórmulas, dummies, redondeos, categorías ni consolidación.

## Propuesta de interfaz para entradas bloqueadas o pendientes
| Estado | Cuándo | Presentación |
|---|---|---|
| **Deshabilitado / bloqueado** | Campo que el Excel no procesa correctamente (US3–US6, flota duplicada) | Campo visible, gris, no editable, etiqueta roja «Bloqueada (D2)», tooltip con el motivo y advertencia roja en la tarjeta |
| **En validación** | Funcionalidad pendiente de validación independiente | Chip violeta «Pendiente de validación independiente» en el título de la tarjeta |
| **Advertencia de límites** | Escalas comerciales no armonizadas | Nota ámbar fija en cada tarjeta comercial y en los flujos |
| **Advertencia de dato** | Combinaciones que el Excel acepta pero dan resultados poco intuitivos (carga 0, superficie 0 con viviendas, capacidad sin tipo de puerto) | Aviso ámbar bajo el campo; no bloquea |
| **Error de entrada** | Texto, negativo (modo usuario), código fuera de lista | Campo en rojo + mensaje; cálculo detenido |
| **Diferencia intencional** | Resultado distinto del Excel por decisión del propietario | Estado propio en la tabla de pruebas y fila en «Diferencias» |

Esquema del panel del terminal sin pasajeros (sección 5 «Infraestructura y terminales»):

```
┌ Terminal de buses sin pasajeros  [Pendiente de validación independiente]  ☑ Incluir ┐
│ ⚠ US3–US6 no se encuentran correctamente definidos … No se incluyen en el cálculo.  │
│ Flota    Taxibus  Bus  Bus art.  │ Frecuencia  PM-L PMD-L PT-L PMD-F PT-F          │
│ US1 ✔    [   ]    [  ] [   ]     │ US1 ✔       [  ]  [  ]  [  ]  [  ]  [  ]        │
│ US2 ✔    [   ]    [  ] [   ]     │ US2 ✔       [  ]  [  ]  [  ]  [  ]  [  ]        │
│ US1/US2 duplicadas ▒ bloqueadas  │ US3 … US6 ▒ bloqueadas (D2)                     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Decisiones D7–D14 (pendientes; implementadas con la propuesta)
| # | Tema | Implementación actual | Estado |
|---|---|---|---|
| D7 | Redondeo | `excelRound`: 15 cifras significativas y mitad lejos de cero. Un caso (E-04d) difiere de LibreOffice | Confirmar en Excel |
| D8 | Factor 2,5 | Sólo privado en Bodegas y Relleno | Confirmar |
| D9 | Educacionales | Lista cerrada 0–4; el motor acepta cualquier código | Confirmar |
| D10 | Rótulos erróneos | Rótulos correctos en la web | Confirmar lista |
| D11 | Tasas Casas/Departamentos | Se usan D:G; la columna C no | Confirmar |
| D12 | Períodos | Clave única PMD-L/PMD-F | Confirmar significado |
| D13 | Referencia de pruebas | LibreOffice | Confirmar muestra en Excel |
| D14 | Celdas sin efecto | `K22`, `B7`, `P8`, `P9`, `C6`/`C13` descartadas | Confirmar |
