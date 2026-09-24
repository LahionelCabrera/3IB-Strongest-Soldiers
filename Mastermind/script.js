const tuttiColori = ["Rosso", "Giallo", "Verde", "Blu", "Nero", "Bianco"];
let coloriAttivi = [];
let codiceSegreto = [];
let tentativiRimasti = 10;
let giocoFinito = false;

function impostaDifficolta() {
    let diff = document.getElementById("difficolta").value;
    if (diff === "facile") {
        coloriAttivi = tuttiColori.slice(0, 4);
        tentativiRimasti = 12;
    } else if (diff === "normale") {
        coloriAttivi = tuttiColori.slice(0, 5);
        tentativiRimasti = 10;
    } else {
        coloriAttivi = tuttiColori.slice(0, 6);
        tentativiRimasti = 8;
    }
}

function aggiornaSelettori() {
    let ids = ["p1", "p2", "p3", "p4"];
    for (let id of ids) {
        let select = document.getElementById(id);
        select.innerHTML = "";
        for (let colore of coloriAttivi) {
            let opt = document.createElement("option");
            opt.value = colore;
            opt.innerText = colore;
            select.appendChild(opt);
        }
    }
    document.getElementById("infoColori").innerText = "Colori disponibili: " + coloriAttivi.join(", ");
}

function generaCodice() {
    codiceSegreto = [];
    for (let i = 0; i < 4; i++) {
        let indice = Math.floor(Math.random() * coloriAttivi.length);
        codiceSegreto.push(coloriAttivi[indice]);
    }
}

function nuovaPartita() {
    impostaDifficolta();
    aggiornaSelettori();
    generaCodice();
    giocoFinito = false;
    document.getElementById("storico").innerHTML = "";
    document.getElementById("messaggio").innerText = `Nuova partita iniziata. Hai ${tentativiRimasti} tentativi!`;
    document.getElementById("btnInvia").disabled = false;
}

function tentativo() {
    if (giocoFinito) return;

    let c1 = document.getElementById("p1").value;
    let c2 = document.getElementById("p2").value;
    let c3 = document.getElementById("p3").value;
    let c4 = document.getElementById("p4").value;
    
    let tentativoUtente = [c1, c2, c3, c4];
    
    let neri = 0;
    let bianchi = 0;
    
    let segretoCopia = [...codiceSegreto];
    let utenteCopia = [...tentativoUtente];

    for (let i = 0; i < 4; i++) {
        if (utenteCopia[i] === segretoCopia[i]) {
            neri++;
            segretoCopia[i] = null;
            utenteCopia[i] = null;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (utenteCopia[i] !== null) {
            let indiceInSegreto = segretoCopia.indexOf(utenteCopia[i]);
            if (indiceInSegreto !== -1) {
                bianchi++;
                segretoCopia[indiceInSegreto] = null;
            }
        }
    }

    tentativiRimasti--;

    let storicoDiv = document.getElementById("storico");
    let nuovaRiga = document.createElement("div");
    nuovaRiga.className = "riga-tentativo";
    nuovaRiga.innerText = `Tentativo: ${tentativoUtente.join(", ")} | Neri: ${neri}, Bianchi: ${bianchi}`;
    storicoDiv.appendChild(nuovaRiga);

    if (neri === 4) {
        document.getElementById("messaggio").innerText = "Complimenti! Hai indovinato il codice!";
        document.getElementById("btnInvia").disabled = true;
        giocoFinito = true;
    } else if (tentativiRimasti === 0) {
        document.getElementById("messaggio").innerText = `Hai perso! Il codice era: ${codiceSegreto.join(", ")}`;
        document.getElementById("btnInvia").disabled = true;
        giocoFinito = true;
    } else {
        document.getElementById("messaggio").innerText = `Tentativi rimasti: ${tentativiRimasti}`;
    }
}

window.onload = nuovaPartita;