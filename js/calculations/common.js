/* Utilidades comunes del motor: períodos, redondeo de Excel, evaluación de condiciones. */
(function (root) {
  'use strict';
  const IMIV = (root.IMIV = root.IMIV || {});
  const C = (IMIV.calc = IMIV.calc || {});
  const M = IMIV.model;
  C.PER = M.periods.map(p => p.id);
  C.NP = 5; C.NM = 4;
  C.MODE_COL_RES = ['D', 'E', 'F', 'G'];   // columnas de bloque en RESULTADOS IMIV
  C.MODE_COL_TOT = ['C', 'D', 'E', 'F'];   // columnas consolidadas C21:F39
  C.zeros = () => Array.from({ length: 5 }, () => [0, 0, 0, 0]);
  C.matrix = fn => Array.from({ length: 5 }, (_, k) => [0, 1, 2, 3].map(j => fn(k, j)));

  /* ROUND(x,0) de Excel: trabaja con 15 cifras significativas y redondea .5 alejándose de cero.
     No se usa Math.round directo (difiere en negativos y en residuos binarios, p. ej. 22,499999999999996). */
  C.excelRound = function (x) {
    if (!isFinite(x)) return x;
    const a = Math.abs(Number(x.toPrecision(15)));
    const r = Math.floor(a + 0.5);
    return x < 0 && r !== 0 ? -r : r;
  };

  /* Condición de dummy como la escribe el Excel: lista de pares [operador, valor] unidos con AND. */
  C.cond = function (conds, x) {
    for (const [op, v] of conds) {
      if (op === '>' && !(x > v)) return false;
      if (op === '>=' && !(x >= v)) return false;
      if (op === '<' && !(x < v)) return false;
      if (op === '<=' && !(x <= v)) return false;
    }
    return true;
  };
  C.condText = conds => conds.map(([o, v]) => `C5 ${o} ${v}`).join(' y ');
})(typeof window !== 'undefined' ? window : globalThis);
