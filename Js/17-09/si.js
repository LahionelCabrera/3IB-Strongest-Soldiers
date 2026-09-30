var statoattuale = 0;
var bool = true;//variabile per pausa/avvio
var tempo;

let vento=false; //variabile per vento

const fiocchi_num = document.getElementById("fiocchi");
const vento_num = document.getElementById("vento"); //slider vento

let max_fiocchi = parseInt(fiocchi_num.value);
let min_fiocchi = parseInt(fiocchi_num.min);

let max_fiocchi_dim = 20;
let min_fiocchi_dim = 2;

larg=window.innerWidth; //larghezza finestra
alt=window.innerHeight; //altezza finestra

const btn_pa = document.getElementById("btn-pa"); //pausa/avvio
const btn_l = document.getElementById("btn-l"); //immagine precedente
const btn_r = document.getElementById("btn-r"); //immagine successiva
const btn_f = document.getElementById("btn-f"); //fiocchi
const btn_s = document.getElementById("btn-s"); //sole
const btn_v = document.getElementById("btn-v"); //vento

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

fiocchi_num.addEventListener("input", () => {
    max_fiocchi = parseInt(fiocchi_num.value);
    document.getElementById("max-fiocchi").innerText = max_fiocchi;
});
vento_num.addEventListener("input", () => {
    document.getElementById("max-vento").innerText = vento_num.value;
});

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
        document.querySelector("p").style.color = "white";
        document.querySelectorAll("label").forEach(l => l.style.color = "white");}
    else{
        document.querySelector("h1").style.color = "black";
        document.querySelector("p").style.color = "black";
        document.querySelectorAll("label").forEach(l => l.style.color = "black");}

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
        //fiocco.style.top=random_num(0, alt)+"px"; //posizione verticale casuale

        fiocco.classList.add("fiocco"); //classe fiocco

        fiocco.style.width=random_num(min_fiocchi_dim, max_fiocchi_dim)+"px"; //dimensione casuale
        fiocco.style.height=fiocco.style.width; //dimensione uguale/quadrata
        

        const durata = 7 + 20-parseInt(fiocco.style.width);  //caduta diversa in base alla grandezzza
        const ritardo = Math.floor(Math.random() * 8);      //ritardo di partenza 

        //Inietta i valori casuali nelle variabili CSS del fiocco
        fiocco.style.setProperty('--durata', `${durata}s`);
        fiocco.style.setProperty('--ritardo', `${ritardo}s`);


        document.body.appendChild(fiocco);

    }
    arr_fiocchi=document.querySelectorAll(".fiocco"); //seleziona tutti i fiocchi creati
}

//spawna fiocchi
btn_f.addEventListener('click', create_fiocchi);

//elimina fiocchi con sole
btn_s.addEventListener('click', () => {
    arr_fiocchi.forEach(f => {
        //aumenta l'opacità pian piano per farla sparire in 3 secondi
        //dice che se l'attributo opacity cambia va fatto gradualmente in 3 secondi
        f.style.transition = "opacity 3s ease";
        
        //opacità a 0 per farlo sparire
        f.style.opacity = "0";

        //rimuovi l'elemento dal DOM solo dopo che si è sciolto
        setTimeout(() => {
            f.remove();

        }, 3000);
    });
});

//effetto del vento su ogni fiocco
btn_v.addEventListener('click', () => {
    vento = !vento; //attiva/disattiva il vento
    const vento_val = vento_num.value*5;

    if(vento) 
        arr_fiocchi.forEach(f => {
            f.style.setProperty('--vento', `${vento_val-parseInt(f.style.width)*8}px`);
        });
    else
        
        arr_fiocchi.forEach(f => {
            f.style.setProperty('--vento', `0px`);
        });
});

