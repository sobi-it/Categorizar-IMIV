/* Estado de datos de la aplicación (entradas ingresadas, modo, resultados vigentes). Sin acceso al DOM. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, M = IMIV.model, V = IMIV.validation, C = IMIV.calc;
  const S = (IMIV.state = { raw: V.defaults(), mode: 'user', off: {}, meta: { nombre: '', analista: '', fecha: '', notas: '' }, values: {}, msgs: [], errs: 0, out: null, trace: null, listeners: [], loadedCase: null });
  S.subscribe = fn => S.listeners.push(fn);
  S.recompute = function () {
    const p = V.parseInputs(S.raw, S.mode, S.off);
    S.msgs = p.messages; S.values = p.values; S.errs = p.messages.filter(m => m.level === 'error').length;
    S.out = S.errs ? null : C.runProject(p.values);   // con errores NO se calcula (D6)
    S.listeners.forEach(fn => fn());
  };
  S.set = (id, v) => { S.raw[id] = v; S.loadedCase = null; S.recompute(); };
  S.setMode = m => { S.mode = m; S.recompute(); };
  S.toggleBlock = (b, on) => { if (on) delete S.off[b]; else S.off[b] = true; S.recompute(); };
  S.reset = () => { S.raw = V.defaults(); S.off = {}; S.trace = null; S.loadedCase = null; S.recompute(); };
  S.loadCase = function (c) {
    S.raw = V.defaults(); S.off = {};
    Object.keys(c.inputs).forEach(cell => { const id = M.cellToId[cell]; if (id) S.raw[id] = c.inputs[cell] === null ? '' : String(c.inputs[cell]); });
    S.mode = c.mode; S.loadedCase = c.id; S.recompute();
  };
  S.isActive = bid => !S.off[bid];
})(typeof window !== 'undefined' ? window : globalThis);
