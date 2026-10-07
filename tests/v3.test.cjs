const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ER=require('../dist/engine.js'),V3=require('../dist/v3/session.js');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/../dist/data.js','utf8')+';this.cases=cases',ctx);
const storage=new Map([['traccia-er-v2-learning','{"progress":1}'],['traccia-er-v2-game','{"points":220}']]);const api={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
V3.migrate(api);assert.equal(storage.get('traccia-er-v3-learning'),'{"progress":1}');api.setItem('traccia-er-v3-learning','own-progress');V3.migrate(api);assert.equal(storage.get('traccia-er-v3-learning'),'own-progress');assert.equal(storage.get('traccia-er-v2-learning'),'{"progress":1}');assert.doesNotThrow(()=>V3.migrate({getItem(){throw Error('blocked')}}));
for(const c of ctx.cases){const s=ER.empty(c);for(let step=0;step<5;step++){ER.solve(c,s,step);s.step=step;for(const item of V3.items(c,s))assert.equal(V3.checkItem(c,s,item.id,ER).ok,true,c.id+' '+step+' '+item.id);}}
const c=ctx.cases.find(x=>x.id==='ordini'),s=ER.empty(c);ER.solve(c,s,1);s.step=1;s.identifications.riga={kind:'autonomous',owner:''};assert.equal(V3.checkItem(c,s,'riga',ER).ok,false);assert.equal(V3.checkItem(c,s,'ordine',ER).ok,true);assert(!V3.guidance(c,s,'riga',V3.checkItem(c,s,'riga',ER),ER).join(' ').includes('RigaOrdine è debole'));
const before=V3.signature(s,'ordine');s.attrs.ordine.push('2026');assert.notEqual(V3.signature(s,'ordine'),before);assert.equal(V3.checkItem(c,s,'ordine',ER).ok,false);
for(const c of ctx.cases){const s=ER.empty(c);s.step=1;for(const item of V3.items(c,s))assert.equal(V3.checkItem(c,s,item.id,ER).ok,false);ER.solve(c,s,3);s.step=3;const table=c.tables[0].name;s.tables[table]={};assert.equal(V3.checkItem(c,s,table,ER).ok,false);}
console.log('V3: migration isolation, storage denial, all six cases scoped checks, weak parent validation and edit invalidation passed');
