/* M4 — Categorías IMIV y área de influencia (RESULTADOS IMIV!C4:G8 y C12:F16).
   Umbrales de data/mappings.js. «N.A.» y «Art 3.2.2.» son texto, no error (D5). */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, M = IMIV.model;
  C.catBand = function (v, th) {
    if (v < th.lo) return 'N.A.';
    if (v >= th.lo && v <= th.mid) return 'Básico';
    if (v > th.mid && v <= th.hi) return 'Intermedio';
    return 'Mayor';
  };
  C.aiPriv = function (c, cat) { // E12 = IF(E4="Básico",1,IF(C12<=80,"N.A.",IF(AND(C12>80,C12<=120),2,…,"Art 3.2.2.")))
    const th = M.thresholds.aiPriv;
    if (cat === 'Básico') return 1;
    if (c <= th.edges[0]) return 'N.A.';
    for (let i = 0; i < th.values.length; i++) if (c > th.edges[i] && c <= th.edges[i + 1]) return th.values[i];
    return th.over;
  };
  C.aiOtros = function (d, cat) { // F12 = IF(F4="Básico",1,IF(D12<=160,"N.A.",IF(AND(D12>160,D12<=500),3,IF(AND(D12>500,D12<=2000),6,8))))
    const th = M.thresholds.aiOtros;
    if (cat === 'Básico') return 1;
    if (d <= th.edges[0]) return 'N.A.';
    if (d > th.edges[0] && d <= th.edges[1]) return th.values[0];
    if (d > th.edges[1] && d <= th.edges[2]) return th.values[1];
    return th.values[2];
  };
  C.classify = function (tot) {
    return tot.map(r => {
      const c = r[0], d = r[1] + r[2] + r[3];                    // C4 = C35 ; D4 = SUM(D35:F35)
      const e = C.catBand(c, M.thresholds.catPriv), f = C.catBand(d, M.thresholds.catOtros);
      const g = (e === 'Mayor' || f === 'Mayor') ? 'Mayor' : (e === 'Intermedio' || f === 'Intermedio') ? 'Intermedio' : (e === 'Básico' || f === 'Básico') ? 'Básico' : 'N.A.';
      return { c, d, e, f, g, aiE: C.aiPriv(c, e), aiF: C.aiOtros(d, f) }; // C12 = C4 ; D12 = SUM(D4:F4) = D4
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
