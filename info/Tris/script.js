let testoMessaggio = document.getElementById("messaggio");
let testoTimer = document.getElementById("timer");
let bottoneReset = document.getElementById("bottoneReset");

let tutteLeCelle = document.querySelectorAll(".cella"); 

let turnoDi = "X";
let giocoFinito = false;
let mosseFatte = 0;
let statoTabellone = ["", "", "", "", "", "", "", "", ""];


let secondi = 0;
setInterval(function() {
    secondi++;
    testoTimer.innerText = secondi; 
}, 1000); // in pratica ogni 1000ms cambia il testo (boh c'è poco da spiegare)

//funzione onclick
function faiMossa(indiceCella) {

    if (giocoFinito == true || statoTabellone[indiceCella] != "") {
        return; // non fare nulla
    }

    
    statoTabellone[indiceCella] = turnoDi;
   
    tutteLeCelle[indiceCella].innerText = turnoDi;
    
    if(turnoDi === "X") {
        tutteLeCelle[indiceCella].style.color = "blue";
    } else {
        tutteLeCelle[indiceCella].style.color = "green";
    }

    mosseFatte++;
    controllaVittoria();

    // Cambio turno
    if (giocoFinito == false) {
        if (turnoDi == "X") {
            turnoDi = "O";
        } else {
            turnoDi = "X";
        }
        testoMessaggio.innerText = "Tocca al giocatore " + turnoDi;
    }
}

// Funzione per controllare chi vince (grazie chat)
function controllaVittoria() {
    // Tutte le combinazioni vincenti (righe, colonne, diagonali)
    const combinazioniVincita = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // righe
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonne
        [0, 4, 8], [2, 4, 6]             // diagonali
    ];

    for (let i = 0; i < combinazioniVincita.length; i++) {
        let comb = combinazioniVincita[i];
        let a = statoTabellone[comb[0]];
        let b = statoTabellone[comb[1]];
        let c = statoTabellone[comb[2]];

        if (a != "" && a == b && b == c) {
            testoMessaggio.innerText = "VITTORIA del giocatore: " + a;
            giocoFinito = true;
            return; // esce dalla funzione
        }
    }

    // Se arriviamo a 9 mosse e nessuno ha vinto, è pareggio
    if (mosseFatte == 9) {
        testoMessaggio.innerText = "PAREGGIO! Siete scarsi entrambi.";
        giocoFinito = true;
    }
}

// El boton
bottoneReset.addEventListener("click",
function() {
    // Ripristino todo
    statoTabellone = ["", "", "", "", "", "", "", "", ""];
    turnoDi = "X";
    giocoFinito = false;
    mosseFatte = 0;
    testoMessaggio.innerText = "Tocca al giocatore X";
    secondi = 0;

    // Puliamo tutte le celle con un ciclo
    for (let i = 0; i < tutteLeCelle.length; i++) {
        tutteLeCelle[i].innerText = "";
    }
});
