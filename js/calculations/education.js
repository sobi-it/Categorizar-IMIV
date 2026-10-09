/* M2C — Establecimientos educacionales (4 hojas idénticas; el código de tipo C4 elige la tabla vía dummy G).
   Excel: L10 = $J$14*(C10*$G10 + C26*$G26 + C42*$G42 + C59*$G59), J14 = C5 (estudiantes), G = IF($C$4=n,1,0).
   RESULTADOS IMIV!D94 = Tipo1!L10 + Tipo2!L10 + Tip3!L10 + Tip 4!L10. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, R = IMIV.rates, M = IMIV.model;
  C.calcEducationSheet = function (sheet, code, students, fields) {
    const E = R.education, dum = E.tipos.map(t => (code === t.tipo ? 1 : 0));
    const flow = dir => C.matrix((k, j) => { let s = 0; for (let n = 0; n < 4; n++) s = s + E.tipos[n][dir][C.PER[k]][j] * dum[n]; return students * s; });
    return { sheet, code, students, dummies: dum, ent: flow('ent'), sal: flow('sal'),
      trace: { sheet, inputs: [{ label: fields[0].label, cell: 'INPUTS PROYECTO!' + fields[0].cell, value: code, sheetCell: sheet + '!C4' }, { label: fields[1].label, cell: 'INPUTS PROYECTO!' + fields[1].cell, value: students, sheetCell: sheet + '!C5' }],
        unit: d => ({ cell: `${sheet}!J${d === 'ent' ? 14 : 21}`, value: students, formula: '=$C$5 (estudiantes)' }), factor: () => null,
        terms: (d, k, j) => E.tipos.map((t, n) => { const row = (d === 'ent' ? t.entRow : t.salRow) + k; return { rateCell: `${sheet}!${'CDEF'[j]}${row}`, rate: t[d][C.PER[k]][j], dummyCell: `${sheet}!G${row}`, dummy: dum[n], tag: `Tipo ${t.tipo}` }; }),
        flowCell: (d, k, j) => `${sheet}!${'LMNO'[j]}${(d === 'ent' ? 10 : 17) + k}`,
        flowFormula: (d, k, j) => { const rows = E.tipos.map(t => (d === 'ent' ? t.entRow : t.salRow) + k); return `=$J$${d === 'ent' ? 14 : 21}*(${rows.map(r => `${'CDEF'[j]}${r}*$G${r}`).join('+')})`; } } };
  };
  C.calcEducation = function (v) {
    const parts = R.education.sheets.map((sh, i) => {
      const fc = M.inputs.find(f => f.id === `educacionales.tipo${i + 1}.codigo`), fe = M.inputs.find(f => f.id === `educacionales.tipo${i + 1}.estudiantes`);
      return C.calcEducationSheet(sh, v(fc.id), v(fe.id), [fc, fe]);
    });
    const sum = dir => C.matrix((k, j) => parts[0][dir][k][j] + parts[1][dir][k][j] + parts[2][dir][k][j] + parts[3][dir][k][j]);
    return { ent: sum('ent'), sal: sum('sal'), parts, trace: { parts: parts.map(p => p.trace) } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
