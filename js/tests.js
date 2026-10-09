/* Pruebas de equivalencia. Referencias: data/testCases.js (libro original recalculado con LibreOffice, NO Excel).
   Estados: aprobado · discrepancia · pendiente · diferencia intencional.
   Tolerancia: flujos |dif| <= 1e-9; totales redondeados, textos y enteros: igualdad exacta. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, M = IMIV.model, C = IMIV.calc, V = IMIV.validation, TC = IMIV.testCases;
  const TOL = 1e-9;
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const maxDiff = (a, b) => { let m = 0; for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) m = Math.max(m, Math.abs(a[k][j] - b[k][j])); return m; };
  const REF = 'Coincide con la referencia (LibreOffice sobre el libro original); falta confirmar en Excel.';
  const row0 = (m) => JSON.stringify(m[0]);
  const bidOfSheet = {}; Object.keys(M.templates).forEach(t => { bidOfSheet[M.templates[t].sheet] = t; });
  bidOfSheet.Casas = 'casas'; bidOfSheet.Departamentos = 'departamentos'; bidOfSheet.Puertos = 'ports_'; bidOfSheet['Terminales TPUB sin Pasajeros'] = 'terminal_sin_pasajeros';
  const comKey = { 'Centros Comerciales': 'centros_comerciales', 'Supermercados-LocalesComercials': 'supermercados', 'Otro Comercio (Vega)': 'vega' };

  function sheetFlows(out, sheet) { // flujos del motor equivalentes a la hoja Excel indicada
    const d = out.detail;
    if (sheet.startsWith('Establec. Educacionales')) { const i = ['Tipo1', 'Tipo2', 'Tip3', 'Tip 4'].findIndex(s => sheet.endsWith(s)); return d.educacionales.parts[i]; }
    if (comKey[sheet]) return d[comKey[sheet]];
    if (sheet === 'Puertos') return d.puertos;
    return d[bidOfSheet[sheet]];
  }
  function runCase(c) {
    const raw = V.defaults();
    Object.keys(c.inputs).forEach(cell => { const id = M.cellToId[cell]; raw[id] = c.inputs[cell] === null ? '' : String(c.inputs[cell]); });
    const p = V.parseInputs(raw, c.mode, {});
    const base = { id: c.id, n: c.n, group: c.group, title: c.title };
    if (p.messages.some(m => m.level === 'error')) return Object.assign(base, { status: 'discrepancia', expected: 'entradas válidas', obtained: p.messages.filter(m => m.level === 'error').map(m => m.text).join(' | '), diff: '—', explanation: 'El caso fue rechazado por la validación.' });
    const out = C.runProject(p.values), g = c.expected;
    const na = JSON.stringify(g.tot).includes('#N/A');
    if (na) {
      const okWeb = out.detail.terminal_sin_pasajeros.wouldBeNA && out.detail.terminal_sin_pasajeros.excluded.length > 0 && out.tot.flat().every(x => typeof x === 'number');
      return Object.assign(base, { status: okWeb ? 'diferencia intencional' : 'discrepancia', expected: 'Excel: #N/A en todos los resultados', obtained: 'Web: US3–US6 excluidas; total PM-L ' + row0(out.tot) + ' (advertencia D2 mostrada)', diff: 'n/a', explanation: c.note });
    }
    const dE = maxDiff(out.ent, g.ent), dS = maxDiff(out.sal, g.sal), dT = maxDiff(out.tot, g.tot);
    const catOk = out.cls.every((x, k) => same([x.e, x.f, x.g], g.cat[k].slice(2)) && x.aiE === g.ai[k][0] && x.aiF === g.ai[k][1]);
    let dSh = 0, shN = 0, labOk = true, shBad = [];
    if (c.sheets) Object.keys(c.sheets).forEach(sh => {
      const gs = c.sheets[sh], r = sheetFlows(out, sh); if (!r) { shBad.push(sh + ': sin equivalente'); return; }
      const d = Math.max(maxDiff(r.ent, gs.ent), maxDiff(r.sal, gs.sal)); dSh = Math.max(dSh, d); shN += 40; if (d > TOL) shBad.push(`${sh}: ${d}`);
      if ('label_ent' in gs) { const lw = r.label === null ? '#N/A' : r.label; if (lw !== gs.label_ent || lw !== gs.label_sal) { labOk = false; shBad.push(`${sh}: etiqueta ${lw} ≠ ${gs.label_ent}`); } }
    });
    // Frontera .5 con ruido binario (p. ej. 106,49999999999999): LibreOffice y la regla de 15 cifras de Excel pueden diferir → pendiente de Excel
    const edge = [];
    for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) if (out.tot[k][j] !== g.tot[k][j]) { const s = Math.abs(out.ent[k][j] + out.sal[k][j]); if (Math.abs((s % 1) - 0.5) < 1e-9 && Math.abs(out.tot[k][j] - g.tot[k][j]) === 1) edge.push(`${C.PER[k]}/${M.modes[j].short}: suma ${Number((out.ent[k][j] + out.sal[k][j]).toPrecision(17))}`); }
    const nEdgeCells = (() => { let n = 0; for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) if (out.tot[k][j] !== g.tot[k][j]) n++; return n; })();
    if (edge.length && edge.length === nEdgeCells && dE <= TOL && dS <= TOL && dSh <= TOL && labOk && !shBad.length)
      return Object.assign(base, { status: 'pendiente', expected: `C35:F35 (PM-L) = ${row0(g.tot)} (LibreOffice)`, obtained: `C35:F35 (PM-L) = ${row0(out.tot)}`, diff: `flujos ≤1e-9; ${edge.length} celda(s) de total difieren en 1`,
        explanation: `Frontera .5 con ruido binario (${edge.join('; ')}). LibreOffice redondeó hacia abajo; excelRound aplica la regla de 15 cifras de Excel (resultado hacia arriba). No se puede decidir sin Excel: confirmar esta celda en Excel (X-01).` });
    const ok = dE <= TOL && dS <= TOL && dT === 0 && catOk && dSh <= TOL && labOk && !shBad.length;
    return Object.assign(base, { status: ok ? 'aprobado' : 'discrepancia',
      expected: `C35:F35 (PM-L) = ${row0(g.tot)} · E4 ${g.cat[0][2]} · F4 ${g.cat[0][3]} · G4 ${g.cat[0][4]} · E12 ${g.ai[0][0]}`,
      obtained: `C35:F35 (PM-L) = ${row0(out.tot)} · E4 ${out.cls[0].e} · F4 ${out.cls[0].f} · G4 ${out.cls[0].g} · E12 ${out.cls[0].aiE}`,
      diff: `ent ${dE.toExponential(1)} · sal ${dS.toExponential(1)} · tot ${dT}` + (shN ? ` · ${shN} celdas de hoja ${dSh.toExponential(1)}` : ''),
      explanation: ok ? REF + (c.note ? ' ' + c.note : '') : 'Revisar: ' + shBad.join('; ') + (catOk ? '' : ' categorías/AI distintas'), });
  }

  function runAll() {
    const T = [];
    const add = (id, n, group, title, status, expected, obtained, diff, explanation) => T.push({ id, n, group, title, status, expected, obtained, diff, explanation });
    TC.cases.forEach(c => T.push(runCase(c)));

    // Barrido de umbrales IMIV (16)
    { const bad = [], keys = Object.keys(TC.m4);
      keys.forEach(k => { const g = TC.m4[k], c = C.classify([[g.priv, g.otros, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])[0];
        if (c.e !== g.E || c.f !== g.F || c.g !== g.G || c.aiE !== g.AI_E || c.aiF !== g.AI_F || c.c !== g.C12 || c.d !== g.D12) bad.push(`${g.priv}/${g.otros}: ${[c.e, c.f, c.g, c.aiE, c.aiF]} ≠ ${[g.E, g.F, g.G, g.AI_E, g.AI_F]}`); });
      add('M4-01', 16, 'Barrido de umbrales IMIV', `Umbrales de categoría y área de influencia (${keys.length} puntos: 19/20/80/81/…/1.001 veh/h y 39/40/160/161/500/501/2.000/2.001 viajes/h)`, bad.length ? 'discrepancia' : 'aprobado', `${keys.length} resultados de Excel`, bad.length ? bad.join(' | ') : `${keys.length} coincidencias`, bad.length, bad.length ? 'Ver detalle.' : REF); }
    { const c = C.classify([[1001, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]])[0];
      add('M4-02', 16, 'Barrido de umbrales IMIV', 'D5: privado > 1.000 veh/h devuelve exactamente «Art 3.2.2.» y «N.A.» permanece como texto', c.aiE === 'Art 3.2.2.' && c.aiF === 'N.A.' && c.f === 'N.A.' ? 'aprobado' : 'discrepancia', '«Art 3.2.2.» / «N.A.» (texto)', `${c.aiE} / ${c.aiF}`, 0, 'Valor de la imagen del Art. 3.2.2 del libro y fórmula E12; sin intersecciones adicionales.'); }

    // Consolidación (M3) y redondeo (15)
    { const val = (r, j) => ((r * 7 + j * 3) % 97) / 8;
      const flows = M.blocks.map(b => ({ ent: C.matrix((k, j) => val(b.entRow + k, j)), sal: C.matrix((k, j) => val(b.salRow + k, j)) }));
      const c = C.consolidate(flows), cl = C.classify(c.tot), g = TC.m3;
      const dE = maxDiff(c.ent, g.ent), dS = maxDiff(c.sal, g.sal), dT = maxDiff(c.tot, g.tot);
      const catOk = cl.every((r, k) => same([r.e, r.f, r.g], g.cat[k].slice(2)) && r.aiE === g.ai[k][2] && r.aiF === g.ai[k][3]);
      add('M3-01', 15, 'Consolidación y redondeo', 'Suma de los 44 bloques (valores inyectados en las 440 celdas de cada columna) y ROUND(entrada+salida,0)', dE <= TOL && dS <= TOL && dT === 0 && catOk ? 'aprobado' : 'discrepancia', `C35:F35 = ${row0(g.tot)}`, `C35:F35 = ${row0(c.tot)}`, `ent ${dE} · sal ${dS} · tot ${dT}`, REF); }
    { const f = M.blocks.map((b, i) => (i === 0 ? { ent: C.matrix((k, j) => (k === 0 && j === 0 ? 0.4 : 0)), sal: C.matrix((k, j) => (k === 0 && j === 0 ? 0.4 : 0)) } : null));
      const c = C.consolidate(f), exp = TC.roundInject.expectedTot;
      add('R-02', 15, 'Consolidación y redondeo', 'Entrada 0,4 + salida 0,4 se suman antes de redondear (RESULTADOS IMIV!D46 = D53 = 0,4)', c.tot[0][0] === exp[0][0] && c.tot[0][0] === 1 ? 'aprobado' : 'discrepancia', `C35 = ${exp[0][0]} (Excel/LibreOffice)`, `C35 = ${c.tot[0][0]}`, Math.abs(c.tot[0][0] - exp[0][0]), 'Redondear cada parte antes habría dado 0.'); }
    { const bad = []; TC.round.forEach(([x, y]) => { const r = C.excelRound(x); if (r !== y) bad.push(`${x}→${r} (ref ${y})`); });
      add('R-01', 15, 'Consolidación y redondeo', `Función excelRound vs ROUND: ${TC.round.length} valores (.5, negativos, residuos binarios como 22,499999999999996)`, bad.length ? 'discrepancia' : 'aprobado', `${TC.round.length} resultados de ROUND`, bad.length ? bad.slice(0, 4).join('; ') : 'idénticos', bad.length, bad.length ? '' : 'Referencia: ROUND de LibreOffice; Math.round no se usa.'); }

    // M2A: 36 plantillas, hoja a hoja, y factor 2,5
    { const todo = TC.cases.find(c => c.id === 'E-07'), bad = []; let n = 0;
      const raw = V.defaults(); Object.keys(todo.inputs).forEach(cell => { raw[M.cellToId[cell]] = String(todo.inputs[cell]); });
      const out = C.runProject(V.parseInputs(raw, 'user', {}).values);
      Object.keys(M.templates).forEach(tid => { const s = M.templates[tid].sheet, g = TC.sheetsTodo[s], r = out.detail[tid]; const d = Math.max(maxDiff(r.ent, g.ent), maxDiff(r.sal, g.sal)); n += 40; if (d > TOL) bad.push(`${s}: ${d}`); });
      add('M2A-01', 3, 'Plantillas simples', `36 hojas de plantilla: ${n} celdas de flujo (N8:Q12, N15:Q19) vs hoja Excel`, bad.length ? 'discrepancia' : 'aprobado', `${n} celdas`, bad.length ? bad.join('; ') : 'idénticas (≤1e-9)', bad.length, REF); }
    { const nb = Object.values(M.templates).filter(t => t.factorPriv !== 1).map(t => t.sheet).sort().join(' | '), o = C.calcTemplate('oficinas', 10000);
      add('M2A-02', 13, 'Bodegas Industriales', 'Factor 2,5 sólo en privado y sólo en Bodegas y Relleno (los otros modos y las demás 34 hojas sin factor)', nb === 'Bodegas Industriales | Relleno Sanitario' && C.calcTemplate('bodegas_industriales', 100).ent[0][1] === 1 * IMIV.rates.plantilla.bodegas_industriales.ent['PM-L'][1] && o.ent[0][0] === 100 * IMIV.rates.plantilla.oficinas.ent['PM-L'][0] ? 'aprobado' : 'discrepancia', 'Factor sólo en Bodegas y Relleno', nb, 0, 'Ver también E-13 y E-14 contra Excel.'); }

    // M2B: barrido de tramos de superficie promedio
    { const bad = []; let n = 0; const mk = { Casas: 'casas', Departamentos: 'departamentos' };
      Object.keys(TC.tramos).forEach(a => { const g = TC.tramos[a]; ['Casas', 'Departamentos'].forEach(sh => { const gs = g.sheets[sh], r = C.calcViviendas(mk[sh], g.viviendas, gs.c4, []); const d = Math.max(maxDiff(r.ent, gs.ent), maxDiff(r.sal, gs.sal)); n += 40; if (d > TOL) bad.push(`${sh} ${a}: ${d}`); }); });
      add('M2B-01', 3, 'Sólo Departamentos / Casas', `Tablas de tasas por tramo (≤50, 50–60, 60–140, 140–280, >280 y bordes) en Casas y Departamentos: ${n} celdas`, bad.length ? 'discrepancia' : 'aprobado', `${n} celdas`, bad.length ? bad.join('; ') : 'idénticas (≤1e-9)', bad.length, 'Para Casas la referencia se obtuvo sobrescribiendo B5 en una copia del libro (la web no permite editarlo, D1); se prueba la tabla de tasas, no un campo de la web.'); }
    { const c = C.calcCasas(100), z = C.calcCasas(0), noEdit = !M.inputs.some(f => f.cell === 'B5');
      add('M2B-02', 2, 'Sólo Casas', 'D1: B5 = 61 × B6 como parámetro interno; no existe campo editable de superficie para Casas; sólo se activa el tramo 60–140 m²', c.c4 === 61 && c.dummies.join('') === '00100' && z.c4 === 0 && noEdit && M.constants.CASAS_SUP_UTIL_M2_POR_VIVIENDA.value === 61 ? 'aprobado' : 'discrepancia', 'C4 = 61; dummies 00100', `C4 = ${c.c4}; dummies ${c.dummies.join('')}; campo B5 editable: ${!noEdit}`, 0, 'Comportamiento de diseño (D1); la parte numérica se compara en E-02.'); }

    // Terminal sin pasajeros (D2)
    { const raw = V.defaults(); raw['terminal_sin_pasajeros.frec.us3.PM-L'] = '5'; const p = V.parseInputs(raw, 'user', {}), out = C.runProject(p.values);
      const dis = M.inputs.filter(f => f.module === 'M2F' && !f.enabled).length;
      add('M2F-01', 17, 'Terminal TPUB sin Pasajeros', 'D2: US3–US6 (y flota duplicada) deshabilitadas, excluidas del cálculo y con advertencia visible', out.tot.flat().every(x => x === 0) && p.messages.some(m => m.text.includes('US3–US6')) && dis === 4 * 3 + 4 * 5 ? 'aprobado' : 'discrepancia', 'excluidas + advertencia', `${dis} campos deshabilitados; advertencia: ${p.messages.some(m => m.text.includes('US3–US6'))}`, 0, 'Comportamiento de diseño; el Excel original devolvería #N/A (ver E-17e).'); }

    // Comercio: texto de etiqueta sin escala (D4)
    { const a = C.commerceLabel('vega', 250), b = C.commerceLabel('supermercados', 6000), ok = C.commerceLabel('supermercados', 7000);
      add('M2D-01', 10, 'Límites comerciales', 'D4: sin escala (carga 250 en Vega y 6.000 en Supermercados) la etiqueta es nula (#N/A del Excel) y la interfaz muestra el texto aprobado', a === null && b === null && ok === 'Equipamiento Mayor' && M.notes.sinEscala === 'Sin escala aplicable según la lógica actual del Excel.' ? 'aprobado' : 'discrepancia', '#N/A → «Sin escala aplicable según la lógica actual del Excel.»', `${a} / ${b}`, 0, 'Las dummies de flujo no cambian (ver E-10_*).'); }

    // Validación web (D6): comportamiento propio, sin valor de referencia en Excel
    const P = (v, m) => V.parseField(v, m), vt = (id, title, ok, exp, obt) => add(id, 0, 'Validación web (D6)', title, ok ? 'aprobado' : 'discrepancia', exp, obt, '—', 'Comportamiento de la web (diferencia intencional, sin referencia en Excel).');
    vt('V-01', 'Texto bloqueado en ambos modos y nunca convertido en 0', ['abc', '12a', '1e3', '--5', '1.2.3'].every(s => P(s, 'user').error && P(s, 'audit').error), 'error', 'error en 5 de 5');
    vt('V-02', 'Negativos: bloqueados en modo usuario; permitidos con aviso en modo auditoría', P('-5', 'user').error && P('-5', 'audit').value === -5 && !!P('-5', 'audit').warn && P(-5, 'user').error && P(-5, 'audit').value === -5, 'usuario: error · auditoría: −5 con aviso', 'ok');
    vt('V-03', 'Campo vacío = 0 (cadena vacía, espacios, null)', ['', '  ', null, undefined].every(s => P(s, 'user').value === 0 && P(s, 'user').empty), '0', '0');
    vt('V-04', 'Decimal con punto o coma; separador de miles no admitido y avisado', P('1,5', 'user').value === 1.5 && P('1.5', 'user').value === 1.5 && P('1.000', 'user').value === 1 && !!P('1.000', 'user').warn, '1,5 · 1.5 · «1.000» → 1 con aviso', 'ok');
    { const p = V.parseInputs(Object.assign(V.defaults(), { 'oficinas.cantidad': 'abc', 'casas.viviendas': '100' }), 'user', {}); const st = IMIV.state, snap = { raw: st.raw, off: st.off, mode: st.mode, lc: st.loadedCase }; st.raw = Object.assign(V.defaults(), { 'oficinas.cantidad': 'abc' }); st.off = {}; st.mode = 'user'; st.recompute(); const stopped = st.out === null; st.raw = snap.raw; st.off = snap.off; st.mode = snap.mode; st.loadedCase = snap.lc; st.recompute(); // restaura el estado del usuario
      vt('V-05', 'Un texto inválido se informa por campo y el cálculo no se ejecuta (sin #VALUE! global)', p.messages.filter(m => m.level === 'error').length === 1 && stopped, '1 error de campo, sin resultados', `${p.messages.filter(m => m.level === 'error').length} error; cálculo detenido: ${stopped}`); }
    { const p = V.parseInputs(Object.assign(V.defaults(), { 'departamentos.viviendas': '10', 'departamentos.superficie_util': '0' }), 'user', {});
      vt('V-06', 'Advertencia EX-03 (viviendas > 0 y superficie = 0)', p.messages.some(m => m.level === 'warn' && /EX-03/.test(m.text)), 'advertencia', 'ok'); }
    { const p = V.parseInputs(Object.assign(V.defaults(), { 'educacionales.tipo1.codigo': '7' }), 'user', {}), q = V.parseInputs(Object.assign(V.defaults(), { 'educacionales.tipo1.codigo': '7' }), 'audit', {});
      vt('V-07', 'Código de tipo fuera de lista: error en modo usuario; el motor lo acepta en modo auditoría (como el Excel)', p.messages.some(m => m.level === 'error') && !q.messages.some(m => m.level === 'error'), 'usuario: error · auditoría: permitido', 'ok'); }

    // Pendiente real: confirmación en Excel
    add('X-01', 0, 'Confirmación en Excel', 'Confirmar en Excel una muestra de los casos de referencia (E-04a, E-04d, E-06, E-10_1000, E-17a, E-07)', 'pendiente', 'valores calculados por Excel', 'sin ejecutar', '—', 'Las referencias de esta sección provienen de LibreOffice; copie los valores desde Excel y compárelos (ver docs/VALIDACION.md).');
    return T;
  }
  IMIV.tests = { runAll, runCase };
})(typeof window !== 'undefined' ? window : globalThis);
