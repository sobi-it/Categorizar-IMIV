/* Interfaz. Sólo presentación: el cálculo está en js/calculations/*, el estado en js/state.js, los formatos en js/format.js
   y las tablas/informe en js/report.js. Este archivo no contiene fórmulas, tasas ni reglas de clasificación. */
(function () {
  'use strict';
  const IMIV = window.IMIV, M = IMIV.model, R = IMIV.rates, C = IMIV.calc, S = IMIV.state, TC = IMIV.testCases, F = IMIV.format, RP = IMIV.report;
  const PER = C.PER;
  const U = { tab: 'general', filtro: 'todos', q: '', showAll: false, blk: 'oficinas', tests: null, tfilter: 'todos', techOpen: false, techTab: 'traza', decimals: false, report: false, tr: { kind: 'block', block: 'oficinas', dir: 'ent', k: 0, j: 0 } };
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const chip = (t, c) => `<span class="chip ${c || ''}">${esc(t)}</span>`;
  const idOf = id => 'f_' + id.replace(/[^a-z0-9_]/gi, '_');
  const audit = () => S.mode === 'audit';
  const fmt = () => (U.decimals && audit() ? { decimals: 3 } : undefined);       // sólo auditoría: ver valores internos
  const TIPO_EDU = { 0: 'Sin tipo (0)', 1: '1 · Parvularia y Pre-básica', 2: '2 · Básica, Media, Especial y Técnico-profesional', 3: '3 · Superior', 4: '4 · Otros' };
  const TIPO_PTO = { 0: 'Sin tipo (0)', 1: '1 · Puerto con contenedores', 2: '2 · Puerto de carga a granel' };
  const TR = ['≤ 50 m²', '50 – 60 m²', '60 – 140 m²', '140 – 280 m²', '> 280 m²'];

  /* ---------- Campos y tarjetas de entrada ---------- */
  function fieldHTML(f) {
    const v = S.raw[f.id] == null ? '' : S.raw[f.id], dis = !f.enabled, ref = `INPUTS PROYECTO!${f.cell} → ${f.sheetCell}`;
    let ctl;
    if (f.kind === 'code') {
      const labels = f.id.startsWith('puertos') ? TIPO_PTO : TIPO_EDU, opts = f.options.map(o => `<option value="${o}" ${String(v) === String(o) ? 'selected' : ''}>${esc(labels[o])}</option>`);
      if (!f.options.map(String).includes(String(v))) opts.push(`<option value="${esc(v)}" selected>${esc(v)} (fuera de lista; sólo auditoría)</option>`);
      ctl = `<select id="${idOf(f.id)}" data-field="${esc(f.id)}" ${dis ? 'disabled' : ''}>${opts.join('')}</select>`;
    } else ctl = `<input id="${idOf(f.id)}" type="text" inputmode="decimal" autocomplete="off" data-field="${esc(f.id)}" value="${esc(v)}" placeholder="0" ${dis ? 'disabled title="' + esc(f.disabledReason || '') + '"' : ''}>`;
    return `<div class="field"><label for="${idOf(f.id)}">${esc(f.label)} <span class="unit">(${esc(f.unit)})</span> ${dis ? chip('Deshabilitado', 'block') : ''}</label>${ctl}
      <div class="fmsg" data-msg="${esc(f.id)}"></div>${f.help ? `<div class="help">${esc(f.help)}</div>` : ''}${dis ? `<div class="help">${esc(f.disabledReason)}</div>` : ''}<div class="cell">${esc(ref)}</div></div>`;
  }
  const blockFields = bid => M.inputs.filter(f => f.block === bid);
  function blockCard(bid, extra) {
    const on = S.isActive(bid), fs = blockFields(bid), b = M.blocks.find(x => x.id === bid), title = RP.displayNameById(bid);
    const sheets = b.family === 'education' ? '4 hojas «Establec. Educacionales»' : b.sheet;
    return `<div class="card ${on ? '' : 'off'}" data-block="${bid}"><h3>${esc(title)} <span class="sub">Hoja Excel: ${esc(sheets)}</span> <label><input type="checkbox" data-toggle="${bid}" ${on ? 'checked' : ''}> Incluir en el cálculo</label></h3>
      ${on ? (extra || '') + `<div class="grid">${fs.map(fieldHTML).join('')}</div>` : '<div class="help">Excluida del cálculo (sus campos se toman como 0). Marque «Incluir» para editarla.</div>'}</div>`;
  }
  const groupBlocks = g => { const seen = []; M.inputs.filter(f => f.group === g).forEach(f => { if (!seen.includes(f.block)) seen.push(f.block); }); return seen; };
  const matches = bid => { const f = M.inputs.find(x => x.block === bid); return !U.q || (RP.displayNameById(bid) + ' ' + f.label).toLowerCase().includes(U.q.toLowerCase()); };
  function extraFor(bid) {
    if (bid === 'casas') return `<div class="note">${esc(M.notes.casas)}</div><div class="cell" data-live="casas"></div>`;
    if (bid === 'departamentos') return `<div class="cell" data-live="departamentos"></div>`;
    if (bid === 'educacionales') return `<div class="note pend">Cada establecimiento elige su tabla de tasas por el código de tipo. El Excel suma las cuatro hojas.</div><div class="cell" data-live="educacionales"></div>`;
    if (['centros_comerciales', 'supermercados', 'vega'].includes(bid)) return `<div class="note warn">${esc(M.notes.escalas)}</div><div class="cell" data-live="${bid}"></div>`;
    if (bid === 'puertos') return `<div class="cell" data-live="puertos"></div>`;
    return '';
  }
  const pageHead = (t, d) => `<div class="pagehead"><h2>${esc(t)}</h2>${chip('Entradas del proyecto', 'pend')}<p>${esc(d)}</p></div>`;
  const filterBox = () => `<div class="card"><label>Buscar tipología <input class="gen" id="q" type="text" value="${esc(U.q)}" placeholder="p. ej. oficinas, hospital, estadio"></label></div>`;
  const tabResid = () => pageHead('2. Residencial', 'Proyectos residenciales y hospedaje.') + RP.RESID_ORDER.map(b => blockCard(b, extraFor(b))).join('');   // orden visual
  const tabEquip = () => pageHead('3. Equipamiento', 'Equipamiento comercial, educacional, salud, deportivo, cultural y otros.') + filterBox() + groupBlocks('equipamiento').filter(matches).map(b => blockCard(b, extraFor(b))).join('');
  const tabAct = () => pageHead('4. Actividades productivas', 'Industrias, bodegas, talleres y plantas de revisión técnica.') + filterBox() + groupBlocks('actividades').filter(matches).map(b => blockCard(b, extraFor(b))).join('');
  function inputCell(f) { const v = S.raw[f.id] == null ? '' : S.raw[f.id]; return `<input id="${idOf(f.id)}" type="text" inputmode="decimal" data-field="${esc(f.id)}" value="${esc(v)}" placeholder="0" style="width:84px;text-align:right;padding:6px;border:1px solid #9aa4b5;border-radius:6px" ${f.enabled ? '' : 'disabled title="' + esc(f.disabledReason) + '"'}><div class="fmsg" data-msg="${esc(f.id)}"></div>`; }
  function terminalCard() {
    const on = S.isActive('terminal_sin_pasajeros'), fl = M.inputs.filter(f => f.id.includes('.flota.')), fq = M.inputs.filter(f => f.id.includes('.frec.'));
    const flRows = [0, 1, 2, 3, 4, 5].map(r => { const cs = fl.filter(f => f.id.includes('.flota.' + (r + 1) + '.')); return `<tr><td class="l">${esc(cs[0].label.replace(/ · tipo.*/, '').replace('Flota ', ''))} ${cs[0].enabled ? chip('Activa', 'ok') : chip('Bloqueada', 'block')}</td>${cs.map(f => `<td>${inputCell(f)}</td>`).join('')}<td class="l cell">U${5 + r}:W${5 + r}</td></tr>`; }).join('');
    const frRows = [0, 1, 2, 3, 4, 5].map(r => { const cs = fq.filter(f => f.id.includes('.frec.us' + (r + 1) + '.')); return `<tr><td class="l">US${r + 1} ${cs[0].enabled ? chip('Activa', 'ok') : chip('Bloqueada (D2)', 'block')}</td>${cs.map(f => `<td>${inputCell(f)}</td>`).join('')}<td class="l cell">U${14 + r}:Y${14 + r}</td></tr>`; }).join('');
    return `<div class="card ${on ? '' : 'off'}" data-block="terminal_sin_pasajeros"><h3>Terminal de buses sin pasajeros ${chip('Pendiente de validación independiente', 'pend')} <span class="sub">Hoja Excel: Terminales TPUB sin Pasajeros</span> <label><input type="checkbox" data-toggle="terminal_sin_pasajeros" ${on ? 'checked' : ''}> Incluir en el cálculo</label></h3>
      <div class="note err"><b>Advertencia.</b> ${esc(M.notes.us36)} Las filas no se ocultan: se muestran deshabilitadas.</div>
      ${on ? `<h3>Flota por servicio y tipo de bus</h3><div class="tw"><table><thead><tr><th>Servicio (rótulo Excel)</th><th>Taxibus (A) · ×${R.terminal.factors.A}</th><th>Bus (B2) · ×${R.terminal.factors.B2}</th><th>Bus articulado (C2) · ×${R.terminal.factors.C2}</th><th>Celdas</th></tr></thead><tbody>${flRows}</tbody></table></div>
      <h3>Frecuencia por servicio y período (buses/h)</h3><div class="tw"><table><thead><tr><th>Servicio</th>${PER.map(p => `<th>${p}</th>`).join('')}<th>Celdas</th></tr></thead><tbody>${frRows}</tbody></table></div><div data-live="terminal_sin_pasajeros" class="cell"></div>` : '<div class="help">Excluido del cálculo.</div>'}</div>`;
  }
  const tabInfra = () => pageHead('5. Infraestructura y terminales', 'Terminales, aeropuertos, puertos y rellenos sanitarios.') + groupBlocks('infraestructura').filter(b => b !== 'terminal_sin_pasajeros').map(b => blockCard(b, extraFor(b))).join('') + terminalCard();

  /* ---------- 1. Datos generales ---------- */
  function tabGeneral() {
    const act = S.out ? RP.typologyRows(S.out, S) : [];
    const fld = (k, l, ph) => `<div class="field"><label>${l}</label><input class="gen" data-meta="${k}" type="text" style="text-align:left;width:100%" value="${esc(S.meta[k] || '')}" placeholder="${esc(ph || '')}"></div>`;
    return pageHead('1. Datos generales del proyecto', 'Identificación del proyecto; aparece en el informe y no participa en el cálculo.') +
      `<div class="card"><div class="grid">${fld('nombre', 'Nombre del proyecto', 'p. ej. Edificio residencial Av. Ejemplo 123')}${fld('analista', 'Analista / consultor')}${fld('fecha', 'Fecha del proyecto (aaaa-mm-dd)')}${fld('archivo', 'Archivo o modelo utilizado (opcional)', M.source)}${fld('notas', 'Observaciones')}</div></div>
      <div class="card"><h3>Cómo se usa</h3><ol><li>Complete las secciones <b>2 a 5</b> con los datos del proyecto. Cada tipología puede incluirse o excluirse; un campo vacío vale 0.</li><li>Pulse <b>Calcular</b> para ver los <b>resultados del cálculo</b> (secciones 6 y 7). Se actualizan además al escribir.</li><li>Use <b>Imprimir / Guardar Informe</b> para generar el informe; desde allí puede guardarlo como PDF.</li></ol>
      <div class="note">Los 5 períodos (PM-L, PMD-L, PT-L, PMD-F, PT-F), la entrada y la salida, y los 4 modos (privado, público, peatones, ciclos) se mantienen siempre separados.</div></div>
      <div class="card"><h3>Tipologías con flujo en el cálculo actual</h3>${S.out ? (act.length ? act.map(a => chip(a.name)).join(' ') : '<span class="help">Ninguna (todos los valores en cero).</span>') : '<span class="help">Cálculo detenido por errores de entrada: revise los campos marcados en rojo.</span>'}</div>`;
  }

  /* ---------- Resultados ---------- */
  const stopped = () => `<div class="note err"><b>Cálculo detenido.</b> Corrija ${S.errs} error(es) de entrada antes de calcular:<ul>${S.msgs.filter(m => m.level === 'error').map(m => `<li>${esc(m.text)}</li>`).join('')}</ul></div>`;
  const band = (t, d) => `<div class="resband"><h2>Resultados del cálculo</h2><span>${esc(t)}${d ? ' · ' + esc(d) : ''}</span></div>`;
  const secTitle = (n, t) => `<div class="sec-title"><span class="n">${n}</span><h2>${esc(t)}</h2></div>`;
  function commerceNote(b, f) {
    if (b.family !== 'commerce') return '';
    return `<div class="note ${f.sinEscala ? 'warn' : ''}">Escala (etiqueta del Excel): <b>${f.label ? esc(f.label) : esc(M.notes.sinEscala)}</b>. ${esc(M.notes.escalas)}</div>`;
  }
  function tabFlujos() {
    if (!S.out) return band('Flujos por tipología') + stopped();
    const o = S.out, items = o.blocks.map((b, i) => ({ b, f: o.flows[i] })).filter(x => U.showAll || !RP.allZero(x.f));
    return band('Flujos por tipología', 'detalle de entrada y salida por período y modo') + `<div class="card"><label><input type="checkbox" id="showall" ${U.showAll ? 'checked' : ''}> Mostrar también tipologías sin flujo</label> <span class="help">Valores en números enteros. Transporte privado en veh/h; otros modos en viajes/h.</span></div>` +
      (items.length ? items.map(({ b, f }) => `<div class="card"><h3>${esc(RP.displayName(b))} <span class="sub">Hoja Excel: ${esc(b.sheet)}</span></h3>
        <div class="two"><div><h4>Flujo de entrada</h4>${RP.matrixHTML(f.ent, { fmt: fmt(), attrs: audit() ? `data-kind="block" data-block="${b.id}" data-dir="ent"` : '' })}</div><div><h4>Flujo de salida</h4>${RP.matrixHTML(f.sal, { fmt: fmt(), attrs: audit() ? `data-kind="block" data-block="${b.id}" data-dir="sal"` : '' })}</div></div>${b.id === 'terminal_sin_pasajeros' && f.wouldBeNA ? `<div class="note err">${esc(M.notes.us36)}</div>` : ''}${commerceNote(b, f)}</div>`).join('') : '<div class="note">Sin tipologías con flujo: ingrese datos en las secciones de entrada.</div>');
  }
  function techSection() {
    if (!audit()) return '';
    const tabs = [['traza', 'Trazabilidad y tasas'], ['valid', 'Validación y pruebas'], ['adv', 'Advertencias, excepciones y decisiones']];
    const body = U.techTab === 'valid' ? techValid() : U.techTab === 'adv' ? techAdv() : techTraza();
    return `<details class="tech" id="tech" ${U.techOpen ? 'open' : ''}><summary>Herramientas técnicas de validación y auditoría</summary><div class="techin">
      <div class="subnav">${tabs.map(([id, l]) => `<button data-tt="${id}" aria-pressed="${U.techTab === id}">${l}</button>`).join('')}<label><input type="checkbox" id="dec" ${U.decimals ? 'checked' : ''}> Mostrar decimales internos en las tablas de resultados</label></div>${body}</div></details>`;
  }
  function tabConsol() {
    if (!S.out) return band('Resultados consolidados') + stopped() + techSection();
    const o = S.out, click = audit();
    return band('Resultados consolidados', 'calculados a partir de las entradas; no son editables') +
      secTitle(1, 'Resumen final IMIV') + RP.kpiHTML(o) +
      secTitle(2, 'Categoría IMIV') + `<div class="card tw">${RP.catTableHTML(o, { fmt: fmt(), click })}</div>` +
      secTitle(3, 'Número de intersecciones y área de influencia') + `<div class="card tw">${RP.aiTableHTML(o, { fmt: fmt(), click })}<div class="help">«N.A.» y «Art 3.2.2.» son resultados textuales del modelo. ${o.cls.some(r => r.aiE === 'Art 3.2.2.') ? esc(M.notes.art322) : ''}</div></div>` +
      secTitle(4, 'Flujos inducidos totales') + `<div class="card">${RP.flowTablesHTML(o, { fmt: fmt(), click })}<div class="help">Cada valor se muestra como entero. El total suma entrada y salida antes de redondear, por lo que la suma de las cifras mostradas puede diferir del total en una unidad.</div></div>` +
      secTitle(5, 'Flujos por tipología') + `<div class="card">${RP.typoTablesHTML(o, S, { fmt: fmt() })}<p><button class="b sec" data-tab="flujos">Ver detalle de entrada y salida por tipología →</button></p></div>` +
      secTitle(6, 'Notas, advertencias y detalle técnico') + `<div class="card">${RP.notesHTML(o, S)}</div>` + (audit() ? techSection() : '<p class="help">Las herramientas técnicas de validación y auditoría están disponibles en el modo «Auditoría» (selector superior).</p>');
  }

  /* ---------- 8. Informe final ---------- */
  function tabInforme() {
    if (!S.out) return band('Informe final') + stopped();
    return `<div class="resband"><h2>Informe final</h2><span>presentación ejecutiva para entregar o incorporar a un informe técnico</span></div>
      <div class="card"><p><button class="b accent" style="margin-left:0" data-act="report">Abrir vista de informe e imprimir / guardar PDF</button></p><div class="help">La vista previa a continuación es la misma que se imprime. No se pierden los datos al volver.</div>${RP.html(S)}</div>`;
  }
  function openReport() {
    if (!S.out) { go('consol'); return; }
    $('#paper-host').innerHTML = RP.html(S); U.report = true; document.body.classList.add('report-mode'); $('#report-view').hidden = false; window.scrollTo(0, 0);
  }
  function closeReport() { U.report = false; document.body.classList.remove('report-mode'); $('#report-view').hidden = true; }

  /* ---------- Herramientas técnicas (sólo modo auditoría) ---------- */
  const stepsHTML = steps => `<ol class="expl">${steps.map(s => s.head ? `<li class="head">${esc(s.t)}</li>` : `<li style="margin-left:${(s.ind || 0) * 16}px">${esc(s.t)}${s.ref ? ` <code>${esc(s.ref)}</code>` : ''}${s.v !== undefined ? ` → <span class="v">${esc(IMIV.trace.fmt(s.v))}</span>` : ''}${s.f ? `<span class="f">${esc(s.f)}</span>` : ''}</li>`).join('')}</ol>`;
  const rateTable = (obj, ref) => `<div class="tw"><table><thead><tr><th>Período</th>${M.modes.map(m => `<th>${m.short}</th>`).join('')}</tr></thead><tbody>${PER.map(p => `<tr><td>${p}</td>${obj[p].map(x => `<td>${F.formatResult(x, { decimals: 6 })}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="cell">${esc(ref)}</div>`;
  const toObj = m => Object.fromEntries(PER.map((p, k) => [p, m[k]]));
  function ratesViewer(b) {
    const sh = b.sheet, d = S.out && S.out.detail[b.id];
    if (M.templates[b.id]) { const T = M.templates[b.id], r = R.plantilla[b.id]; return `<div class="note">Hoja <b>${esc(sh)}</b>. Unidad de referencia L12/L19 = ${T.divisor === 'C4/100' ? '$C$4/100' : '$C$4'}. ${T.factorPriv !== 1 ? `Factor sólo en transporte privado: × ${T.factorPriv} (N4).` : 'Sin factor adicional.'}</div><div class="two"><div><b>Entrada</b>${rateTable(r.ent, sh + '!E8:H12')}</div><div><b>Salida</b>${rateTable(r.sal, sh + '!E15:H19')}</div></div>`; }
    if (b.family === 'viviendas') { const rv = R.viviendas[b.id], c4 = d ? d.c4 : 0;
      return `<div class="note">${esc(rv.dummyRule)}. C4 actual = ${F.formatResult(c4, { decimals: 2 })} m².</div>` + rv.tramos.map((t, i) => { const act = d && d.dummies[i] === 1, ev = C.tramoRates(t, c4);
        return `<details ${act ? 'open' : ''}><summary><b>${TR[i]}</b> ${act ? chip('activo', 'ok') : chip('inactivo')} <span class="cell">dummy ${esc(t.cells.dummy)}</span></summary>${t.kind === 'formula' ? `<div class="note">Tasa base = ${t.base.a} + ${t.base.b} × (C4 − ${t.base.x0}) en ${t.base.cellEnt} (entrada, PT-L) y ${t.base.cellSal} (salida, PM-L); otros períodos = ${t.otherFactor} × base; tasa por modo = base × reparto [${t.share.join(' ; ')}].</div>` : ''}<div class="two"><div><b>Entrada</b>${rateTable(toObj(ev.ent), sh + '!' + t.cells.ent)}</div><div><b>Salida</b>${rateTable(toObj(ev.sal), sh + '!' + t.cells.sal)}</div></div></details>`; }).join(''); }
    if (b.family === 'education') return `<div class="note">${esc(R.education.sumOrder)}. Dummy G = IF(C4 = n, 1, 0).</div>` + R.education.tipos.map(t => `<details><summary><b>Tipo ${t.tipo}: ${esc(t.label)}</b></summary><div class="two"><div><b>Entrada</b>${rateTable(t.ent, `Establec. Educacionales!C${t.entRow}:F${t.entRow + 4}`)}</div><div><b>Salida</b>${rateTable(t.sal, `Establec. Educacionales!C${t.salRow}:F${t.salRow + 4}`)}</div></div></details>`).join('');
    if (b.family === 'commerce') { const Cm = R.commerce[b.id]; return `<div class="note warn">${esc(M.notes.escalas)}</div>` + Cm.scales.map((s, i) => `<details ${d && d.dummies[i] ? 'open' : ''}><summary><b>${esc(s.label)}</b> <span class="cell">${esc(s.ruleText)}</span> ${d && d.dummies[i] ? chip('activa', 'ok') : ''}</summary><div class="two"><div><b>Entrada</b>${rateTable(s.ent, `${sh}!F${s.entRow}:I${s.entRow + 4}`)}</div><div><b>Salida</b>${rateTable(s.sal, `${sh}!F${s.salRow}:I${s.salRow + 4}`)}</div></div></details>`).join(''); }
    if (b.family === 'ports') return R.ports.tipos.map(t => `<details><summary><b>Tipo ${t.tipo}: ${esc(t.label)}</b></summary><div class="two"><div><b>Entrada</b>${rateTable(t.ent, `Puertos!C${t.entRow}:F${t.entRow + 4}`)}</div><div><b>Salida</b>${rateTable(t.sal, `Puertos!C${t.salRow}:F${t.salRow + 4}`)}</div></div></details>`).join('');
    return `<div class="note">${esc(R.terminal.note)} Factores veq/veh: Taxibus ${R.terminal.factors.A} (C21) · Bus ${R.terminal.factors.B2} (C22) · Bus articulado ${R.terminal.factors.C2} (C23).</div>`;
  }
  function techTraza() {
    const t = U.tr, o = S.out, b = M.blocks.find(x => x.id === U.blk) || M.blocks[0];
    const sel = `<div class="grid"><label>Tipología <select id="tr-block">${M.blocks.map(x => `<option value="${x.id}" ${t.block === x.id ? 'selected' : ''}>${esc(x.sheet)}</option>`).join('')}</select></label>
      <label>Entrada / salida <select id="tr-dir"><option value="ent" ${t.dir === 'ent' ? 'selected' : ''}>Entrada</option><option value="sal" ${t.dir === 'sal' ? 'selected' : ''}>Salida</option></select></label>
      <label>Período <select id="tr-k">${PER.map((p, i) => `<option value="${i}" ${t.k === i ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
      <label>Modo <select id="tr-j">${M.modes.map((m, i) => `<option value="${i}" ${t.j === i ? 'selected' : ''}>${m.label}</option>`).join('')}</select></label></div>
      <p><button class="b sec" data-tr="block">Cadena completa de la tipología</button> <button class="b sec" data-tr="tot">Total consolidado</button> <button class="b sec" data-tr="cat">Categorías IMIV</button> <button class="b sec" data-tr="ai">Área de influencia</button></p>`;
    return `<h3>Trazabilidad: ${esc(t.kind === 'block' ? 'cadena de la tipología' : t.kind === 'tot' ? 'total consolidado' : t.kind === 'cat' ? 'categorías' : 'área de influencia')}</h3>${sel}${o ? stepsHTML(IMIV.trace.explain(o, t)) : stopped()}
      <h3>Tablas de tasas y parámetros vigentes</h3><label>Tipología <select id="sel-blk">${M.blocks.map(x => `<option value="${x.id}" ${x.id === b.id ? 'selected' : ''}>${esc(x.sheet)}</option>`).join('')}</select></label>${ratesViewer(b)}`;
  }
  const stClass = s => (s === 'aprobado' ? 'st-aprobado' : s === 'discrepancia' ? 'st-discrepancia' : s === 'pendiente' ? 'st-pendiente' : 'st-diferencia');
  function techValid() {
    const t = U.tests, msgs = S.msgs.length ? `<ul>${S.msgs.map(m => `<li>${chip(m.level === 'error' ? 'Error' : 'Aviso', m.level === 'error' ? 'err' : 'warn')} ${esc(m.text)}</li>`).join('')}</ul>` : '<p>Sin errores ni avisos en las entradas actuales.</p>';
    let tb = '';
    if (t) { const cnt = {}; t.forEach(x => { cnt[x.status] = (cnt[x.status] || 0) + 1; }); const groups = ['todos', ...Array.from(new Set(t.map(x => x.group)))], rows = t.filter(x => U.tfilter === 'todos' || x.group === U.tfilter);
      tb = `<p>${Object.keys(cnt).map(k => chip(`${k}: ${cnt[k]}`, k === 'aprobado' ? 'ok' : k === 'discrepancia' ? 'err' : k === 'pendiente' ? 'pend' : 'warn')).join(' ')} <label>Grupo <select id="tfilter">${groups.map(g => `<option ${g === U.tfilter ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select></label></p>
      <div class="tw"><table><thead><tr><th>ID</th><th>Grupo</th><th>Prueba</th><th>Esperado</th><th>Obtenido</th><th>Diferencia</th><th>Estado</th><th>Explicación</th></tr></thead><tbody>${rows.map(x => `<tr><td class="l">${esc(x.id)}</td><td class="l">${esc(x.group)}</td><td class="l">${esc(x.title)}</td><td class="l cell">${esc(x.expected)}</td><td class="l cell">${esc(x.obtained)}</td><td class="l cell">${esc(x.diff)}</td><td class="l ${stClass(x.status)}">${esc(x.status)}</td><td class="l cell">${esc(x.explanation)}</td></tr>`).join('')}</tbody></table></div>`; }
    return `<h3>Mensajes de validación de las entradas actuales</h3>${msgs}<h3>Pruebas de equivalencia</h3><p><button class="b" data-act="runtests">Ejecutar pruebas</button></p>
      <div class="note">Los valores de referencia provienen del libro original recalculado con LibreOffice, <b>no de Excel</b>. «aprobado» = coincide con esa referencia; no se declara equivalencia con Excel hasta confirmar la muestra pendiente (X-01).</div>${tb || '<p class="help">Pulse «Ejecutar pruebas».</p>'}`;
  }
  const PEND_DEC = [['D7', 'Redondeo: regla de 15 cifras de Excel; el caso E-04d difiere de LibreOffice en una frontera .5 con ruido binario.', 'Confirmar en Excel'], ['D8', 'Factor 2,5 sólo en transporte privado de Bodegas Industriales y Relleno Sanitario.', 'Confirmar'], ['D9', 'Educacionales: lista cerrada 0–4 en la interfaz; el Excel acepta cualquier código.', 'Confirmar'], ['D10', 'Rótulos erróneos del Excel corregidos sólo en la presentación.', 'Confirmar lista'], ['D11', 'Tasas de Casas y Departamentos: las columnas D:G no suman la columna C en la mayoría de los tramos.', 'Confirmar'], ['D12', 'Significado de PM/PMD/PT y L/F no definido en el libro (PMd vs PMD).', 'Confirmar'], ['D13', 'Confirmar en Excel una muestra de los casos de referencia.', 'Pendiente'], ['D14', 'Celdas sin efecto descartadas (K22, B7, P8, P9, C6/C13).', 'Confirmar'], ['D2', 'Terminal sin pasajeros: significado de filas duplicadas US1/US2 y de US3–US6.', 'Pendiente de validación independiente'], ['N16', 'La regla «Básico ⇒ 1 intersección» no figura en las imágenes normativas del libro.', 'Pendiente']];
  function techAdv() {
    const st = e => chip(e.status, e.status === 'implementado' ? 'ok' : e.status === 'bloqueado' ? 'block' : 'pend'), ex = M.exceptions.filter(e => U.filtro === 'todos' || e.status === U.filtro);
    return `<h3>Decisiones aprobadas (versión 1)</h3><ul><li><b>D1</b> Casas: B5 = 61 × B6 como parámetro interno.</li><li><b>D2</b> Terminal sin pasajeros: US1–US2 como el Excel; US3–US6 deshabilitadas.</li><li><b>D3/D4</b> Comercios: límites y fórmulas del Excel; etiqueta sin escala = «${esc(M.notes.sinEscala)}».</li><li><b>D5</b> Área de influencia sobre 1.000 veh/h: «Art 3.2.2.».</li><li><b>D6</b> Validación web: texto bloqueado, negativos bloqueados en modo usuario, vacío = 0.</li></ul>
      <h3>Pendientes del propietario</h3><div class="tw"><table><thead><tr><th>ID</th><th>Tema</th><th>Estado</th></tr></thead><tbody>${PEND_DEC.map(d => `<tr><td class="l">${d[0]}</td><td class="l">${esc(d[1])}</td><td class="l">${esc(d[2])}</td></tr>`).join('')}</tbody></table></div>
      <h3>Diferencias respecto del Excel</h3><div class="tw"><table><thead><tr><th>ID</th><th>Tema</th><th>Excel</th><th>Web</th><th>Tipo</th></tr></thead><tbody>${M.differences.map(d => `<tr><td class="l">${esc(d.id)}</td><td class="l">${esc(d.topic)}</td><td class="l">${esc(d.excel)}</td><td class="l">${esc(d.web)}</td><td class="l">${esc(d.type)}</td></tr>`).join('')}</tbody></table></div>
      <h3>Excepciones conocidas</h3><label>Estado <select id="flt">${['todos', 'implementado', 'bloqueado', 'pendiente'].map(s => `<option ${s === U.filtro ? 'selected' : ''}>${s}</option>`).join('')}</select></label><div class="tw"><table><thead><tr><th>ID</th><th>Hoja / celda</th><th>Comportamiento original</th><th>Comportamiento web</th><th>Motivo</th><th>Estado</th></tr></thead><tbody>${ex.map(e => `<tr><td class="l">${esc(e.id)}</td><td class="l">${esc(e.sheet)}<br><span class="cell">${esc(e.cell)}</span></td><td class="l">${esc(e.excel)}</td><td class="l">${esc(e.web)}</td><td class="l">${esc(e.reason)}</td><td class="l">${st(e)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  /* ---------- Exportación CSV (valores internos con su precisión original) ---------- */
  const dl = (name, text, type) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
  function csvText() {
    const o = S.out, q = v => '"' + String(v).replace(/"/g, '""') + '"', L = [];
    L.push(['P001 Flujos IMIV', M.version, S.meta.nombre || '', S.meta.analista || '', S.meta.fecha || '', 'modo ' + S.mode].map(q).join(';'));
    L.push(['Periodo', ...['Entrada', 'Salida', 'Total'].flatMap(t => M.modes.map(m => `${t} ${m.short} (${m.unit})`)), 'Cat TPRIV', 'Cat otros modos', 'Cat final', 'Intersecciones AI TPRIV', 'Intersecciones AI otros modos'].map(q).join(';'));
    PER.forEach((p, k) => L.push([p, ...o.ent[k], ...o.sal[k], ...o.tot[k], o.cls[k].e, o.cls[k].f, o.cls[k].g, o.cls[k].aiE, o.cls[k].aiF].map(q).join(';')));
    L.push(''); L.push(['Tipología', 'Período', 'Dir', ...M.modes.map(m => m.short)].map(q).join(';'));
    o.blocks.forEach((b, i) => { if (RP.allZero(o.flows[i])) return; ['ent', 'sal'].forEach(d => PER.forEach((p, k) => L.push([RP.displayName(b), p, d === 'ent' ? 'Entrada' : 'Salida', ...o.flows[i][d][k]].map(q).join(';')))); });
    L.push(''); L.push(['Avisos'].map(q).join(';')); S.msgs.forEach(m => L.push([m.level, m.text].map(q).join(';')));
    return '\ufeff' + L.join('\n');
  }

  /* ---------- Navegación ---------- */
  const TABS = [['general', '1 · Datos generales del proyecto', 'A', tabGeneral], ['resid', '2 · Residencial', 'A', tabResid], ['equip', '3 · Equipamiento', 'A', tabEquip], ['act', '4 · Actividades productivas', 'A', tabAct], ['infra', '5 · Infraestructura y terminales', 'A', tabInfra], ['flujos', '6 · Flujos por tipología', 'B', tabFlujos], ['consol', '7 · Resultados consolidados', 'B', tabConsol], ['informe', '8 · Informe final', 'C', tabInforme]];
  const GROUPS = { A: ['Entradas del proyecto', ''], B: ['Resultados del cálculo', 'res'], C: ['Informe', ''] };
  const RESULT_TABS = ['general', 'flujos', 'consol', 'informe'];
  const go = id => { U.tab = id; renderTabs(); renderView(); window.scrollTo(0, 0); };
  function renderTabs() {
    $('#tabs').innerHTML = ['A', 'B', 'C'].map(g => `<div class="grp ${GROUPS[g][1]}"><span class="glabel">${g} · ${GROUPS[g][0]}</span><div class="gtabs">${TABS.filter(t => t[2] === g).map(t => `<button role="tab" data-tab="${t[0]}" aria-selected="${t[0] === U.tab}">${esc(t[1])}</button>`).join('')}</div></div>`).join('');
  }
  function renderView() { $('#view').innerHTML = TABS.find(x => x[0] === U.tab)[3](); paint(); }
  function live(el) {
    const k = el.dataset.live, o = S.out; if (!o) { el.textContent = '—'; return; }
    const d = o.detail[k], f2 = (x, n) => F.formatResult(x, { decimals: n });
    if (k === 'casas') el.textContent = `Superficie útil calculada (B5 = 61 × B6) = ${F.formatResult(61 * (S.values['casas.viviendas'] || 0))} m² · superficie promedio C4 = ${f2(d.c4, 2)} m² (con viviendas > 0 sólo se activa el tramo 60–140 m²)`;
    else if (k === 'departamentos') el.textContent = `Superficie promedio C4 = ${f2(d.c4, 2)} m² · tramo activo: ${d.tramoActivo >= 0 ? TR[d.tramoActivo] : '—'}`;
    else if (k === 'educacionales') el.textContent = d.parts.map((p, i) => `Establecimiento ${i + 1}: ${p.dummies.indexOf(1) >= 0 ? 'tabla del tipo ' + (p.dummies.indexOf(1) + 1) : 'sin tabla activa (flujo 0)'}`).join(' · ');
    else if (k === 'puertos') el.textContent = `Tabla activa: ${d.dummies.indexOf(1) >= 0 ? 'tipo ' + (d.dummies.indexOf(1) + 1) : 'ninguna (flujo 0)'}`;
    else if (k === 'terminal_sin_pasajeros') el.textContent = `Factor medio US1 = ${f2(d.factors[0], 4)} · US2 = ${f2(d.factors[1], 4)} veq/veh`;
    else if (R.commerce[k]) el.textContent = `Etiqueta de escala (Excel M10): ${d.label || M.notes.sinEscala} · escala activa para el flujo: ${d.scaleActive >= 0 ? R.commerce[k].scales[d.scaleActive].label + ' [' + C.condText(R.commerce[k].scales[d.scaleActive].rule) + ']' : 'ninguna (flujo 0)'}`;
  }
  function paint() {
    document.querySelectorAll('[data-msg]').forEach(el => { const id = el.dataset.msg, m = S.msgs.filter(x => x.field === id), inp = document.getElementById(idOf(id)), lvl = m.some(x => x.level === 'error') ? 'err' : (m.length ? 'warn' : '');
      el.className = 'fmsg ' + lvl; el.textContent = m.map(x => x.text.split(': ').slice(1).join(': ') || x.text).join(' '); if (inp) inp.className = lvl; });
    document.querySelectorAll('[data-live]').forEach(live);
    const st = $('#calc-status'); st.className = 'chip ' + (S.errs ? 'err' : 'ok'); st.textContent = S.errs ? `Cálculo detenido (${S.errs} error/es)` : 'Cálculo al día';
    const cc = $('#case-chip'); cc.hidden = !(S.loadedCase && audit()); cc.textContent = 'Caso cargado: ' + (S.loadedCase || '');
    $('#mode').value = S.mode; $('#mode-banner').hidden = !audit(); $('#tech-bar').hidden = !audit();
  }
  S.subscribe(() => { if (RESULT_TABS.includes(U.tab)) renderView(); else paint(); });

  document.addEventListener('input', e => {
    const f = e.target.dataset && e.target.dataset.field; if (f && e.target.tagName === 'INPUT') { S.set(f, e.target.value); return; }
    const m = e.target.dataset && e.target.dataset.meta; if (m) S.meta[m] = e.target.value;
    if (e.target.id === 'q') { U.q = e.target.value; const pos = e.target.selectionStart; renderView(); const q = $('#q'); q.focus(); q.setSelectionRange(pos, pos); }
  });
  document.addEventListener('change', e => {
    const t = e.target, id = t.id;
    if (t.dataset && t.dataset.field && t.tagName === 'SELECT') { S.set(t.dataset.field, t.value); return; }
    if (t.dataset && t.dataset.toggle) { S.toggleBlock(t.dataset.toggle, t.checked); renderView(); return; }
    if (id === 'mode') { S.setMode(t.value); if (!audit()) U.techOpen = false; renderView(); }
    else if (id === 'sel-blk') { U.blk = t.value; renderView(); }
    else if (id === 'flt') { U.filtro = t.value; renderView(); }
    else if (id === 'tfilter') { U.tfilter = t.value; renderView(); }
    else if (id === 'showall') { U.showAll = t.checked; renderView(); }
    else if (id === 'dec') { U.decimals = t.checked; renderView(); }
    else if (['tr-block', 'tr-dir', 'tr-k', 'tr-j'].includes(id)) { U.tr = { kind: 'block', block: $('#tr-block').value, dir: $('#tr-dir').value, k: +$('#tr-k').value, j: +$('#tr-j').value }; U.techOpen = true; renderView(); }
  });
  document.addEventListener('toggle', e => { if (e.target.id === 'tech') U.techOpen = e.target.open; }, true);
  document.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]'); if (tab) { go(tab.dataset.tab); return; }
    const tt = e.target.closest('[data-tt]'); if (tt) { U.techTab = tt.dataset.tt; U.techOpen = true; renderView(); return; }
    const cell = e.target.closest('td.click');
    if (cell && S.out && audit()) { const d = cell.dataset; U.tr = { kind: d.kind, block: d.block || U.tr.block, dir: d.dir || U.tr.dir, k: +d.k, j: +d.j }; U.techOpen = true; U.techTab = 'traza'; go('consol'); const t = $('#tech'); if (t) t.scrollIntoView({ block: 'start' }); return; }
    const tr = e.target.closest('[data-tr]'); if (tr) { U.tr = Object.assign({}, U.tr, { kind: tr.dataset.tr }); renderView(); return; }
    const act = e.target.closest('[data-act]'); if (!act) return; const a = act.dataset.act;
    if (a === 'calc') { S.recompute(); go(S.errs ? 'general' : 'consol'); }
    else if (a === 'reset') { S.reset(); renderView(); }
    else if (a === 'report') openReport();
    else if (a === 'report-back') closeReport();
    else if (a === 'report-print') window.print();
    else if (a === 'csv') { if (!S.out) { go('consol'); return; } dl('flujos_imiv.csv', csvText(), 'text/csv'); }
    else if (audit() && a === 'loadcase') { const c = TC.cases.find(x => x.id === $('#case-sel').value); if (c) { S.loadCase(c); if (!audit()) S.setMode('audit'); go('consol'); } }
    else if (audit() && a === 'validate') { U.tests = IMIV.tests.runAll(); S.recompute(); U.techOpen = true; U.techTab = 'valid'; go('consol'); }
    else if (audit() && a === 'runtests') { U.tests = IMIV.tests.runAll(); S.recompute(); renderView(); }
    else if (audit() && a === 'trace') { U.techOpen = true; U.techTab = 'traza'; go('consol'); const t = $('#tech'); if (t) t.scrollIntoView({ block: 'start' }); }
  });
  // Ctrl+P desde la aplicación: se imprime siempre el informe, no los formularios
  let autoPrint = false;
  window.addEventListener('beforeprint', () => { if (!U.report && S.out) { $('#paper-host').innerHTML = RP.html(S); document.body.classList.add('report-mode'); $('#report-view').hidden = false; autoPrint = true; } });
  window.addEventListener('afterprint', () => { if (autoPrint) { autoPrint = false; closeReport(); } });

  (function () { const g = {}; TC.cases.forEach(c => (g[c.group] = g[c.group] || []).push(c)); $('#case-sel').innerHTML = Object.keys(g).map(k => `<optgroup label="${esc(k)}">${g[k].map(c => `<option value="${esc(c.id)}">${esc(c.id)} · ${esc(c.title.length > 60 ? c.title.slice(0, 58) + '…' : c.title)}</option>`).join('')}</optgroup>`).join(''); })();
  $('#ver').textContent = M.version;
  renderTabs(); S.recompute(); renderView();
  IMIV.app = { U, go, renderView, openReport, closeReport };
})();
