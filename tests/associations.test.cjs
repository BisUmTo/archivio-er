const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ER=require('../dist/engine.js');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/data.js','utf8')+';this.cases=cases',ctx);
let checks=0;
for(const c of ctx.cases){
 const s=ER.empty(c);assert.equal(ER.checkAssociations(c,s).ok,false);
 s.associationChoices=c.relations.map(r=>r.id);assert.equal(ER.checkAssociations(c,s).ok,true);
 for(const d of c.associationDistractors){s.associationChoices.push(d.id);const result=ER.checkAssociations(c,s);assert.equal(result.ok,false);assert(result.issues.some(x=>x.includes(d.why)));s.associationChoices.pop();checks++;}
 for(const r of c.relations){
  const v={from:r.from,to:r.to};ER.setRelation(v,'partA',r.a[0]);ER.setRelation(v,'maxA',r.a.split(',')[1]);assert.equal(v.a,r.a);assert.equal(v.b,'');
  const d=ER.diagramRelation(r,v);assert.equal(d.bottom,r.a.split(',')[1]);assert.equal(d.top,'');
  ER.setRelation(v,'maxB',r.b.split(',')[1]);ER.setRelation(v,'partB',r.b[0]);s.relations[r.id]=v;assert.equal(v.b,r.b);assert.equal(v.cardinality,r.b.split(',')[1]+':'+r.a.split(',')[1]);checks++;
 }
 assert.equal(ER.check(c,s,2).ok,true);
 const legacy={relations:s.relations,passed:[0,1,2]},restored=ER.restoreAssociations(c,ER.empty(c),legacy);assert.equal(restored.associationsConfirmed,true);assert.equal(ER.checkAssociations(c,restored).ok,true);
 const blank=ER.restoreAssociations(c,ER.empty(c),{relations:{},passed:[0,1]});assert.equal(blank.associationsConfirmed,false);assert.equal(blank.associationChoices.length,0);
 const saved=ER.restoreAssociations(c,ER.empty(c),{associationChoices:[c.associationDistractors[0].id],associationsConfirmed:true});assert.equal(saved.associationsConfirmed,false);
}
const v={a:'0,N',b:'1,1'};ER.setRelation(v,'maxA','1');assert.equal(v.a,'0,1');assert.equal(v.b,'1,1');ER.setRelation(v,'partA','');assert.equal(v.a,'');assert.equal(ER.relationFields(v).maxA,'1');assert.equal(ER.diagramRelation({from:'a',to:'b'},v).bottom,'1');
console.log(`${checks} association-choice and reading-rule cases passed; legacy, partial and new progress preserved.`);
