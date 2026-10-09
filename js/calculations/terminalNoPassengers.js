/* M2F — Terminales TPUB sin Pasajeros (comportamiento controlado, D2).
   Excel: F27 = IF(SUM(C27:E27)=0,0,(C27*$C$21+D27*$C$22+E27*$C$23)/SUM(C27:E27))   [factor medio veq/veh]
          H37 = IF(C37=0,0,C37*VLOOKUP($B37,$B$27:$F$32,5,FALSE)) ; H43 = SUM(H37:H42) ; E6 = H43 ; N6 = E6 ; E13 = E6.
   VLOOKUP sólo encuentra la primera ocurrencia de US1 (fila 27) y US2 (fila 28); US3–US6 no existen en la tabla (#N/A).
   Web: sólo US1 y US2 (flota filas 1–2, frecuencias filas 1–2). US3–US6 y las filas de flota duplicadas se excluyen y se informan. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, R = IMIV.rates, M = IMIV.model;
  const FT = R.terminal.factors;
  C.TERM_FLOTA = t => ['A', 'B2', 'C2'].map(x => `terminal_sin_pasajeros.flota.${t}.${x}`);
  C.TERM_FREC = t => C.PER.map(p => `terminal_sin_pasajeros.frec.us${t}.${p}`);
  C.calcTerminal = function (v) {
    const fac = [], H = [[], []];
    for (let u = 0; u < 2; u++) {
      const [a, b, c] = C.TERM_FLOTA(u + 1).map(id => v(id)), s = a + b + c;
      fac.push(s === 0 ? 0 : (a * FT.A + b * FT.B2 + c * FT.C2) / s);          // F27 / F28
      H[u] = C.TERM_FREC(u + 1).map(id => v(id)).map(f => (f === 0 ? 0 : f * fac[u])); // H37:L38
    }
    // Entradas deshabilitadas con valor ≠ 0 (el Excel daría #N/A en todos los resultados si es US3–US6)
    const excluded = M.inputs.filter(f => f.module === 'M2F' && !f.enabled && v(f.id) !== 0);
    const tot = C.PER.map((p, k) => ((((0 + H[0][k]) + H[1][k]) + 0) + 0)); // SUM(H37:H42) con US3–US6 = 0
    const ent = C.matrix((k, j) => (j === 0 ? tot[k] : 0)), sal = C.matrix((k, j) => (j === 0 ? tot[k] : 0)); // E13:E17 = E6:E10
    const fl = u => ({ label: `Flota US${u}`, cell: `INPUTS PROYECTO!U${4 + u}:W${4 + u}`, value: C.TERM_FLOTA(u).map(id => v(id)).join(' / ') });
    return { ent, sal, factors: fac, H, excluded, wouldBeNA: excluded.some(f => f.id.includes('.frec.')),
      trace: { parts: [{ sheet: R.terminal.sheet, inputs: [fl(1), fl(2)], unit: () => null, factor: () => null,
        terms: (d, k, j) => (j !== 0 ? [] : [0, 1].map(u => ({ rateCell: `${R.terminal.sheet}!${'CDEFG'[k]}${37 + u} × F${27 + u}`, rate: fac[u], dummyCell: null, dummy: null, tag: `US${u + 1}: frecuencia ${v(C.TERM_FREC(u + 1)[k])} buses/h × factor medio` }))),
        flowCell: (d, k, j) => `${R.terminal.sheet}!${'NOPQ'[j]}${(d === 'ent' ? 6 : 13) + k}`,
        flowFormula: (d, k, j) => (j === 0 ? `=E${6 + k} = ${'HIJKL'[k]}43 = SUM(${'HIJKL'[k]}37:${'HIJKL'[k]}42)${d === 'sal' ? ' (salida = entrada)' : ''}` : '= 0 (constante)') }] } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
