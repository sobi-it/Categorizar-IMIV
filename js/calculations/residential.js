/* M2B — Casas y Departamentos (selección de tasas por tramo de superficie promedio C4).
   Flujo (Excel): M10 = $K$14*(D10*H10 + D26*H26 + D42*H42 + D58*H58 + D74*H74), K14 = C5 (viviendas).
   Casas (D1): INPUTS!B5 = 61*B6 → C4 = IF(C5=0,0,B5/B6). Departamentos: C4 = IF(C5=0,0,B9/B10). */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, M = IMIV.model, R = IMIV.rates;
  const active = (t, c4) => (t.lo === null ? c4 <= t.hi : t.hi === null ? c4 > t.lo : (c4 > t.lo && c4 <= t.hi));
  C.tramoActive = active;
  // Tasas del tramo (5 períodos × 4 modos) para una superficie promedio C4, con las mismas operaciones que el Excel.
  C.tramoRates = function (t, c4) {
    if (t.kind === 'const') return { ent: C.PER.map(p => t.ent[p].slice()), sal: C.PER.map(p => t.sal[p].slice()) };
    const base = t.base.a + t.base.b * (c4 - t.base.x0), o = t.otherFactor;
    const rows = bi => C.PER.map((p, k) => { const c = k === bi ? base : o * base; return t.share.map(s => c * s); });
    return { ent: rows(2), sal: rows(0) }; // entrada: base en PT-L; salida: base en PM-L
  };
  C.calcViviendas = function (key, viviendas, c4, inputs) {
    const rv = R.viviendas[key], tr = rv.tramos;
    const act = tr.map(t => (active(t, c4) ? 1 : 0));
    const rates = tr.map(t => C.tramoRates(t, c4));
    const flow = dir => C.matrix((k, j) => { let s = 0; for (let t = 0; t < tr.length; t++) s = s + rates[t][dir][k][j] * act[t]; return viviendas * s; });
    const sh = rv.sheet;
    return { ent: flow('ent'), sal: flow('sal'), c4, viviendas, dummies: act, tramoActivo: act.indexOf(1),
      trace: { parts: [{ sheet: sh, inputs: inputs.concat([{ label: 'Superficie promedio', cell: `${sh}!C4`, value: c4 }]),
        unit: () => ({ cell: `${sh}!K14`, value: viviendas, formula: '=$C$5 (cantidad de viviendas)' }), factor: () => null,
        terms: (d, k, j) => tr.map((t, ti) => { const row = (d === 'ent' ? t.dummyEntRow : t.dummySalRow) + k; return { rateCell: `${sh}!${'DEFG'[j]}${row}`, rate: rates[ti][d][k][j], dummyCell: `${sh}!H${row}`, dummy: act[ti], tag: `Tramo ${t.id}` }; }),
        flowCell: (d, k, j) => `${sh}!${'MNOP'[j]}${(d === 'ent' ? 10 : 17) + k}`,
        flowFormula: (d, k, j) => { const r0 = d === 'ent' ? 10 : 17; return `=$K$14*(${[0, 1, 2, 3, 4].map(t => `${'DEFG'[j]}${r0 + 16 * t + k}*H${r0 + 16 * t + k}`).join('+')})`; } }] } };
  };
  const CASAS_M2 = M.constants.CASAS_SUP_UTIL_M2_POR_VIVIENDA.value; // D1: parámetro interno fijo
  C.calcCasas = function (b6) {
    const b5 = CASAS_M2 * b6;                // INPUTS PROYECTO!B5 = 61*B6
    const c4 = b6 === 0 ? 0 : b5 / b6;       // Casas!C4 = IF(C5=0,0,B5/B6)
    return C.calcViviendas('casas', b6, c4, [{ label: 'Casas · cantidad de viviendas', cell: 'INPUTS PROYECTO!B6', value: b6, sheetCell: 'Casas!C5' }, { label: 'Superficie útil (parámetro interno 61 m² × B6)', cell: 'INPUTS PROYECTO!B5', value: b5 }]);
  };
  C.calcDptos = function (b9, b10) {
    const c4 = b10 === 0 ? 0 : b9 / b10;     // Departamentos!C4 = IF(C5=0,0,B9/B10)
    return C.calcViviendas('departamentos', b10, c4, [{ label: 'Departamentos · superficie útil', cell: 'INPUTS PROYECTO!B9', value: b9 }, { label: 'Departamentos · cantidad de viviendas', cell: 'INPUTS PROYECTO!B10', value: b10, sheetCell: 'Departamentos!C5' }]);
  };
})(typeof window !== 'undefined' ? window : globalThis);
