const urlTasso = "./tasso-gerusalemme-liberata.txt"
const urlFind = "https://classe5id.altervista.org/parole/search.php?word="
const urlRandom = "https://classe5id.altervista.org/parole/search.php?random" vc  
let parole;
let parole_non = [];
async function accedi(urlTasso) {

    const gerusalemme = await fetch(urlTasso)


    if (gerusalemme.ok) {
        const testo = await gerusalemme.text()
        const testo2 = testo.replace(/\n/g, " ")
        parole = testo2.split(" ")
        console.log(parole[1])
        cerca_tutte();


    }
}

//async aspetta che la funzione finisca prima di continuare con qualunque altra istruzione all'interno della funzione
async function cerca_tutte() {
    for (const p of parole) {
        const find = await fetch(urlFind + p);
        if (find.ok) {
            const result = await find.text();
            if (result == "false")
                parole_non.push(p);
        }
        else
            console.warn("ritardo mentale non funziona un cazzo");

    }

}

// accedi(urlTasso);

//
for (let i = 0; i < 10; i++) {
    //value è l'oggetto restituito da fetch, ed è un ogetto response, quindi per leggere il contenuto bisogna usare i metodi text() o json()
    fetch(urlRandom).then((value) => {
        //per leggere il contenuto di value(una response)utilizzo .text() che restituisce una promise, impiega un po' di tempo per dare il vero text quindi uso then 
        // (che aspetta la fine dell'operazione) per leggere il contenuto
        value.text().then((x) => console.log(x + ":" + i))
    })
}

for (let i = 0; i < 10; i++) {
    //versione compatta, ma meno leggibile, di quella sopra
    fetch(urlRandom).then(x => x.text()).then(y => console.log(y + ":" + i))

    
}



/*localStorage.setItem(chiave, valore)
Cosa fa: Salva un nuovo elemento oppure aggiorna il valore di una chiave esistente se la chiave è già presente. Entrambi gli argomenti vengono convertiti automaticamente in stringhe.   
Esempio:   
JavaScript
localStorage.setItem("tema", "scuro");

2. localStorage.getItem(chiave)
Cosa fa: Legge e restituisce il valore associato alla chiave specificata. Se la chiave non esiste, restituisce null.   
Esempio:   
JavaScript
let temaCorrente = localStorage.getItem("tema");
console.log(temaCorrente); // Stampa "scuro"

3. localStorage.removeItem(chiave)
Cosa fa: Rimuove in modo specifico la chiave indicata e il valore associato dal localStorage. Se la chiave non esiste, non fa nulla.   
Esempio:   
JavaScript
localStorage.removeItem("tema");

4. localStorage.clear()
Cosa fa: Svuota completamente il localStorage del dominio, cancellando tutte le chiavi e i valori salvati in un solo colpo.   
Esempio:   
JavaScript
localStorage.clear();

5. localStorage.key(indice)
Cosa fa: Accetta un numero (indice, partendo da 0) e restituisce il nome della chiave che si trova in quella posizione. Se l'indice è fuori intervallo (es. maggiore o uguale a localStorage.length), restituisce null.
Esempio:   
JavaScript
// Ottiene il nome della prima chiave salvata
let primaChiave = localStorage.key(0); 
console.log(primaChiave);


Poiché localStorage accetta solo stringhe, per salvare un array (così come gli oggetti) devi prima trasformarlo in una stringa JSON usando JSON.stringify(), e poi riconvertirlo in un array quando lo leggi usando JSON.parse().
Ecco come fare passo dopo passo:
1. Salvare un array (JSON.stringify)
Usa JSON.stringify() per convertire l'array in una stringa prima di passarlo a setItem.
JavaScript
const colori = ["rosso", "verde", "blu"];

// Salvataggio nel localStorage
localStorage.setItem("mieiColori", JSON.stringify(colori));
2. Leggere un array (JSON.parse)
Quando recuperi il dato con getItem, sarà una stringa. Devi riconvertirlo in array con JSON.parse().
JavaScript
// Lettura e conversione in array
const coloriSalvati = JSON.parse(localStorage.getItem("mieiColori"));

console.log(coloriSalvati); // Stampa l'array: ["rosso", "verde", "blu"]
console.log(coloriSalvati[1]); // Stampa "verde"
3. Aggiungere elementi a un array già salvato
Se vuoi aggiungere un nuovo elemento a un array che è già nel localStorage, il flusso corretto è:
Leggere l'array esistente (se non esiste, gestisci il caso con un array vuoto []).
Modificarlo (es. con .push()).
Salvarlo di nuovo nel localStorage.
JavaScript
// 1. Recupera l'array esistente (o creane uno vuoto se non esiste ancora)
let preferiti = JSON.parse(localStorage.getItem("preferiti")) || [];

// 2. Aggiungi il nuovo elemento
preferiti.push("Articolo 1");

// 3. Salva di nuovo l'array aggiornato
localStorage.setItem("preferiti", JSON.stringify(preferiti));
*/