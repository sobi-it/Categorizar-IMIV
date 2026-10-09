/* Formateador central de PRESENTACIÓN. No forma parte del motor: el motor nunca lo llama.
   Muestra los resultados como enteros sin alterar el valor interno. «N.A.» y «Art 3.2.2.» se conservan como texto. */
(function (root) {
  'use strict';
  const IMIV = (root.IMIV = root.IMIV || {});
  const group = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // Mitad alejándose de cero con 15 cifras significativas (misma convención visible que ROUND de Excel); sólo para mostrar.
  const roundHalfAway = x => { const a = Math.abs(Number(x.toPrecision(15))), r = Math.floor(a + 0.5); return x < 0 && r !== 0 ? -r : r; };
  // opts.decimals (>0) sólo se usa en modo auditoría para inspeccionar valores internos; opts.empty = texto para «no corresponde».
  function formatResult(v, opts) {
    opts = opts || {};
    if (v === null || v === undefined || v === '') return opts.empty !== undefined ? opts.empty : '—';
    if (typeof v === 'string') return v;                                   // «N.A.», «Art 3.2.2.», categorías
    if (typeof v !== 'number' || !isFinite(v)) return 'Error';             // un error nunca se muestra como 0
    if (opts.decimals > 0) {
      const s = Number(v.toPrecision(15)).toFixed(opts.decimals).replace(/\.?0+$/, ''), neg = s[0] === '-', [i, d] = s.replace('-', '').split('.');
      return (neg ? '-' : '') + group(i) + (d ? ',' + d : '');
    }
    const r = roundHalfAway(v);
    return (r < 0 ? '-' : '') + group(Math.abs(r));
  }
  IMIV.format = { formatResult, group, roundHalfAway };
})(typeof window !== 'undefined' ? window : globalThis);
