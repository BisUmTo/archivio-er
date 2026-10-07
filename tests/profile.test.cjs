const assert=require('node:assert/strict'),P=require('../dist/profile.js');
const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
assert.throws(()=>P.choose(storage,'  ','5 liceo','archivio'));
const a=P.choose(storage,'  Ada   Test  ','','archivio');assert.equal(a.name,'Ada Test');assert.equal(a.classe,'5 liceo');
const b=P.choose(storage,'Ada Test','5 liceo','accademico');assert.equal(a.id,b.id);assert.deepEqual(P.keys(a),P.keys(b));assert.equal(P.current(storage).theme,'accademico');
const snapshot=P.snapshot(b);P.choose(storage,'Altro Studente','4 liceo','archivio');assert.equal(snapshot.name,'Ada Test');assert.notDeepEqual(P.keys(P.current(storage)),P.keys(a));
map.set('traccia-er-v3-learning','{"current":"biblioteca"}');map.set('traccia-er-v3-game','{"log":[{"kind":"old"}]}');P.adoptLegacy(storage,a);assert.equal(map.get(P.keys(a).learning),'{"current":"biblioteca"}');const c=P.current(storage);P.adoptLegacy(storage,c);assert.equal(map.has(P.keys(c).learning),false);assert.equal(JSON.parse(map.get(P.keys(a).game)).log[0].student,undefined);
assert.throws(()=>P.choose(storage,'Ada','5 liceo','bad'));assert.deepEqual(P.read({getItem(){throw Error()}}),{students:[],active:null});
console.log('Profile tests: theme parity, student isolation, default class, immutable identity snapshot, legacy anonymous history passed');
