/* Trazabilidad: reconstruye la cadena entrada web → hoja Excel → tasa/dummy/factor → bloque RESULTADOS → total → categoría. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, M = IMIV.model, C = IMIV.calc;
  const T = (IMIV.trace = {});
  const fmt = x => (typeof x === 'number' ? (Math.round(x * 1e9) / 1e9).toString() : String(x));
  T.fmt = fmt;
  function blockChain(out, bid, dir, k, j) {
    const i = M.blocks.findIndex(b => b.id === bid), b = M.blocks[i], r = out.flows[i], steps = [];
    const per = C.PER[k], mode = M.modes[j], dn = dir === 'ent' ? 'entrada' : 'salida';
    steps.push({ t: `Tipología: ${b.sheet} · ${per} · ${mode.label} (${mode.unit}) · ${dn}` });
    r.trace.parts.forEach((p, pi) => {
      if (r.trace.parts.length > 1) steps.push({ t: `Hoja ${p.sheet}`, head: 1 });
      p.inputs.forEach(x => { steps.push({ t: 'Entrada: ' + x.label, ref: x.cell, v: x.value }); if (x.sheetCell) steps.push({ t: '→ lectura en la hoja', ref: x.sheetCell, v: x.value, ind: 1 }); });
      const u = p.unit(dir); if (u) steps.push({ t: 'Factor de unidad', ref: u.cell, f: u.formula, v: u.value });
      const fct = p.factor(j); if (fct) steps.push({ t: 'Factor adicional (sólo transporte privado)', ref: fct.cell, v: fct.value });
      p.terms(dir, k, j).forEach(tm => {
        steps.push({ t: 'Tasa' + (tm.tag ? ` [${tm.tag}]` : ''), ref: tm.rateCell, v: tm.rate });
        if (tm.dummyCell) steps.push({ t: 'Dummy / condición aplicada', ref: tm.dummyCell, v: tm.dummy, ind: 1 });
      });
      const pv = r.parts ? r.parts[pi][dir][k][j] : r[dir][k][j];
      steps.push({ t: 'Flujo calculado en la hoja', ref: p.flowCell(dir, k, j), f: p.flowFormula(dir, k, j), v: pv });
    });
    const row = (dir === 'ent' ? b.entRow : b.salRow) + k;
    steps.push({ t: `→ bloque en RESULTADOS IMIV (${dn})`, ref: `RESULTADOS IMIV!${C.MODE_COL_RES[j]}${row}`, f: r.parts ? '= suma de las 4 hojas educacionales' : '= valor de la hoja', v: r[dir][k][j] });
    return steps;
  }
  function tail(out, k, j) {
    const col = C.MODE_COL_TOT[j], cl = out.cls[k], steps = [];
    steps.push({ t: 'Entrada acumulada (suma de 44 bloques)', ref: `RESULTADOS IMIV!${col}${21 + k}`, v: out.ent[k][j] });
    steps.push({ t: 'Salida acumulada (suma de 44 bloques)', ref: `RESULTADOS IMIV!${col}${28 + k}`, v: out.sal[k][j] });
    steps.push({ t: 'Total consolidado (suma antes de redondear → ROUND)', ref: `RESULTADOS IMIV!${col}${35 + k}`, f: `=ROUND(${col}${21 + k}+${col}${28 + k},0)`, v: out.tot[k][j] });
    if (j === 0) steps.push({ t: 'Categoría IMIV transporte privado', ref: `RESULTADOS IMIV!E${4 + k}`, f: '=IF(C<20,"N.A.",IF(C<=80,"Básico",IF(C<=250,"Intermedio","Mayor")))', v: cl.e });
    else steps.push({ t: 'Categoría IMIV otros modos (público + peatones + ciclos)', ref: `RESULTADOS IMIV!F${4 + k}`, f: '=IF(D<40,"N.A.",IF(D<=160,"Básico",IF(D<=500,"Intermedio","Mayor")))', v: cl.f });
    steps.push({ t: 'Categoría MM IMIV (final)', ref: `RESULTADOS IMIV!G${4 + k}`, v: cl.g });
    steps.push({ t: 'Área de influencia (intersecciones)', ref: `RESULTADOS IMIV!${j === 0 ? 'E' : 'F'}${12 + k}`, v: j === 0 ? cl.aiE : cl.aiF });
    return steps;
  }
  // spec: {kind:'block',block,dir,k,j} | {kind:'tot',k,j} | {kind:'cat',k} | {kind:'ai',k}
  T.explain = function (out, spec) {
    if (!out) return [];
    const { k, j } = spec;
    if (spec.kind === 'block') return blockChain(out, spec.block, spec.dir, k, j).concat(tail(out, k, j));
    const cl = out.cls[k];
    if (spec.kind === 'cat') return [{ t: 'Privado redondeado', ref: `RESULTADOS IMIV!C${4 + k} (= C${35 + k})`, v: cl.c }, { t: 'Otros modos redondeado', ref: `RESULTADOS IMIV!D${4 + k} (= SUM(D${35 + k}:F${35 + k}))`, v: cl.d }, { t: 'Categoría transporte privado', ref: `RESULTADOS IMIV!E${4 + k}`, f: '=IF(C<20,"N.A.",IF(AND(C>=20,C<=80),"Básico",IF(AND(C>80,C<=250),"Intermedio","Mayor")))', v: cl.e }, { t: 'Categoría otros modos', ref: `RESULTADOS IMIV!F${4 + k}`, f: '=IF(D<40,"N.A.",IF(AND(D>=40,D<=160),"Básico",IF(AND(D>160,D<=500),"Intermedio","Mayor")))', v: cl.f }, { t: 'Categoría MM IMIV', ref: `RESULTADOS IMIV!G${4 + k}`, f: 'Mayor si alguna es Mayor; si no Intermedio; si no Básico; si no N.A.', v: cl.g }];
    if (spec.kind === 'ai') return [{ t: 'Flujo privado (C12 = C4)', ref: `RESULTADOS IMIV!C${12 + k}`, v: cl.c }, { t: 'Flujo otros modos (D12 = SUM(D4:F4) = D4)', ref: `RESULTADOS IMIV!D${12 + k}`, v: cl.d }, { t: 'Intersecciones privado', ref: `RESULTADOS IMIV!E${12 + k}`, f: '=IF(E4="Básico",1,IF(C<=80,"N.A.",tramos 80-120-180-250-400-550-750-1000 → 2…8, si no "Art 3.2.2."))', v: cl.aiE }, { t: 'Intersecciones otros modos', ref: `RESULTADOS IMIV!F${12 + k}`, f: '=IF(F4="Básico",1,IF(D<=160,"N.A.",IF(D<=500,3,IF(D<=2000,6,8))))', v: cl.aiF }];
    // tot: aportes por bloque
    const steps = [{ t: `Total ${C.PER[k]} · ${M.modes[j].label}`, ref: `RESULTADOS IMIV!${C.MODE_COL_TOT[j]}${35 + k}`, f: `=ROUND(${C.MODE_COL_TOT[j]}${21 + k}+${C.MODE_COL_TOT[j]}${28 + k},0)`, v: out.tot[k][j] }, { t: 'Entrada acumulada', ref: `RESULTADOS IMIV!${C.MODE_COL_TOT[j]}${21 + k}`, v: out.ent[k][j] }, { t: 'Salida acumulada', ref: `RESULTADOS IMIV!${C.MODE_COL_TOT[j]}${28 + k}`, v: out.sal[k][j] }, { t: 'Suma antes de redondear', v: out.ent[k][j] + out.sal[k][j] }];
    out.blocks.forEach((b, i) => { const f = out.flows[i], e = f.ent[k][j], s = f.sal[k][j]; if (e !== 0 || s !== 0) steps.push({ t: `${b.sheet}: entrada ${C.MODE_COL_RES[j]}${b.entRow + k} = ${fmt(e)} · salida ${C.MODE_COL_RES[j]}${b.salRow + k} = ${fmt(s)}`, v: e + s, ind: 1, block: b.id }); });
    return steps;
  };
})(typeof window !== 'undefined' ? window : globalThis);
