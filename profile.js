(function(root){
 const KEY='officina-er-students';
 const normalize=x=>String(x||'').trim().replace(/\s+/g,' ').slice(0,80);
 function read(storage){try{const d=JSON.parse(storage.getItem(KEY)||'null');return d&&Array.isArray(d.students)?d:{students:[],active:null};}catch{return {students:[],active:null};}}
 function current(storage){const d=read(storage);return d.students.find(p=>p.id===d.active)||null;}
 function choose(storage,name,classe,theme){name=normalize(name);classe=normalize(classe)||'5 liceo';if(!name)throw Error('Inserisci il tuo nome.');if(!['archivio','accademico'].includes(theme))throw Error('Scegli una versione.');const d=read(storage);let p=d.students.find(x=>x.name.toLocaleLowerCase('it')===name.toLocaleLowerCase('it')&&x.classe.toLocaleLowerCase('it')===classe.toLocaleLowerCase('it'));if(!p){p={id:root.crypto?.randomUUID?.()||'s-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),name,classe,theme};d.students.push(p);}p.theme=theme;d.active=p.id;storage.setItem(KEY,JSON.stringify(d));return {...p};}
 function keys(p){return {learning:'officina-er-'+p.id+'-learning',game:'officina-er-'+p.id+'-game'};}
 function adoptLegacy(storage,p){const marker='officina-er-legacy-adopted',k=keys(p);if(storage.getItem(marker))return;for(const suffix of ['learning','game']){const old=storage.getItem('traccia-er-v3-'+suffix)||storage.getItem('traccia-er-v2-'+suffix);if(old&&!storage.getItem(k[suffix]))storage.setItem(k[suffix],old);}storage.setItem(marker,p.id);}
 function snapshot(p){return p?{id:p.id,name:p.name,classe:p.classe}:null;}
 const api={read,current,choose,keys,adoptLegacy,snapshot,normalize};root.OfficinaProfile=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
