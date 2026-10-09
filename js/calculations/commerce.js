/* M2D — Comercios con escala por carga de ocupación C5 (reglas propias de cada hoja; D3/D4: no armonizadas).
   Excel: P10 = $N$14*(F10*$J10 + F26*$J26 [+ F42*$J42 [+ F58*$J58]]), N14 = N21 = C4/100.
   Etiqueta M10/M17 = VLOOKUP(1,$N$26:$O$29,2,FALSE) → sin coincidencia = #N/A (aquí: texto D4). */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, R = IMIV.rates, M = IMIV.model;
  C.commerceLabel = function (key, carga) { // etiqueta de escala de la hoja o null (= #N/A en Excel)
    for (const l of R.commerce[key].labelRules) if (C.cond(l.rule, carga)) return l.text;
    return null;
  };
  C.calcCommerce = function (key, sup, carga) {
    const Cm = R.commerce[key], sh = Cm.sheet, unit = sup / 100;
    const dum = Cm.scales.map(s => (C.cond(s.rule, carga) ? 1 : 0));
    const flow = dir => C.matrix((k, j) => { let s = 0; for (let n = 0; n < Cm.scales.length; n++) s = s + Cm.scales[n][dir][C.PER[k]][j] * dum[n]; return unit * s; });
    const fs = M.inputs.find(f => f.id === key + '.superficie'), fc = M.inputs.find(f => f.id === key + '.carga');
    const label = C.commerceLabel(key, carga);
    return { ent: flow('ent'), sal: flow('sal'), sup, carga, unit, dummies: dum, label, sinEscala: label === null, scaleActive: dum.indexOf(1),
      trace: { parts: [{ sheet: sh, inputs: [{ label: fs.section + ' · ' + fs.label, cell: 'INPUTS PROYECTO!' + fs.cell, value: sup, sheetCell: sh + '!C4' }, { label: fc.label, cell: 'INPUTS PROYECTO!' + fc.cell, value: carga, sheetCell: sh + '!C5' }],
        unit: d => ({ cell: `${sh}!N${d === 'ent' ? 14 : (Cm.unitCellSalActual)}`, value: unit, formula: '=$C$4/100' }), factor: () => null,
        terms: (d, k, j) => Cm.scales.map((s, n) => { const row = (d === 'ent' ? s.entRow : s.salRow) + k; return { rateCell: `${sh}!${'FGHI'[j]}${row}`, rate: s[d][C.PER[k]][j], dummyCell: `${sh}!J${row}`, dummy: dum[n], tag: s.label + ' [' + C.condText(s.rule) + ']' }; }),
        flowCell: (d, k, j) => `${sh}!${'PQRS'[j]}${(d === 'ent' ? 10 : 17) + k}`,
        flowFormula: (d, k, j) => { const rows = Cm.scales.map(s => (d === 'ent' ? s.entRow : s.salRow) + k); return `=$N$${d === 'ent' ? 14 : Cm.unitCellSalActual}*(${rows.map(r => `${'FGHI'[j]}${r}*$J${r}`).join('+')})`; } }] } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
