/* Contesti e dati didattici inventati. Convenzione min-max: la coppia accanto
   a un'entità descrive la partecipazione di una sua istanza. */
const field=(id,label,why='')=>({id,label,why});
const entity=(id,name,attrs,key,why,weak=false)=>({id,name,attrs,key,why,weak});
const column=(name,pk=false,fk='',required=false,unique=false)=>({name,pk,fk,required,unique});
const table=(name,cols)=>({name,cols});
const rel=(id,from,to,verb,a,b,why,attr='')=>({id,from,to,verb,a,b,why,attr});
const cases=[{
 id:'biblioteca',title:'La biblioteca di quartiere',short:'Libri e categorie',level:'Fondamenti',type:'1:N',minutes:12,
 intro:'Un piccolo catalogo, le prime scelte. Impara a riconoscere le entità e a collegare le tabelle.',
 prompt:'La biblioteca cataloga i libri per categoria. Ogni libro appartiene a una sola categoria. Una categoria può raccogliere più libri, ma può anche essere vuota. Per ogni libro registriamo codice univoco e titolo; per ogni categoria un codice univoco e il nome. Consideriamo le opere del catalogo, senza copie fisiche né prestiti.',
 entities:[entity('libro','Libro',[field('CodLibro','CodLibro'),field('Titolo','Titolo'),field('Anna','Anna','Anna è un valore, non il nome di un attributo.')],['CodLibro'],'Un libro ha una propria identità e più proprietà.'),entity('categoria','Categoria',[field('CodCategoria','CodCategoria'),field('Nome','Nome'),field('Gialli','Gialli','Gialli è un possibile valore di Nome.')],['CodCategoria'],'Le categorie esistono anche prima di ricevere libri.')],
 distractors:[{id:'titolo',name:'Titolo',why:'Titolo descrive Libro: in questa traccia è un attributo.'},{id:'gialli',name:'Gialli',why:'Gialli è un esempio di categoria, cioè un’istanza.'}],
 attrs:{libro:['CodLibro','Titolo'],categoria:['CodCategoria','Nome']},
 relations:[rel('appartiene','libro','categoria','Appartenere','1,1','0,N','Per UN libro la categoria è una; per UNA categoria i libri sono da zero a molti.')],
 tables:[table('Libri',[column('CodLibro',true),column('Titolo'),column('CodCategoria',false,'Categorie.CodCategoria',true)]),table('Categorie',[column('CodCategoria',true),column('Nome')])],
 trapColumns:['CodLibro','CodCategoria','Titolo','Nome','ListaLibri'],extraTables:['Appartenenze'],
 hints:['Chiediti quali oggetti hanno proprietà proprie e possono avere più esemplari.','Libro e Categoria sono entità. Titolo è una proprietà; Gialli è un esempio concreto.'],
 relationalHint:'Ogni libro conosce una sola categoria: la FK CodCategoria va in Libri, sul lato N. È obbligatoria, ma può ripetersi.',
 questions:[{q:'La categoria C01 non contiene ancora libri. È ammessa?',answers:['Sì, il minimo della categoria è 0.','No, la categoria deve contenere un libro.'],correct:0,why:'La traccia ammette categorie vuote: partecipazione (0,N).'}, {q:'Due libri hanno CodCategoria = C01. È un errore?',answers:['Sì: ogni FK deve essere univoca.','No: molti libri possono appartenere alla stessa categoria.'],correct:1,why:'Una FK può ripetersi. Deve riferire una chiave esistente; qui non serve UNIQUE.'}],
 rule:'Nelle associazioni 1:N, la chiave del lato 1 diventa FK nella tabella del lato N.'
}];
cases.push({
 id:'tessere',title:'Il circolo e le sue tessere',short:'Soci e tessere',level:'Unicità e partecipazione',type:'1:1',minutes:15,
 intro:'Un socio può aspettare la sua tessera. Scopri dove mettere la FK e perché serve UNIQUE.',
 prompt:'Un circolo registra i soci anche prima di emettere la tessera. Ogni socio può avere al massimo una tessera. Ogni tessera appartiene obbligatoriamente a un solo socio. Registriamo codice univoco e nome del socio, numero univoco e data di emissione della tessera. Manteniamo separate le due tabelle e collochiamo la FK in Tessere.',
 entities:[entity('socio','Socio',[field('CodSocio','CodSocio'),field('Nome','Nome'),field('ListaTessere','ListaTessere','Le tessere hanno identità propria e un’associazione con Socio.')],['CodSocio'],'Un socio ha identità e proprietà proprie.'),entity('tessera','Tessera',[field('NumTessera','NumTessera'),field('DataEmissione','DataEmissione'),field('2026','2026','2026 è un valore, non un attributo.')],['NumTessera'],'La tessera ha un proprio numero univoco.')],
 distractors:[{id:'nome',name:'Nome',why:'Nome è un attributo del socio.'},{id:'data',name:'DataEmissione',why:'La data descrive la tessera.'}],attrs:{socio:['CodSocio','Nome'],tessera:['NumTessera','DataEmissione']},
 relations:[rel('possiede','socio','tessera','Possedere','0,1','1,1','Un socio può non avere tessera, ma ne ha al massimo una. Ogni tessera deve avere esattamente un socio.')],
 tables:[table('Soci',[column('CodSocio',true),column('Nome')]),table('Tessere',[column('NumTessera',true),column('DataEmissione'),column('CodSocio',false,'Soci.CodSocio',true,true)])],trapColumns:['ListaTessere'],extraTables:['Possessi'],
 hints:['La possibilità di non avere una tessera riguarda il socio, non la tessera.','Socio e Tessera sono le due entità. Nome e DataEmissione sono proprietà.'],relationalHint:'Tessere.CodSocio riferisce Soci.CodSocio. È obbligatorio perché ogni tessera ha un socio e UNIQUE perché un socio non può avere due tessere.',
 questions:[{q:'Due tessere diverse possono avere lo stesso CodSocio?',answers:['Sì, tutte le FK possono sempre ripetersi.','No, qui UNIQUE conserva l’associazione 1:1.'],correct:1,why:'UNIQUE su Tessere.CodSocio impedisce due tessere per lo stesso socio.'},{q:'Un socio non ha ancora una tessera. Dove si registra?',answers:['In Soci, senza alcuna riga corrispondente in Tessere.','In Tessere, con NumTessera vuoto.'],correct:0,why:'Il socio esiste in Soci. La partecipazione facoltativa si rappresenta con l’assenza della tessera.'}],rule:'In una 1:1, una FK con vincolo UNIQUE limita a uno il numero dei collegamenti.'
});
cases.push({
 id:'musica',title:'In studio con gli artisti',short:'Collaborazioni musicali',level:'Associazioni con attributi',type:'N:N',minutes:18,
 intro:'Un brano, più artisti. La collaborazione ha una proprietà che appartiene al legame.',
 prompt:'Uno studio cataloga artisti e brani. Un artista può partecipare a zero o più brani e ogni brano deve avere almeno un artista. Per ogni artista registriamo codice univoco e nome; per ogni brano codice univoco e titolo. Per ogni coppia artista-brano registriamo un solo ruolo, per esempio voce o chitarra. Il ruolo può cambiare da un brano all’altro.',
 entities:[entity('artista','Artista',[field('CodArtista','CodArtista'),field('Nome','Nome'),field('Ruolo','Ruolo','Il ruolo dipende da artista E brano: è un attributo dell’associazione.')],['CodArtista'],'Gli artisti hanno identità e possono partecipare a diversi brani.'),entity('brano','Brano',[field('CodBrano','CodBrano'),field('Titolo','Titolo'),field('ListaArtisti','ListaArtisti','I singoli artisti si rappresentano con i collegamenti, non con una lista.')],['CodBrano'],'Ogni brano ha codice e titolo propri.')],
 distractors:[{id:'ruolo',name:'Ruolo',why:'Qui è una proprietà della partecipazione, senza identità propria.'},{id:'voce',name:'Voce',why:'Voce è un valore possibile del ruolo.'}],attrs:{artista:['CodArtista','Nome'],brano:['CodBrano','Titolo']},
 relations:[rel('partecipa','artista','brano','Partecipare','0,N','1,N','Un artista può avere zero o molti brani. Un brano ha uno o più artisti.','Ruolo')],
 tables:[table('Artisti',[column('CodArtista',true),column('Nome')]),table('Brani',[column('CodBrano',true),column('Titolo')]),table('Partecipazioni',[column('CodArtista',true,'Artisti.CodArtista'),column('CodBrano',true,'Brani.CodBrano'),column('Ruolo')])],trapColumns:['ListaArtisti'],extraTables:['Ruoli'],
 hints:['Cerca gli oggetti che esistono indipendentemente dalla singola collaborazione.','Le entità sono Artista e Brano. Ruolo descrive il legame tra loro.'],relationalHint:'La N:N richiede Partecipazioni. CodArtista e CodBrano sono entrambi PK e FK; la loro coppia è unica. Ruolo va nella stessa tabella ponte.',
 questions:[{q:'La stessa artista canta in B01 e suona la chitarra in B02. Dove va Ruolo?',answers:['In Artisti, perché è una proprietà della persona.','In Partecipazioni, perché dipende anche dal brano.'],correct:1,why:'Il ruolo descrive una coppia artista-brano, quindi appartiene alla tabella ponte.'},{q:'Le FK di Partecipazioni garantiscono che ogni brano abbia almeno un artista?',answers:['No, serve anche un controllo sul minimo del brano.','Sì, le FK controllano tutti i minimi.'],correct:0,why:'Le FK controllano i riferimenti delle righe presenti, ma non impongono una partecipazione per ogni brano.'}],rule:'Una N:N diventa una tabella ponte. Gli attributi del legame vanno nella tabella ponte.'
});
cases.push({
 id:'ordini',identifyingParents:{riga:'ordine'},title:'Le righe di un ordine',short:'Ordini e righe',level:'Identificazione',type:'E/R',minutes:18,
 intro:'Due ordini possono avere entrambi la riga 1. Costruisci l’identificatore completo.',
 prompt:'Ogni ordine ha un codice univoco e una data. Contiene una o più righe. Ogni riga appartiene a un solo ordine e registra numero progressivo e quantità. Il numero ricomincia da 1 in ogni ordine: è univoco solo all’interno del suo ordine. Non assegniamo un codice autonomo alle righe. Non gestiamo qui i prodotti.',
 entities:[entity('ordine','Ordine',[field('CodOrdine','CodOrdine'),field('DataOrdine','DataOrdine'),field('2026','2026','È un valore possibile, non un attributo.')],['CodOrdine'],'L’ordine ha una propria identità.'),entity('riga','RigaOrdine',[field('NumeroRiga','NumeroRiga'),field('Quantità','Quantità'),field('CodRigaGlobale','CodRigaGlobale','La traccia esclude un identificatore autonomo della riga.')],['NumeroRiga'],'Le righe hanno proprietà proprie. La loro identificazione dipende dall’ordine.',true)],
 distractors:[{id:'quantita',name:'Quantità',why:'La quantità è una proprietà della riga.'},{id:'prodotto',name:'Prodotto',why:'La traccia esclude esplicitamente la gestione dei prodotti.'}],attrs:{ordine:['CodOrdine','DataOrdine'],riga:['NumeroRiga','Quantità']},
 relations:[rel('contiene','ordine','riga','Contenere','1,N','1,1','Ogni ordine deve avere una o più righe. Ogni riga deve appartenere a un solo ordine.')],
 tables:[table('Ordini',[column('CodOrdine',true),column('DataOrdine')]),table('RigheOrdine',[column('CodOrdine',true,'Ordini.CodOrdine'),column('NumeroRiga',true),column('Quantità')])],trapColumns:['CodRigaGlobale'],extraTables:['Contenimenti'],
 hints:['Una riga ha quantità e numero propri, ma il numero da solo non la distingue in tutto l’archivio.','Ordine e RigaOrdine sono entità. RigaOrdine è debole: per identificarla serve anche l’ordine.'],relationalHint:'La PK di RigheOrdine è (CodOrdine, NumeroRiga). CodOrdine è anche FK verso Ordini. Segna PK su entrambe le colonne; nessuna deve essere UNIQUE da sola.',
 questions:[{q:'(O01, 1) e (O02, 1) possono coesistere in RigheOrdine?',answers:['Sì: sono due chiavi composte diverse.','No: NumeroRiga deve essere unico in tutto l’archivio.'],correct:0,why:'Il numero è univoco solo nell’ordine. Cambiando CodOrdine cambia l’identificatore completo.'},{q:'Una partecipazione obbligatoria rende sempre debole un’entità?',answers:['Sì, basta un minimo pari a 1.','No, occorre verificare se l’identificatore dipende da un’altra entità.'],correct:1,why:'L’obbligatorietà è un vincolo di partecipazione. La debolezza identificativa riguarda la chiave completa.'}],rule:'Un’entità debole ha una chiave completa: chiave del padre più identificatore locale.'
});
cases.push({
 id:'ricette',title:'Ricette dentro altre ricette',short:'Associazioni ricorsive',level:'Ruoli e vincoli',type:'Ricorsiva',minutes:18,
 intro:'La stessa ricetta può essere composta o componente. Un’entità, due ruoli.',
 prompt:'Un archivio contiene ricette, ciascuna con codice univoco e nome. Una ricetta può usare zero o più altre ricette come sottopreparazioni; la stessa sottopreparazione può comparire in più ricette. Sono ammesse ricette senza alcun legame. Ogni coppia composta-componente si registra una sola volta. Escludiamo ingredienti e quantità. Non sono ammessi cicli, nemmeno indiretti.',
 entities:[entity('ricetta','Ricetta',[field('CodRicetta','CodRicetta'),field('Nome','Nome'),field('Ingredienti','Ingredienti','Gli ingredienti sono esclusi dalla traccia.')],['CodRicetta'],'Una sottoricetta è sempre una ricetta, usata nel ruolo di componente.')],distractors:[{id:'sottoricetta',name:'Sottoricetta',why:'È un ruolo della stessa entità Ricetta, non un nuovo tipo di oggetto.'},{id:'ingrediente',name:'Ingrediente',why:'Gli ingredienti sono esclusi dal problema.'},{id:'nome',name:'Nome',why:'Nome è una proprietà di Ricetta.'}],attrs:{ricetta:['CodRicetta','Nome']},
 relations:[rel('utilizza','ricetta','ricetta','Utilizzare','0,N','0,N','Una ricetta composta può usare zero o molte ricette; una ricetta componente può comparire in zero o molte ricette.')],
 tables:[table('Ricette',[column('CodRicetta',true),column('Nome')]),table('Composizioni',[column('CodComposta',true,'Ricette.CodRicetta'),column('CodComponente',true,'Ricette.CodRicetta')])],trapColumns:['ListaSottoricette'],extraTables:['Sottoricette'],
 hints:['“Sottoricetta” cambia il tipo di oggetto o solo il ruolo nel collegamento?','Basta Ricetta. L’associazione ricorsiva collega Ricetta a Ricetta con ruoli composta e componente.'],relationalHint:'Composizioni ha due FK verso Ricette.CodRicetta, chiamate CodComposta e CodComponente. La coppia è la PK. Il divieto di cicli richiede un controllo aggiuntivo.',
 questions:[{q:'Perché le due FK della tabella ponte hanno nomi diversi?',answers:['Perché riferiscono due tabelle diverse.','Per distinguere composta e componente, anche se riferiscono la stessa tabella.'],correct:1,why:'Le due FK riferiscono entrambe Ricette, ma rappresentano ruoli diversi.'},{q:'A usa B e B usa A. Basta vietare A usa A per evitare questo caso?',answers:['No: occorre controllare anche i cicli indiretti.','Sì: non c’è nessuna ricetta collegata direttamente a se stessa.'],correct:0,why:'A-B-A è un ciclo indiretto. Il solo confronto tra i due codici della stessa riga non lo rileva.'}],rule:'Un’associazione ricorsiva usa una sola entità in ruoli diversi. In N:N, le due FK riferiscono la stessa tabella.'
});
cases.push({
 id:'riviste',title:'La redazione della rivista',short:'Un modello completo',level:'Sfida finale',type:'1:N + N:N',minutes:25,
 intro:'Metti insieme tutte le regole: pubblicazioni, autori e argomenti nello stesso archivio.',
 prompt:'Ogni articolo compare in una sola rivista e ha almeno un autore e almeno un argomento. Una rivista pubblica più articoli; autori e argomenti possono riguardare più articoli. Censiamo solo riviste, autori e argomenti presenti in almeno un articolo. Per riviste e articoli registriamo codice univoco e titolo; per autori e argomenti codice univoco e nome. Non gestiamo ristampe né singoli fascicoli. Ogni coppia associata compare una sola volta.',
 entities:[
 entity('rivista','Rivista',[
  field('CodRivista','CodRivista'),
  field('ListaArticoli','ListaArticoli','Gli articoli hanno identità propria: collegali alla rivista con Pubblicare, senza conservarli in un elenco dentro Rivista.'),
  field('Titolo','Titolo'),
  field('NumeroArticoli','NumeroArticoli','Il numero di articoli si ricava contando i collegamenti Pubblicare. In questo esercizio non è un dato da memorizzare separatamente.'),
  field('NumeroFascicolo','NumeroFascicolo','Il numero identifica un fascicolo della rivista, non la rivista stessa. La traccia esclude i singoli fascicoli.')
 ],['CodRivista'],'Ogni rivista ha identità e raccoglie articoli.'),
 entity('articolo','Articolo',[
  field('Titolo','Titolo'),
  field('ListaAutori','ListaAutori','Un articolo può avere più autori, ciascuno con la propria identità. Usa l’associazione Scrivere, non un elenco dentro Articolo.'),
  field('TitoloRivista','TitoloRivista','Il titolo della rivista appartiene a Rivista. Pubblicare consente di raggiungerlo: copiarlo in Articolo duplicherebbe lo stesso dato.'),
  field('CodArticolo','CodArticolo'),
  field('ListaArgomenti','ListaArgomenti','Gli argomenti si riusano in più articoli. Rappresentali come entità collegate da Trattare, non come lista in un attributo.')
 ],['CodArticolo'],'Un articolo ha una propria identità, anche se due articoli hanno lo stesso titolo.'),
 entity('autore','Autore',[
  field('CodAutore','CodAutore'),
  field('TitoloArticolo','TitoloArticolo','Il titolo descrive Articolo. Un autore può scrivere articoli diversi: i loro titoli si trovano seguendo l’associazione Scrivere.'),
  field('NumeroArticoli','NumeroArticoli','Il totale si ricava contando gli articoli collegati all’autore. Memorizzarlo anche qui introdurrebbe un dato derivato da mantenere coerente.'),
  field('Nome','Nome'),
  field('NomeRivista','NomeRivista','Una rivista non è una proprietà dell’autore: i suoi articoli possono comparire in riviste diverse. Si raggiungono passando da Articolo.')
 ],['CodAutore'],'Un autore può scrivere più articoli.'),
 entity('argomento','Argomento',[
  field('Nome','Nome'),
  field('CodArticolo','CodArticolo','CodArticolo identifica un articolo, non un argomento. Un argomento può riguardare più articoli: nel modello E/R serve Trattare; nella conversione i codici andranno nella tabella ponte.'),
  field('DescrizioneArticolo','DescrizioneArticolo','Una descrizione dell’articolo riguarderebbe Articolo, non Argomento. Inoltre la traccia richiede solo codice e titolo per gli articoli.'),
  field('CodArgomento','CodArgomento'),
  field('ListaArticoli','ListaArticoli','Gli articoli associati non vanno elencati dentro un attributo. L’associazione Trattare mantiene distinti gli articoli e i loro argomenti.')
 ],['CodArgomento'],'Un argomento può classificare più articoli.')],
 attributeHints:['Per ogni voce chiediti: descrive proprio questa entità? Oppure è un elenco, un conteggio ricavabile o una proprietà di un altro oggetto? Controlla anche ciò che la traccia esclude.','Rileggi quali proprietà richiede la traccia per ciascuna entità. I collegamenti conservano gli oggetti associati; non sostituirli con elenchi o con proprietà copiate. Scegli una chiave che resti univoca anche quando due nomi o titoli coincidono.'],
 distractors:[{id:'fascicolo',name:'Fascicolo',why:'I singoli fascicoli sono esclusi dalla traccia.'},{id:'titolo',name:'Titolo',why:'Titolo descrive riviste e articoli.'}],attrs:{rivista:['CodRivista','Titolo'],articolo:['CodArticolo','Titolo'],autore:['CodAutore','Nome'],argomento:['CodArgomento','Nome']},
 relations:[rel('pubblica','rivista','articolo','Pubblicare','1,N','1,1','Una rivista pubblica uno o più articoli. Ogni articolo compare in una sola rivista.'),rel('scrive','autore','articolo','Scrivere','1,N','1,N','Un autore scrive uno o più articoli. Un articolo ha uno o più autori.'),rel('tratta','articolo','argomento','Trattare','1,N','1,N','Un articolo tratta uno o più argomenti. Ogni argomento compare in uno o più articoli.')],
 tables:[table('Riviste',[column('CodRivista',true),column('Titolo')]),table('Articoli',[column('CodArticolo',true),column('Titolo'),column('CodRivista',false,'Riviste.CodRivista',true)]),table('Autori',[column('CodAutore',true),column('Nome')]),table('Argomenti',[column('CodArgomento',true),column('Nome')]),table('Scritture',[column('CodAutore',true,'Autori.CodAutore'),column('CodArticolo',true,'Articoli.CodArticolo')]),table('Temi',[column('CodArticolo',true,'Articoli.CodArticolo'),column('CodArgomento',true,'Argomenti.CodArgomento')])],trapColumns:['ListaAutori'],extraTables:['Pubblicazioni'],
 hints:['Un elemento riusato da più articoli merita un’identità propria. Rispetta anche le esclusioni della traccia.','Le entità sono Rivista, Articolo, Autore e Argomento. Titolo è un attributo; Fascicolo è fuori dal dominio.'],relationalHint:'Servono quattro tabelle per le entità e due ponti: Scritture e Temi. Per Pubblicare basta CodRivista come FK obbligatoria in Articoli.',
 questions:[{q:'Perché non serve una tabella Pubblicazioni?',answers:['Perché la 1:N si rappresenta con CodRivista in Articoli.','Perché non occorre sapere la rivista di ogni articolo.'],correct:0,why:'Articoli.CodRivista conserva l’associazione N:1, senza tabella aggiuntiva.'},{q:'Un articolo ha due autori e tre argomenti. Quante righe nei due ponti?',answers:['Sei righe in un unico ponte Autore-Argomento.','Due in Scritture e tre in Temi.'],correct:1,why:'Le associazioni sono indipendenti: due coppie autore-articolo e tre coppie articolo-argomento.'}],rule:'Valuta ogni associazione separatamente: una FK per la 1:N, una tabella ponte per ciascuna N:N.'
});

// Reading rules use a natural inverse where an Italian passive does not exist.
const associationLanguage={
 appartiene:['appartenere a','comprendere'],possiede:['possedere','essere posseduta da'],
 partecipa:['partecipare a','prevedere la partecipazione di'],contiene:['contenere','essere contenuta in'],
 utilizza:['utilizzare','essere utilizzata da'],pubblica:['pubblicare','essere pubblicato da'],
 scrive:['scrivere','essere scritto da'],tratta:['trattare','essere trattato in']
};
const entityLanguage={libro:['un solo libro','uno o più libri'],categoria:['una sola categoria','una o più categorie'],socio:['un solo socio','uno o più soci'],tessera:['una sola tessera','una o più tessere'],artista:['un solo artista','uno o più artisti'],brano:['un solo brano','uno o più brani'],ordine:['un solo ordine','uno o più ordini'],riga:['una sola riga d’ordine','una o più righe d’ordine'],ricetta:['una sola ricetta','una o più ricette'],rivista:['una sola rivista','una o più riviste'],articolo:['un solo articolo','uno o più articoli'],autore:['un solo autore','uno o più autori'],argomento:['un solo argomento','uno o più argomenti']};
const associationDistractors={
 biblioteca:[{id:'prestare',verb:'Prestare',why:'La traccia cataloga libri e categorie: non descrive prestiti o lettori.'},{id:'acquistare',verb:'Acquistare',why:'Non sono richiesti acquisti, clienti o transazioni.'}],
 tessere:[{id:'pagare',verb:'Pagare',why:'La traccia riguarda soci e tessere, non quote o pagamenti.'},{id:'prenotare',verb:'Prenotare',why:'Non è descritta alcuna prenotazione.'}],
 musica:[{id:'vendere',verb:'Vendere',why:'Si registrano le partecipazioni artistiche, non le vendite dei brani.'},{id:'ascoltare',verb:'Ascoltare',why:'Non si registrano ascoltatori o ascolti.'}],
 ordini:[{id:'spedire',verb:'Spedire',why:'La traccia descrive ordini e righe, ma non le spedizioni.'},{id:'fatturare',verb:'Fatturare',why:'Non sono richieste fatture o dati di fatturazione.'}],
 ricette:[{id:'valutare',verb:'Valutare',why:'Non si registrano recensioni o valutazioni delle ricette.'},{id:'ordinare',verb:'Ordinare',why:'Non si gestiscono ordinazioni di piatti: si descrive la composizione delle ricette.'}],
 riviste:[{id:'abbonarsi',verb:'Abbonarsi',why:'L’archivio non gestisce lettori o abbonamenti alle riviste.'},{id:'recensire',verb:'Recensire',why:'La traccia classifica gli articoli, ma non registra recensioni di autori o lettori.'},{id:'acquistare',verb:'Acquistare',why:'L’archivio non gestisce acquisti o vendite delle riviste.'}]
};
for(const c of cases){c.associationDistractors=associationDistractors[c.id];for(const r of c.relations)r.reading=associationLanguage[r.id];for(const e of c.entities)e.quantifiers=entityLanguage[e.id];}
