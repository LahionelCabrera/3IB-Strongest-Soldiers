var statoattuale = 0;
var bool = true;
var tempo;

btn_pa = document.getElementById("btn-pa");
btn_l = document.getElementById("btn-l");
btn_r = document.getElementById("btn-r");

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

document.addEventListener('DOMContentLoaded', () => {
    const immagine=img_arr[statoattuale];
    document.getElementById("trulli").src="./img/" + immagine.nome + ".png";
    document.body.style.backgroundColor=immagine.coloreBG;
    
    // Pianifica il primo cambio rispettando il tempo dell'immagine iniziale
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
