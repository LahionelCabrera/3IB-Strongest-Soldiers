const carta = document.getElementById("card");
const container = document.getElementById("container");

const urlTasso = "./tasso-gerusalemme-liberata.txt"
const urlFind = "https://classe5id.altervista.org/parole/search.php?word="
const urlRandom = "https://classe5id.altervista.org/parole/search.php?random"


for (let i = 0; i < 10; i++) {
    const nuova_carta = carta.cloneNode(true);
    // # = id
    // . = class
    nuova_carta.querySelector(".card-title").innerText  = "iMMAGINE " + i;
    
    
     fetch(urlRandom).then(x => x.text()).then(y => {
        nuova_carta.querySelector(".card-text").innerText =y;
        container.appendChild(nuova_carta);
    });


    
}