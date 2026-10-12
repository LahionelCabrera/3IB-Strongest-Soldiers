const urlTasso = "./tasso-gerusalemme-liberata.txt"
const urlFind = "https://classe5id.altervista.org/parole/search.php?word="
const urlRandom = "https://classe5id.altervista.org/parole/search.php?random"
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

const p = document.getElementById(parole)