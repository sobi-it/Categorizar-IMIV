// Foto de resultados del motor. Uso: node regress_snapshot.js <carpeta_proyecto> <salida.json>
const path=require('path'),fs=require('fs'),dir=path.resolve(process.argv[2]);
['js/data/inputsSchema.js','js/data/mappings.js','js/data/rates.js','js/data/testCases.js','js/calculations/common.js','js/calculations/simpleTemplates.js','js/calculations/residential.js','js/calculations/education.js','js/calculations/commerce.js','js/calculations/ports.js','js/calculations/terminalNoPassengers.js','js/calculations/consolidation.js','js/calculations/classification.js','js/calculations/runProject.js','js/validation.js','js/state.js','js/trace.js','js/tests.js'].forEach(f=>require(path.join(dir,f)));
const I=globalThis.IMIV,M=I.model,V=I.validation,C=I.calc,out={cases:{},tests:[],round:[],m4:[],trace:{}};
for(const c of I.testCases.cases){const raw=V.defaults();Object.keys(c.inputs).forEach(cell=>{raw[M.cellToId[cell]]=c.inputs[cell]===null?'':String(c.inputs[cell])});
 const p=V.parseInputs(raw,c.mode,{});if(p.messages.some(m=>m.level==='error')){out.cases[c.id]={error:p.messages.map(m=>m.text)};continue}
 const o=C.runProject(p.values);out.cases[c.id]={ent:o.ent,sal:o.sal,tot:o.tot,cls:o.cls,flows:o.flows.map(f=>({ent:f.ent,sal:f.sal})),msgs:p.messages.map(m=>m.text)};
 out.trace[c.id]=I.trace.explain(o,{kind:'tot',k:0,j:0}).map(s=>[s.t,s.ref||'',String(s.v)]);}
out.tests=I.tests.runAll().map(t=>({id:t.id,status:t.status,expected:t.expected,obtained:t.obtained,diff:t.diff}));
out.round=I.testCases.round.map(([x])=>C.excelRound(x));
out.m4=Object.keys(I.testCases.m4).map(k=>{const g=I.testCases.m4[k];return C.classify([[g.priv,g.otros,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])[0]});
fs.writeFileSync(process.argv[3],JSON.stringify(out));console.log(Object.keys(out.cases).length+' casos, '+out.tests.length+' pruebas, '+out.round.length+' redondeos, '+out.m4.length+' umbrales');
