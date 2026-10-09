/* M2A — Hojas de plantilla simple (36). Excel: N8 = $L$12*E8 (entrada), N15 = $L$19*E15 (salida).
   Bodegas Industriales y Relleno Sanitario: privado × $N$4 (2,5). L12/L19 = $C$4/100 ó $C$4. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, M = IMIV.model, R = IMIV.rates;
  C.calcTemplate = function (tid, c4) {
    const T = M.templates[tid], Rt = R.plantilla[tid], f = M.inputs.find(x => x.id === T.inputId);
    const L = T.divisor === 'C4/100' ? c4 / 100 : c4;
    const dir = rates => C.PER.map(p => rates[p].map((t, j) => { let v = L * t; if (j === 0 && T.factorPriv !== 1) v = v * T.factorPriv; return v; }));
    const flowRow = d => (d === 'ent' ? 8 : 15);
    return { ent: dir(Rt.ent), sal: dir(Rt.sal), c4, L,
      trace: { parts: [{ sheet: T.sheet, inputs: [{ label: f.section + ' · ' + f.label, cell: 'INPUTS PROYECTO!' + f.cell, value: c4, sheetCell: T.sheet + '!C4' }],
        unit: d => ({ cell: `${T.sheet}!L${d === 'ent' ? 12 : 19}`, value: L, formula: T.divisor === 'C4/100' ? '=$C$4/100' : '=$C$4' }),
        factor: j => (j === 0 && T.factorPriv !== 1 ? { cell: `${T.sheet}!N4`, value: T.factorPriv } : null),
        terms: (d, k, j) => [{ rateCell: `${T.sheet}!${'EFGH'[j]}${flowRow(d) + k}`, rate: Rt[d][C.PER[k]][j], dummyCell: null, dummy: null }],
        flowCell: (d, k, j) => `${T.sheet}!${'NOPQ'[j]}${flowRow(d) + k}`,
        flowFormula: (d, k, j) => `=$L$${d === 'ent' ? 12 : 19}*${'EFGH'[j]}${flowRow(d) + k}${j === 0 && T.factorPriv !== 1 ? '*$N$4' : ''}` }] } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
