const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ER=require('../dist/engine.js'),Graph=require('../dist/diagram.js');const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/data.js','utf8')+';this.cases=cases',ctx);const c=ctx.cases.find(c=>c.id==='ordini'),s=ER.empty(c);ER.solve(c,s,0);s.step=1;
assert.equal(ER.checkIdentifications(c,s).ok,false);assert.equal(Graph.layout(c,s).nodes.some(n=>n.weak),false);
s.identifications={ordine:{kind:'autonomous',owner:''},riga:{kind:'autonomous',owner:''}};assert.equal(ER.checkIdentifications(c,s).ok,false);
s.identifications.riga={kind:'dependent',owner:''};assert.equal(ER.checkIdentifications(c,s).ok,false);assert.equal(Graph.layout(c,s).nodes.find(n=>n.id==='riga').weak,true);
s.identifications.riga.owner='ordine';assert.equal(ER.checkIdentifications(c,s).ok,true);
s.identifications.ordine={kind:'dependent',owner:'riga'};assert.equal(ER.checkIdentifications(c,s).ok,false);assert.equal(Graph.layout(c,s).nodes.find(n=>n.id==='ordine').weak,true);
const legacy=ER.restoreIdentifications(c,ER.empty(c),{passed:[0,1,2]});assert.deepEqual(legacy.identifications,{});
const restored=ER.restoreIdentifications(c,ER.empty(c),{identifications:{riga:{kind:'dependent',owner:'ordine'}}});assert.equal(restored.identifications.riga.owner,'ordine');assert.equal(restored.identifications.ordine,undefined);
for(const c of ctx.cases){const s=ER.empty(c);ER.solve(c,s,1);assert.equal(ER.check(c,s,1).ok,true);delete s.identifications[c.entities[0].id];assert.equal(ER.check(c,s,1).ok,false);}
console.log('Identification checks passed: no default answer or border, autonomous/dependent choices, parent validation, diagram follows student, progress restore, all six solutions.');
