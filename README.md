# Archivio E/R

[Apri il laboratorio](https://bisumto.github.io/archivio-er/)

Un laboratorio di basi di dati per ripassare la progettazione E/R e la conversione al modello relazionale. In italiano, mobile first, interamente frontend.

## Due ambienti, un solo percorso

La homepage chiede il nome dello studente e la classe (predefinita: **5 liceo**). Subito sotto si sceglie:

- **versione tematizzata**: l’archivio illustrato, colori verdi e dorati e Archi, il robot archivista;
- **versione accademica**: un’interfaccia essenziale per concentrarsi sul ripasso.

Entrambe aprono la stessa applicazione V3. Condividono esercizi, verifiche, correzioni, aiuti e progressi dello studente; cambia solo la presentazione. Si torna alla homepage dal nome del progetto nell’intestazione.

## Utilizzo locale

Non sono necessari installazione, build o dipendenze esterne. Dalla cartella del progetto:

```sh
python3 -m http.server 8765 --directory dist
```

Aprire `http://localhost:8765`. Per pubblicare su qualsiasi hosting statico, copiare il contenuto di `dist`. I percorsi sono relativi, compatibili anche con un sottopercorso GitHub Pages.

## Percorso didattico

Sei incarichi: biblioteca, circolo, studio musicale, ordini, ricette ed emeroteca. Ogni incarico comprende entità, attributi e chiavi, associazioni, relazioni e prova del modello, più un errore finale da correggere.

- Le associazioni si individuano prima e si configurano poi attraverso le due regole di lettura: deve/può e un solo/uno o più.
- Lo studente sceglie se l’identificazione di un’entità dipende da un’altra. Il diagramma segue le sue scelte, senza anticipare la risposta.
- Il diagramma dinamico mostra ogni entità una sola volta, cardinalità agli estremi, partecipazione continua/tratteggiata e verso di lettura.
- Le relazioni sono visualizzate come tabelle con gli attributi in intestazione e PK/FK sotto.
- Verifica della scheda corrente, aiuti progressivi e soluzione su richiesta. Gli aiuti non tolgono XP; una verifica già superata non assegna nuovamente punti.
- Su mobile si alternano le viste Esercizio e Schema. Non servono trascinamenti.

Le verifiche seguono le ipotesi esplicite delle tracce e il modello guidato, non tutte le soluzioni concettualmente equivalenti. `{PK}` indica anche la parte locale della chiave di un’entità debole: la chiave completa comprende quella del padre. Minimi sul lato padre, assenza di cicli e altri vincoli non sono garantiti automaticamente dalle sole FK.

## Dati locali

Nome, classe, risposte e registro restano nel `localStorage` del browser. Nessuna chiamata API, analytics, risorsa remota o invio automatico dei dati dello studente. Il normale hosting riceve le richieste dei file statici, senza nome e classe negli URL.

Lo stesso nome e la stessa classe riaprono il medesimo profilo locale. Studenti diversi hanno spazi separati; non è un sistema di autenticazione. Non usare questo dispositivo condiviso come archivio riservato. Cancellare i dati del sito elimina i salvataggi. Cambiare browser, dispositivo o dominio non trasferisce automaticamente i progressi.

Le nuove attività registrano una copia di nome e classe del profilo attivo. Gli export JSON e HTML si scaricano solo su richiesta. Sono dati locali modificabili, non una valutazione certificata.

Al primo ingresso i progressi della precedente V3 (o V2, se manca V3) sono recuperati una sola volta. I vecchi eventi rimangono privi di identità attribuita. Le versioni storiche rimangono accessibili in `classica/` e `v2/`; i due pulsanti principali aprono sempre V3.

## Sorgenti

- `dist/index.html`, `home.css`, `home.js`: ingresso e scelta ambiente.
- `dist/profile.js`: profili, salvataggi separati e recupero dei progressi precedenti.
- `dist/data.js`, `engine.js`: contenuti e validazione condivisi.
- `dist/diagram.js`: disposizione e disegno del grafo E/R.
- `dist/app.js`: componenti e interazioni didattiche condivise.
- `dist/v3/ui.js`, `session.js`, `game.js`: interfaccia, verifiche per scheda, sessione e registro V3.
- `dist/v3/style.css`, `theme-archive.css`: base accademica e tema archivio.

Sfondo e mascotte sono immagini originali generate per il progetto. Il font Fredoka è distribuito con licenza SIL OFL, inclusa in `dist/v2/assets/Fredoka-OFL.txt`.

## Verifiche

Con Node.js:

```sh
node --test tests/*.test.cjs
```

Le suite controllano tutte le tracce, gli errori didattici, il grafo, le regole di lettura, le entità deboli, le verifiche per scheda, XP, profili, parità dei salvataggi fra i temi e migrazione dei dati precedenti.
