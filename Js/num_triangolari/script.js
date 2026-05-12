const palla = document.getElementById("palla");
const container = document.getElementById("container");
const num = document.getElementById("InputNumero");


function StampaPalle(numero) {
    for (let i = 0; i < numero; i++) {
        const nuovaPalla = document.createElement("div");
        nuovaPalla.classList.add("palla");
        container.appendChild(nuovaPalla);
    }
}
function muoviPalla(ball) {
    // Aggiorna la posizione della palla

 
}

muoviPalla(palla);