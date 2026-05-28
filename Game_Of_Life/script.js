// variabili globali
var righe = 20;
var colonne = 30;
var griglia = []; // qui salvo se le celle sono vive o morte
var timer = null; // per fermare il gioco
var generazione = 0;
var selezioneAttiva = false;
var statoSelezione = 1; // 1 = attiva celle, 0 = disattiva celle

// quando clicco su crea griglia
function creaGriglia() {
    // prendo i valori dagli input
    righe = document.getElementById("righe").value;
    colonne = document.getElementById("colonne").value;
    
    if (righe < 5) righe = 5;
    if (colonne < 5) colonne = 5;
    if (righe > 50) righe = 50;
    if (colonne > 50) colonne = 50;
    
    document.getElementById("righe").value = righe;
    document.getElementById("colonne").value = colonne;
    
    stop();
    
    // reset
    generazione = 0;
    document.getElementById("generazione").innerHTML = "0";
    

    griglia = [];
    for (var i = 0; i < righe; i++) {
        griglia[i] = [];
        for (var j = 0; j < colonne; j++) {
            griglia[i][j] = 0; // 0 = morto, 1 = vivo
        }
    }
    

    var html = "<table>";
    for (var i = 0; i < righe; i++) {
        html += "<tr>";
        for (var j = 0; j < colonne; j++) {
            html += '<td id="cella-' + i + '-' + j + '" onmousedown="startSelect(event,' + i + ',' + j + ')" onmouseover="dragSelect(event,' + i + ',' + j + ')"></td>';
            
        }

        html += "</tr>";
    }
    html += "</table>";
    
    document.getElementById("griglia").innerHTML = html;
    aggiornaConteggio();
}


function cambioCella(i, j) {
    if (timer != null) return;
    
    if (griglia[i][j] == 0) {
        griglia[i][j] = 1;
    } else {
        griglia[i][j] = 0;
    }
    

    var cella = document.getElementById("cella-" + i + "-" + j);
    if (griglia[i][j] == 1) {
        cella.className = "vivo";
    } else {
        cella.className = "";
    }
    
    aggiornaConteggio();
}

function setCellaSelezionata(i, j, stato) {
    if (griglia[i][j] === stato) return;
    griglia[i][j] = stato;

    var cella = document.getElementById("cella-" + i + "-" + j);
    if (cella != null) {
        cella.className = stato == 1 ? "vivo" : "";
    }

    aggiornaConteggio();
}

function startSelect(event, i, j) {
    if (event.button !== 0) return;
    event.preventDefault();

    selezioneAttiva = true;
    statoSelezione = griglia[i][j] == 1 ? 0 : 1;
    setCellaSelezionata(i, j, statoSelezione);
}

function dragSelect(event, i, j) {
    if (!selezioneAttiva) return;
    event.preventDefault();
    setCellaSelezionata(i, j, statoSelezione);
}

function endSelect() {
    selezioneAttiva = false;
}


function contavicini(i, j) {
    var contatore = 0;
    

    for (var di = -1; di <= 1; di++) {
        for (var dj = -1; dj <= 1; dj++) {
            if (di == 0 && dj == 0) continue;
            
            var ni = i + di;
            var nj = j + dj;

            if (ni < 0) {
                ni = righe - 1;
            } else if (ni >= righe) {
                ni = ni % righe;
            }

            if (nj < 0) {
                nj = colonne - 1;
            } else if (nj >= colonne) {
                nj = nj % colonne;
            }

            if (ni >= 0 && ni < righe && nj >= 0 && nj < colonne) {
                if (griglia[ni][nj] == 1) {
                    contatore++;
                }
            }
        }
    }
    
    return contatore;
}


function passo() {
    var nuovaGriglia = [];
    for (var i = 0; i < righe; i++) {
        nuovaGriglia[i] = [];
        for (var j = 0; j < colonne; j++) {
            nuovaGriglia[i][j] = 0;
        }
    }
    
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            var vicini = contavicini(i, j);
            
            if (griglia[i][j] == 1) {
                // cella viva
                if (vicini == 2 || vicini == 3) {
                    nuovaGriglia[i][j] = 1; // sopravvive
                } else {
                    nuovaGriglia[i][j] = 0; // muore
                }
            } else {
                // cella morta
                if (vicini == 3) {
                    nuovaGriglia[i][j] = 1; // nasce
                } else {
                    nuovaGriglia[i][j] = 0; // resta morta
                }
            }
        }
    }
    
    // aggiorno la griglia
    griglia = nuovaGriglia;
    generazione++;
    document.getElementById("generazione").innerHTML = generazione;
    
    // aggiorno i colori
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            var cella = document.getElementById("cella-" + i + "-" + j);
            if (griglia[i][j] == 1) {
                cella.className = "vivo";
            } else {
                cella.className = "";
            }
        }
    }
    
    aggiornaConteggio();
}


function start() {
    if (timer == null) {
        var velocita = document.getElementById("velocita").value;
        timer = setInterval(passo, velocita);
    }
}

function stop() {
    if (timer != null) {
        clearInterval(timer);
        timer = null;
    }
}

function reset() {
    stop();
    generazione = 0;
    document.getElementById("generazione").innerHTML = "0";
    
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            griglia[i][j] = 0;
        }
    }
    
    // aggiorno i colori
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            var cella = document.getElementById("cella-" + i + "-" + j);
            if (cella != null) {
                cella.className = "";
            }
        }
    }
    
    aggiornaConteggio();
}

// aggiorno il testo delle celle vive
function aggiornaConteggio() {
    var conteggio = 0;
    for (var i = 0; i < righe; i++) {
        for (var j = 0; j < colonne; j++) {
            if (griglia[i][j] == 1) {
                conteggio++;
            }
        }
    }
    document.getElementById("conteggio").innerHTML = conteggio;
}

// aggiorno il testo della velocità slider
document.getElementById("velocita").oninput = function() {
    document.getElementById("velocitaTesto").innerHTML = this.value + "ms";
};

document.addEventListener("mouseup", endSelect);

// creo la griglia iniziale
creaGriglia();