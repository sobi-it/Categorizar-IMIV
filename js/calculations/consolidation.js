/* M3 — Consolidación de los 44 bloques y redondeo posterior a la suma.
   C21 = D46 + D62 + … + D765 (entrada) ; C28 = D53 + D69 + … (salida) ; C35 = ROUND(C21 + C28, 0). */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc;
  C.consolidate = function (blockFlows) {
    const ent = C.zeros(), sal = C.zeros(), tot = C.zeros();
    for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) {
      let e = 0, s = 0;
      for (const b of blockFlows) { if (!b) continue; e = e + b.ent[k][j]; s = s + b.sal[k][j]; } // mismo orden de términos que Excel
      ent[k][j] = e; sal[k][j] = s;
      tot[k][j] = C.excelRound(e + s);   // único redondeo del libro, después de sumar entrada y salida
    }
    return { ent, sal, tot };
  };
})(typeof window !== 'undefined' ? window : globalThis);
