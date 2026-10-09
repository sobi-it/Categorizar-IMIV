/* Presentación de resultados e informe. Sólo LEE los resultados del motor (IMIV.state.out) y los formatea.
   No calcula flujos, no clasifica y no modifica el estado. Los resúmenes (mayor categoría entre períodos, etc.)
   son agregaciones de lectura de los valores ya calculados por el motor. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, M = IMIV.model, R = IMIV.rates, C = IMIV.calc, F = IMIV.format;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const PER = C.PER, RANK = { 'N.A.': 0, 'Básico': 1, 'Intermedio': 2, 'Mayor': 3 };
  const P = (IMIV.report = {});
  const fr = (v, o) => esc(F.formatResult(v, o));
  const allZero = f => !f || [...f.ent.flat(), ...f.sal.flat()].every(v => v === 0);
  P.allZero = allZero;

  /* ---------- Nombres visibles (sólo presentación) ---------- */
  P.NAMES = { departamentos: 'Departamentos', casas: 'Casas', residencial_tipo_sename: 'Residencial Sistema de Atención a la Niñez y Adolescencia', residencial_estudiantes: 'Residencial Estudiantes', residencial_adultos_mayores: 'Residencial Adultos Mayores', hoteles: 'Hospedaje / Hoteles' };
  P.RESID_ORDER = ['departamentos', 'casas', 'residencial_tipo_sename', 'residencial_estudiantes', 'residencial_adultos_mayores', 'hoteles']; // orden visual de tarjetas
  const sheetOf = b => b.sheet;
  P.displayName = b => P.NAMES[b.id] || (M.templates[b.id] && M.templates[b.id].name) || (M.inputs.find(f => f.block === b.id) || {}).section || b.sheet;
  P.displayNameById = id => { const b = M.blocks.find(x => x.id === id); return b ? P.displayName(b) : id; };

  /* ---------- Resumen (lectura de M4) ---------- */
  function maxCat(cls, key) { let best = null; cls.forEach(r => { if (best === null || RANK[r[key]] > RANK[best]) best = r[key]; }); return { cat: best, periods: cls.map((r, k) => (r[key] === best ? PER[k] : null)).filter(Boolean) }; }
  const aiRank = v => (v === 'Art 3.2.2.' ? 1e9 : typeof v === 'number' ? v : -1);
  function maxAI(cls, key) { let best = cls[0][key]; cls.forEach(r => { if (aiRank(r[key]) > aiRank(best)) best = r[key]; }); return { v: best, periods: cls.map((r, k) => (r[key] === best ? PER[k] : null)).filter(Boolean) }; }
  P.summary = out => ({ final: maxCat(out.cls, 'g'), priv: maxCat(out.cls, 'e'), otros: maxCat(out.cls, 'f'), aiPriv: maxAI(out.cls, 'aiE'), aiOtros: maxAI(out.cls, 'aiF'), art: out.cls.some(r => r.aiE === 'Art 3.2.2.' || r.aiF === 'Art 3.2.2.') });
  const catBadge = c => `<span class="badge cat-${esc(c)}">${esc(c)}</span>`;
  const perTxt = p => (p.length === 5 ? 'los 5 períodos' : p.join(', '));

  P.kpiHTML = out => {
    const s = P.summary(out);
    return `<div class="kpis">
      <div class="kpi main"><div class="kl">Categoría IMIV final</div><div class="kv">${catBadge(s.final.cat)}</div><div class="ks">Mayor categoría entre períodos (${esc(perTxt(s.final.periods))})</div></div>
      <div class="kpi"><div class="kl">Categoría IMIV · transporte privado</div><div class="kv">${catBadge(s.priv.cat)}</div><div class="ks">${esc(perTxt(s.priv.periods))}</div></div>
      <div class="kpi"><div class="kl">Categoría IMIV · otros modos</div><div class="kv">${catBadge(s.otros.cat)}</div><div class="ks">${esc(perTxt(s.otros.periods))}</div></div>
      <div class="kpi"><div class="kl">Nº de intersecciones · área de influencia</div><div class="kv2"><span>Transporte privado: <b>${fr(s.aiPriv.v)}</b></span><span>Otros modos: <b>${fr(s.aiOtros.v)}</b></span></div><div class="ks">Máximo entre períodos (${esc(perTxt(s.aiPriv.periods))} / ${esc(perTxt(s.aiOtros.periods))})</div></div>
    </div>${s.art ? `<div class="note warn"><b>Art 3.2.2.</b> ${esc(M.notes.art322)}</div>` : ''}`;
  };

  /* ---------- Tablas (valores formateados; el interno no se modifica) ---------- */
  const th = () => `<tr><th>Período</th>${M.modes.map(m => `<th>${esc(m.short)}<small>${esc(m.unit)}</small></th>`).join('')}</tr>`;
  P.matrixHTML = (data, o) => { o = o || {}; return `<table class="num"><thead>${th()}</thead><tbody>${data.map((r, k) => `<tr><td>${PER[k]}</td>${r.map((x, j) => `<td ${o.attrs ? `class="click" title="Ver trazabilidad" data-k="${k}" data-j="${j}" ${o.attrs}` : ''}>${fr(x, o.fmt)}</td>`).join('')}</tr>`).join('')}</tbody></table>`; };
  P.catTableHTML = (out, o) => { o = o || {}; const click = (k, kind, v, cls) => `<td class="txt ${o.click ? 'click' : ''} ${cls ? 'cat-' + esc(v) : ''}" ${o.click ? `title="Ver trazabilidad" data-kind="${kind}" data-k="${k}" data-j="0"` : ''}>${fr(v)}</td>`;
    return `<table class="num"><thead><tr><th>Período</th><th>Flujo transporte privado<small>veh/h</small></th><th>Flujo otros modos<small>viajes/h</small></th><th>Categoría IMIV<br>transporte privado</th><th>Categoría IMIV<br>otros modos</th><th>Categoría IMIV final</th></tr></thead><tbody>${out.cls.map((r, k) => `<tr><td>${PER[k]}</td><td>${fr(r.c, o.fmt)}</td><td>${fr(r.d, o.fmt)}</td>${click(k, 'cat', r.e, 1)}${click(k, 'cat', r.f, 1)}${click(k, 'cat', r.g, 1)}</tr>`).join('')}</tbody></table>`; };
  P.aiTableHTML = (out, o) => { o = o || {}; const c = (k, v) => `<td class="txt ${o.click ? 'click' : ''}" ${o.click ? `title="Ver trazabilidad" data-kind="ai" data-k="${k}" data-j="0"` : ''}>${fr(v)}</td>`;
    return `<table class="num"><thead><tr><th>Período</th><th>Flujo transporte privado<small>veh/h</small></th><th>Flujo otros modos<small>viajes/h</small></th><th>Nº de intersecciones<br>transporte privado</th><th>Nº de intersecciones<br>otros modos</th></tr></thead><tbody>${out.cls.map((r, k) => `<tr><td>${PER[k]}</td><td>${fr(r.c, o.fmt)}</td><td>${fr(r.d, o.fmt)}</td>${c(k, r.aiE)}${c(k, r.aiF)}</tr>`).join('')}</tbody></table>`; };
  P.flowTablesHTML = (out, o) => { o = o || {}; const a = o.click ? 'data-kind="tot"' : '';
    return `<div class="three"><div><h4>Flujo de entrada</h4>${P.matrixHTML(out.ent, { fmt: o.fmt })}</div><div><h4>Flujo de salida</h4>${P.matrixHTML(out.sal, { fmt: o.fmt })}</div><div><h4>Flujo total (entrada + salida)</h4>${P.matrixHTML(out.tot, { fmt: o.fmt, attrs: a })}</div></div>`; };

  /* ---------- Tipologías activas: magnitud, unidad de referencia y flujos ---------- */
  const SING = { 'hab.': 'habitación', 'disp.': 'dispensador', 'asientos': 'asiento', 'est.': 'estacionamiento', 'líneas': 'línea de revisión', 'dársenas': 'dársena', 'pax/h': 'pax/h de capacidad', 'm²': 'm²' };
  const num = v => v.toLocaleString('es-CL', { maximumFractionDigits: 2 });
  P.unitRef = b => {
    if (M.templates[b.id]) { const T = M.templates[b.id]; return T.divisor === 'C4/100' ? `Tasa por 100 ${T.unit}` : `Tasa por ${SING[T.unit] || T.unit}`; }
    return { viviendas: 'Tasa por vivienda', education: 'Tasa por estudiante', commerce: 'Tasa por 100 m²', ports: 'Tasa por unidad de capacidad (según tipo)', terminal: 'Frecuencia (buses/h) × factor de equivalencia' }[b.family];
  };
  P.magnitude = (b, S) => {
    const v = id => S.values[id] || 0, fs = M.inputs.filter(f => f.block === b.id && f.enabled);
    if (b.id === 'casas') return `${num(v('casas.viviendas'))} viviendas (superficie útil ${num(61 * v('casas.viviendas'))} m²; 61 m² por vivienda)`;
    if (b.id === 'departamentos') return `${num(v('departamentos.viviendas'))} viviendas · ${num(v('departamentos.superficie_util'))} m² de superficie útil`;
    if (b.id === 'educacionales') return [1, 2, 3, 4].filter(i => v(`educacionales.tipo${i}.estudiantes`)).map(i => `${num(v(`educacionales.tipo${i}.estudiantes`))} estudiantes (tipo ${v(`educacionales.tipo${i}.codigo`)})`).join('; ');
    if (b.id === 'puertos') return `Capacidad ${num(v('puertos.capacidad'))} (tipo ${v('puertos.tipo')})`;
    if (b.family === 'commerce') return `${num(v(b.id + '.superficie'))} m² · carga de ocupación ${num(v(b.id + '.carga'))}`;
    if (b.id === 'terminal_sin_pasajeros') return [1, 2].filter(u => PER.some(p => v(`terminal_sin_pasajeros.frec.us${u}.${p}`))).map(u => `US${u}: ${PER.map(p => num(v(`terminal_sin_pasajeros.frec.us${u}.${p}`))).join(' / ')} buses/h`).join('; ');
    return fs.filter(f => v(f.id)).map(f => `${num(v(f.id))} ${f.unit}`).join('; ');
  };
  P.typologyRows = (out, S) => out.blocks.map((b, i) => ({ b, f: out.flows[i] })).filter(x => !allZero(x.f)).map(({ b, f }) => ({
    b, name: P.displayName(b), sheet: sheetOf(b), magnitude: P.magnitude(b, S), unitRef: P.unitRef(b),
    priv: PER.map((p, k) => f.ent[k][0] + f.sal[k][0]), otros: PER.map((p, k) => [1, 2, 3].reduce((s, j) => s + f.ent[k][j] + f.sal[k][j], 0)) }));
  P.typoTablesHTML = (out, S, o) => {
    o = o || {}; const rows = P.typologyRows(out, S);
    if (!rows.length) return '<p class="help">Sin tipologías con flujo.</p>';
    const tbl = (title, key, unit, totalRow) => `<h4>${title} <small>(${unit}; entrada + salida)</small></h4><table class="num typo"><thead><tr><th>Tipología</th><th>Unidad de referencia</th><th>Magnitud ingresada</th>${PER.map(p => `<th>${p}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr><td class="l"><b>${esc(r.name)}</b>${o.sheet ? `<small class="l">Hoja Excel: ${esc(r.sheet)}</small>` : ''}</td><td class="l">${esc(r.unitRef)}</td><td class="l">${esc(r.magnitude)}</td>${r[key].map(x => `<td>${fr(x, o.fmt)}</td>`).join('')}</tr>`).join('')}<tr class="tot"><td class="l" colspan="3"><b>Total consolidado del proyecto (redondeado)</b></td>${totalRow.map(x => `<td><b>${fr(x)}</b></td>`).join('')}</tr></tbody></table>`;
    return tbl('Flujo de transporte privado por tipología', 'priv', 'veh/h', out.tot.map(r => r[0])) + tbl('Flujo de otros modos por tipología', 'otros', 'viajes/h: público + peatones + ciclos', out.cls.map(r => r.d)) +
      '<p class="help">Cada valor se muestra redondeado a entero; el total consolidado suma entrada y salida antes de redondear, por lo que la suma de las cifras mostradas puede diferir del total en una unidad.</p>';
  };

  /* ---------- Notas y advertencias relevantes para el proyecto ---------- */
  P.notes = (out, S) => {
    const N = [], rows = P.typologyRows(out, S), has = id => rows.some(r => r.b.id === id), com = rows.some(r => r.b.family === 'commerce');
    N.push({ t: rows.length ? `Tipologías activas: ${rows.map(r => r.name).join('; ')}.` : 'No hay tipologías con flujo: todos los valores ingresados son cero.' });
    if (has('casas')) N.push({ t: M.notes.casas });
    if (com) { N.push({ t: M.notes.escalas, w: 1 }); rows.filter(r => r.b.family === 'commerce' && out.detail[r.b.id].sinEscala).forEach(r => N.push({ t: `${r.name}: ${M.notes.sinEscala}`, w: 1 })); }
    if (out.cls.some(r => r.aiE === 'Art 3.2.2.')) N.push({ t: `Art 3.2.2.: ${M.notes.art322}`, w: 1 });
    const term = out.detail.terminal_sin_pasajeros;
    if (has('terminal_sin_pasajeros') || (term && term.excluded.length)) N.push({ t: `Terminal TPUB sin pasajeros: ${M.notes.us36} El módulo está pendiente de validación independiente.`, w: 1 });
    S.msgs.filter(m => m.level === 'warn' && !m.text.includes('US3–US6')).forEach(m => N.push({ t: m.text, w: 1 }));
    N.push({ t: 'Diferencias intencionales respecto del Excel: la aplicación bloquea texto y valores negativos en las entradas y trata los campos vacíos como 0; los resultados se muestran como enteros sin alterar el cálculo interno.' });
    N.push({ t: 'Estado de validación: los resultados reproducen la lógica del modelo Excel P001; la comparación contra valores calculados por Excel está pendiente de confirmación (prueba X-01).' });
    return N;
  };
  P.notesHTML = (out, S) => `<ul class="notes">${P.notes(out, S).map(n => `<li class="${n.w ? 'w' : ''}">${esc(n.t)}</li>`).join('')}</ul>`;

  /* ---------- Informe ---------- */
  P.html = (S, when) => {
    const out = S.out, d = when || new Date(), fecha = d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }), hora = d.toLocaleString('es-CL');
    const meta = [['Proyecto', S.meta.nombre || 'Proyecto sin nombre'], ['Fecha de generación', fecha], ['Versión de la aplicación', M.version], ['Archivo o modelo', S.meta.archivo || M.source]];
    if (S.meta.analista) meta.push(['Analista / consultor', S.meta.analista]); if (S.meta.fecha) meta.push(['Fecha del proyecto', S.meta.fecha]); if (S.meta.notas) meta.push(['Observaciones', S.meta.notas]);
    return `<article class="paper">
      <header class="r-head"><div class="r-kicker">Estudio de movilidad · IMIV</div><h1>Informe de Flujos e Impacto en la Movilidad</h1>
        <table class="meta"><tbody>${meta.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></header>
      <section><h2>Resumen ejecutivo</h2>${P.kpiHTML(out)}<h3>Categoría y área de influencia por período</h3>${P.catTableHTML(out)}${P.aiTableHTML(out)}</section>
      <section class="newpage"><h2>Flujos inducidos</h2><p class="help">Flujos del proyecto por período y modo, en números enteros. Transporte privado en veh/h; transporte público, peatones y ciclos en viajes/h.</p>${P.flowTablesHTML(out)}</section>
      <section><h2>Detalle por tipología</h2>${P.typoTablesHTML(out, S, { sheet: true })}</section>
      <section><h2>Notas y advertencias</h2>${P.notesHTML(out, S)}</section>
      <footer class="r-foot"><span>Documento generado automáticamente a partir del modelo P001_FLUJOS_IMIV_IT_V4.0.</span><span>${esc(hora)}</span></footer></article>`;
  };
})(typeof window !== 'undefined' ? window : globalThis);
