/* Orquestador: valores de entrada (id → número) → 44 bloques → consolidación → clasificación. */
(function (root) {
  'use strict';
  const IMIV = root.IMIV, C = IMIV.calc, M = IMIV.model;
  C.runProject = function (values) {
    const v = id => (values[id] === undefined ? 0 : values[id]);
    const detail = {};
    const flows = M.blocks.map(b => {
      let r;
      if (b.family === 'template') r = C.calcTemplate(b.id, v(M.templates[b.id].inputId));
      else if (b.id === 'casas') r = C.calcCasas(v('casas.viviendas'));
      else if (b.id === 'departamentos') r = C.calcDptos(v('departamentos.superficie_util'), v('departamentos.viviendas'));
      else if (b.family === 'education') r = C.calcEducation(v);
      else if (b.family === 'commerce') r = C.calcCommerce(b.id, v(b.id + '.superficie'), v(b.id + '.carga'));
      else if (b.id === 'puertos') r = C.calcPorts(v('puertos.tipo'), v('puertos.capacidad'));
      else if (b.id === 'terminal_sin_pasajeros') r = C.calcTerminal(v);
      detail[b.id] = r; return r;
    });
    const cons = C.consolidate(flows);
    return { blocks: M.blocks, flows, detail, ent: cons.ent, sal: cons.sal, tot: cons.tot, cls: C.classify(cons.tot) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
