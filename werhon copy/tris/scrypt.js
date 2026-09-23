let turno=0;
const celle=document.querySelectorAll(".cella");
const x_punti=document.getElementById("punteggio_X");
const o_punti=document.getElementById("punteggio_O");

let simb = "X";

const info=document.getElementById("info");

info.innerHTML = "Inizio del gioco! turno del giocatore X";

function resetGame(){
    for (let i=0; i<9; i++){
        celle[i].textContent="";
    }
    if (simb === "X") 
        info.innerHTML = "Inizio del gioco!, turno del giocatore X";
    else 
        info.innerHTML = "Inizio del gioco!, turno del giocatore O";
    turno=0;
}

function mossa(cella) {

    if (vittoria()) {
        alert("ATTENZIONE:Il giocatore " + (simb === "X" ? "O" : "X") + " ha vinto!");
        return;
    }

    if (celle[cella].textContent === "") {
        if (simb === "X") {
            celle[cella].textContent = "X";
        } else {
            celle[cella].textContent = "O";
        }
        turno++;
        simb = (simb === "X") ? "O" : "X";
    }

    info.innerHTML = "Turno del giocatore " + (simb === "X" ? "X" : "O");

    if (vittoria()) {
        info.innerHTML = "HA VINTO IL GIOCATORE " + (simb === "X" ? "O" : "X");
        if (simb === "X") 
            o_punti.textContent++;  
        else 
            x_punti.textContent++;
        

        return;
    }

    if (turno === 9) {
        info.innerHTML = "Il gioco è terminato in pareggio!";
    }
}


function vittoria() {

    // Controllo righe
    for (let i = 0; i < 7; i+=3) {
        if (celle[i].textContent !== "" && celle[i].textContent === celle[i + 1].textContent && celle[i].textContent === celle[i + 2].textContent) 
            return true;
        
    }

    // Controllo colonne
    for (let i = 0; i < 3; i++) {
        if (celle[i].textContent !== "" && celle[i].textContent === celle[i + 3].textContent && celle[i].textContent === celle[i + 6].textContent) {
            return true;
        }
    }

    // Controllo diagonali
    if (celle[0].textContent !== "" && celle[0].textContent === celle[4].textContent && celle[0].textContent === celle[8].textContent) {
        return true;
    }
    if (celle[2].textContent !== "" && celle[2].textContent === celle[4].textContent && celle[2].textContent === celle[6].textContent) {
        return true;
    }

    return false;
}

