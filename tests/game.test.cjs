const assert=require('node:assert/strict'),G=require('../dist/v2/game-core.js');
let r=G.fresh();assert.equal(G.verify(r,'0',true,false),100);assert.equal(G.verify(r,'0',true,false),0);assert.equal(G.verify(r,'1',true,false),120);assert.equal(r.combo,2);G.verify(r,'2',false,false);assert.equal(r.combo,0);assert.equal(r.energy,2);G.verify(r,'2',true,true);assert.equal(r.points,250);assert.equal(G.stars(r,1),1);assert.equal(G.stars(r,0),2);r=G.fresh();for(let i=0;i<6;i++)G.verify(r,String(i),true,false);assert.equal(G.stars(r,0),3);const best=G.finish(r,null,0);assert.equal(best.points,840);r.hints++;assert.equal(G.stars(r,0),2);assert.equal(G.finish(r,best,0).stars,3);for(let i=0;i<6;i++)G.verify(r,'0',false,false);assert.equal(r.energy,0);assert.equal(G.finish(G.fresh(),best,1).points,840);console.log('Game checks passed: rewards, no repeated XP, combo, energy, help, stars, personal best.');
const fs=require('node:fs'),vm=require('node:vm'),ER=require('../dist/engine.js'),ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/data.js','utf8')+';this.cases=cases;',ctx);
for(const c of ctx.cases){const s=ER.empty(c);ER.solve(c,s,3);const f=G.faults[c.id],correct=s.tables[f.table][f.col][f.prop];s.tables[f.table][f.col][f.prop]=f.bad;assert.equal(ER.check(c,s,3).ok,false,c.id+' fault must fail');s.tables[f.table][f.col][f.prop]=correct;assert.equal(ER.check(c,s,3).ok,true,c.id+' repair must pass');}console.log('All six final faults rejected and all six repairs accepted.');
// Live XP migrates old progress, survives retries, and never double-counts a finish.
const progress={best:{biblioteca:{points:610}},runs:{tessere:G.fresh()}};
G.verify(progress.runs.tessere,'0',true,false);assert.equal(G.totalXP(progress),710);
G.verify(progress.runs.tessere,'1',true,false);assert.equal(G.totalXP(progress),830);
progress.xpRecords=G.xpRecords(progress);progress.runs.tessere=G.fresh();assert.equal(G.totalXP(progress),830);
G.verify(progress.runs.tessere,'0',true,false);assert.equal(G.totalXP(progress),830);
G.verify(progress.runs.tessere,'1',true,false);G.verify(progress.runs.tessere,'2',true,false);assert.equal(G.totalXP(progress),970);
progress.best.tessere=G.finish(progress.runs.tessere,null,false);assert.equal(G.totalXP(progress),970);
assert.equal(G.totalXP(JSON.parse(JSON.stringify(progress))),970);
console.log('Live XP checks passed: migration, instant rewards, reset, replay, completion, reload.');
