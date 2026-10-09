# Trazabilidad Excel ↔ web

Cada resultado de la web puede explicarse hasta la celda de Excel de origen (botón «Mostrar trazabilidad» o clic en cualquier valor de las secciones 6, 7 y 8). Este documento resume el mapeo; el detalle se genera en la aplicación con `js/trace.js`.

## Cadena de cálculo

```
INPUTS PROYECTO!<celda>  →  <hoja>!C4 / C5  →  unidad de referencia (L12/L19, K14, J14, N14…)
  →  tasa (<hoja>!E8:H12 …) × dummy (<hoja>!H / G / J …) × factor  →  flujo <hoja>!N8:Q12 / N15:Q19 …
  →  bloque en RESULTADOS IMIV!D:G (fila entrada y fila salida + 5 períodos)
  →  suma de 44 bloques C21:F25 (entrada) y C28:F32 (salida)
  →  total C35:F39 = ROUND(entrada + salida, 0)
  →  categorías C4:G8  →  área de influencia C12:F16
```

## Ejemplo: Restaurant-Bar, PM-L, transporte privado (entrada)

| Paso | Celda de Excel | Valor con superficie = 500 m² |
|---|---|---|
| Entrada web | `INPUTS PROYECTO!E16` | 500 |
| Lectura en la hoja | `Restaurant-Bar!C4` | 500 |
| Unidad de referencia | `Restaurant-Bar!L12` = `$C$4/100` | 5 |
| Tasa | `Restaurant-Bar!E8` | ver tabla de tasas |
| Flujo | `Restaurant-Bar!N8` = `$L$12*E8` | L12 × E8 |
| Bloque en RESULTADOS | `RESULTADOS IMIV!D340` (fila de entrada del bloque Restaurant-Bar) | igual al flujo |
| Entrada acumulada | `RESULTADOS IMIV!C21` | suma de 44 bloques |
| Total | `RESULTADOS IMIV!C35` = `ROUND(C21+C28,0)` | caso `E-04b` |
| Categoría | `RESULTADOS IMIV!E4` y `G4` | |

## Mapa por bloque (44 bloques en el orden de la suma de Excel)

| # | Bloque | Familia | Celdas de entrada (INPUTS PROYECTO) | Hoja(s) | RESULTADOS: filas entrada / salida |
|---|---|---|---|---|---|
| 1 | Departamentos | M2B viviendas por tramo | B9, B10 | Departamentos | 46–50 / 53–57 |
| 2 | Oficinas | M2A plantilla simple | K5 | Oficinas | 62–66 / 69–73 |
| 3 | Supermercados-LocalesComercials | M2D comercio por escala | E12, E13 | Supermercados-LocalesComercials | 78–82 / 85–89 |
| 4 | Establec. Educacionales | M2C educacionales | H20, H21, H22, H23, H24, H25, H26, H27 | 4 hojas Establec. Educacionales | 94–98 / 101–105 |
| 5 | Industrias | M2A plantilla simple | N5 | Industrias | 110–114 / 117–121 |
| 6 | Centros Comerciales | M2D comercio por escala | E8, E9 | Centros Comerciales | 126–130 / 133–137 |
| 7 | Salud Hospitales-Clínicas | M2A plantilla simple | H45 | Salud Hospitales-Clínicas | 142–146 / 149–153 |
| 8 | Hoteles | M2A plantilla simple | B22 | Hoteles | 158–162 / 165–169 |
| 9 | Casas | M2B viviendas por tramo | B6 | Casas | 174–178 / 181–185 |
| 10 | Otro Comercio (Vega) | M2D comercio por escala | E31, E32 | Otro Comercio (Vega) | 190–194 / 197–201 |
| 11 | Centros Médicos o Dentales | M2A plantilla simple | K8 | Centros Médicos o Dentales | 206–210 / 213–217 |
| 12 | Edificios de Estacionamientos | M2A plantilla simple | K14 | Edificios de Estacionamientos | 222–226 / 229–233 |
| 13 | Terminales TPUB con Pasajeros | M2A plantilla simple | Q5 | Terminales TPUB con Pasajeros | 238–242 / 245–249 |
| 14 | Bodegas Industriales | M2A plantilla simple | N8 | Bodegas Industriales | 255–259 / 262–266 |
| 15 | Residencial tipo SENAME | M2A plantilla simple | B13 | Residencial tipo SENAME | 272–276 / 279–283 |
| 16 | Residencial Estudiantes | M2A plantilla simple | B16 | Residencial Estudiantes | 289–293 / 296–300 |
| 17 | Residencial Adultos Mayores | M2A plantilla simple | B19 | Residencial Adultos Mayores | 306–310 / 313–317 |
| 18 | Equipamiento Científico | M2A plantilla simple | E5 | Equipamiento Científico | 323–327 / 330–334 |
| 19 | Restaurant-Bar | M2A plantilla simple | E16 | Restaurant-Bar | 340–344 / 347–351 |
| 20 | Estación de Servicio | M2A plantilla simple | E19 | Estación de Servicio | 357–361 / 364–368 |
| 21 | Centro Servicio Automotor | M2A plantilla simple | E22 | Centro Servicio Automotor | 374–378 / 381–385 |
| 22 | Culto Templo | M2A plantilla simple | E35 | Culto Templo | 391–395 / 398–402 |
| 23 | Centro Cultural - Museo | M2A plantilla simple | E38 | Centro Cultural - Museo | 408–412 / 415–419 |
| 24 | Auditorio | M2A plantilla simple | E41 | Auditorio | 425–429 / 432–436 |
| 25 | Otro Equipamiento Culto-Cultura | M2A plantilla simple | E44 | Otro Equipamiento Culto-Cultura | 442–446 / 449–453 |
| 26 | Estadio | M2A plantilla simple | H5 | Estadio | 459–463 / 466–470 |
| 27 | Centro Club Deportivo | M2A plantilla simple | H8 | Centro Club Deportivo | 476–480 / 483–487 |
| 28 | Gimnasio | M2A plantilla simple | H11 | Gimnasio | 493–497 / 500–504 |
| 29 | Multicancha | M2A plantilla simple | H14 | Multicancha | 510–514 / 517–521 |
| 30 | Otro Equipamiento Deportivo | M2A plantilla simple | H17 | Otro Equipamiento Deportivo | 527–531 / 534–538 |
| 31 | Entretenciones Zoológico | M2A plantilla simple | H30 | Entretenciones Zoológico | 544–548 / 551–555 |
| 32 | Casino | M2A plantilla simple | H33 | Casino | 561–565 / 568–572 |
| 33 | Otros Entretenciones | M2A plantilla simple | H36 | Otros Entretenciones | 578–582 / 585–589 |
| 34 | Salud Primaria SAPU | M2A plantilla simple | H39 | Salud Primaria SAPU | 595–599 / 602–606 |
| 35 | Salud Secundaria CRS | M2A plantilla simple | H42 | Salud Secundaria CRS | 612–616 / 619–623 |
| 36 | Cementerio Crematorio | M2A plantilla simple | H48 | Cementerio Crematorio | 629–633 / 636–640 |
| 37 | Servicios Artesanales | M2A plantilla simple | K11 | Servicios Artesanales | 646–650 / 653–657 |
| 38 | Club Social | M2A plantilla simple | K17 | Club Social | 663–667 / 670–674 |
| 39 | Talleres | M2A plantilla simple | N11 | Talleres | 680–684 / 687–691 |
| 40 | PRT | M2A plantilla simple | N14 | PRT | 697–701 / 704–708 |
| 41 | Relleno Sanitario | M2A plantilla simple | Q20 | Relleno Sanitario | 714–718 / 721–725 |
| 42 | Terminales TPUB sin Pasajeros | M2F terminal sin pasajeros | U5…; 16 habilitadas de 48 (U5:W10 y U14:Y19) | Terminales TPUB sin Pasajeros | 731–735 / 738–742 |
| 43 | Puertos | M2E puertos | Q12, Q13 | Puertos | 748–752 / 755–759 |
| 44 | Aeropuertos | M2A plantilla simple | Q17 | Aeropuertos | 765–769 / 772–776 |

## Campos de entrada (id web → celda)

| Campo web | Rótulo | Unidad | INPUTS PROYECTO | Lectura en la hoja | Estado |
|---|---|---|---|---|---|
| `residencial_tipo_sename.cantidad` | Residencial Sistema de Atención a la Niñez y Adolescencia · Habitaciones | hab. | B13 | Residencial tipo SENAME!C4 | habilitado |
| `residencial_estudiantes.cantidad` | Residencial estudiantes · Habitaciones | hab. | B16 | Residencial Estudiantes!C4 | habilitado |
| `residencial_adultos_mayores.cantidad` | Residencial adultos mayores · Habitaciones | hab. | B19 | Residencial Adultos Mayores!C4 | habilitado |
| `hoteles.cantidad` | Hospedaje (hoteles, apart hotel, etc.) · Habitaciones | hab. | B22 | Hoteles!C4 | habilitado |
| `equipamiento_cientifico.cantidad` | Equipamiento científico · Superficie edificada | m² | E5 | Equipamiento Científico!C4 | habilitado |
| `restaurant_bar.cantidad` | Restaurant - bar · Superficie | m² | E16 | Restaurant-Bar!C4 | habilitado |
| `estacion_de_servicio.cantidad` | Estación de servicio · Dispensadores | disp. | E19 | Estación de Servicio!C4 | habilitado |
| `centro_servicio_automotor.cantidad` | Centro de servicio automotor · Superficie | m² | E22 | Centro Servicio Automotor!C4 | habilitado |
| `culto_templo.cantidad` | Culto - templo · Superficie | m² | E35 | Culto Templo!C4 | habilitado |
| `centro_cultural_museo.cantidad` | Centro cultural · Superficie | m² | E38 | Centro Cultural - Museo!C4 | habilitado |
| `auditorio.cantidad` | Auditorio · Asientos | asientos | E41 | Auditorio!C4 | habilitado |
| `otro_equipamiento_culto_cultura.cantidad` | Otro equipamiento culto-cultura · Superficie total | m² | E44 | Otro Equipamiento Culto-Cultura!C4 | habilitado |
| `estadio.cantidad` | Estadio · Superficie total | m² | H5 | Estadio!C4 | habilitado |
| `centro_club_deportivo.cantidad` | Centro o club deportivo · Superficie total | m² | H8 | Centro Club Deportivo!C4 | habilitado |
| `gimnasio.cantidad` | Gimnasio · Superficie | m² | H11 | Gimnasio!C4 | habilitado |
| `multicancha.cantidad` | Multicancha · Superficie terreno | m² | H14 | Multicancha!C4 | habilitado |
| `otro_equipamiento_deportivo.cantidad` | Otro equipamiento deportivo · Superficie terreno | m² | H17 | Otro Equipamiento Deportivo!C4 | habilitado |
| `entretenciones_zoologico.cantidad` | Entretenimiento, juegos, zoológico · Superficie | m² | H30 | Entretenciones Zoológico!C4 | habilitado |
| `casino.cantidad` | Casino · Superficie | m² | H33 | Casino!C4 | habilitado |
| `otros_entretenciones.cantidad` | Otro entretenimiento · Superficie | m² | H36 | Otros Entretenciones!C4 | habilitado |
| `salud_primaria_sapu.cantidad` | Salud primaria (SAPU) · Superficie | m² | H39 | Salud Primaria SAPU!C4 | habilitado |
| `salud_secundaria_crs.cantidad` | Salud secundaria (CRS) · Superficie | m² | H42 | Salud Secundaria CRS!C4 | habilitado |
| `salud_hospitales_clinicas.cantidad` | Hospitales - clínicas · Superficie total | m² | H45 | Salud Hospitales-Clínicas!C4 | habilitado |
| `cementerio_crematorio.cantidad` | Cementerio - crematorio · Superficie | m² | H48 | Cementerio Crematorio!C4 | habilitado |
| `oficinas.cantidad` | Oficinas · Superficie total | m² | K5 | Oficinas!C4 | habilitado |
| `centros_medicos_o_dentales.cantidad` | Centros médicos o dentales · Superficie total | m² | K8 | Centros Médicos o Dentales!C4 | habilitado |
| `servicios_artesanales.cantidad` | Servicios artesanales · Superficie | m² | K11 | Servicios Artesanales!C4 | habilitado |
| `edificios_de_estacionamientos.cantidad` | Edificios o playas de estacionamientos · Estacionamientos | est. | K14 | Edificios de Estacionamientos!C4 | habilitado |
| `club_social.cantidad` | Club social · Superficie | m² | K17 | Club Social!C4 | habilitado |
| `industrias.cantidad` | Industrias · Superficie total | m² | N5 | Industrias!C4 | habilitado |
| `bodegas_industriales.cantidad` | Bodegas industriales · Superficie total | m² | N8 | Bodegas Industriales!C4 | habilitado |
| `talleres.cantidad` | Talleres · Superficie | m² | N11 | Talleres!C4 | habilitado |
| `prt.cantidad` | Planta de revisión técnica · Línea de revisión | líneas | N14 | PRT!C4 | habilitado |
| `terminales_tpub_con_pasajeros.cantidad` | Terminal de transporte público con pasajeros · Dársena (espacio 1 bus) | dársenas | Q5 | Terminales TPUB con Pasajeros!C4 | habilitado |
| `aeropuertos.cantidad` | Aeropuertos · Capacidad pasajeros | pax/h | Q17 | Aeropuertos!C4 | habilitado |
| `relleno_sanitario.cantidad` | Relleno sanitario · Superficie | m² | Q20 | Relleno Sanitario!C4 | habilitado |
| `casas.viviendas` | Casas · Cantidad de viviendas | viv. | B6 | Casas!C5 | habilitado |
| `departamentos.superficie_util` | Departamentos · Superficie útil total | m² | B9 | Departamentos!C4 (= B9 / B10) | habilitado |
| `departamentos.viviendas` | Departamentos · Cantidad de viviendas | viv. | B10 | Departamentos!C5 | habilitado |
| `educacionales.tipo1.codigo` | Establecimientos educacionales · Establecimiento 1: tipo | código | H20 | Establec. Educacionales Tipo1!C4 | habilitado |
| `educacionales.tipo1.estudiantes` | Establecimientos educacionales · Establecimiento 1: cantidad de estudiantes | estudiantes | H21 | Establec. Educacionales Tipo1!C5 | habilitado |
| `educacionales.tipo2.codigo` | Establecimientos educacionales · Establecimiento 2: tipo | código | H22 | Establec. Educacionales Tipo2!C4 | habilitado |
| `educacionales.tipo2.estudiantes` | Establecimientos educacionales · Establecimiento 2: cantidad de estudiantes | estudiantes | H23 | Establec. Educacionales Tipo2!C5 | habilitado |
| `educacionales.tipo3.codigo` | Establecimientos educacionales · Establecimiento 3: tipo | código | H24 | Establec. Educacionales Tip3!C4 | habilitado |
| `educacionales.tipo3.estudiantes` | Establecimientos educacionales · Establecimiento 3: cantidad de estudiantes | estudiantes | H25 | Establec. Educacionales Tip3!C5 | habilitado |
| `educacionales.tipo4.codigo` | Establecimientos educacionales · Establecimiento 4: tipo | código | H26 | Establec. Educacionales Tip 4!C4 | habilitado |
| `educacionales.tipo4.estudiantes` | Establecimientos educacionales · Establecimiento 4: cantidad de estudiantes | estudiantes | H27 | Establec. Educacionales Tip 4!C5 | habilitado |
| `centros_comerciales.superficie` | Centros comerciales - tienda por departamentos · Superficie | m² | E8 | Centros Comerciales!C4 | habilitado |
| `centros_comerciales.carga` | Centros comerciales - tienda por departamentos · Carga de ocupación | pax | E9 | Centros Comerciales!C5 | habilitado |
| `supermercados.superficie` | Supermercados - locales comerciales · Superficie | m² | E12 | Supermercados-LocalesComercials!C4 | habilitado |
| `supermercados.carga` | Supermercados - locales comerciales · Carga de ocupación | pax | E13 | Supermercados-LocalesComercials!C5 | habilitado |
| `vega.superficie` | Otro comercio (Vega) · Superficie | m² | E31 | Otro Comercio (Vega)!C4 | habilitado |
| `vega.carga` | Otro comercio (Vega) · Carga de ocupación | pax | E32 | Otro Comercio (Vega)!C5 | habilitado |
| `puertos.tipo` | Puertos · Tipo de puerto | código | Q12 | Puertos!C4 | habilitado |
| `puertos.capacidad` | Puertos · Capacidad de transferencia frente de atraque | TEU/h o t/h | Q13 | Puertos!C5 | habilitado |
| `terminal_sin_pasajeros.flota.1.A` | Terminal de buses sin pasajeros · Flota US1 · tipo A | buses | U5 | Terminales TPUB sin Pasajeros!C27 | habilitado |
| `terminal_sin_pasajeros.flota.1.B2` | Terminal de buses sin pasajeros · Flota US1 · tipo B2 | buses | V5 | Terminales TPUB sin Pasajeros!D27 | habilitado |
| `terminal_sin_pasajeros.flota.1.C2` | Terminal de buses sin pasajeros · Flota US1 · tipo C2 | buses | W5 | Terminales TPUB sin Pasajeros!E27 | habilitado |
| `terminal_sin_pasajeros.flota.2.A` | Terminal de buses sin pasajeros · Flota US2 · tipo A | buses | U6 | Terminales TPUB sin Pasajeros!C28 | habilitado |
| `terminal_sin_pasajeros.flota.2.B2` | Terminal de buses sin pasajeros · Flota US2 · tipo B2 | buses | V6 | Terminales TPUB sin Pasajeros!D28 | habilitado |
| `terminal_sin_pasajeros.flota.2.C2` | Terminal de buses sin pasajeros · Flota US2 · tipo C2 | buses | W6 | Terminales TPUB sin Pasajeros!E28 | habilitado |
| `terminal_sin_pasajeros.flota.3.A` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo A | buses | U7 | Terminales TPUB sin Pasajeros!C29 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.3.B2` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo B2 | buses | V7 | Terminales TPUB sin Pasajeros!D29 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.3.C2` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo C2 | buses | W7 | Terminales TPUB sin Pasajeros!E29 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.4.A` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo A | buses | U8 | Terminales TPUB sin Pasajeros!C30 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.4.B2` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo B2 | buses | V8 | Terminales TPUB sin Pasajeros!D30 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.4.C2` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo C2 | buses | W8 | Terminales TPUB sin Pasajeros!E30 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.5.A` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo A | buses | U9 | Terminales TPUB sin Pasajeros!C31 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.5.B2` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo B2 | buses | V9 | Terminales TPUB sin Pasajeros!D31 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.5.C2` | Terminal de buses sin pasajeros · Flota US1 (fila duplicada) · tipo C2 | buses | W9 | Terminales TPUB sin Pasajeros!E31 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.6.A` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo A | buses | U10 | Terminales TPUB sin Pasajeros!C32 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.6.B2` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo B2 | buses | V10 | Terminales TPUB sin Pasajeros!D32 | deshabilitado (D2) |
| `terminal_sin_pasajeros.flota.6.C2` | Terminal de buses sin pasajeros · Flota US2 (fila duplicada) · tipo C2 | buses | W10 | Terminales TPUB sin Pasajeros!E32 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us1.PM-L` | Terminal de buses sin pasajeros · Frecuencia US1 · PM-L | buses/h | U14 | Terminales TPUB sin Pasajeros!C37 | habilitado |
| `terminal_sin_pasajeros.frec.us1.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US1 · PMD-L | buses/h | V14 | Terminales TPUB sin Pasajeros!D37 | habilitado |
| `terminal_sin_pasajeros.frec.us1.PT-L` | Terminal de buses sin pasajeros · Frecuencia US1 · PT-L | buses/h | W14 | Terminales TPUB sin Pasajeros!E37 | habilitado |
| `terminal_sin_pasajeros.frec.us1.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US1 · PMD-F | buses/h | X14 | Terminales TPUB sin Pasajeros!F37 | habilitado |
| `terminal_sin_pasajeros.frec.us1.PT-F` | Terminal de buses sin pasajeros · Frecuencia US1 · PT-F | buses/h | Y14 | Terminales TPUB sin Pasajeros!G37 | habilitado |
| `terminal_sin_pasajeros.frec.us2.PM-L` | Terminal de buses sin pasajeros · Frecuencia US2 · PM-L | buses/h | U15 | Terminales TPUB sin Pasajeros!C38 | habilitado |
| `terminal_sin_pasajeros.frec.us2.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US2 · PMD-L | buses/h | V15 | Terminales TPUB sin Pasajeros!D38 | habilitado |
| `terminal_sin_pasajeros.frec.us2.PT-L` | Terminal de buses sin pasajeros · Frecuencia US2 · PT-L | buses/h | W15 | Terminales TPUB sin Pasajeros!E38 | habilitado |
| `terminal_sin_pasajeros.frec.us2.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US2 · PMD-F | buses/h | X15 | Terminales TPUB sin Pasajeros!F38 | habilitado |
| `terminal_sin_pasajeros.frec.us2.PT-F` | Terminal de buses sin pasajeros · Frecuencia US2 · PT-F | buses/h | Y15 | Terminales TPUB sin Pasajeros!G38 | habilitado |
| `terminal_sin_pasajeros.frec.us3.PM-L` | Terminal de buses sin pasajeros · Frecuencia US3 · PM-L | buses/h | U16 | Terminales TPUB sin Pasajeros!C39 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us3.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US3 · PMD-L | buses/h | V16 | Terminales TPUB sin Pasajeros!D39 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us3.PT-L` | Terminal de buses sin pasajeros · Frecuencia US3 · PT-L | buses/h | W16 | Terminales TPUB sin Pasajeros!E39 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us3.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US3 · PMD-F | buses/h | X16 | Terminales TPUB sin Pasajeros!F39 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us3.PT-F` | Terminal de buses sin pasajeros · Frecuencia US3 · PT-F | buses/h | Y16 | Terminales TPUB sin Pasajeros!G39 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us4.PM-L` | Terminal de buses sin pasajeros · Frecuencia US4 · PM-L | buses/h | U17 | Terminales TPUB sin Pasajeros!C40 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us4.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US4 · PMD-L | buses/h | V17 | Terminales TPUB sin Pasajeros!D40 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us4.PT-L` | Terminal de buses sin pasajeros · Frecuencia US4 · PT-L | buses/h | W17 | Terminales TPUB sin Pasajeros!E40 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us4.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US4 · PMD-F | buses/h | X17 | Terminales TPUB sin Pasajeros!F40 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us4.PT-F` | Terminal de buses sin pasajeros · Frecuencia US4 · PT-F | buses/h | Y17 | Terminales TPUB sin Pasajeros!G40 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us5.PM-L` | Terminal de buses sin pasajeros · Frecuencia US5 · PM-L | buses/h | U18 | Terminales TPUB sin Pasajeros!C41 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us5.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US5 · PMD-L | buses/h | V18 | Terminales TPUB sin Pasajeros!D41 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us5.PT-L` | Terminal de buses sin pasajeros · Frecuencia US5 · PT-L | buses/h | W18 | Terminales TPUB sin Pasajeros!E41 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us5.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US5 · PMD-F | buses/h | X18 | Terminales TPUB sin Pasajeros!F41 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us5.PT-F` | Terminal de buses sin pasajeros · Frecuencia US5 · PT-F | buses/h | Y18 | Terminales TPUB sin Pasajeros!G41 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us6.PM-L` | Terminal de buses sin pasajeros · Frecuencia US6 · PM-L | buses/h | U19 | Terminales TPUB sin Pasajeros!C42 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us6.PMD-L` | Terminal de buses sin pasajeros · Frecuencia US6 · PMD-L | buses/h | V19 | Terminales TPUB sin Pasajeros!D42 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us6.PT-L` | Terminal de buses sin pasajeros · Frecuencia US6 · PT-L | buses/h | W19 | Terminales TPUB sin Pasajeros!E42 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us6.PMD-F` | Terminal de buses sin pasajeros · Frecuencia US6 · PMD-F | buses/h | X19 | Terminales TPUB sin Pasajeros!F42 | deshabilitado (D2) |
| `terminal_sin_pasajeros.frec.us6.PT-F` | Terminal de buses sin pasajeros · Frecuencia US6 · PT-F | buses/h | Y19 | Terminales TPUB sin Pasajeros!G42 | deshabilitado (D2) |

## Celdas de Excel que no tienen campo en la web

`INPUTS PROYECTO!B5` (fórmula `=61*B6`, parámetro interno por D1), `B7`, `P8`, `P9` (sin dependientes) y `RESULTADOS IMIV!K22` (sin dependientes).
