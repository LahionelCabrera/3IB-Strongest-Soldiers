let n=1;
let tempo=3000;
let timer;
let attivo=true;
const immagine=document.getElementById("cervino");

function cambia(){
    n++;
    if (n>4) n=1;
    immagine.src="./src/img/cervino"+n+".jpg";
    
    if (attivo){
        clearTimeout(timer);
        avvia();
    }
}

function avvia(){
    attivo=true;
    timer=setTimeout(function(){
        cambia();
    },tempo);
}

function ferma(){
    attivo=false;
    clearTimeout(timer);
}

immagine.onclick=function(){
    if (attivo){
        ferma();
    }
    else{
        avvia();
    }
};
