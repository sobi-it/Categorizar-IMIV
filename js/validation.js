/* Validación de entradas (D6). Texto: siempre bloqueado. Negativos: bloqueados en modo usuario, permitidos con aviso en modo auditoría.
   Vacío = 0. Los errores se informan por campo y detienen el cálculo (no se propaga #VALUE!). */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, M = IMIV.model, C = IMIV.calc, R = IMIV.rates;
  const NUM_RE = /^-?(\d+([.,]\d+)?|[.,]\d+)$/;
  const V = (IMIV.validation = {});
  V.parseField = function (raw, mode) {
    if (typeof raw === 'number') {
      if (!isFinite(raw)) return { error: 'Valor no finito.' };
      if (raw < 0) return mode === 'audit' ? { value: raw, warn: 'Valor negativo (sólo modo auditoría).' } : { error: 'No se admiten valores negativos.' };
      return { value: raw };
    }
    if (raw === undefined || raw === null || String(raw).trim() === '') return { value: 0, empty: true };
    const s = String(raw).trim();
    if (!NUM_RE.test(s)) return { error: 'Valor no numérico. Ingrese sólo números (punto o coma como decimal).' };
    const v = parseFloat(s.replace(',', '.'));
    if (!isFinite(v) || Math.abs(v) > 1e12) return { error: 'Valor fuera de rango.' };
    const out = { value: v };
    if (v < 0) { if (mode === 'audit') out.warn = 'Valor negativo (sólo modo auditoría).'; else return { error: 'No se admiten valores negativos.' }; }
    if (/[.,]\d{3}$/.test(s)) out.warn = `Se interpretó «${s}» como ${v} (no se admiten separadores de miles).`;
    return out;
  };
  // Valores por defecto del Excel (INPUTS PROYECTO): códigos educacionales 1–4, tipo de puerto 0; el resto vacío (= 0).
  V.defaults = function () {
    const d = {};
    M.inputs.forEach(f => { d[f.id] = ''; });
    [1, 2, 3, 4].forEach(i => { d[`educacionales.tipo${i}.codigo`] = String(i); });
    d['puertos.tipo'] = '0';
    return d;
  };
  // raw: {id: texto|número}; off: conjunto de bloques excluidos del cálculo (campos tomados como 0).
  V.parseInputs = function (raw, mode, off) {
    const values = {}, messages = [];
    off = off || {};
    for (const f of M.inputs) {
      const r = V.parseField(raw[f.id], mode), name = `${f.section} · ${f.label}`;
      if (r.error) { messages.push({ level: 'error', field: f.id, text: `${name}: ${r.error}` }); continue; }
      let v = r.value;
      if (f.kind === 'code' && !(mode === 'audit') && !f.options.includes(v)) { messages.push({ level: 'error', field: f.id, text: `${name}: valor no válido (opciones: ${f.options.join(', ')}).` }); continue; }
      if (r.warn) messages.push({ level: 'warn', field: f.id, text: `${name}: ${r.warn}` });
      values[f.id] = off[f.block] && f.kind !== 'code' ? 0 : v;
    }
    if (messages.some(m => m.level === 'error')) return { values, messages };
    const g = id => values[id] || 0, w = (field, text) => messages.push({ level: 'warn', field, text });
    const vi = g('departamentos.viviendas'), su = g('departamentos.superficie_util');
    if (vi > 0 && su === 0) w('departamentos.superficie_util', 'Departamentos: superficie útil = 0 con viviendas > 0. Excel calcula C4 = 0 y aplica el tramo ≤ 50 m² (EX-03).');
    if (su > 0 && vi === 0) w('departamentos.viviendas', 'Departamentos: viviendas = 0 con superficie > 0. Flujo = 0 (EX-03).');
    if (g('casas.viviendas') !== 0 && !Number.isInteger(g('casas.viviendas'))) w('casas.viviendas', 'Casas: cantidad de viviendas no entera.');
    for (let i = 1; i <= 4; i++) { const c = g(`educacionales.tipo${i}.codigo`), e = g(`educacionales.tipo${i}.estudiantes`);
      if (e !== 0 && ![1, 2, 3, 4].includes(c)) w(`educacionales.tipo${i}.estudiantes`, `Establecimiento ${i}: sin tipo 1–4 el Excel no aplica tasas (flujo 0) (EX-36).`); }
    Object.keys(R.commerce).forEach(key => { const sup = g(key + '.superficie'), car = g(key + '.carga'), Cm = R.commerce[key];
      if (sup > 0) {
        const n = Cm.scales.filter(s => C.cond(s.rule, car)).length;
        if (n === 0) w(key + '.carga', `${Cm.sheet}: ninguna escala activa con carga ${car}; el flujo es 0 (lógica actual del Excel, EX-29).`);
        else if (car === 0) w(key + '.carga', `${Cm.sheet}: carga de ocupación = 0 con superficie > 0 aplica la escala menor/básica (lógica actual del Excel, EX-28).`);
      } });
    if (g('puertos.capacidad') > 0 && ![1, 2].includes(g('puertos.tipo'))) w('puertos.capacidad', 'Puertos: sin tipo 1 ó 2 el Excel entrega flujo 0 aunque exista capacidad (EX-33).');
    const ex = M.inputs.filter(f => f.module === 'M2F' && !f.enabled && g(f.id) !== 0);
    if (ex.length) w(ex[0].id, M.notes.us36 + ` Campos con valor excluidos: ${ex.length}.`);
    return { values, messages };
  };
})(typeof window !== 'undefined' ? window : globalThis);
