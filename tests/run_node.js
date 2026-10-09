// Ejecuta todas las pruebas en Node (sin navegador):  node tests/run_node.js
const path = require('path'), r = f => require(path.join(__dirname, '..', f));
['js/data/inputsSchema.js','js/data/mappings.js','js/data/rates.js','js/data/testCases.js','js/calculations/common.js','js/calculations/simpleTemplates.js','js/calculations/residential.js','js/calculations/education.js','js/calculations/commerce.js','js/calculations/ports.js','js/calculations/terminalNoPassengers.js','js/calculations/consolidation.js','js/calculations/classification.js','js/calculations/runProject.js','js/validation.js','js/state.js','js/trace.js','js/tests.js'].forEach(r);
const T = globalThis.IMIV.tests.runAll(), cnt = {};
for (const t of T) { cnt[t.status] = (cnt[t.status] || 0) + 1; if (t.status !== 'aprobado') console.log(`${t.status.toUpperCase().padEnd(22)} ${t.id}  ${t.title}\n      esperado: ${t.expected}\n      obtenido: ${t.obtained}\n      dif: ${t.diff}  ${t.explanation}`); }
console.log('\n' + T.length + ' pruebas →', JSON.stringify(cnt));
process.exit((cnt.discrepancia || 0) ? 1 : 0);
