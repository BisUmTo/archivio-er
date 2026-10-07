const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('dist/data.js','utf8')+'\nthis.cases=cases;',context);
const ER=require('../dist/engine.js');let checks=0;
function ok(v,msg){assert(v,msg);checks++;}
for(const c of context.cases){const s=ER.empty(c);for(let step=0;step<5;step++){ok(!ER.check(c,s,step).ok,`${c.id} empty step ${step} must fail`);ER.solve(c,s,step);ok(ER.check(c,s,step).ok,`${c.id} correct step ${step} must pass`);}const t=c.tables[0];delete s.tables[t.name][t.cols[0].name];ok(!ER.check(c,s,3).ok,`${c.id} missing identifier`);}
function solved(id){const c=context.cases.find(c=>c.id===id),s=ER.empty(c);for(let i=0;i<5;i++)ER.solve(c,s,i);return [c,s];}
{
 const [c,s]=solved('biblioteca');s.relations.appartiene.a='0,N';ok(!ER.check(c,s,2).ok,'Reject reversed cardinality');ER.solve(c,s,2);s.tables.Libri.CodCategoria.unique=true;ok(!ER.check(c,s,3).ok,'Reject FK uniqueness for 1:N');s.tables.Libri.CodCategoria.unique=false;s.tables.Libri.CodCategoria.required=false;ok(!ER.check(c,s,3).ok,'Reject missing NOT NULL');
}
{
 const [c,s]=solved('tessere');s.tables.Tessere.CodSocio.unique=false;ok(!ER.check(c,s,3).ok,'Require uniqueness for 1:1');
}
{
 const [c,s]=solved('ordini');s.tables.RigheOrdine.NumeroRiga.unique=true;ok(!ER.check(c,s,3).ok,'Reject individual UNIQUE on partial key');s.tables.RigheOrdine.NumeroRiga.unique=false;s.tables.RigheOrdine.CodOrdine.pk=false;ok(!ER.check(c,s,3).ok,'Require parent identifier in weak entity PK');
}
{
 const [c,s]=solved('musica');delete s.tables.Partecipazioni;ok(!ER.check(c,s,3).ok,'Require N:N bridge');
}
{
 const [c,s]=solved('ricette');s.tables.Composizioni.CodComponente.fk='Composizioni.CodComposta';ok(!ER.check(c,s,3).ok,'Recursive FK must reference entity, not bridge');
}
{
 const [c,s]=solved('riviste');s.tables.Pubblicazioni={};ok(!ER.check(c,s,3).ok,'Reject unnecessary 1:N bridge in guided conversion');
}
console.log(`${checks} checks passed across ${context.cases.length} laboratories.`);
for(const c of context.cases){for(const r of c.relations){const v={from:r.from,to:r.to};const card=r.b.split(',')[1]+':'+r.a.split(',')[1];ER.setRelation(v,'cardinality',card);ok(v.a===''&&v.b==='','Participation must remain a separate decision');ER.setRelation(v,'partA',r.a[0]);ER.setRelation(v,'partB',r.b[0]);ok(v.a===r.a&&v.b===r.b,'Cardinality endpoints map to correct participation maxima');const f=ER.relationFields({a:r.a,b:r.b});ok(f.cardinality===card,'Existing progress migration preserves cardinality');}}
console.log(`${checks} learning checks including separated cardinality and participation.`);
for(const c of context.cases){const s=ER.empty(c);ER.solve(c,s,2);for(const r of c.relations){if(r.from===r.to)continue;s.relations[r.id]={from:r.to,to:r.from,a:r.b,b:r.a};ok(ER.check(c,s,2).ok,'Equivalent reversed relation must pass');}}
console.log(`${checks} total teaching checks passed.`);
