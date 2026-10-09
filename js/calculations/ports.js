/* M2E — Puertos. Excel: L10 = $J$14*(C10*$G10 + C26*$G26), G = IF($C$4=n,1,0), J14 = J21 = C5.
   Tipo 1 (contenedores): privado 1,5 en los 5 períodos; tipo 2 (granel): 0,06. Con tipo ≠ 1,2 el flujo es 0. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, R = IMIV.rates, M = IMIV.model;
  C.calcPorts = function (tipo, cap) {
    const P = R.ports, dum = P.tipos.map(t => (tipo === t.tipo ? 1 : 0));
    const flow = dir => C.matrix((k, j) => { let s = 0; for (let n = 0; n < 2; n++) s = s + P.tipos[n][dir][C.PER[k]][j] * dum[n]; return cap * s; });
    const ft = M.inputs.find(f => f.id === 'puertos.tipo'), fc = M.inputs.find(f => f.id === 'puertos.capacidad');
    return { ent: flow('ent'), sal: flow('sal'), tipo, cap, dummies: dum,
      trace: { parts: [{ sheet: P.sheet, inputs: [{ label: ft.label, cell: 'INPUTS PROYECTO!Q12', value: tipo, sheetCell: 'Puertos!C4' }, { label: fc.label, cell: 'INPUTS PROYECTO!Q13', value: cap, sheetCell: 'Puertos!C5' }],
        unit: d => ({ cell: `Puertos!J${d === 'ent' ? 14 : 21}`, value: cap, formula: '=$C$5' }), factor: () => null,
        terms: (d, k, j) => P.tipos.map((t, n) => { const row = (d === 'ent' ? t.entRow : t.salRow) + k; return { rateCell: `Puertos!${'CDEF'[j]}${row}`, rate: t[d][C.PER[k]][j], dummyCell: `Puertos!G${row}`, dummy: dum[n], tag: `Tipo ${t.tipo}` }; }),
        flowCell: (d, k, j) => `Puertos!${'LMNO'[j]}${(d === 'ent' ? 10 : 17) + k}`,
        flowFormula: (d, k, j) => { const rows = P.tipos.map(t => (d === 'ent' ? t.entRow : t.salRow) + k); return `=$J$${d === 'ent' ? 14 : 21}*(${rows.map(r => `${'CDEF'[j]}${r}*$G${r}`).join('+')})`; } }] } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
