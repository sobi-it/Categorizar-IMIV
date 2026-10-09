/* Generado desde P001_FLUJOS_IMIV_IT_V4.0.xlsx por script (no editar a mano). */
(function(r){'use strict';r.IMIV=r.IMIV||{};r.IMIV.model=Object.assign(r.IMIV.model||{},{
 "version": "1.0.0",
 "source": "P001_FLUJOS_IMIV_IT_V4.0.xlsx",
 "periods": [
  {
   "id": "PM-L",
   "excel": "PM-L"
  },
  {
   "id": "PMD-L",
   "excel": "PMD-L (INPUTS: PMd-L)"
  },
  {
   "id": "PT-L",
   "excel": "PT-L"
  },
  {
   "id": "PMD-F",
   "excel": "PMD-F (INPUTS: PMd-F)"
  },
  {
   "id": "PT-F",
   "excel": "PT-F"
  }
 ],
 "modes": [
  {
   "id": "priv",
   "label": "Transporte privado",
   "short": "Privado",
   "unit": "veh/h"
  },
  {
   "id": "pub",
   "label": "Transporte público",
   "short": "T. público",
   "unit": "viajes/h"
  },
  {
   "id": "peat",
   "label": "Peatones",
   "short": "Peatones",
   "unit": "viajes/h"
  },
  {
   "id": "cic",
   "label": "Ciclos",
   "short": "Ciclos",
   "unit": "viajes/h"
  }
 ],
 "constants": {
  "CASAS_SUP_UTIL_M2_POR_VIVIENDA": {
   "value": 61,
   "source": "INPUTS PROYECTO!B5 = 61*B6"
  }
 },
 "thresholds": {
  "catPriv": {
   "lo": 20,
   "mid": 80,
   "hi": 250,
   "cells": "RESULTADOS IMIV!E4:E8"
  },
  "catOtros": {
   "lo": 40,
   "mid": 160,
   "hi": 500,
   "cells": "RESULTADOS IMIV!F4:F8"
  },
  "aiPriv": {
   "edges": [
    80,
    120,
    180,
    250,
    400,
    550,
    750,
    1000
   ],
   "values": [
    2,
    3,
    4,
    5,
    6,
    7,
    8
   ],
   "over": "Art 3.2.2.",
   "cells": "RESULTADOS IMIV!E12:E16"
  },
  "aiOtros": {
   "edges": [
    160,
    500,
    2000
   ],
   "values": [
    3,
    6,
    8
   ],
   "cells": "RESULTADOS IMIV!F12:F16"
  }
 },
 "blocks": [
  {
   "order": 1,
   "id": "departamentos",
   "sheet": "Departamentos",
   "family": "viviendas",
   "entRow": 46,
   "salRow": 53,
   "resultCols": "D:G"
  },
  {
   "order": 2,
   "id": "oficinas",
   "sheet": "Oficinas",
   "family": "template",
   "entRow": 62,
   "salRow": 69,
   "resultCols": "D:G"
  },
  {
   "order": 3,
   "id": "supermercados",
   "sheet": "Supermercados-LocalesComercials",
   "family": "commerce",
   "entRow": 78,
   "salRow": 85,
   "resultCols": "D:G"
  },
  {
   "order": 4,
   "id": "educacionales",
   "sheet": "Establec. Educacionales",
   "family": "education",
   "entRow": 94,
   "salRow": 101,
   "resultCols": "D:G"
  },
  {
   "order": 5,
   "id": "industrias",
   "sheet": "Industrias",
   "family": "template",
   "entRow": 110,
   "salRow": 117,
   "resultCols": "D:G"
  },
  {
   "order": 6,
   "id": "centros_comerciales",
   "sheet": "Centros Comerciales",
   "family": "commerce",
   "entRow": 126,
   "salRow": 133,
   "resultCols": "D:G"
  },
  {
   "order": 7,
   "id": "salud_hospitales_clinicas",
   "sheet": "Salud Hospitales-Clínicas",
   "family": "template",
   "entRow": 142,
   "salRow": 149,
   "resultCols": "D:G"
  },
  {
   "order": 8,
   "id": "hoteles",
   "sheet": "Hoteles",
   "family": "template",
   "entRow": 158,
   "salRow": 165,
   "resultCols": "D:G"
  },
  {
   "order": 9,
   "id": "casas",
   "sheet": "Casas",
   "family": "viviendas",
   "entRow": 174,
   "salRow": 181,
   "resultCols": "D:G"
  },
  {
   "order": 10,
   "id": "vega",
   "sheet": "Otro Comercio (Vega)",
   "family": "commerce",
   "entRow": 190,
   "salRow": 197,
   "resultCols": "D:G"
  },
  {
   "order": 11,
   "id": "centros_medicos_o_dentales",
   "sheet": "Centros Médicos o Dentales",
   "family": "template",
   "entRow": 206,
   "salRow": 213,
   "resultCols": "D:G"
  },
  {
   "order": 12,
   "id": "edificios_de_estacionamientos",
   "sheet": "Edificios de Estacionamientos",
   "family": "template",
   "entRow": 222,
   "salRow": 229,
   "resultCols": "D:G"
  },
  {
   "order": 13,
   "id": "terminales_tpub_con_pasajeros",
   "sheet": "Terminales TPUB con Pasajeros",
   "family": "template",
   "entRow": 238,
   "salRow": 245,
   "resultCols": "D:G"
  },
  {
   "order": 14,
   "id": "bodegas_industriales",
   "sheet": "Bodegas Industriales",
   "family": "template",
   "entRow": 255,
   "salRow": 262,
   "resultCols": "D:G"
  },
  {
   "order": 15,
   "id": "residencial_tipo_sename",
   "sheet": "Residencial tipo SENAME",
   "family": "template",
   "entRow": 272,
   "salRow": 279,
   "resultCols": "D:G"
  },
  {
   "order": 16,
   "id": "residencial_estudiantes",
   "sheet": "Residencial Estudiantes",
   "family": "template",
   "entRow": 289,
   "salRow": 296,
   "resultCols": "D:G"
  },
  {
   "order": 17,
   "id": "residencial_adultos_mayores",
   "sheet": "Residencial Adultos Mayores",
   "family": "template",
   "entRow": 306,
   "salRow": 313,
   "resultCols": "D:G"
  },
  {
   "order": 18,
   "id": "equipamiento_cientifico",
   "sheet": "Equipamiento Científico",
   "family": "template",
   "entRow": 323,
   "salRow": 330,
   "resultCols": "D:G"
  },
  {
   "order": 19,
   "id": "restaurant_bar",
   "sheet": "Restaurant-Bar",
   "family": "template",
   "entRow": 340,
   "salRow": 347,
   "resultCols": "D:G"
  },
  {
   "order": 20,
   "id": "estacion_de_servicio",
   "sheet": "Estación de Servicio",
   "family": "template",
   "entRow": 357,
   "salRow": 364,
   "resultCols": "D:G"
  },
  {
   "order": 21,
   "id": "centro_servicio_automotor",
   "sheet": "Centro Servicio Automotor",
   "family": "template",
   "entRow": 374,
   "salRow": 381,
   "resultCols": "D:G"
  },
  {
   "order": 22,
   "id": "culto_templo",
   "sheet": "Culto Templo",
   "family": "template",
   "entRow": 391,
   "salRow": 398,
   "resultCols": "D:G"
  },
  {
   "order": 23,
   "id": "centro_cultural_museo",
   "sheet": "Centro Cultural - Museo",
   "family": "template",
   "entRow": 408,
   "salRow": 415,
   "resultCols": "D:G"
  },
  {
   "order": 24,
   "id": "auditorio",
   "sheet": "Auditorio",
   "family": "template",
   "entRow": 425,
   "salRow": 432,
   "resultCols": "D:G"
  },
  {
   "order": 25,
   "id": "otro_equipamiento_culto_cultura",
   "sheet": "Otro Equipamiento Culto-Cultura",
   "family": "template",
   "entRow": 442,
   "salRow": 449,
   "resultCols": "D:G"
  },
  {
   "order": 26,
   "id": "estadio",
   "sheet": "Estadio",
   "family": "template",
   "entRow": 459,
   "salRow": 466,
   "resultCols": "D:G"
  },
  {
   "order": 27,
   "id": "centro_club_deportivo",
   "sheet": "Centro Club Deportivo",
   "family": "template",
   "entRow": 476,
   "salRow": 483,
   "resultCols": "D:G"
  },
  {
   "order": 28,
   "id": "gimnasio",
   "sheet": "Gimnasio",
   "family": "template",
   "entRow": 493,
   "salRow": 500,
   "resultCols": "D:G"
  },
  {
   "order": 29,
   "id": "multicancha",
   "sheet": "Multicancha",
   "family": "template",
   "entRow": 510,
   "salRow": 517,
   "resultCols": "D:G"
  },
  {
   "order": 30,
   "id": "otro_equipamiento_deportivo",
   "sheet": "Otro Equipamiento Deportivo",
   "family": "template",
   "entRow": 527,
   "salRow": 534,
   "resultCols": "D:G"
  },
  {
   "order": 31,
   "id": "entretenciones_zoologico",
   "sheet": "Entretenciones Zoológico",
   "family": "template",
   "entRow": 544,
   "salRow": 551,
   "resultCols": "D:G"
  },
  {
   "order": 32,
   "id": "casino",
   "sheet": "Casino",
   "family": "template",
   "entRow": 561,
   "salRow": 568,
   "resultCols": "D:G"
  },
  {
   "order": 33,
   "id": "otros_entretenciones",
   "sheet": "Otros Entretenciones",
   "family": "template",
   "entRow": 578,
   "salRow": 585,
   "resultCols": "D:G"
  },
  {
   "order": 34,
   "id": "salud_primaria_sapu",
   "sheet": "Salud Primaria SAPU",
   "family": "template",
   "entRow": 595,
   "salRow": 602,
   "resultCols": "D:G"
  },
  {
   "order": 35,
   "id": "salud_secundaria_crs",
   "sheet": "Salud Secundaria CRS",
   "family": "template",
   "entRow": 612,
   "salRow": 619,
   "resultCols": "D:G"
  },
  {
   "order": 36,
   "id": "cementerio_crematorio",
   "sheet": "Cementerio Crematorio",
   "family": "template",
   "entRow": 629,
   "salRow": 636,
   "resultCols": "D:G"
  },
  {
   "order": 37,
   "id": "servicios_artesanales",
   "sheet": "Servicios Artesanales",
   "family": "template",
   "entRow": 646,
   "salRow": 653,
   "resultCols": "D:G"
  },
  {
   "order": 38,
   "id": "club_social",
   "sheet": "Club Social",
   "family": "template",
   "entRow": 663,
   "salRow": 670,
   "resultCols": "D:G"
  },
  {
   "order": 39,
   "id": "talleres",
   "sheet": "Talleres",
   "family": "template",
   "entRow": 680,
   "salRow": 687,
   "resultCols": "D:G"
  },
  {
   "order": 40,
   "id": "prt",
   "sheet": "PRT",
   "family": "template",
   "entRow": 697,
   "salRow": 704,
   "resultCols": "D:G"
  },
  {
   "order": 41,
   "id": "relleno_sanitario",
   "sheet": "Relleno Sanitario",
   "family": "template",
   "entRow": 714,
   "salRow": 721,
   "resultCols": "D:G"
  },
  {
   "order": 42,
   "id": "terminal_sin_pasajeros",
   "sheet": "Terminales TPUB sin Pasajeros",
   "family": "terminal",
   "entRow": 731,
   "salRow": 738,
   "resultCols": "D:G"
  },
  {
   "order": 43,
   "id": "puertos",
   "sheet": "Puertos",
   "family": "ports",
   "entRow": 748,
   "salRow": 755,
   "resultCols": "D:G"
  },
  {
   "order": 44,
   "id": "aeropuertos",
   "sheet": "Aeropuertos",
   "family": "template",
   "entRow": 765,
   "salRow": 772,
   "resultCols": "D:G"
  }
 ],
 "templates": {
  "residencial_tipo_sename": {
   "sheet": "Residencial tipo SENAME",
   "inputId": "residencial_tipo_sename.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Residencial Sistema de Atención a la Niñez y Adolescencia",
   "unit": "hab.",
   "fieldLabel": "Habitaciones",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "residencial_estudiantes": {
   "sheet": "Residencial Estudiantes",
   "inputId": "residencial_estudiantes.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Residencial estudiantes",
   "unit": "hab.",
   "fieldLabel": "Habitaciones",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "residencial_adultos_mayores": {
   "sheet": "Residencial Adultos Mayores",
   "inputId": "residencial_adultos_mayores.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Residencial adultos mayores",
   "unit": "hab.",
   "fieldLabel": "Habitaciones",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "hoteles": {
   "sheet": "Hoteles",
   "inputId": "hoteles.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Hospedaje (hoteles, apart hotel, etc.)",
   "unit": "hab.",
   "fieldLabel": "Habitaciones",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "equipamiento_cientifico": {
   "sheet": "Equipamiento Científico",
   "inputId": "equipamiento_cientifico.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Equipamiento científico",
   "unit": "m²",
   "fieldLabel": "Superficie edificada",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "restaurant_bar": {
   "sheet": "Restaurant-Bar",
   "inputId": "restaurant_bar.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Restaurant - bar",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "estacion_de_servicio": {
   "sheet": "Estación de Servicio",
   "inputId": "estacion_de_servicio.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Estación de servicio",
   "unit": "disp.",
   "fieldLabel": "Dispensadores",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "centro_servicio_automotor": {
   "sheet": "Centro Servicio Automotor",
   "inputId": "centro_servicio_automotor.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Centro de servicio automotor",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "culto_templo": {
   "sheet": "Culto Templo",
   "inputId": "culto_templo.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Culto - templo",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "centro_cultural_museo": {
   "sheet": "Centro Cultural - Museo",
   "inputId": "centro_cultural_museo.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Centro cultural",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "auditorio": {
   "sheet": "Auditorio",
   "inputId": "auditorio.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Auditorio",
   "unit": "asientos",
   "fieldLabel": "Asientos",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "otro_equipamiento_culto_cultura": {
   "sheet": "Otro Equipamiento Culto-Cultura",
   "inputId": "otro_equipamiento_culto_cultura.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Otro equipamiento culto-cultura",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "estadio": {
   "sheet": "Estadio",
   "inputId": "estadio.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Estadio",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "centro_club_deportivo": {
   "sheet": "Centro Club Deportivo",
   "inputId": "centro_club_deportivo.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Centro o club deportivo",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "gimnasio": {
   "sheet": "Gimnasio",
   "inputId": "gimnasio.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Gimnasio",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "multicancha": {
   "sheet": "Multicancha",
   "inputId": "multicancha.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Multicancha",
   "unit": "m²",
   "fieldLabel": "Superficie terreno",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "otro_equipamiento_deportivo": {
   "sheet": "Otro Equipamiento Deportivo",
   "inputId": "otro_equipamiento_deportivo.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Otro equipamiento deportivo",
   "unit": "m²",
   "fieldLabel": "Superficie terreno",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "entretenciones_zoologico": {
   "sheet": "Entretenciones Zoológico",
   "inputId": "entretenciones_zoologico.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Entretenimiento, juegos, zoológico",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "casino": {
   "sheet": "Casino",
   "inputId": "casino.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Casino",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "otros_entretenciones": {
   "sheet": "Otros Entretenciones",
   "inputId": "otros_entretenciones.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Otro entretenimiento",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "salud_primaria_sapu": {
   "sheet": "Salud Primaria SAPU",
   "inputId": "salud_primaria_sapu.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Salud primaria (SAPU)",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "salud_secundaria_crs": {
   "sheet": "Salud Secundaria CRS",
   "inputId": "salud_secundaria_crs.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Salud secundaria (CRS)",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "salud_hospitales_clinicas": {
   "sheet": "Salud Hospitales-Clínicas",
   "inputId": "salud_hospitales_clinicas.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Hospitales - clínicas",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "cementerio_crematorio": {
   "sheet": "Cementerio Crematorio",
   "inputId": "cementerio_crematorio.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Cementerio - crematorio",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "oficinas": {
   "sheet": "Oficinas",
   "inputId": "oficinas.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Oficinas",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "centros_medicos_o_dentales": {
   "sheet": "Centros Médicos o Dentales",
   "inputId": "centros_medicos_o_dentales.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Centros médicos o dentales",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "servicios_artesanales": {
   "sheet": "Servicios Artesanales",
   "inputId": "servicios_artesanales.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Servicios artesanales",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "edificios_de_estacionamientos": {
   "sheet": "Edificios de Estacionamientos",
   "inputId": "edificios_de_estacionamientos.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Edificios o playas de estacionamientos",
   "unit": "est.",
   "fieldLabel": "Estacionamientos",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "club_social": {
   "sheet": "Club Social",
   "inputId": "club_social.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Club social",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "industrias": {
   "sheet": "Industrias",
   "inputId": "industrias.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Industrias",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "bodegas_industriales": {
   "sheet": "Bodegas Industriales",
   "inputId": "bodegas_industriales.cantidad",
   "divisor": "C4/100",
   "factorPriv": 2.5,
   "name": "Bodegas industriales",
   "unit": "m²",
   "fieldLabel": "Superficie total",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "talleres": {
   "sheet": "Talleres",
   "inputId": "talleres.cantidad",
   "divisor": "C4/100",
   "factorPriv": 1,
   "name": "Talleres",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "prt": {
   "sheet": "PRT",
   "inputId": "prt.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Planta de revisión técnica",
   "unit": "líneas",
   "fieldLabel": "Línea de revisión",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "terminales_tpub_con_pasajeros": {
   "sheet": "Terminales TPUB con Pasajeros",
   "inputId": "terminales_tpub_con_pasajeros.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Terminal de transporte público con pasajeros",
   "unit": "dársenas",
   "fieldLabel": "Dársena (espacio 1 bus)",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "aeropuertos": {
   "sheet": "Aeropuertos",
   "inputId": "aeropuertos.cantidad",
   "divisor": "C4",
   "factorPriv": 1,
   "name": "Aeropuertos",
   "unit": "pax/h",
   "fieldLabel": "Capacidad pasajeros",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  },
  "relleno_sanitario": {
   "sheet": "Relleno Sanitario",
   "inputId": "relleno_sanitario.cantidad",
   "divisor": "C4/100",
   "factorPriv": 2.5,
   "name": "Relleno sanitario",
   "unit": "m²",
   "fieldLabel": "Superficie",
   "unitCells": {
    "ent": "L12",
    "sal": "L19"
   },
   "flowCells": {
    "ent": "N8:Q12",
    "sal": "N15:Q19"
   }
  }
 },
 "cellToId": {
  "B13": "residencial_tipo_sename.cantidad",
  "B16": "residencial_estudiantes.cantidad",
  "B19": "residencial_adultos_mayores.cantidad",
  "B22": "hoteles.cantidad",
  "E5": "equipamiento_cientifico.cantidad",
  "E16": "restaurant_bar.cantidad",
  "E19": "estacion_de_servicio.cantidad",
  "E22": "centro_servicio_automotor.cantidad",
  "E35": "culto_templo.cantidad",
  "E38": "centro_cultural_museo.cantidad",
  "E41": "auditorio.cantidad",
  "E44": "otro_equipamiento_culto_cultura.cantidad",
  "H5": "estadio.cantidad",
  "H8": "centro_club_deportivo.cantidad",
  "H11": "gimnasio.cantidad",
  "H14": "multicancha.cantidad",
  "H17": "otro_equipamiento_deportivo.cantidad",
  "H30": "entretenciones_zoologico.cantidad",
  "H33": "casino.cantidad",
  "H36": "otros_entretenciones.cantidad",
  "H39": "salud_primaria_sapu.cantidad",
  "H42": "salud_secundaria_crs.cantidad",
  "H45": "salud_hospitales_clinicas.cantidad",
  "H48": "cementerio_crematorio.cantidad",
  "K5": "oficinas.cantidad",
  "K8": "centros_medicos_o_dentales.cantidad",
  "K11": "servicios_artesanales.cantidad",
  "K14": "edificios_de_estacionamientos.cantidad",
  "K17": "club_social.cantidad",
  "N5": "industrias.cantidad",
  "N8": "bodegas_industriales.cantidad",
  "N11": "talleres.cantidad",
  "N14": "prt.cantidad",
  "Q5": "terminales_tpub_con_pasajeros.cantidad",
  "Q17": "aeropuertos.cantidad",
  "Q20": "relleno_sanitario.cantidad",
  "B6": "casas.viviendas",
  "B9": "departamentos.superficie_util",
  "B10": "departamentos.viviendas",
  "H20": "educacionales.tipo1.codigo",
  "H21": "educacionales.tipo1.estudiantes",
  "H22": "educacionales.tipo2.codigo",
  "H23": "educacionales.tipo2.estudiantes",
  "H24": "educacionales.tipo3.codigo",
  "H25": "educacionales.tipo3.estudiantes",
  "H26": "educacionales.tipo4.codigo",
  "H27": "educacionales.tipo4.estudiantes",
  "E8": "centros_comerciales.superficie",
  "E9": "centros_comerciales.carga",
  "E12": "supermercados.superficie",
  "E13": "supermercados.carga",
  "E31": "vega.superficie",
  "E32": "vega.carga",
  "Q12": "puertos.tipo",
  "Q13": "puertos.capacidad",
  "U5": "terminal_sin_pasajeros.flota.1.A",
  "V5": "terminal_sin_pasajeros.flota.1.B2",
  "W5": "terminal_sin_pasajeros.flota.1.C2",
  "U6": "terminal_sin_pasajeros.flota.2.A",
  "V6": "terminal_sin_pasajeros.flota.2.B2",
  "W6": "terminal_sin_pasajeros.flota.2.C2",
  "U7": "terminal_sin_pasajeros.flota.3.A",
  "V7": "terminal_sin_pasajeros.flota.3.B2",
  "W7": "terminal_sin_pasajeros.flota.3.C2",
  "U8": "terminal_sin_pasajeros.flota.4.A",
  "V8": "terminal_sin_pasajeros.flota.4.B2",
  "W8": "terminal_sin_pasajeros.flota.4.C2",
  "U9": "terminal_sin_pasajeros.flota.5.A",
  "V9": "terminal_sin_pasajeros.flota.5.B2",
  "W9": "terminal_sin_pasajeros.flota.5.C2",
  "U10": "terminal_sin_pasajeros.flota.6.A",
  "V10": "terminal_sin_pasajeros.flota.6.B2",
  "W10": "terminal_sin_pasajeros.flota.6.C2",
  "U14": "terminal_sin_pasajeros.frec.us1.PM-L",
  "V14": "terminal_sin_pasajeros.frec.us1.PMD-L",
  "W14": "terminal_sin_pasajeros.frec.us1.PT-L",
  "X14": "terminal_sin_pasajeros.frec.us1.PMD-F",
  "Y14": "terminal_sin_pasajeros.frec.us1.PT-F",
  "U15": "terminal_sin_pasajeros.frec.us2.PM-L",
  "V15": "terminal_sin_pasajeros.frec.us2.PMD-L",
  "W15": "terminal_sin_pasajeros.frec.us2.PT-L",
  "X15": "terminal_sin_pasajeros.frec.us2.PMD-F",
  "Y15": "terminal_sin_pasajeros.frec.us2.PT-F",
  "U16": "terminal_sin_pasajeros.frec.us3.PM-L",
  "V16": "terminal_sin_pasajeros.frec.us3.PMD-L",
  "W16": "terminal_sin_pasajeros.frec.us3.PT-L",
  "X16": "terminal_sin_pasajeros.frec.us3.PMD-F",
  "Y16": "terminal_sin_pasajeros.frec.us3.PT-F",
  "U17": "terminal_sin_pasajeros.frec.us4.PM-L",
  "V17": "terminal_sin_pasajeros.frec.us4.PMD-L",
  "W17": "terminal_sin_pasajeros.frec.us4.PT-L",
  "X17": "terminal_sin_pasajeros.frec.us4.PMD-F",
  "Y17": "terminal_sin_pasajeros.frec.us4.PT-F",
  "U18": "terminal_sin_pasajeros.frec.us5.PM-L",
  "V18": "terminal_sin_pasajeros.frec.us5.PMD-L",
  "W18": "terminal_sin_pasajeros.frec.us5.PT-L",
  "X18": "terminal_sin_pasajeros.frec.us5.PMD-F",
  "Y18": "terminal_sin_pasajeros.frec.us5.PT-F",
  "U19": "terminal_sin_pasajeros.frec.us6.PM-L",
  "V19": "terminal_sin_pasajeros.frec.us6.PMD-L",
  "W19": "terminal_sin_pasajeros.frec.us6.PT-L",
  "X19": "terminal_sin_pasajeros.frec.us6.PMD-F",
  "Y19": "terminal_sin_pasajeros.frec.us6.PT-F"
 },
 "resultCells": {
  "ent": "C21:F25",
  "sal": "C28:F32",
  "tot": "C35:F39",
  "cat": "C4:G8",
  "ai": "C12:F16"
 },
 "notes": {
  "casas": "Para esta versión, la superficie útil de casas se calcula como 61 m² por vivienda, reproduciendo la fórmula original del Excel.",
  "art322": "El libro original no implementa el desglose de intersecciones posteriores. El resultado se conserva como referencia al Art. 3.2.2.",
  "us36": "US3–US6 no se encuentran correctamente definidos en el libro Excel original y quedan pendientes de confirmación. No se incluyen en el cálculo de esta versión.",
  "escalas": "Los límites de escala de esta versión reproducen el Excel y aún no han sido armonizados con la normativa.",
  "sinEscala": "Sin escala aplicable según la lógica actual del Excel."
 },
 "exceptions": [
  {
   "id": "EX-01",
   "module": "M2B",
   "sheet": "INPUTS PROYECTO",
   "cell": "B5",
   "excel": "B5 = 61*B6: superficie útil de Casas = 61 m² por vivienda; Casas!C4 = IF(C5=0,0,B5/B6).",
   "web": "61 es parámetro interno (model.js › constants.CASAS_SUP_UTIL_M2_POR_VIVIENDA). No hay campo editable de superficie para Casas; se muestra la nota técnica de D1. C4 se calcula con la misma operación (61*B6)/B6.",
   "reason": "Decisión D1 (replicar la lógica actual).",
   "status": "implementado"
  },
  {
   "id": "EX-02",
   "module": "M2B",
   "sheet": "Casas",
   "cell": "H10:H85",
   "excel": "Con C4 = 61 sólo el tramo 60 < SP ≤ 140 m² se activa; los demás tramos existen pero quedan con dummy 0.",
   "web": "Se conservan los 5 tramos y sus dummies en el motor y en la tabla de tasas; sólo el tramo 3 puede activarse en la web.",
   "reason": "Consecuencia de EX-01.",
   "status": "implementado"
  },
  {
   "id": "EX-03",
   "module": "M2B",
   "sheet": "Departamentos",
   "cell": "C4",
   "excel": "C4 = IF(C5=0,0,B9/B10). Con B10>0 y B9=0, C4=0 y se activa el tramo ≤50 m² (flujo ≠ 0). Con B10=0 el flujo es 0.",
   "web": "Mismo cálculo. Se muestra advertencia no bloqueante cuando B10>0 y B9=0.",
   "reason": "Comportamiento original; se avisa para evitar un error de digitación silencioso.",
   "status": "implementado"
  },
  {
   "id": "EX-04",
   "module": "M2B",
   "sheet": "Casas / Departamentos",
   "cell": "H10:H85; M10:P21",
   "excel": "Las 5 dummies de tramo se evalúan siempre, y las tasas de todos los tramos se calculan aunque su dummy sea 0.",
   "web": "Igual: se calculan las 5 tablas y se suma tasa×dummy en el mismo orden de términos.",
   "reason": "Equivalencia aritmética.",
   "status": "implementado"
  },
  {
   "id": "EX-05",
   "module": "M1",
   "sheet": "Casas / Departamentos",
   "cell": "C26:C85 (fórmulas)",
   "excel": "Tasas con constantes dentro de la fórmula: =1+0.02*($C$4-50), =1.2+0.01*($C$4-60), =2+0.005*($C$4-140), =0.2*$C$28, =+$C26*0.4, etc.",
   "web": "Constantes extraídas a data/rates.js (a, b, x0, factor 0,2 y reparto modal) con su celda de origen. Misma secuencia de operaciones.",
   "reason": "Trazabilidad sin alterar la lógica.",
   "status": "implementado"
  },
  {
   "id": "EX-06",
   "module": "M1",
   "sheet": "Casas / Departamentos",
   "cell": "C10:C85",
   "excel": "La columna C (viajes/h por vivienda) sólo es la suma de D:G en Casas ≤50 m²; en otros tramos no coincide, y C no entra directamente en M:P.",
   "web": "Sólo se usan D:G (tasa por modo). C no se muestra como tasa. Pendiente: confirmación del propietario (N08/N09, D11).",
   "reason": "Se replica sin corregir.",
   "status": "implementado"
  },
  {
   "id": "EX-07",
   "module": "M2A",
   "sheet": "Bodegas Industriales; Relleno Sanitario",
   "cell": "N8:N12, N15:N19 (N4 = 2,5)",
   "excel": "Sólo el flujo privado se multiplica por 2,5 (=$L$12*E8*$N$4; en Relleno N4 es referencia relativa).",
   "web": "Factor 2,5 en rates.js (privado únicamente), operación (L×tasa)×2,5.",
   "reason": "Decisión D8: replicar.",
   "status": "implementado"
  },
  {
   "id": "EX-08",
   "module": "M2A",
   "sheet": "10 hojas",
   "cell": "L12, L19",
   "excel": "Divisor L = C4 (sin /100) en SENAME, Estudiantes, Adultos Mayores, Hoteles, Estación de Servicio, Auditorio, Edificios de Estacionamientos, PRT, Terminales con Pasajeros, Aeropuertos; L = C4/100 en las 26 restantes.",
   "web": "Parámetro divisor por tipología en model.js, con la celda de origen.",
   "reason": "Replicar.",
   "status": "implementado"
  },
  {
   "id": "EX-09",
   "module": "M3",
   "sheet": "RESULTADOS IMIV",
   "cell": "C35:F39",
   "excel": "ROUND(entrada+salida,0) es el único redondeo; Excel redondea .5 alejándose de cero.",
   "web": "excelRound(): 15 cifras significativas y luego mitad lejos de cero. No se redondea nada antes.",
   "reason": "Equivalencia con Excel (verificada contra LibreOffice en 333 valores).",
   "status": "implementado"
  },
  {
   "id": "EX-10",
   "module": "M4",
   "sheet": "RESULTADOS IMIV",
   "cell": "E12:E16",
   "excel": "Con flujo privado > 1.000 veh/h devuelve el texto «Art 3.2.2.».",
   "web": "Se conserva el texto y se muestra la nota de D5. No se calculan intersecciones 9 o más ni se agregan entradas.",
   "reason": "Decisión D5.",
   "status": "implementado"
  },
  {
   "id": "EX-11",
   "module": "M4",
   "sheet": "RESULTADOS IMIV",
   "cell": "D12:D16",
   "excel": "D12 = SUM(D4:F4) equivale a D4 porque E4 y F4 son texto.",
   "web": "Se usa D4. Equivalencia documentada.",
   "reason": "N02.",
   "status": "implementado"
  },
  {
   "id": "EX-12",
   "module": "M4",
   "sheet": "RESULTADOS IMIV",
   "cell": "E4:G8; E12:F16",
   "excel": "Resultados «N.A.» y «Art 3.2.2.» son texto, no error.",
   "web": "Se conservan como texto; nunca se convierten en 0 ni en vacío.",
   "reason": "Fidelidad al Excel.",
   "status": "implementado"
  },
  {
   "id": "EX-13",
   "module": "M0",
   "sheet": "INPUTS PROYECTO",
   "cell": "todas las entradas",
   "excel": "Texto en una entrada propaga #VALUE! a todos los resultados.",
   "web": "Error de validación en el campo; el cálculo no se ejecuta hasta corregirlo. El texto no se convierte en 0.",
   "reason": "Decisión D6 (diferencia intencional).",
   "status": "implementado"
  },
  {
   "id": "EX-14",
   "module": "M0",
   "sheet": "INPUTS PROYECTO",
   "cell": "todas las entradas",
   "excel": "Los negativos se aceptan y producen flujos negativos y categorías «N.A.».",
   "web": "Modo usuario: bloqueados. Modo auditoría: permitidos con aviso, para reproducir el comportamiento original.",
   "reason": "Decisión D6 con matiz de dos niveles.",
   "status": "implementado"
  },
  {
   "id": "EX-15",
   "module": "M0",
   "sheet": "INPUTS PROYECTO",
   "cell": "todas las entradas",
   "excel": "Celda vacía se lee como 0.",
   "web": "Campo vacío = 0 (igual que Excel), con indicador «vacío = 0».",
   "reason": "Decisión D6.",
   "status": "implementado"
  },
  {
   "id": "EX-16",
   "module": "M0",
   "sheet": "—",
   "cell": "—",
   "excel": "Los períodos se escriben PMD-L/PMD-F en las hojas de cálculo y PMd-L/PMd-F en INPUTS (U13:Y13) y Terminales sin pasajeros (C36:L36).",
   "web": "Clave interna única PMD-L / PMD-F.",
   "reason": "Unificación de nombres; sin efecto numérico.",
   "status": "implementado"
  },
  {
   "id": "EX-17",
   "module": "M2A",
   "sheet": "Terminales TPUB con Pasajeros",
   "cell": "B4; INPUTS!P5",
   "excel": "La hoja rotula la unidad «Estacionamientos»; INPUTS rotula «Dársena (Espacio 1 bus)». Las tasas se aplican a C4 = INPUTS!Q5.",
   "web": "Se usa el rótulo de INPUTS (dársena) y se muestra la nota. Sin cambio numérico.",
   "reason": "Pendiente de confirmación del propietario (H12).",
   "status": "implementado"
  },
  {
   "id": "EX-18",
   "module": "M2A",
   "sheet": "Hoteles",
   "cell": "C8, L8",
   "excel": "Rótulo «100 m2 de superficie edificada», pero el divisor es C4 (habitaciones).",
   "web": "Se rotula como habitaciones. Sin cambio numérico.",
   "reason": "Rótulo erróneo (H09).",
   "status": "implementado"
  },
  {
   "id": "EX-19",
   "module": "M2B",
   "sheet": "Casas",
   "cell": "J10, J17",
   "excel": "Rótulo «Departamentos» dentro de la hoja Casas.",
   "web": "Se usa «Casas».",
   "reason": "Rótulo erróneo (H10).",
   "status": "implementado"
  },
  {
   "id": "EX-20",
   "module": "M3",
   "sheet": "RESULTADOS IMIV",
   "cell": "B340…B772",
   "excel": "Rótulos «COMERCIO BAR DISCOTECA» repetidos en casi todos los bloques.",
   "web": "Cada bloque usa el nombre de su tipología.",
   "reason": "Rótulo erróneo (H11).",
   "status": "implementado"
  },
  {
   "id": "EX-21",
   "module": "—",
   "sheet": "RESULTADOS IMIV",
   "cell": "K22",
   "excel": "K22 = C6*20, sin rótulo ni dependientes.",
   "web": "No se implementa.",
   "reason": "Sin efecto en resultados.",
   "status": "implementado"
  },
  {
   "id": "EX-22",
   "module": "—",
   "sheet": "INPUTS PROYECTO",
   "cell": "B7, P8, P9",
   "excel": "B7 tiene valor 0 sin rótulo; P8 y P9 tienen rótulo sin celda de entrada. Ninguna hoja los lee.",
   "web": "No se muestran como campos.",
   "reason": "Sin dependientes.",
   "status": "implementado"
  },
  {
   "id": "EX-23",
   "module": "M4",
   "sheet": "RESULTADOS IMIV",
   "cell": "E12:F16",
   "excel": "La regla «Básico ⇒ 1 intersección» no figura en las imágenes normativas del libro.",
   "web": "Se reproduce tal cual.",
   "reason": "No contrastable con la norma desde el libro (N16). Pendiente de confirmación.",
   "status": "pendiente"
  },
  {
   "id": "EX-24",
   "module": "M2F",
   "sheet": "Terminales TPUB sin Pasajeros",
   "cell": "H37:L42, B27:B32",
   "excel": "VLOOKUP($B37,$B$27:$F$32,5,FALSE) con claves duplicadas (US1, US2 ×3): sólo se usa la primera coincidencia; US3–US6 no existen en la tabla y dan #N/A si la frecuencia ≠ 0, lo que deja en #N/A todos los resultados.",
   "web": "US1 y US2 (primera ocurrencia de cada clave) se calculan con la fórmula actual (frecuencia × factor medio de flota, filas 27 y 28). US3–US6 y las filas de flota duplicadas (U7:W10) quedan deshabilitadas, visibles y con advertencia; no aportan al cálculo.",
   "reason": "Decisión D2: reproducir sólo lo verificable; no inventar el significado de las filas ni corregir referencias.",
   "status": "bloqueado"
  },
  {
   "id": "EX-25",
   "module": "M2F",
   "sheet": "Terminales TPUB sin Pasajeros",
   "cell": "C6, C13",
   "excel": "=+#REF! (referencia rota).",
   "web": "Descartada (no alimenta cálculos).",
   "reason": "Sin efecto en resultados.",
   "status": "implementado"
  },
  {
   "id": "EX-26",
   "module": "M2F",
   "sheet": "INPUTS PROYECTO",
   "cell": "T5:T10",
   "excel": "Rótulos US1, US2, US1, US2, US1, US2; las filas 7–10 llegan a C29:E32 pero nunca se usan.",
   "web": "No se interpreta. Las filas se muestran tal cual, deshabilitadas, con la advertencia de D2.",
   "reason": "Decisión D2: no inventar el significado.",
   "status": "pendiente"
  },
  {
   "id": "EX-27",
   "module": "M2D",
   "sheet": "Centros Comerciales; Supermercados-LocalesComercials; Otro Comercio (Vega)",
   "cell": "J10:J65",
   "excel": "Límites de escala distintos entre hojas y distintos de la norma (Super: ≥6.000 y <1.000; CC: >6.000 y ≤6.000; Vega: >6.000, (1.000;6.000], (250;1.000], <250).",
   "web": "Se reproducen exactamente hoja por hoja, con la advertencia «Los límites de escala de esta versión reproducen el Excel y aún no han sido armonizados con la normativa.»",
   "reason": "Decisiones D3/D4.",
   "status": "implementado"
  },
  {
   "id": "EX-28",
   "module": "M2D",
   "sheet": "Comercios",
   "cell": "J10:J65",
   "excel": "Carga de ocupación 0 con superficie > 0 activa la escala menor/básica (flujo ≠ 0).",
   "web": "Se reproduce igual.",
   "reason": "Decisión D4.",
   "status": "implementado"
  },
  {
   "id": "EX-29",
   "module": "M2D",
   "sheet": "Otro Comercio (Vega)",
   "cell": "J42, J58",
   "excel": "Carga exactamente 250: ninguna escala activa, flujo 0 en todos los períodos.",
   "web": "Se reproduce igual, con el texto «Sin escala aplicable según la lógica actual del Excel.»",
   "reason": "Decisión D4.",
   "status": "implementado"
  },
  {
   "id": "EX-30",
   "module": "M2D",
   "sheet": "Centros Comerciales; Supermercados; Vega",
   "cell": "M10, M17",
   "excel": "VLOOKUP(1,$N$26:$O$29,2,FALSE) devuelve #N/A cuando ninguna escala está activa (etiqueta).",
   "web": "Se mostrará «Sin escala aplicable según la lógica actual del Excel.» en vez de #N/A. Sin cambio numérico.",
   "reason": "Decisión D4.",
   "status": "implementado"
  },
  {
   "id": "EX-31",
   "module": "M2D",
   "sheet": "Otro Comercio (Vega)",
   "cell": "P17:S21",
   "excel": "Las fórmulas de salida usan $N$14 en vez de $N$21 (mismo valor, C4/100).",
   "web": "Un solo valor C4/100.",
   "reason": "Sin efecto numérico.",
   "status": "implementado"
  },
  {
   "id": "EX-32",
   "module": "M2C",
   "sheet": "Establec. Educacionales (4 hojas)",
   "cell": "H20, H22, H24, H26",
   "excel": "El código de tipo no tiene validación; un código fuera de 1–4 deja el flujo en 0 (derivado de la fórmula).",
   "web": "Se reproduce igual en la etapa M2C.",
   "reason": "Decisión aprobada.",
   "status": "implementado"
  },
  {
   "id": "EX-33",
   "module": "M2E",
   "sheet": "Puertos",
   "cell": "Q12; G10:G37",
   "excel": "Con tipo 0 (valor por defecto) el flujo es 0 aunque exista capacidad.",
   "web": "Se reproduce igual en la etapa M2E.",
   "reason": "Decisión aprobada.",
   "status": "implementado"
  },
  {
   "id": "EX-35",
   "module": "M2F",
   "sheet": "Terminales TPUB sin Pasajeros",
   "cell": "E6:E17, N6:Q17",
   "excel": "Sólo el flujo privado se alimenta (E6:E10 = H43:L43, total de veq/h); público, peatones y ciclos son constantes 0; la salida es copia de la entrada; L10 y L17 (=1) no se usan.",
   "web": "Igual: privado = Σ(frecuencia US × factor medio); salida = entrada; otros modos = 0.",
   "reason": "Replicar.",
   "status": "implementado"
  },
  {
   "id": "EX-36",
   "module": "M2C",
   "sheet": "Establec. Educacionales (4 hojas)",
   "cell": "L10:O21; RESULTADOS IMIV!D94",
   "excel": "Cada hoja contiene las 4 tablas de tipo; un dummy G elige la tabla según C4; RESULTADOS suma las 4 hojas (D94 = Tipo1 + Tipo2 + Tip3 + Tip 4).",
   "web": "Cuatro filas de establecimiento (código + estudiantes). La selección usa una lista cerrada 0–4; el motor acepta cualquier código (modo auditoría/pruebas).",
   "reason": "La lista cerrada evita códigos inválidos en uso normal; el motor reproduce el Excel para cualquier valor.",
   "status": "implementado"
  },
  {
   "id": "EX-37",
   "module": "M2D",
   "sheet": "Comercios",
   "cell": "M10, M17, N26:O29",
   "excel": "La etiqueta de escala usa límites estrictos (>6000, (1000;6000), (250;1000), (0;250)) y es independiente de las dummies J; con carga 6.000, 1.000, 250 ó 0 devuelve #N/A aunque las dummies sí activen una escala.",
   "web": "Se calcula la etiqueta con las mismas reglas; si no hay escala se muestra «Sin escala aplicable según la lógica actual del Excel.». Las dummies y los flujos no se alteran.",
   "reason": "Decisión D4.",
   "status": "implementado"
  }
 ],
 "differences": [
  {
   "id": "DIF-01",
   "topic": "Texto en campos numéricos",
   "excel": "#VALUE! en todos los resultados.",
   "web": "Error en el campo y el cálculo no se ejecuta. No se convierte en 0.",
   "type": "Intencional (D6)",
   "ref": "EX-13"
  },
  {
   "id": "DIF-02",
   "topic": "Valores negativos",
   "excel": "Aceptados; flujos negativos y categorías N.A.",
   "web": "Modo usuario: bloqueados con mensaje. Modo auditoría: permitidos con aviso.",
   "type": "Intencional (D6)",
   "ref": "EX-14"
  },
  {
   "id": "DIF-03",
   "topic": "Campo vacío",
   "excel": "Se lee como 0.",
   "web": "Se lee como 0; el campo muestra «vacío = 0».",
   "type": "Equivalente",
   "ref": "EX-15"
  },
  {
   "id": "DIF-04",
   "topic": "Superficie de Casas",
   "excel": "B5 es fórmula, pero el usuario de Excel podría sobrescribirla.",
   "web": "No existe campo de superficie para Casas. Parámetro interno 61 m²/vivienda.",
   "type": "Intencional (D1)",
   "ref": "EX-01"
  },
  {
   "id": "DIF-05",
   "topic": "Etiqueta de escala sin escala (comercios)",
   "excel": "#N/A en M10/M17.",
   "web": "«Sin escala aplicable según la lógica actual del Excel.»",
   "type": "Intencional (D4)",
   "ref": "EX-30"
  },
  {
   "id": "DIF-06",
   "topic": "Terminal TPUB sin Pasajeros US3–US6",
   "excel": "#N/A en todos los resultados si frecuencia ≠ 0.",
   "web": "US3–US6 y filas de flota duplicadas deshabilitadas con advertencia; US1–US2 se calculan como el Excel.",
   "type": "Intencional (D2)",
   "ref": "EX-24"
  },
  {
   "id": "DIF-07",
   "topic": "Período «PMd»",
   "excel": "Dos ortografías en el libro.",
   "web": "Clave única PMD-L / PMD-F.",
   "type": "Presentación",
   "ref": "EX-16"
  },
  {
   "id": "DIF-08",
   "topic": "Rótulos erróneos",
   "excel": "Casas dice «Departamentos»; Hoteles rotula m²; bloques con «COMERCIO BAR DISCOTECA».",
   "web": "Rótulos correctos.",
   "type": "Presentación",
   "ref": "EX-18…EX-20"
  },
  {
   "id": "DIF-09",
   "topic": "Separador decimal",
   "excel": "Según configuración regional de Excel.",
   "web": "Se acepta «.» o «,» como decimal; no se acepta separador de miles. Se muestra el valor interpretado.",
   "type": "Entrada de datos",
   "ref": "—"
  },
  {
   "id": "DIF-11",
   "topic": "Resultado «Art 3.2.2.»",
   "excel": "Texto en E12:E16.",
   "web": "Igual, con nota explicativa.",
   "type": "Equivalente + nota (D5)",
   "ref": "EX-10"
  },
  {
   "id": "DIF-12",
   "topic": "Celdas sin efecto",
   "excel": "K22, B7, P8, P9, C6/C13 (#REF!).",
   "web": "No se muestran ni se calculan.",
   "type": "Presentación",
   "ref": "EX-21, EX-22, EX-25"
  },
  {
   "id": "DIF-13",
   "topic": "Modo de operación",
   "excel": "Un único modo.",
   "web": "Modo usuario (bloquea texto y negativos) y modo auditoría/pruebas (permite negativos para comparar). El texto se bloquea en ambos modos.",
   "type": "Intencional (D6)",
   "ref": "EX-13, EX-14"
  },
  {
   "id": "DIF-14",
   "topic": "Códigos de tipo (educacionales, puertos)",
   "excel": "Celda libre sin validación.",
   "web": "Lista cerrada en la interfaz; el motor reproduce cualquier código.",
   "type": "Entrada de datos",
   "ref": "EX-36"
  },
  {
   "id": "DIF-15",
   "topic": "Terminal de buses sin pasajeros: US3–US6 en pruebas",
   "excel": "#N/A en todos los resultados si hay frecuencia en US3–US6.",
   "web": "Se excluyen del cálculo y se informa. El caso se registra como diferencia intencional (D2).",
   "type": "Intencional (D2)",
   "ref": "EX-24"
  }
 ]
});})(typeof window!=='undefined'?window:globalThis);
