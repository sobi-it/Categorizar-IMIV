const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const open = async (dir) => { const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); p.on('console', m => { if (m.type() === 'error') errs.push(dir + ' console: ' + m.text()); }); p.on('pageerror', e => errs.push(dir + ' pageerror: ' + e.message)); await p.goto('file://' + dir + '/index.html'); return p; };
  // ---- 1) Regresión en navegador: motor antes vs después, vía IMIV.state ----
  const ids = ['E-01', 'E-02', 'E-03b', 'E-04b', 'E-04a', 'E-04d', 'E-06', 'E-08', 'E-10_250', 'E-12P2', 'E-07'];
  const grab = async (dir) => { const p = await open(dir); const r = await p.evaluate((ids) => { const o = {}; for (const id of ids) { const c = IMIV.testCases.cases.find(x => x.id === id); IMIV.state.loadCase(c); const s = IMIV.state.out; o[id] = s ? { ent: s.ent, sal: s.sal, tot: s.tot, cls: s.cls } : null; } return o; }, ids); await p.close(); return r; };
  const A = await grab('/home/claude/before_ui'), B = await grab('/home/claude/p001-imiv-web');
  const rows = []; let nd = 0;
  for (const id of ids) { const a = A[id], c = B[id]; const same = JSON.stringify(a) === JSON.stringify(c); if (!same) nd++; rows.push(`${id}: tot PM-L ${JSON.stringify(a.tot[0])} → ${JSON.stringify(c.tot[0])} · E4 ${a.cls[0].e}→${c.cls[0].e} · G ${a.cls[0].g}→${c.cls[0].g} · AI ${a.cls[0].aiE}→${c.cls[0].aiE} · ${same ? 'idéntico' : 'DIFERENTE'}`); }
  console.log(rows.join('\n')); console.log('casos con diferencia:', nd);
  // ---- 2) Interfaz nueva ----
  const p = await open('/home/claude/p001-imiv-web');
  const txt = async () => p.evaluate(() => document.body.innerText);
  const vis = async sel => p.$eval(sel, e => !e.hidden && getComputedStyle(e).display !== 'none');
  console.log('grupos de pestañas:', await p.$$eval('#tabs .glabel', l => l.map(x => x.textContent)).then(x => x.join(' | ')));
  console.log('pestañas:', await p.$$eval('#tabs button', b => b.map(x => x.textContent)).then(x => x.join(' | ')));
  console.log('USUARIO · tech-bar visible:', await vis('#tech-bar'), '| mode-banner:', await vis('#mode-banner'));
  console.log('USUARIO · botones:', await p.$$eval('#toolbar button', b => b.filter(x => x.offsetParent).map(x => x.textContent)).then(x => x.join(' | ')));
  let t = await txt(); console.log('USUARIO · aparece "E-01"/"Cargar caso"/"Ejecutar validación"/"Mostrar trazabilidad":', ['E-01', 'Cargar caso', 'Ejecutar validación', 'Mostrar trazabilidad'].map(s => t.includes(s)).join(','));
  await p.click('#tabs button:has-text("2 · Residencial")');
  console.log('orden residencial:', await p.$$eval('#view .card h3', h => h.map(x => x.childNodes[0].textContent.trim())).then(x => x.join(' > ')));
  console.log('subtítulo hoja Excel (1ª):', await p.$eval('#view .card h3 .sub', e => e.textContent));
  await p.fill('#f_departamentos_superficie_util', '11000'); await p.fill('#f_departamentos_viviendas', '200'); await p.fill('#f_casas_viviendas', '100');
  await p.click('#tabs button:has-text("3 · Equipamiento")'); await p.fill('#f_restaurant_bar_cantidad', '500'); await p.fill('#f_oficinas_cantidad', '5000');
  await p.click('[data-act=calc]'); await p.waitForTimeout(100);
  console.log('tras Calcular, pestaña activa:', await p.$eval('#tabs [aria-selected=true]', e => e.textContent));
  console.log('banda:', await p.$eval('.resband', e => e.innerText.replace(/\s+/g, ' ')));
  console.log('secciones:', await p.$$eval('.sec-title h2', h => h.map(x => x.textContent)).then(x => x.join(' > ')));
  console.log('KPIs:', await p.$$eval('.kpi', k => k.map(x => x.innerText.replace(/\s+/g, ' '))).then(x => x.join(' || ')));
  // celdas del total consolidado = enteros y coinciden con el motor
  const chk = await p.evaluate(() => { const o = IMIV.state.out, F = IMIV.format; const tbl = [...document.querySelectorAll('.three table')][2]; const bad = []; let n = 0, dec = 0; tbl.querySelectorAll('tbody tr').forEach((tr, k) => tr.querySelectorAll('td').forEach((td, c) => { if (c === 0) return; n++; if (td.textContent !== F.formatResult(o.tot[k][c - 1])) bad.push([k, c, td.textContent]); })); document.querySelectorAll('#view table.num td').forEach(td => { if (/[.,]\d+$/.test(td.textContent.trim()) && !/^\d{1,3}(\.\d{3})+$/.test(td.textContent.trim()) && !/Período/.test(td.textContent)) dec++; }); return { n, bad, dec, sample: tbl.querySelector('tbody tr').innerText.replace(/\s+/g, ' ') }; });
  console.log('total C35:F39 mostrado vs motor:', chk.n, 'celdas, discrepancias:', chk.bad.length, '| celdas con decimales en tablas de resultados:', chk.dec, '| ej.:', chk.sample);
  console.log('cells click en usuario:', await p.$$eval('#view td.click', c => c.length));
  await p.screenshot({ path: '/home/claude/ui_consol.png', fullPage: false });
  await p.click('#tabs button:has-text("6 · Flujos por tipología")'); console.log('flujos tipología títulos:', await p.$$eval('#view .card h3', h => h.map(x => x.childNodes[0].textContent.trim())).then(x => x.join(', ')));
  // ---- informe ----
  await p.fill('input[data-meta=nombre]', 'x').catch(() => {}); await p.click('#tabs button:has-text("1 · Datos")'); await p.fill('input[data-meta=nombre]', 'Edificio de prueba Av. Ejemplo 123'); await p.fill('input[data-meta=analista]', 'Analista X');
  await p.click('[data-act=report]'); await p.waitForTimeout(100);
  console.log('modo informe: app oculta', !(await vis('#app')), '| informe visible', await vis('#report-view'));
  const rt = await p.$eval('#paper-host', e => e.innerText);
  console.log('informe contiene título/proyecto/fecha/versión/pie:', ['Informe de Flujos e Impacto en la Movilidad', 'Edificio de prueba Av. Ejemplo 123', 'Fecha de generación', 'Versión de la aplicación', 'Documento generado automáticamente a partir del modelo P001_FLUJOS_IMIV_IT_V4.0.'].map(s => rt.includes(s)).join(','));
  console.log('secciones informe:', await p.$$eval('#paper-host h2', h => h.map(x => x.textContent)).then(x => x.join(' > ')));
  await p.screenshot({ path: '/home/claude/ui_report.png', fullPage: false });
  await p.pdf({ path: '/home/claude/informe_prueba.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await p.click('[data-act=report-back]'); console.log('volver: app visible', await vis('#app'), '| valor conservado:', await p.inputValue('#f_oficinas_cantidad').catch(async () => { await p.click('#tabs button:has-text("3 · Equipamiento")'); return p.inputValue('#f_oficinas_cantidad'); }));
  // ---- auditoría ----
  await p.selectOption('#mode', 'audit'); await p.waitForTimeout(80);
  console.log('AUDITORÍA · tech-bar:', await vis('#tech-bar'), '| banner:', await vis('#mode-banner'));
  await p.selectOption('#case-sel', 'E-06'); await p.click('[data-act=loadcase]'); await p.waitForTimeout(100);
  console.log('E-06 cargado → chip:', await p.textContent('#case-chip'), '| modo:', await p.inputValue('#mode'), '| details cerrado:', await p.$eval('#tech', e => !e.open));
  console.log('celdas clic en auditoría:', (await p.$$eval('#view td.click', c => c.length)) > 0);
  await p.click('#tech summary'); await p.click('td.click[data-kind=tot][data-k="0"][data-j="0"]'); await p.waitForTimeout(100);
  console.log('traza abierta:', await p.$eval('#tech', e => e.open), '| pasos:', await p.$$eval('#tech .expl li', l => l.length));
  await p.click('[data-act=validate]'); await p.waitForTimeout(400); console.log('pruebas en herramientas técnicas:', await p.$$eval('#tech .chip', c => c.map(x => x.textContent)).then(x => x.filter(y => /aprobado|pendiente|discrepancia|intencional/.test(y)).join(', ')));
  await p.selectOption('#case-sel', 'E-04a'); await p.click('[data-act=loadcase]'); await p.waitForTimeout(100);
  await p.check('#dec'); console.log('con decimales internos (auditoría), 1ª fila entrada:', await p.$eval('.three table tbody tr', r => r.innerText.replace(/\s+/g, ' ')));
  await p.selectOption('#mode', 'user'); await p.waitForTimeout(80); console.log('vuelta a usuario: tech-bar', await vis('#tech-bar'), '| #tech existe:', (await p.$$('#tech')).length);
  console.log('ERRORES:', errs.length ? errs : 'ninguno'); await b.close();
})();
