(function(root){
 function migrate(storage){try{if(storage.getItem('traccia-er-v3-migrated'))return;for(const suffix of ['learning','game']){const to='traccia-er-v3-'+suffix,from='traccia-er-v2-'+suffix;if(!storage.getItem(to)&&storage.getItem(from))storage.setItem(to,storage.getItem(from));}storage.setItem('traccia-er-v3-migrated','1');}catch{}}
 function items(c,s){if(s.step===1)return c.entities.map(e=>({id:e.id,name:e.name}));if(s.step===2&&s.associationsConfirmed)return c.relations.filter(r=>s.associationChoices.includes(r.id)).map(r=>({id:r.id,name:r.verb}));if(s.step===3)return Object.keys(s.tables).map(n=>({id:n,name:n}));if(s.step===4)return c.questions.map((q,i)=>({id:String(i),name:'Domanda '+(i+1)}));return [];}
 function signature(s,id){return JSON.stringify(s.step===1?[s.attrs[id],s.keys[id],s.identifications[id]]:s.step===2?s.relations[id]:s.step===3?s.tables[id]:s.quiz[id]);}
 function checkItem(c,s,id,ER){let cc=c,ss=s;
 if(s.step===1){const prefix=c.entities.find(e=>e.id===id).name+':';const issues=ER.check(c,s,1).issues.filter(x=>x.startsWith(prefix));return {ok:!issues.length,issues};}
 if(s.step===2){cc={...c,relations:c.relations.filter(r=>r.id===id)};ss={...s,associationChoices:[id]};}
 if(s.step===3){cc={...c,tables:c.tables.filter(t=>t.name===id)};ss={...s,tables:{[id]:s.tables[id]}};}
 if(s.step===4){cc={...c,questions:[c.questions[Number(id)]]};ss={...s,quiz:{0:s.quiz[id]}};}
 return ER.check(cc,ss,s.step);
 }
 // A first check locates the problem; an explicit hint provides the reasoning.
 function guidance(c,s,id,result,ER){if(result.ok)return [];const out=[];const add=x=>out.push(x);
 if(s.step===0)return ['Rileggi quali oggetti hanno una propria identità: manca un’entità oppure hai incluso una proprietà o un esempio.'];
 if(s.step===1){const e=c.entities.find(e=>e.id===id),v=s.identifications[id];if(!ER.same(s.attrs[id]||[],c.attrs[id]))add('Rivedi gli attributi: seleziona solo le proprietà richieste per questa entità, senza valori di esempio o elenchi.');if(!ER.same(s.keys[id]||[],e.key))add('Rivedi la PK: quali attributi distinguono un’istanza dalle altre? Segna anche l’eventuale parte locale di una chiave composta.');if(!v?.kind)add('Scegli come si identifica l’entità.');else if((v.kind==='dependent')!==!!e.weak||e.weak&&v.owner!==c.identifyingParents[e.id])add('Rivedi l’identificazione: la chiave scelta basta in tutto l’archivio o serve anche un’altra entità?');}
 else if(s.step===2){const v=s.relations[id]||{};if(!v.from||!v.to)add('Scegli le due entità che partecipano all’associazione.');else add('Rileggi l’associazione nei due versi: controlla le entità, «deve / può» e il numero massimo per una singola istanza.');}
 else if(s.step===3){if(!c.tables.some(t=>t.name===id))add('Questa relazione è necessaria? Rivedi le entità e le regole di conversione.');else{const missing=result.issues.some(x=>x.includes('manca '));if(missing)add('Mancano colonne. Controlla gli attributi e come vengono conservate le associazioni.');for(const n of Object.keys(s.tables[id]||{})){if(result.issues.some(x=>x.startsWith(id+'.'+n+':')))add(n+': rivedi appartenenza alla relazione, PK, destinazione FK e vincoli.');}}}
 else if(s.step===4)add('Questa risposta non rispetta tutti i vincoli. Confronta il caso concreto con il tuo schema.');
 return out.length?out:['Rivedi le scelte alla luce della traccia.'];}
 const api={migrate,items,signature,checkItem,guidance};if(typeof module!=='undefined')module.exports=api;root.V3Session=api;
})(typeof window!=='undefined'?window:globalThis);
