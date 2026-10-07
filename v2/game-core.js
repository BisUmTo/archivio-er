(function(root){
 function fresh(){return {energy:3,errors:0,hints:0,combo:0,bestCombo:0,points:0,rewarded:[],boss:null,bossPassed:false,startedAt:Date.now()};}
 function verify(run,key,ok,assisted){if(!ok){run.errors++;run.combo=0;run.energy=Math.max(0,run.energy-1);return 0;}if(run.rewarded.includes(key))return 0;run.rewarded.push(key);run.combo=assisted?0:run.combo+1;run.bestCombo=Math.max(run.combo,run.bestCombo);run.energy=Math.min(3,run.energy+1);const gain=assisted?30:100+Math.min(3,run.combo-1)*20;run.points+=gain;return gain;}
 function stars(run,assisted){return assisted?1:run.errors||run.hints?2:3;}
 function finish(run,best,assisted){const next={points:run.points,stars:stars(run,assisted),bestCombo:run.bestCombo};return {points:Math.max(best?.points||0,next.points),stars:Math.max(best?.stars||0,next.stars),bestCombo:Math.max(best?.bestCombo||0,next.bestCombo)};}
// Keep the best XP reached in each department, including unfinished attempts.
 function xpRecords(game){const records={};for(const id of new Set([...Object.keys(game.xpRecords||{}),...Object.keys(game.best||{}),...Object.keys(game.runs||{})]))records[id]=Math.max(0,Number(game.xpRecords?.[id])||0,Number(game.best?.[id]?.points)||0,Number(game.runs?.[id]?.points)||0);return records;}
 function totalXP(game){return Object.values(xpRecords(game)).reduce((a,b)=>a+b,0);}
const faults={
 biblioteca:{table:'Libri',col:'CodCategoria',prop:'unique',bad:true,story:'Due libri della stessa categoria vengono rifiutati dal sistema. Trova il vincolo che blocca la seconda riga.',hint:'Molti libri possono condividere la stessa categoria: quella FK può ripetersi.'},
 tessere:{table:'Tessere',col:'CodSocio',prop:'unique',bad:false,story:'Il sistema ha assegnato due tessere allo stesso socio. Deve essercene al massimo una.',hint:'Una FK controlla il riferimento. Serve anche UNIQUE per impedire due tessere dello stesso socio.'},
 musica:{table:'Partecipazioni',col:'Ruolo',prop:'pk',bad:true,story:'La stessa coppia artista–brano è stata registrata due volte con ruoli diversi. La traccia ammette una sola partecipazione per coppia.',hint:'La coppia artista–brano deve bastare a identificare la partecipazione. Ruolo è descrittivo.'},
 ordini:{table:'RigheOrdine',col:'NumeroRiga',prop:'unique',bad:true,story:'L’ordine O2 non può avere una riga 1 perché esiste già la riga 1 dell’ordine O1. Ripara lo schema.',hint:'È univoca la coppia CodOrdine + NumeroRiga. Il numero locale può ripetersi in ordini diversi.'},
 ricette:{table:'Composizioni',col:'CodComponente',prop:'fk',bad:'',story:'Una composizione accetta come componente una ricetta inesistente. Un collegamento si è staccato.',hint:'Entrambi i ruoli devono riferire Ricette.CodRicetta.'},
 riviste:{table:'Articoli',col:'CodRivista',prop:'unique',bad:true,story:'L’archivio accetta un solo articolo per rivista. Il secondo viene rifiutato.',hint:'Una rivista pubblica molti articoli: il suo codice deve potersi ripetere in Articoli.'}
};
 const API={fresh,verify,stars,finish,xpRecords,totalXP,faults};if(typeof module!=='undefined')module.exports=API;root.GameCore=API;
})(typeof window!=='undefined'?window:globalThis);
