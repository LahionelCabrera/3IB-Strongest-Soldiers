var statoattuale = 0;
var bool = true;
var tempo;

let max_fiocchi = parseInt(document.getElementById("fiocchi").value);
let min_fiocchi = parseInt(document.getElementById("fiocchi").min);

let max_fiocchi_dim = 20;
let min_fiocchi_dim = 2;

larg=window.innerWidth; //larghezza finestra
alt=window.innerHeight; //altezza finestra

const btn_pa = document.getElementById("btn-pa");
const btn_l = document.getElementById("btn-l");
const btn_r = document.getElementById("btn-r");
const btn_f = document.getElementById("btn-f");
// array di immagini
const img_arr = [
    {
        nome: "image1",
        coloreBG: "white",
        tempo: 1000, //milliseconds
    },

    {
        nome: "image2",
        coloreBG: "lightgray",
        tempo: 1500, //milliseconds
    },
    {
        nome: "image3",
        coloreBG: "darkgray",
        tempo: 2000, //milliseconds
    },
    {
        nome: "image4",
        coloreBG: "gray",
        tempo: 2500, //milliseconds
    },
    {
        nome: "image5",
        coloreBG: "black",
        tempo: 3000, //milliseconds
    }
];

let arr_fiocchi;

document.addEventListener('DOMContentLoaded', () => {
    const immagine=img_arr[statoattuale];
    document.getElementById("trulli").src="./img/" + immagine.nome + ".png";
    document.body.style.backgroundColor=immagine.coloreBG;
    
    tempo=setTimeout(cambio, immagine.tempo);
});



document.getElementById("trulli").addEventListener('click', () => {
    bool=!bool;

    if (!bool) 
        clearTimeout(tempo);
    else 
        cambio();
    
});

btn_pa.addEventListener('click', () => {
    bool=!bool;

    if(btn_pa.innerText=="⏸️")
        btn_pa.innerText="▶️";
    else
        btn_pa.innerText="⏸️";
    

    if (!bool) 
        clearTimeout(tempo);
    else 
        cambio();
    
});

btn_l.addEventListener('click', () => {

    if (bool) {
        bool=!bool;
        clearTimeout(tempo);}
    statoattuale--;
    if (statoattuale < 0) {
        statoattuale = img_arr.length - 1;
    }

    const immagine=img_arr[statoattuale];
    document.getElementById("trulli").src="./img/"+immagine.nome+".png";
    document.body.style.backgroundColor=immagine.coloreBG; 
    if (statoattuale == img_arr.length-1){
        document.querySelector("h1").style.color = "white"
        document.querySelector("p").style.color = "white";}
    
});

btn_r.addEventListener('click', () => {

    if (bool) {
        bool=!bool;
        clearTimeout(tempo);}
    cambio();
    
});



function cambio() {
    statoattuale++;
    if (statoattuale >= img_arr.length) {
        statoattuale = 0;
    }

    const immagine=img_arr[statoattuale];
    document.getElementById("trulli").src="./img/"+immagine.nome+".png";
    document.body.style.backgroundColor=immagine.coloreBG;

    if (statoattuale == img_arr.length-1){
        document.querySelector("h1").style.color = "white"
        document.querySelector("p").style.color = "white";}
    else{
        document.querySelector("h1").style.color = "black";
        document.querySelector("p").style.color = "black";}

    if (bool) 
       tempo=setTimeout(cambio, immagine.tempo);
   
}

//------ PARTE FIOCCHI DI NEVE ------

function random_num(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create_fiocchi() {

    let num_fiocchi=random_num(min_fiocchi, max_fiocchi); //numero casuale di fiocchi
    console.log(num_fiocchi);
    console.log(parseInt(document.getElementById("fiocchi").value));
    for (let i=0; i<num_fiocchi; i++) {
        let fiocco=document.createElement("img"); //crea elemento (madonna come cazzo scrive il codice cornali)

        fiocco.src="./fiocchi/fiocco" + String(random_num(1, 5)) + ".png"; //immagine fiocco

        fiocco.style.left=random_num(0, larg)+"px"; //posizione orizzontale casuale
        fiocco.style.top=random_num(0, alt)+"px"; //posizione verticale casuale

        fiocco.id="fiocco"; //id fiocco

        fiocco.style.width=random_num(min_fiocchi_dim, max_fiocchi_dim)+"px"; //dimensione casuale
        fiocco.style.height=fiocco.style.width; //dimensione uguale/quadrata
        document.body.appendChild(fiocco);

    }
    arr_fiocchi=document.querySelectorAll(".fiocco"); //seleziona tutti i fiocchi creati
}
btn_f.addEventListener('click', create_fiocchi);

